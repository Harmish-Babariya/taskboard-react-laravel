<?php

namespace App\Http\Controllers\Api;

use App\Helper\TaskHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\BaseController as BaseController;
use App\Models\TaskPermission;
use App\Models\TaskManagement;
use App\Models\User;
use App\Models\UserRole;
use Validator;
use Hash;
use Config;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class TaskController extends BaseController
{

    function __construct()
    {
        Config::set('jwt.user', User::class);
        Config::set('auth.providers', ['users' => [
            'driver' => 'eloquent',
            'model' => User::class,
        ]]);
    }

    public function get_task_list()
    {
        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        // $token =  $request->bearerToken();
        // $users = JWTAuth::authenticate($token);
        // $user_id = $users->id;
        $user_id = Auth::user()->id;

        $task_data = TaskManagement::where('created_by',$user_id)->get();

        $data = [];
        if (!empty($task_data)) {
            foreach ($task_data as $v_product) {

                $data[] = [
                    'task_id' => $v_product->id,
                    'task_title' => $v_product->task_title,
                ];
            }
        }
        $response['status'] = 200;
        $response['message'] = 'Task List';
        $response['data'] = $data;
        return response($response, 200);
    }
    
    public function add_task(Request $request)
    {
        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        $token =  $request->bearerToken();
        $users = JWTAuth::authenticate($token);
        $user_id = $users->id;

        $validator = Validator::make($request->all(), [
            'task_title' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }

        $check_task = TaskManagement::where('task_title', $request->task_title)->where('created_by', $user_id)->first();
        if (!empty($check_task)) {
            return $this->send_not_foud_error("Task Title Already Exists");
        }

        TaskManagement::create(
            [
                'created_by' => $user_id,
                'task_title' => $request->task_title,
            ]
        );

        return $this->send_response([], 'Task Added successfully');
    }
    
    public function edit_task(Request $request)
    {
        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        $token =  $request->bearerToken();
        $users = JWTAuth::authenticate($token);
        $user_id = $users->id;

        $validator = Validator::make($request->all(), [
            'task_id' => 'required|exists:task_management,id',
            'task_title' => 'required',
        ]);
        
        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }
        $check_permission = TaskHelper::check_permission($user_id,$request->task_id,'edit');
        if(!$check_permission){
            return $this->send_not_foud_error("You have no rights");
        }

        TaskManagement::updateOrCreate(
            [
                'id' => $request->task_id,
            ],
            [
                'task_title' => $request->task_title,
            ]
        );

        return $this->send_response([], 'Task edit successfully');
    }

    public function delete_task(Request $request)
    {
        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        $token =  $request->bearerToken();
        $users = JWTAuth::authenticate($token);
        $user_id = $users->id;

        $validator = Validator::make($request->all(), [
            'task_id' => 'required|exists:task_management,id',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }

        $check_permission = TaskHelper::check_permission($user_id,$request->task_id,'delete');
        if(!$check_permission){
            return $this->send_not_foud_error("You have no rights");
        }

        TaskManagement::where('id', $request->task_id)->delete();
        return $this->send_response([], 'Task deleted successfully');
    }

    public function assign_task_permission(Request $request)
    {
        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        $token =  $request->bearerToken();
        $users = JWTAuth::authenticate($token);
        $user_id = $users->id;

        $validator = Validator::make($request->all(), [
            'task_id' => 'required|exists:task_management,id',
            'user_id' => 'required|exists:users,id',
            'permission' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }

        $check_task = TaskPermission::where(['task_id' => $request->task_id, 'user_id' => $request->user_id, 'permission' => $request->permission])->first();
        if (!empty($check_task)) {
            return $this->send_not_foud_error("permission already assigned");
        }

        TaskPermission::create(
            [
                'assigned_by' => $user_id,
                'task_id' => $request->task_id,
                'user_id' => $request->user_id,
                'permission' => $request->permission,
            ]
        );

        return $this->send_response([], 'Task permission assigned successfully');
    }
    
    public function shared_task_list()
    {
        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        // $token =  $request->bearerToken();
        // $users = JWTAuth::authenticate($token);
        // $user_id = $users->id;
        $user_id = Auth::user()->id;

        $task_data = TaskPermission::with('task')->where(['user_id' => $user_id])->get()->toArray();

        $task_data = array_reduce($task_data, function($carry, $item){ 
            if(!isset($carry[$item['task_id']])){ 
                $carry[$item['task_id']] = ['task_id' => $item['task_id'],'task_title' => $item['task']['task_title'],'permission' => $item['permission']]; 
            } else { 
                $carry[$item['task_id']]['permission'] = $carry[$item['task_id']]['permission'].','.$item['permission']; 
            } 
            return $carry; 
        });

        // dd($task_data);
        $data = [];
        if (!empty($task_data)) {
            foreach ($task_data as $v_product) {

                $permission = [];
                $permission = explode(',',$v_product['permission']);
                // $permission[] = "view";
                $data[] = [
                    'task_id' => $v_product['task_id'],
                    'task_title' => $v_product['task_title'],
                    'permission' => $permission,
                ];
            }
        }
        $response['status'] = 200;
        $response['message'] = 'Shared task List';
        $response['data'] = $data;
        return response($response, 200);
    }
}

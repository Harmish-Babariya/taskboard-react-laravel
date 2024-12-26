<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\BaseController as BaseController;
use App\Models\User;
use App\Models\UserRole;
use Validator;
use Hash;
use Config;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends BaseController
{

    function __construct()
    {
        Config::set('jwt.user', User::class);
        Config::set('auth.providers', ['users' => [
            'driver' => 'eloquent',
            'model' => User::class,
        ]]);
    }

    public function get_user_role_list()
    {
        $user_role = UserRole::get();

        $data = [];
        if (count($user_role) > 0) {
            foreach ($user_role as $key => $val) {

                $data[] = [
                    'role_id' => $val->id,
                    'role_name' => $val->role_name,
                ];
            }
        }

        $response['status'] = 200;
        $response['message'] = 'User Role List';
        $response['data'] = $data;
        return response($response, 200);
    }

    public function user_registration(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'username' => 'required',
            'email' => 'required|unique:users',
            'role_id' => 'required|exists:user_role,id',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }

        User::updateOrCreate(
            [
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role_id' => $request->role_id,
            ]
        );

        return $this->send_response([], 'Registration successfully');
    }

    public function login(Request $request)
    {

        $params = $request->all();

        $validator = Validator::make($params, [
            'email' => 'required',
            'password'  => 'required',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }

        $credentials = array('email' => $request->email, 'password' => $request->password);

        $data = [];
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'success' => 200,
                    'message' => 'Login credentials are invalid.',
                ], 400);
            } else {
                $user = Auth::user();
                User::updateOrCreate(
                    [
                        'id' => $user->id,
                    ],
                    [
                        'device_token' => $request->device_token,
                    ]
                );
                if (!empty($user)) {
                    $data = [
                        'user_id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'token' => $token,
                    ];
                }
            }
        } catch (JWTException $e) {
            return response()->json([
                'success' => 200,
                'message' => 'Could not create token.',
            ], 500);
        }

        return $this->send_response($data, 'User login successfully.');
    }

    public function profile_update(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'username' => 'required',
            'email' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }

        $token =  $request->bearerToken();
        $user = JWTAuth::authenticate($token);
        $userId = $user->id;

        $check_salon_email = User::select('id')->where('email', $request->email)->whereNotIn('id', [$userId])->first();
        if (!empty($check_salon_email)) {
            return $this->send_not_foud_error('Email already used');
        }

        $user = User::updateOrCreate(
            [
                'id' => $userId,
            ],
            [
                'name'      => !empty($request->name) ? $request->name : $user->name,
                'username'  => !empty($request->username) ? $request->username : $user->username,
                'email'     => !empty($request->email) ? $request->email : $user->email,
            ]
        );

        $users = User::where('id', $user->id)->first();

        $user_data['user_id'] = $users->id;
        $user_data['name'] = $users->name;
        $user_data['username'] = $users->username;
        $user_data['email'] = $users->email;
        $user_info = [
            'user' => $user_data,
        ];
        return $this->send_response($user_info, 'Profile Update successfully');
    }

    public function get_profile_detail()
    {
        $userId = Auth::user()->id;
        $users = User::with('role')->where('id', $userId)->first();

        $user_data['user_id'] = $users->id;
        $user_data['name'] = $users->name;
        $user_data['username'] = $users->username;
        $user_data['email'] = $users->email;
        $user_data['role'] = !empty($users->role) ? $users->role->role_name : '';

        return $this->send_response($user_data, 'User profile');
    }

    public function profile_detail(Request $request)
    {
        $token =  $request->bearerToken();
        $users = JWTAuth::authenticate($token);
        $userId = $users->id;
        $users = User::with('role')->where('id', $userId)->first();

        $user_data['user_id'] = $users->id;
        $user_data['name'] = $users->name;
        $user_data['username'] = $users->username;
        $user_data['email'] = $users->email;
        $user_data['role'] = !empty($users->role) ? $users->role->role_name : '';

        return $this->send_response($user_data, 'User profile');
    }

    public function forgot_password(Request $request)
    {
        $params = $request->all();

        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        $validator = Validator::make($params, [
            'email' => 'required|exists:users,email',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }

        $user = User::select('id')->where('email', $request->email)->where('user_type', 'user')->first();
        if (empty($user)) {
            return $this->send_not_foud_error('User not found');
        }

        $otp = mt_rand(100000, 999999);
        $user->otp =  $otp;
        $user->otp_time = date('Y-m-d H:i:s');
        $user->save();

        $response['status'] = 200;
        $response['data'] = ['otp' => $otp];
        $response['message'] = 'Verification code successfully sent';
        return response($response, 200);
    }

    public function verify_otp(Request $request)
    {
        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        $params = $request->all();
        $otp = $request->otp;
        $email = $request->email;

        $validator = Validator::make($params, [
            'email' => 'required|exists:users,email',
            'otp' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }

        $otp_verify = User::where('email', $email)->where('user_type', 'user')->first();
        if (!empty($otp_verify)) {
            if ($otp == $otp_verify->otp) {
                $current = date("Y-m-d H:i:s");
                $otp_time = $otp_verify->otp_time;
                $diff = strtotime($current) - strtotime($otp_time);
                $days    = floor($diff / 86400);
                $hours   = floor(($diff - ($days * 86400)) / 3600);
                $minutes = floor(($diff - ($days * 86400) - ($hours * 3600)) / 60);
                if (($diff > 0) && ($minutes <= 180)) {
                    $response['status'] = 200;
                    $response['message'] = 'OTP verified successfully';
                    $otp_verify->otp = '';
                    $otp_verify->otp_time = null;
                    $otp_verify->save();
                } else {
                    return $this->send_not_foud_error('OTP expired');
                }
            } else {
                return $this->send_not_foud_error('Invalid OTP');
            }
        } else {
            return $this->send_not_foud_error('Email not found');
        }
        return response($response, 200);
    }

    public function reset_password(Request $request)
    {
        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        $params = $request->all();
        $password = $request->password;
        $email = $request->email;

        $validator = Validator::make($params, [
            'email' => 'required|exists:users,email',
            'password' => 'required',
            'confirm_password' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }

        $reset_password = User::where('email', $email)->where('user_type', 'user')->first();
        if (!empty($reset_password)) {
            if (Hash::check($password, $reset_password->password)) {
                return $this->send_not_foud_error('Old password and new password cannot be same');
            } else {
                $reset_password->password = Hash::make($password);
                $reset_password->save();

                $response['status'] = 200;
                $response['message'] = 'Your password has been reset successfully';
            }
        } else {
            return $this->send_not_foud_error('Email not found');
        }

        return response($response, 200);
    }

    public function resend_otp(Request $request)
    {
        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        $params = $request->all();
        $email = $request->email;

        $validator = Validator::make($params, [
            'email' => 'required|exists:users,email',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }

        $resend_data = User::where('email', $email)->where('user_type', 'user')->first();

        if (empty($resend_data)) {
            return $this->send_not_foud_error('User not found');
        }

        $otp = mt_rand(100000, 999999);
        $resend_data->otp = $otp;
        $resend_data->otp_time = date('Y-m-d H:i:s');
        $resend_data->save();

        $response['status'] = 200;
        $response['data'] = ['otp' => $otp];
        $response['message'] = 'OTP send successfully';

        return response($response, 200);
    }

    public function change_password(Request $request)
    {
        $response = array();
        $response['status'] = 200;
        $response['message'] = '';
        $response['data'] = (object)array();

        // $user_id = Auth::user()->id;
        $token =  $request->bearerToken();
        $users = JWTAuth::authenticate($token);
        $user_id = $users->id;

        $params = $request->all();
        $current_password = $request->current_password;
        $password = $request->password;

        $validator = Validator::make($params, [
            'current_password' => 'required',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return $this->send_error($validator->errors()->first());
        }
        // if (!UserHelper::match_token($user_id, $token)) {
        //     $response['status'] = 401;
        //     $response['message'] = 'Unauthenticated';
        //     return response($response, 200);
        // } else {
        // }
        $change_password = User::where('id', $user_id)->first();
        if (!empty($change_password)) {
            if (!Hash::check($current_password, $change_password->password)) {
                return $this->send_not_foud_error('Current password doent not match');
            } else {
                $change_password->password = Hash::make($password);
                $change_password->otp = '';
                $change_password->save();

                // $message = "Congratulations! Your password has been changed successfully. - My Health Chart";
                // $api = "http://message.smartwave.co.in/rest/services/sendSMS/sendGroupSms?AUTH_KEY=6d1bdc8e4530149c49564516e213f7&routeId=8&senderId=HLTCHT&mobileNos='" . $change_password->mobile_number . "'&message=" . urlencode($message);
                // $sms = file_get_contents($api);

                $response['status'] = 200;
                $response['message'] = 'Your password has been successfully changed';
            }
        } else {
            return $this->send_not_foud_error('User not found');
        }
        return response($response, 200);
    }

    public function logout(Request $request)
    {
        $token =  $request->bearerToken();
        $users = JWTAuth::authenticate($token);
        try {
            JWTAuth::invalidate($token);
            $response['status'] = 200;
            $response['message'] = 'Logged Out Successfully';
        } catch (JWTException $e) {
            return $this->send_not_foud_error('User not found');
        }

        return response($response, 200);
    }

    public function delete_account(Request $request)
    {
        $token =  $request->bearerToken();
        $user = JWTAuth::authenticate($token);
        $user_id = $user->id;
        User::where('id', '=', $user_id)->delete();
        return $this->send_response([], "Account Deleted Successfully");
    }

    public function get_users_list()
    {
        // $token =  $request->bearerToken();
        // $users = JWTAuth::authenticate($token);
        // $user_id = $users->id;
        $user_id = Auth::user()->id;

        $users = User::with('role')->whereNotIn('id',[$user_id])->get();

        $data = [];
        if (count($users) > 0) {
            foreach ($users as $key => $val) {

                $data[] = [
                    'user_id' => $val->id,
                    'name' => $val->name,
                    'username' => $val->username,
                    'email' => $val->email,
                    'role' => !empty($val->role) ? $val->role->role_name : '',
                ];
            }
        }

        $response['status'] = 200;
        $response['message'] = 'Users List';
        $response['data'] = $data;
        return response($response, 200);
    }
}

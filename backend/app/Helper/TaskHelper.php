<?php
namespace App\Helper;

use App\Models\TaskManagement;
use App\Models\TaskPermission;

class TaskHelper
{
    public static function check_permission($user_id,$task_id,$permission)
    {
        $check_task = TaskManagement::where(['id' => $task_id,'created_by' => $user_id])->first(['id']);
        if(!empty($check_task)){
            return true;
        }else{
            $check_permission = TaskPermission::where(['user_id' => $user_id,'task_id' => $task_id,'permission' => $permission])->first(['id']);
            if(!empty($check_permission)){
                return true;
            }
            return false;
        }
        return false;
    }
}

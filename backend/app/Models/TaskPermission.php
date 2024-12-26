<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TaskPermission extends Model
{
    protected $table = 'task_permission';
    protected $primaryKey = 'id';

    protected $fillable = [
       'assigned_by', 'user_id', 'task_id', 'permission', 'created_at', 'updated_at'
    ];
 
    public function task()
    {
        return $this->hasOne(TaskManagement::class,'id','task_id');
    }

    public function user()
    {
        return $this->hasOne(User::class,'id','user_id');
    }

    public function assign()
    {
        return $this->hasOne(User::class,'id','assigned_by');
    }
}

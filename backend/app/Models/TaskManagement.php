<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TaskManagement extends Model
{
    protected $table = 'task_management';
    protected $primaryKey = 'id';

    protected $fillable = [
        'task_title', 'created_by', 'created_at', 'updated_at'
    ];
   
}

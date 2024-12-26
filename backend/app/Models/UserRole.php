<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    protected $table = 'user_role';
    protected $primaryKey = 'id';

    protected $fillable = [
        'role_name', 'created_at', 'updated_at'
    ];
   
}

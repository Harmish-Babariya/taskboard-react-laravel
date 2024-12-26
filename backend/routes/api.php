<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('user_registration', 'App\Http\Controllers\Api\UserController@user_registration');
Route::post('login', 'App\Http\Controllers\Api\UserController@login');
Route::post('forgot_password', 'App\Http\Controllers\Api\UserController@forgot_password');
Route::post('verify_otp', 'App\Http\Controllers\Api\UserController@verify_otp');
Route::post('reset_password', 'App\Http\Controllers\Api\UserController@reset_password');
Route::post('resend_otp', 'App\Http\Controllers\Api\UserController@resend_otp');
Route::get('get_user_role_list', 'App\Http\Controllers\Api\UserController@get_user_role_list');

// Route::group(['middleware' => 'auth:api'], function() {
Route::group(['middleware' => ['check.user']], function () {

    Route::get('get_profile_detail', 'App\Http\Controllers\Api\UserController@get_profile_detail');
    Route::post('profile_detail', 'App\Http\Controllers\Api\UserController@profile_detail');
    Route::post('profile_update', 'App\Http\Controllers\Api\UserController@profile_update');
    Route::post('change_password', 'App\Http\Controllers\Api\UserController@change_password');
    Route::post('logout', 'App\Http\Controllers\Api\UserController@logout');
    Route::get('get_users_list', 'App\Http\Controllers\Api\UserController@get_users_list');
    
    Route::get('get_task_list', 'App\Http\Controllers\Api\TaskController@get_task_list');
    Route::post('add_task', 'App\Http\Controllers\Api\TaskController@add_task');
    Route::post('edit_task', 'App\Http\Controllers\Api\TaskController@edit_task');
    Route::post('delete_task', 'App\Http\Controllers\Api\TaskController@delete_task');
    Route::post('assign_task_permission', 'App\Http\Controllers\Api\TaskController@assign_task_permission');
    Route::get('shared_task_list', 'App\Http\Controllers\Api\TaskController@shared_task_list');
    
});
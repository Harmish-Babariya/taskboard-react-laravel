<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Exception;

class CheckUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try{
            $user = JWTAuth::parseToken()->authenticate();
            if(!empty($user)){
                return $next($request);
            }else{
                return response()->json(['success' => 200, 'message' => 'Not Allowed'], 400);
            }
        } catch (Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return response()->json(['success' => 200, 'message' => 'Token is Invalid'], 401);
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                return response()->json(['success' => 200, 'message' => 'Token is Expired'], 401);
            }else{
                return response()->json(['success' => 200, 'message' => 'Authorization Token not found'], 400);
            }
        }
    }
}

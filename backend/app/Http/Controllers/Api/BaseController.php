<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller as Controller;
/*use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Password;*/

class BaseController extends Controller
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function send_response($result, $message)
    {
    	$response = [
            'success' => 200,
            'data'    => $result,
            'message' => $message,
        ];

        return response()->json($response, 200);
    }

    /**
     * return error response.
     *
     * @return \Illuminate\Http\Response
     */
    public function send_error($error, $data = [], $code = 401,$error_code = 401)
    {
        if (empty($data)) {
            $data = (object)[];
        }
    	$response = [
            'success' => $error_code,
            'message' => $error,
            'data'    => $data,
        ];

        return response()->json($response, $code);
    }

    public function send_not_foud_error($error, $data = [], $code = 404,$error_code = 404)
    {
        if (empty($data)) {
            $data = (object)[];
        }
    	$response = [
            'success' => $error_code,
            'message' => $error,
            'data'    => $data,
        ];

        return response()->json($response, $code);
    }
}

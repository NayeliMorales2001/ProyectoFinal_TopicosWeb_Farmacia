<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

use App\Models\User;

class PasswordResetController extends Controller
{
    // =========================================
    // ENVIAR LINK
    // =========================================

    public function forgot(Request $request)
    {
        $request->validate([

            'email' => 'required|email'
        ]);

        $status = Password::sendResetLink(

            $request->only('email')
        );

        return response()->json([

            'message' => __($status)
        ]);
    }

    // =========================================
    // RESET PASSWORD
    // =========================================

    public function reset(Request $request)
    {
        $request->validate([

            'token' => 'required',

            'email' => 'required|email',

            'password' =>
                'required|min:6|confirmed'
        ]);

        $status = Password::reset(

            $request->only(
                'email',
                'password',
                'password_confirmation',
                'token'
            ),

            function ($user, $password) {

                $user->password =
                    Hash::make($password);

                $user->save();
            }
        );

        return response()->json([

            'message' => __($status)
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    // =========================================
    // REGISTER
    // =========================================
    public function register(RegisterRequest $request)
    {
        try {

            $validated = $request->validated();

            // =========================================
            // VALIDAR ROL
            // =========================================
            $rol = $validated['rol'] ?? 'empleado';

            // =========================================
            // CREAR USUARIO
            // =========================================
            $user = User::create([

                'name' => $validated['name'],

                'email' => $validated['email'],

                'password' => Hash::make(
                    $validated['password']
                ),

                'rol' => $rol
            ]);

            // =========================================
            // ASIGNAR ROL SPATIE
            // =========================================
            $user->assignRole($rol);

            return response()->json([

                'message' =>
                    'Usuario registrado correctamente',

                'user' => [

                    'id' => $user->id,

                    'name' => $user->name,

                    'email' => $user->email,

                    'rol' => $user->rol,

                    'roles' => $user->getRoleNames()

                ]

            ], 201);

        } catch (\Throwable $e) {

            Log::error('REGISTER ERROR: ' . $e->getMessage());

            return response()->json([

                'success' => false,

                'error' => $e->getMessage(),

                'line' => $e->getLine(),

                'file' => $e->getFile()

            ], 500);
        }
    }

    // =========================================
    // LOGIN
    // =========================================
    public function login(LoginRequest $request)
    {
        try {

            $validated = $request->validated();

            // =========================================
            // CAPTCHA
            // =========================================
            if ($request->captcha) {

                $response = Http::asForm()->post(

                    'https://www.google.com/recaptcha/api/siteverify',

                    [
                        'secret' => config(
                            'services.recaptcha.secret'
                        ),

                        'response' => $request->captcha
                    ]
                );

                if (!($response->json()['success'] ?? false)) {

                    return response()->json([
                        'error' => 'Captcha inválido'
                    ], 401);
                }
            }

            // =========================================
            // LOGIN
            // =========================================
            if (!Auth::attempt([

                'email' => $validated['email'],

                'password' => $validated['password']

            ])) {

                return response()->json([
                    'error' => 'Credenciales incorrectas'
                ], 401);
            }

            // =========================================
            // USUARIO
            // =========================================
            $user = Auth::user();

            // =========================================
            // ELIMINAR TOKENS ANTERIORES
            // =========================================
            $user->tokens()->delete();

            // =========================================
            // CREAR TOKEN
            // =========================================
            $token = $user
                ->createToken('auth_token')
                ->plainTextToken;

            return response()->json([

                'message' => 'Login exitoso',

                'user' => [

                    'id' => $user->id,

                    'name' => $user->name,

                    'email' => $user->email,

                    'rol' => $user->rol,

                    'roles' => $user->getRoleNames()

                ],

                'token' => $token

            ]);

        } catch (\Throwable $e) {

            Log::error('LOGIN ERROR: ' . $e->getMessage());

            return response()->json([

                'success' => false,

                'error' => $e->getMessage(),

                'line' => $e->getLine(),

                'file' => $e->getFile()

            ], 500);
        }
    }

    // =========================================
    // LOGOUT
    // =========================================
    public function logout(Request $request)
    {
        try {

            $request
                ->user()
                ->tokens()
                ->delete();

            return response()->json([
                'message' => 'Logout exitoso'
            ]);

        } catch (\Throwable $e) {

            return response()->json([

                'success' => false,

                'error' => $e->getMessage()

            ], 500);
        }
    }
}

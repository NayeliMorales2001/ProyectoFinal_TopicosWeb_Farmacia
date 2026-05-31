<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // =========================================
    // LISTAR USUARIOS
    // =========================================
    public function index()
    {
        return User::all()->map(function ($user) {

            return [

                'id' => $user->id,

                'name' => $user->name,

                'email' => $user->email,

                'roles' => $user->getRoleNames()

            ];

        });
    }

    // =========================================
    // CREAR USUARIO
    // =========================================
    public function store(Request $request)
    {
        $request->validate([

            'name' => 'required',

            'email' => 'required|email|unique:users',

            'password' => 'required|min:6',

            'rol' => 'required'

        ]);

        $user = User::create([

            'name' => $request->name,

            'email' => $request->email,

            'password' => Hash::make($request->password)

        ]);

        // ASIGNAR ROL
        $user->assignRole($request->rol);

        return response()->json($user);
    }

    // =========================================
    // ACTUALIZAR USUARIO
    // =========================================
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $user->update([

            'name' => $request->name,

            'email' => $request->email

        ]);

        // PASSWORD
        if ($request->password) {

            $user->password = Hash::make($request->password);

            $user->save();
        }

        // ACTUALIZAR ROL
        if ($request->rol) {

            $user->syncRoles([$request->rol]);
        }

        return response()->json($user);
    }

    // =========================================
    // ELIMINAR
    // =========================================
    public function destroy($id)
    {
        User::destroy($id);

        return response()->json([

            'message' => 'Usuario eliminado'

        ]);
    }
}

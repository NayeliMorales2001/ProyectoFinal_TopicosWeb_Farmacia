<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'name' => [
                'required',
                'string',
                'min:3',
                'max:255'
            ],

            'email' => [
                'required',
                'email',
                'unique:users,email'
            ],

            'password' => [
                'required',
                'min:6',
                'confirmed'
            ],

            'rol' => [
                'required',
                'in:admin,empleado'
            ],

            'captcha' => [
                'nullable',
                'string'
            ]
        ];
    }

    public function messages(): array
    {
        return [

            'name.required' => 'El nombre es obligatorio',
            'name.min' => 'El nombre debe tener al menos 3 caracteres',

            'email.required' => 'El correo es obligatorio',
            'email.email' => 'Correo inválido',
            'email.unique' => 'El correo ya está registrado',

            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener mínimo 6 caracteres',
            'password.confirmed' => 'Las contraseñas no coinciden',

            'rol.required' => 'Debes seleccionar un rol',
            'rol.in' => 'Rol inválido'
        ];
    }
}

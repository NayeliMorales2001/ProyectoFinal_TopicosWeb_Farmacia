<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [

            'name' => [
                'required',
                'string',
                'min:8',
                'max:255',
                'regex:/^[\pL\s]+$/u'
            ],

            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
                'unique:users,email'
            ],

            'password' => [
                'required',
                'string',
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

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [

            // Nombre
            'name.required' => 'El nombre es obligatorio',
            'name.string' => 'El nombre debe ser texto',
            'name.min' => 'El nombre debe tener al menos 8 caracteres',
            'name.max' => 'El nombre no puede superar los 255 caracteres',
            'name.regex' => 'El nombre solo puede contener letras y espacios',

            // Correo
            'email.required' => 'El correo es obligatorio',
            'email.email' => 'Ingresa un correo electrónico válido',
            'email.max' => 'El correo es demasiado largo',
            'email.unique' => 'El correo ya está registrado',

            // Contraseña
            'password.required' => 'La contraseña es obligatoria',
            'password.string' => 'La contraseña debe ser texto',
            'password.min' => 'La contraseña debe tener mínimo 6 caracteres',
            'password.confirmed' => 'Las contraseñas no coinciden',

            // Rol
            'rol.required' => 'Debes seleccionar un rol',
            'rol.in' => 'Rol inválido'
        ];
    }
}

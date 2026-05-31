<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [

            'nombre' => 'required|string|max:255',

            'codigo' => 'required|string|max:255',

            'tipo' => 'required|string|max:255',

            'precio' => 'required|numeric|min:0',

            'stock' => 'required|integer|min:0',

            'stock_minimo' => 'nullable|integer|min:0',

            'categoria_id' => 'required|exists:categorias,id',

        ];
    }
}

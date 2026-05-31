<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(): array
{
    return [

        "nombre" => "required",

        "precio" => "required|numeric",

        "stock" => "required|integer"

    ];
}
}

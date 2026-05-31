<?php

namespace App\Factories;

class ProductoFactory
{
    public static function crearMedicamento(array $data)
    {
        return [

            "nombre" => $data["nombre"],

            "codigo" => $data["codigo"],

            "tipo" => "medicamento",

            "precio" => $data["precio"],

            "stock" => $data["stock"],

            "stock_minimo" =>
                $data["stock_minimo"] ?? 0,

            "categoria_id" =>
                $data["categoria_id"]

        ];
    }

    public static function crearSuplemento(array $data)
    {
        return [

            "nombre" => $data["nombre"],

            "codigo" => $data["codigo"],

            "tipo" => "suplemento",

            "precio" => $data["precio"],

            "stock" => $data["stock"],

            "stock_minimo" =>
                $data["stock_minimo"] ?? 0,

            "categoria_id" =>
                $data["categoria_id"]

        ];
    }
}

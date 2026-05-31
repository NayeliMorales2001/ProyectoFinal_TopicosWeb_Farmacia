<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductoResource extends JsonResource
{
    public function toArray(
        Request $request
    ): array {

        return [

            "id" => $this->id,

            "nombre" =>
                $this->nombre,

            "precio" =>
                $this->precio,

            "stock" =>
                $this->stock,

            "tipo" =>
                $this->tipo,

            "descripcion" =>
                $this->descripcion,

            "created_at" =>
                $this->created_at
        ];
    }
}

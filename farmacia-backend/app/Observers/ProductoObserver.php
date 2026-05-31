<?php

namespace App\Observers;

use App\Models\Producto;
use Illuminate\Support\Facades\Log;

class ProductoObserver
{
    public function created(
        Producto $producto
    ): void {

        Log::info(
            "Producto creado observer",
            [
                "producto" =>
                    $producto->nombre
            ]
        );
    }

    public function deleted(
        Producto $producto
    ): void {

        Log::warning(
            "Producto eliminado",
            [
                "producto" =>
                    $producto->nombre
            ]
        );
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaDetalle extends Model
{
    protected $table = 'venta_detalles';

    protected $fillable = [
        'venta_id',
        'producto_id',
        'cantidad',
        'precio',
        'subtotal'
    ];

    // ==========================
    // RELACION VENTA
    // ==========================
    public function venta()
    {
        return $this->belongsTo(
            Venta::class,
            'venta_id'
        );
    }

    // ==========================
    // RELACION PRODUCTO
    // ==========================
    public function producto()
    {
        return $this->belongsTo(
            Producto::class,
            'producto_id'
        );
    }
}

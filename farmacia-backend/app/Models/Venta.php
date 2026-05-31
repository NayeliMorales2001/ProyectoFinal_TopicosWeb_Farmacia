<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $fillable = [
        'producto_id',
        'paciente_id', // 🔥 FALTABA ESTO
        'cantidad',
        'precio',
        'total'
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }
}

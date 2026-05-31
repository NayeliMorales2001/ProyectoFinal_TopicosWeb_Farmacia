<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Categoria;
use App\Models\Venta;

class Producto extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'codigo',
        'tipo',
        'precio',
        'stock',
        'stock_minimo',
        'categoria_id',
        'imagen',
    ];

    protected $casts = [
        'precio' => 'float',
        'stock' => 'integer',
        'stock_minimo' => 'integer',
        'categoria_id' => 'integer'
    ];

    // =========================================
    // RELACION CATEGORIA
    // =========================================
    public function categoria()
    {
        return $this->belongsTo(
            Categoria::class,
            'categoria_id'
        );
    }

    // =========================================
    // RELACION VENTAS
    // =========================================
    public function ventas()
    {
        return $this->hasMany(
            Venta::class,
            'producto_id'
        );
    }
}

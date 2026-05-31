<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auditoria extends Model
{
    protected $fillable = [

        'user_id',

        'accion',

        'tabla',

        'registro_id',

        'datos_anteriores',

        'datos_nuevos',

        'ip',
    ];

    protected $casts = [

        'datos_anteriores' => 'array',

        'datos_nuevos' => 'array',
    ];
}

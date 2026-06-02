<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $fillable = [
        'paciente_id',
        'medico_id',
        'total'
    ];

    public function paciente()
    {
        return $this->belongsTo(
            Paciente::class,
            'paciente_id'
        );
    }

    public function medico()
    {
        return $this->belongsTo(
            Medico::class,
            'medico_id'
        );
    }

    public function detalles()
    {
        return $this->hasMany(
            VentaDetalle::class,
            'venta_id'
        );
    }
}

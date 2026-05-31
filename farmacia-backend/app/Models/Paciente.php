<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    protected $table = 'pacientes';

    protected $fillable = [

        'nombre',

        'edad',

        'doctor',

        'direccion',

        'medicamento',

        'dosis',

        'fecha',

        'foto'
    ];
}

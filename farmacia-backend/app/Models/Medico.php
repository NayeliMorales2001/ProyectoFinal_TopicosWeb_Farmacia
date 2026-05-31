<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medico extends Model
{
    use HasFactory;

    protected $table = 'medicos';

    protected $fillable = [
        'nombre',
        'especialidad',
        'telefono',
        'cedula'
    ];

    // ACTIVAR timestamps
    public $timestamps = true;
}

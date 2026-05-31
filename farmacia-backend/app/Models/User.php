<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * Guard de Spatie
     */
    protected $guard_name = 'web';

    /**
     * Campos asignables
     */
    protected $fillable = [

        'name',

        'email',

        'password',

        'rol',
    ];

    /**
     * Campos ocultos
     */
    protected $hidden = [

        'password',

        'remember_token',
    ];

    /**
     * Casts
     */
    protected $casts = [

        'email_verified_at' => 'datetime',

        'password' => 'hashed',
    ];
}

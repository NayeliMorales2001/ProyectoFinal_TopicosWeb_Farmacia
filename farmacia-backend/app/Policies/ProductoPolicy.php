<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Producto;

class ProductoPolicy
{
    // =========================================
    // VIEW
    // =========================================

    public function viewAny(User $user): bool
    {
        return true;
    }

    // =========================================
    // CREATE
    // =========================================

    public function create(User $user): bool
    {
        return $user->rol === 'admin';
    }

    // =========================================
    // UPDATE
    // =========================================

    public function update(
        User $user,
        Producto $producto
    ): bool {

        return $user->rol === 'admin';
    }

    // =========================================
    // DELETE
    // =========================================

    public function delete(
        User $user,
        Producto $producto
    ): bool {

        return $user->rol === 'admin';
    }
}

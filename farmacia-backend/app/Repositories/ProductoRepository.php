<?php

namespace App\Repositories;

use App\Models\Producto;
use App\Interfaces\ProductoRepositoryInterface;

class ProductoRepository implements ProductoRepositoryInterface
{
    // =========================================
    // OBTENER TODOS
    // =========================================

    public function getAll()
    {
        return Producto::with('categoria')
            ->orderBy('id', 'desc')
            ->get();
    }

    // =========================================
    // CREAR
    // =========================================

    public function create(array $data)
    {
        return Producto::create($data);
    }

    // =========================================
    // ACTUALIZAR
    // =========================================

    public function update($id, array $data)
    {
        $producto = Producto::findOrFail($id);

        $producto->update($data);

        return $producto;
    }

    // =========================================
    // ELIMINAR
    // =========================================

    public function delete($id)
    {
        $producto = Producto::findOrFail($id);

        return $producto->delete();
    }

    // =========================================
    // BUSCAR POR ID
    // =========================================

    public function findById($id)
    {
        return Producto::with('categoria')
            ->findOrFail($id);
    }

    // =========================================
    // STOCK BAJO
    // =========================================

    public function productosConStockBajo()
    {
        return Producto::with('categoria')
            ->whereColumn(
                'stock',
                '<=',
                'stock_minimo'
            )
            ->get();
    }
}

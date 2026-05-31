<?php

namespace App\Services;

use App\Factories\ProductoFactory;
use App\Interfaces\ProductoRepositoryInterface;
use Illuminate\Support\Facades\Log;

class ProductoService
{
    protected $productoRepository;

    public function __construct(
        ProductoRepositoryInterface $productoRepository
    ) {
        $this->productoRepository =
            $productoRepository;
    }

    // =========================================
    // OBTENER PRODUCTOS
    // =========================================

    public function obtenerProductos()
    {
        return $this->productoRepository
            ->getAll();
    }

    // =========================================
    // CREAR PRODUCTO
    // =========================================

    public function crearProducto(array $data)
    {
        try {

            if (
                strtolower($data["tipo"])
                === "medicamento"
            ) {

                $producto =
                    ProductoFactory::crearMedicamento($data);

            } else {

                $producto =
                    ProductoFactory::crearSuplemento($data);
            }

            $nuevoProducto =
                $this->productoRepository
                    ->create($producto);

            Log::info(
                "Producto creado",
                [
                    "producto" =>
                        $nuevoProducto->nombre
                ]
            );

            return $nuevoProducto;

        } catch (\Exception $e) {

            Log::error(
                "Error al crear producto",
                [
                    "error" => $e->getMessage()
                ]
            );

            throw $e;
        }
    }

    // =========================================
    // ACTUALIZAR PRODUCTO
    // =========================================

    public function actualizarProducto(
        $id,
        array $data
    ) {
        return $this->productoRepository
            ->update($id, $data);
    }

    // =========================================
    // ELIMINAR PRODUCTO
    // =========================================

    public function eliminarProducto($id)
    {
        return $this->productoRepository
            ->delete($id);
    }

    // =========================================
    // STOCK BAJO
    // =========================================

    public function obtenerStockBajo()
    {
        return $this->productoRepository
            ->productosConStockBajo();
    }

    // =========================================
    // OBTENER PRODUCTO POR ID
    // =========================================

    public function obtenerProductoPorId($id)
    {
        return $this->productoRepository
            ->findById($id);
    }
}

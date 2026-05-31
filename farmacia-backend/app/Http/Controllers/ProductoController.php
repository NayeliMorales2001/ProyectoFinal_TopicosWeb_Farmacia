<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductosExport;
use App\Http\Requests\ProductoRequest;

class ProductoController extends Controller
{
    // =========================================
    // LISTAR
    // =========================================
    public function index()
    {
        $productos = Producto::with('categoria')
            ->latest()
            ->paginate(10);

        return response()->json($productos);
    }

    // =========================================
    // CREAR
    // =========================================
    public function store(ProductoRequest $request)
    {
        $imagen = null;

        // =========================================
        // SUBIR IMAGEN
        // =========================================
        if ($request->hasFile('imagen')) {

            $imagen = $request->file('imagen')
                ->store('productos', 'public');
        }

        // =========================================
        // CREAR PRODUCTO
        // =========================================
        $producto = Producto::create([

            'nombre' => strip_tags($request->nombre),

            'codigo' => strip_tags($request->codigo),

            'tipo' => strip_tags($request->tipo),

            'precio' => $request->precio,

            'stock' => $request->stock,

            'stock_minimo' =>
                $request->stock_minimo ?? 0,

            'categoria_id' =>
                $request->categoria_id,

            'imagen' => $imagen
        ]);

        return response()->json([

            'message' =>
                'Producto creado correctamente',

            'data' =>
                $producto->load('categoria')

        ], 201);
    }

    // =========================================
    // MOSTRAR
    // =========================================
    public function show($id)
    {
        $producto = Producto::with('categoria')
            ->findOrFail($id);

        return response()->json([
            'data' => $producto
        ]);
    }

    // =========================================
    // ACTUALIZAR
    // =========================================
    public function update(
        ProductoRequest $request,
        $id
    ) {

        $producto = Producto::findOrFail($id);

        // =========================================
        // ACTUALIZAR IMAGEN
        // =========================================
        if ($request->hasFile('imagen')) {

            // eliminar imagen anterior
            if ($producto->imagen) {

                Storage::disk('public')
                    ->delete($producto->imagen);
            }

            // guardar nueva imagen
            $producto->imagen = $request
                ->file('imagen')
                ->store('productos', 'public');
        }

        // =========================================
        // ACTUALIZAR DATOS
        // =========================================
        $producto->update([

            'nombre' => strip_tags($request->nombre),

            'codigo' => strip_tags($request->codigo),

            'tipo' => strip_tags($request->tipo),

            'precio' => $request->precio,

            'stock' => $request->stock,

            'stock_minimo' =>
                $request->stock_minimo ?? 0,

            'categoria_id' =>
                $request->categoria_id,

            'imagen' => $producto->imagen
        ]);

        return response()->json([

            'message' =>
                'Producto actualizado correctamente',

            'data' =>
                $producto->load('categoria')

        ]);
    }

    // =========================================
    // ELIMINAR
    // =========================================
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);

        // eliminar imagen
        if ($producto->imagen) {

            Storage::disk('public')
                ->delete($producto->imagen);
        }

        $producto->delete();

        return response()->json([

            'message' =>
                'Producto eliminado correctamente'

        ]);
    }

    // =========================================
    // PRODUCTOS STOCK BAJO
    // =========================================
    public function stockBajo()
    {
        $productos = Producto::with('categoria')
            ->whereColumn(
                'stock',
                '<=',
                'stock_minimo'
            )
            ->get();

        return response()->json($productos);
    }

    // =========================================
    // EXPORTAR EXCEL
    // =========================================
    public function exportExcel()
    {
        return Excel::download(

            new ProductosExport,

            'productos.xlsx'
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductosExport;
use App\Http\Requests\ProductoRequest;

class ProductoController extends Controller
{
    public function index()
    {
        return response()->json(
            Producto::with('categoria')
                ->latest()
                ->paginate(10)
        );
    }

    public function store(ProductoRequest $request)
    {
        try {

            $imagen = null;

            if ($request->hasFile('imagen')) {

                $imagen = $request
                    ->file('imagen')
                    ->store('productos', 'public');
            }

            $producto = Producto::create([

                'nombre' => strip_tags($request->nombre),

                'codigo' => strip_tags($request->codigo),

                'tipo' => strip_tags($request->tipo),

                'precio' => $request->precio,

                'stock' => $request->stock,

                'stock_minimo' => $request->stock_minimo ?? 0,

                'categoria_id' => $request->categoria_id,

                'imagen' => $imagen
            ]);

            return response()->json([

                'message' => 'Producto creado correctamente',

                'data' => $producto->load('categoria')

            ], 201);

        } catch (\Exception $e) {

            Log::error('ERROR CREANDO PRODUCTO: ' . $e->getMessage());

            return response()->json([

                'message' => 'Error al crear producto',

                'error' => $e->getMessage()

            ], 500);
        }
    }

    public function show($id)
    {
        return response()->json([
            'data' => Producto::with('categoria')->findOrFail($id)
        ]);
    }

    public function update(ProductoRequest $request, $id)
    {
        try {

            $producto = Producto::findOrFail($id);

            $data = [

                'nombre' => strip_tags($request->nombre),

                'codigo' => strip_tags($request->codigo),

                'tipo' => strip_tags($request->tipo),

                'precio' => $request->precio,

                'stock' => $request->stock,

                'stock_minimo' => $request->stock_minimo ?? 0,

                'categoria_id' => $request->categoria_id,
            ];

            if ($request->hasFile('imagen')) {

                if ($producto->imagen) {

                    Storage::disk('public')
                        ->delete($producto->imagen);
                }

                $data['imagen'] = $request
                    ->file('imagen')
                    ->store('productos', 'public');
            }

            $producto->update($data);

            return response()->json([

                'message' => 'Producto actualizado correctamente',

                'data' => $producto->load('categoria')
            ]);

        } catch (\Exception $e) {

            Log::error('ERROR ACTUALIZANDO PRODUCTO: ' . $e->getMessage());

            return response()->json([

                'message' => 'Error al actualizar producto',

                'error' => $e->getMessage()

            ], 500);
        }
    }

    public function destroy($id)
    {
        try {

            $producto = Producto::findOrFail($id);

            if ($producto->imagen) {

                Storage::disk('public')
                    ->delete($producto->imagen);
            }

            $producto->delete();

            return response()->json([

                'message' => 'Producto eliminado correctamente'
            ]);

        } catch (\Exception $e) {

            Log::error('ERROR ELIMINANDO PRODUCTO: ' . $e->getMessage());

            return response()->json([

                'message' => 'Error al eliminar producto',

                'error' => $e->getMessage()

            ], 500);
        }
    }

    public function stockBajo()
    {
        return Producto::with('categoria')
            ->whereColumn('stock', '<=', 'stock_minimo')
            ->get();
    }

    public function exportExcel()
    {
        return Excel::download(
            new ProductosExport,
            'productos.xlsx'
        );
    }
}

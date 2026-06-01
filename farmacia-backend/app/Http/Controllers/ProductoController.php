<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Support\Facades\Storage;
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
        $imagen = null;

        if ($request->hasFile('imagen')) {
            $imagen = $request->file('imagen')->store('productos', 'public');
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
    }

    public function show($id)
    {
        return response()->json([
            'data' => Producto::with('categoria')->findOrFail($id)
        ]);
    }

    public function update(ProductoRequest $request, $id)
    {
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
                Storage::disk('public')->delete($producto->imagen);
            }

            $data['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $producto->update($data);

        return response()->json([
            'message' => 'Producto actualizado correctamente',
            'data' => $producto->load('categoria')
        ]);
    }

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);

        if ($producto->imagen) {
            Storage::disk('public')->delete($producto->imagen);
        }

        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ]);
    }

    public function stockBajo()
    {
        return Producto::with('categoria')
            ->whereColumn('stock', '<=', 'stock_minimo')
            ->get();
    }

    public function exportExcel()
    {
        return Excel::download(new ProductosExport, 'productos.xlsx');
    }
}

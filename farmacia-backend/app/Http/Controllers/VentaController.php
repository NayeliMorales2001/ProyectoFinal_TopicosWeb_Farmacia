<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\Producto;
use App\Models\Auditoria;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class VentaController extends Controller
{
    // =========================================
    // LISTAR
    // =========================================

    public function index()
    {
        return Venta::with(
            'producto',
            'paciente'
        )
        ->latest()
        ->paginate(10);
    }

    // =========================================
    // CREAR
    // =========================================

    public function store(Request $request)
    {
        $request->validate([

            'producto_id' => 'required|exists:productos,id',

            'cantidad' => 'required|integer|min:1',

            'paciente_id' => 'required|exists:pacientes,id'

        ]);

        $producto = Producto::findOrFail(
            $request->producto_id
        );

        // =========================================
        // VALIDAR STOCK
        // =========================================

        if ($producto->stock < $request->cantidad) {

            return response()->json([

                'error' => 'Stock insuficiente'

            ], 400);
        }

        // =========================================
        // TOTAL
        // =========================================

        $total =
            $producto->precio *
            $request->cantidad;

        // =========================================
        // CREAR VENTA
        // =========================================

        $venta = Venta::create([

            'producto_id' => $producto->id,

            'paciente_id' => $request->paciente_id,

            'cantidad' => $request->cantidad,

            'precio' => $producto->precio,

            'total' => $total

        ]);

        // =========================================
        // DESCONTAR STOCK
        // =========================================

        $producto->stock -= $request->cantidad;

        $producto->save();

        // =========================================
        // AUDITORIA
        // =========================================

        Auditoria::create([

            'user_id' => auth()->id(),

            'accion' => 'CREAR',

            'tabla' => 'ventas',

            'descripcion' =>
                'Venta registrada ID: ' . $venta->id,

            'ip' => request()->ip()

        ]);

        return response()->json([

            'message' => 'Venta creada correctamente',

            'data' => $venta->load(
                'producto',
                'paciente'
            )

        ], 201);
    }

    // =========================================
    // MOSTRAR
    // =========================================

    public function show($id)
    {
        $venta = Venta::with(
            'producto',
            'paciente'
        )->findOrFail($id);

        return response()->json([

            'data' => $venta

        ]);
    }

    // =========================================
    // ELIMINAR
    // =========================================

    public function destroy($id)
    {
        $venta = Venta::findOrFail($id);

        // =========================================
        // DEVOLVER STOCK
        // =========================================

        $producto = Producto::find(
            $venta->producto_id
        );

        if ($producto) {

            $producto->stock += $venta->cantidad;

            $producto->save();
        }

        // =========================================
        // AUDITORIA
        // =========================================

        Auditoria::create([

            'user_id' => auth()->id(),

            'accion' => 'ELIMINAR',

            'tabla' => 'ventas',

            'descripcion' =>
                'Venta eliminada ID: ' . $venta->id,

            'ip' => request()->ip()

        ]);

        $venta->delete();

        return response()->json([

            'message' => 'Venta eliminada correctamente'

        ]);
    }

    // =========================================
    // PDF
    // =========================================

    public function pdf($id)
    {
        $venta = Venta::with(
            'producto',
            'paciente'
        )->findOrFail($id);

        $pdf = Pdf::loadView(
            'pdf.receta',
            compact('venta')
        );

        return $pdf->download(
            'venta_'.$venta->id.'.pdf'
        );
    }

    // =========================================
    // HISTORIAL
    // =========================================

    public function historial()
    {
        $ventas = Venta::with(
            'producto',
            'paciente'
        )
        ->latest()
        ->paginate(10);

        return response()->json($ventas);
    }


}

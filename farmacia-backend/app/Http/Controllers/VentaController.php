<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\VentaDetalle;
use App\Models\Producto;
use App\Models\Auditoria;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    // =========================================
    // LISTAR
    // =========================================

    public function index()
    {
        return response()->json([
            'data' => Venta::with([
                'paciente',
                'medico',
                'detalles.producto'
            ])
            ->latest()
            ->get()
        ]);
    }

    // =========================================
    // CREAR
    // =========================================

    public function store(Request $request)
    {
        $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'medico_id' => 'required|exists:medicos,id',
            'productos' => 'required|array|min:1'
        ]);

        DB::beginTransaction();

        try {

            $totalVenta = 0;

            foreach ($request->productos as $item) {

                $producto = Producto::findOrFail(
                    $item['producto_id']
                );

                if ($producto->stock < $item['cantidad']) {

                    return response()->json([
                        'message' =>
                        'Stock insuficiente para ' .
                        $producto->nombre
                    ], 400);
                }

                $totalVenta +=
                    $producto->precio *
                    $item['cantidad'];
            }

            // ==========================
            // CREAR CABECERA
            // ==========================

            $venta = Venta::create([
                'paciente_id' => $request->paciente_id,
                'medico_id' => $request->medico_id,
                'total' => $totalVenta
            ]);

            // ==========================
            // DETALLES
            // ==========================

            foreach ($request->productos as $item) {

                $producto = Producto::findOrFail(
                    $item['producto_id']
                );

                $subtotal =
                    $producto->precio *
                    $item['cantidad'];

                VentaDetalle::create([

                    'venta_id' => $venta->id,

                    'producto_id' => $producto->id,

                    'cantidad' => $item['cantidad'],

                    'precio' => $producto->precio,

                    'subtotal' => $subtotal

                ]);

                $producto->stock -=
                    $item['cantidad'];

                $producto->save();
            }

            try {

                Auditoria::create([
                    'user_id' => auth()->id(),
                    'accion' => 'CREAR',
                    'tabla' => 'ventas',
                    'registro_id' => $venta->id,
                    'datos_nuevos' => json_encode($venta),
                    'ip' => request()->ip()
                ]);

            } catch (\Exception $e) {
            }

            DB::commit();

            return response()->json([
                'message' => 'Venta registrada correctamente'
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // =========================================
    // MOSTRAR
    // =========================================

    public function show($id)
    {
        $venta = Venta::with([
            'paciente',
            'medico',
            'detalles.producto'
        ])->findOrFail($id);

        return response()->json([
            'data' => $venta
        ]);
    }

    // =========================================
    // ELIMINAR
    // =========================================

    public function destroy($id)
    {
        DB::beginTransaction();

        try {

            $venta = Venta::with(
                'detalles'
            )->findOrFail($id);

            foreach ($venta->detalles as $detalle) {

                $producto = Producto::find(
                    $detalle->producto_id
                );

                if ($producto) {

                    $producto->stock +=
                        $detalle->cantidad;

                    $producto->save();
                }
            }

            try {

                Auditoria::create([
                    'user_id' => auth()->id(),
                    'accion' => 'ELIMINAR',
                    'tabla' => 'ventas',
                    'registro_id' => $venta->id,
                    'datos_anteriores' => json_encode($venta),
                    'ip' => request()->ip()
                ]);

            } catch (\Exception $e) {
            }

            $venta->detalles()->delete();

            $venta->delete();

            DB::commit();

            return response()->json([
                'message' => 'Venta eliminada correctamente'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // =========================================
    // PDF
    // =========================================

    public function pdf($id)
    {
        $venta = Venta::with([
            'paciente',
            'medico',
            'detalles.producto'
        ])->findOrFail($id);

        $pdf = Pdf::loadView(
            'pdf.receta',
            compact('venta')
        );

        return $pdf->download(
            'venta_' . $venta->id . '.pdf'
        );
    }

    // =========================================
    // HISTORIAL
    // =========================================

    public function historial()
    {
        return response()->json([
            'data' => Venta::with([
                'paciente',
                'medico',
                'detalles.producto'
            ])
            ->latest()
            ->get()
        ]);
    }
}

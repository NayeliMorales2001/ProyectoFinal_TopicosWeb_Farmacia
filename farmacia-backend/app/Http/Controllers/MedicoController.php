<?php

namespace App\Http\Controllers;

use App\Models\Medico;
use Illuminate\Http\Request;

class MedicoController extends Controller
{
    // =========================================
    // LISTAR
    // =========================================

    public function index()
    {
        return response()->json(
            Medico::latest()->get()
        );
    }

    // =========================================
    // GUARDAR
    // =========================================

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'especialidad' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:255',
            'cedula' => 'nullable|string|max:255',
        ]);

        $medico = Medico::create([
            'nombre' => $request->nombre,
            'especialidad' => $request->especialidad,
            'telefono' => $request->telefono,
            'cedula' => $request->cedula,
        ]);

        return response()->json($medico, 201);
    }

    // =========================================
    // MOSTRAR
    // =========================================

    public function show($id)
    {
        return Medico::findOrFail($id);
    }

    // =========================================
    // ACTUALIZAR
    // =========================================

    public function update(Request $request, $id)
    {
        $medico = Medico::findOrFail($id);

        $medico->update([
            'nombre' => $request->nombre,
            'especialidad' => $request->especialidad,
            'telefono' => $request->telefono,
            'cedula' => $request->cedula,
        ]);

        return response()->json($medico);
    }

    // =========================================
    // ELIMINAR
    // =========================================

    public function destroy($id)
    {
        Medico::destroy($id);

        return response()->json([
            'ok' => true
        ]);
    }
}

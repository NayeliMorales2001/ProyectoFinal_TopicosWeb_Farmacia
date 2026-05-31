<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;

class PacienteController extends Controller
{
    // =========================================
    // LISTAR
    // =========================================
    public function index()
    {
        return response()->json(
            Paciente::latest()->get()
        );
    }

    // =========================================
    // CREAR
    // =========================================
    public function store(Request $request)
    {
        $request->validate([

            'nombre' => 'required|string|max:255',

            'edad' => 'required|integer',

            'doctor' => 'required|string|max:255',

            'direccion' => 'nullable|string',

            'medicamento' => 'nullable|string',

            'dosis' => 'nullable|string',

            'fecha' => 'nullable|date',

            'foto' => 'nullable'

        ]);

        $paciente = Paciente::create($request->all());

        return response()->json([

            'message' => 'Paciente creado correctamente',

            'data' => $paciente

        ], 201);
    }

    // =========================================
    // MOSTRAR
    // =========================================
    public function show($id)
    {
        return response()->json(
            Paciente::findOrFail($id)
        );
    }

    // =========================================
    // ACTUALIZAR
    // =========================================
    public function update(Request $request, $id)
    {
        $request->validate([

            'nombre' => 'required|string|max:255',

            'edad' => 'required|integer',

            'doctor' => 'required|string|max:255',

            'direccion' => 'nullable|string',

            'medicamento' => 'nullable|string',

            'dosis' => 'nullable|string',

            'fecha' => 'nullable|date',

            'foto' => 'nullable'

        ]);

        $paciente = Paciente::findOrFail($id);

        $paciente->update($request->all());

        return response()->json([

            'message' => 'Paciente actualizado correctamente',

            'data' => $paciente

        ]);
    }

    // =========================================
    // ELIMINAR
    // =========================================
    public function destroy($id)
    {
        Paciente::destroy($id);

        return response()->json([

            'message' => 'Paciente eliminado'

        ]);
    }
}

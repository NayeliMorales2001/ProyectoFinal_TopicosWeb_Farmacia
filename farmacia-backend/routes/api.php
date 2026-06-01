<?php

use Illuminate\Support\Facades\Route;

// =========================================
// CONTROLLERS
// =========================================

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\MedicoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;

// =========================================
// RUTAS PÚBLICAS
// =========================================

Route::middleware('throttle:60,1')->group(function () {

    // =========================================
    // AUTH
    // =========================================

    Route::post('/login', [AuthController::class, 'login']);

    Route::post('/register', [AuthController::class, 'register']);

    // =========================================
    // PASSWORD RESET
    // =========================================

    Route::post('/forgot-password', [PasswordResetController::class, 'forgot']);

    Route::post('/reset-password', [PasswordResetController::class, 'reset']);

    // =========================================
    // PDF PÚBLICO
    // =========================================

   // Route::get('/ventas/pdf/{id}', [VentaController::class, 'pdf']);
});

// =========================================
// RUTAS PROTEGIDAS
// =========================================

Route::middleware([
    'auth:sanctum',
    'throttle:100,1'
])->group(function () {

    // =========================================
    // AUTH
    // =========================================

    Route::post('/logout', [AuthController::class, 'logout']);

    // =========================================
    // PRODUCTOS
    // =========================================

    Route::get('/productos', [ProductoController::class, 'index']);

    Route::get('/productos/stock-bajo', [ProductoController::class, 'stockBajo']);

    Route::get('/productos/excel', [ProductoController::class, 'exportExcel']);

    Route::get('/productos/{id}', [ProductoController::class, 'show']);

    // =========================================
    // SOLO ADMIN
    // =========================================

    Route::middleware(['role:admin'])->group(function () {

        Route::post('/productos', [ProductoController::class, 'store']);

        Route::put('/productos/{id}', [ProductoController::class, 'update']);

        Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);

        Route::apiResource('users', UserController::class);
    });

  // =========================================
// CATEGORÍAS
// =========================================

Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{categoria}', [CategoriaController::class, 'show']);

Route::middleware(['role:admin'])->group(function () {

    Route::post('/categorias', [CategoriaController::class, 'store']);

    Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);

    Route::delete('/categorias/{categoria}', [CategoriaController::class, 'destroy']);

});

// =========================================
// MÉDICOS
// =========================================

Route::get('/medicos', [MedicoController::class, 'index']);
Route::get('/medicos/{medico}', [MedicoController::class, 'show']);

Route::middleware(['role:admin'])->group(function () {

    Route::post('/medicos', [MedicoController::class, 'store']);

    Route::put('/medicos/{medico}', [MedicoController::class, 'update']);

    Route::delete('/medicos/{medico}', [MedicoController::class, 'destroy']);

});

    // =========================================
    // VENTAS
    // =========================================

    Route::apiResource('ventas', VentaController::class);

    Route::get('/ventas-historial', [VentaController::class, 'historial']);

    Route::get('/ventas/pdf/{id}', [VentaController::class, 'pdf']);

    // =========================================
    // PACIENTES
    // =========================================

    Route::apiResource('pacientes', PacienteController::class);

    });

    Route::get('/test', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API funcionando correctamente'
    ]);
});


    Route::middleware('auth:sanctum')->get('/debug-user', function (\Illuminate\Http\Request $request) {

    return response()->json([
        'user' => $request->user(),
        'roles' => $request->user()?->getRoleNames()
    ]);

});

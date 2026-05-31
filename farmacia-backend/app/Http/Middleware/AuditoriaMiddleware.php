<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Auditoria;
use Illuminate\Support\Facades\Log;

class AuditoriaMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        try {

            if (
                auth()->check() &&
                !$request->is('api/login') &&
                !$request->is('api/register')
            ) {

                Auditoria::create([

                    'user_id' => auth()->id(),

                    'accion' => $request->method(),

                    'tabla' => $request->path(),

                    'registro_id' => null,

                    'datos_anteriores' => null,

                    'datos_nuevos' => $request->all(),

                    'ip' => $request->ip(),
                ]);
            }

        } catch (\Throwable $e) {

            Log::error('AUDITORIA ERROR: ' . $e->getMessage());

        }

        return $response;
    }
}

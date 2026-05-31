<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(
        Request $request,
        Closure $next,
        $role
    ): Response {

        if (
            !$request->user() ||
            !$request->user()->hasRole($role)
        ) {

            return response()->json([

                'message' => 'No autorizado'

            ], 403);

        }

        return $next($request);
    }
}

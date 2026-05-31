<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

class LogActivity
{
    public function handle($request, Closure $next)
    {
        Log::info('Usuario accedió', [

            'url' => $request->url(),

            'method' => $request->method(),

            'ip' => $request->ip(),

            'user' => auth()->user()

        ]);

        return $next($request);
    }
}

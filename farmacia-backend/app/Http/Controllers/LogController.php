<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogController extends Controller
{
    public function store404(Request $request)
    {
        Log::warning('404 Detectado', [
            'url' => $request->url,
            'user_agent' => $request->userAgent(),
            'ip' => $request->ip(),
            'time' => now()
        ]);

        return response()->json([
            'message' => '404 registrado'
        ]);
    }
}

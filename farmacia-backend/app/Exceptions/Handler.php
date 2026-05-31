<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use App\Models\ErrorLog;
use Illuminate\Support\Facades\Auth;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->reportable(function (Throwable $e) {

    ErrorLog::create([

        'message' => $e->getMessage(),

        'trace' => $e->getTraceAsString(),

        'url' => request()->fullUrl(),

        'method' => request()->method(),

        'user_id' => Auth::id()
    ]);
});
    }

    public function render($request, Throwable $exception)
{
    if ($request->expectsJson()) {

        return response()->json([

            'message' => 'Error del servidor',

            'error' => $exception->getMessage()

        ], 500);
    }

    return parent::render($request, $exception);
}
}

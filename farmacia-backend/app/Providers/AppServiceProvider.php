<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Producto;
use App\Observers\ProductoObserver;

// IMPORTS
use App\Interfaces\ProductoRepositoryInterface;
use App\Repositories\ProductoRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // BIND REPOSITORY
        $this->app->bind(
            ProductoRepositoryInterface::class,
            ProductoRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Producto::observe(
        ProductoObserver::class
    );
    }
}

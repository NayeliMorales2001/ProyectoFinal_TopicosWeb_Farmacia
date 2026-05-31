<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('ventas', function (Blueprint $table) {
        $table->id();

        $table->foreignId('producto_id')
              ->constrained('productos')
              ->onDelete('cascade');

        $table->integer('cantidad');
        $table->decimal('precio', 10, 2);
        $table->decimal('total', 10, 2);

        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
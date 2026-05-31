<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auditorias', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->onDelete('set null');

            $table->string('accion');

            $table->string('tabla');

            $table->unsignedBigInteger('registro_id')
                ->nullable();

            $table->json('datos_anteriores')
                ->nullable();

            $table->json('datos_nuevos')
                ->nullable();

            $table->ipAddress('ip')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};

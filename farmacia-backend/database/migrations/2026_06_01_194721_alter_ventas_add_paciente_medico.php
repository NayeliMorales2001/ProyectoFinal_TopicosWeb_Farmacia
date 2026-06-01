<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {

            $table->foreignId('paciente_id')
                ->nullable()
                ->after('producto_id')
                ->constrained('pacientes')
                ->nullOnDelete();

            $table->foreignId('medico_id')
                ->nullable()
                ->after('paciente_id')
                ->constrained('medicos')
                ->nullOnDelete();

        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {

            $table->dropForeign(['paciente_id']);
            $table->dropForeign(['medico_id']);

            $table->dropColumn([
                'paciente_id',
                'medico_id'
            ]);
        });
    }
};

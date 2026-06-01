<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {

            $table->unsignedBigInteger('paciente_id')->after('producto_id');
            $table->unsignedBigInteger('medico_id')->after('paciente_id');

            $table->foreign('paciente_id')
                ->references('id')
                ->on('pacientes')
                ->onDelete('cascade');

            $table->foreign('medico_id')
                ->references('id')
                ->on('medicos')
                ->onDelete('cascade');
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

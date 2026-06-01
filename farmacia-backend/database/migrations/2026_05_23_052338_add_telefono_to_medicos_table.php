<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medicos', function (Blueprint $table) {

            $table->string('telefono')
                ->nullable()
                ->after('especialidad');
        });

        Schema::table('medicos', function (Blueprint $table) {
    $table->string('telefono')->nullable();
});
    }

    public function down(): void
    {
        Schema::table('medicos', function (Blueprint $table) {

            $table->dropColumn('telefono');
        });
    }
};

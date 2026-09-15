<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('budayas', function (Blueprint $table) {
            $table->boolean('has_location')->default(false)->after('longitude');
        });
    }

    public function down(): void
    {
        Schema::table('budayas', function (Blueprint $table) {
            $table->dropColumn('has_location');
        });
    }
};
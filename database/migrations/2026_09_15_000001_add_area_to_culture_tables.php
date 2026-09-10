<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Lanjutan db.md item A: kolom area eksplisit juga untuk
     * budayas/kuliners/kerajinans agar scope area AI berlaku penuh.
     */
    public function up(): void
    {
        foreach (['budayas', 'kuliners', 'kerajinans'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                if (! Schema::hasColumn($table->getTable(), 'area')) {
                    $table->string('area', 100)->nullable()->after('slug')->index();
                }
            });
        }
    }

    public function down(): void
    {
        foreach (['budayas', 'kuliners', 'kerajinans'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                if (Schema::hasColumn($table->getTable(), 'area')) {
                    $table->dropColumn('area');
                }
            });
        }
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * issue.md (Kategori Destinasi Dinamis): penanda parent agar categories
     * bisa berfungsi sebagai child dari Destination (parent = 'destination').
     * Baris pilar portal (destinasi, budaya, ...) memakai parent = null.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (! Schema::hasColumn('categories', 'parent')) {
                $table->string('parent', 50)->nullable()->after('slug')->index();
            }
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'parent')) {
                $table->dropColumn('parent');
            }
        });
    }
};

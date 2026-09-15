<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Kolom `parent` pada categories tidak pernah dipakai (skema pilar portal
     * memakai parent = null; kategori dinamis ditangani `destination_category_id`).
     * Beri label pada skema.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'parent')) {
                $table->dropColumn('parent');
            }
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (! Schema::hasColumn('categories', 'parent')) {
                $table->string('parent', 50)->nullable()->after('slug')->index();
            }
        });
    }
};
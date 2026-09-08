<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * issue.md §3c: destinasis.category (string) → category_id FK → categories.id,
     * plus latitude/longitude as decimal(10,7).
     *
     * Transitional strategy: ADD category_id (nullable) and backfill it,
     * but KEEP the legacy `category` string column until PortalController
     * is fully migrated to the new tables (budayas/kuliners/kerajinans).
     * A follow-up migration will drop `category` once the portal no longer reads it.
     */
    public function up(): void
    {
        Schema::table('destinasis', function (Blueprint $table) {
            if (! Schema::hasColumn('destinasis', 'category_id')) {
                $table->foreignId('category_id')->nullable()->after('slug')->constrained('categories')->nullOnDelete();
            }
        });

        // Backfill category_id from legacy category string via categories.slug
        // (pillar slugs: destinasi/budaya/kuliner/kerajinan exist in categories table).
        try {
            $map = DB::table('categories')->pluck('id', 'slug');
            foreach ($map as $slug => $id) {
                DB::table('destinasis')->where('category', $slug)->whereNull('category_id')->update(['category_id' => $id]);
            }
        } catch (\Throwable $e) {
            // seeding order may vary; backfill is best-effort
        }

        // Normalize coords: empty strings → null so decimal cast works.
        try {
            DB::table('destinasis')->where('latitude', '')->update(['latitude' => null]);
            DB::table('destinasis')->where('longitude', '')->update(['longitude' => null]);
        } catch (\Throwable $e) {
        }

        // Convert varchar coords → decimal(10,7). Raw ALTER avoids doctrine/dbal dependency.
        if (DB::getDriverName() === 'mysql') {
            try {
                DB::statement('ALTER TABLE `destinasis` MODIFY `latitude` DECIMAL(10,7) NULL');
            } catch (\Throwable $e) {
            }
            try {
                DB::statement('ALTER TABLE `destinasis` MODIFY `longitude` DECIMAL(10,7) NULL');
            } catch (\Throwable $e) {
            }
        }
    }

    public function down(): void
    {
        Schema::table('destinasis', function (Blueprint $table) {
            if (Schema::hasColumn('destinasis', 'category_id')) {
                $table->dropConstrainedForeignId('category_id');
            }
        });
        // NOTE: latitude/longitude type revert intentionally omitted (data-safe).
    }
};

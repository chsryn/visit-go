<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * issue.md §3d: events.location (string) → latitude/longitude decimal(10,7)
     * + location_name (string label).
     *
     * Transitional: ADD new columns, backfill location_name from location,
     * KEEP legacy `location` until portal/admin no longer reads it.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (! Schema::hasColumn('events', 'location_name')) {
                $table->string('location_name')->nullable()->after('month');
            }
        });

        try {
            DB::table('events')->whereNull('location_name')->update([
                'location_name' => DB::raw('`location`'),
            ]);
        } catch (\Throwable $e) {
        }

        try {
            DB::table('events')->where('latitude', '')->update(['latitude' => null]);
            DB::table('events')->where('longitude', '')->update(['longitude' => null]);
        } catch (\Throwable $e) {
        }

        if (DB::getDriverName() === 'mysql') {
            try {
                DB::statement('ALTER TABLE `events` MODIFY `latitude` DECIMAL(10,7) NULL');
            } catch (\Throwable $e) {
            }
            try {
                DB::statement('ALTER TABLE `events` MODIFY `longitude` DECIMAL(10,7) NULL');
            } catch (\Throwable $e) {
            }
        }
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'location_name')) {
                $table->dropColumn('location_name');
            }
        });
    }
};

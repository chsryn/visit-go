<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Pastikan kolom geo destinasis ada SEBELUM migrasi 09-12 (baca latitude/
     * longitude) dan 09-14 (baca location) berjalan. Idempotent: di DB lama
     * yang kolomnya sudah ada (manual/iterasi dulu), migrasi ini no-op.
     */
    public function up(): void
    {
        Schema::table('destinasis', function (Blueprint $table) {
            if (! Schema::hasColumn('destinasis', 'location')) {
                $table->string('location', 200)->nullable()->after('body');
            }
            if (! Schema::hasColumn('destinasis', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable()->after('location');
            }
            if (! Schema::hasColumn('destinasis', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            }
        });
    }

    public function down(): void
    {
        Schema::table('destinasis', function (Blueprint $table) {
            foreach (['longitude', 'latitude', 'location'] as $col) {
                if (Schema::hasColumn('destinasis', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};

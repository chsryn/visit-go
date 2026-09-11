<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * UMKM setara isi kuliner: koordinat (peta), tags (preferensi AI).
     */
    public function up(): void
    {
        Schema::table('umkms', function (Blueprint $table) {
            if (! Schema::hasColumn('umkms', 'latitude')) {
                $table->decimal('latitude', 10, 7)->nullable()->after('kontak');
            }
            if (! Schema::hasColumn('umkms', 'longitude')) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            }
            if (! Schema::hasColumn('umkms', 'tags')) {
                $table->text('tags')->nullable()->after('longitude');
            }
        });
    }

    public function down(): void
    {
        Schema::table('umkms', function (Blueprint $table) {
            foreach (['tags', 'longitude', 'latitude'] as $col) {
                if (Schema::hasColumn('umkms', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};

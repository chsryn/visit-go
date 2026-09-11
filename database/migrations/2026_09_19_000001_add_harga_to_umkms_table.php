<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('umkms', function (Blueprint $table) {
            if (! Schema::hasColumn('umkms', 'harga')) {
                $table->integer('harga')->nullable()->after('kontak');
            }
        });
    }

    public function down(): void
    {
        Schema::table('umkms', function (Blueprint $table) {
            if (Schema::hasColumn('umkms', 'harga')) {
                $table->dropColumn('harga');
            }
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * umkm.md: tabel UMKM (jenis teks bebas agar dinamis) + relasi
     * kuliner → UMKM via umkm_id.
     */
    /**
     * Tabel umkms lama (skema salah, kosong) di-rebuild bersih.
     */
    public function up(): void
    {
        Schema::dropIfExists('umkms');
        Schema::create('umkms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('jenis', 50)->index();
            $table->text('body')->nullable();
            $table->string('kontak', 200)->nullable();
            $table->string('image')->nullable();
            $table->string('alt')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('kuliners', function (Blueprint $table) {
            if (! Schema::hasColumn('kuliners', 'umkm_id')) {
                $table->foreignId('umkm_id')->nullable()->after('slug')->constrained('umkms')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('kuliners', function (Blueprint $table) {
            if (Schema::hasColumn('kuliners', 'umkm_id')) {
                $table->dropConstrainedForeignId('umkm_id');
            }
        });
        Schema::dropIfExists('umkms');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * issue.md (Estimasi Harga): satu destinasi punya banyak item harga
     * (tiket masuk, wahana/aktivitas, sewa fasilitas, lainnya) untuk
     * dipakai AI Assistant menghitung perkiraan biaya liburan.
     */
    public function up(): void
    {
        Schema::create('destination_price_estimates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destinasi_id')->constrained('destinasis')->cascadeOnDelete();
            $table->string('jenis', 30)->index(); // tiket_masuk, wahana, sewa, lainnya
            $table->string('label');
            $table->unsignedInteger('harga'); // rupiah
            $table->string('satuan', 50)->nullable(); // orang, unit, hari, paket, ...
            $table->string('catatan', 255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destination_price_estimates');
    }
};

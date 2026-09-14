<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('kerajinan_category_umkm')) {
            Schema::create('kerajinan_category_umkm', function (Blueprint $table) {
                $table->id();
                $table->foreignId('kerajinan_category_id')->constrained('kerajinan_categories')->cascadeOnDelete();
                $table->foreignId('umkm_id')->constrained('umkms')->cascadeOnDelete();
                $table->unique(['kerajinan_category_id', 'umkm_id']);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('kerajinan_category_umkm');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('kuliner_category_umkm')) {
            Schema::create('kuliner_category_umkm', function (Blueprint $table) {
                $table->id();
                $table->foreignId('kuliner_category_id')->constrained('kuliner_categories')->cascadeOnDelete();
                $table->foreignId('umkm_id')->constrained('umkms')->cascadeOnDelete();
                $table->unique(['kuliner_category_id', 'umkm_id']);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('kuliner_category_umkm');
    }
};

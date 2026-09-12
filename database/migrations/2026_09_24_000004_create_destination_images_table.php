<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Satu destinasi bisa punya banyak foto (selain foto sampul di destinasis.image).
     */
    public function up(): void
    {
        Schema::create('destination_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destinasi_id')->constrained('destinasis')->cascadeOnDelete();
            $table->string('image');
            $table->string('alt')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destination_images');
    }
};

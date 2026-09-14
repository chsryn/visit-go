<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('kerajinan_categories')) {
            Schema::create('kerajinan_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name', 50)->unique();
                $table->string('slug', 50)->unique();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('kerajinan_categories');
    }
};

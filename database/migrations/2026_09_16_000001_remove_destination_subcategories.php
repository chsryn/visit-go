<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Destinasi kembali flat tanpa sub-kategori: hapus relasi
     * destinasis.category_id dan baris child categories (parent=destination).
     */
    public function up(): void
    {
        DB::table('categories')->where('parent', 'destination')->delete();

        Schema::table('destinasis', function (Blueprint $table) {
            if (Schema::hasColumn('destinasis', 'category_id')) {
                $table->dropConstrainedForeignId('category_id');
            }
        });

        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'parent')) {
                $table->dropColumn('parent');
            }
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (! Schema::hasColumn('categories', 'parent')) {
                $table->string('parent', 50)->nullable()->after('slug')->index();
            }
        });

        Schema::table('destinasis', function (Blueprint $table) {
            if (! Schema::hasColumn('destinasis', 'category_id')) {
                $table->foreignId('category_id')->nullable()->after('slug')->constrained('categories')->nullOnDelete();
            }
        });
        // Catatan: baris child categories tidak dikembalikan (buat ulang via seeder bila perlu).
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Backfill UMKM yang masih pakai umkm_jenis_id ke pivot kategori
        if (Schema::hasTable('umkms') && Schema::hasColumn('umkms', 'umkm_jenis_id') && Schema::hasTable('umkm_jenis')) {
            $umkms = DB::table('umkms')->whereNotNull('umkm_jenis_id')->get(['id', 'umkm_jenis_id']);
            foreach ($umkms as $u) {
                $jenis = DB::table('umkm_jenis')->where('id', $u->umkm_jenis_id)->first();
                if (! $jenis) continue;
                $slug = $jenis->slug;
                $hasKuliner = DB::table('kuliner_category_umkm')->where('umkm_id', $u->id)->exists();
                $hasKerajinan = Schema::hasTable('kerajinan_category_umkm') ? DB::table('kerajinan_category_umkm')->where('umkm_id', $u->id)->exists() : false;
                if ($slug === 'kuliner' && ! $hasKuliner) {
                    $fallback = DB::table('kuliner_categories')->where('slug', 'binthe-biluhuta')->value('id')
                        ?? DB::table('kuliner_categories')->orderBy('id')->value('id');
                    if ($fallback) {
                        DB::table('kuliner_category_umkm')->updateOrInsert(
                            ['kuliner_category_id' => $fallback, 'umkm_id' => $u->id],
                            ['created_at' => now(), 'updated_at' => now()]
                        );
                    }
                }
                if ($slug === 'kerajinan' && ! $hasKerajinan && Schema::hasTable('kerajinan_category_umkm')) {
                    $fallback = DB::table('kerajinan_categories')->where('slug', 'sulaman-karawo')->value('id')
                        ?? DB::table('kerajinan_categories')->orderBy('id')->value('id');
                    if ($fallback) {
                        DB::table('kerajinan_category_umkm')->updateOrInsert(
                            ['kerajinan_category_id' => $fallback, 'umkm_id' => $u->id],
                            ['created_at' => now(), 'updated_at' => now()]
                        );
                    }
                }
            }
        }

        if (Schema::hasTable('umkms') && Schema::hasColumn('umkms', 'umkm_jenis_id')) {
            Schema::table('umkms', function (Blueprint $table) {
                try {
                    $table->dropConstrainedForeignId('umkm_jenis_id');
                } catch (\Throwable $e) {
                    try { $table->dropForeign(['umkm_jenis_id']); } catch (\Throwable $e2) {}
                }
            });
            if (Schema::hasColumn('umkms', 'umkm_jenis_id')) {
                Schema::table('umkms', function (Blueprint $table) {
                    $table->dropColumn('umkm_jenis_id');
                });
            }
        }

        Schema::dropIfExists('umkm_jenis');
    }

    public function down(): void
    {
        if (! Schema::hasTable('umkm_jenis')) {
            Schema::create('umkm_jenis', function (Blueprint $table) {
                $table->id();
                $table->string('name', 50)->unique();
                $table->string('slug', 50)->unique();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
            DB::table('umkm_jenis')->updateOrInsert(['slug' => 'kuliner'], ['name' => 'kuliner', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]);
            DB::table('umkm_jenis')->updateOrInsert(['slug' => 'kerajinan'], ['name' => 'kerajinan', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]);
        }
        if (Schema::hasTable('umkms') && ! Schema::hasColumn('umkms', 'umkm_jenis_id')) {
            Schema::table('umkms', function (Blueprint $table) {
                $table->foreignId('umkm_jenis_id')->nullable()->after('slug')->constrained('umkm_jenis')->nullOnDelete();
            });
        }
    }
};

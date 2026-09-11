<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Rombak UMKM: jenis jadi tabel master (dropdown), tambah skala_usaha
     * (mikro/kecil/menengah) + produk. Data jenis lama dimigrasikan.
     */
    public function up(): void
    {
        Schema::create('umkm_jenis', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('slug', 50)->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Daftarkan jenis yang sudah dipakai sebagai master
        $map = [];
        foreach (DB::table('umkms')->selectRaw('DISTINCT jenis')->whereNotNull('jenis')->pluck('jenis') as $jenis) {
            $jenis = trim((string) $jenis);
            if ($jenis === '' || isset($map[strtolower($jenis)])) {
                continue;
            }
            $id = DB::table('umkm_jenis')->insertGetId([
                'name' => $jenis,
                'slug' => Str::slug($jenis) ?: Str::lower(Str::random(6)),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $map[strtolower($jenis)] = $id;
        }

        Schema::table('umkms', function (Blueprint $table) {
            if (! Schema::hasColumn('umkms', 'umkm_jenis_id')) {
                $table->foreignId('umkm_jenis_id')->nullable()->after('slug')->constrained('umkm_jenis')->nullOnDelete();
            }
            if (! Schema::hasColumn('umkms', 'skala_usaha')) {
                $table->string('skala_usaha', 20)->nullable()->after('umkm_jenis_id');
            }
            if (! Schema::hasColumn('umkms', 'produk')) {
                $table->text('produk')->nullable()->after('body');
            }
        });

        // Petakan jenis lama → FK (case-insensitive); skala default mikro
        foreach (DB::table('umkms')->get(['id', 'jenis']) as $row) {
            $key = strtolower(trim((string) $row->jenis));
            DB::table('umkms')->where('id', $row->id)->update([
                'umkm_jenis_id' => $map[$key] ?? null,
                'skala_usaha' => DB::raw('COALESCE(skala_usaha, \'mikro\')'),
            ]);
        }

        Schema::table('umkms', function (Blueprint $table) {
            if (Schema::hasColumn('umkms', 'jenis')) {
                $table->dropColumn('jenis');
            }
        });
    }

    public function down(): void
    {
        Schema::table('umkms', function (Blueprint $table) {
            if (! Schema::hasColumn('umkms', 'jenis')) {
                $table->string('jenis', 50)->nullable()->after('slug');
            }
        });

        DB::table('umkms as u')
            ->leftJoin('umkm_jenis as j', 'j.id', '=', 'u.umkm_jenis_id')
            ->update(['u.jenis' => DB::raw('j.name')]);

        Schema::table('umkms', function (Blueprint $table) {
            if (Schema::hasColumn('umkms', 'umkm_jenis_id')) {
                $table->dropConstrainedForeignId('umkm_jenis_id');
            }
            foreach (['produk', 'skala_usaha'] as $col) {
                if (Schema::hasColumn('umkms', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        Schema::dropIfExists('umkm_jenis');
    }
};

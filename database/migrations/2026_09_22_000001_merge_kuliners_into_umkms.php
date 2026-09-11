<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Kuliner menjadi bagian UMKM: pindahkan seluruh baris kuliners
     * menjadi baris umkms berjenis kuliner, lalu drop tabel kuliners.
     */
    public function up(): void
    {
        $jenisId = DB::table('umkm_jenis')->where('slug', 'kuliner')->value('id');
        if (! $jenisId) {
            $jenisId = DB::table('umkm_jenis')->insertGetId([
                'name' => 'kuliner',
                'slug' => 'kuliner',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach (DB::table('kuliners')->get() as $k) {
            $slug = $k->slug ?: Str::slug($k->name).'-kuliner';
            if (DB::table('umkms')->where('slug', $slug)->exists()) {
                continue; // jangan timpa (mis. dijalankan ulang)
            }
            DB::table('umkms')->insert([
                'name' => $k->name,
                'slug' => $slug,
                'umkm_jenis_id' => $jenisId,
                'skala_usaha' => 'mikro',
                'body' => $k->body,
                'produk' => null,
                'kontak' => null,
                'harga' => $k->harga,
                'image' => $k->image,
                'alt' => $k->alt,
                'latitude' => $k->latitude,
                'longitude' => $k->longitude,
                'tags' => $k->tags ?? null,
                'is_active' => $k->is_active,
                'created_at' => $k->created_at ?? now(),
                'updated_at' => $k->updated_at ?? now(),
            ]);
        }

        Schema::dropIfExists('kuliners');
    }

    public function down(): void
    {
        // Buat ulang skema kuliners kosong (data yang dipindah tidak dikembalikan
        // otomatis — restore dari backup bila rollback diperlukan).
        Schema::create('kuliners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('body');
            $table->string('image')->nullable();
            $table->string('alt')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->integer('harga')->nullable();
            $table->string('area', 100)->nullable();
            $table->text('tags')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
};

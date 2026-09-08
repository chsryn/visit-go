<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Pindahkan baris legacy (category budaya/kuliner/kerajinan) dari
     * tabel destinasis ke tabel barunya masing-masing. Setelah ini
     * destinasis hanya berisi destinasi wisata asli.
     * Idempotent — aman dijalankan ulang.
     */
    public function up(): void
    {
        $targets = ['budaya' => 'budayas', 'kuliner' => 'kuliners', 'kerajinan' => 'kerajinans'];

        foreach ($targets as $category => $table) {
            $rows = DB::table('destinasis')->where('category', $category)->get();

            foreach ($rows as $row) {
                if (! DB::table($table)->where('slug', $row->slug)->exists()) {
                    DB::table($table)->insert([
                        'name' => $row->name,
                        'slug' => $row->slug,
                        'body' => $row->body,
                        'image' => $row->image,
                        'alt' => $row->alt,
                        'latitude' => $row->latitude,
                        'longitude' => $row->longitude,
                        'is_active' => $row->is_active,
                        'created_at' => $row->created_at ?? now(),
                        'updated_at' => $row->updated_at ?? now(),
                    ]);
                }
            }

            DB::table('destinasis')->where('category', $category)->delete();
        }
    }

    public function down(): void
    {
        $targets = ['budayas' => 'budaya', 'kuliners' => 'kuliner', 'kerajinans' => 'kerajinan'];

        foreach ($targets as $table => $category) {
            $rows = DB::table($table)->get();

            foreach ($rows as $row) {
                if (! DB::table('destinasis')->where('slug', $row->slug)->exists()) {
                    DB::table('destinasis')->insert([
                        'name' => $row->name,
                        'slug' => $row->slug,
                        'category' => $category,
                        'body' => $row->body,
                        'image' => $row->image,
                        'alt' => $row->alt,
                        'latitude' => $row->latitude ?? null,
                        'longitude' => $row->longitude ?? null,
                        'is_active' => $row->is_active,
                        'created_at' => $row->created_at ?? now(),
                        'updated_at' => $row->updated_at ?? now(),
                    ]);
                }
            }
        }
    }
};

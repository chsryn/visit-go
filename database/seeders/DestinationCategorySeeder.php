<?php

namespace Database\Seeders;

use App\Models\Destinasi;
use App\Models\DestinationCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DestinationCategorySeeder extends Seeder
{
    /**
     * Master kategori destinasi + contoh 1 destinasi per kategori.
     * Idempotent — aman dijalankan ulang. Hanya mengisi contoh bila
     * kategori belum punya destinasi (data bulk WisataGorontaloSeeder menang).
     */
    public function run(): void
    {
        foreach (['cagar budaya', 'wisata alam'] as $name) {
            DestinationCategory::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'is_active' => true]
            );
        }

        $examples = [
            [
                'name' => 'Benteng Otanaha',
                'slug' => 'benteng-otanaha',
                'kategori' => 'cagar-budaya',
                'body' => 'Contoh destinasi cagar budaya: benteng peninggalan sejarah Gorontalo.',
                'location' => 'Kota Gorontalo',
                'area' => 'Kota Gorontalo',
                'tags' => 'benteng, sejarah, budaya',
            ],
            [
                'name' => 'Danau Limboto',
                'slug' => 'danau-limboto',
                'kategori' => 'wisata-alam',
                'body' => 'Contoh destinasi wisata alam: danau legendaris Gorontalo.',
                'location' => 'Kab. Gorontalo',
                'area' => 'Kab. Gorontalo',
                'tags' => 'danau, alam, keluarga',
            ],
        ];

        foreach ($examples as $e) {
            $catId = DestinationCategory::where('slug', $e['kategori'])->value('id');
            if (! $catId) {
                continue;
            }
            if (Destinasi::where('destination_category_id', $catId)->exists()) {
                continue;
            }
            Destinasi::updateOrCreate(
                ['slug' => $e['slug']],
                [
                    'name' => $e['name'],
                    'category' => 'destinasi',
                    'destination_category_id' => $catId,
                    'body' => $e['body'],
                    'location' => $e['location'],
                    'area' => $e['area'],
                    'tags' => $e['tags'],
                    'is_active' => true,
                ]
            );
        }

        // Jaminan invarian: tak ada destinasi tanpa kategori. Baris dari seeder
        // lain (mis. PortalSeeder) yang belum berkategori dipetakan by rule
        // yang sama dengan backfill migration 2026_09_23.
        $cagarId = DestinationCategory::where('slug', 'cagar-budaya')->value('id');
        $alamId = DestinationCategory::where('slug', 'wisata-alam')->value('id');
        $keywords = ['benteng', 'masjid', 'makam', 'keramat', 'aulia', 'museum', 'menara', 'tower', 'rumah adat', 'desa wisata', 'kampung', 'religi', 'tugu', 'monumen', 'budaya', 'walima', 'bubohu', 'integrasi'];
        foreach (Destinasi::whereNull('destination_category_id')->get(['id', 'name']) as $row) {
            $low = strtolower($row->name);
            $isCagar = false;
            foreach ($keywords as $kw) {
                if (str_contains($low, $kw)) {
                    $isCagar = true;
                    break;
                }
            }
            $row->update(['destination_category_id' => $isCagar ? $cagarId : $alamId]);
        }
    }
}

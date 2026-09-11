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
    }
}

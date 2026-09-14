<?php

namespace Database\Seeders;

use App\Models\KerajinanCategory;
use App\Models\Umkm;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KerajinanCategorySeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Sulaman Karawo', 'Anyaman Rotan', 'Ukiran Kayu', 'Tenun Gorontalo'];

        $ids = [];
        foreach ($names as $name) {
            $cat = KerajinanCategory::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'is_active' => true]
            );
            $ids[$name] = $cat->id;
        }

        $map = [
            'Sulaman Karawo' => ['sulaman-karawo', 'karawo-sulaman-gorontalo'],
            'Anyaman Rotan' => ['anyaman-rotan'],
            'Ukiran Kayu' => ['kerajinan-daerah'],
        ];

        foreach ($map as $catName => $slugs) {
            $catId = $ids[$catName] ?? null;
            if (! $catId) continue;
            $umkms = Umkm::whereIn('slug', $slugs)->get();
            foreach ($umkms as $umkm) {
                $umkm->kerajinanCategories()->syncWithoutDetaching([$catId]);
            }
        }

        // Dummy untuk kategori kosong
        $dummyMap = [
            'Tenun Gorontalo' => ['name' => 'Tenun Gorontalo Motif Karawo', 'slug' => 'tenun-gorontalo', 'body' => 'Tenun khas Gorontalo dengan motif flora Karawo.', 'produk' => 'Kain Tenun'],
        ];
        foreach ($dummyMap as $catName => $data) {
            $catId = $ids[$catName] ?? null;
            if (! $catId) continue;
            $exists = Umkm::whereHas('kerajinanCategories', fn($q)=>$q->where('kerajinan_categories.id',$catId))->exists();
            if (! $exists) {
                $umkm = Umkm::firstOrCreate(
                    ['slug' => $data['slug']],
                    [
                        'name' => $data['name'],
                        'skala_usaha' => 'mikro',
                        'body' => $data['body'],
                        'produk' => $data['produk'],
                        'is_active' => true,
                        'image' => '/storage/portal/kategori-kerajinan.jpg',
                        'alt' => $data['name'],
                    ]
                );
                $umkm->kerajinanCategories()->syncWithoutDetaching([$catId]);
            }
        }

        // Fallback untuk UMKM yang belum punya kategori kerajinan/kuliner
        $uncategorized = Umkm::whereDoesntHave('kerajinanCategories')->whereDoesntHave('kulinerCategories')->get();
        $fallback = $ids['Sulaman Karawo'] ?? null;
        foreach ($uncategorized as $umkm) {
            $hay = strtolower($umkm->name.' '.$umkm->slug.' '.$umkm->body.' '.$umkm->produk);
            // hanya untuk yang terindikasi kerajinan
            if (! str_contains($hay, 'karawo') && ! str_contains($hay, 'anyaman') && ! str_contains($hay, 'tenun') && ! str_contains($hay, 'ukir') && ! str_contains($hay, 'rotan') && ! str_contains($hay, 'sulaman')) continue;
            $chosen = $fallback;
            if (str_contains($hay, 'anyaman') || str_contains($hay, 'rotan')) $chosen = $ids['Anyaman Rotan'] ?? $fallback;
            elseif (str_contains($hay, 'ukir') || str_contains($hay, 'kayu')) $chosen = $ids['Ukiran Kayu'] ?? $fallback;
            elseif (str_contains($hay, 'tenun')) $chosen = $ids['Tenun Gorontalo'] ?? $fallback;
            if ($chosen) $umkm->kerajinanCategories()->syncWithoutDetaching([$chosen]);
        }
    }
}

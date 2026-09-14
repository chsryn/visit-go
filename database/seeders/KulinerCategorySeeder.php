<?php

namespace Database\Seeders;

use App\Models\KulinerCategory;
use App\Models\Umkm;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KulinerCategorySeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Binthe Biluhuta', 'Ilabulo', 'Sambal Sagela', 'Ayam Iloni', 'Minuman Khas'];

        $ids = [];
        foreach ($names as $name) {
            $cat = KulinerCategory::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'is_active' => true]
            );
            $ids[$name] = $cat->id;
        }

        // Attach ke UMKM kuliner yang sudah ada (jika ada), fallback heuristik nama/slug
        $map = [
            'Binthe Biluhuta' => ['milu-siram', 'milu-siram-barokah', 'milu-siram-ilabulo', 'binthe-biluhuta'],
            'Ilabulo' => ['ilabulo', 'ilabulo-hj-fatma'],
            'Sambal Sagela' => ['sambal-sagela'],
            'Ayam Iloni' => ['ayam-iloni'],
        ];

        foreach ($map as $catName => $slugs) {
            $catId = $ids[$catName] ?? null;
            if (! $catId) continue;
            $umkms = Umkm::whereIn('slug', $slugs)->get();
            foreach ($umkms as $umkm) {
                $umkm->kulinerCategories()->syncWithoutDetaching([$catId]);
            }
        }

        // Buat dummy UMKM untuk kategori yang masih kosong (Sambal, Ayam) agar filter tidak selalu empty selain Minuman
        $dummyMap = [
            'Sambal Sagela' => ['name' => 'Sambal Sagela Gorontalo', 'slug' => 'sambal-sagela', 'body' => 'Sambal Sagela — tumbukan ikan sagela asap pedas gurih khas Gorontalo.', 'produk' => 'Sambal Sagela'],
            'Ayam Iloni' => ['name' => 'Ayam Iloni Gorontalo', 'slug' => 'ayam-iloni', 'body' => 'Ayam Iloni — ayam bakar bumbu khas Gorontalo dengan santan dan rempah.', 'produk' => 'Ayam Iloni'],
        ];
        foreach ($dummyMap as $catName => $data) {
            $catId = $ids[$catName] ?? null;
            if (! $catId) continue;
            $exists = Umkm::whereHas('kulinerCategories', fn($q)=>$q->where('kuliner_categories.id',$catId))->exists();
            if (! $exists) {
                $umkm = Umkm::firstOrCreate(
                    ['slug' => $data['slug']],
                    [
                        'name' => $data['name'],
                        'skala_usaha' => 'mikro',
                        'body' => $data['body'],
                        'produk' => $data['produk'],
                        'is_active' => true,
                        'image' => '/storage/portal/kategori-kuliner.jpg',
                        'alt' => $data['name'],
                    ]
                );
                $umkm->kulinerCategories()->syncWithoutDetaching([$catId]);
            }
        }

        // Jika UMKM belum punya kategori kuliner/kerajinan, beri fallback Binthe Biluhuta agar tidak kosong
        $uncategorized = Umkm::whereDoesntHave('kulinerCategories')->whereDoesntHave('kerajinanCategories')->get();
        $fallback = $ids['Binthe Biluhuta'] ?? null;
        foreach ($uncategorized as $umkm) {
            $hay = strtolower($umkm->name.' '.$umkm->slug.' '.$umkm->body.' '.$umkm->produk);
            // hanya fallback untuk yang terindikasi kuliner
            if (! str_contains($hay, 'karawo') && ! str_contains($hay, 'anyaman') && ! str_contains($hay, 'ukir') && ! str_contains($hay, 'tenun') && ! str_contains($hay, 'sulaman')) {
                $chosen = $fallback;
                if (str_contains($hay, 'ilabulo') || str_contains($hay, 'sagu')) $chosen = $ids['Ilabulo'] ?? $fallback;
                elseif (str_contains($hay, 'sagela') || str_contains($hay, 'sambal')) $chosen = $ids['Sambal Sagela'] ?? $fallback;
                elseif (str_contains($hay, 'ayam') && str_contains($hay, 'iloni')) $chosen = $ids['Ayam Iloni'] ?? $fallback;
                if ($chosen) $umkm->kulinerCategories()->syncWithoutDetaching([$chosen]);
            }
        }
    }
}

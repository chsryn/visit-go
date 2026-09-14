<?php

namespace Database\Seeders;

use App\Models\Umkm;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UmkmSeeder extends Seeder
{
    /**
     * Contoh UMKM + jenis master. Idempotent — aman dijalankan ulang.
     */
    public function run(): void
    {
        $umkms = [
            [
                'name' => 'Milu Siram Barokah',
                'slug' => 'milu-siram-barokah',
                'jenis' => 'kuliner',
                'skala_usaha' => 'mikro',
                'body' => 'UMKM kuliner spesialis Milu Siram (Binte Biluhuta) khas Gorontalo.',
                'produk' => 'Milu Siram, Es Kelapa Muda',
                'kontak' => 'Kota Gorontalo',
                'image' => '/storage/portal/kategori-kuliner.jpg',
                'alt' => 'Milu Siram Barokah',
                'kuliner' => ['Binthe Biluhuta'],
            ],
            [
                'name' => 'Ilabulo Hj. Fatma',
                'slug' => 'ilabulo-hj-fatma',
                'jenis' => 'kuliner',
                'skala_usaha' => 'kecil',
                'body' => 'UMKM kuliner spesialis Ilabulo pepes sagu ayam.',
                'produk' => 'Ilabulo Ayam, Ilabulo Sapi',
                'kontak' => 'Kota Gorontalo',
                'image' => '/storage/portal/kategori-kuliner.jpg',
                'alt' => 'Ilabulo Hj. Fatma',
                'kuliner' => ['Ilabulo'],
            ],
            [
                'name' => 'Karawo Sulaman Gorontalo',
                'slug' => 'karawo-sulaman-gorontalo',
                'jenis' => 'kerajinan',
                'skala_usaha' => 'menengah',
                'body' => 'UMKM kerajinan sulaman Karawo bermotif flora khas Gorontalo.',
                'produk' => 'Kain Karawo, Baju Karawo, Masker Karawo',
                'kontak' => 'Kabupaten Gorontalo',
                'image' => '/storage/portal/kategori-kerajinan.jpg',
                'alt' => 'Karawo Sulaman Gorontalo',
                'kerajinan' => ['Sulaman Karawo'],
            ],
        ];

        foreach ($umkms as $u) {
            $umkm = Umkm::updateOrCreate(
                ['slug' => $u['slug']],
                [
                    'name' => $u['name'],
                    'skala_usaha' => $u['skala_usaha'],
                    'body' => $u['body'],
                    'produk' => $u['produk'],
                    'kontak' => $u['kontak'],
                    'image' => $u['image'] ?? null,
                    'alt' => $u['alt'] ?? $u['name'],
                    'is_active' => true,
                ]
            );
            if (! empty($u['kuliner'])) {
                $ids = \App\Models\KulinerCategory::whereIn('name', $u['kuliner'])->pluck('id')->all();
                if ($ids) $umkm->kulinerCategories()->syncWithoutDetaching($ids);
            }
            if (! empty($u['kerajinan'])) {
                $ids = \App\Models\KerajinanCategory::whereIn('name', $u['kerajinan'])->pluck('id')->all();
                if ($ids) $umkm->kerajinanCategories()->syncWithoutDetaching($ids);
            }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Umkm;
use App\Models\UmkmJenis;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UmkmSeeder extends Seeder
{
    /**
     * Contoh UMKM + jenis master. Idempotent — aman dijalankan ulang.
     */
    public function run(): void
    {
        foreach (['kuliner', 'karawo'] as $jenis) {
            UmkmJenis::firstOrCreate(
                ['slug' => Str::slug($jenis)],
                ['name' => $jenis, 'is_active' => true]
            );
        }

        $umkms = [
            [
                'name' => 'Milu Siram Barokah',
                'slug' => 'milu-siram-barokah',
                'jenis' => 'kuliner',
                'skala_usaha' => 'mikro',
                'body' => 'UMKM kuliner spesialis Milu Siram (Binte Biluhuta) khas Gorontalo.',
                'produk' => 'Milu Siram, Es Kelapa Muda',
                'kontak' => 'Kota Gorontalo',
            ],
            [
                'name' => 'Ilabulo Hj. Fatma',
                'slug' => 'ilabulo-hj-fatma',
                'jenis' => 'kuliner',
                'skala_usaha' => 'kecil',
                'body' => 'UMKM kuliner spesialis Ilabulo pepes sagu ayam.',
                'produk' => 'Ilabulo Ayam, Ilabulo Sapi',
                'kontak' => 'Kota Gorontalo',
            ],
            [
                'name' => 'Karawo Sulaman Gorontalo',
                'slug' => 'karawo-sulaman-gorontalo',
                'jenis' => 'karawo',
                'skala_usaha' => 'menengah',
                'body' => 'UMKM kerajinan sulaman Karawo bermotif flora khas Gorontalo.',
                'produk' => 'Kain Karawo, Baju Karawo, Masker Karawo',
                'kontak' => 'Kabupaten Gorontalo',
            ],
        ];

        foreach ($umkms as $u) {
            $jenisId = UmkmJenis::where('slug', Str::slug($u['jenis']))->value('id');
            Umkm::updateOrCreate(
                ['slug' => $u['slug']],
                [
                    'name' => $u['name'],
                    'umkm_jenis_id' => $jenisId,
                    'skala_usaha' => $u['skala_usaha'],
                    'body' => $u['body'],
                    'produk' => $u['produk'],
                    'kontak' => $u['kontak'],
                    'is_active' => true,
                ]
            );
        }
    }
}

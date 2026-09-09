<?php

namespace Database\Seeders;

use App\Models\Destinasi;
use App\Models\DestinationPriceEstimate;
use Illuminate\Database\Seeder;

class DestinationPriceSeeder extends Seeder
{
    /**
     * issue.md §3: contoh estimasi harga destinasi populer agar AI
     * langsung punya data grounding. Idempotent — aman dijalankan ulang.
     */
    public function run(): void
    {
        $items = [
            'hiu-paus-botubarani' => [
                ['tiket_masuk', 'Tiket masuk kawasan', 20000, 'orang', null],
                ['wahana', 'Snorkeling bersama hiu paus + pemandu', 150000, 'orang', 'Termasuk alat snorkeling'],
                ['sewa', 'Sewa kamera underwater', 100000, 'unit', null],
            ],
            'wisata-hiu-paus-botubarani' => [
                ['tiket_masuk', 'Tiket masuk kawasan', 20000, 'orang', null],
                ['wahana', 'Snorkeling bersama hiu paus + pemandu', 150000, 'orang', null],
            ],
            'pulo-cinta' => [
                ['tiket_masuk', 'Tiket masuk kawasan', 50000, 'orang', null],
                ['wahana', 'Island hopping perahu', 250000, 'paket', 'Maksimal 10 orang'],
                ['sewa', 'Sewa alat snorkeling', 50000, 'unit', null],
            ],
            'pulo-cinta-eco-resort' => [
                ['tiket_masuk', 'Tiket masuk kawasan', 100000, 'orang', null],
                ['sewa', 'Villa atas air per malam', 1500000, 'malam', 'Estimasi mulai'],
            ],
            'taman-laut-olele' => [
                ['tiket_masuk', 'Tiket masuk kawasan', 15000, 'orang', null],
                ['wahana', 'Diving 1x dive + guide', 350000, 'orang', 'Sudah termasuk alat'],
                ['sewa', 'Sewa alat snorkeling', 50000, 'unit', null],
            ],
            'menara-agung-limboto' => [
                ['tiket_masuk', 'Tiket masuk menara', 10000, 'orang', null],
                ['lainnya', 'Parkir kendaraan', 5000, 'unit', null],
            ],
            'pemandian-air-panas-lombongo' => [
                ['tiket_masuk', 'Tiket masuk pemandian', 15000, 'orang', null],
                ['sewa', 'Gazebo per hari', 50000, 'unit', null],
            ],
        ];

        foreach ($items as $slug => $prices) {
            $destinasi = Destinasi::where('slug', $slug)->first();
            if (! $destinasi) {
                continue;
            }

            foreach ($prices as [$jenis, $label, $harga, $satuan, $catatan]) {
                DestinationPriceEstimate::firstOrCreate(
                    ['destinasi_id' => $destinasi->id, 'jenis' => $jenis, 'label' => $label],
                    ['harga' => $harga, 'satuan' => $satuan, 'catatan' => $catatan, 'is_active' => true]
                );
            }
        }
    }
}

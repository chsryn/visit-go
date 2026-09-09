<?php

namespace Database\Seeders;

use App\Models\Knowledge;
use Illuminate\Database\Seeder;

class KnowledgeSeeder extends Seeder
{
    /**
     * perbaikan.md item 6: pindahkan pengetahuan dasar dari hardcode
     * fallback chatbot ke database agar grounding lokal hidup.
     * Idempotent — aman dijalankan ulang.
     */
    public function run(): void
    {
        $rows = [
            [
                'topic' => 'destinasi',
                'question' => 'Kapan bisa melihat hiu paus Botubarani?',
                'answer' => 'Hiu paus Botubarani dapat dilihat pagi hari 06:00-10:00 di Teluk Tomini. Hubungi pemandu lokal, datang pagi, jangan menyentuh hiu, dan bawa sunblock.',
                'keywords' => 'botubarani, hiu paus, hiu, whale shark, snorkeling, jam, pagi',
            ],
            [
                'topic' => 'budaya',
                'question' => 'Apa itu Karawo?',
                'answer' => 'Karawo adalah sulaman khas Gorontalo bermotif flora, asalnya dari Kabupaten Gorontalo. Lihat langsung di kampung kerajinan Karawo, Kota Gorontalo.',
                'keywords' => 'karawo, sulaman, kain, kerajinan, motif',
            ],
            [
                'topic' => 'kuliner',
                'question' => 'Apa kuliner khas Gorontalo?',
                'answer' => 'Kuliner khas: milu siram, ilabulo, ayam iloni, dan sagela. Coba di sekitar Kota Gorontalo — tanya saya durasi & budget untuk rekomendasi.',
                'keywords' => 'kuliner, makan, makanan, milu, milu siram, ilabulo, ayam iloni, sagela, khas',
            ],
            [
                'topic' => 'destinasi',
                'question' => 'Rekomendasi destinasi Gorontalo?',
                'answer' => 'Rekomendasi destinasi: Botubarani (hiu paus), Pulo Cinta (resor ikonik), Taman Laut Olele (snorkeling). Mau itinerary berapa hari?',
                'keywords' => 'pulo cinta, olele, destinasi, wisata, pantai, resort, snorkeling, diving, liburan',
            ],
            [
                'topic' => 'event',
                'question' => 'Event terdekat di Gorontalo?',
                'answer' => 'Agenda terdekat: Karnaval Karawo 11-13 Sep 2026, Tradisi Dikili Sep 2026, FESBUJATON 9 Jul 2026. Lokasi di GPCC & desa Sidomukti.',
                'keywords' => 'event, festival, karnaval, dikili, fesbujaton, acara, agenda, jadwal',
            ],
            [
                'topic' => 'budaya',
                'question' => 'Apa itu Tari Saronde dan Tradisi Dikili?',
                'answer' => 'Tari Saronde adalah tari pergaulan penyambutan tamu Gorontalo dengan selendang. Tradisi Dikili adalah zikir semalam suntuk memperingati Maulid Nabi di masjid-masjid bersejarah Gorontalo.',
                'keywords' => 'saronde, tari, dikili, tradisi, maulid, budaya, adat',
            ],
        ];

        foreach ($rows as $row) {
            Knowledge::updateOrCreate(
                ['topic' => $row['topic'], 'question' => $row['question']],
                array_merge($row, ['is_active' => true])
            );
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Budaya;
use App\Models\Category;
use App\Models\Destinasi;
use App\Models\Event;
use App\Models\Kerajinan;
use App\Models\Kuliner;
use Illuminate\Database\Seeder;

class PortalSeeder extends Seeder
{
    public function run(): void
    {
        $destinasis = [
            [
                'name' => 'Wisata Hiu Paus Botubarani',
                'slug' => 'hiu-paus-botubarani',
                'category' => 'destinasi',
                'body' => "Hiu paus Botubarani di Bone Bolango muncul rutin pukul 06:00–10:00. Wisatawan snorkeling didampingi pemandu lokal, tetap menjaga jarak aman dengan biota. Akses 30 menit dari Kota Gorontalo.",
                'image' => '/storage/portal/kategori-destinasi.jpg',
                'alt' => 'Hiu paus Botubarani',
            ],
            [
                'name' => 'Taman Laut Olele',
                'slug' => 'taman-laut-olele',
                'category' => 'destinasi',
                'body' => "Taman Laut Olele menyimpan terumbu karang Salvador Dali Sponge yang langka, favorit penyelam. Visibility jernih dan arus tenang cocok untuk snorkeling pemula.",
                'image' => '/storage/portal/kategori-destinasi.jpg',
                'alt' => 'Taman Laut Olele',
            ],
            [
                'name' => 'Pulo Cinta',
                'slug' => 'pulo-cinta',
                'category' => 'destinasi',
                'body' => "Pulo Cinta di Boalemo dijuluki Maldives-nya Gorontalo — resort di atas lagun berbentuk hati, cocok untuk honeymoon dan island hopping di Teluk Tomini.",
                'image' => '/storage/portal/kategori-destinasi.jpg',
                'alt' => 'Pulo Cinta',
            ],
            [
                'name' => 'Destinasi Wisata',
                'slug' => 'botubarani-pulo-cinta',
                'category' => 'destinasi',
                'body' => "Botubarani di Bone Bolango adalah habitat hiu paus (whale shark) yang muncul rutin pukul 06:00–10:00. Pengunjung bisa snorkeling dengan pemandu lokal. Pulo Cinta di Boalemo dijuluki Maldives-nya Gorontalo — resort di atas lagun berbentuk hati, cocok untuk honeymoon dan island hopping. Taman Laut Olele di Bone Bolango menyimpan terumbu karang Salvador Dali Sponge yang langka. Semua lokasi berada di Teluk Tomini dengan akses perahu dari Kota Gorontalo 1–2 jam.",
                'image' => '/storage/portal/kategori-destinasi.jpg',
                'alt' => 'Lagun biru kehijauan Pulo Cinta',
            ],
        ];

        foreach ($destinasis as $d) {
            Destinasi::updateOrCreate(['slug' => $d['slug']], $d);
        }

        // Budaya/kuliner/kerajinan hidup di tabelnya masing-masing (bukan destinasis)
        $budayas = [
            [
                'name' => 'Tari Saronde',
                'slug' => 'tari-saronde',
                'body' => "Tari Saronde adalah tari pergaulan penyambutan tamu dengan selendang, diiringi musik polopalo — ikon keramahan Gorontalo.",
                'image' => '/storage/portal/kategori-budaya.jpg',
                'alt' => 'Tari Saronde',
            ],
            [
                'name' => 'Tradisi Dikili',
                'slug' => 'tradisi-dikili',
                'body' => "Tradisi Dikili adalah zikir semalam suntuk memperingati Maulid Nabi di masjid-masjid bersejarah Gorontalo — sarat nilai religius Hulondalo.",
                'image' => '/storage/portal/kategori-budaya.jpg',
                'alt' => 'Tradisi Dikili',
            ],
            [
                'name' => 'Ensiklopedia Budaya',
                'slug' => 'tari-saronde-dikili',
                'body' => "Tradisi Dikili adalah zikir semalam suntuk memperingati Maulid Nabi di masjid-masjid bersejarah Gorontalo — sarat nilai religius Hulondalo. Tari Saronde adalah tari pergaulan penyambutan tamu dengan selendang, diiringi musik polopalo. Upacara adat Moloopu dan warisan lisan Pohutu Limo Lo Pohalaa (lima kerajaan Gorontalo) menjadi pilar identitas budaya yang terus dilestarikan Dinas Pariwisata.",
                'image' => '/storage/portal/kategori-budaya.jpg',
                'alt' => 'Penari Saronde Gorontalo',
            ],
        ];
        foreach ($budayas as $b) {
            Budaya::updateOrCreate(['slug' => $b['slug']], $b);
        }

        $kuliners = [
            [
                'name' => 'Milu Siram',
                'slug' => 'milu-siram',
                'body' => "Milu Siram — jagung siram kuah santan gurih dengan ikan, kuliner pesisir paling ikonik Gorontalo.",
                'image' => '/storage/portal/kategori-kuliner.jpg',
                'alt' => 'Milu Siram',
            ],
            [
                'name' => 'Ilabulo',
                'slug' => 'ilabulo',
                'body' => "Ilabulo — pepes sagu dan ayam dibungkus daun pisang, wajib coba saat berkunjung ke Gorontalo.",
                'image' => '/storage/portal/kategori-kuliner.jpg',
                'alt' => 'Ilabulo',
            ],
            [
                'name' => 'Kuliner Khas',
                'slug' => 'milu-siram-ilabulo',
                'body' => "Milu Siram adalah jagung siram kuah santan gurih dengan ikan, kuliner pesisir paling ikonik. Ilabulo — pepes sagu dan ayam dibungkus daun pisang — wajib coba saat berkunjung. Sambal Sagela (ikan sagela asap) dan Sate Tuna Gorontalo melengkapi cita rasa laut. Rekomendasi: RM Citra Kota, Kampung Kuliner Limboto, dan warung tepi Teluk Tomini.",
                'image' => '/storage/portal/kategori-kuliner.jpg',
                'alt' => 'Hidangan Milu Siram dan Ilabulo',
            ],
        ];
        foreach ($kuliners as $k) {
            Kuliner::updateOrCreate(['slug' => $k['slug']], $k);
        }

        $kerajinans = [
            [
                'name' => 'Sulaman Karawo',
                'slug' => 'sulaman-karawo',
                'body' => "Karawo adalah sulaman khas Gorontalo dengan teknik iris dan cabut benang, bermotif flora yang dijahit tangan di atas kain. Berasal dari Kabupaten Gorontalo, kini menjadi ikon Karnaval Karawo.",
                'image' => '/storage/portal/kategori-kerajinan.jpg',
                'alt' => 'Sulaman Karawo',
            ],
            [
                'name' => 'Anyaman Rotan',
                'slug' => 'anyaman-rotan',
                'body' => "Anyaman rotan dan kerajinan kayu ebony — mahakarya perajin lokal Gorontalo dengan motif tradisional.",
                'image' => '/storage/portal/kategori-kerajinan.jpg',
                'alt' => 'Anyaman Rotan',
            ],
            [
                'name' => 'Kerajinan Daerah',
                'slug' => 'kerajinan-daerah',
                'body' => "Sulaman Karawo, anyaman rotan, dan mahakarya tangan perajin lokal — bisa ditemui di Kampung Karawo, Kota Gorontalo.",
                'image' => '/storage/portal/kategori-kerajinan.jpg',
                'alt' => 'Kerajinan Daerah',
            ],
        ];
        foreach ($kerajinans as $k) {
            Kerajinan::updateOrCreate(['slug' => $k['slug']], $k);
        }

        $events = [
            [
                'name' => 'Gorontalo Karnaval Karawo 2026',
                'slug' => 'karnaval-karawo-2026',
                'date' => '11–13',
                'month' => 'Sep 2026',
                'location' => 'Pelataran GPCC, Kota Gorontalo',
                'body' => "Karnaval Karawo 2026 mengusung tema Ritme Hulondalo, Harmoni Warisan Gorontalo — parade busana sulaman Karawo, lomba desain, dan pameran kuliner Jelajah Rasa Nusantara di GPCC. Ribuan perajin dan desainer tampil di runway terbuka. Gratis untuk umum, hubungi Dinas Pariwisata untuk jadwal panggung.",
                'image' => '/storage/portal/event-karawo.jpg',
                'alt' => 'Karnaval Karawo',
            ],
            [
                'name' => 'Tradisi Dikili (Perayaan Maulid Nabi)',
                'slug' => 'tradisi-dikili',
                'date' => 'Sep',
                'month' => '2026',
                'location' => 'Masjid-masjid bersejarah, Gorontalo',
                'body' => "Tradisi Dikili digelar setiap Maulid Nabi — zikir dan doa semalam suntuk di Masjid Agung Baiturrahim dan masjid tua Hunto. Warga membawa toyopo (wadah hias) berisi kue tradisional. Nilai religius dan kebersamaan menjadi daya tarik wisata religi Gorontalo.",
                'image' => '/storage/portal/event-dikili.jpg',
                'alt' => 'Masjid bersejarah Gorontalo',
            ],
            [
                'name' => 'Festival Seni Budaya Jawa Tondano (FESBUJATON XX)',
                'slug' => 'fesbujaton-xx',
                'date' => '9 Jul',
                'month' => '2026',
                'location' => 'Desa Sidomukti, Mootilango, Kab. Gorontalo',
                'body' => "FESBUJATON XX di Desa Sidomukti, Mootilango — festival tahunan diaspora Jawa Tondano se-Indonesia Timur. Menampilkan tari Kabasaran, kuliner tinoransak, dan pameran gotong royong. Agenda pelestarian budaya dan toleransi yang telah berlangsung 20 tahun.",
                'image' => '/storage/portal/event-fesbujaton.jpg',
                'alt' => 'Panggung FESBUJATON',
            ],
            [
                'name' => 'Festival Pesona Teluk Tomini 2026',
                'slug' => 'festival-pesona-teluk-tomini-2026',
                'date' => '20–22',
                'month' => 'Nov 2026',
                'location' => 'Pantai Bolihutuo, Boalemo',
                'body' => "Festival Pesona Teluk Tomini 2026 — sail pass perahu hias, lomba foto bawah laut Olele, dan panggung musik etnik di tepi pantai Bolihutuo. Destinasi bahari Gorontalo siap menyambut wisatawan dengan paket snorkeling dan kuliner sagela.",
                'image' => '/storage/portal/event-karawo.jpg',
                'alt' => 'Festival Pesona Teluk Tomini',
            ],
        ];

        foreach ($events as $e) {
            Event::updateOrCreate(['slug' => $e['slug']], $e);
        }

        // Banner per kategori — editable via DB (categories table) — seperti kategori lain
        $categories = [
            [
                'slug' => 'destinasi',
                'name' => 'Destinasi Wisata',
                'description' => 'Jelajahi keindahan alam Gorontalo — dari hiu paus Botubarani hingga lagun Pulo Cinta.',
                'banner_image' => '/storage/portal/kategori-destinasi.jpg',
                'banner_alt' => 'Lagun Pulo Cinta',
            ],
            [
                'slug' => 'budaya',
                'name' => 'Budaya Gorontalo',
                'description' => 'Warisan Hulondalo: Tari Saronde, Tradisi Dikili, dan adat Pohutu Limo.',
                'banner_image' => '/storage/portal/kategori-budaya.jpg',
                'banner_alt' => 'Tari Saronde',
            ],
            [
                'slug' => 'kuliner',
                'name' => 'Kuliner Khas',
                'description' => 'Cita rasa pesisir: Milu Siram, Ilabulo, dan sambal Sagela.',
                'banner_image' => '/storage/portal/kategori-kuliner.jpg',
                'banner_alt' => 'Kuliner Gorontalo',
            ],
            [
                'slug' => 'kerajinan',
                'name' => 'Kerajinan Daerah',
                'description' => 'Mahakarya tangan: Sulaman Karawo dan anyaman rotan.',
                'banner_image' => '/storage/portal/kategori-kerajinan.jpg',
                'banner_alt' => 'Sulaman Karawo',
            ],
            [
                'slug' => 'event',
                'name' => 'Agenda Budaya',
                'description' => 'Perayaan yang akan datang — Karnaval Karawo, Tradisi Dikili, FESBUJATON.',
                'banner_image' => '/storage/portal/event-karawo.jpg',
                'banner_alt' => 'Karnaval Karawo',
            ],
        ];
        foreach ($categories as $c) {
            Category::updateOrCreate(['slug' => $c['slug']], $c);
        }
    }
}

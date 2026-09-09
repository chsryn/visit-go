<?php

namespace App\Services\Ai;

use App\Models\Kuliner;

/**
 * Generator itinerary lokal: dipakai saat Groq tak tersedia agar
 * pengguna tetap mendapat jawaban instan yang menghormati parameter.
 *
 * Prioritas isi: pool aktivitas sesuai minat (mode ketat bila satu bucket),
 * nama kuliner dari database, lalu multiplier budget.
 */
class FallbackItineraryBuilder
{
    public function build(
        string $duration,
        string $interest,
        string $location,
        string $foodPref,
        string $companion = 'Solo',
        $currency = 'IDR',
        string $penginapan = 'Hotel & Resor',
        string $customInterest = '',
        string $budget = 'Menengah',
    ): array {
        $numDays = $this->resolveDayCount($duration);
        $companionNote = $this->companionNote($companion);
        $multiplier = $this->budgetMultiplier($budget);
        $foodRecs = $this->foodRecommendations($foodPref);

        $baseAcc = 250000 * $multiplier * max(1, $numDays - 1);
        $baseFood = 150000 * $multiplier * $numDays;
        $baseTrans = 100000 * $multiplier * $numDays;
        $baseTicket = 75000 * $multiplier * $numDays;
        $totalEst = $baseAcc + $baseFood + $baseTrans + $baseTicket;

        $days = [];
        $activitiesPool = $this->activityPools($foodRecs);
        $poolOrder = $this->poolOrder($interest, $customInterest);

        $dayTitle = fn ($i) => match ($i) {
            1 => "Hari 1: Orientasi {$location} & Destinasi Utama",
            2 => "Hari 2: Eksplorasi Wisata {$interest} & Kuliner Segar",
            3 => 'Hari 3: Wisata Icon Pilihan & Souvenir Budaya',
            4 => 'Hari 4: Petualangan Alam Khusus & Relaksasi',
            default => "Hari {$i}: Penjelajahan Spesial Gorontalo",
        };

        // Mode ketat: satu bucket minat spesifik → hari hanya berisi aktivitas
        // yang cocok (tanpa bocoran kategori lain). Minat campuran/umum → variasi pool.
        $strictBucket = $this->strictInterestBucket($interest, $customInterest);
        $strictFlat = $strictBucket ? $this->filterPoolByBucket($activitiesPool, $strictBucket) : [];

        if ($strictFlat) {
            $perDay = max(1, (int) ceil(count($strictFlat) / $numDays));
            for ($i = 1; $i <= $numDays; $i++) {
                $slice = [];
                for ($k = 0; $k < $perDay; $k++) {
                    $slice[] = $strictFlat[(($i - 1) * $perDay + $k) % count($strictFlat)];
                }
                $days[] = [
                    'day_number' => $i,
                    'title' => $dayTitle($i),
                    'activities' => $slice,
                ];
            }
        } else {
            for ($i = 1; $i <= $numDays; $i++) {
                $poolIndex = $poolOrder[($i - 1) % count($poolOrder)];

                $days[] = [
                    'day_number' => $i,
                    'title' => $dayTitle($i),
                    'activities' => $activitiesPool[$poolIndex],
                ];
            }
        }

        return [
            'title' => "Rencana Perjalanan {$duration} di {$location} ({$interest})",
            'summary' => "Itinerary spesial dirancang untuk fokus minat {$interest} di sekitar titik awal {$location} untuk {$companion} dengan gaya budget {$budget}. {$companionNote} Seluruh rekomendasi makanan disesuaikan dengan preferensi {$foodPref}.",
            'highlights' => [
                "Eksplorasi destinasi ikonik di {$location} & sekitarnya",
                "Rekomendasi kuliner tervalidasi preferensi {$foodPref}",
                "Estimasi biaya gaya {$budget} (akumulasi tiket+kuliner+aktivitas)",
                "Dioptimalkan untuk {$companion} — {$companionNote}",
            ],
            'days' => $days,
            'budget_breakdown' => [
                'accommodation' => 'Rp '.number_format($baseAcc, 0, ',', '.'),
                'food' => 'Rp '.number_format($baseFood, 0, ',', '.'),
                'transport' => 'Rp '.number_format($baseTrans, 0, ',', '.'),
                'attractions' => 'Rp '.number_format($baseTicket, 0, ',', '.'),
                'total_estimated' => 'Rp '.number_format($totalEst, 0, ',', '.'),
            ],
            'food_highlights' => $foodRecs,
            'travel_tips' => [
                'Gunakan pakaian tipis dan bahan menyerap keringat untuk aktivitas pesisir Gorontalo.',
                'Siapkan uang tunai secukupnya saat berkunjung ke destinasi pesisir seperti Botubarani & Olele.',
                'Selalu hormati adat dan budaya lokal Gorontalo yang kental dengan nilai kearifan lokal.',
            ],
        ];
    }

    private function resolveDayCount(string $duration): int
    {
        // Dukung durasi bebas 1-30 hari (angka di string, misal "12 hari")
        if (preg_match('/(\d+)/', $duration, $m)) {
            $parsed = (int) $m[1];
            if ($parsed >= 1 && $parsed <= 30) {
                return min($parsed, 30);
            }
        }

        return match (true) {
            str_contains($duration, '1 hari') => 1,
            str_contains($duration, '4–5') || str_contains($duration, '4-5') => 4,
            str_contains($duration, 'minggu') => 5,
            default => 3,
        };
    }

    private function companionNote(string $companion): string
    {
        return match (strtolower($companion)) {
            'couple' => 'Itinerary romantis untuk pasangan — pilih penginapan privat & sunset point.',
            'keluarga' => 'Ramah anak & akses difabel — pilih rute landai, rest area, dan kuliner keluarga.',
            'teman' => 'Seru bareng teman — aktivitas grup, snorkeling & foto bareng.',
            default => 'Fleksibel untuk solo traveler — jadwal santai & mudah diubah.',
        };
    }

    private function budgetMultiplier(string $budget): float
    {
        return match (true) {
            str_contains(strtolower($budget), 'hemat') || str_contains(strtolower($budget), 'backpacker') => 0.6,
            str_contains(strtolower($budget), 'premium') || str_contains(strtolower($budget), 'sultan') || str_contains(strtolower($budget), 'mewah') => 2.5,
            default => 1.0,
        };
    }

    private function foodRecommendations(string $foodPref): array
    {
        $foodRecs = match (true) {
            str_contains(strtolower($foodPref), 'halal') => [
                'Milu Siram (Binte Biluhuta) khas Gorontalo yang gurih & halal',
                'Ayam Iloni panggang rempah khas Gorontalo',
                'Ilabulo halal isi daging ayam & sagu tradisional',
                'Sate Belanga khas Gorontalo',
            ],
            str_contains(strtolower($foodPref), 'seafood') => [
                'Ikan Goropa Bakar Dabu-Dabu Lilang di pinggir Teluk Tomini',
                'Cumi Hitam & Udang Goreng Mentega khas laut Gorontalo',
                'Sup Ikan Kuah Asam khas pesisir Olele',
                'Sate Tuna Segar khas Gorontalo',
            ],
            str_contains(strtolower($foodPref), 'vegetarian') || str_contains(strtolower($foodPref), 'mild') => [
                'Jagung Siram Rempah Tanpa Ikan (Binte Biluhuta Veggie)',
                'Sayur Tumis Kangkung Dabu-Dabu & Tahu Tempe Bakar',
                'Gado-gado tradisional & Pisang Goreng Sepatu',
                'Kue Sabongi & Es Kelapa Muda Segar',
            ],
            str_contains(strtolower($foodPref), 'pedas') || str_contains(strtolower($foodPref), 'non-pedas') => [
                'Milu Siram dengan tingkat kepedasan terpisah (Dabu-dabu manis)',
                'Ayam Iloni Santan Gurih Manis Tanpa Cabai Rawit',
                'Kue Popaco & Es Kacang Merah khas Gorontalo',
                'Sup Ayam Kampung Bening khas Gorontalo',
            ],
            str_contains(strtolower($foodPref), 'western') || str_contains(strtolower($foodPref), 'cafe') || str_contains(strtolower($foodPref), 'kafe') => [
                'Kopi Pinogu khas Gorontalo & pastry di kafe Kota Gorontalo',
                'Grilled fish western style dengan sambal dabu-dabu terpisah',
                'Pisang goreng coklat keju & jus alpukat segar',
                'Nasi goreng seafood porsi keluarga yang ramah lidah',
            ],
            str_contains(strtolower($foodPref), 'tidak ada preferensi') || str_contains(strtolower($foodPref), 'bebas') || trim($foodPref) === '' => [
                'Milu Siram (Binte Biluhuta) ikon kuliner Gorontalo',
                'Ikan Goropa Bakar Dabu-Dabu khas Teluk Tomini',
                'Ilabulo pepes sagu ayam tradisional',
                'Kopi Pinogu & Kue Karawo untuk camilan sore',
            ],
            default => [
                'Milu Siram (Binte Biluhuta) sup jagung segar khas Gorontalo',
                'Ilabulo bungkus daun pisang yang gurih berempah',
                'Ayam Iloni panggang rempah santan',
                'Kue Karawo & Es Kelapa Gula Merah',
            ],
        };

        // Utamakan nama kuliner dari database (preferensi diambil dari tabel kuliners)
        try {
            $dbFoods = Kuliner::where('is_active', true)->orderBy('name')->pluck('name')->all();
        } catch (\Throwable $e) {
            $dbFoods = [];
        }
        if ($dbFoods) {
            $foodRecs = array_slice(array_merge($dbFoods, $foodRecs), 0, 4);
        }

        return $foodRecs;
    }

    private function activityPools(array $foodRecs): array
    {
        return [
            1 => [
                ['time' => '06:00 - 09:00', 'activity' => 'Melihat Hiu Paus & Snorkeling di Teluk Tomini', 'location' => 'Wisata Hiu Paus Botubarani, Bone Bolango', 'food' => $foodRecs[0], 'cost' => 'Rp 50.000', 'notes' => 'Datang pagi jam 06:00 untuk melihat hiu paus muncul di permukaan.'],
                ['time' => '10:30 - 12:30', 'activity' => 'Jelajah Benteng Bersejarah Otanaha & Danau Limboto', 'location' => 'Benteng Otanaha, Kota Gorontalo', 'food' => $foodRecs[1], 'cost' => 'Rp 15.000', 'notes' => 'Naik 348 anak tangga untuk pemandangan panorama Danau Limboto.'],
                ['time' => '13:00 - 15:30', 'activity' => 'Santap Siang Kuliner Khas & Belanja Kerajinan Sulaman Karawo', 'location' => 'Pusat Kerajinan Karawo, Kota Gorontalo', 'food' => $foodRecs[2], 'cost' => 'Rp 75.000', 'notes' => 'Sulaman Karawo adalah warisan budaya takbenda UNESCO khas Gorontalo.'],
                ['time' => '17:00 - 20:00', 'activity' => 'Sunset & Makan Malam Santai di Kawasan Wisata Kuliner', 'location' => 'Kawasan Lapangan Taruna Remaja / Pesisir Pantai', 'food' => $foodRecs[3], 'cost' => 'Rp 60.000', 'notes' => 'Nikmati suasana malam udara pesisir Gorontalo.'],
            ],
            2 => [
                ['time' => '07:30 - 12:00', 'activity' => 'Island Hopping & Snorkeling Terumbu Karang', 'location' => 'Taman Laut Olele / Pulau Saronde', 'food' => $foodRecs[0], 'cost' => 'Rp 150.000', 'notes' => 'Air sangat jernih, wajib bawa kamera underwater.'],
                ['time' => '13:00 - 16:00', 'activity' => 'Eksplorasi Menara Agung Limboto & Air Terjun Hiyaliyo Daas', 'location' => 'Kabupaten Gorontalo', 'food' => $foodRecs[1], 'cost' => 'Rp 20.000', 'notes' => 'Cocok untuk berfoto dan menikmati arsitektur ikonik.'],
                ['time' => '17:30 - 20:30', 'activity' => 'Makan Malam Kuliner Spesial & Belanja Oleh-Oleh Khas', 'location' => 'Pusat Kota Gorontalo', 'food' => $foodRecs[2], 'cost' => 'Rp 80.000', 'notes' => 'Jangan lupa beli Pia Gorontalo dan Kopi Pinogu.'],
            ],
            3 => [
                ['time' => '08:00 - 11:30', 'activity' => 'Wisata Bahari Pulo Cinta Resort & Fotografi Pantai', 'location' => 'Pulo Cinta, Boalemo', 'food' => $foodRecs[3], 'cost' => 'Rp 200.000', 'notes' => 'Destinasi resort romantic berbentuk hati di tengah laut.'],
                ['time' => '12:30 - 15:00', 'activity' => 'Santap Siang & Wisata Desa Adat / Budaya', 'location' => 'Desa Wisata Sidomukti / Dulohupa', 'food' => $foodRecs[0], 'cost' => 'Rp 40.000', 'notes' => 'Mengenal rumah adat Bantayo Poboide Gorontalo.'],
                ['time' => '16:00 - 18:30', 'activity' => 'Penutupan Perjalanan & Sunset di Pantai Leato', 'location' => 'Pantai Leato, Kota Gorontalo', 'food' => $foodRecs[1], 'cost' => 'Rp 30.000', 'notes' => 'Momen penutup perjalanan yang tenang dan estetik.'],
            ],
            4 => [
                ['time' => '08:30 - 12:00', 'activity' => 'Eksplorasi Hutan Cagar Alam Nantu & Bird Watching', 'location' => 'Cagar Alam Nantu, Gorontalo', 'food' => $foodRecs[2], 'cost' => 'Rp 100.000', 'notes' => 'Habitat langka Anoa dan Babirusa Gorontalo.'],
                ['time' => '13:00 - 17:00', 'activity' => 'Relaksasi Pemandian Air Panas Lombongo', 'location' => 'Lombongo, Suwawa, Bone Bolango', 'food' => $foodRecs[3], 'cost' => 'Rp 25.000', 'notes' => 'Air panas alami di tengah nuansa hutan tropis yang sejuk.'],
            ],
            5 => [
                ['time' => '09:00 - 11:30', 'activity' => 'Belanja Sulaman Karawo & Kerajinan Tangan', 'location' => 'Pusat Kerajinan Karawo, Kota Gorontalo', 'food' => $foodRecs[0], 'cost' => 'Rp 50.000', 'notes' => 'Karawo adalah sulaman khas Gorontalo bermotif flora.'],
                ['time' => '13:00 - 15:30', 'activity' => 'Berburu Oleh-Oleh: Pia, Kopi Pinogu & Sambal Sagela', 'location' => 'Pusat Kota Gorontalo', 'food' => $foodRecs[1], 'cost' => 'Rp 100.000', 'notes' => 'Siapkan daftar belanja agar tidak kalap.'],
                ['time' => '16:00 - 18:00', 'activity' => 'Jelajah Pasar Sentral & Street Food Sore', 'location' => 'Pasar Sentral, Kota Gorontalo', 'food' => $foodRecs[2], 'cost' => 'Rp 40.000', 'notes' => 'Datang sore untuk jajanan paling lengkap.'],
            ],
            6 => [
                ['time' => '07:30 - 09:30', 'activity' => 'Sarapan Milu Siram di Warung Legendaris', 'location' => 'Kota Gorontalo', 'food' => $foodRecs[0], 'cost' => 'Rp 25.000', 'notes' => 'Milu Siram paling nikmat disantap hangat pagi hari.'],
                ['time' => '12:00 - 14:00', 'activity' => 'Makan Siang Ilabulo & Ayam Iloni', 'location' => 'Rumah Makan Khas, Kota Gorontalo', 'food' => $foodRecs[1], 'cost' => 'Rp 45.000', 'notes' => 'Pesan Ilabulo yang dibungkus daun pisang.'],
                ['time' => '18:30 - 20:30', 'activity' => 'Wisata Kuliner Malam: Sate Tuna & Sagela', 'location' => 'Kawasan Kuliner Pesisir, Kota Gorontalo', 'food' => $foodRecs[2], 'cost' => 'Rp 60.000', 'notes' => 'Akhiri dengan Es Kelapa Gula Merah.'],
            ],
        ];
    }

    private function poolOrder(string $interest, string $customInterest): array
    {
        // Urutan pool mengikuti minat (termasuk minat bebas) agar isi aktivitas relevan
        $interestLow = strtolower($interest.' '.$customInterest);

        return match (true) {
            str_contains($interestLow, 'belanja') || str_contains($interestLow, 'souvenir') || str_contains($interestLow, 'oleh-oleh') || str_contains($interestLow, 'oleh oleh') => [5, 3, 1, 2, 6, 4],
            str_contains($interestLow, 'kuliner') || str_contains($interestLow, 'makan') || str_contains($interestLow, 'food') || str_contains($interestLow, 'jajan') => [6, 2, 1, 3, 5, 4],
            str_contains($interestLow, 'budaya') || str_contains($interestLow, 'sejarah') || str_contains($interestLow, 'adat') || str_contains($interestLow, 'seni') || str_contains($interestLow, 'festival') || str_contains($interestLow, 'dikili') || str_contains($interestLow, 'saronde') => [1, 3, 5, 2, 6, 4],
            str_contains($interestLow, 'gunung') || str_contains($interestLow, 'hiking') || str_contains($interestLow, 'pendaki') || str_contains($interestLow, 'trekking') || str_contains($interestLow, 'mendaki') => [4, 1, 2, 3, 6, 5],
            str_contains($interestLow, 'pantai') || str_contains($interestLow, 'laut') || str_contains($interestLow, 'bahari') || str_contains($interestLow, 'alam') || str_contains($interestLow, 'petualangan') || str_contains($interestLow, 'snorkeling') || str_contains($interestLow, 'diving') => [1, 2, 3, 4, 6, 5],
            default => [1, 2, 3, 4, 5, 6],
        };
    }

    /**
     * Kata kunci teks per bucket minat untuk filter aktivitas fallback.
     */
    private function interestBucketKeywords(): array
    {
        return [
            'belanja' => ['karawo', 'belanja', 'oleh-oleh', 'oleh oleh', 'pasar', 'pia ', 'kopi pinogu', 'souvenir', 'pusat kota'],
            'kuliner' => ['kuliner', 'sarapan', 'makan ', 'siram', 'ilabulo', 'restoran', 'rumah makan', 'kafe', 'kopi', 'seafood', 'tuna', 'sagela', 'sate', 'street food', 'jajan'],
            'budaya' => ['benteng', 'otanaha', 'karawo', 'adat', 'budaya', 'desa wisata', 'sidomukti', 'limboto', 'menara', 'air terjun', 'hiyaliyo'],
            'gunung' => ['gunung', 'hiking', 'trekking', 'mendaki', 'nantu', 'lombongo', 'hutan', 'air panas', 'bird'],
            'pantai' => ['pantai', 'laut', 'snorkeling', 'snorkling', 'diving', 'hiu paus', 'botubarani', 'olele', 'pulo cinta', 'island', 'resort', 'leato', 'teluk', 'underwater'],
        ];
    }

    /**
     * Tentukan satu bucket ketat dari minat (+minat bebas). Return null bila
     * minat campuran/umum (tetap pakai variasi pool).
     */
    private function strictInterestBucket(string $interest, string $customInterest = ''): ?string
    {
        $bucketFor = function (string $text) {
            $in = strtolower(trim($text));
            if ($in === '') {
                return null;
            }
            $has = fn (...$needles) => collect($needles)->contains(fn ($n) => str_contains($in, $n));
            if ($has('belanja', 'souvenir', 'oleh', 'karawo', 'pasar', 'shopping')) {
                return 'belanja';
            }
            if ($has('kuliner', 'makan', 'food', 'jajan', 'cafe', 'kafe', 'resto', 'seafood')) {
                return 'kuliner';
            }
            if ($has('budaya', 'sejarah', 'adat', 'seni', 'saronde', 'dikili', 'museum')) {
                return 'budaya';
            }
            if ($has('gunung', 'hiking', 'pendaki', 'trekking', 'mendaki')) {
                return 'gunung';
            }
            if ($has('pantai', 'laut', 'bahari', 'snorkeling', 'diving', 'island', 'selam')) {
                return 'pantai';
            }

            return null;
        };

        $buckets = [];
        foreach (array_merge(explode(',', $interest), [$customInterest]) as $piece) {
            if (trim($piece) === '') {
                continue;
            }
            $b = $bucketFor($piece);
            if ($b === null) {
                return null; // ada bagian tak terpetakan → variasi
            }
            $buckets[] = $b;
        }
        $buckets = array_values(array_unique($buckets));

        return count($buckets) === 1 ? $buckets[0] : null;
    }

    /**
     * Saring semua aktivitas pool yang teksnya cocok bucket.
     */
    private function filterPoolByBucket(array $pools, string $bucket): array
    {
        $keywords = $this->interestBucketKeywords()[$bucket] ?? [];
        if (! $keywords) {
            return [];
        }
        $flat = [];
        foreach ($pools as $acts) {
            foreach ($acts as $a) {
                $hay = strtolower(($a['activity'] ?? '').' '.($a['location'] ?? '').' '.($a['food'] ?? ''));
                foreach ($keywords as $kw) {
                    if (str_contains($hay, $kw)) {
                        $flat[] = $a;
                        break;
                    }
                }
            }
        }

        return $flat;
    }
}

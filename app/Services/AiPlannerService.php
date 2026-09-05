<?php

namespace App\Services;

use App\Models\Destinasi;
use App\Models\Knowledge;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiPlannerService
{
    /**
     * Generate structured travel itinerary recommendations based on user preferences.
     *
     * @param array $params [duration, budget, interest, location, food_preference]
     * @return array
     */
    public function generateItinerary(array $params): array
    {
        $duration = $params['duration'] ?? '2–3 hari';
        $budget = $params['budget'] ?? 'Menengah';
        $interest = $params['interest'] ?? 'Alam & Bahari';
        $location = $params['location'] ?? 'Kota Gorontalo';
        $foodPref = $params['food_preference'] ?? 'Kuliner Khas Gorontalo';

        // 1. Grounding context from DB (wrapped in try-catch for resilience)
        $destContext = "";
        $knowContext = "";
        try {
            $destinations = Destinasi::where('is_active', true)->limit(15)->get(['name', 'category', 'body']);
            $knowledge = Knowledge::where('is_active', true)->limit(15)->get(['topic', 'question', 'answer']);

            $destContext = $destinations->map(fn($d) => "- {$d->name} ({$d->category}): " . substr(strip_tags($d->body), 0, 150))->implode("\n");
            $knowContext = $knowledge->map(fn($k) => "- [{$k->topic}] {$k->question}: {$k->answer}")->implode("\n");
        } catch (\Throwable $e) {
            Log::warning('AiPlannerService DB fetch warning: ' . $e->getMessage());
        }

        if (!$destContext) {
            $destContext = "- Botubarani (Hiu Paus), Pulo Cinta, Taman Laut Olele, Benteng Otanaha, Menara Agung Limboto";
        }
        if (!$knowContext) {
            $knowContext = "- Kuliner khas: Milu Siram (Binte Biluhuta), Ilabulo, Ayam Iloni, Sagela. Kain khas: Sulaman Karawo.";
        }

        $systemPrompt = <<<PROMPT
Anda adalah AI Expert Travel Planner spesialis pariwisata Gorontalo & Sulawesi Utara.
Tugas Anda adalah membuat rencana perjalanan (itinerary) yang sangat spesifik, logis, dan menarik berdasarkan preferensi pengguna.

BERIKUT DATA KONTEKS DESTINASI & KNOWLEDGE LOKAL:
DESTINASI LOKAL:
{$destContext}

KNOWLEDGE PARIWISATA:
{$knowContext}

ATURAN DAN FORMAT OUTPUT:
1. Rekomendasi HARUS mematuhi kelima parameter input dari pengguna:
   - Durasi: {$duration}
   - Budget: {$budget}
   - Minat: {$interest}
   - Lokasi Utama/Titik Awal: {$location}
   - Preferensi Makanan: {$foodPref} (Pastikan SEMUA rekomendasi makanan mematuhi preferensi ini secara ketat!)

2. JAWAB HARUS HANYA DALAM FORMAT JSON VALID tanpa teks pengantar atau markdown block (no ```json). Format JSON harus mengikuti skema berikut:
{
  "title": "Judul Menarik Rencana Perjalanan",
  "summary": "Ringkasan singkat mengapa rencana ini cocok dengan preferensi user (2-3 kalimat)",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "days": [
    {
      "day_number": 1,
      "title": "Tema Hari Ke-1",
      "activities": [
        {
          "time": "08:00 - 10:00",
          "activity": "Nama dan deskripsi aktivitas",
          "location": "Nama Tempat / Destinasi",
          "food_recommendation": "Rekomendasi makanan (sesuai preferensi)",
          "cost_estimate": "Estimasi biaya (contoh: Rp 50.000)",
          "notes": "Tips penting"
        }
      ]
    }
  ],
  "budget_breakdown": {
    "accommodation": "Estimasi total akomodasi",
    "food": "Estimasi total makanan",
    "transport": "Estimasi total transportasi",
    "attractions": "Estimasi total tiket masuk/aktivitas",
    "total_estimated": "Total estimasi keseluruhan"
  },
  "food_highlights": [
    "Highlight makanan 1 sesuai preferensi",
    "Highlight makanan 2 sesuai preferensi"
  ],
  "travel_tips": [
    "Tip perjalanan 1",
    "Tip perjalanan 2"
  ]
}
PROMPT;

        $userPrompt = "Buatkan itinerary perjalanan Gorontalo dengan parameter:\n- Durasi: {$duration}\n- Budget: {$budget}\n- Minat: {$interest}\n- Lokasi: {$location}\n- Preferensi Makanan: {$foodPref}";

        // Try API Call if API key configured
        $key = config('services.groq.key');
        $url = config('services.groq.url', 'https://api.groq.com/openai/v1/chat/completions');
        $model = config('services.groq.model', 'openai/gpt-oss-20b');

        if ($key) {
            try {
                $response = Http::withToken($key)
                    ->timeout(25)
                    ->post($url, [
                        'model' => $model,
                        'messages' => [
                            ['role' => 'system', 'content' => $systemPrompt],
                            ['role' => 'user', 'content' => $userPrompt],
                        ],
                        'temperature' => 0.4,
                        'max_tokens' => 2000,
                    ]);

                if ($response->successful()) {
                    $raw = $response->json('choices.0.message.content');
                    if ($raw) {
                        $cleaned = trim($raw);
                        $cleaned = preg_replace('/^```json\s*|\s*```$/i', '', $cleaned);
                        $cleaned = trim($cleaned);
                        $json = json_decode($cleaned, true);
                        if (is_array($json) && isset($json['days']) && isset($json['title'])) {
                            return $json;
                        }
                    }
                } else {
                    Log::warning('AiPlanner API HTTP failed', ['status' => $response->status(), 'body' => $response->body()]);
                }
            } catch (\Throwable $e) {
                Log::error('AiPlanner API exception', ['error' => $e->getMessage()]);
            }
        }

        // Fallback Generator if API unavailable or response invalid
        return $this->generateFallbackItinerary($duration, $budget, $interest, $location, $foodPref);
    }

    /**
     * Smart local fallback generator ensuring instant, robust responses.
     */
    private function generateFallbackItinerary(string $duration, string $budget, string $interest, string $location, string $foodPref): array
    {
        $numDays = match (true) {
            str_contains($duration, '1 hari') => 1,
            str_contains($duration, '4–5') || str_contains($duration, '4-5') => 4,
            str_contains($duration, 'minggu') => 5,
            default => 3,
        };

        // Budget multiplier
        $multiplier = match (strtolower($budget)) {
            'hemat', 'backpacker' => 0.6,
            'premium', 'sultan', 'mewah' => 2.5,
            default => 1.0,
        };

        $baseAcc = 250000 * $multiplier * max(1, $numDays - 1);
        $baseFood = 150000 * $multiplier * $numDays;
        $baseTrans = 100000 * $multiplier * $numDays;
        $baseTicket = 75000 * $multiplier * $numDays;
        $totalEst = $baseAcc + $baseFood + $baseTrans + $baseTicket;

        // Food recommendations matching preference
        $foodRecs = match (true) {
            str_contains(strtolower($foodPref), 'halal') => [
                'Milu Siram (Binte Biluhuta) khas Gorontalo yang gurih & halal',
                'Ayam Iloni panggang rempah khas Gorontalo',
                'Ilabulo halal isi daging ayam & sagu tradisional',
                'Sate Belanga khas Gorontalo'
            ],
            str_contains(strtolower($foodPref), 'seafood') => [
                'Ikan Goropa Bakar Dabu-Dabu Lilang di pinggir Teluk Tomini',
                'Cumi Hitam & Udang Goreng Mentega khas laut Gorontalo',
                'Sup Ikan Kuah Asam khas pesisir Olele',
                'Sate Tuna Segar khas Gorontalo'
            ],
            str_contains(strtolower($foodPref), 'vegetarian') || str_contains(strtolower($foodPref), 'mild') => [
                'Jagung Siram Rempah Tanpa Ikan (Binte Biluhuta Veggie)',
                'Sayur Tumis Kangkung Dabu-Dabu & Tahu Tempe Bakar',
                'Gado-gado tradisional & Pisang Goreng Sepatu',
                'Kue Sabongi & Es Kelapa Muda Segar'
            ],
            str_contains(strtolower($foodPref), 'pedas') || str_contains(strtolower($foodPref), 'non-pedas') => [
                'Milu Siram dengan tingkat kepedasan terpisah (Dabu-dabu manis)',
                'Ayam Iloni Santan Gurih Manis Tanpa Cabai Rawit',
                'Kue Popaco & Es Kacang Merah khas Gorontalo',
                'Sup Ayam Kampung Bening khas Gorontalo'
            ],
            default => [
                'Milu Siram (Binte Biluhuta) sup jagung segar khas Gorontalo',
                'Ilabulo bungkus daun pisang yang gurih berempah',
                'Ayam Iloni panggang rempah santan',
                'Kue Karawo & Es Kelapa Gula Merah'
            ],
        };

        $days = [];
        $activitiesPool = [
            1 => [
                ['time' => '06:00 - 09:00', 'activity' => 'Melihat Hiu Paus & Snorkeling di Teluk Tomini', 'location' => 'Wisata Hiu Paus Botubarani, Bone Bolango', 'food' => $foodRecs[0], 'cost' => 'Rp 50.000', 'notes' => 'Datang pagi jam 06:00 untuk melihat hiu paus muncul di permukaan.'],
                ['time' => '10:30 - 12:30', 'activity' => 'Jelajah Benteng Bersejarah Otanaha & Danau Limboto', 'location' => 'Benteng Otanaha, Kota Gorontalo', 'food' => $foodRecs[1], 'cost' => 'Rp 15.000', 'notes' => 'Naik 348 anak tangga untuk pemandangan panorama Danau Limboto.'],
                ['time' => '13:00 - 15:30', 'activity' => 'Santap Siang Kuliner Khas & Belanja Kerajinan Sulaman Karawo', 'location' => 'Pusat Kerajinan Karawo, Kota Gorontalo', 'food' => $foodRecs[2], 'cost' => 'Rp 75.000', 'notes' => 'Sulaman Karawo adalah warisan budaya takbenda UNESCO khas Gorontalo.'],
                ['time' => '17:00 - 20:00', 'activity' => 'Sunset & Makan Malam Santai di Kawasan Wisata Kuliner', 'location' => 'Kawasan Lapangan Taruna Remaja / Pesisir Pantai', 'food' => $foodRecs[3], 'cost' => 'Rp 60.000', 'notes' => 'Nikmati suasana malam udara pesisir Gorontalo.']
            ],
            2 => [
                ['time' => '07:30 - 12:00', 'activity' => 'Island Hopping & Snorkeling Terumbu Karang', 'location' => 'Taman Laut Olele / Pulau Saronde', 'food' => $foodRecs[0], 'cost' => 'Rp 150.000', 'notes' => 'Air sangat jernih, wajib bawa kamera underwater.'],
                ['time' => '13:00 - 16:00', 'activity' => 'Eksplorasi Menara Agung Limboto & Air Terjun Hiyaliyo Daas', 'location' => 'Kabupaten Gorontalo', 'food' => $foodRecs[1], 'cost' => 'Rp 20.000', 'notes' => 'Cocok untuk berfoto dan menikmati arsitektur ikonik.'],
                ['time' => '17:30 - 20:30', 'activity' => 'Makan Malam Kuliner Spesial & Belanja Oleh-Oleh Khas', 'location' => 'Pusat Kota Gorontalo', 'food' => $foodRecs[2], 'cost' => 'Rp 80.000', 'notes' => 'Jangan lupa beli Pia Gorontalo dan Kopi Pinogu.']
            ],
            3 => [
                ['time' => '08:00 - 11:30', 'activity' => 'Wisata Bahari Pulo Cinta Resort & Fotografi Pantai', 'location' => 'Pulo Cinta, Boalemo', 'food' => $foodRecs[3], 'cost' => 'Rp 200.000', 'notes' => 'Destinasi resort romantic berbentuk hati di tengah laut.'],
                ['time' => '12:30 - 15:00', 'activity' => 'Santap Siang & Wisata Desa Adat / Budaya', 'location' => 'Desa Wisata Sidomukti / Dulohupa', 'food' => $foodRecs[0], 'cost' => 'Rp 40.000', 'notes' => 'Mengenal rumah adat Bantayo Poboide Gorontalo.'],
                ['time' => '16:00 - 18:30', 'activity' => 'Penutupan Perjalanan & Sunset di Pantai Leato', 'location' => 'Pantai Leato, Kota Gorontalo', 'food' => $foodRecs[1], 'cost' => 'Rp 30.000', 'notes' => 'Momen penutup perjalanan yang tenang dan estetik.']
            ],
            4 => [
                ['time' => '08:30 - 12:00', 'activity' => 'Eksplorasi Hutan Cagar Alam Nantu & Bird Watching', 'location' => 'Cagar Alam Nantu, Gorontalo', 'food' => $foodRecs[2], 'cost' => 'Rp 100.000', 'notes' => 'Habitat langka Anoa dan Babirusa Gorontalo.'],
                ['time' => '13:00 - 17:00', 'activity' => 'Relaksasi Pemandian Air Panas Lombongo', 'location' => 'Lombongo, Suwawa, Bone Bolango', 'food' => $foodRecs[3], 'cost' => 'Rp 25.000', 'notes' => 'Air panas alami di tengah nuansa hutan tropis yang sejuk.']
            ]
        ];

        for ($i = 1; $i <= $numDays; $i++) {
            $poolIndex = (($i - 1) % 4) + 1;
            $dayTitle = match ($i) {
                1 => "Hari 1: Orientasi {$location} & Destinasi Utama",
                2 => "Hari 2: Eksplorasi Wisata {$interest} & Kuliner Segar",
                3 => "Hari 3: Wisata Icon Pilihan & Souvenir Budaya",
                4 => "Hari 4: Petualangan Alam Khusus & Relaksasi",
                default => "Hari {$i}: Penjelajahan Spesial Gorontalo",
            };

            $days[] = [
                'day_number' => $i,
                'title' => $dayTitle,
                'activities' => $activitiesPool[$poolIndex]
            ];
        }

        return [
            'title' => "Rencana Perjalanan {$duration} di {$location} ({$interest})",
            'summary' => "Itinerary spesial dirancang untuk gaya travel {$budget} dengan fokus minat {$interest} di sekitar titik awal {$location}. Seluruh rekomendasi makanan disesuaikan dengan preferensi {$foodPref}.",
            'highlights' => [
                "Eksplorasi destinasi ikonik di {$location} & sekitarnya",
                "Rekomendasi kuliner tervalidasi preferensi {$foodPref}",
                "Estimasi alokasi budget terencana untuk kategori {$budget}"
            ],
            'days' => $days,
            'budget_breakdown' => [
                'accommodation' => 'Rp ' . number_format($baseAcc, 0, ',', '.'),
                'food' => 'Rp ' . number_format($baseFood, 0, ',', '.'),
                'transport' => 'Rp ' . number_format($baseTrans, 0, ',', '.'),
                'attractions' => 'Rp ' . number_format($baseTicket, 0, ',', '.'),
                'total_estimated' => 'Rp ' . number_format($totalEst, 0, ',', '.')
            ],
            'food_highlights' => $foodRecs,
            'travel_tips' => [
                "Gunakan pakaian tipis dan bahan menyerap keringat untuk aktivitas pesisir Gorontalo.",
                "Siapkan uang tunai secukupnya saat berkunjung ke destinasi pesisir seperti Botubarani & Olele.",
                "Selalu hormati adat dan budaya lokal Gorontalo yang kental dengan nilai kearifan lokal."
            ]
        ];
    }
}

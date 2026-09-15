<?php

namespace App\Services;

use App\Services\Ai\FallbackItineraryBuilder;
use App\Services\Ai\GroqClient;
use App\Services\Ai\GroundingBuilder;
use App\Services\Ai\ItineraryPrompt;
use App\Services\Ai\PlaceResolver;
use Illuminate\Support\Facades\Log;

/**
 * Orkestrator AI travel planner: normalisasi parameter → grounding DB →
 * prompt → Groq (atau fallback lokal) → payload lengkap untuk FE.
 *
 * Logika berat tinggal di modul App\Services\Ai\*; kelas ini hanya
 * mengatur alur dan bentuk respons.
 */
class AiPlannerService
{
    public function __construct(
        protected GroundingBuilder $grounding,
        protected FallbackItineraryBuilder $fallbackBuilder,
        protected PlaceResolver $placeResolver,
        protected GroqClient $groq,
    ) {}

    /**
     * Generate structured travel itinerary recommendations based on user preferences.
     *
     * @param  array  $params  [duration, duration_days, interest, location, food_preference, budget, companion, currency, custom_interest]
     */
    public function generateItinerary(array $params): array
    {
        $p = $this->normalizeParams($params);

        [$scopedContext, $unavailable, $areaEmpty] = $this->grounding->scopedContext(
            $p['location'], $p['interestList'], $p['foodPref']
        );

        // Gate: bila SEMUA minat tak punya data DB, jangan panggil AI / fallback
        // yang mengarang rekomendasi (mis. akses difabel disuruh ke pantai/resort).
        $allMissing = ! empty($p['interestList'])
            && count(array_diff($p['interestList'], $unavailable)) === 0;
        if ($allMissing) {
            return $this->noDataResult($p, $unavailable, $areaEmpty);
        }

        $systemPrompt = ItineraryPrompt::system([
            ...$p,
            'scopedContext' => $scopedContext,
            'unmatchedText' => $unavailable
                ? implode("\n", array_map(fn ($u) => "- {$u}", $unavailable))
                : '- (semua minat ada datanya)',
            'knowContext' => $this->grounding->knowledgeContext(),
            'priceSection' => $this->priceSection(),
            'interestText' => $p['interestList'] ? implode(', ', $p['interestList']) : '(tidak diisi)',
        ]);

        $result = $this->groq->generateContent($systemPrompt, ItineraryPrompt::user($p));
        $source = 'groq';
        if ($result !== null) {
            // Strict DB-only: buang aktivitas fiktif/relokasi; bila habis → fallback
            [$result, $removed] = $this->placeResolver->filterFabricated(
                $result, $this->grounding->normalizeArea($p['location'])
            );
            if ($removed > 0) {
                Log::info("AiPlanner strict filter removed {$removed} fabricated activities");
            }
            if (empty($result['days'])) {
                Log::warning('AiPlanner all activities filtered, using fallback');
                $result = null;
            }
        }
        if ($result === null) {
            $result = $this->fallbackBuilder->build(
                $p['duration'], $p['interest'], $p['location'], $p['foodPref'],
                $p['companion'], $p['currency'],
                $p['customInterest'], $p['budget']
            );
            $source = 'fallback';
        }

        $result = $this->placeResolver->enrichWithImages($result);
        $places = $this->placeResolver->resolve($result);

        return array_merge($result, [
            '_source' => $source,
            'unavailable' => $unavailable,
            'area_empty' => $areaEmpty,
            'places' => $places,
            'cost_estimate' => $this->grounding->costEstimate($places, $p['foodPref']),
        ]);
    }

    private function normalizeParams(array $params): array
    {
        // Durasi bebas 1-30: prioritaskan duration_days integer jika ada
        if (isset($params['duration_days']) && is_numeric($params['duration_days'])) {
            $daysInt = min(max((int) $params['duration_days'], 1), 30);
            $duration = $daysInt.' hari';
        } else {
            $duration = $params['duration'] ?? '2–3 hari';
        }

        $interest = $params['interest'] ?? 'Alam & Bahari';
        $customInterest = $params['custom_interest'] ?? '';

        return [
            'duration' => $duration,
            'interest' => $interest,
            'location' => $params['location'] ?? 'Provinsi Gorontalo',
            'foodPref' => $params['food_preference'] ?? 'Kuliner Khas Gorontalo',
            'budget' => $params['budget'] ?? 'Menengah',
            'companion' => $params['companion'] ?? 'Solo',
            'currency' => $params['currency'] ?? 'IDR',
            'customInterest' => $customInterest,
            'interestList' => array_values(array_filter(
                array_map('trim', explode(',', $interest.','.$customInterest)),
                fn ($s) => $s !== ''
            )),
        ];
    }

    private function priceSection(): string
    {
        $priceContext = $this->grounding->priceContext();

        // Fallback: jika DB harga kosong, AI memakai estimasi wajarnya (jangan error)
        return $priceContext !== ''
            ? $priceContext."\n(prioritaskan angka di atas untuk semua cost_estimate & budget_breakdown)"
            : '(belum ada data harga — gunakan estimasi wajar untuk Gorontalo)';
    }

    /**
     * Respons jujur bila tidak ada satu pun minat yang punya data DB:
     * tanpa hari, tanpa tempat, tanpa estimasi — biarkan "tidak tersedia".
     */
    private function noDataResult(array $p, array $unavailable, bool $areaEmpty): array
    {
        return [
            'title' => "Minat belum tersedia di {$p['location']}",
            'summary' => 'Wisata untuk minat: '.implode(', ', $unavailable)." belum tersedia di area {$p['location']}. Rekomendasi tidak dibuat agar tidak menyesatkan — hubungi admin untuk info terkini.",
            'highlights' => [],
            'days' => [],
            'budget_breakdown' => null,
            'food_highlights' => [],
            'travel_tips' => [],
            '_source' => 'no-data',
            'no_data' => true,
            'unavailable' => $unavailable,
            'area_empty' => $areaEmpty,
            'places' => [],
            'cost_estimate' => ['destinations' => [], 'foods' => [], 'total' => 0],
        ];
    }
}

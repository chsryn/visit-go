<?php

namespace App\Services;

use App\Services\Ai\FallbackItineraryBuilder;
use App\Services\Ai\GroqClient;
use App\Services\Ai\GroundingBuilder;
use App\Services\Ai\ItineraryPrompt;
use App\Services\Ai\PlaceResolver;

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
     * @param  array  $params  [duration, duration_days, interest, location, food_preference, budget, companion, currency, penginapan, custom_interest]
     */
    public function generateItinerary(array $params): array
    {
        $p = $this->normalizeParams($params);

        [$scopedContext, $unavailable, $areaEmpty] = $this->grounding->scopedContext(
            $p['location'], $p['interestList'], $p['foodPref']
        );

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
        if ($result === null) {
            $result = $this->fallbackBuilder->build(
                $p['duration'], $p['interest'], $p['location'], $p['foodPref'],
                $p['companion'], $p['currency'], $p['penginapan'],
                $p['customInterest'], $p['budget']
            );
            $source = 'fallback';
        }

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
            'penginapan' => $params['penginapan'] ?? 'Hotel & Resor',
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
}

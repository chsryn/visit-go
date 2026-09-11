<?php

namespace App\Services\Ai;

/**
 * Satu-satunya sumber kebenaran semantik minat: bucket + kata kunci.
 * Dipakai GroundingBuilder (skor/tags) dan FallbackItineraryBuilder (pool).
 */
final class InterestProfile
{
    public const BUCKETS = [
        'belanja' => ['karawo', 'belanja', 'oleh-oleh', 'oleh oleh', 'pasar', 'pia ', 'kopi pinogu', 'souvenir', 'pusat kota'],
        'kuliner' => ['kuliner', 'sarapan', 'makan ', 'siram', 'ilabulo', 'restoran', 'rumah makan', 'kafe', 'kopi', 'seafood', 'tuna', 'sagela', 'sate', 'street food', 'jajan'],
        'budaya' => ['benteng', 'otanaha', 'karawo', 'adat', 'budaya', 'desa wisata', 'sidomukti', 'limboto', 'menara', 'air terjun', 'hiyaliyo'],
        'gunung' => ['gunung', 'hiking', 'trekking', 'mendaki', 'nantu', 'lombongo', 'hutan', 'air panas', 'bird'],
        'pantai' => ['pantai', 'laut', 'snorkeling', 'snorkling', 'diving', 'hiu paus', 'botubarani', 'olele', 'pulo cinta', 'island', 'resort', 'leato', 'teluk', 'underwater'],
    ];

    /**
     * Satu teks → satu bucket atau null.
     */
    public static function bucketFor(string $text): ?string
    {
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
    }

    /**
     * Minat (+minat bebas, boleh koma) → satu bucket bila semua bagian
     * sepakat, null bila campuran/umum.
     */
    public static function singleBucket(string $interest, string $customInterest = ''): ?string
    {
        $buckets = [];
        foreach (array_merge(explode(',', $interest), [$customInterest]) as $piece) {
            if (trim($piece) === '') {
                continue;
            }
            $b = self::bucketFor($piece);
            if ($b === null) {
                return null;
            }
            $buckets[] = $b;
        }
        $buckets = array_values(array_unique($buckets));

        return count($buckets) === 1 ? $buckets[0] : null;
    }

    /**
     * Kata kunci gabungan untuk satu/beberapa bucket (plus token mentah).
     */
    public static function keywordsForInterest(string $interest, string $customInterest = ''): array
    {
        $buckets = [];
        foreach (array_merge(explode(',', $interest), [$customInterest]) as $piece) {
            $b = self::bucketFor($piece);
            if ($b !== null) {
                $buckets[] = $b;
            }
        }
        $keywords = [];
        foreach (array_unique($buckets) as $b) {
            array_push($keywords, ...self::BUCKETS[$b]);
        }
        foreach (array_merge(explode(',', $interest), [$customInterest]) as $piece) {
            foreach (preg_split('/[^a-z0-9]+/', strtolower($piece)) ?: [] as $w) {
                if (strlen($w) >= 3) {
                    $keywords[] = $w;
                }
            }
        }

        return array_values(array_unique($keywords));
    }

    public static function keywordsForBucket(?string $bucket): array
    {
        return $bucket !== null ? self::BUCKETS[$bucket] ?? [] : [];
    }
}

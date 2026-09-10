<?php

namespace App\Services\Ai;

use App\Http\Controllers\PortalController;
use App\Models\Budaya;
use App\Models\Destinasi;
use App\Models\DestinationPriceEstimate;
use App\Models\Event;
use App\Models\Kerajinan;
use App\Models\Knowledge;
use App\Models\Kuliner;
use Illuminate\Support\Facades\Log;

/**
 * Menyusun konteks grounding database untuk prompt AI.
 *
 * Setiap sumber dibungkus try-catch sendiri agar satu sumber gagal
 * tidak mematikan sumber lain.
 */
class GroundingBuilder
{
    /**
     * @return array [string $context, array $unavailableInterests, bool $areaEmpty]
     */
    public function scopedContext(string $location, array $interests, string $foodPref = ''): array
    {
        try {
            $area = $this->normalizeArea($location);
            $blocks = [];
            $unavailable = [];
            $totalRows = 0;
            $kulinerIncluded = false;

            foreach ($interests as $interest) {
                $tokens = $this->interestTokens($interest);
                $scored = [];
                foreach ($this->sourcesForInterest($interest) as [$model, $catSlug]) {
                    if ($model === Kuliner::class) {
                        $kulinerIncluded = true;
                    }
                    try {
                        $q = $model::where('is_active', true);
                        if ($model === Destinasi::class) {
                            $q->whereNotIn('slug', PortalController::PILLARS);
                            if ($catSlug !== null) {
                                $q->whereHas('categoryRef', fn ($qq) => $qq->where('slug', $catSlug));
                            }
                        }
                        foreach ($q->get() as $r) {
                            if (! $this->rowAreaMatches($r, $area)) {
                                continue;
                            }
                            $line = '- '.$r->name;
                            if (! empty($r->body)) {
                                $line .= ': '.substr(strip_tags($r->body), 0, 120);
                            }
                            // Skor: tag cocok (+2) agar baris paling relevan tampil dulu
                            $score = 0;
                            $rowTags = strtolower($r->tags ?? '');
                            $rowName = strtolower($r->name ?? '');
                            foreach ($tokens as $t) {
                                if ($rowTags !== '' && str_contains($rowTags, $t)) {
                                    $score += 2;
                                } elseif (str_contains($rowName, $t)) {
                                    $score += 1;
                                }
                            }
                            $scored[] = ['score' => $score, 'line' => $line];
                        }
                    } catch (\Throwable $e) {
                        Log::warning('GroundingBuilder scoped source failed: '.$e->getMessage());
                    }
                }

                usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);
                $found = array_slice(array_unique(array_column($scored, 'line')), 0, 12);
                if ($found) {
                    $totalRows += count($found);
                    $blocks[] = "[Minat: {$interest}]\n".implode("\n", $found);
                } else {
                    $unavailable[] = $interest;
                    $blocks[] = "[Minat: {$interest}] — tidak ada data DB.";
                }
            }

            // Preferensi makanan selalu butuh referensi kuliner (terpisah dari sumbu minat).
            if (! $kulinerIncluded && trim($foodPref) !== '') {
                $blocks[] = $this->kulinerReferenceBlock($foodPref);
            }

            if (! $interests) {
                $blocks[] = '(tidak ada minat terisi — tampilkan destinasi populer area ini dari pengetahuanmu)';
            }

            return [implode("\n\n", $blocks), array_values(array_unique($unavailable)), $area !== null && $totalRows === 0];
        } catch (\Throwable $e) {
            Log::warning('GroundingBuilder scoped context failed: '.$e->getMessage());

            return ['', $interests, true];
        }
    }

    /**
     * Baris DB mentah per minat (area + tags aware) untuk dipakai ulang,
     * mis. generator fallback. Tanpa scoring — urut relevansi.
     *
     * @return array [{name,category,location,body,entry_fee,tags}]
     */
    public function findRowsForInterests(array $interests, string $location, int $limit = 20): array
    {
        try {
            $area = $this->normalizeArea($location);
            $out = [];
            $seen = [];
            foreach ($interests as $interest) {
                $tokens = $this->interestTokens($interest);
                $scored = [];
                foreach ($this->sourcesForInterest($interest) as [$model, $catSlug]) {
                    try {
                        $q = $model::where('is_active', true);
                        if ($model === Destinasi::class) {
                            $q->whereNotIn('slug', PortalController::PILLARS);
                            if ($catSlug !== null) {
                                $q->whereHas('categoryRef', fn ($qq) => $qq->where('slug', $catSlug));
                            }
                        }
                        foreach ($q->get() as $r) {
                            if (! $this->rowAreaMatches($r, $area)) {
                                continue;
                            }
                            $key = $model.':'.$r->id;
                            if (isset($seen[$key])) {
                                continue;
                            }
                            $score = 0;
                            $rowTags = strtolower($r->tags ?? '');
                            $rowName = strtolower($r->name ?? '');
                            foreach ($tokens as $t) {
                                if ($rowTags !== '' && str_contains($rowTags, $t)) {
                                    $score += 2;
                                } elseif (str_contains($rowName, $t)) {
                                    $score += 1;
                                }
                            }
                            $seen[$key] = true;
                            $scored[] = ['score' => $score, 'row' => $r];
                        }
                    } catch (\Throwable $e) {
                        Log::warning('GroundingBuilder find rows failed: '.$e->getMessage());
                    }
                }
                usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);
                foreach (array_slice($scored, 0, $limit) as $s) {
                    $r = $s['row'];
                    $out[] = [
                        'name' => $r->name,
                        'category' => $this->categoryOf(get_class($r)),
                        'location' => $r->location_name ?? $r->location ?? $r->area ?? null,
                        'body' => $r->body,
                        'entry_fee' => $this->entryFeeFor($r),
                    ];
                }
                if (count($out) >= $limit) {
                    break;
                }
            }

            return array_slice($out, 0, $limit);
        } catch (\Throwable $e) {
            Log::warning('GroundingBuilder find rows failed: '.$e->getMessage());

            return [];
        }
    }

    private function categoryOf(string $model): string
    {
        return match ($model) {
            Budaya::class => 'budaya',
            Kuliner::class => 'kuliner',
            Kerajinan::class => 'kerajinan',
            Event::class => 'event',
            default => 'destinasi',
        };
    }

    private function entryFeeFor($row): ?int
    {
        try {
            if (! isset($row->id) || $this->categoryOf(get_class($row)) !== 'destinasi') {
                return null;
            }
            $min = DestinationPriceEstimate::where('destinasi_id', $row->id)
                ->where('is_active', true)
                ->where('jenis', 'tiket_masuk')
                ->min('harga');

            return $min !== null ? (int) $min : null;
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function knowledgeContext(): string
    {
        try {
            return Knowledge::where('is_active', true)->limit(15)->get(['topic', 'question', 'answer'])
                ->map(fn ($k) => "- [{$k->topic}] {$k->question}: {$k->answer}")
                ->implode("\n");
        } catch (\Throwable $e) {
            Log::warning('GroundingBuilder knowledge context failed: '.$e->getMessage());

            return '';
        }
    }

    public function priceContext(): string
    {
        try {
            return DestinationPriceEstimate::with('destinasi:id,name')
                ->where('is_active', true)
                ->orderBy('destinasi_id')
                ->limit(30)
                ->get()
                ->map(fn ($p) => '- '.($p->destinasi?->name ?? 'Umum').
                    " [{$p->jenis}] {$p->label}: Rp ".number_format($p->harga, 0, ',', '.').
                    ($p->satuan ? " /{$p->satuan}" : ''))
                ->implode("\n");
        } catch (\Throwable $e) {
            Log::warning('GroundingBuilder price context failed: '.$e->getMessage());

            return '';
        }
    }

    /**
     * Estimasi biaya dari database: tiket/wahana per destinasi hasil
     * + harga kuliner yang cocok preferensi. Murni hitungan DB.
     *
     * @return array {destinations:[{name,slug,entry_fee,subtotal,items[]}], foods:[{name,harga}], total:int, currency:string}
     */
    public function costEstimate(array $places, string $foodPref): array
    {
        try {
            $destinations = [];
            $total = 0;

            foreach ($places as $p) {
                if (($p['category'] ?? '') !== 'destinasi') {
                    continue;
                }
                $id = (int) str_replace('destinasi:', '', (string) ($p['key'] ?? ''));
                if ($id <= 0) {
                    continue;
                }
                $items = DestinationPriceEstimate::where('destinasi_id', $id)
                    ->where('is_active', true)
                    ->orderBy('harga')
                    ->get(['jenis', 'label', 'harga', 'satuan']);
                if ($items->isEmpty()) {
                    continue;
                }
                $entryFee = $items->where('jenis', 'tiket_masuk')->min('harga');
                $subtotal = $items->sum(fn ($i) => (int) $i->harga);
                $destinations[] = [
                    'name' => $p['name'],
                    'slug' => $p['slug'] ?? null,
                    'entry_fee' => $entryFee !== null ? (int) $entryFee : null,
                    'subtotal' => $subtotal,
                    'items' => $items->map(fn ($i) => [
                        'label' => $i->label,
                        'jenis' => $i->jenis,
                        'harga' => (int) $i->harga,
                        'satuan' => $i->satuan,
                    ])->all(),
                ];
                $total += $subtotal;
            }

            $foods = $this->foodPrices($foodPref, 5);
            foreach ($foods as $f) {
                $total += $f['harga'] ?? 0;
            }

            return [
                'destinations' => $destinations,
                'foods' => $foods,
                'total' => $total,
                'currency' => 'IDR',
            ];
        } catch (\Throwable $e) {
            Log::warning('GroundingBuilder cost estimate failed: '.$e->getMessage());

            return ['destinations' => [], 'foods' => [], 'total' => 0, 'currency' => 'IDR'];
        }
    }

    /**
     * Harga kuliner terurut relevansi preferensi (nama + harga).
     */
    public function foodPrices(string $foodPref, int $limit = 4): array
    {
        try {
            $foodTokens = $this->interestTokens($foodPref);
            $rows = Kuliner::where('is_active', true)->limit(12)->get(['name', 'harga', 'tags']);
            $scored = [];
            foreach ($rows as $k) {
                $score = 0;
                $tags = strtolower($k->tags ?? '');
                foreach ($foodTokens as $t) {
                    if ($tags !== '' && str_contains($tags, $t)) {
                        $score += 2;
                    } elseif (str_contains(strtolower($k->name), $t)) {
                        $score += 1;
                    }
                }
                $scored[] = [
                    'score' => $score,
                    'name' => $k->name,
                    'harga' => $k->harga !== null ? (int) $k->harga : null,
                ];
            }
            usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);

            $seen = [];
            $out = [];
            foreach ($scored as $s) {
                if (isset($seen[$s['name']])) {
                    continue;
                }
                $seen[$s['name']] = true;
                $out[] = ['name' => $s['name'], 'harga' => $s['harga']];
                if (count($out) >= $limit) {
                    break;
                }
            }

            return $out;
        } catch (\Throwable $e) {
            Log::warning('GroundingBuilder food prices failed: '.$e->getMessage());

            return [];
        }
    }

    private function kulinerReferenceBlock(string $foodPref): string
    {
        try {
            $names = array_column($this->foodPrices($foodPref, 4), 'name');
            if ($names) {
                return '[Referensi Kuliner — untuk preferensi makanan "'.$foodPref.'"]'."\n".
                    implode("\n", array_map(fn ($n) => '- '.$n, $names));
            }

            return '[Referensi Kuliner] — data kosong, gunakan pengetahuanmu tentang kuliner Gorontalo.';
        } catch (\Throwable $e) {
            Log::warning('GroundingBuilder kuliner context failed: '.$e->getMessage());

            return '[Referensi Kuliner] — data kosong, gunakan pengetahuanmu tentang kuliner Gorontalo.';
        }
    }

    /**
     * Filter area deterministik: kolom `area` eksplisit menang,
     * fallback ke parsing `location` lama bila kosong.
     */
    private function rowAreaMatches($row, ?string $area): bool
    {
        if ($area === null) {
            return true;
        }
        $explicit = trim((string) ($row->area ?? ''));
        if ($explicit !== '') {
            return $this->areaKey($explicit) === $area;
        }
        $rowLoc = $row->location_name ?? $row->location ?? null;

        return $this->areaMatches($rowLoc, $area);
    }

    private function areaKey(?string $s): string
    {
        $s = strtolower(trim((string) $s));
        $s = str_replace(['.', ','], '', $s);
        $s = str_replace('kabupaten', 'kab', $s);

        return preg_replace('/[^a-z0-9]/', '', $s);
    }

    /**
     * Token kata (≥3 huruf) untuk pencocokan tags/nama.
     */
    private function interestTokens(string $text): array
    {
        $words = preg_split('/[^a-z0-9]+/', strtolower($text)) ?: [];

        return array_values(array_unique(array_filter($words, fn ($w) => strlen($w) >= 3)));
    }

    /**
     * Normalisasi nama area agar "BoneBolango" == "Bone Bolango".
     * Return null untuk se-Provinsi (tanpa filter area).
     */
    private function normalizeArea(string $location): ?string
    {
        $loc = strtolower(trim($location));
        if ($loc === '' || $loc === 'gorontalo' || $loc === 'provinsi gorontalo') {
            return null;
        }
        $loc = str_replace(['.', ','], '', $loc);
        $loc = str_replace('kabupaten', 'kab', $loc);
        $key = preg_replace('/[^a-z0-9]/', '', $loc);

        return $key !== '' ? $key : null;
    }

    private function areaMatches(?string $rowLocation, ?string $area): bool
    {
        if ($area === null) {
            return true;
        }
        if ($rowLocation === null || trim($rowLocation) === '') {
            return true; // tanpa info lokasi: ikut (semua konten Gorontalo)
        }
        $loc = strtolower(trim($rowLocation));
        $loc = str_replace(['.', ','], '', $loc);
        $loc = str_replace('kabupaten', 'kab', $loc);
        $norm = preg_replace('/[^a-z0-9]/', '', $loc);

        return str_contains($norm, $area) || str_contains($area, $norm);
    }

    /**
     * Petakan satu minat ke sumber DB: [model, slug-kategori-destinasi|null].
     * Array kosong = tidak ada padanan DB (AI mencari sendiri).
     */
    private function sourcesForInterest(string $interest): array
    {
        $in = strtolower($interest);
        $has = fn (...$needles) => collect($needles)->contains(fn ($n) => str_contains($in, $n));

        if ($has('pantai', 'laut', 'bahari', 'snorkeling', 'diving', 'island', 'selam')) {
            return [[Destinasi::class, 'laut']];
        }
        if ($has('gunung', 'hiking', 'pendaki', 'air terjun', 'alam', 'petualangan', 'adventure', 'cagar', 'hutan')) {
            return [[Destinasi::class, 'pegunungan'], [Destinasi::class, 'laut']];
        }
        if ($has('budaya', 'sejarah', 'adat', 'seni', 'saronde', 'dikili', 'museum')) {
            return [[Budaya::class, null]];
        }
        if ($has('kuliner', 'makan', 'food', 'jajan', 'cafe', 'kafe', 'resto', 'seafood')) {
            return [[Kuliner::class, null]];
        }
        if ($has('belanja', 'souvenir', 'oleh', 'karawo', 'pasar', 'shopping')) {
            return [[Kerajinan::class, null]];
        }
        if ($has('festival', 'event', 'karnaval', 'acara', 'konser', 'pesta')) {
            return [[Event::class, null]];
        }
        if ($has('spa', 'kesehatan', 'pijat', 'massage', 'refleksi')) {
            return [];
        }
        if ($has('difabel', 'disabilitas', 'akses khusus', 'kursi roda')) {
            return [];
        }

        // Umum (tempat wisata, tur, hidden gems, dsb.): seluruh destinasi
        return [[Destinasi::class, null]];
    }
}

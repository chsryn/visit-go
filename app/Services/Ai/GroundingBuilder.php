<?php

namespace App\Services\Ai;

use App\Http\Controllers\PortalController;
use App\Models\Budaya;
use App\Models\Destinasi;
use App\Models\DestinationPriceEstimate;
use App\Models\Event;
use App\Models\Kerajinan;
use App\Models\Knowledge;
use App\Models\Umkm;
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
                // Token minat + kosakata bucket-nya (mis. gunung → nantu/lombongo)
                $tokens = InterestProfile::keywordsForInterest($interest);
                // Sapu tags lintas tabel: bila ada yang cocok, HANYA itu yang dipakai
                // (ketat sesuai tags admin). Bila kosong, lanjut ke logika tabel.
                $sweepLines = [];
                foreach ($this->sweepTags($tokens, $area, 12) as $hit) {
                    $r = $hit['row'];
                    $line = '- '.$r->name;
                    if (! empty($r->body)) {
                        $line .= ': '.substr(strip_tags($r->body), 0, 120);
                    }
                    $sweepLines[] = $line;
                }
                $sweepLines = array_values(array_unique($sweepLines));
                if ($sweepLines) {
                    $totalRows += count($sweepLines);
                    $blocks[] = "[Minat: {$interest}]\n".implode("\n", $sweepLines);
                    foreach ($this->sourcesForInterest($interest) as [$model]) {
                        if ($model === Umkm::class) {
                            $kulinerIncluded = true;
                        }
                    }

                    continue;
                }
                $scored = [];
                foreach ($this->sourcesForInterest($interest) as [$model]) {
                    if ($model === Umkm::class) {
                        $kulinerIncluded = true;
                    }
                    // Gate: tabel non-destinasi + baris bertag tapi skor nol = bukan untuk minat ini.
                    // Baris tanpa tags tetap ikut (tak bisa dinilai).
                    $strict = $model !== Destinasi::class;
                    try {
                        // Umkm hanya dipakai untuk minat kuliner
                        $q = $model === Umkm::class
                            ? $model::whereHas('jenisRef', fn ($qq) => $qq->where('slug', 'kuliner'))->where('is_active', true)
                            : $model::where('is_active', true);
                        if ($model === Destinasi::class) {
                            $q->whereNotIn('slug', PortalController::PILLARS);
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
                            if ($strict && $rowTags !== '' && $score === 0) {
                                continue;
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
                // Token minat + kosakata bucket-nya (mis. gunung → nantu/lombongo)
                $tokens = InterestProfile::keywordsForInterest($interest);
                // Jatah adil per minat agar minat pertama tak menghabiskan limit
                $perInterest = max(1, (int) ceil($limit / max(1, count($interests))));
                // Sapu tags lintas tabel: bila ada yang cocok, HANYA itu yang dipakai
                $sweepRows = [];
                foreach ($this->sweepTags($tokens, $area, $perInterest) as $hit) {
                    $r = $hit['row'];
                    $seenKey = $hit['model'].':'.$r->id;
                    if (isset($seen[$seenKey])) {
                        continue;
                    }
                    $seen[$seenKey] = true;
                    $sweepRows[] = $r;
                }
                if ($sweepRows) {
                    foreach ($sweepRows as $r) {
                        $out[] = $this->rowShape($r);
                    }
                    if (count($out) >= $limit) {
                        break;
                    }

                    continue;
                }
                $scored = [];
                foreach ($this->sourcesForInterest($interest) as [$model]) {
                    // Gate: tabel non-destinasi + baris bertag tapi skor nol = bukan untuk minat ini
                    $strict = $model !== Destinasi::class;
                    try {
                        // Umkm hanya dipakai untuk minat kuliner
                        $q = $model === Umkm::class
                            ? $model::whereHas('jenisRef', fn ($qq) => $qq->where('slug', 'kuliner'))->where('is_active', true)
                            : $model::where('is_active', true);
                        if ($model === Destinasi::class) {
                            $q->whereNotIn('slug', PortalController::PILLARS);
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
                            if ($strict && $rowTags !== '' && $score === 0) {
                                continue;
                            }
                            $seen[$key] = true;
                            $scored[] = ['score' => $score, 'row' => $r];
                        }
                    } catch (\Throwable $e) {
                        Log::warning('GroundingBuilder find rows failed: '.$e->getMessage());
                    }
                }
                usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);
                foreach (array_slice($scored, 0, $perInterest) as $s) {
                    $out[] = $this->rowShape($s['row']);
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

    private function rowShape($r): array
    {
        return [
            'name' => $r->name,
            'category' => $this->categoryOf(get_class($r)),
            'location' => $r->location_name ?? $r->location ?? $r->area ?? null,
            'body' => $r->body,
            'entry_fee' => $this->entryFeeFor($r),
        ];
    }

    private function categoryOf(string $model): string
    {
        return match ($model) {
            Budaya::class => 'budaya',
            Kerajinan::class => 'kerajinan',
            Event::class => 'event',
            // Baris UMKM yang dibaca AI selalu berjenis kuliner
            Umkm::class => 'kuliner',
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
     * Sumber: UMKM berjenis kuliner.
     */
    public function foodPrices(string $foodPref, int $limit = 4): array
    {
        try {
            $foodTokens = $this->interestTokens($foodPref);
            $rows = Umkm::where('is_active', true)->whereHas('jenisRef', fn ($q) => $q->where('slug', 'kuliner'))->limit(12)->get(['name', 'harga', 'tags']);
            $scored = [];
            foreach ($rows as $k) {
                $scored[] = [
                    'score' => $this->foodScore($k->name, $k->tags ?? '', $foodTokens),
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

    private function foodScore(string $name, ?string $tags, array $tokens): int
    {
        $score = 0;
        $tags = strtolower($tags ?? '');
        foreach ($tokens as $t) {
            if ($tags !== '' && str_contains($tags, $t)) {
                $score += 2;
            } elseif (str_contains(strtolower($name), $t)) {
                $score += 1;
            }
        }

        return $score;
    }

    /**
     * Sapu tags lintas tabel: baris aktif yang tags-nya cocok token,
     * terlepas dari pemetaan minat→tabel. Intent eksplisit admin selalu menang.
     *
     * @return array [{score, model, row}]
     */
    public function sweepTags(array $tokens, ?string $area, int $limit = 20): array
    {
        if (! $tokens) {
            return [];
        }
        $hits = [];
        $tables = [
            Destinasi::class,
            Budaya::class,
            Umkm::class,
            Kerajinan::class,
            Event::class,
        ];
        foreach ($tables as $model) {
            try {
                // Umkm hanya relevan untuk minat kuliner
                $query = $model === Umkm::class
                    ? $model::whereHas('jenisRef', fn ($q) => $q->where('slug', 'kuliner'))->where('is_active', true)
                    : $model::where('is_active', true);
                foreach ($query->get() as $r) {
                    $tags = strtolower($r->tags ?? '');
                    if ($tags === '') {
                        continue;
                    }
                    $score = 0;
                    foreach ($tokens as $t) {
                        if (str_contains($tags, $t)) {
                            $score += 2;
                        }
                    }
                    if ($score <= 0) {
                        continue;
                    }
                    if (! $this->rowAreaMatches($r, $area)) {
                        continue;
                    }
                    $hits[] = ['score' => $score, 'model' => $model, 'row' => $r];
                }
            } catch (\Throwable $e) {
                Log::warning('GroundingBuilder tag sweep failed: '.$e->getMessage());
            }
        }
        usort($hits, fn ($a, $b) => $b['score'] <=> $a['score']);

        return array_slice($hits, 0, $limit);
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
     * Publik agar orkestrator bisa meneruskannya ke validator.
     */
    public function normalizeArea(string $location): ?string
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
     * Petakan satu minat ke tabel DB (destinasi flat, tanpa sub-kategori).
     * Array kosong = tidak ada padanan DB (AI mencari sendiri).
     */
    private function sourcesForInterest(string $interest): array
    {
        $in = strtolower($interest);
        $has = fn (...$needles) => collect($needles)->contains(fn ($n) => str_contains($in, $n));

        if ($has('pantai', 'laut', 'bahari', 'snorkeling', 'diving', 'island', 'selam', 'gunung', 'hiking', 'pendaki', 'air terjun', 'alam', 'petualangan', 'adventure', 'cagar', 'hutan')) {
            return [[Destinasi::class]];
        }
        if ($has('budaya', 'sejarah', 'adat', 'seni', 'saronde', 'dikili', 'museum')) {
            return [[Budaya::class]];
        }
        if ($has('kuliner', 'makan', 'food', 'jajan', 'cafe', 'kafe', 'resto', 'seafood')) {
            return [[Umkm::class]];
        }
        if ($has('belanja', 'souvenir', 'oleh', 'karawo', 'pasar', 'shopping')) {
            return [[Kerajinan::class]];
        }
        if ($has('festival', 'event', 'karnaval', 'acara', 'konser', 'pesta')) {
            return [[Event::class]];
        }
        if ($has('spa', 'kesehatan', 'pijat', 'massage', 'refleksi')) {
            return [];
        }
        if ($has('difabel', 'disabilitas', 'akses khusus', 'kursi roda')) {
            return [];
        }

        // Umum (tempat wisata, tur, hidden gems, dsb.): seluruh destinasi
        return [[Destinasi::class]];
    }
}

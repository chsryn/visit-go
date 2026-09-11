<?php

namespace App\Services\Ai;

use App\Models\Budaya;
use App\Models\Destinasi;
use App\Models\Event;
use App\Models\Kerajinan;
use App\Models\Umkm;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * Mencocokkan string lokasi bebas (output AI) ke baris database
 * untuk kebutuhan peta interaktif (gambar + koordinat).
 */
class PlaceResolver
{
    private const MAX_PLACES = 15;

    private const MIN_NAME_LENGTH = 4;

    private const COLUMNS = ['id', 'name', 'slug', 'body', 'image', 'latitude', 'longitude'];

    /**
     * Kata yang menandai klaim tempat spesifik (bukan rujukan generik).
     * Lokasi tak dikenal yang memuat kata ini = potensi fabrikan → buang.
     */
    private const CLAIM_WORDS = [
        'gunung', 'pulau', 'pantai', 'air terjun', 'danau', 'menara', 'benteng',
        'museum', 'masjid', 'pura', 'gereja', 'vihara', 'resort', 'villa', 'hotel',
        'waterfall', 'island', 'beach', 'tower', 'goa', 'cave', 'teluk', 'tanjung',
        'embung', 'waduk', 'bukit', 'lembah', 'cagar', 'taman nasional',
    ];

    /**
     * @return array [{key,name,location,category,slug,image,latitude,longitude,body}]
     */
    public function resolve(array $itinerary): array
    {
        try {
            $locations = collect($itinerary['days'] ?? [])
                ->flatMap(fn ($day) => $day['activities'] ?? [])
                ->pluck('location')
                ->filter(fn ($l) => is_string($l) && trim($l) !== '')
                ->map(fn ($l) => trim($l))
                ->unique()
                ->values();

            if ($locations->isEmpty()) {
                return [];
            }

            $candidates = $this->candidates();
            $places = [];
            $seen = [];
            foreach ($locations as $loc) {
                if (count($places) >= self::MAX_PLACES) {
                    break;
                }
                $match = $this->matchLocation($loc, $candidates, $seen);
                if ($match !== null) {
                    $seen[$match['key']] = true;
                    $places[] = array_merge($match, ['location' => $loc]);
                }
            }

            return $places;
        } catch (\Throwable $e) {
            Log::warning('PlaceResolver warning: '.$e->getMessage());

            return [];
        }
    }

    private function candidates(): Collection
    {
        $candidates = collect();
        $tables = [
            [Destinasi::class, 'destinasi', null],
            [Budaya::class, 'budaya', null],
            [Umkm::class, 'kuliner', 'kuliner'],
            // Kerajinan = UMKM berjenis karawo
            [Umkm::class, 'kerajinan', 'karawo'],
            [Event::class, 'event', null],
        ];
        foreach ($tables as [$model, $category, $jenis]) {
            $rows = $model === Umkm::class
                ? $model::ofJenis($jenis)->where('is_active', true)->get(self::COLUMNS)
                : $model::where('is_active', true)->get(self::COLUMNS);
            foreach ($rows as $r) {
                if (mb_strlen($r->name) < self::MIN_NAME_LENGTH) {
                    continue;
                }
                $candidates->push([
                    'key' => $category.':'.$r->id,
                    'name' => $r->name,
                    'category' => $category,
                    'slug' => $r->slug,
                    'image' => $this->publicImageUrl($r->image),
                    'latitude' => $r->latitude !== null ? (float) $r->latitude : null,
                    'longitude' => $r->longitude !== null ? (float) $r->longitude : null,
                    'body' => $r->body,
                ]);
            }
        }

        return $candidates;
    }

    private function matchLocation(string $loc, Collection $candidates, array $seen): ?array
    {
        $low = mb_strtolower($loc);
        foreach ($candidates as $c) {
            if (isset($seen[$c['key']])) {
                continue;
            }
            $cn = mb_strtolower($c['name']);
            if (str_contains($low, $cn) || str_contains($cn, $low)) {
                return $c;
            }
        }

        return null;
    }

    /**
     * Daftar tempat dikenal (nama + area) dari database untuk validasi
     * anti-fiksi: aktivitas yang lokasinya tak cocok tempat DB mana pun
     * dianggap fabrikan.
     *
     * @return array [{name, area}]
     */
    public function knownPlaces(): array
    {
        try {
            $out = [];
            // [model, jenis UMKM, punya kolom area?] — umkms tak punya kolom area
            $specs = [
                [Destinasi::class, null, true],
                [Budaya::class, null, true],
                [Umkm::class, 'kuliner', false],
                [Umkm::class, 'karawo', false],
                [Event::class, null, true],
            ];
            foreach ($specs as [$model, $jenis, $hasArea]) {
                $rows = $model === Umkm::class
                    ? $model::ofJenis($jenis)->where('is_active', true)->get(['name'])
                    : $model::where('is_active', true)->get(['name', 'area']);
                foreach ($rows as $r) {
                    if (mb_strlen($r->name ?? '') < self::MIN_NAME_LENGTH) {
                        continue;
                    }
                    $out[] = ['name' => $r->name, 'area' => $hasArea ? ($r->area ?? null) : null];
                }
            }

            return $out;
        } catch (\Throwable $e) {
            Log::warning('PlaceResolver known places failed: '.$e->getMessage());

            return [];
        }
    }

    /**
     * Buang aktivitas fiktif: lokasi tak cocok tempat DB dan tak menyebut
     * area yang diminta, atau cocok nama DB tapi area-nya dipindah.
     * Hari yang kosong ikut dibuang; day_number diurut ulang.
     *
     * @return array [array $itinerary, int $removedCount]
     */
    public function filterFabricated(array $itinerary, ?string $areaKey): array
    {
        try {
            $known = $this->knownPlaces();
            if (! $known) {
                return [$itinerary, 0]; // tak bisa menilai tanpa data — biarkan lolos
            }
            $removed = 0;
            $days = [];
            foreach ($itinerary['days'] ?? [] as $day) {
                $kept = [];
                foreach ($day['activities'] ?? [] as $act) {
                    if ($this->isGenuineLocation($act['location'] ?? '', $known, $areaKey)) {
                        $kept[] = $act;
                    } else {
                        $removed++;
                    }
                }
                if ($kept) {
                    $day['activities'] = array_values($kept);
                    $days[] = $day;
                } else {
                    $removed += 0; // hari kosong: aktivitasnya sudah dihitung di atas
                }
            }
            foreach (array_values($days) as $i => &$day) {
                $day['day_number'] = $i + 1;
            }
            unset($day);
            $itinerary['days'] = $days;

            return [$itinerary, $removed];
        } catch (\Throwable $e) {
            Log::warning('PlaceResolver filter failed: '.$e->getMessage());

            return [$itinerary, 0];
        }
    }

    private function isGenuineLocation(string $location, array $known, ?string $areaKey): bool
    {
        $low = mb_strtolower(trim($location));
        if ($low === '') {
            return false;
        }
        $best = null;
        foreach ($known as $k) {
            $cn = mb_strtolower($k['name']);
            if (str_contains($low, $cn) || str_contains($cn, $low)) {
                $best = $k;
                break;
            }
        }
        if ($best === null) {
            // Bukan tempat dikenal: lolos hanya bila menyebut area yang diminta
            // DAN tanpa kata klaim tempat spesifik (warung/restoran generik boleh,
            // "Gunung X"/"Pantai Y" tak dikenal = potensi fabrikan).
            if ($areaKey === null || ! str_contains($this->areaKey($low), $areaKey)) {
                return false;
            }
            foreach (self::CLAIM_WORDS as $w) {
                if (str_contains($low, $w)) {
                    return false;
                }
            }

            return true;
        }
        // Cocok nama DB: tolak bila area-nya dipindah (relokasi).
        $rowAreaKey = $best['area'] ? $this->areaKey($best['area']) : null;
        if ($rowAreaKey === null || $rowAreaKey === '') {
            return true; // area DB tak diketahui — tak bisa menilai
        }
        $norm = $this->areaKey($low);
        foreach ($this->knownAreaKeys() as $other) {
            if ($other !== '' && $other !== $rowAreaKey && str_contains($norm, $other)) {
                return false;
            }
        }

        return true;
    }

    private function areaKey(string $s): string
    {
        $s = strtolower(trim($s));
        $s = str_replace(['.', ','], '', $s);
        $s = str_replace('kabupaten', 'kab', $s);

        return preg_replace('/[^a-z0-9]/', '', $s) ?? '';
    }

    /** @return string[] */
    private function knownAreaKeys(): array
    {
        try {
            return collect(Destinasi::AREAS)
                ->map(fn ($a) => $this->areaKey($a))
                ->filter()
                ->values()
                ->all();
        } catch (\Throwable $e) {
            return [];
        }
    }

    private function publicImageUrl(?string $path): ?string
    {
        if (! $path || trim($path) === '') {
            return null;
        }
        $path = trim($path);
        if (str_starts_with($path, 'http') || str_starts_with($path, '/storage') || str_contains($path, '/build/')) {
            return $path;
        }
        if (str_starts_with($path, 'uploads/')) {
            return '/storage/'.$path;
        }

        return '/'.ltrim($path, '/');
    }
}

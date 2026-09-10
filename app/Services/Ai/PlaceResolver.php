<?php

namespace App\Services\Ai;

use App\Models\Budaya;
use App\Models\Destinasi;
use App\Models\Event;
use App\Models\Kerajinan;
use App\Models\Kuliner;
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
            [Destinasi::class, 'destinasi'],
            [Budaya::class, 'budaya'],
            [Kuliner::class, 'kuliner'],
            [Kerajinan::class, 'kerajinan'],
            [Event::class, 'event'],
        ];
        foreach ($tables as [$model, $category]) {
            foreach ($model::where('is_active', true)->get(self::COLUMNS) as $r) {
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

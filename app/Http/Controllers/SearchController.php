<?php

namespace App\Http\Controllers;

use App\Models\Budaya;
use App\Models\Destinasi;
use App\Models\Event;
use App\Models\Kerajinan;
use App\Models\Kuliner;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SearchController extends Controller
{
    private const TYPES = ['destinasi', 'budaya', 'kuliner', 'kerajinan', 'event'];

    public function index(Request $request)
    {
        $validated = $request->validate([
            'q' => 'nullable|string|max:100',
            'type' => 'nullable|string|in:destinasi,budaya,kuliner,kerajinan,event',
        ]);
        $q = trim((string) ($validated['q'] ?? ''));
        $type = $validated['type'] ?? null;

        $results = [];
        $counts = [];
        $total = 0;

        if ($q !== '') {
            $data = $this->searchAll($q, $type, 20);
            $results = $data['items'];
            $counts = $data['counts'];
            $total = $data['total'];
        }

        return Inertia::render('Search/Index', [
            'q' => $q,
            'type' => $type,
            'results' => $results,
            'counts' => $counts,
            'total' => $total,
        ]);
    }

    public function api(Request $request)
    {
        $validated = $request->validate([
            'q' => 'nullable|string|max:100',
            'type' => 'nullable|string|in:destinasi,budaya,kuliner,kerajinan,event',
            'limit' => 'nullable|integer|min:1|max:10',
        ]);
        $q = trim((string) ($validated['q'] ?? $request->query('q', '')));
        $type = $validated['type'] ?? null;
        $limit = min(max((int) ($validated['limit'] ?? $request->query('limit', 5)), 1), 10);

        if ($q === '' || mb_strlen($q) < 2) {
            return response()->json(['items' => [], 'counts' => []]);
        }

        $data = $this->searchAll($q, $type, $limit);

        return response()->json([
            'items' => $data['items'],
            'counts' => $data['counts'],
        ]);
    }

    private function searchAll(string $q, ?string $filterType, int $limitPerType): array
    {
        // escape % and _ for LIKE
        $escaped = str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $q);
        $like = "%{$escaped}%";

        $types = $filterType && in_array($filterType, self::TYPES) ? [$filterType] : self::TYPES;

        $all = collect();
        $counts = [];

        foreach ($types as $type) {
            $items = $this->queryType($type, $like, $q, $limitPerType);
            $counts[$type] = $items->count();
            $all = $all->merge($items);
        }

        // sort by relevance: name match first, then latest
        // ponytail: O(n) union scan, add FULLTEXT/Meilisearch if >10k rows
        $all = $all->sort(function ($a, $b) use ($q) {
            $qLower = mb_strtolower($q);
            $aName = mb_strtolower($a['name'] ?? '');
            $bName = mb_strtolower($b['name'] ?? '');
            $aHit = str_contains($aName, $qLower) ? 0 : 1;
            $bHit = str_contains($bName, $qLower) ? 0 : 1;
            if ($aHit !== $bHit) return $aHit <=> $bHit;
            return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
        })->values();

        return [
            'items' => $all->values()->all(),
            'counts' => $counts,
            'total' => $all->count(),
        ];
    }

    private function queryType(string $type, string $like, string $rawQ, int $limit)
    {
        return match ($type) {
            'destinasi' => $this->queryDestinasi($like, $limit),
            'budaya' => $this->queryBudaya($like, $limit),
            'kuliner' => $this->queryKuliner($like, $limit),
            'kerajinan' => $this->queryKerajinan($like, $limit),
            'event' => $this->queryEvent($like, $limit),
            default => collect(),
        };
    }

    private function queryDestinasi(string $like, int $limit)
    {
        return Destinasi::where('is_active', true)
            ->where(function ($w) use ($like) {
                $w->where('name', 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhere('body', 'like', $like)
                    ->orWhere('location', 'like', $like);
            })
            ->latest()
            ->limit($limit)
            ->get(['id', 'name', 'slug', 'body', 'image', 'alt', 'location', 'created_at'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'category' => 'destinasi',
                'body' => Str::limit(strip_tags($r->body), 110),
                'image' => $r->image,
                'alt' => $r->alt,
                'location' => $r->location,
                'created_at' => $r->created_at?->toDateTimeString(),
                'href' => "/destinasi/{$r->slug}",
            ]);
    }

    private function queryBudaya(string $like, int $limit)
    {
        return Budaya::where('is_active', true)
            ->where(function ($w) use ($like) {
                $w->where('name', 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhere('body', 'like', $like);
            })
            ->latest()
            ->limit($limit)
            ->get(['id', 'name', 'slug', 'body', 'image', 'alt', 'created_at'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'category' => 'budaya',
                'body' => Str::limit(strip_tags($r->body), 110),
                'image' => $r->image,
                'alt' => $r->alt,
                'location' => null,
                'created_at' => $r->created_at?->toDateTimeString(),
                'href' => "/budaya/{$r->slug}",
            ]);
    }

    private function queryKuliner(string $like, int $limit)
    {
        return Kuliner::where('is_active', true)
            ->where(function ($w) use ($like) {
                $w->where('name', 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhere('body', 'like', $like);
            })
            ->latest()
            ->limit($limit)
            ->get(['id', 'name', 'slug', 'body', 'image', 'alt', 'created_at'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'category' => 'kuliner',
                'body' => Str::limit(strip_tags($r->body), 110),
                'image' => $r->image,
                'alt' => $r->alt,
                'location' => null,
                'created_at' => $r->created_at?->toDateTimeString(),
                'href' => "/kuliner/{$r->slug}",
            ]);
    }

    private function queryKerajinan(string $like, int $limit)
    {
        return Kerajinan::where('is_active', true)
            ->where(function ($w) use ($like) {
                $w->where('name', 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhere('body', 'like', $like);
            })
            ->latest()
            ->limit($limit)
            ->get(['id', 'name', 'slug', 'body', 'image', 'alt', 'created_at'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'category' => 'kerajinan',
                'body' => Str::limit(strip_tags($r->body), 110),
                'image' => $r->image,
                'alt' => $r->alt,
                'location' => null,
                'created_at' => $r->created_at?->toDateTimeString(),
                'href' => "/kerajinan/{$r->slug}",
            ]);
    }

    private function queryEvent(string $like, int $limit)
    {
        return Event::where('is_active', true)
            ->where(function ($w) use ($like) {
                $w->where('name', 'like', $like)
                    ->orWhere('slug', 'like', $like)
                    ->orWhere('body', 'like', $like)
                    ->orWhere('location', 'like', $like)
                    ->orWhere('location_name', 'like', $like);
            })
            ->latest()
            ->limit($limit)
            ->get(['id', 'name', 'slug', 'body', 'image', 'alt', 'location', 'location_name', 'date', 'month', 'created_at'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'category' => 'event',
                'body' => Str::limit(strip_tags($r->body), 110),
                'image' => $r->image,
                'alt' => $r->alt,
                'location' => $r->location_name ?? $r->location,
                'date' => $r->date,
                'month' => $r->month,
                'created_at' => $r->created_at?->toDateTimeString(),
                'href' => "/event/{$r->slug}",
            ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Budaya;
use App\Models\Destinasi;
use App\Models\Event;
use App\Models\Umkm;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Maps');
    }

    /**
     * GET /admin/api/map-points — merged lat/lng from all content tables.
     */
    public function points()
    {
        $points = collect();
        $totals = [];

        $push = function ($rows, string $type) use ($points, &$totals) {
            $rows = $rows->get(['id', 'name', 'slug', 'latitude', 'longitude']);
            $totals[$type] = $rows->count();
            foreach ($rows as $r) {
                if ($r->latitude === null || $r->longitude === null) {
                    continue;
                }
                $points->push([
                    'type' => $type,
                    'id' => $r->id,
                    'name' => $r->name,
                    'slug' => $r->slug,
                    'latitude' => (float) $r->latitude,
                    'longitude' => (float) $r->longitude,
                ]);
            }
        };

        $push(Destinasi::where('is_active', true), 'destinasi');
        $push(Budaya::where('is_active', true)->where('has_location', true), 'budaya');
        // Kuliner & kerajinan = UMKM dengan kategori kuliner/kerajinan
        $push(Umkm::kuliner()->where('is_active', true), 'kuliner');
        $push(Umkm::kerajinan()->where('is_active', true), 'kerajinan');
        $push(Event::where('is_active', true), 'event');

        return response()->json([
            'points' => $points->values(),
            'totals' => $totals,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Budaya;
use App\Models\Destinasi;
use App\Models\Event;
use App\Models\Kerajinan;
use App\Models\Kuliner;
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

        $push = function ($rows, string $type) use ($points) {
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

        $push(Destinasi::where('is_active', true)->get(['id', 'name', 'slug', 'latitude', 'longitude']), 'destinasi');
        $push(Budaya::where('is_active', true)->get(['id', 'name', 'slug', 'latitude', 'longitude']), 'budaya');
        $push(Kuliner::where('is_active', true)->get(['id', 'name', 'slug', 'latitude', 'longitude']), 'kuliner');
        $push(Kerajinan::where('is_active', true)->get(['id', 'name', 'slug', 'latitude', 'longitude']), 'kerajinan');
        $push(Event::where('is_active', true)->get(['id', 'name', 'slug', 'latitude', 'longitude']), 'event');

        return response()->json(['points' => $points->values()]);
    }
}

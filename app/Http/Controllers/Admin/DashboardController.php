<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Budaya;
use App\Models\Category;
use App\Models\Destinasi;
use App\Models\Event;
use App\Models\Kerajinan;
use App\Models\Umkm;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'destinasi' => Destinasi::count(),
                'budaya' => Budaya::count(),
                'kuliner' => Umkm::ofJenis('kuliner')->count(),
                'kerajinan' => Kerajinan::count(),
                'event' => Event::count(),
                'categories' => Category::count(),
            ],
            'latest' => [
                'destinasi' => Destinasi::latest()->take(5)->get(['id', 'name', 'slug', 'is_active', 'created_at']),
                'events' => Event::latest()->take(5)->get(['id', 'name', 'slug', 'is_active', 'created_at']),
            ],
        ]);
    }
}

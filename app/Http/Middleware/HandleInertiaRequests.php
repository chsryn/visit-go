<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => fn () => $request->user()?->only(['id', 'name', 'email']),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'adminCategories' => fn () => $request->is('admin*')
                ? \App\Models\Category::destinationChildren()->orderBy('name')->get(['id', 'name', 'slug'])
                : [],
            'nav' => [
                // Dropdown navbar: destinasi + tabel barunya (legacy rows sudah dimigrasi keluar dari destinasis)
                'categories' => function () {
                    $tag = fn ($rows, $category) => $rows->map(fn ($r) => ['name' => $r->name, 'slug' => $r->slug, 'category' => $category]);
                    return $tag(\App\Models\Destinasi::where('is_active', true)->whereNotIn('slug', \App\Http\Controllers\PortalController::PILLARS)->latest()->take(10)->get(['name', 'slug']), 'destinasi')
                        ->merge($tag(\App\Models\Budaya::where('is_active', true)->latest()->take(10)->get(['name', 'slug']), 'budaya'))
                        ->merge($tag(\App\Models\Kuliner::where('is_active', true)->latest()->take(10)->get(['name', 'slug']), 'kuliner'))
                        ->merge($tag(\App\Models\Kerajinan::where('is_active', true)->latest()->take(10)->get(['name', 'slug']), 'kerajinan'))
                        ->values();
                },
                'events' => fn () => \App\Models\Event::where('is_active', true)->latest()->take(10)->get(['name', 'slug', 'location']),
            ],
        ];
    }
}

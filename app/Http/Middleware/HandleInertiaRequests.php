<?php

namespace App\Http\Middleware;

use App\Http\Controllers\PortalController;
use App\Models\Budaya;
use App\Models\Destinasi;
use App\Models\DestinationCategory;
use App\Models\Event;
use App\Models\Kerajinan;
use App\Models\Umkm;
use App\Models\UmkmJenis;
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
            // Jenis UMKM dinamis dari tabel master untuk accordion sidebar
            'adminUmkmJenis' => fn () => $request->is('admin*')
                ? UmkmJenis::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug'])
                : [],
            // Kategori destinasi dinamis dari tabel master untuk accordion sidebar
            'adminDestinationCategories' => fn () => $request->is('admin*')
                ? DestinationCategory::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug'])
                : [],
            'nav' => [
                // Dropdown navbar: destinasi + tabel barunya (legacy rows sudah dimigrasi keluar dari destinasis)
                'categories' => function () {
                    $tag = fn ($rows, $category) => $rows->map(fn ($r) => ['name' => $r->name, 'slug' => $r->slug, 'category' => $category]);

                    return $tag(Destinasi::where('is_active', true)->whereNotIn('slug', PortalController::PILLARS)->latest()->take(10)->get(['name', 'slug']), 'destinasi')
                        ->merge($tag(Budaya::where('is_active', true)->latest()->take(10)->get(['name', 'slug']), 'budaya'))
                        ->merge($tag(Umkm::ofJenis('kuliner')->where('is_active', true)->latest()->take(10)->get(['name', 'slug']), 'kuliner'))
                        ->merge($tag(Kerajinan::where('is_active', true)->latest()->take(10)->get(['name', 'slug']), 'kerajinan'))
                        ->values();
                },
                'events' => fn () => Event::where('is_active', true)->latest()->take(10)->get(['name', 'slug', 'location']),
            ],
        ];
    }
}

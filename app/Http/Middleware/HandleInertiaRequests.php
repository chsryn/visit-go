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
            'nav' => [
                'categories' => fn () => \App\Models\Destinasi::where('is_active', true)->whereNotIn('slug', \App\Http\Controllers\PortalController::PILLARS)->latest()->take(20)->get(['name', 'slug', 'category']),
                'events' => fn () => \App\Models\Event::where('is_active', true)->latest()->take(10)->get(['name', 'slug', 'location']),
            ],
        ];
    }
}

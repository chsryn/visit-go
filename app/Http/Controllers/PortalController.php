<?php

namespace App\Http\Controllers;

use App\Models\Budaya;
use App\Models\Category;
use App\Models\Destinasi;
use App\Models\Event;
use App\Models\Umkm;
use Inertia\Inertia;

class PortalController extends Controller
{
    public const PILLARS = ['botubarani-pulo-cinta','tari-saronde-dikili','milu-siram-ilabulo','kerajinan-daerah','sulaman-karawo'];

    public function index()
    {
        $events = Event::where('is_active', true)->orderBy('month')->take(6)->get();

        $kulinerSpotlight = Umkm::ofJenis('kuliner')->where('is_active', true)->latest()->take(3)->get(['id','name','slug','body','image','alt']);
        $kerajinanSpotlight = Umkm::ofJenis('karawo')->where('is_active', true)->latest()->take(2)->get(['id','name','slug','body','image','alt']);

        return Inertia::render('Welcome', [
            'events' => $events,
            'kulinerSpotlight' => $kulinerSpotlight,
            'kerajinanSpotlight' => $kerajinanSpotlight,
        ]);
    }

    public function indexByCategory(\Illuminate\Http\Request $request, ?string $category = null)
    {
        $category = $category ?? $request->route()->defaults['category'] ?? $request->route('category');
        abort_unless(in_array($category, ['destinasi','budaya','kuliner','kerajinan','event']), 404);
        if ($category === 'event') {
            $items = Event::where('is_active', true)->latest()->get(['id','name','slug','date','month','location','body','image','alt']);
            // map to same shape as Destinasi for Category/Index reuse
            $items = $items->map(fn($e) => ['id'=>$e->id,'name'=>$e->name,'slug'=>$e->slug,'category'=>'event','body'=>$e->body,'image'=>$e->image,'alt'=>$e->alt,'date'=>$e->date,'month'=>$e->month,'location'=>$e->location]);
        } else {
            // kuliner & kerajinan dibaca dari UMKM berjenis kuliner/karawo (tanpa tabel sendiri)
            $umkmJenis = match ($category) {
                'kuliner' => 'kuliner',
                'kerajinan' => 'karawo',
                default => null,
            };
            if ($umkmJenis) {
                $items = Umkm::ofJenis($umkmJenis)->where('is_active', true)->latest()->get(['id','name','slug','body','image','alt']);
            } else {
                $model = match ($category) {
                    'budaya' => Budaya::class,
                    default => Destinasi::class,
                };
                $items = $model::where('is_active', true)->latest()->get(['id','name','slug','body','image','alt']);
            }
            $items = $items->map(fn($i) => array_merge($i->toArray(), ['category' => $category]));
        }
        $banner = Category::where('slug', $category)->where('is_active', true)->first();
        return Inertia::render('Category/Index', [
            'category' => $category,
            'items' => $items,
            'banner' => $banner,
        ]);
    }

    public function show(string $category, string $slug)
    {
        if ($category === 'event') {
            $item = Event::where('slug', $slug)->where('is_active', true)->firstOrFail();
            $related = Event::where('id', '!=', $item->id)->where('is_active', true)->take(3)->get();
        } else {
            $umkmJenis = match ($category) {
                'kuliner' => 'kuliner',
                'kerajinan' => 'karawo',
                default => null,
            };
            if ($umkmJenis) {
                $item = Umkm::ofJenis($umkmJenis)->where('slug', $slug)->where('is_active', true)->firstOrFail();
                $related = Umkm::ofJenis($umkmJenis)->where('id', '!=', $item->id)->where('is_active', true)->take(3)->get();
            } else {
                $model = match ($category) {
                    'budaya' => Budaya::class,
                    default => Destinasi::class,
                };
                $item = $model::where('slug', $slug)->where('is_active', true)->firstOrFail();
                $related = $model::where('id', '!=', $item->id)->where('is_active', true)->take(3)->get();
            }
        }

        return Inertia::render('Detail', [
            'item' => $item,
            'category' => $category,
            'related' => $related,
        ]);
    }

    /**
     * GET /destinasi — daftar flat semua destinasi aktif (tanpa sub-kategori).
     */
    public function destinationIndex()
    {
        $items = Destinasi::where('is_active', true)
            ->whereNotIn('slug', self::PILLARS)
            ->latest()
            ->get();

        $banner = Category::where('slug', 'destinasi')->where('is_active', true)->first();

        return Inertia::render('Category/Index', [
            'category' => 'destinasi',
            'items' => $items,
            'banner' => $banner,
        ]);
    }

    // explicit aliases for 5-route option
    public function showDestinasi(string $slug) { return $this->show('destinasi', $slug); }
    public function showBudaya(string $slug) { return $this->show('budaya', $slug); }
    public function showKuliner(string $slug) { return $this->show('kuliner', $slug); }
    public function showKerajinan(string $slug) { return $this->show('kerajinan', $slug); }
    public function showEvent(string $slug) { return $this->show('event', $slug); }
}

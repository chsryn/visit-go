<?php

namespace App\Http\Controllers;

use App\Models\Budaya;
use App\Models\Category;
use App\Models\Destinasi;
use App\Models\Event;
use App\Models\Kerajinan;
use App\Models\Kuliner;
use Inertia\Inertia;

class PortalController extends Controller
{
    public const PILLARS = ['botubarani-pulo-cinta','tari-saronde-dikili','milu-siram-ilabulo','kerajinan-daerah','sulaman-karawo'];

    public function index()
    {
        $events = Event::where('is_active', true)->orderBy('month')->take(6)->get();

        return Inertia::render('Welcome', [
            'events' => $events,
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
            // budaya/kuliner/kerajinan dibaca dari tabelnya masing-masing (legacy rows sudah dimigrasi)
            $model = match ($category) {
                'budaya' => Budaya::class,
                'kuliner' => Kuliner::class,
                'kerajinan' => Kerajinan::class,
                default => Destinasi::class,
            };
            $items = $model::where('is_active', true)->latest()->get(['id','name','slug','body','image','alt']);
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
            $model = match ($category) {
                'budaya' => Budaya::class,
                'kuliner' => Kuliner::class,
                'kerajinan' => Kerajinan::class,
                default => Destinasi::class,
            };
            $item = $model::where('slug', $slug)->where('is_active', true)->firstOrFail();
            $related = $model::where('id', '!=', $item->id)->where('is_active', true)->take(3)->get();
        }

        return Inertia::render('Detail', [
            'item' => $item,
            'category' => $category,
            'related' => $related,
        ]);
    }

    // ---- Dynamic Destination categories (issue.md: child of Destination) ----

    /**
     * GET /destinasi — overview kartu kategori dinamis (Pegunungan, Laut, Buatan, ...).
     */
    public function destinationIndex()
    {
        $categories = Category::destinationChildren()
            ->where('is_active', true)
            ->withCount(['destinasis' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('name')
            ->get();

        $banner = Category::where('slug', 'destinasi')->where('is_active', true)->first();

        return Inertia::render('Destination/Index', [
            'categories' => $categories,
            'banner' => $banner,
        ]);
    }

    /**
     * GET /destinasi/kategori/{slug} — daftar destinasi per kategori dinamis.
     */
    public function destinationByCategory(string $slug)
    {
        $category = Category::destinationChildren()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('Destination/Category', [
            'category' => $category,
            'categories' => $this->destinationCategories(),
            'items' => $this->destinationItems($category->id),
        ]);
    }

    /**
     * GET /api/destinasi/kategori/{slug} — JSON untuk tab switching di FE.
     */
    public function destinationCategoryApi(string $slug)
    {
        $category = Category::destinationChildren()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'category' => $category,
            'items' => $this->destinationItems($category->id),
        ]);
    }

    private function destinationCategories()
    {
        return Category::destinationChildren()
            ->where('is_active', true)
            ->withCount(['destinasis' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('name')
            ->get();
    }

    private function destinationItems(int $categoryId)
    {
        return Destinasi::where('category_id', $categoryId)
            ->where('is_active', true)
            ->latest()
            ->get(['id', 'name', 'slug', 'body', 'image', 'alt', 'location']);
    }

    // explicit aliases for 5-route option
    public function showDestinasi(string $slug) { return $this->show('destinasi', $slug); }
    public function showBudaya(string $slug) { return $this->show('budaya', $slug); }
    public function showKuliner(string $slug) { return $this->show('kuliner', $slug); }
    public function showKerajinan(string $slug) { return $this->show('kerajinan', $slug); }
    public function showEvent(string $slug) { return $this->show('event', $slug); }
}

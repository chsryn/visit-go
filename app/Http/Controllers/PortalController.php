<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Budaya;
use App\Models\Category;
use App\Models\Destinasi;
use App\Models\DestinationCategory;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\KerajinanCategory;
use App\Models\KulinerCategory;
use App\Models\Umkm;
use Inertia\Inertia;

class PortalController extends Controller
{
    public const PILLARS = ['botubarani-pulo-cinta','tari-saronde-dikili','milu-siram-ilabulo','kerajinan-daerah','sulaman-karawo'];

    public function index()
    {
        $events = Event::where('is_active', true)->orderBy('month')->take(6)->get();

        $kulinerSpotlight = Umkm::kuliner()->where('is_active', true)->latest()->take(3)->get(['id','name','slug','body','image','alt']);
        $kerajinanSpotlight = Umkm::kerajinan()->where('is_active', true)->latest()->take(2)->get(['id','name','slug','body','image','alt']);
        $galleries = Gallery::where('is_active', true)->inRandomOrder()->take(12)->get()->map(fn ($g) => array_merge($g->toArray(), ['image_url' => $this->resolveImageUrl($g->image)]))->values();

        return Inertia::render('Welcome', [
            'events' => $events,
            'kulinerSpotlight' => $kulinerSpotlight,
            'kerajinanSpotlight' => $kerajinanSpotlight,
            'galleries' => $galleries,
        ]);
    }

    public function indexByCategory(\Illuminate\Http\Request $request, ?string $category = null)
    {
        $category = $category ?? $request->route()->defaults['category'] ?? $request->route('category');
        abort_unless(in_array($category, ['destinasi','budaya','kuliner','kerajinan','event']), 404);
        if ($category === 'event') {
            $paginator = Event::where('is_active', true)->latest()->paginate(9)->withQueryString();
            $paginator->getCollection()->transform(fn($e) => ['id'=>$e->id,'name'=>$e->name,'slug'=>$e->slug,'category'=>'event','body'=>$e->body,'image'=>$e->image,'alt'=>$e->alt,'date'=>$e->date,'month'=>$e->month,'location'=>$e->location]);
            $items = $paginator;
        } else {
            $isKuliner = $category === 'kuliner';
            $isKerajinan = $category === 'kerajinan';
            if ($isKuliner || $isKerajinan) {
                $with = $isKuliner ? ['kulinerCategories:id,name,slug'] : ['kerajinanCategories:id,name,slug'];
                $query = Umkm::with($with)->where('is_active', true);
                if ($isKuliner) {
                    $query->whereHas('kulinerCategories');
                    $filterSlug = strtolower(trim($request->query('kuliner_category', '')));
                    if ($filterSlug !== '' && $filterSlug !== 'semua') {
                        $query->whereHas('kulinerCategories', fn ($qq) => $qq->where('slug', $filterSlug));
                    }
                } else {
                    $query->whereHas('kerajinanCategories');
                    $filterSlug = strtolower(trim($request->query('kerajinan_category', '')));
                    if ($filterSlug !== '' && $filterSlug !== 'semua') {
                        $query->whereHas('kerajinanCategories', fn ($qq) => $qq->where('slug', $filterSlug));
                    }
                }
                $paginator = $query->latest()->paginate(9)->withQueryString();
                $paginator->getCollection()->transform(fn($i) => array_merge($i->toArray(), [
                    'category' => $category,
                    'kuliner_categories' => $isKuliner && $i->relationLoaded('kulinerCategories') ? $i->kulinerCategories->map->only(['id','name','slug']) : [],
                    'kerajinan_categories' => $isKerajinan && $i->relationLoaded('kerajinanCategories') ? $i->kerajinanCategories->map->only(['id','name','slug']) : [],
                ]));
                $items = $paginator;
            } else {
                $model = match ($category) {
                    'budaya' => Budaya::class,
                    default => Destinasi::class,
                };
                $sub = strtolower(trim($request->query('sub', '')));
                $query = $model::where('is_active', true);
                if ($category === 'budaya' && $sub === 'sejarah') {
                    $query->where(function ($q) {
                        $q->where('tags', 'like', '%sejarah%')
                          ->orWhere('body', 'like', '%sejarah%')
                          ->orWhere('body', 'like', '%Suwawa%')
                          ->orWhere('body', 'like', '%Pohala%');
                    });
                }
                $perPage = $category === 'budaya' ? 6 : 9;
                $paginator = $query->latest()->paginate($perPage)->withQueryString();
                $paginator->getCollection()->transform(fn($i) => array_merge($i->toArray(), ['category' => $category]));
                $items = $paginator;
            }
        }
        $banner = Category::where('slug', $category)->where('is_active', true)->first();
        $activeSub = strtolower(trim($request->query('sub', '')));
        // only budaya supports sub, otherwise null
        if ($category !== 'budaya' || ! in_array($activeSub, ['sejarah'], true)) {
            $activeSub = null;
        }
        $kulinerCategories = $category === 'kuliner'
            ? KulinerCategory::where('is_active', true)->orderBy('name')->get(['id','name','slug'])
            : [];
        $activeKulinerCategory = $category === 'kuliner' ? strtolower(trim($request->query('kuliner_category', 'semua'))) : 'semua';
        if ($category === 'kuliner' && $activeKulinerCategory !== 'semua' && ! $kulinerCategories->pluck('slug')->contains($activeKulinerCategory)) {
            $activeKulinerCategory = 'semua';
        }
        $kerajinanCategories = $category === 'kerajinan'
            ? KerajinanCategory::where('is_active', true)->orderBy('name')->get(['id','name','slug'])
            : [];
        $activeKerajinanCategory = $category === 'kerajinan' ? strtolower(trim($request->query('kerajinan_category', 'semua'))) : 'semua';
        if ($category === 'kerajinan' && $activeKerajinanCategory !== 'semua' && ! $kerajinanCategories->pluck('slug')->contains($activeKerajinanCategory)) {
            $activeKerajinanCategory = 'semua';
        }

        // Ekosistem budaya dinamis — hanya untuk /budaya tanpa sub sejarah (tanpa ekosistem kuliner/kerajinan, hanya galeri & destinasi)
        $destinasiTerkait = [];
        $galeriBudaya = [];
        if ($category === 'budaya' && $activeSub !== 'sejarah') {
            $destinasiTerkait = Destinasi::with('destinationCategory:id,name,slug')->where('is_active', true)
                ->where(function ($q) {
                    $q->whereHas('destinationCategory', fn ($qq) => $qq->whereIn('slug', ['cagar-budaya', 'sejarah-budaya']))
                      ->orWhere('name', 'like', '%Benteng%')
                      ->orWhere('name', 'like', '%Masjid%')
                      ->orWhere('name', 'like', '%Desa Wisata%')
                      ->orWhere('name', 'like', '%Kampung%');
                })
                ->whereNotIn('slug', self::PILLARS)
                ->latest()->take(3)->get()
                ->map(fn ($i) => array_merge($i->toArray(), ['category' => 'destinasi', 'destination_category' => $i->destinationCategory ? $i->destinationCategory->only(['id','name','slug']) : null]))->values();
            $galeriBudaya = Gallery::where('is_active', true)->whereIn('category', ['budaya', 'kerajinan'])->latest()->take(8)->get()->map(fn ($g) => array_merge($g->toArray(), ['image_url' => $this->resolveImageUrl($g->image)]))->values();
            // fallback jika galeri kosong: ambil gambar dari budaya
            if ($galeriBudaya->isEmpty()) {
                $galeriBudaya = Budaya::where('is_active', true)->whereNotNull('image')->latest()->take(8)->get()->map(fn ($b) => ['id' => $b->id, 'name' => $b->name, 'image_url' => $this->resolveImageUrl($b->image), 'alt' => $b->alt, 'category' => 'budaya'])->values();
            }
        }

        return Inertia::render('Category/Index', [
            'category' => $category,
            'items' => $items,
            'banner' => $banner,
            'activeSub' => $activeSub,
            'kulinerCategories' => $kulinerCategories,
            'activeKulinerCategory' => $activeKulinerCategory,
            'kerajinanCategories' => $kerajinanCategories,
            'activeKerajinanCategory' => $activeKerajinanCategory,
            'destinasiTerkait' => $destinasiTerkait,
            'galeriBudaya' => $galeriBudaya,
        ]);
    }

    public function show(string $category, string $slug)
    {
        if ($category === 'event') {
            $item = Event::where('slug', $slug)->where('is_active', true)->firstOrFail();
            $related = Event::where('id', '!=', $item->id)->where('is_active', true)->take(3)->get();
        } else {
            $isKuliner = $category === 'kuliner';
            $isKerajinan = $category === 'kerajinan';
            if ($isKuliner || $isKerajinan) {
                $relation = $isKuliner ? 'kulinerCategories' : 'kerajinanCategories';
                $itemModel = Umkm::with(['kulinerCategories:id,name,slug','kerajinanCategories:id,name,slug'])->where('is_active', true)->whereHas($relation)->where('slug', $slug)->firstOrFail();
                $item = array_merge($itemModel->toArray(), [
                    'category' => $category,
                    'kuliner_categories' => $itemModel->kulinerCategories->map->only(['id','name','slug']),
                    'kerajinan_categories' => $itemModel->kerajinanCategories->map->only(['id','name','slug']),
                ]);
                $related = Umkm::with(['kulinerCategories:id,name,slug','kerajinanCategories:id,name,slug'])->where('is_active', true)->whereHas($relation)->where('id', '!=', $itemModel->id)->latest()->take(3)->get(['id','name','slug','body','image','alt','skala_usaha','harga']);
                $related = $related->map(fn($r) => array_merge($r->toArray(), [
                    'kuliner_categories' => $r->kulinerCategories->map->only(['id','name','slug']),
                    'kerajinan_categories' => $r->kerajinanCategories->map->only(['id','name','slug']),
                ]));
            } else {
                $model = match ($category) {
                    'budaya' => Budaya::class,
                    default => Destinasi::class,
                };
                $item = $model::where('slug', $slug)->where('is_active', true)->firstOrFail();
                $related = $model::where('id', '!=', $item->id)->where('is_active', true)->take(3)->get();
                if ($category === 'destinasi') {
                    // Galeri foto tambahan (foto sampul tetap di `image`).
                    // setRelation agar dipakai saat serialisasi (relasi menimpa atribut).
                    $item->setRelation('images', $item->images->map(fn ($img) => [
                        'id' => $img->id,
                        'image_url' => $this->resolveImageUrl($img->image),
                        'alt' => $img->alt,
                    ])->values());
                }
            }
        }

        return Inertia::render('Detail', [
            'item' => $item,
            'category' => $category,
            'related' => $related,
        ]);
    }

    /**
     * GET /destinasi — daftar flat semua destinasi aktif dengan filter kategori dinamis.
     */
    public function destinationIndex(\Illuminate\Http\Request $request)
    {
        $filter = strtolower(trim($request->query('kategori', 'semua')));
        if ($filter === 'destinasi-alam') {
            $filter = 'wisata-alam';
        }

        $query = Destinasi::with('destinationCategory:id,name,slug')
            ->where('is_active', true)
            ->whereNotIn('slug', self::PILLARS);

        if ($filter !== 'semua') {
            $exists = DestinationCategory::where('slug', $filter)->where('is_active', true)->exists();
            if ($exists) {
                $query->whereHas('destinationCategory', fn ($q) => $q->where('slug', $filter));
            } else {
                $filter = 'semua';
            }
        }

        $paginator = $query->latest()->paginate(9)->withQueryString();
        $paginator->getCollection()->transform(fn ($i) => array_merge($i->toArray(), [
            'category' => 'destinasi',
            'destination_category' => $i->destinationCategory ? $i->destinationCategory->only(['id', 'name', 'slug']) : null,
        ]));

        $banner = Category::where('slug', 'destinasi')->where('is_active', true)->first();
        $destinationCategories = DestinationCategory::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('Category/Index', [
            'category' => 'destinasi',
            'items' => $paginator,
            'banner' => $banner,
            'destinationCategories' => $destinationCategories,
            'activeDestinationCategory' => $filter,
        ]);
    }

    public function galleryIndex(\Illuminate\Http\Request $request)
    {
        $active = strtolower($request->query('kategori', 'semua'));
        $allowed = Gallery::CATEGORIES;
        if ($active !== 'semua' && ! in_array($active, $allowed, true)) {
            $active = 'semua';
        }
        $query = Gallery::where('is_active', true)->latest();
        if ($active !== 'semua') {
            $query->where('category', $active);
        }
        $paginator = $query->paginate(12)->withQueryString();
        $paginator->getCollection()->transform(fn ($g) => array_merge($g->toArray(), [
            'image_url' => $this->resolveImageUrl($g->image),
        ]));

        return Inertia::render('Gallery/Index', [
            'items' => $paginator,
            'categories' => $allowed,
            'activeCategory' => $active,
        ]);
    }

    public function articleIndex()
    {
        $paginator = Article::where('is_active', true)->latest()->paginate(9)->withQueryString();
        $paginator->getCollection()->transform(fn ($a) => array_merge($a->toArray(), [
            'image_url' => $this->resolveImageUrl($a->image),
        ]));

        return Inertia::render('Article/Index', [
            'items' => $paginator,
        ]);
    }

    public function showArticle(string $slug)
    {
        $item = Article::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $item->image_url = $this->resolveImageUrl($item->image);
        $related = Article::where('id', '!=', $item->id)->where('is_active', true)->latest()->take(3)->get()->map(fn ($a) => array_merge($a->toArray(), [
            'image_url' => $this->resolveImageUrl($a->image),
        ]));

        return Inertia::render('Article/Show', [
            'item' => $item,
            'related' => $related,
        ]);
    }

    // explicit aliases for 5-route option
    public function showDestinasi(string $slug) { return $this->show('destinasi', $slug); }

    /** Samakan format URL gambar upload dengan halaman admin. */
    private function resolveImageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }
        if (str_starts_with($path, 'http') || str_starts_with($path, '/storage') || str_starts_with($path, '/build')) {
            return $path;
        }

        return '/storage/'.ltrim($path, '/');
    }
    public function showBudaya(string $slug) { return $this->show('budaya', $slug); }
    public function showKuliner(string $slug) { return $this->show('kuliner', $slug); }
    public function showKerajinan(string $slug) { return $this->show('kerajinan', $slug); }
    public function showEvent(string $slug) { return $this->show('event', $slug); }
}

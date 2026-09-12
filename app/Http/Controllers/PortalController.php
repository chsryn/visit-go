<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Budaya;
use App\Models\Category;
use App\Models\Destinasi;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\Umkm;
use Inertia\Inertia;

class PortalController extends Controller
{
    public const PILLARS = ['botubarani-pulo-cinta','tari-saronde-dikili','milu-siram-ilabulo','kerajinan-daerah','sulaman-karawo'];

    public function index()
    {
        $events = Event::where('is_active', true)->orderBy('month')->take(6)->get();

        $kulinerSpotlight = Umkm::ofJenis('kuliner')->where('is_active', true)->latest()->take(3)->get(['id','name','slug','body','image','alt']);
        $kerajinanSpotlight = Umkm::ofJenis('kerajinan')->where('is_active', true)->latest()->take(2)->get(['id','name','slug','body','image','alt']);
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
            $umkmJenis = match ($category) {
                'kuliner' => 'kuliner',
                'kerajinan' => 'kerajinan',
                default => null,
            };
            if ($umkmJenis) {
                $paginator = Umkm::ofJenis($umkmJenis)->where('is_active', true)->latest()->paginate(9)->withQueryString();
                $paginator->getCollection()->transform(fn($i) => array_merge($i->toArray(), ['category' => $category]));
                $items = $paginator;
            } else {
                $model = match ($category) {
                    'budaya' => Budaya::class,
                    default => Destinasi::class,
                };
                $paginator = $model::where('is_active', true)->latest()->paginate(9)->withQueryString();
                $paginator->getCollection()->transform(fn($i) => array_merge($i->toArray(), ['category' => $category]));
                $items = $paginator;
            }
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
                'kerajinan' => 'kerajinan',
                default => null,
            };
            if ($umkmJenis) {
                $item = Umkm::ofJenis($umkmJenis)->with('jenisRef:id,name,slug')->where('slug', $slug)->where('is_active', true)->firstOrFail();
                $item->setAttribute('jenis', $item->jenisRef?->name);
                $item->setAttribute('jenis_slug', $item->jenisRef?->slug);
                $related = Umkm::ofJenis($umkmJenis)->with('jenisRef:id,name,slug')->where('id', '!=', $item->id)->where('is_active', true)
                    ->orderByRaw('CASE WHEN umkm_jenis_id = ? THEN 0 ELSE 1 END', [$item->umkm_jenis_id])
                    ->latest()->take(3)->get(['id','name','slug','body','image','alt','umkm_jenis_id','skala_usaha','harga']);
                $related = $related->map(fn($r) => array_merge($r->toArray(), ['jenis' => $r->jenisRef?->name, 'jenis_slug' => $r->jenisRef?->slug]));
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
     * GET /destinasi — daftar flat semua destinasi aktif (tanpa sub-kategori).
     */
    public function destinationIndex()
    {
        $paginator = Destinasi::where('is_active', true)
            ->whereNotIn('slug', self::PILLARS)
            ->latest()
            ->paginate(9)->withQueryString();
        $paginator->getCollection()->transform(fn($i) => array_merge($i->toArray(), ['category' => 'destinasi']));

        $banner = Category::where('slug', 'destinasi')->where('is_active', true)->first();

        return Inertia::render('Category/Index', [
            'category' => 'destinasi',
            'items' => $paginator,
            'banner' => $banner,
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

<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Destinasi;
use App\Models\Event;
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
            $items = Destinasi::where('category', $category)->whereNotIn('slug', self::PILLARS)->where('is_active', true)->latest()->get();
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
            $item = Destinasi::where('slug', $slug)->where('category', $category)->where('is_active', true)->firstOrFail();
            $related = Destinasi::where('category', $category)->where('id', '!=', $item->id)->where('is_active', true)->take(3)->get();
        }

        return Inertia::render('Detail', [
            'item' => $item,
            'category' => $category,
            'related' => $related,
        ]);
    }

    // explicit aliases for 5-route option
    public function showDestinasi(string $slug) { return $this->show('destinasi', $slug); }
    public function showBudaya(string $slug) { return $this->show('budaya', $slug); }
    public function showKuliner(string $slug) { return $this->show('kuliner', $slug); }
    public function showKerajinan(string $slug) { return $this->show('kerajinan', $slug); }
    public function showEvent(string $slug) { return $this->show('event', $slug); }
}

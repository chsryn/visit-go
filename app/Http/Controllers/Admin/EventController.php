<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destinasi;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EventController extends Controller
{
    use HandlesImageUpload;

    public function index()
    {
        $items = Event::latest()->paginate(12);
        $items->through(fn ($e) => array_merge($e->toArray(), [
            'image_url' => $this->resolveModelImageUrl($e->image),
            'display_location' => $e->location_name ?? $e->location,
        ]));

        return Inertia::render('Admin/Event/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:events,slug',
            'date' => 'required|string|max:20',
            'month' => 'required|string|max:20',
            'location_name' => 'nullable|string|max:200',
            'area' => ['nullable', Rule::in(Destinasi::AREAS)],
            'tags' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        // BC: keep legacy `location` in sync until portal migrates to location_name
        $data['location'] = $data['location_name'] ?? 'Gorontalo';
        $data['image'] = $this->storeImage($request, 'image', 'uploads/events');
        Event::create($data);

        return back()->with('success', 'Event ditambahkan.');
    }

    public function update(Request $request, Event $event)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:events,slug,'.$event->id,
            'date' => 'required|string|max:20',
            'month' => 'required|string|max:20',
            'location_name' => 'nullable|string|max:200',
            'area' => ['nullable', Rule::in(Destinasi::AREAS)],
            'tags' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['location'] = $data['location_name'] ?? $event->location;
        $data['image'] = $this->storeImage($request, 'image', 'uploads/events', $event->image);
        $event->update($data);

        return back()->with('success', 'Event diperbarui.');
    }

    public function destroy(Event $event)
    {
        $this->deleteImage($event->image);
        $event->delete();

        return back()->with('success', 'Event dihapus.');
    }
}

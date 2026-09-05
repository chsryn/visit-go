<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $items = Event::where('is_active', true)->orderBy('month')->get();
        return Inertia::render('Events/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:events,slug',
            'date' => 'required|string|max:20',
            'month' => 'required|string|max:20',
            'location' => 'required|string|max:150',
            'body' => 'required|string|max:1000',
            'image' => 'nullable|string|max:200',
            'alt' => 'nullable|string|max:200',
        ]);
        Event::create($data);
        return back()->with('success', 'Event ditambahkan');
    }

    public function update(Request $request, string $id)
    {
        $item = Event::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:events,slug,'.$id,
            'date' => 'required|string|max:20',
            'month' => 'required|string|max:20',
            'location' => 'required|string|max:150',
            'body' => 'required|string|max:1000',
            'image' => 'nullable|string|max:200',
            'alt' => 'nullable|string|max:200',
            'is_active' => 'boolean',
        ]);
        $item->update($data);
        return back()->with('success', 'Event diperbarui');
    }

    public function destroy(string $id)
    {
        Event::findOrFail($id)->delete();
        return back()->with('success', 'Event dihapus');
    }
}

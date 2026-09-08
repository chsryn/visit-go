<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kerajinan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KerajinanController extends Controller
{
    use HandlesImageUpload;

    public function index()
    {
        $items = Kerajinan::latest()->paginate(12);
        $items->through(fn ($k) => array_merge($k->toArray(), [
            'image_url' => $this->resolveModelImageUrl($k->image),
        ]));

        return Inertia::render('Admin/Kerajinan/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:kerajinans,slug',
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        $data['image'] = $this->storeImage($request, 'image', 'uploads/kerajinans');
        Kerajinan::create($data);

        return back()->with('success', 'Kerajinan ditambahkan.');
    }

    public function update(Request $request, Kerajinan $kerajinan)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:kerajinans,slug,'.$kerajinan->id,
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['image'] = $this->storeImage($request, 'image', 'uploads/kerajinans', $kerajinan->image);
        $kerajinan->update($data);

        return back()->with('success', 'Kerajinan diperbarui.');
    }

    public function destroy(Kerajinan $kerajinan)
    {
        $this->deleteImage($kerajinan->image);
        $kerajinan->delete();

        return back()->with('success', 'Kerajinan dihapus.');
    }
}

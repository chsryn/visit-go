<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kuliner;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KulinerController extends Controller
{
    use HandlesImageUpload;

    public function index()
    {
        $items = Kuliner::latest()->paginate(12);
        $items->through(fn ($k) => array_merge($k->toArray(), [
            'image_url' => $this->resolveModelImageUrl($k->image),
        ]));

        return Inertia::render('Admin/Kuliner/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:kuliners,slug',
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'tags' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'harga' => 'nullable|integer|min:0|max:100000000',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        $data['image'] = $this->storeImage($request, 'image', 'uploads/kuliners');
        Kuliner::create($data);

        return back()->with('success', 'Kuliner ditambahkan.');
    }

    public function update(Request $request, Kuliner $kuliner)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:kuliners,slug,'.$kuliner->id,
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'tags' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'harga' => 'nullable|integer|min:0|max:100000000',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['image'] = $this->storeImage($request, 'image', 'uploads/kuliners', $kuliner->image);
        $kuliner->update($data);

        return back()->with('success', 'Kuliner diperbarui.');
    }

    public function destroy(Kuliner $kuliner)
    {
        $this->deleteImage($kuliner->image);
        $kuliner->delete();

        return back()->with('success', 'Kuliner dihapus.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GalleryController extends Controller
{
    use HandlesImageUpload;

    public function index()
    {
        $items = Gallery::latest()->paginate(12);
        $items->through(fn ($g) => array_merge($g->toArray(), [
            'image_url' => $this->resolveModelImageUrl($g->image),
        ]));

        return Inertia::render('Admin/Gallery/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:galleries,slug',
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        $data['image'] = $this->storeImage($request, 'image', 'uploads/galleries');
        Gallery::create($data);

        return back()->with('success', 'Galeri ditambahkan.');
    }

    public function update(Request $request, Gallery $gallery)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:galleries,slug,'.$gallery->id,
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['image'] = $this->storeImage($request, 'image', 'uploads/galleries', $gallery->image);
        $gallery->update($data);

        return back()->with('success', 'Galeri diperbarui.');
    }

    public function destroy(Gallery $gallery)
    {
        $this->deleteImage($gallery->image);
        $gallery->delete();

        return back()->with('success', 'Galeri dihapus.');
    }
}

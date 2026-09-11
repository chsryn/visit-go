<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destinasi;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DestinasiController extends Controller
{
    use HandlesImageUpload;

    public function index(Request $request)
    {
        $items = Destinasi::latest()->paginate(12);

        $items->through(fn ($d) => array_merge($d->toArray(), [
            'image_url' => $this->resolveModelImageUrl($d->image),
        ]));

        return Inertia::render('Admin/Destinasi/Index', [
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:destinasis,slug',
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'location' => 'nullable|string|max:200',
            'area' => ['nullable', Rule::in(Destinasi::AREAS)],
            'tags' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        $data['category'] = 'destinasi'; // tabel destinasis hanya berisi destinasi wisata
        $data['image'] = $this->storeImage($request, 'image', 'uploads/destinasis');

        Destinasi::create($data);

        return back()->with('success', 'Destinasi ditambahkan.');
    }

    public function update(Request $request, Destinasi $destinasi)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:destinasis,slug,'.$destinasi->id,
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'location' => 'nullable|string|max:200',
            'area' => ['nullable', Rule::in(Destinasi::AREAS)],
            'tags' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['image'] = $this->storeImage($request, 'image', 'uploads/destinasis', $destinasi->image);
        $destinasi->update($data);

        return back()->with('success', 'Destinasi diperbarui.');
    }

    public function destroy(Destinasi $destinasi)
    {
        $this->deleteImage($destinasi->image);
        $destinasi->delete();

        return back()->with('success', 'Destinasi dihapus.');
    }
}

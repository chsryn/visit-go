<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Budaya;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BudayaController extends Controller
{
    use HandlesImageUpload;

    public function index()
    {
        $items = Budaya::latest()->paginate(12);
        $items->through(fn ($b) => array_merge($b->toArray(), [
            'image_url' => $this->resolveModelImageUrl($b->image),
        ]));

        return Inertia::render('Admin/Budaya/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:budayas,slug',
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'jam_buka' => 'nullable|date_format:H:i',
            'jam_tutup' => 'nullable|date_format:H:i|after:jam_buka',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        $data['image'] = $this->storeImage($request, 'image', 'uploads/budayas');
        Budaya::create($data);

        return back()->with('success', 'Budaya ditambahkan.');
    }

    public function update(Request $request, Budaya $budaya)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:budayas,slug,'.$budaya->id,
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'jam_buka' => 'nullable|date_format:H:i',
            'jam_tutup' => 'nullable|date_format:H:i|after:jam_buka',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['image'] = $this->storeImage($request, 'image', 'uploads/budayas', $budaya->image);
        $budaya->update($data);

        return back()->with('success', 'Budaya diperbarui.');
    }

    public function destroy(Budaya $budaya)
    {
        $this->deleteImage($budaya->image);
        $budaya->delete();

        return back()->with('success', 'Budaya dihapus.');
    }
}

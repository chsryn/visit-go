<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UmkmController extends Controller
{
    use HandlesImageUpload;

    public function index(Request $request)
    {
        $items = Umkm::with(['kulinerCategories:id,name,slug', 'kerajinanCategories:id,name,slug'])
            ->latest()
            ->paginate(5)
            ->withQueryString();

        $items->through(fn ($u) => array_merge($u->toArray(), [
            'image_url' => $this->resolveModelImageUrl($u->image),
            'kuliner_category_ids' => $u->kulinerCategories->pluck('id')->values()->all(),
            'kerajinan_category_ids' => $u->kerajinanCategories->pluck('id')->values()->all(),
        ]));

        return Inertia::render('Admin/Umkm/Index', [
            'items' => $items,
            'kulinerCategories' => \App\Models\KulinerCategory::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug']),
            'kerajinanCategories' => \App\Models\KerajinanCategory::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:umkms,slug',
            'skala_usaha' => ['required', Rule::in(Umkm::SKALA_USAHA)],
            'body' => 'nullable|string',
            'produk' => 'nullable|string',
            'kontak' => 'nullable|string|max:200',
            'harga' => 'nullable|integer|min:0|max:1000000000',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'tags' => 'nullable|string|max:500',
            'alt' => 'nullable|string|max:200',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
            'kuliner_categories' => 'nullable|array|required_without:kerajinan_categories',
            'kuliner_categories.*' => 'exists:kuliner_categories,id',
            'kerajinan_categories' => 'nullable|array|required_without:kuliner_categories',
            'kerajinan_categories.*' => 'exists:kerajinan_categories,id',
        ]);

        $kulinerIds = $data['kuliner_categories'] ?? [];
        $kerajinanIds = $data['kerajinan_categories'] ?? [];
        unset($data['kuliner_categories'], $data['kerajinan_categories']);
        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        $data['image'] = $this->storeImage($request, 'image', 'uploads/umkms');
        $umkm = Umkm::create($data);
        $umkm->kulinerCategories()->sync($kulinerIds ?? []);
        $umkm->kerajinanCategories()->sync($kerajinanIds ?? []);

        return back()->with('success', 'UMKM ditambahkan.');
    }

    public function update(Request $request, Umkm $umkm)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:umkms,slug,'.$umkm->id,
            'skala_usaha' => ['required', Rule::in(Umkm::SKALA_USAHA)],
            'body' => 'nullable|string',
            'produk' => 'nullable|string',
            'kontak' => 'nullable|string|max:200',
            'harga' => 'nullable|integer|min:0|max:1000000000',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'tags' => 'nullable|string|max:500',
            'alt' => 'nullable|string|max:200',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
            'kuliner_categories' => 'nullable|array|required_without:kerajinan_categories',
            'kuliner_categories.*' => 'exists:kuliner_categories,id',
            'kerajinan_categories' => 'nullable|array|required_without:kuliner_categories',
            'kerajinan_categories.*' => 'exists:kerajinan_categories,id',
        ]);

        $kulinerIds = $data['kuliner_categories'] ?? [];
        $kerajinanIds = $data['kerajinan_categories'] ?? [];
        unset($data['kuliner_categories'], $data['kerajinan_categories']);
        $data['image'] = $this->storeImage($request, 'image', 'uploads/umkms', $umkm->image);
        $umkm->update($data);
        $umkm->kulinerCategories()->sync($kulinerIds ?? []);
        $umkm->kerajinanCategories()->sync($kerajinanIds ?? []);

        return back()->with('success', 'UMKM diperbarui.');
    }

    public function destroy(Umkm $umkm)
    {
        $this->deleteImage($umkm->image);
        $umkm->delete();

        return back()->with('success', 'UMKM dihapus.');
    }
}

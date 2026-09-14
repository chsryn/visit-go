<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KulinerCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KulinerCategoryController extends Controller
{
    public function index()
    {
        $items = KulinerCategory::withCount('umkms')->latest()->paginate(12);

        return Inertia::render('Admin/KulinerCategory/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50|unique:kuliner_categories,name',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        KulinerCategory::create($data);

        return back()->with('success', 'Kategori kuliner ditambahkan.');
    }

    public function update(Request $request, KulinerCategory $kulinerCategory)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50|unique:kuliner_categories,name,'.$kulinerCategory->id,
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $kulinerCategory->update($data);

        return back()->with('success', 'Kategori kuliner diperbarui.');
    }

    public function destroy(KulinerCategory $kulinerCategory)
    {
        if ($kulinerCategory->umkms()->exists()) {
            return back()->with('error', 'Kategori masih dipakai UMKM — lepaskan dulu sebelum hapus.');
        }

        $kulinerCategory->delete();

        return back()->with('success', 'Kategori kuliner dihapus.');
    }
}

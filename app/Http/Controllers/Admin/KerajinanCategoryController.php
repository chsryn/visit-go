<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KerajinanCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KerajinanCategoryController extends Controller
{
    public function index()
    {
        $items = KerajinanCategory::withCount('umkms')->latest()->paginate(5);

        return Inertia::render('Admin/KerajinanCategory/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50|unique:kerajinan_categories,name',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        KerajinanCategory::create($data);

        return back()->with('success', 'Kategori kerajinan ditambahkan.');
    }

    public function update(Request $request, KerajinanCategory $kerajinanCategory)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50|unique:kerajinan_categories,name,'.$kerajinanCategory->id,
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $kerajinanCategory->update($data);

        return back()->with('success', 'Kategori kerajinan diperbarui.');
    }

    public function destroy(KerajinanCategory $kerajinanCategory)
    {
        if ($kerajinanCategory->umkms()->exists()) {
            return back()->with('error', 'Kategori masih dipakai UMKM — lepaskan dulu sebelum hapus.');
        }

        $kerajinanCategory->delete();

        return back()->with('success', 'Kategori kerajinan dihapus.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DestinationCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DestinationCategoryController extends Controller
{
    public function index()
    {
        $items = DestinationCategory::withCount('destinasis')->latest()->paginate(12);

        return Inertia::render('Admin/Destinasi/Categories', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:destination_categories,name',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        DestinationCategory::create($data);

        return back()->with('success', 'Kategori destinasi ditambahkan — otomatis muncul di sidebar.');
    }

    public function update(Request $request, DestinationCategory $destinationCategory)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:destination_categories,name,'.$destinationCategory->id,
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $destinationCategory->update($data);

        return back()->with('success', 'Kategori destinasi diperbarui.');
    }

    public function destroy(DestinationCategory $destinationCategory)
    {
        if ($destinationCategory->destinasis()->exists()) {
            return back()->with('error', 'Kategori masih dipakai destinasi — pindahkan dulu sebelum hapus.');
        }

        $destinationCategory->delete();

        return back()->with('success', 'Kategori destinasi dihapus.');
    }
}

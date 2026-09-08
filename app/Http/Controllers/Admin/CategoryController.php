<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use HandlesImageUpload;

    /**
     * CRUD child categories of Destination (Pegunungan, Laut, Buatan, ...).
     * Pillar rows (parent = null) are managed elsewhere and excluded here.
     */
    public function index()
    {
        $items = Category::destinationChildren()
            ->withCount(['destinasis' => fn ($q) => $q->where('is_active', true)])
            ->latest()
            ->paginate(12);

        $items->through(fn ($c) => array_merge($c->toArray(), [
            'banner_url' => $this->resolveModelImageUrl($c->banner_image),
        ]));

        return Inertia::render('Admin/Category/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:categories,slug',
            'description' => 'nullable|string',
            'banner_alt' => 'nullable|string|max:200',
            'banner_image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        $data['parent'] = 'destination';
        $data['banner_image'] = $this->storeImage($request, 'banner_image', 'uploads/categories');

        Category::create($data);

        return back()->with('success', 'Kategori ditambahkan — otomatis tampil di halaman Destination.');
    }

    public function update(Request $request, Category $category)
    {
        abort_unless($category->parent === 'destination', 404);

        $data = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|unique:categories,slug,'.$category->id,
            'description' => 'nullable|string',
            'banner_alt' => 'nullable|string|max:200',
            'banner_image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['banner_image'] = $this->storeImage($request, 'banner_image', 'uploads/categories', $category->banner_image);
        $category->update($data);

        return back()->with('success', 'Kategori diperbarui.');
    }

    public function destroy(Category $category)
    {
        abort_unless($category->parent === 'destination', 404);

        if ($category->destinasis()->exists()) {
            return back()->with('error', 'Kategori masih dipakai destinasi — pindahkan dulu sebelum hapus.');
        }

        $this->deleteImage($category->banner_image);
        $category->delete();

        return back()->with('success', 'Kategori dihapus.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArticleController extends Controller
{
    use HandlesImageUpload;

    public function index()
    {
        $items = Article::latest()->paginate(12);
        $items->through(fn ($a) => array_merge($a->toArray(), [
            'image_url' => $this->resolveModelImageUrl($a->image),
        ]));

        return Inertia::render('Admin/Article/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:articles,slug',
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        $data['image'] = $this->storeImage($request, 'image', 'uploads/articles');
        Article::create($data);

        return back()->with('success', 'Artikel ditambahkan.');
    }

    public function update(Request $request, Article $article)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:articles,slug,'.$article->id,
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['image'] = $this->storeImage($request, 'image', 'uploads/articles', $article->image);
        $article->update($data);

        return back()->with('success', 'Artikel diperbarui.');
    }

    public function destroy(Article $article)
    {
        $this->deleteImage($article->image);
        $article->delete();

        return back()->with('success', 'Artikel dihapus.');
    }
}

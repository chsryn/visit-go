<?php

namespace App\Http\Controllers;

use App\Models\Knowledge;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KnowledgeController extends Controller
{
    public function index()
    {
        $items = Knowledge::orderBy('topic')->orderBy('created_at', 'desc')->get();
        return Inertia::render('Knowledge/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'topic' => 'required|string|max:50',
            'question' => 'nullable|string|max:200',
            'answer' => 'required|string|max:2000',
            'keywords' => 'nullable|string|max:500',
        ]);
        Knowledge::create($data);
        return back()->with('success', 'Knowledge ditambahkan');
    }

    public function update(Request $request, string $id)
    {
        $item = Knowledge::findOrFail($id);
        $data = $request->validate([
            'topic' => 'required|string|max:50',
            'question' => 'nullable|string|max:200',
            'answer' => 'required|string|max:2000',
            'keywords' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);
        $item->update($data);
        return back()->with('success', 'Knowledge diperbarui');
    }

    public function destroy(string $id)
    {
        Knowledge::findOrFail($id)->delete();
        return back()->with('success', 'Knowledge dihapus');
    }

    // API untuk Chatbot fallback: GET /api/knowledge/search?q=taruna
    public function search(Request $request)
    {
        $q = strtolower($request->query('q', ''));
        if (!$q) return response()->json([]);
        $items = Knowledge::where('is_active', true)
            ->where(function ($w) use ($q) {
                $w->where('keywords', 'like', "%{$q}%")
                  ->orWhere('question', 'like', "%{$q}%")
                  ->orWhere('topic', 'like', "%{$q}%");
            })->limit(5)->get(['topic','question','answer']);
        return response()->json($items);
    }
}

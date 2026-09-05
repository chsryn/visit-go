<?php

namespace App\Http\Controllers;

use App\Models\Destinasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DestinasiController extends Controller
{
    public function index()
    {
        $items = Destinasi::where('is_active', true)->orderBy('name')->get();
        return Inertia::render('Destinasi/Index', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|unique:destinasis,slug',
            'category' => 'required|string|max:30',
            'body' => 'required|string|max:1000',
            'image' => 'nullable|string|max:200',
            'alt' => 'nullable|string|max:200',
        ]);
        Destinasi::create($data);
        return back()->with('success', 'Destinasi ditambahkan');
    }

    public function update(Request $request, string $id)
    {
        $item = Destinasi::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:100|unique:destinasis,slug,'.$id,
            'category' => 'required|string|max:30',
            'body' => 'required|string|max:1000',
            'image' => 'nullable|string|max:200',
            'alt' => 'nullable|string|max:200',
            'is_active' => 'boolean',
        ]);
        $item->update($data);
        return back()->with('success', 'Destinasi diperbarui');
    }

    public function destroy(string $id)
    {
        Destinasi::findOrFail($id)->delete();
        return back()->with('success', 'Destinasi dihapus');
    }
}

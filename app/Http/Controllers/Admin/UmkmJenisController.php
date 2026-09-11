<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UmkmJenis;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UmkmJenisController extends Controller
{
    public function index()
    {
        $items = UmkmJenis::withCount('umkms')->latest()->paginate(12);

        return Inertia::render('Admin/Umkm/Jenis', ['items' => $items]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50|unique:umkm_jenis,name',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        UmkmJenis::create($data);

        return back()->with('success', 'Jenis UMKM ditambahkan — otomatis muncul di sidebar.');
    }

    public function update(Request $request, UmkmJenis $umkmJenis)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50|unique:umkm_jenis,name,'.$umkmJenis->id,
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);
        $umkmJenis->update($data);

        return back()->with('success', 'Jenis UMKM diperbarui.');
    }

    public function destroy(UmkmJenis $umkmJenis)
    {
        if ($umkmJenis->umkms()->exists()) {
            return back()->with('error', 'Jenis masih dipakai UMKM — pindahkan dulu sebelum hapus.');
        }

        $umkmJenis->delete();

        return back()->with('success', 'Jenis UMKM dihapus.');
    }
}

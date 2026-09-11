<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Umkm;
use App\Models\UmkmJenis;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UmkmController extends Controller
{
    use HandlesImageUpload;

    public function index(Request $request)
    {
        $jenis = $request->query('jenis');
        $tab = $request->query('tab', 'umkm');

        $items = Umkm::with('jenisRef:id,name,slug')
            ->when($jenis, fn ($q) => $q->whereHas('jenisRef', fn ($qq) => $qq->where('slug', $jenis)))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $items->through(fn ($u) => array_merge($u->toArray(), [
            'image_url' => $this->resolveModelImageUrl($u->image),
        ]));

        // Tab Kuliner = baris UMKM berjenis kuliner (satu pintu, tanpa tabel kuliner)
        $kulinerJenisId = UmkmJenis::where('slug', 'kuliner')->value('id');
        $kuliners = Umkm::with('jenisRef:id,name,slug')
            ->when($kulinerJenisId, fn ($q) => $q->where('umkm_jenis_id', $kulinerJenisId))
            ->latest()
            ->paginate(12, ['*'], 'kuliner_page')
            ->withQueryString();
        $kuliners->through(fn ($k) => array_merge($k->toArray(), [
            'image_url' => $this->resolveModelImageUrl($k->image),
        ]));

        return Inertia::render('Admin/Umkm/Index', [
            'items' => $items,
            'filterJenis' => $jenis,
            'tab' => in_array($tab, ['umkm', 'kuliner']) ? $tab : 'umkm',
            'kuliners' => $kuliners,
            'kulinerJenisId' => $kulinerJenisId,
            'jenisOptions' => UmkmJenis::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:umkms,slug',
            'umkm_jenis_id' => 'required|exists:umkm_jenis,id',
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
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        $data['image'] = $this->storeImage($request, 'image', 'uploads/umkms');
        Umkm::create($data);

        return back()->with('success', 'UMKM ditambahkan.');
    }

    public function update(Request $request, Umkm $umkm)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:umkms,slug,'.$umkm->id,
            'umkm_jenis_id' => 'required|exists:umkm_jenis,id',
            'skala_usaha' => ['required', Rule::in(Umkm::SKALA_USAHA)],
            'body' => 'nullable|string',
            'produk' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'tags' => 'nullable|string|max:500',
            'alt' => 'nullable|string|max:200',
            'image' => 'nullable|image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['image'] = $this->storeImage($request, 'image', 'uploads/umkms', $umkm->image);
        $umkm->update($data);

        return back()->with('success', 'UMKM diperbarui.');
    }

    public function destroy(Umkm $umkm)
    {
        $this->deleteImage($umkm->image);
        $umkm->delete();

        return back()->with('success', 'UMKM dihapus.');
    }
}

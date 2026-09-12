<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destinasi;
use App\Models\DestinationCategory;
use App\Models\DestinationImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DestinasiController extends Controller
{
    use HandlesImageUpload;

    public function index(Request $request)
    {
        $kategori = $request->query('kategori');

        $items = Destinasi::with(['destinationCategory:id,name,slug', 'images'])
            ->when($kategori, fn ($q) => $q->whereHas('destinationCategory', fn ($qq) => $qq->where('slug', $kategori)))
            ->withCount('images')
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $items->through(function ($d) {
            $arr = $d->toArray();
            unset($arr['images']);
            $arr['image_url'] = $this->resolveModelImageUrl($d->image);
            $arr['gallery'] = $d->images->map(fn ($img) => [
                'id' => $img->id,
                'image_url' => $this->resolveModelImageUrl($img->image),
            ])->values()->all();

            return $arr;
        });

        return Inertia::render('Admin/Destinasi/Index', [
            'items' => $items,
            'filterKategori' => $kategori,
            'categoryOptions' => DestinationCategory::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:destinasis,slug',
            'destination_category_id' => 'required|exists:destination_categories,id',
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'location' => 'nullable|string|max:200',
            'area' => ['nullable', Rule::in(Destinasi::AREAS)],
            'tags' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:4096',
            'gallery_order' => 'nullable|string',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|max:4096',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']).'-'.Str::lower(Str::random(5));
        $data['category'] = 'destinasi'; // tabel destinasis hanya berisi destinasi wisata

        // Alur galeri: foto pertama = sampul, sisanya = baris destination_images
        $galleryPaths = $this->storeGalleryFiles($request);
        $data['image'] = array_shift($galleryPaths);

        $destinasi = Destinasi::create($data);
        $sort = 0;
        foreach ($galleryPaths as $path) {
            $destinasi->images()->create(['image' => $path, 'sort_order' => $sort++]);
        }

        return back()->with('success', 'Destinasi ditambahkan.');
    }

    public function update(Request $request, Destinasi $destinasi)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150|unique:destinasis,slug,'.$destinasi->id,
            'destination_category_id' => 'required|exists:destination_categories,id',
            'body' => 'required|string',
            'alt' => 'nullable|string|max:200',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'location' => 'nullable|string|max:200',
            'area' => ['nullable', Rule::in(Destinasi::AREAS)],
            'tags' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:4096',
            'gallery_order' => 'nullable|string',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|max:4096',
            'is_active' => 'boolean',
        ]);

        if ($request->filled('gallery_order')) {
            unset($data['image']);
            $this->syncGallery($destinasi, $request);
        } else {
            $data['image'] = $this->storeImage($request, 'image', 'uploads/destinasis', $destinasi->image);
        }
        $destinasi->update($data);

        return back()->with('success', 'Destinasi diperbarui.');
    }

    /**
     * Simpan file galeri baru sesuai urutan form (dipakai saat create).
     *
     * @return string[] path tersimpan berurutan
     */
    private function storeGalleryFiles(Request $request): array
    {
        $order = json_decode((string) $request->input('gallery_order'), true) ?: [];
        $files = $request->file('images', []);
        if (! is_array($files)) {
            $files = [$files];
        }

        $paths = [];
        foreach ($order as $entry) {
            if (($entry['kind'] ?? null) !== 'new' || ! isset($files[$entry['index'] ?? -1])) {
                continue;
            }
            $file = $files[$entry['index']];
            if ($file && $file->isValid()) {
                $paths[] = $file->store('uploads/destinasis', 'public');
            }
        }

        return $paths;
    }

    /**
     * Sinkronkan sampul + galeri dari urutan form (dipakai saat update).
     * Entri pertama = sampul; `cover` = sampul lama; `gallery:{id}` = baris
     * galeri lama; `new:{index}` = file baru. Urutan kosong = biarkan.
     */
    private function syncGallery(Destinasi $destinasi, Request $request): void
    {
        $order = json_decode((string) $request->input('gallery_order'), true);
        if (! is_array($order) || $order === []) {
            return;
        }
        $files = $request->file('images', []);
        if (! is_array($files)) {
            $files = [$files];
        }

        $existing = $destinasi->images()->get()->keyBy('id');
        $oldCover = $destinasi->image;

        $resolved = [];
        foreach ($order as $entry) {
            $kind = $entry['kind'] ?? null;
            if ($kind === 'cover' && $oldCover) {
                $resolved[] = ['path' => $oldCover, 'gallery_id' => null];
            } elseif ($kind === 'gallery' && isset($existing[$entry['id'] ?? 0])) {
                $row = $existing[$entry['id']];
                $resolved[] = ['path' => $row->image, 'gallery_id' => $row->id];
            } elseif ($kind === 'new' && isset($files[$entry['index'] ?? -1])) {
                $file = $files[$entry['index']];
                if ($file && $file->isValid()) {
                    $resolved[] = ['path' => $file->store('uploads/destinasis', 'public'), 'gallery_id' => null];
                }
            }
        }
        $resolved = array_values(array_filter($resolved, fn ($r) => ! empty($r['path'])));
        if ($resolved === []) {
            return;
        }

        // Entri pertama = sampul
        $cover = array_shift($resolved);
        if ($cover['gallery_id'] && isset($existing[$cover['gallery_id']])) {
            $existing[$cover['gallery_id']]->delete(); // pindah dari galeri jadi sampul
            unset($existing[$cover['gallery_id']]);
        }
        if ($oldCover && $oldCover !== $cover['path']) {
            $stillUsed = collect($resolved)->contains(fn ($r) => $r['path'] === $oldCover);
            if (! $stillUsed) {
                $this->deleteImage($oldCover);
            }
        }
        $destinasi->image = $cover['path'];
        $usedPaths = array_merge([$cover['path']], array_column($resolved, 'path'));

        $sort = 0;
        $keptIds = [];
        foreach ($resolved as $r) {
            if ($r['gallery_id'] && isset($existing[$r['gallery_id']])) {
                $row = $existing[$r['gallery_id']];
                $row->update(['sort_order' => $sort]);
                $keptIds[] = $row->id;
            } else {
                $keptIds[] = $destinasi->images()->create(['image' => $r['path'], 'sort_order' => $sort])->id;
            }
            $sort++;
        }
        foreach ($existing as $row) {
            if (in_array($row->id, $keptIds, true)) {
                continue;
            }
            if (! in_array($row->image, $usedPaths, true)) {
                $this->deleteImage($row->image);
            }
            $row->delete();
        }
        $destinasi->save();
    }

    public function destroy(Destinasi $destinasi)
    {
        $this->deleteImage($destinasi->image);
        foreach ($destinasi->images as $img) {
            $this->deleteImage($img->image);
        }
        $destinasi->delete();

        return back()->with('success', 'Destinasi dihapus.');
    }

    /** Halaman kelola galeri foto satu destinasi. */
    public function images(Destinasi $destinasi)
    {
        $destinasi->load('destinationCategory:id,name,slug');
        $images = $destinasi->images()->get()->map(fn ($img) => array_merge($img->toArray(), [
            'image_url' => $this->resolveModelImageUrl($img->image),
        ]));

        return Inertia::render('Admin/Destinasi/Images', [
            'destinasi' => array_merge($destinasi->toArray(), [
                'image_url' => $this->resolveModelImageUrl($destinasi->image),
            ]),
            'images' => $images,
        ]);
    }

    /** Upload banyak foto sekaligus (maks 10 per pengiriman). */
    public function storeImages(Request $request, Destinasi $destinasi)
    {
        $data = $request->validate([
            'images' => 'required|array|max:10',
            'images.*' => 'image|max:4096',
        ]);

        $order = (int) ($destinasi->images()->max('sort_order') ?? -1);
        foreach ($data['images'] as $file) {
            $order++;
            $destinasi->images()->create([
                'image' => $file->store('uploads/destinasis', 'public'),
                'sort_order' => $order,
            ]);
        }

        return back()->with('success', 'Foto ditambahkan.');
    }

    public function destroyImage(DestinationImage $destinationImage)
    {
        $this->deleteImage($destinationImage->image);
        $destinationImage->delete();

        return back()->with('success', 'Foto dihapus.');
    }
}

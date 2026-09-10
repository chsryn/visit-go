<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destinasi;
use App\Models\DestinationPriceEstimate;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DestinationPriceController extends Controller
{
    public function index(Request $request)
    {
        $destinasiId = $request->query('destinasi_id');

        $items = DestinationPriceEstimate::with('destinasi:id,name')
            ->when($destinasiId, fn ($q) => $q->where('destinasi_id', $destinasiId))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Destinasi/Prices', [
            'items' => $items,
            'destinasis' => Destinasi::orderBy('name')->get(['id', 'name']),
            'filterDestinasiId' => $destinasiId ? (int) $destinasiId : null,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'destinasi_id' => 'required|exists:destinasis,id',
            'jenis' => ['required', Rule::in(array_keys(DestinationPriceEstimate::JENIS))],
            'label' => 'required|string|max:150',
            'harga' => 'required|integer|min:0|max:1000000000',
            'satuan' => 'nullable|string|max:50',
            'catatan' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        DestinationPriceEstimate::create($data);

        return back()->with('success', 'Estimasi harga ditambahkan.');
    }

    public function update(Request $request, DestinationPriceEstimate $destinationPrice)
    {
        $data = $request->validate([
            'destinasi_id' => 'required|exists:destinasis,id',
            'jenis' => ['required', Rule::in(array_keys(DestinationPriceEstimate::JENIS))],
            'label' => 'required|string|max:150',
            'harga' => 'required|integer|min:0|max:1000000000',
            'satuan' => 'nullable|string|max:50',
            'catatan' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $destinationPrice->update($data);

        return back()->with('success', 'Estimasi harga diperbarui.');
    }

    public function destroy(DestinationPriceEstimate $destinationPrice)
    {
        $destinationPrice->delete();

        return back()->with('success', 'Estimasi harga dihapus.');
    }
}

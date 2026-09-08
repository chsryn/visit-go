<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiApiKey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AiApiKeyController extends Controller
{
    public function index()
    {
        $keys = AiApiKey::orderBy('provider')->latest()->get()
            ->map(fn ($k) => [
                'id' => $k->id,
                'provider' => $k->provider,
                'label' => $k->label,
                'masked' => $k->api_key ? '••••••••'.substr($k->api_key, -4) : null,
                'is_active' => $k->is_active,
                'is_expired' => $k->is_expired,
                'is_expiring_soon' => $k->is_expiring_soon,
                'expires_at' => $k->expires_at,
                'last_used_at' => $k->last_used_at,
                'usage_count' => $k->usage_count,
                'created_at' => $k->created_at,
            ]);

        $envFallback = [
            'groq' => (bool) config('services.groq.key'),
            'tavily' => (bool) config('services.tavily.key'),
        ];

        return Inertia::render('Admin/AiUsage/Index', [
            'keys' => $keys,
            'envFallback' => $envFallback,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'provider' => 'required|string|max:50',
            'label' => 'required|string|max:150',
            'api_key' => 'required|string|max:2000',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        AiApiKey::create($data);

        return back()->with('success', 'API key ditambahkan.');
    }

    public function update(Request $request, AiApiKey $aiApiKey)
    {
        $data = $request->validate([
            'provider' => 'required|string|max:50',
            'label' => 'required|string|max:150',
            'api_key' => 'nullable|string|max:2000',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        if (empty($data['api_key'])) {
            unset($data['api_key']); // keep existing key when field left blank
        }

        $aiApiKey->update($data);

        return back()->with('success', 'API key diperbarui.');
    }

    public function destroy(AiApiKey $aiApiKey)
    {
        $aiApiKey->delete();

        return back()->with('success', 'API key dihapus.');
    }
}

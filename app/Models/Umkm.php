<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Umkm extends Model
{
    /** Skala usaha tetap. */
    public const SKALA_USAHA = ['mikro', 'kecil', 'menengah'];

    protected $fillable = [
        'name', 'slug', 'umkm_jenis_id', 'skala_usaha', 'body', 'produk', 'kontak', 'harga', 'image', 'alt',
        'latitude', 'longitude', 'tags', 'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'harga' => 'integer',
        'is_active' => 'boolean',
    ];

    public function jenisRef(): BelongsTo
    {
        return $this->belongsTo(UmkmJenis::class, 'umkm_jenis_id');
    }

    /** Nama jenis (akses mudah untuk badge/laporan). */
    public function getJenisAttribute(): ?string
    {
        return $this->jenisRef?->name;
    }

    /** Scope: hanya UMKM berjenis tertentu (mis. kuliner). */
    public function scopeOfJenis($query, string $slug)
    {
        return $query->whereHas('jenisRef', fn ($q) => $q->where('slug', $slug));
    }
}

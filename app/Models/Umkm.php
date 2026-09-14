<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Umkm extends Model
{
    /** Skala usaha tetap. */
    public const SKALA_USAHA = ['mikro', 'kecil', 'menengah'];

    protected $fillable = [
        'name', 'slug', 'skala_usaha', 'body', 'produk', 'kontak', 'harga', 'image', 'alt',
        'latitude', 'longitude', 'tags', 'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'harga' => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeKuliner($query)
    {
        return $query->whereHas('kulinerCategories');
    }

    public function scopeKerajinan($query)
    {
        return $query->whereHas('kerajinanCategories');
    }

    public function kulinerCategories(): BelongsToMany
    {
        return $this->belongsToMany(KulinerCategory::class, 'kuliner_category_umkm');
    }

    public function kerajinanCategories(): BelongsToMany
    {
        return $this->belongsToMany(KerajinanCategory::class, 'kerajinan_category_umkm');
    }
}

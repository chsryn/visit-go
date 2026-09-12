<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destinasi extends Model
{
    /** Pilihan wilayah tetap (db.md item A) — dipakai admin select + validasi. */
    public const AREAS = [
        'Kota Gorontalo',
        'Kab. Gorontalo',
        'Bone Bolango',
        'Boalemo',
        'Pohuwato',
        'Gorontalo Utara',
    ];

    protected $fillable = ['name', 'slug', 'category', 'destination_category_id', 'body', 'image', 'alt', 'latitude', 'longitude', 'location', 'area', 'tags', 'is_active'];

    protected $casts = ['is_active' => 'boolean', 'latitude' => 'decimal:7', 'longitude' => 'decimal:7'];

    public function priceEstimates(): HasMany
    {
        return $this->hasMany(DestinationPriceEstimate::class);
    }

    public function destinationCategory(): BelongsTo
    {
        return $this->belongsTo(DestinationCategory::class, 'destination_category_id');
    }
}

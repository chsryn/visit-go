<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Destinasi extends Model
{
    protected $fillable = ['name', 'slug', 'category', 'category_id', 'body', 'image', 'alt', 'latitude', 'longitude', 'location', 'is_active'];

    protected $casts = ['is_active' => 'boolean', 'latitude' => 'decimal:7', 'longitude' => 'decimal:7'];

    public function categoryRef(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}

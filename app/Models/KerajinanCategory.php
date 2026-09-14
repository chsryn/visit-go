<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class KerajinanCategory extends Model
{
    protected $fillable = ['name', 'slug', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function umkms(): BelongsToMany
    {
        return $this->belongsToMany(Umkm::class, 'kerajinan_category_umkm');
    }
}

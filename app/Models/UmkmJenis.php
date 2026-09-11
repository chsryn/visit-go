<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UmkmJenis extends Model
{
    protected $table = 'umkm_jenis';

    protected $fillable = ['name', 'slug', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function umkms(): HasMany
    {
        return $this->hasMany(Umkm::class, 'umkm_jenis_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budaya extends Model
{
    protected $table = 'budayas';

    protected $fillable = [
        'name', 'slug', 'body', 'image', 'alt',
        'latitude', 'longitude', 'has_location', 'jam_buka', 'jam_tutup', 'area', 'tags', 'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'has_location' => 'boolean',
        'is_active' => 'boolean',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kerajinan extends Model
{
    protected $table = 'kerajinans';

    protected $fillable = [
        'name', 'slug', 'body', 'image', 'alt',
        'latitude', 'longitude', 'area', 'tags', 'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_active' => 'boolean',
    ];
}

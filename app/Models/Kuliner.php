<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kuliner extends Model
{
    protected $table = 'kuliners';

    protected $fillable = [
        'name', 'slug', 'body', 'image', 'alt',
        'latitude', 'longitude', 'harga', 'area', 'tags', 'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'harga' => 'integer',
        'is_active' => 'boolean',
    ];
}

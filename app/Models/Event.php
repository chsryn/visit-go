<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['name', 'slug', 'date', 'month', 'location', 'location_name', 'area', 'tags', 'latitude', 'longitude', 'body', 'image', 'alt', 'is_active'];

    protected $casts = ['is_active' => 'boolean', 'latitude' => 'decimal:7', 'longitude' => 'decimal:7'];
}

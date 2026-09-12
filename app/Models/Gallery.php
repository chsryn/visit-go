<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    public const CATEGORIES = ['destinasi', 'budaya', 'kuliner', 'kerajinan', 'event'];

    protected $fillable = [
        'name', 'slug', 'category', 'body', 'image', 'alt', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'name', 'slug', 'body', 'image', 'alt', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}

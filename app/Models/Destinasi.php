<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destinasi extends Model
{
    protected $fillable = ['name', 'slug', 'category', 'body', 'image', 'alt', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}

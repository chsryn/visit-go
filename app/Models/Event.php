<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = ['name', 'slug', 'date', 'month', 'location', 'body', 'image', 'alt', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}

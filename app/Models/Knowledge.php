<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Knowledge extends Model
{
    protected $table = 'knowledge';

    protected $fillable = ['topic', 'question', 'answer', 'keywords', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];
}

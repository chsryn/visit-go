<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['slug', 'name', 'description', 'banner_image', 'banner_alt', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function destinasis(): HasMany
    {
        return $this->hasMany(Destinasi::class, 'category_id');
    }
}

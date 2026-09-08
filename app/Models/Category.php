<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['slug', 'parent', 'name', 'description', 'banner_image', 'banner_alt', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function destinasis(): HasMany
    {
        return $this->hasMany(Destinasi::class, 'category_id');
    }

    /**
     * Child categories of the Destination parent (Pegunungan, Laut, Buatan, ...).
     */
    public function scopeDestinationChildren(Builder $query): Builder
    {
        return $query->where('parent', 'destination');
    }
}

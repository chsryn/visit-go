<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DestinationImage extends Model
{
    protected $fillable = ['destinasi_id', 'image', 'alt', 'sort_order'];

    public function destinasi(): BelongsTo
    {
        return $this->belongsTo(Destinasi::class, 'destinasi_id');
    }
}

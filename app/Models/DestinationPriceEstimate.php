<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DestinationPriceEstimate extends Model
{
    public const JENIS = [
        'tiket_masuk' => 'Tiket Masuk',
        'wahana' => 'Wahana / Aktivitas',
        'sewa' => 'Sewa Fasilitas',
        'lainnya' => 'Lainnya',
    ];

    protected $fillable = [
        'destinasi_id', 'jenis', 'label', 'harga', 'satuan', 'catatan', 'is_active',
    ];

    protected $casts = [
        'harga' => 'integer',
        'is_active' => 'boolean',
    ];

    public function destinasi(): BelongsTo
    {
        return $this->belongsTo(Destinasi::class);
    }
}

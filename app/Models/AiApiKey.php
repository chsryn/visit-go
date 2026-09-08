<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiApiKey extends Model
{
    protected $fillable = [
        'provider', 'label', 'api_key',
        'is_active', 'expires_at', 'last_used_at', 'usage_count',
    ];

    protected $casts = [
        'api_key' => 'encrypted',
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
        'last_used_at' => 'datetime',
        'usage_count' => 'integer',
    ];

    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function getIsExpiringSoonAttribute(): bool
    {
        return $this->expires_at !== null
            && ! $this->is_expired
            && $this->expires_at->diffInDays(now()) <= 14;
    }

    /**
     * Resolve the active key for a provider: DB first, .env as fallback.
     * Returns null when nothing is configured.
     * Never throws — DB failures (e.g. missing table/driver in tests)
     * gracefully fall back to .env config.
     */
    public static function resolveKey(string $provider): ?string
    {
        try {
            $row = static::where('provider', $provider)
                ->where('is_active', true)
                ->orderByDesc('updated_at')
                ->first();

            if ($row && $row->api_key) {
                return $row->api_key;
            }
        } catch (\Throwable $e) {
            // fall through to .env fallback
        }

        // .env fallback per provider
        return match ($provider) {
            'groq' => config('services.groq.key'),
            'tavily' => config('services.tavily.key'),
            default => null,
        } ?: null;
    }

    public static function markUsed(string $provider): void
    {
        try {
            $row = static::where('provider', $provider)->where('is_active', true)->orderByDesc('updated_at')->first();
            if ($row) {
                $row->increment('usage_count');
                $row->update(['last_used_at' => now()]);
            }
        } catch (\Throwable $e) {
            // monitoring must never break the request
        }
    }
}

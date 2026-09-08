<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait HandlesImageUpload
{
    /**
     * Store an uploaded image on the public disk and return its relative path.
     * Returns null when no file present; keeps old path when $old is given and no new file.
     */
    protected function storeImage(Request $request, string $field, string $folder, ?string $old = null): ?string
    {
        if ($request->hasFile($field)) {
            $path = $request->file($field)->store($folder, 'public');
            if ($old && ! str_starts_with($old, '/storage/portal')) {
                try {
                    Storage::disk('public')->delete($old);
                } catch (\Throwable $e) {
                }
            }

            return $path;
        }

        return $old;
    }

    protected function deleteImage(?string $path): void
    {
        if ($path && ! str_starts_with($path, '/storage/portal') && ! str_starts_with($path, 'http')) {
            try {
                Storage::disk('public')->delete(ltrim($path, '/'));
            } catch (\Throwable $e) {
            }
        }
    }

    protected function resolveModelImageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }
        if (str_starts_with($path, 'http') || str_starts_with($path, '/storage') || str_starts_with($path, '/build')) {
            return $path;
        }

        return '/storage/'.ltrim($path, '/');
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::user()->isAdmin()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('login')
                ->with('warning', 'Maaf, Anda tidak memiliki hak akses admin.');
        }

        $response = $next($request);

        // Blok bfcache: tombol Back browser tidak boleh menampilkan cache halaman admin
        $response->headers->set('Cache-Control', 'no-store, private, no-cache, must-revalidate, max-age=0');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');

        return $response;
    }
}
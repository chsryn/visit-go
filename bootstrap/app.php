<?php

use App\Http\Middleware\EnsureAdminAuth;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectTo(
            guests: '/login',
            users: '/admin/dashboard'
        );
        $middleware->alias([
            'admin.auth' => EnsureAdminAuth::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Session habis / belum login di halaman admin → arahkan ke login dengan pesan eksplisit.
        // Tidak memakai redirect()->guest() agar url.intended (rute terakhir) TIDAK PERNAH disimpan,
        // sehingga login kembali selalu mendarat di /admin/dashboard.
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            // Inertia XHR: redirect ke login + flash — Inertia mengikutinya secara otomatis
            // sehingga SPA pindah ke halaman SignIn (bukan 401 JSON mentah).
            if ($request->header('X-Inertia')) {
                return redirect('/login')
                    ->with('warning', 'Sesi Anda telah berakhir. Silakan masuk kembali.');
            }

            // JSON/API (termasuk /admin/api/*): 401 + no-store, tanpa redirect.
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json(['message' => $e->getMessage()], 401, [
                    'Cache-Control' => 'no-store, private, no-cache, must-revalidate, max-age=0',
                    'Pragma' => 'no-cache',
                ]);
            }

            // akses browser langsung: redirect ke login + flash.
            // TIDAK memakai redirect()->guest() agar url.intended (rute terakhir) tak pernah disimpan.
            return redirect('/login')
                ->with('warning', 'Sesi Anda telah berakhir. Silakan masuk kembali.');
        });
    })->create();

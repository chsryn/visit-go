<?php

use App\Http\Controllers\Admin\AiApiKeyController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\BudayaController as AdminBudayaController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DestinasiController as AdminDestinasiController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\KerajinanController as AdminKerajinanController;
use App\Http\Controllers\Admin\KulinerController as AdminKulinerController;
use App\Http\Controllers\Admin\MapController as AdminMapController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\AiPlannerController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\DestinasiController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\KnowledgeController;
use App\Http\Controllers\PortalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('/', [PortalController::class, 'index'])->name('home');

// Category listing — harus di atas detail {slug} agar /destinasi tidak dianggap slug (seperti kategori lain)
Route::get('/destinasi', [PortalController::class, 'indexByCategory'])->defaults('category', 'destinasi')->name('destinasi.index');
Route::get('/budaya', [PortalController::class, 'indexByCategory'])->defaults('category', 'budaya')->name('budaya.index');
Route::get('/kuliner', [PortalController::class, 'indexByCategory'])->defaults('category', 'kuliner')->name('kuliner.index');
Route::get('/kerajinan', [PortalController::class, 'indexByCategory'])->defaults('category', 'kerajinan')->name('kerajinan.index');
Route::get('/event', [PortalController::class, 'indexByCategory'])->defaults('category', 'event')->name('event.index');

// Dynamic detail routes: /destinasi/{slug}, /budaya/{slug}, /kuliner/{slug}, /kerajinan/{slug}, /event/{slug}
Route::get('/destinasi/{slug}', [PortalController::class, 'showDestinasi'])->name('destinasi.show');
Route::get('/budaya/{slug}', [PortalController::class, 'showBudaya'])->name('budaya.show');
Route::get('/kuliner/{slug}', [PortalController::class, 'showKuliner'])->name('kuliner.show');
Route::get('/kerajinan/{slug}', [PortalController::class, 'showKerajinan'])->name('kerajinan.show');
Route::get('/event/{slug}', [PortalController::class, 'showEvent'])->name('event.show');

Route::post('/api/chat', [ChatbotController::class, 'handle'])->name('api.chat');
Route::post('/api/ai-planner', [AiPlannerController::class, 'generate'])->name('api.ai-planner');
Route::get('/api/knowledge/search', [KnowledgeController::class, 'search'])->name('api.knowledge.search');

// Admin CRUD (nanti bisa tambah middleware auth) — index destinasi sudah dipakai untuk public listing /destinasi
Route::resource('knowledge', KnowledgeController::class)->only(['index', 'store', 'update', 'destroy']);
Route::resource('destinasi', DestinasiController::class)->only(['store', 'update', 'destroy']);
Route::resource('events', EventController::class)->only(['index', 'store', 'update', 'destroy']);

// ---- Admin panel  ----
Route::get('/login', fn () => redirect()->route('admin.login'))->name('login');
Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])->middleware('guest')->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login'])->middleware('guest')->name('admin.login.store');
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->middleware('auth')->name('admin.logout');

Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Destination grouped per category (accordion filter via ?category_id=)
    Route::resource('destinasis', AdminDestinasiController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('budayas', AdminBudayaController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('kuliners', AdminKulinerController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('kerajinans', AdminKerajinanController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('events', AdminEventController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('ai-keys', AiApiKeyController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('/profile', [AdminProfileController::class, 'show'])->name('profile');
    Route::put('/profile', [AdminProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password');

    Route::get('/maps', [AdminMapController::class, 'index'])->name('maps');
    Route::get('/api/map-points', [AdminMapController::class, 'points'])->name('api.map-points');
});

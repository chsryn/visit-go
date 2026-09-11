<?php

use App\Http\Controllers\Admin\AiApiKeyController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\BudayaController as AdminBudayaController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DestinasiController as AdminDestinasiController;
use App\Http\Controllers\Admin\DestinationPriceController as AdminDestinationPriceController;
use App\Http\Controllers\Admin\DestinationCategoryController as AdminDestinationCategoryController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\MapController as AdminMapController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\UmkmController as AdminUmkmController;
use App\Http\Controllers\Admin\UmkmJenisController as AdminUmkmJenisController;
use App\Http\Controllers\AiPlannerController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\DestinasiController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\KnowledgeController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('/', [PortalController::class, 'index'])->name('home');

// Search (hero) — sebelum wildcard {slug}
Route::get('/search', [SearchController::class, 'index'])->name('search.index');
Route::get('/api/search', [SearchController::class, 'api'])->name('api.search');

// Destination: daftar flat (sebelum detail {slug})
Route::get('/destinasi', [PortalController::class, 'destinationIndex'])->name('destinasi.index');
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

// API publik berbiaya (AI berbayar per token) — throttle anti-abuse, tanpa ubah perilaku
Route::post('/api/chat', [ChatbotController::class, 'handle'])->middleware('throttle:30,1')->name('api.chat');
Route::post('/api/ai-planner', [AiPlannerController::class, 'generate'])->middleware('throttle:15,1')->name('api.ai-planner');
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

    Route::resource('destinasis', AdminDestinasiController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('destination-categories', AdminDestinationCategoryController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['destination-categories' => 'destinationCategory']);
    Route::resource('destination-prices', AdminDestinationPriceController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('budayas', AdminBudayaController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('umkms', AdminUmkmController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('umkm-jenis', AdminUmkmJenisController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['umkm-jenis' => 'umkmJenis']);
    Route::resource('events', AdminEventController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('galleries', AdminGalleryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('ai-keys', AiApiKeyController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('/profile', [AdminProfileController::class, 'show'])->name('profile');
    Route::put('/profile', [AdminProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password');

    Route::get('/maps', [AdminMapController::class, 'index'])->name('maps');
    Route::get('/api/map-points', [AdminMapController::class, 'points'])->name('api.map-points');
});

<?php

use App\Http\Controllers\AiPlannerController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\DestinasiController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\KnowledgeController;
use App\Http\Controllers\PortalController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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


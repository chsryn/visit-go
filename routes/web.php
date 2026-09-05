<?php

use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\DestinasiController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\KnowledgeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::post('/api/chat', [ChatbotController::class, 'handle'])->name('api.chat');
Route::get('/api/knowledge/search', [KnowledgeController::class, 'search'])->name('api.knowledge.search');

// Admin CRUD (nanti bisa tambah middleware auth)
Route::resource('knowledge', KnowledgeController::class)->only(['index', 'store', 'update', 'destroy']);
Route::resource('destinasi', DestinasiController::class)->only(['index', 'store', 'update', 'destroy']);
Route::resource('events', EventController::class)->only(['index', 'store', 'update', 'destroy']);

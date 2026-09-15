<?php

namespace App\Http\Controllers;

use App\Models\Knowledge;
use Illuminate\Http\Request;

class KnowledgeController extends Controller
{
    // API untuk Chatbot fallback: GET /api/knowledge/search?q=taruna
    public function search(Request $request)
    {
        $q = strtolower(trim($request->query('q', '')));
        if (! $q) {
            return response()->json([]);
        }
        $items = Knowledge::where('is_active', true)
            ->where(function ($w) use ($q) {
                $w->where('keywords', 'like', "%{$q}%")
                  ->orWhere('question', 'like', "%{$q}%")
                  ->orWhere('topic', 'like', "%{$q}%");
            })->limit(5)->get(['topic', 'question', 'answer']);
        return response()->json($items);
    }
}
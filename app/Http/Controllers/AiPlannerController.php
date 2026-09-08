<?php

namespace App\Http\Controllers;

use App\Services\AiPlannerService;
use Illuminate\Http\Request;

class AiPlannerController extends Controller
{
    protected AiPlannerService $aiPlannerService;

    public function __construct(AiPlannerService $aiPlannerService)
    {
        $this->aiPlannerService = $aiPlannerService;
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'duration' => 'nullable|string|max:100',
            'duration_days' => 'nullable|integer|min:1|max:30',
            'interest' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:100',
            'food_preference' => 'nullable|string|max:100',
            'companion' => 'nullable|string|max:50',
            'currency' => 'nullable|string|max:10',
            'penginapan' => 'nullable|string|max:50',
            'custom_interest' => 'nullable|string|max:200',
        ]);

        $itinerary = $this->aiPlannerService->generateItinerary($validated);

        return response()->json([
            'success' => true,
            'data' => $itinerary
        ]);
    }
}

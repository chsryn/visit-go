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
            'budget' => 'nullable|string|max:100',
            'interest' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:100',
            'food_preference' => 'nullable|string|max:100',
        ]);

        $itinerary = $this->aiPlannerService->generateItinerary($validated);

        return response()->json([
            'success' => true,
            'data' => $itinerary
        ]);
    }
}

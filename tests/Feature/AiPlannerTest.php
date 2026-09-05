<?php

namespace Tests\Feature;

use Tests\TestCase;

class AiPlannerTest extends TestCase
{
    public function test_ai_planner_endpoint_returns_valid_structure(): void
    {
        $response = $this->postJson('/api/ai-planner', [
            'duration' => '2–3 hari',
            'budget' => 'Menengah',
            'interest' => 'Alam & Bahari',
            'location' => 'Kota Gorontalo',
            'food_preference' => 'Halal Only',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'title',
                    'summary',
                    'highlights',
                    'days',
                    'budget_breakdown' => [
                        'accommodation',
                        'food',
                        'transport',
                        'attractions',
                        'total_estimated'
                    ],
                    'food_highlights',
                    'travel_tips'
                ]
            ]);

        $this->assertTrue($response->json('success'));
        $this->assertNotEmpty($response->json('data.days'));
    }
}

<?php

namespace App\Services\Ai;

use App\Models\AiApiKey;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Klien Groq (OpenAI-compatible): panggil chat, retry 429, parse JSON.
 * Return null bila gagal — pemanggil memakai fallback lokal.
 */
final class GroqClient
{
    private const MAX_ATTEMPTS = 3;

    private const TIMEOUT_SECONDS = 25;

    private const MAX_TOKENS = 4000;

    public function __construct(
        private readonly string $url = '',
        private readonly string $model = '',
    ) {}

    /**
     * @return array{days: array, title: string}|null itinerary terparse atau null
     */
    public function generateContent(string $systemPrompt, string $userPrompt): ?array
    {
        $key = AiApiKey::resolveKey('groq') ?? config('services.groq.key');
        if (! $key) {
            return null;
        }

        $url = $this->url !== '' ? $this->url : config('services.groq.url', 'https://api.groq.com/openai/v1/chat/completions');
        $model = $this->model !== '' ? $this->model : config('services.groq.model', 'openai/gpt-oss-20b');

        try {
            $response = null;
            for ($attempt = 1; $attempt <= self::MAX_ATTEMPTS; $attempt++) {
                $response = Http::withToken($key)
                    ->timeout(self::TIMEOUT_SECONDS)
                    ->post($url, [
                        'model' => $model,
                        'messages' => [
                            ['role' => 'system', 'content' => $systemPrompt],
                            ['role' => 'user', 'content' => $userPrompt],
                        ],
                        'temperature' => 0.4,
                        'max_tokens' => self::MAX_TOKENS,
                        'response_format' => ['type' => 'json_object'],
                    ]);
                if ($response->status() !== 429 || $attempt === self::MAX_ATTEMPTS) {
                    break;
                }
                $wait = $this->rateLimitWaitSeconds($response);
                Log::info("AiPlanner 429, retry {$attempt} after {$wait}s");
                sleep($wait);
            }

            if (! $response->successful()) {
                Log::warning('AiPlanner API HTTP failed', ['status' => $response->status(), 'body' => $response->body()]);

                return null;
            }

            AiApiKey::markUsed('groq');
            $raw = $response->json('choices.0.message.content');
            $json = is_string($raw) && $raw !== '' ? $this->parseJson($raw) : null;
            if (is_array($json) && isset($json['days'], $json['title'])) {
                return $json;
            }
            Log::warning('AiPlanner API parse failed', ['preview' => mb_substr((string) $raw, 0, 200)]);

            return null;
        } catch (\Throwable $e) {
            Log::error('AiPlanner API exception', ['error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Kupas fence ```json, toleransi kalimat pembuka/penutup
     * dengan mengekstrak blok {...} terluar.
     */
    private function parseJson(string $raw): ?array
    {
        $cleaned = trim(preg_replace('/^```json\s*|\s*```$/i', '', trim($raw)));
        $json = json_decode($cleaned, true);
        if (is_array($json)) {
            return $json;
        }
        if (preg_match('/\{.*\}/s', $raw, $m)) {
            $json = json_decode($m[0], true);
            if (is_array($json)) {
                return $json;
            }
        }

        return null;
    }

    /**
     * Jeda retry 429: hormati header Retry-After / anjuran "try again in Ns",
     * default 15 dtk, maksimal 45 dtk.
     */
    private function rateLimitWaitSeconds($response): int
    {
        $header = (int) ($response->header('Retry-After') ?? 0);
        if ($header > 0) {
            return min($header, 45);
        }
        if (preg_match('/try again in ([\d.]+)s/i', (string) $response->body(), $m)) {
            return min(max((int) ceil((float) $m[1]), 5), 45);
        }

        return 15;
    }
}

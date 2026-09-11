<?php

namespace App\Console\Commands;

use App\Models\Budaya;
use App\Models\Destinasi;
use Illuminate\Console\Command;

/**
 * plan.md §2 — cetak daftar "pindah vs tetap" by rule untuk persetujuan
 * manusia sebelum eksekusi final. Read-only: tidak mengubah data.
 *
 * Aturan pindah budayas → destinasis (kategori cagar budaya):
 *   benteng/museum/masjid/makam/rumah adat/desa wisata/monumen
 * Aturan petakan destinasis existing:
 *   benteng/masjid/makam/museum/menara/monumen → cagar budaya, sisanya → wisata alam.
 */
class PreviewDestinationCategorization extends Command
{
    protected $signature = 'destinasi:preview-kategori';

    protected $description = 'Cetak daftar pindah-vs-tetap kategorisasi destinasi (by rule, tanpa ubah data)';

    private const PINDAH_KEYWORDS = ['benteng', 'museum', 'masjid', 'makam', 'rumah adat', 'desa wisata', 'monumen'];

    // Sama dengan daftar keyword backfill migration 2026_09_23 (disetujui) +
    // keyword plan.md (menara, monumen).
    private const CAGAR_KEYWORDS = ['benteng', 'masjid', 'makam', 'keramat', 'aulia', 'museum', 'menara', 'tower', 'rumah adat', 'desa wisata', 'kampung', 'religi', 'tugu', 'monumen', 'budaya', 'walima', 'bubohu', 'integrasi'];

    private function matchKeyword(string $name, array $keywords): ?string
    {
        $low = strtolower($name);
        foreach ($keywords as $kw) {
            if (str_contains($low, $kw)) {
                return $kw;
            }
        }

        return null;
    }

    public function handle(): int
    {
        $this->info('== Budayas: pindah ke destinasis (cagar budaya) vs tetap ==');
        $pindah = 0;
        $tetap = 0;
        foreach (Budaya::orderBy('name')->get(['name']) as $b) {
            $kw = $this->matchKeyword($b->name, self::PINDAH_KEYWORDS);
            if ($kw) {
                $this->line("  [PINDAH] {$b->name}  (keyword: {$kw})");
                $pindah++;
            } else {
                $this->line("  [TETAP ] {$b->name}  (bukan destinasi)");
                $tetap++;
            }
        }
        $this->info("  Total: {$pindah} pindah, {$tetap} tetap.");

        $this->info('== Destinasis existing: petakan ke kategori ==');
        $cagar = 0;
        $alam = 0;
        foreach (Destinasi::with('destinationCategory:id,slug')->orderBy('name')->get() as $d) {
            $kw = $this->matchKeyword($d->name, self::CAGAR_KEYWORDS);
            $rule = $kw ? "cagar budaya (keyword: {$kw})" : 'wisata alam (default)';
            $actual = $d->destinationCategory->slug ?? 'NULL';
            if ($kw) {
                $cagar++;
            } else {
                $alam++;
            }
            $this->line("  [{$actual}] {$d->name}  (rule: {$rule})");
        }
        $this->info("  Total: {$cagar} cagar budaya, {$alam} wisata alam.");

        return self::SUCCESS;
    }
}

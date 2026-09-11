<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * plan.md: master kategori destinasi (cagar budaya, wisata alam) + FK.
     * Backfill by keyword rule; daftar pindah tercetak untuk persetujuan.
     */
    public function up(): void
    {
        // Guard: tabel mungkin sudah dibuat migrasi lain yang filenya tak ada
        if (! Schema::hasTable('destination_categories')) {
            Schema::create('destination_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name', 100)->unique();
                $table->string('slug', 100)->unique();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        foreach (['cagar budaya', 'wisata alam'] as $name) {
            DB::table('destination_categories')->updateOrInsert(
                ['slug' => \Illuminate\Support\Str::slug($name)],
                ['name' => $name, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()]
            );
        }

        Schema::table('destinasis', function (Blueprint $table) {
            if (! Schema::hasColumn('destinasis', 'destination_category_id')) {
                $table->foreignId('destination_category_id')->nullable()->after('slug')->constrained('destination_categories')->nullOnDelete();
            }
        });

        $cagarId = DB::table('destination_categories')->where('slug', 'cagar-budaya')->value('id');
        $alamId = DB::table('destination_categories')->where('slug', 'wisata-alam')->value('id');

        $keywords = ['benteng', 'masjid', 'makam', 'keramat', 'aulia', 'museum', 'menara', 'tower', 'rumah adat', 'desa wisata', 'kampung', 'religi', 'tugu', 'monumen', 'budaya', 'walima', 'bubohu', 'integrasi'];

        $moved = 0;
        $kept = 0;
        foreach (DB::table('destinasis')->whereNull('destination_category_id')->get(['id', 'name']) as $row) {
            $low = strtolower($row->name);
            $isCagar = false;
            foreach ($keywords as $kw) {
                if (str_contains($low, $kw)) {
                    $isCagar = true;
                    break;
                }
            }
            DB::table('destinasis')->where('id', $row->id)->update([
                'destination_category_id' => $isCagar ? $cagarId : $alamId,
            ]);
            if ($isCagar) {
                echo "  [cagar budaya] {$row->name}\n";
                $moved++;
            } else {
                $kept++;
            }
        }
        echo "  Backfill selesai: {$moved} cagar budaya, {$kept} wisata alam.\n";
    }

    public function down(): void
    {
        Schema::table('destinasis', function (Blueprint $table) {
            if (Schema::hasColumn('destinasis', 'destination_category_id')) {
                $table->dropConstrainedForeignId('destination_category_id');
            }
        });
        Schema::dropIfExists('destination_categories');
    }
};

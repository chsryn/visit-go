<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * db.md item A+B: kolom area eksplisit (destinasis, events) + tags
     * (semua tabel konten). Backfill idempotent dari data existing.
     */
    public function up(): void
    {
        Schema::table('destinasis', function (Blueprint $table) {
            if (! Schema::hasColumn('destinasis', 'area')) {
                $table->string('area', 100)->nullable()->after('location')->index();
            }
            if (! Schema::hasColumn('destinasis', 'tags')) {
                $table->text('tags')->nullable()->after('area');
            }
        });

        Schema::table('events', function (Blueprint $table) {
            if (! Schema::hasColumn('events', 'area')) {
                $table->string('area', 100)->nullable()->after('location_name')->index();
            }
            if (! Schema::hasColumn('events', 'tags')) {
                $table->text('tags')->nullable()->after('area');
            }
        });

        foreach (['budayas', 'kuliners', 'kerajinans'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                if (! Schema::hasColumn($table->getTable(), 'tags')) {
                    $table->text('tags')->nullable();
                }
            });
        }

        $this->backfillAreas();
        $this->backfillTags();
    }

    public function down(): void
    {
        Schema::table('destinasis', function (Blueprint $table) {
            if (Schema::hasColumn('destinasis', 'area')) {
                $table->dropColumn('area');
            }
            if (Schema::hasColumn('destinasis', 'tags')) {
                $table->dropColumn('tags');
            }
        });
        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'area')) {
                $table->dropColumn('area');
            }
            if (Schema::hasColumn('events', 'tags')) {
                $table->dropColumn('tags');
            }
        });
        foreach (['budayas', 'kuliners', 'kerajinans'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                if (Schema::hasColumn($table->getTable(), 'tags')) {
                    $table->dropColumn('tags');
                }
            });
        }
    }

    private function normKey(?string $s): string
    {
        $s = strtolower(trim((string) $s));
        $s = str_replace(['.', ','], '', $s);
        $s = str_replace('kabupaten', 'kab', $s);

        return preg_replace('/[^a-z0-9]/', '', $s);
    }

    private function backfillAreas(): void
    {
        $map = [
            'kotagorontalo' => 'Kota Gorontalo',
            'kabgorontalo' => 'Kab. Gorontalo',
            'bonebolango' => 'Bone Bolango',
            'boalemo' => 'Boalemo',
            'pohuwato' => 'Pohuwato',
            'gorontaloutara' => 'Gorontalo Utara',
        ];

        foreach (['destinasis' => 'location', 'events' => 'location_name'] as $table => $col) {
            if (! Schema::hasColumn($table, 'area')) {
                continue;
            }
            $rows = DB::table($table)->whereNull('area')->get(['id', $col]);
            foreach ($rows as $row) {
                $key = $this->normKey($row->{$col} ?? '');
                if ($key === '') {
                    continue;
                }
                foreach ($map as $needle => $area) {
                    if (str_contains($key, $needle) || str_contains($needle, $key)) {
                        DB::table($table)->where('id', $row->id)->update(['area' => $area]);
                        break;
                    }
                }
            }
        }
    }

    private function backfillTags(): void
    {
        $vocab = [
            'snorkeling', 'diving', 'selam', 'pantai', 'island', 'hiking', 'trekking',
            'mendaki', 'gunung', 'air terjun', 'pemandian', 'benteng', 'menara',
            'resort', 'sunset', 'memancing', 'renang', 'camping', 'bird', 'fotografi',
            'honeymoon', 'museum', 'tari', 'musik', 'tenun', 'anyaman', 'pasar',
            'bakar', 'goreng', 'sup', 'soto', 'kue', 'santan', 'seafood', 'ikan',
            'manis', 'rebus', 'panggang', 'festival', 'karnaval', 'adat', 'sejarah',
            'hiu', 'paus', 'karang', 'terumbu', 'teluk', 'relaksasi', 'sawah', 'danau',
        ];

        foreach (['destinasis', 'events', 'budayas', 'kuliners', 'kerajinans'] as $table) {
            if (! Schema::hasColumn($table, 'tags')) {
                continue;
            }
            $rows = DB::table($table)->whereNull('tags')->get(['id', 'name', 'body']);
            foreach ($rows as $row) {
                $hay = strtolower(($row->name ?? '').' '.strip_tags($row->body ?? ''));
                $hits = [];
                foreach ($vocab as $kw) {
                    if (str_contains($hay, $kw)) {
                        $hits[] = $kw;
                    }
                    if (count($hits) >= 8) {
                        break;
                    }
                }
                if ($hits) {
                    DB::table($table)->where('id', $row->id)->update(['tags' => implode(',', $hits)]);
                }
            }
        }
    }
};

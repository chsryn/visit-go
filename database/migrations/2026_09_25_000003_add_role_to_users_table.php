<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'role')) {
                $table->string('role', 20)->default('user')->after('email');
            }
        });

        // Backfill existing users: admin@visitgo.local => admin, others => user
        if (Schema::hasColumn('users', 'role')) {
            \Illuminate\Support\Facades\DB::table('users')->where('email', 'admin@visitgo.local')->whereNull('role')->orWhere('email','admin@visitgo.local')->update(['role' => 'admin']);
            \Illuminate\Support\Facades\DB::table('users')->where('role', '')->orWhereNull('role')->update(['role' => 'user']);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
    }
};

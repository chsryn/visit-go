<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Gallery;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GallerySeeder extends Seeder
{
    private const GALLERIES = [
        ['src' => 'pulau-cinta.jpg', 'name' => 'Pulo Cinta Gorontalo', 'cat' => 'destinasi', 'body' => 'Pulo Cinta di Boalemo dijuluki Maldives-nya Gorontalo — resort eksotis di atas lagun berbentuk hati di Teluk Tomini.', 'alt' => 'Pulo Cinta Gorontalo'],
        ['src' => 'pulau-diyonumo.jpg', 'name' => 'Pulau Diyonumo', 'cat' => 'destinasi', 'body' => 'Pulau Diyonumo di Gorontalo Utara — pulau kecil dengan mercusuar dan sunset memukau Teluk Tomini.', 'alt' => 'Pulau Diyonumo Gorontalo'],
        ['src' => 'benteng-otanaha.jpg', 'name' => 'Benteng Otanaha', 'cat' => 'destinasi', 'body' => 'Benteng Otanaha peninggalan abad ke-16 di Kota Gorontalo — ikon sejarah dengan panorama Danau Limboto.', 'alt' => 'Benteng Otanaha Gorontalo'],
        ['src' => 'pantai-taludaa.jpg', 'name' => 'Pantai Taludaa Bone Bolango', 'cat' => 'destinasi', 'body' => 'Pantai Taludaa di Bone Bolango — pasir putih dan sunrise terbaik Teluk Tomini.', 'alt' => 'Pantai Taludaa Gorontalo'],
        ['src' => 'keramba-rumah.jpg', 'name' => 'Keramba Rumah Apung', 'cat' => 'destinasi', 'body' => 'Keramba apung di perairan Gorontalo — wisata edukasi perikanan dan kuliner laut segar.', 'alt' => 'Keramba Rumah Apung Gorontalo'],
        ['src' => 'destinasi-alam.jpg', 'name' => 'Pesona Alam Gorontalo', 'cat' => 'destinasi', 'body' => 'Keindahan alam Gorontalo — hutan, teluk, dan pegunungan yang masih asri.', 'alt' => 'Alam Gorontalo'],
        ['src' => 'busana-adat-gorontalo.jpg', 'name' => 'Busana Adat Gorontalo', 'cat' => 'budaya', 'body' => 'Busana adat Gorontalo dengan warna cerah dan detail sulaman — dikenakan pada upacara adat Pohutu.', 'alt' => 'Busana Adat Gorontalo'],
        ['src' => 'patung-patani.jpg', 'name' => 'Patung Patani Gorontalo', 'cat' => 'budaya', 'body' => 'Patung Patani di Kota Gorontalo — monumen sejarah perjuangan masyarakat Hulonthalo.', 'alt' => 'Patung Patani Gorontalo'],
        ['src' => 'motif-karawo.jpg', 'name' => 'Motif Kain Karawo', 'cat' => 'kerajinan', 'body' => 'Motif Kain Karawo — sulaman khas Gorontalo dengan teknik iris dan cabut benang bermotif flora.', 'alt' => 'Motif Kain Karawo'],
        ['src' => 'menyulam-karawo.webp', 'name' => 'Menyulam Karawo', 'cat' => 'kerajinan', 'body' => 'Proses menyulam Karawo oleh perajin lokal — warisan mahakarya tangan Gorontalo.', 'alt' => 'Menyulam Karawo'],
    ];

    // 4 artikel reuse asset yang sama dengan narasi lebih panjang
    private const ARTICLES = [
        ['src' => 'pulau-cinta.jpg', 'name' => 'Pulo Cinta: Maldives-nya Gorontalo', 'body' => "Pulo Cinta di Kabupaten Boalemo adalah destinasi honeymoon paling ikonik Gorontalo. Resort terapung di atas lagun berbentuk hati ini menawarkan villa private dengan akses langsung ke laut jernih Teluk Tomini. Dari Kota Gorontalo, perjalanan 2 jam darat + 15 menit perahu. Terbaik saat sunrise dan sunset — jangan lewatkan snorkeling di sekitar karang dangkal.\n\nTips: pesan 2 minggu sebelumnya di musim libur, bawa sunblock dan kamera underwater."],
        ['src' => 'benteng-otanaha.jpg', 'name' => 'Menilik Sejarah Benteng Otanaha', 'body' => "Benteng Otanaha dibangun pada abad ke-16 di atas bukit Kota Gorontalo. Dari puncaknya, panorama Danau Limboto dan Kota Gorontalo terbentang luas. Tangga berbatu 300 anak mengantar pengunjung ke pelataran benteng yang masih kokoh.\n\nDatang pagi untuk cahaya terbaik dan sejuk. Tiket masuk terjangkau, cocok untuk wisata sejarah dan fotografi."],
        ['src' => 'motif-karawo.jpg', 'name' => 'Mengenal Karawo: Warisan Sulam Gorontalo', 'body' => "Karawo adalah teknik sulam khas Gorontalo dengan cara mengiris dan mencabut benang kain, lalu menyulam motif flora dengan benang warna. Berasal dari Kabupaten Gorontalo, kini Karawo menjadi ikon Karnaval Karawo tahunan.\n\nKunjungi Kampung Karawo di Kota Gorontalo untuk melihat langsung perajin menyulam dan membeli kain asli."],
        ['src' => 'busana-adat-gorontalo.jpg', 'name' => 'Pesona Busana Adat Gorontalo', 'body' => "Busana adat Gorontalo dikenal dengan warna cerah, mahkota Baya, dan detail sulaman Karawo. Dikenakan pada upacara Moloopu, pernikahan adat, dan penyambutan tamu dengan Tari Saronde.\n\nSetiap warna memiliki makna — merah keberanian, kuning kemuliaan, hijau kesuburan. Pelestariannya terus didorong Dinas Pariwisata melalui festival budaya."],
    ];

    public function run(): void
    {
        Storage::disk('public')->makeDirectory('uploads/galleries');
        Storage::disk('public')->makeDirectory('uploads/articles');

        foreach (self::GALLERIES as $r) {
            $ext = strtolower(pathinfo($r['src'], PATHINFO_EXTENSION)) ?: 'jpg';
            if ($ext === 'jpeg') $ext = 'jpg';
            $dest = 'uploads/galleries/' . Str::slug($r['name']) . '.' . $ext;
            $sourcePath = resource_path('js/assets/' . $r['src']);
            if (! Storage::disk('public')->exists($dest) && is_file($sourcePath)) {
                Storage::disk('public')->put($dest, file_get_contents($sourcePath));
            }
            Gallery::updateOrCreate(
                ['slug' => Str::slug($r['name'])],
                [
                    'name' => $r['name'],
                    'category' => $r['cat'],
                    'body' => $r['body'],
                    'image' => $dest,
                    'alt' => $r['alt'],
                    'is_active' => true,
                ]
            );
        }

        foreach (self::ARTICLES as $r) {
            $ext = strtolower(pathinfo($r['src'], PATHINFO_EXTENSION)) ?: 'jpg';
            if ($ext === 'jpeg') $ext = 'jpg';
            $dest = 'uploads/articles/' . Str::slug($r['name']) . '.' . $ext;
            $sourcePath = resource_path('js/assets/' . $r['src']);
            if (! Storage::disk('public')->exists($dest) && is_file($sourcePath)) {
                Storage::disk('public')->put($dest, file_get_contents($sourcePath));
            }
            Article::updateOrCreate(
                ['slug' => Str::slug($r['name'])],
                [
                    'name' => $r['name'],
                    'body' => $r['body'],
                    'image' => $dest,
                    'alt' => $r['name'],
                    'is_active' => true,
                ]
            );
        }
    }
}

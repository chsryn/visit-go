<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Destinasi;
use Illuminate\Database\Seeder;

class DestinationCategorySeeder extends Seeder
{
    /**
     * issue.md §2: 3 kategori awal child dari Destination + petakan
     * destinasi lama (category = 'destinasi') ke kategori barunya.
     * Idempotent — aman dijalankan ulang.
     */
    public function run(): void
    {
        $children = [
            [
                'slug' => 'pegunungan',
                'name' => 'Pegunungan',
                'description' => 'Sejuknya dataran tinggi Gorontalo — pemandian air panas, perbukitan, dan panorama Danau Limboto.',
                'banner_image' => '/storage/portal/kategori-destinasi.jpg',
                'banner_alt' => 'Panorama pegunungan Gorontalo',
            ],
            [
                'slug' => 'laut',
                'name' => 'Laut',
                'description' => 'Pesona bahari Teluk Tomini — hiu paus Botubarani, Pulo Cinta, dan Taman Laut Olele.',
                'banner_image' => '/storage/portal/kategori-destinasi.jpg',
                'banner_alt' => 'Keindahan laut Gorontalo',
            ],
            [
                'slug' => 'buatan',
                'name' => 'Buatan',
                'description' => 'Ikon buatan manusia — menara, benteng bersejarah, dan landmark Kota Gorontalo.',
                'banner_image' => '/storage/portal/kategori-destinasi.jpg',
                'banner_alt' => 'Landmark buatan Gorontalo',
            ],
        ];

        $ids = [];
        foreach ($children as $c) {
            $row = Category::updateOrCreate(
                ['slug' => $c['slug']],
                array_merge($c, ['parent' => 'destination', 'is_active' => true])
            );
            $ids[$c['slug']] = $row->id;
        }

        // Petakan destinasi lama ke kategori baru (eksplisit per slug).
        $map = [
            'laut' => [
                'wisata-hiu-paus-botubarani', 'pulo-cinta-eco-resort', 'taman-laut-olele',
                'hiu-paus-botubarani', 'pulo-cinta', 'botubarani-pulo-cinta',
            ],
            'buatan' => ['menara-agung-limboto'],
            'pegunungan' => ['pemandian-air-panas-lombongo'],
        ];

        foreach ($map as $slug => $destSlugs) {
            Destinasi::whereIn('slug', $destSlugs)->update(['category_id' => $ids[$slug]]);
        }
    }
}

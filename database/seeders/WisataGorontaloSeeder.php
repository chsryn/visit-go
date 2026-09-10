<?php

namespace Database\Seeders;

use App\Models\Budaya;
use App\Models\Category;
use App\Models\Destinasi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Data wisata se-Provinsi Gorontalo per wilayah (nama, alamat, jarak dari
 * Pusat Kota Gorontalo). Bahari/Alam/Buatan → destinasis dengan
 * category_id dinamis; Budaya/Religius & Sejarah → budayas.
 *
 * Idempotent (firstOrCreate per slug): aman dijalankan ulang dan tidak
 * akan menimpa data yang sudah diedit admin.
 */
class WisataGorontaloSeeder extends Seeder
{
    /** Seksi → [tabel, slug-kategori-destinasi|budaya, label, tags dasar]. */
    private const SECTION_MAP = [
        'Bahari' => ['destinasis', 'laut', 'bahari', ['pantai', 'laut']],
        'Alam' => ['destinasis', 'pegunungan', 'alam', ['alam']],
        'Buatan' => ['destinasis', 'buatan', 'buatan', ['buatan']],
        'Budaya' => ['budayas', null, 'budaya dan religi', ['budaya', 'religi']],
        'Sejarah' => ['budayas', null, 'sejarah', ['sejarah']],
    ];

    /** Kata kunci nama → tags tambahan. */
    private const NAME_TAGS = [
        'pantai' => ['pantai'], 'pulau' => ['pulau', 'island'], 'lito' => ['pulau', 'island'],
        'resort' => ['resort'], 'teluk' => ['teluk'], 'tanjung' => ['tanjung'],
        'air terjun' => ['air terjun'], 'danau' => ['danau'], 'embung' => ['embung', 'danau'],
        'goa' => ['goa'], 'hutan' => ['hutan'], 'pinus' => ['pinus', 'hutan'],
        'cagar alam' => ['cagar alam', 'hutan'], 'aram jeram' => ['arung jeram'],
        'arum jeram' => ['arung jeram'], 'river tubing' => ['arung jeram', 'sungai'],
        'air panas' => ['pemandian', 'air panas', 'relaksasi'], 'pemandian' => ['pemandian'],
        'kolam' => ['kolam', 'renang'], 'tower' => ['menara', 'tower'], 'bukit' => ['bukit'],
        'masjid' => ['masjid', 'religi'], 'makam' => ['makam', 'ziarah'], 'keramat' => ['makam', 'ziarah'],
        'aulia' => ['makam', 'ziarah'], 'rumah adat' => ['rumah adat', 'budaya'],
        'desa wisata' => ['desa wisata', 'budaya'], 'benteng' => ['benteng', 'sejarah'],
        'museum' => ['museum', 'sejarah'], 'kampung' => ['kampung', 'budaya'],
        'snorkeling' => ['snorkeling'], 'hiu' => ['hiu'], 'waterfall' => ['air terjun'],
        'checkpost' => ['pos', 'hutan'], 'batu jin' => ['legenda'],
    ];

    public function run(): void
    {
        $catIds = Category::whereIn('slug', ['pegunungan', 'laut', 'buatan'])->pluck('id', 'slug');

        foreach ($this->data() as $area => $sections) {
            foreach ($sections as $section => $places) {
                [$table, $catSlug, $label, $baseTags] = self::SECTION_MAP[$section];
                foreach ($places as [$name, $address, $jarak]) {
                    $this->seedPlace($table, $catIds[$catSlug] ?? null, $area, $label, $baseTags, $name, $address, $jarak);
                }
            }
        }
    }

    private function seedPlace(
        string $table,
        ?int $categoryId,
        string $area,
        string $label,
        array $baseTags,
        string $name,
        string $address,
        string $jarak,
    ): void {
        $slug = Str::slug($name);
        $model = $table === 'budayas' ? Budaya::class : Destinasi::class;
        $tags = implode(',', $this->tagsFor($baseTags, $name));

        $existing = $model::where('slug', $slug)->first();
        if ($existing) {
            // Self-healing: lengkapi area/tags yang masih kosong, jangan timpa editan admin
            $heal = [];
            if ($existing->area === null) {
                $heal['area'] = $area;
            }
            if ($existing->tags === null) {
                $heal['tags'] = $tags;
            }
            if ($heal) {
                $existing->update($heal);
            }

            return; // jangan timpa data existing/admin
        }

        $body = "{$name} adalah destinasi wisata {$label} di {$address}, {$area}, sekitar {$jarak} dari Pusat Kota Gorontalo.";

        $data = [
            'name' => $name,
            'slug' => $slug,
            'body' => $body,
            'image' => null,
            'alt' => $name,
            'latitude' => null,
            'longitude' => null,
            'tags' => $tags,
            'is_active' => true,
        ];

        if ($table === 'destinasis') {
            $data['category'] = 'destinasi';
            $data['category_id'] = $categoryId;
            $data['location'] = $address;
            $data['area'] = $area;
        } else {
            $data['area'] = $area;
        }

        $model::create($data);
    }

    private function tagsFor(array $baseTags, string $name): array
    {
        $tags = $baseTags;
        $low = strtolower($name);
        foreach (self::NAME_TAGS as $needle => $extra) {
            if (str_contains($low, $needle)) {
                array_push($tags, ...$extra);
            }
        }

        return array_values(array_unique($tags));
    }

    private function data(): array
    {
        return [
            'Kota Gorontalo' => [
                'Bahari' => [
                    ['Pantai Indah Pohe', 'Pohe, Kec. Hulontalangi', '4,1 KM'],
                    ['Tangga Dua Ribu', 'Pohe, Kec. Hulontalangi', '2,9 KM'],
                    ['Pantai Tamendao', 'Leato Utara, Kec. Kota Timur', '4,4 KM'],
                    ['Pantai Blue Marlin', 'Leato Selatan, Kec. Dumbo Raya', '5,1 KM'],
                ],
                'Buatan' => [
                    ['Pemandian Bak Potanga', 'Pilolodaa, Kec. Kota Barat', '4,7 KM'],
                    ['Kolam Lahilote', 'Limba U Dua', '3,1 KM'],
                ],
                'Budaya' => [
                    ['Rumah Adat Dulohupa', 'Limba U Dua', '4,6 KM'],
                    ['Masjid Hunto Sultan Amai', 'Biau', '850 M'],
                    ['Masjid Agung Baiturrahim', 'Limba B, Kec. Kota Selatan', '800 M'],
                ],
                'Sejarah' => [
                    ['Benteng Otanaha', 'Dembe I, Kec. Kota Barat', '9,2 KM'],
                    ["Makam Keramat Haji Bu'ulu", 'Limba B, Kec. Kota Selatan', '4,1 KM'],
                    ["Makam Keramat Aulia Male Ta'ilayabe", 'Dumbo Raya', '2,8 KM'],
                    ['Makam Keramat Pulubunga', 'Kramat, Kec. Hulontalangi', '6,6 KM'],
                ],
            ],
            'Kab. Gorontalo' => [
                'Bahari' => [
                    ['Pantai Biluhu', 'Biluhu Timur, Kec. Batudaa Pantai', '23 KM'],
                    ["Pantai Taula'a", "Taula'a, Bilato", '65 KM'],
                    ['Pantai Karang Putih', 'Lamu, Kec. Batudaa Pantai', '31 KM'],
                    ['Pantai Dulanga', 'Bongo, Kec. Batudaa Pantai', '9,1 KM'],
                    ['Pantai Tilalohe', 'Biluhu, Kec. Batudaa Pantai', '25 KM'],
                ],
                'Alam' => [
                    ['Danau Limboto', 'Kab. Gorontalo', '20 KM'],
                    ['Goa Ular', 'Botu Bolu’o', '43 KM'],
                    ['Hutan Pinus Motilango', 'Motilango, Kec. Tibawa', '52 KM'],
                    ['Hutan Pinus Dulamayo', 'Dulamayo Selatan, Kec. Telaga', '28 KM'],
                ],
                'Buatan' => [
                    ['Pakaya Tower', 'Kayubulan, Kec. Limboto', '16 KM'],
                    ['Pentadio Resort', 'Pentadio Barat, Kec. Telaga Biru', '13 KM'],
                    ['Bukit Proja', 'Pone, Kec. Limboto Barat', '19 KM'],
                ],
                'Budaya' => [
                    ['Rumah Adat Bantayo Poboide', 'Kayubulan, Kec. Limboto', '16 KM'],
                    ['Wisata Religi Bubohu', 'Bongo, Kec. Batudaa Pantai', '8,3 KM'],
                    ['Masjid Walima Emas', 'Bongo, Kec. Batudaa Pantai', '9,9 KM'],
                    ['Kawasan Integrasi Budaya Limboto', 'Kayubulan, Kec. Limboto', '16 KM'],
                ],
                'Sejarah' => [
                    ['Museum Pendaratan Soekarno', 'Iluta, Kec. Batudaa', '9,2 KM'],
                    ['Makam Aulia Raja Ilato', 'Iluta, Kec. Batudaa', '9,1 KM'],
                    ['Makam Aulia Jupanggola Kubah', 'Iluta, Kec. Batudaa', '9,2 KM'],
                ],
            ],
            'Boalemo' => [
                'Bahari' => [
                    ['Pantai Limbatihu', 'Kec. Paguyaman Pantai', '94 KM'],
                    ['Pulau Cinta Eco Resort', 'Pata’o Meme, Kec. Botumoito', '115 KM'],
                    ['Pantai Bolihutuo', 'Bolihutuo, Kec. Botumoito', '125 KM'],
                    ['Teluk Buba', 'Kec. Paguyaman Pantai', '92 KM'],
                    ['Pantai Panjang Olibu’u', 'Kec. Paguyaman Pantai', '97 KM'],
                    ['Pulau Mohupombo Kiki', 'Bajo, Kec. Tilamuta', '106 KM'],
                    ['Pulau Mohupombo Da’a', 'Bajo, Kec. Tilamuta', '106 KM'],
                    ['Pulau Mantuli', 'Tapada’a, Kec. Botumoito', '121 KM'],
                    ['Lito Asingi', 'Bajo, Kec. Tilamuta', '106 KM'],
                    ['Pantai Langgala', 'Tabongo, Kec. Dulupi', '99 KM'],
                    ['Pantai Batu Buaya', 'Keramat, Kec. Mananggu', '133 KM'],
                ],
                'Alam' => [
                    ['Air Terjun Ayu Hulalo', 'Kec. Tilamuta', '110 KM'],
                    ['Air Terjun Tinelo', 'Kec. Dulupi', '100 KM'],
                    ['Air Panas Bongo Ayu', 'Diloniyohu, Kec. Bolihutuo', '70 KM'],
                    ['Nantu Forest Checkpost', 'Kec. Wonosari', '119 KM'],
                ],
                'Budaya' => [
                    ['Desa Wisata Rukun Bongo Dua Wonosari', 'Kec. Wonosari', '93 KM'],
                    ['Wisata Kampung Bajo', 'Bajo, Kec. Tilamuta', '106 KM'],
                ],
            ],
            'Pohuwato' => [
                'Bahari' => [
                    ['Pantai Libuo', 'Libuo, Kec. Paguat', '151 KM'],
                    ['Pantai Pohon Cinta', 'Pohuwato Timur, Kec. Marisa', '167 KM'],
                    ['Pantai Lalape', 'Trikora, Popayato', '241 KM'],
                    ['Pulau Lahe', 'Pohuwato Timur, Kec. Marisa', '169 KM'],
                ],
                'Alam' => [
                    ['Embung Iloheluma', 'Dudepo, Kec. Patilanggio', '185 KM'],
                    ['Danau Burungi Moputio', 'Telaga Biru, Popayato', '240 KM'],
                    ['Air Terjun Lomuli', 'Lomilo, Kec. Lemito', '228 KM'],
                    ['Air Terjun Wanggarasi', 'Yipilo, Kec. Wanggarasi', '211 KM'],
                    ['Cagar Alam Panua', 'Maleo, Kec. Paguat', '159 KM'],
                ],
                'Buatan' => [
                    ['Wisata Dengilo', 'Kec. Pohuwato', '154 KM'],
                    ['Wisata Taluduyunu', 'Taluduyunu, Kec. Buntulia', '169 KM'],
                ],
                'Budaya' => [
                    ['Desa Wisata Torosiaje', 'Torosiaje', '245 KM'],
                    ['Masjid Keramat Wonggarasi', 'Wonggarasi', '202 KM'],
                ],
            ],
            'Bone Bolango' => [
                'Bahari' => [
                    ['Taman Laut Olele', 'Olele, Kec. Kabila Bone', '26 KM'],
                    ['Wisata Hiu Paus', 'Botubarani, Kec. Kabila Bone', '9,8 KM'],
                    ['Pantai Uabanga', 'Kec. Bone Pantai', '39 KM'],
                    ['Tanjung Karang', 'Oluhuta, Kec. Kabila Bone', '20 KM'],
                    ['Pantai Kurenai', 'Botubarani, Kec. Kabila Bone', '10 KM'],
                ],
                'Alam' => [
                    ['Air Terjun Huila', 'Taludaa, Kec. Bone', '76 KM'],
                    ['Pantai Botutonuo', 'Botutonuo, Kec. Kabila', '15 KM'],
                    ['Lombongo Waterfall', 'Tapadaa', '10 KM'],
                    ['Danau Perintis', 'Huluduotamo', '5,8 KM'],
                    ['River Tubing Longalo', 'Longalo, Kec. Bulango Utara', '24 KM'],
                    ['Pemandian Air Panas Lombongo', 'Lombongo', '9,5 KM'],
                ],
                'Buatan' => [
                    ['Rumah Alam Dunggala', 'Dunggala, Kec. Tapa', '11 KM'],
                ],
            ],
            'Gorontalo Utara' => [
                'Bahari' => [
                    ['Pulau Saronde', 'Moluo, Kec. Kwandang', '47 KM'],
                    ['Pantai Minanga', 'Atinggola', '100 KM'],
                    ['Pantai Monano', 'Monas, Kec. Anggrek', '79 KM'],
                    ['Pantai Milango', 'Molonggota, Kec. Gentuma Raya', '90 KM'],
                    ['Pulau Raja', 'Dunu, Kec. Anggrek', '68 KM'],
                    ['Lito Popaya', 'Deme I, Kec. Sumalata', '70 KM'],
                    ['Pantai Motihelumo', 'Dulukupa, Kec. Sumalata', '105 KM'],
                    ['Pantai Tolinggula', 'Tolinggula Pantai, Kec. Tolinggula', '172 KM'],
                    ['Pulau Mohinggito', 'Moluo, Kec. Kwandang', '46 KM'],
                    ['Oile Resort', 'Tanjung Kramat, Kec. Kwandang', '47 KM'],
                    ['Pulau Lampu', 'Moluo, Kec. Kwandang', '50 KM'],
                    ['Pulau Diyonumo', 'Deme II, Kec. Sumalata', '79 KM'],
                    ['Pulau Doko Kayu', 'Kec. Gentuma Raya', '88 KM'],
                    ['Pulau Bohu', 'Tudi, Kec. Anggrek', '55 KM'],
                    ['Pulau Bogisa', 'Moluo, Kec. Kwandang', '49 KM'],
                    ['Botudidingga', 'Dambalo, Kec. Kwandang', '70 KM'],
                ],
                'Alam' => [
                    ['Arum Jeram Papualangi', 'Kec. Tolinggula', '198 KM'],
                ],
                'Sejarah' => [
                    ['Benteng Orange', 'Dambalo, Kec. Kwandang', '63 KM'],
                    ['Otalojin Batu Jin', 'Kota Jin, Kec. Atinggola', '100 KM'],
                ],
            ],
        ];
    }
}

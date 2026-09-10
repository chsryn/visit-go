import {
    MapPin,
    Wallet,
    Palmtree,
    Mountain,
    Landmark,
    Heart,
    Fish as FishIcon,
    Leaf,
    Coffee,
    Salad,
    ShoppingBag,
    PartyPopper,
    Compass,
    Gem as GemIcon,
    Palette,
    Accessibility,
    Baby,
    UtensilsCrossed,
    Home,
    Building2,
    Sparkles,
} from "lucide-react";

/** Opsi statis wizard AI travel (diekstrak dari AiTravelWizard agar mudah dirawat). */

export const destinasiList = [
    { value: "Gorontalo", label: "Gorontalo, Gorontalo", desc: "Provinsi Gorontalo", unggulan: true },
    { value: "Kota Gorontalo", label: "Kota Gorontalo", desc: "Pusat kota", unggulan: false },
    { value: "Bone Bolango", label: "Bone Bolango", desc: "Botubarani", unggulan: false },
    { value: "Boalemo", label: "Boalemo", desc: "Pulo Cinta", unggulan: false },
    { value: "Pohuwato", label: "Pohuwato", desc: "Pantai barat", unggulan: false },
    { value: "Gorontalo Utara", label: "Gorontalo Utara", desc: "Saronde", unggulan: false },
    { value: "Kab. Gorontalo", label: "Kab. Gorontalo", desc: "Limboto", unggulan: false },
];

export const destinasiUnggulan = destinasiList.filter(
    (d) => d.unggulan || ["Kota Gorontalo", "Bone Bolango", "Boalemo"].includes(d.value)
);

export const interests = [
    { value: "Pantai", label: "Pantai", icon: Palmtree },
    { value: "Warisan Budaya", label: "Warisan Budaya", icon: Landmark },
    { value: "Alam & Petualangan", label: "Alam & Petualangan", icon: Mountain },
    { value: "Kesehatan & Spa", label: "Kesehatan & Spa", icon: Heart },
    { value: "Kuliner", label: "Kuliner", icon: UtensilsCrossed },
    { value: "Tempat wisata", label: "Tempat wisata", icon: MapPin },
    { value: "Kuliner mewah", label: "Kuliner mewah", icon: GemIcon },
    { value: "Belanja", label: "Belanja", icon: ShoppingBag },
    { value: "Festival", label: "Festival", icon: PartyPopper },
    { value: "Tur Wisata", label: "Tur Wisata", icon: Compass },
    { value: "Hidden Gems", label: "Hidden Gems", icon: Sparkles },
    { value: "Seni & Budaya", label: "Seni & Budaya", icon: Palette },
    { value: "Akses Difabel", label: "Akses Difabel", icon: Accessibility },
    { value: "Ramah Anak", label: "Ramah Anak", icon: Baby },
];

export const foods = [
    { value: "Kuliner Khas Gorontalo", label: "Kuliner Khas Gorontalo", sub: "Milu siram", icon: UtensilsCrossed },
    { value: "Seafood Segar", label: "Seafood Segar", sub: "Ikan bakar", icon: FishIcon },
    { value: "Halal Food", label: "Halal Food", sub: "100% Halal", icon: Leaf },
    { value: "Western/Cafe", label: "Western / Cafe", sub: "Kopi & pastry", icon: Coffee },
    { value: "Vegan/Vegetarian", label: "Bebas Alergi", sub: "Vegan / Veg", icon: Salad },
    { value: "Tidak ada preferensi khusus", label: "Tidak ada preferensi", sub: "Bebas", icon: Leaf },
];

export const penginapanList = [
    { value: "Hotel & Resor", label: "Hotel & Resor", icon: Building2 },
    { value: "Villa", label: "Villa", icon: Home },
    { value: "Hemat", label: "Hemat", icon: Wallet },
];

export const steps = [
    { id: 1, title: "Destinasi", desc: "Di mana perjalananmu dimulai?" },
    { id: 2, title: "Tanggal", desc: "Kapan petualanganmu dimulai?" },
    { id: 3, title: "Minat & Preferensi", desc: "Ceritakan minatmu" },
];

export const MAX_INTERESTS = 5;
export const MAX_TRIP_DAYS = 30;

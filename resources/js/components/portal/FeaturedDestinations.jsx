import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

import heroWhale from "@/assets/hero-whale-shark.jpg";
import puloCinta from "@/assets/kategori-destinasi.jpg";
import olele from "@/assets/gorontalo.jpg";
import benteng from "@/assets/kategori-budaya.jpg";
import kerajinanFallbackImg from "@/assets/kategori-kerajinan.jpg";

const featured = [
    {
        title: "Botubarani Whale Shark",
        location: "Bone Bolango",
        category: "Wisata Bahari",
        href: "/destinasi/hiu-paus-botubarani",
        image: heroWhale,
        desc: "Berenang bersama hiu paus di pagi hari — pertemuan istimewa di Teluk Tomini.",
    },
    {
        title: "Pulo Cinta",
        location: "Boalemo",
        category: "Pulau",
        href: "/destinasi/pulo-cinta",
        image: puloCinta,
        desc: "Pulau berbentuk hati dengan lanskap laut yang tenang.",
    },
    {
        title: "Taman Laut Olele",
        location: "Bone Bolango",
        category: "Wisata Bahari",
        href: "/destinasi/taman-laut-olele",
        image: olele,
        desc: "Menyelami keindahan bawah laut Teluk Tomini.",
    },
    {
        title: "Benteng Otanaha",
        location: "Kota Gorontalo",
        category: "Sejarah",
        href: "/destinasi/benteng-otanaha",
        image: benteng,
        desc: "Jejak sejarah Gorontalo di atas bukit dengan panorama kota.",
    },
];

const kulinerFallback = [
    {
        name: "Binte Biluhuta",
        slug: "binte-biluhuta",
        body: "Sup jagung dengan ikan laut dan kelapa parut.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80&auto=format&fit=crop",
        location: "Kota Gorontalo",
    },
    {
        name: "Ilabulo",
        slug: "ilabulo",
        body: "Olahan sagu dan ayam berbumbu dalam balutan daun woka.",
        image: "https://images.unsplash.com/photo-1604908177223-81e7d553b33c?w=800&q=80&auto=format&fit=crop",
        location: "Kab. Gorontalo",
    },
    {
        name: "Tiliaya",
        slug: "tiliaya",
        body: "Olahan tradisional dengan cita rasa gurih dan hangat.",
        image: "https://images.unsplash.com/photo-1512621776952-a57141f2eefd?w=800&q=80&auto=format&fit=crop",
        location: "Bone Bolango",
    },
];

const kerajinanFallback = [
    {
        name: "Sulaman Karawo",
        slug: "sulaman-karawo",
        body: "Kain sulam khas Gorontalo dengan teknik tradisional.",
        image: kerajinanFallbackImg,
        location: "Kota Gorontalo",
    },
    {
        name: "Anyaman Rotan",
        slug: "anyaman-rotan",
        body: "Karya tangan perajin lokal dengan material alami.",
        image: kerajinanFallbackImg,
        location: "Kab. Gorontalo",
    },
];

function imgSrc(raw, fallback) {
    if (typeof raw === "string" && raw.trim() !== "") {
        if (
            raw.startsWith("/") ||
            raw.startsWith("http") ||
            raw.includes("/build/")
        ) {
            return raw;
        }

        if (raw.startsWith("uploads/")) {
            return `/storage/${raw}`;
        }

        return `/${raw}`;
    }

    return fallback;
}

export function FeaturedDestinations({
    kulinerSpotlight,
    kerajinanSpotlight,
}) {
    const kuliners =
        Array.isArray(kulinerSpotlight) && kulinerSpotlight.length > 0
            ? kulinerSpotlight.slice(0, 3).map((item, index) => ({
                  title: item.name,
                  location:
                      kulinerFallback[index]?.location ?? "Gorontalo",
                  href: `/kuliner/${item.slug}`,
                  image: imgSrc(
                      item.image,
                      kulinerFallback[index]?.image
                  ),
                  desc:
                      item.body ??
                      kulinerFallback[index]?.body ??
                      "",
              }))
            : kulinerFallback.map((item) => ({
                  title: item.name,
                  location: item.location,
                  href: `/kuliner/${item.slug}`,
                  image: item.image,
                  desc: item.body,
              }));

    const kerajinans =
        Array.isArray(kerajinanSpotlight) &&
        kerajinanSpotlight.length > 0
            ? kerajinanSpotlight.slice(0, 2).map((item, index) => ({
                  title: item.name,
                  location: "Gorontalo",
                  href: `/kerajinan/${item.slug}`,
                  image: imgSrc(
                      item.image,
                      kerajinanFallback[index]?.image
                  ),
                  desc:
                      item.body ??
                      kerajinanFallback[index]?.body ??
                      "",
              }))
            : kerajinanFallback.map((item) => ({
                  title: item.name,
                  location: item.location,
                  href: `/kerajinan/${item.slug}`,
                  image: item.image,
                  desc: item.body,
              }));

    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-20 md:py-24 lg:py-28">
            {/* subtle pattern */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, #715386 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                {/* =====================================================
                    HEADER
                ====================================================== */}
                <Reveal y={16}>
                    <div className="max-w-2Lxl">
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray">Wisata Gorontalo</span>
                        <h2 className="font-display text-[32px] font-bold leading-[1.04] tracking-tight text-foreground md:text-[42px]">
                            Tempat yang layak
                            <br />
                            <span className="font-normal italic text-ocean">kamu datangi.</span>
                        </h2>
                        <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.7] text-muted-foreground">
                            Dari laut dan pulau hingga jejak sejarah, temukan beberapa tempat yang mewakili wajah Gorontalo.
                        </p>
                    </div>
                </Reveal>

                {/* =====================================================
                    FEATURED DESTINATIONS
                ====================================================== */}
                <div className="mt-10 grid gap-4 lg:grid-cols-12">
                    {/* Main */}
                    <Link
                        href={featured[0].href}
                        className="group relative overflow-hidden rounded-[18px] lg:col-span-7"
                    >
                        <div className="relative min-h-107.5">
                            <img
                                src={featured[0].image}
                                alt={featured[0].title}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                                loading="lazy"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white/60">
                                    {featured[0].category}
                                </p>

                                <div className="flex items-end justify-between gap-5">
                                    <div>
                                        <h3 className="font-display text-[25px] font-semibold leading-tight text-white md:text-[30px]">
                                            {featured[0].title}
                                        </h3>

                                        <p className="mt-2 max-w-[46ch] text-sm leading-6 text-white/70">
                                            {featured[0].location} ·{" "}
                                            {featured[0].desc}
                                        </p>
                                    </div>

                                    <ArrowUpRight className="hidden size-4 shrink-0 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:block" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Supporting destinations */}
                    <div className="grid gap-4 lg:col-span-5">
                        {featured.slice(1, 3).map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="group relative overflow-hidden rounded-[18px]"
                            >
                                <div className="relative min-h-51.75">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                                        loading="lazy"
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

                                    <div className="absolute inset-x-0 bottom-0 p-5">
                                        <p className="text-[10px] uppercase tracking-widest text-white/55">
                                            {item.category}
                                        </p>

                                        <div className="mt-1 flex items-end justify-between gap-3">
                                            <div>
                                                <h3 className="font-display text-lg font-semibold leading-tight text-white">
                                                    {item.title}
                                                </h3>

                                                <p className="mt-1 text-xs text-white/65">
                                                    {item.location}
                                                </p>
                                            </div>

                                            <ArrowUpRight className="size-4 shrink-0 text-white/75 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Historical destination */}
                    <Link
                        href={featured[3].href}
                        className="group relative overflow-hidden rounded-[18px] lg:col-span-12"
                    >
                        <div className="relative min-h-52.5">
                            <img
                                src={featured[3].image}
                                alt={featured[3].title}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                                loading="lazy"
                            />

                            <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/30 to-transparent" />

                            <div className="absolute inset-y-0 left-0 flex max-w-2xl items-end p-6 md:p-7">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.12em] text-white/55">
                                        {featured[3].category}
                                    </p>

                                    <h3 className="mt-1 font-display text-2xl font-semibold text-white md:text-3xl">
                                        {featured[3].title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-white/70">
                                        {featured[3].location} ·{" "}
                                        {featured[3].desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* =====================================================
                    CULINARY
                ====================================================== */}
                <Reveal y={16}>
                    <div className="mt-20 max-w-2xl md:mt-24">
                        <h2 className="font-display text-[30px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[40px]">
                            Kuliner Gorontalo
                        </h2>

                        <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.7] text-muted-foreground">
                            Hidangan sederhana, bahan lokal, menjadikan rasa yang
                            melekat.
                        </p>
                    </div>
                </Reveal>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {kuliners.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="group"
                        >
                            <div className="relative overflow-hidden rounded-3xl">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                                    loading="lazy"
                                />
                            </div>

                            <div className="mt-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-display text-lg font-semibold text-foreground">
                                            {item.title}
                                        </h3>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {item.location}
                                        </p>
                                    </div>

                                    <ArrowUpRight className="mt-1 size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>

                                <p className="mt-2 max-w-[34ch] text-sm leading-6 text-muted-foreground">
                                    {item.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* =====================================================
                    CRAFT
                ====================================================== */}
                <Reveal y={16}>
                    <div className="mt-20 max-w-2xl md:mt-24">
                        <h2 className="font-display text-[30px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[40px]">
                            Karya Budaya Gorontalo
                        </h2>

                        <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.7] text-muted-foreground">
                            Warisan keterampilan yang diteruskan dari tangan
                            ke tangan.
                        </p>
                    </div>
                </Reveal>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                    {kerajinans.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="group grid grid-cols-[160px_1fr] gap-5 border-t border-border py-5"
                        >
                            <div className="overflow-hidden rounded-[14px]">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                                    loading="lazy"
                                />
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            {item.location}
                                        </p>

                                        <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>

                                <p className="mt-2 max-w-[38ch] text-sm leading-6 text-muted-foreground">
                                    {item.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { Head, router } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { DestinationCard } from "@/components/portal/DestinationCard";
import { Reveal } from "@/components/ui/Reveal";
import { resolveStorageUrl } from "@/lib/image";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { Sejarah } from "@/components/portal/Sejarah";
import { karawoBorder } from "@/lib/karawo";
import destinasiImage from "@/assets/kategori-destinasi.jpg";
import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";
import karawoImage from "@/assets/event-karawo.jpg";
import busanaAdatImg from "@/assets/busana-adat-gorontalo.jpg";
import patungPataniImg from "@/assets/patung-patani.jpg";
import motifKarawoImg from "@/assets/motif-karawo.jpg";
import menyulamKarawoImg from "@/assets/menyulam-karawo.webp";
import pantaiTaludaaImg from "@/assets/pantai-taludaa.jpg";
import bentengOtanahaImg from "@/assets/benteng-otanaha.jpg";
import pulauCintaImg from "@/assets/pulau-cinta.jpg";
import pulauDiyonumoImg from "@/assets/pulau-diyonumo.jpg";
import binteImg from "@/assets/binte.jpg";

const heroByCategory = {
    destinasi: {
        title: "Destinasi Wisata",
        desc: "Jelajahi keindahan alam Gorontalo — dari hiu paus Botubarani hingga lagun Pulo Cinta.",
        image: destinasiImage,
    },
    budaya: {
        title: "Budaya Gorontalo",
        desc: "Warisan Hulondalo: Tari Saronde, Tradisi Dikili, dan adat Pohutu Limo.",
        image: budayaImage,
    },
    kuliner: {
        title: "Kuliner Khas",
        desc: "Cita rasa pesisir: Milu Siram, Ilabulo, dan sambal Sagela.",
        image: kulinerImage,
    },
    kerajinan: {
        title: "Kerajinan Daerah",
        desc: "Mahakarya tangan: Sulaman Karawo dan anyaman rotan.",
        image: kerajinanImage,
    },
    event: {
        title: "Agenda Budaya",
        desc: "Perayaan yang akan datang — Karnaval Karawo, Tradisi Dikili, FESBUJATON.",
        image: karawoImage,
    },
};

const fallbackImg = {
    destinasi: destinasiImage,
    budaya: budayaImage,
    kuliner: kulinerImage,
    kerajinan: kerajinanImage,
    event: karawoImage,
};

// Image rotation helper - selects different fallback based on item ID/slug hash
const getRotatedFallback = (category, itemId) => {
    const fallbacks = {
        kuliner: [kulinerImage, binteImg],
        kerajinan: [kerajinanImage, motifKarawoImg],
        destinasi: [
            destinasiImage,
            pulauCintaImg,
            pulauDiyonumoImg,
            bentengOtanahaImg,
        ],
        budaya: [budayaImage, busanaAdatImg, patungPataniImg],
    };

    const categoryFallbacks = fallbacks[category] || [fallbackImg[category]];
    if (categoryFallbacks.length === 0) return fallbackImg[category];

    // Simple hash-based rotation using itemId
    const hash = String(itemId)
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return categoryFallbacks[hash % categoryFallbacks.length];
};

// kulinerCategories & activeKulinerCategory disuplai server (PortalController) — dinamis dari DB

function IntroBudaya() {
    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-8 md:py-12">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "240px 240px",
                }}
            />
            <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[55%_45%]">
                    <div className="order-2 lg:order-1">
                        <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                            <img
                                src={budayaImage}
                                alt="Warisan budaya Gorontalo"
                                className="aspect-[4/3] w-full rounded-xl object-cover"
                            />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={busanaAdatImg}
                                    alt="Busana adat"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={patungPataniImg}
                                    alt="Patung Patani"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={bentengOtanahaImg}
                                    alt="Benteng Otanaha"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <Reveal y={16} className="order-1 lg:order-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
                            Warisan Budaya Gorontalo
                        </span>
                        <h2 className="mt-3 font-display text-[34px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[44px]">
                            Adat yang
                            <br />
                            <span className="font-normal italic text-ocean">
                                masih hidup.
                            </span>
                        </h2>
                        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground">
                            Dari Pohutu Limo hingga Saronde dan Dikili — adat
                            Gorontalo dirawat sebagai ruang tamu: dipakai
                            sehari-hari, diwariskan, dan terus ditafsir ulang.
                            Jelajahi jejak sejarah, rasa, dan karya yang saling
                            terhubung.
                        </p>
                        <div className="mt-6 space-y-4 border-t border-border pt-6">
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Pohutu Limo
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    lima kerajaan yang menjadi falsafah
                                    persatuan Gorontalo
                                </span>
                            </div>
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Saronde & Dikili
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    tari penyambutan dan zikir semalam suntuk di
                                    masjid tua
                                </span>
                            </div>
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Karawo
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    sulaman iris-cabut benang bermotif flora
                                    pesisir
                                </span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

function BudayaNavCards() {
    const cards = [
        {
            title: "Sejarah & Peradaban",
            desc: "Jejak Hulontalangi, Pohala'a, hingga proklamasi Nani Wartabone.",
            image: budayaImage,
            href: "/budaya?sub=sejarah",
            cta: "Jelajahi Sejarah",
            location: "Kota Gorontalo",
        },
        {
            title: "Kuliner Khas",
            desc: "Cita rasa pesisir Teluk Tomini — Milu Siram, Ilabulo, dan Sagela.",
            image: kulinerImage,
            href: "/kuliner",
            cta: "Lihat Kuliner Khas",
            location: "Teluk Tomini",
        },
        {
            title: "Kerajinan & Kriya",
            desc: "Karawo, anyaman rotan, dan karya tangan Gorontalo.",
            image: kerajinanImage,
            href: "/kerajinan",
            cta: "Lihat Kerajinan Daerah",
            location: "Kampung Karawo",
        },
    ];
    return (
        <section className="bg-white py-8 lg:py-12">
            <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid gap-6 md:grid-cols-3">
                    {cards.map((c) => (
                        <a key={c.title} href={c.href} className="group">
                            <div className="relative overflow-hidden rounded-3xl">
                                <img
                                    src={c.image}
                                    alt={c.title}
                                    className="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                                    loading="lazy"
                                />
                            </div>
                            <div className="mt-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-display text-lg font-semibold text-foreground">
                                            {c.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {c.location}
                                        </p>
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-arrow-up-right mt-1 size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        aria-hidden="true"
                                    >
                                        <path d="M7 7h10v10"></path>
                                        <path d="M7 17 17 7"></path>
                                    </svg>
                                </div>
                                <p className="mt-2 max-w-[34ch] text-sm leading-6 text-muted-foreground">
                                    {c.desc}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                                    {c.cta} <span aria-hidden>→</span>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

function IntroKuliner() {
    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-8 md:py-12">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "240px 240px",
                }}
            />
            <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[55%_45%]">
                    <div className="order-2 lg:order-1">
                        <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                            <img
                                src={kulinerImage}
                                alt="Hidangan Gorontalo"
                                className="aspect-[4/3] w-full rounded-xl object-cover"
                            />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={binteImg}
                                    alt="Binthe Biluhuta"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={kulinerImage}
                                    alt="Ilabulo"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={binteImg}
                                    alt="Sambal Sagela"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <Reveal y={16} className="order-1 lg:order-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
                            Warisan Kuliner Gorontalo
                        </span>
                        <h2 className="mt-3 font-display text-[34px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[44px]">
                            Jagung, sagu,
                            <br />
                            <span className="font-normal italic text-ocean">
                                dan rempah asap.
                            </span>
                        </h2>
                        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground">
                            Dapur Gorontalo bertumpu pada hasil laut segar Teluk
                            Tomini dan jagung pulut lokal. Diolah tanpa santan
                            pekat, karakternya didominasi rasa gurih, asam segar
                            jeruk nipis, dan aroma asap yang kuat.
                        </p>

                        <div className="mt-6 space-y-4 border-t border-border pt-6">
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Binthe Biluhuta
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    Sup jagung pipil dengan suwiran cakalang,
                                    kelapa parut, kemangi, dan perasan jeruk
                                    nipis.
                                </span>
                            </div>
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Ilabulo
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    Adonan sagu berbumbu lada pedas berisi
                                    jeroan ayam, dibungkus daun woka lalu
                                    dibakar di atas bara.
                                </span>
                            </div>
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Sambal Sagela
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    Olahan ikan roa asap yang ditumbuk halus
                                    bersama cabai dan bawang hingga renyah serta
                                    gurih.
                                </span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

function IntroKerajinan() {
    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-8 md:py-12">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "240px 240px",
                }}
            />
            <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Gambar di Kiri */}
                    <div className="order-2 lg:order-1 grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img
                                    src={motifKarawoImg}
                                    alt="Motif Karawo"
                                    className="aspect-[4/3] w-full rounded-xl object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img
                                    src={kerajinanImage}
                                    alt="Anyaman"
                                    className="h-[120px] w-full rounded-xl object-cover"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img
                                    src={menyulamKarawoImg}
                                    alt="Menyulam Karawo"
                                    className="aspect-[4/3] w-full rounded-xl object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img
                                    src={busanaAdatImg}
                                    alt="Karawo pada busana"
                                    className="h-[120px] w-full rounded-xl object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Teks di Kanan */}
                    <Reveal y={16} className="order-1 lg:order-2">
                        <h2 className="font-display text-[30px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[38px]">
                            Satu lubang,
                            <br />
                            <span className="font-normal italic text-ocean">
                                satu benang.
                            </span>
                        </h2>
                        <p className="mt-4 w-full text-[15px] leading-relaxed text-muted-foreground">
                            Karawo dibuat dengan mengiris dan mencabut benang —
                            bukan menambah. Kekosongan itu yang diisi motif
                            flora. Seminggu untuk satu kain, seumur hidup untuk
                            satu tangan yang mahir.
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

function IntroDestinasi() {
    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-8 md:py-12">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "240px 240px",
                }}
            />
            <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="order-2 lg:order-1">
                        <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                            <img
                                src={pulauCintaImg}
                                alt="Pulo Cinta Gorontalo"
                                className="aspect-[4/3] w-full rounded-xl object-cover"
                            />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={bentengOtanahaImg}
                                    alt="Benteng Otanaha"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={pulauDiyonumoImg}
                                    alt="Pulau Diyonumo"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={pantaiTaludaaImg}
                                    alt="Pantai Taludaa"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <Reveal y={16} className="order-1 lg:order-2">
                        <h2 className="font-display text-[30px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[38px]">
                            Dari Teluk Tomini
                            <br />
                            <span className="font-normal italic text-ocean">
                                hingga benteng bersejarah.
                            </span>
                        </h2>
                        <p className="mt-4 w-full text-[15px] leading-relaxed text-muted-foreground">
                            Gorontalo menawarkan keindahan alam eksotis yang
                            masih perawan—mulai dari titik penyelaman kelas
                            dunia di Olele, interaksi dekat dengan Hiu Paus di
                            Botubarani, hingga lanskap peninggalan sejarah yang
                            megah.
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

export default function CategoryIndex({
    category,
    items,
    banner,
    activeSub,
    kulinerCategories = [],
    activeKulinerCategory = "semua",
    destinationCategories = [],
    activeDestinationCategory = "semua",
    kerajinanCategories = [],
    activeKerajinanCategory = "semua",
    kulinerItems = [],
    kerajinanItems = [],
    destinasiTerkait = [],
    galeriBudaya = [],
}) {
    const isSejarah = category === "budaya" && activeSub === "sejarah";
    const fallback = heroByCategory[category] ?? heroByCategory.destinasi;
    const hero = banner
        ? {
              title: banner.name ?? fallback.title,
              desc: banner.description ?? fallback.desc,
              image: banner.banner_image ?? fallback.image,
          }
        : fallback;
    const label = isSejarah ? "Sejarah Gorontalo" : hero.title;

    if (isSejarah) {
        return (
            <>
                <Head title="Sejarah Gorontalo — Dulohupa AI">
                    <meta
                        name="description"
                        content="Sejarah Gorontalo dari Hulontalo hingga Provinsi 2000 — Suwawa, Pohala'a, Benteng Otanaha, hingga proklamasi Nani Wartabone 23 Jan 1942."
                    />
                </Head>
                <div className="min-h-screen bg-background font-sans antialiased">
                    <Navbar />
                    <main className="min-h-screen h-auto overflow-visible">
                        <Sejarah items={items} category={category} />
                    </main>
                    <SiteFooter />
                    <AiAssistantButton />
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`${label} — Dulohupa AI`} />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main className="min-h-screen h-auto overflow-visible">
                    <div className="relative overflow-hidden bg-[#2A1E32] pt-28 pb-14">
                        {(() => {
                            const raw = hero.image;
                            const bgSrc = typeof raw === "string" ? raw : null;
                            const src =
                                bgSrc &&
                                (bgSrc.startsWith("/storage") ||
                                    bgSrc.startsWith("/build") ||
                                    bgSrc.startsWith("http") ||
                                    bgSrc.startsWith("data:"))
                                    ? bgSrc
                                    : typeof bgSrc === "string" &&
                                        bgSrc.startsWith("/")
                                      ? bgSrc
                                      : null;
                            const finalSrc =
                                src ??
                                (typeof hero.image === "string"
                                    ? hero.image
                                    : null);
                            return finalSrc ? (
                                <img
                                    src={finalSrc}
                                    alt=""
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.28] blur-[8px] scale-105"
                                />
                            ) : null;
                        })()}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-[#2A1E32]/80"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-[0.04]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: "240px 240px",
                            }}
                        />
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <h1 className="mt-6 max-w-2xl font-display text-[32px] font-bold leading-tight text-white md:text-[40px]">
                                {label}
                            </h1>
                            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-white/70">
                                {hero.desc}
                            </p>
                        </div>
                        <div
                            aria-hidden
                            className="h-[10px] w-full opacity-90 absolute inset-x-0 bottom-0 z-10"
                            style={{
                                backgroundImage: karawoBorder,
                                backgroundRepeat: "repeat-x",
                                backgroundSize: "120px 12px",
                            }}
                        />
                    </div>

                    {category === "budaya" && (
                        <>
                            <IntroBudaya />
                            <BudayaNavCards />
                        </>
                    )}
                    {category === "destinasi" && <IntroDestinasi />}
                    {category === "kuliner" && <IntroKuliner />}
                    {category === "kerajinan" && <IntroKerajinan />}

                    <section className="bg-[#FCFBFC] py-12 lg:py-16">
                        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                            {category === "kuliner" && (
                                <div className="mb-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                    <label
                                        htmlFor="kuliner-filter"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Pilih Kategori Kuliner:
                                    </label>
                                    <select
                                        id="kuliner-filter"
                                        value={activeKulinerCategory}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            router.get(
                                                "/kuliner",
                                                v === "semua"
                                                    ? {}
                                                    : { kuliner_category: v },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            );
                                        }}
                                        className="w-full sm:w-64 rounded-full border border-input bg-white px-4 py-2.5 text-sm font-medium shadow-xs outline-none focus-visible:border-ring"
                                    >
                                        <option value="semua">
                                            Semua UMKM Kuliner
                                        </option>
                                        {kulinerCategories.map((c) => (
                                            <option key={c.slug} value={c.slug}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {category === "destinasi" && (
                                <div className="mb-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                    <label
                                        htmlFor="destinasi-filter"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Pilih Kategori Destinasi:
                                    </label>
                                    <select
                                        id="destinasi-filter"
                                        value={activeDestinationCategory}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            router.get(
                                                "/destinasi",
                                                v === "semua"
                                                    ? {}
                                                    : { kategori: v },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            );
                                        }}
                                        className="w-full sm:w-64 rounded-full border border-input bg-white px-4 py-2.5 text-sm font-medium shadow-xs outline-none focus-visible:border-ring"
                                    >
                                        <option value="semua">
                                            Semua Destinasi Wisata
                                        </option>
                                        {destinationCategories.map((c) => (
                                            <option key={c.slug} value={c.slug}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {category === "kerajinan" && (
                                <div className="mb-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                                    <label
                                        htmlFor="kerajinan-filter"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Pilih Kategori Kerajinan:
                                    </label>
                                    <select
                                        id="kerajinan-filter"
                                        value={activeKerajinanCategory}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            router.get(
                                                "/kerajinan",
                                                v === "semua"
                                                    ? {}
                                                    : { kerajinan_category: v },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            );
                                        }}
                                        className="w-full sm:w-64 rounded-full border border-input bg-white px-4 py-2.5 text-sm font-medium shadow-xs outline-none focus-visible:border-ring"
                                    >
                                        <option value="semua">
                                            Semua Kerajinan
                                        </option>
                                        {kerajinanCategories.map((c) => (
                                            <option key={c.slug} value={c.slug}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {(() => {
                                const rawData = Array.isArray(items)
                                    ? items
                                    : (items?.data ?? []);
                                const paginator = Array.isArray(items)
                                    ? null
                                    : items;
                                const hasPagination =
                                    paginator && paginator.last_page > 1;
                                const isKulinerFiltered =
                                    category === "kuliner" &&
                                    activeKulinerCategory !== "semua";
                                const isDestinasiFiltered =
                                    category === "destinasi" &&
                                    activeDestinationCategory !== "semua";
                                const isKerajinanFiltered =
                                    category === "kerajinan" &&
                                    activeKerajinanCategory !== "semua";
                                const data = rawData;
                                if (!rawData.length) {
                                    if (isKulinerFiltered) {
                                        return (
                                            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                                                <p className="text-sm text-muted-foreground">
                                                    Kuliner tidak ditemukan
                                                </p>
                                            </div>
                                        );
                                    }
                                    if (isDestinasiFiltered) {
                                        return (
                                            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                                                <p className="text-sm text-muted-foreground">
                                                    Destinasi tidak ditemukan
                                                </p>
                                            </div>
                                        );
                                    }
                                    if (isKerajinanFiltered) {
                                        return (
                                            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                                                <p className="text-sm text-muted-foreground">
                                                    Kerajinan tidak ditemukan
                                                </p>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                                            <p className="text-sm text-muted-foreground">
                                                Belum ada objek di kategori ini
                                                — tambah via admin.
                                            </p>
                                        </div>
                                    );
                                }
                                return (
                                    <>
                                        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
                                            {data.map((it) => {
                                                const src = resolveStorageUrl(
                                                    it.image,
                                                );
                                                const img =
                                                    src ??
                                                    getRotatedFallback(
                                                        category,
                                                        it.id,
                                                    ) ??
                                                    destinasiImage;
                                                const kulinerBadges =
                                                    it.kuliner_categories ??
                                                    it.kulinerCategories ??
                                                    [];
                                                const kerajinanBadges =
                                                    it.kerajinan_categories ??
                                                    it.kerajinanCategories ??
                                                    [];
                                                const destinasiBadge =
                                                    it.destination_category ??
                                                    it.destinationCategory ??
                                                    null;
                                                const budayaBadges = (() => {
                                                    if (category !== "budaya")
                                                        return [];
                                                    const out = [];
                                                    if (it.area)
                                                        out.push({
                                                            name: it.area,
                                                            slug: it.area,
                                                        });
                                                    if (it.tags) {
                                                        const tags = String(
                                                            it.tags,
                                                        )
                                                            .split(",")
                                                            .map((t) =>
                                                                t.trim(),
                                                            )
                                                            .filter(Boolean)
                                                            .slice(0, 2);
                                                        tags.forEach((t) =>
                                                            out.push({
                                                                name: t,
                                                                slug: t,
                                                            }),
                                                        );
                                                    }
                                                    return out;
                                                })();
                                                const badges =
                                                    category === "kuliner"
                                                        ? kulinerBadges
                                                        : category ===
                                                            "kerajinan"
                                                          ? kerajinanBadges
                                                          : category ===
                                                                  "destinasi" &&
                                                              destinasiBadge
                                                            ? [destinasiBadge]
                                                            : category ===
                                                                "budaya"
                                                              ? budayaBadges
                                                              : [];
                                                return (
                                                    <div
                                                        key={it.slug}
                                                        className="transition-all duration-300"
                                                    >
                                                        <DestinationCard
                                                            href={`/${category}/${it.slug}`}
                                                            image={img}
                                                            title={it.name}
                                                            category={category}
                                                            description={it.body?.slice(
                                                                0,
                                                                180,
                                                            )}
                                                            badges={badges}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {hasPagination &&
                                            !isKulinerFiltered &&
                                            !isDestinasiFiltered &&
                                            !isKerajinanFiltered && (
                                                <Pagination className="mt-14">
                                                    <PaginationContent>
                                                        {paginator.links?.map(
                                                            (link, idx) => {
                                                                const isPrev =
                                                                    idx === 0;
                                                                const isNext =
                                                                    idx ===
                                                                    paginator
                                                                        .links
                                                                        .length -
                                                                        1;
                                                                const label =
                                                                    link.label
                                                                        .replace(
                                                                            /&laquo;|&raquo;/g,
                                                                            "",
                                                                        )
                                                                        .trim();
                                                                const isEllipsis =
                                                                    label ===
                                                                    "...";
                                                                if (
                                                                    isEllipsis
                                                                ) {
                                                                    return (
                                                                        <PaginationItem
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            <PaginationEllipsis />
                                                                        </PaginationItem>
                                                                    );
                                                                }
                                                                if (isPrev) {
                                                                    return (
                                                                        <PaginationItem
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            <PaginationPrevious
                                                                                href={
                                                                                    link.url ??
                                                                                    "#"
                                                                                }
                                                                                className={
                                                                                    !link.url
                                                                                        ? "pointer-events-none opacity-50"
                                                                                        : ""
                                                                                }
                                                                            />
                                                                        </PaginationItem>
                                                                    );
                                                                }
                                                                if (isNext) {
                                                                    return (
                                                                        <PaginationItem
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            <PaginationNext
                                                                                href={
                                                                                    link.url ??
                                                                                    "#"
                                                                                }
                                                                                className={
                                                                                    !link.url
                                                                                        ? "pointer-events-none opacity-50"
                                                                                        : ""
                                                                                }
                                                                            />
                                                                        </PaginationItem>
                                                                    );
                                                                }
                                                                return (
                                                                    <PaginationItem
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        <PaginationLink
                                                                            href={
                                                                                link.url ??
                                                                                "#"
                                                                            }
                                                                            isActive={
                                                                                link.active
                                                                            }
                                                                            className={
                                                                                link.active
                                                                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                                                    : ""
                                                                            }
                                                                        >
                                                                            {
                                                                                label
                                                                            }
                                                                        </PaginationLink>
                                                                    </PaginationItem>
                                                                );
                                                            },
                                                        )}
                                                    </PaginationContent>
                                                </Pagination>
                                            )}
                                    </>
                                );
                            })()}
                        </div>
                    </section>
                    {category === "budaya" && activeSub !== "sejarah" && (
                        <>
                            {/* Section C — Destinasi Cagar Budaya Terkait */}
                            <section className="bg-[#FCFBFC] py-12 lg:py-16">
                                <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                                    <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
                                        <div>
                                            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
                                                Jejak Ruang
                                            </span>
                                            <h2 className="mt-2 font-display text-[26px] font-bold text-foreground md:text-[32px]">
                                                Destinasi Cagar Budaya Terkait
                                            </h2>
                                        </div>
                                        <p className="max-w-[40ch] text-sm text-muted-foreground">
                                            Benteng, masjid tua, dan kampung
                                            adat yang menjadi panggung hidup
                                            tradisi.
                                        </p>
                                    </div>
                                    {destinasiTerkait.length ? (
                                        <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
                                            {destinasiTerkait.map((it) => {
                                                const src = resolveStorageUrl(
                                                    it.image,
                                                );
                                                const img =
                                                    src ??
                                                    fallbackImg.destinasi;
                                                const badge =
                                                    it.destination_category
                                                        ? [
                                                              it.destination_category,
                                                          ]
                                                        : [];
                                                return (
                                                    <div
                                                        key={`des-${it.slug}`}
                                                        className="transition-all duration-300"
                                                    >
                                                        <DestinationCard
                                                            href={`/destinasi/${it.slug}`}
                                                            image={img}
                                                            title={it.name}
                                                            category="destinasi"
                                                            description={it.body?.slice(
                                                                0,
                                                                110,
                                                            )}
                                                            badges={badge}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed bg-white p-12 text-center text-sm text-muted-foreground">
                                            Belum ada destinasi cagar budaya.
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Section D — Galeri Visual Budaya */}
                            <section className="bg-white py-12 lg:py-16">
                                <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                                    <div className="mb-8 text-center">
                                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
                                            Arsip Visual
                                        </span>
                                        <h2 className="mt-2 font-display text-[26px] font-bold text-foreground md:text-[32px]">
                                            Galeri Budaya
                                        </h2>
                                        <p className="mx-auto mt-2 max-w-[60ch] text-sm text-muted-foreground">
                                            Dokumentasi tenun, upacara, dan
                                            lanskap budaya dari berbagai sudut
                                            Gorontalo.
                                        </p>
                                    </div>
                                    {galeriBudaya.length ? (
                                        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                                            {galeriBudaya.map((g) => {
                                                const src =
                                                    g.image_url ??
                                                    resolveStorageUrl(g.image);
                                                if (!src) return null;
                                                return (
                                                    <div
                                                        key={
                                                            g.id ??
                                                            g.slug ??
                                                            g.name
                                                        }
                                                        className="mb-4 break-inside-avoid overflow-hidden rounded-xl bg-white shadow-sm"
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={
                                                                g.alt ?? g.name
                                                            }
                                                            className="w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                        {g.name && (
                                                            <p className="px-3 py-2 text-xs font-medium text-foreground">
                                                                {g.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                                            Belum ada galeri budaya.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </main>
                <SiteFooter />
                <AiAssistantButton />
            </div>
        </>
    );
}

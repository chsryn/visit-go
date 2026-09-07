import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { ArrowLeft, MapPin } from "lucide-react";
import destinasiImage from "@/assets/kategori-destinasi.jpg";
import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";
import karawoImage from "@/assets/event-karawo.jpg";

const heroByCategory = {
    destinasi: { title: "Destinasi Wisata", desc: "Jelajahi keindahan alam Gorontalo — dari hiu paus Botubarani hingga lagun Pulo Cinta.", image: destinasiImage },
    budaya: { title: "Budaya Gorontalo", desc: "Warisan Hulondalo: Tari Saronde, Tradisi Dikili, dan adat Pohutu Limo.", image: budayaImage },
    kuliner: { title: "Kuliner Khas", desc: "Cita rasa pesisir: Milu Siram, Ilabulo, dan sambal Sagela.", image: kulinerImage },
    kerajinan: { title: "Kerajinan Daerah", desc: "Mahakarya tangan: Sulaman Karawo dan anyaman rotan.", image: kerajinanImage },
    event: { title: "Agenda Budaya", desc: "Perayaan yang akan datang — Karnaval Karawo, Tradisi Dikili, FESBUJATON.", image: karawoImage },
};

const fallbackImg = {
    destinasi: destinasiImage,
    budaya: budayaImage,
    kuliner: kulinerImage,
    kerajinan: kerajinanImage,
    event: karawoImage,
};

export default function CategoryIndex({ category, items, banner }) {
    const fallback = heroByCategory[category] ?? heroByCategory.destinasi;
    const hero = banner
        ? { title: banner.name ?? fallback.title, desc: banner.description ?? fallback.desc, image: banner.banner_image ?? fallback.image }
        : fallback;
    const bannerSrc = typeof hero.image === "string" ? hero.image : null;
    const isBannerStorage = bannerSrc && (bannerSrc.startsWith("/storage") || bannerSrc.startsWith("/build") || bannerSrc.startsWith("http"));
    const label = hero.title;

    return (
        <>
            <Head title={`${label} — Visit Gorontalo`} />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    {/* Header transparan seperti hero — banner_image dari DB jika ada */}
                    <div className="relative overflow-hidden bg-black pt-28 pb-12">
                        {isBannerStorage ? (
                            <img src={bannerSrc} alt={banner?.banner_alt ?? label} className="absolute inset-0 size-full object-cover" />
                        ) : null}
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-black/70 to-transparent" />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-[0.05]"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='white' stroke-width='0.6' opacity='0.7'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3Cpath d='M18 60 L30 50 L42 60 L30 70 Z'/%3E%3Cpath d='M78 60 L90 50 L102 60 L90 70 Z'/%3E%3Ccircle cx='60' cy='30' r='1.8' fill='white' stroke='none' opacity='0.6'/%3E%3Ccircle cx='60' cy='54' r='1.8' fill='white' stroke='none' opacity='0.6'/%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: "240px 240px",
                            }}
                        />
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            <Link href="/#kategori" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20">
                                <ArrowLeft className="size-3.5" /> Kembali
                            </Link>
                            <h1 className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl">{label}</h1>
                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">{hero.desc}</p>
                            {banner && <p className="mt-2 text-xs text-white/60">Banner: {banner.banner_image} — ganti via DB categories</p>}
                        </div>
                    </div>

                    {/* Grid sub-kategori — putih, motif halus */}
                    <section className="relative overflow-hidden bg-background py-[30px] md:py-[50px]">
                        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.7'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3Cpath d='M18 60 L30 50 L42 60 L30 70 Z'/%3E%3Cpath d='M78 60 L90 50 L102 60 L90 70 Z'/%3E%3Ccircle cx='60' cy='30' r='1.8' fill='%23715386' stroke='none' opacity='0.6'/%3E%3Ccircle cx='60' cy='54' r='1.8' fill='%23715386' stroke='none' opacity='0.6'/%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: "240px 240px",
                        }} />
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            {items?.length ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {items.map((it) => {
                                        const raw = it.image;
                                        const src = typeof raw === "string" && raw.trim() !== "" ? (raw.startsWith("/") || raw.startsWith("http") || raw.includes("/build/") ? raw : `/${raw}`) : null;
                                        const img = src ?? fallbackImg[category] ?? destinasiImage;
                                        return (
                                            <Link key={it.slug} href={`/${category}/${it.slug}`} className="group relative block overflow-hidden rounded-[15px] bg-white p-[10px] shadow-soft border border-[#715386]/8 hover:shadow-card hover:-translate-y-1 transition-all">
                                                <div className="overflow-hidden rounded-xl h-56">
                                                    <img src={img} alt={it.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-display text-lg leading-tight text-foreground">{it.name}</h3>
                                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3" />{it.location ?? it.category}{it.date ? ` · ${it.date} ${it.month ?? ""}` : ""}</p>
                                                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{it.body?.slice(0, 110)}</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[#715386]/20 bg-[#715386]/[0.03] p-12 text-center">
                                    <p className="text-sm text-muted-foreground">Belum ada objek di kategori ini — tambah via admin.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
                <SiteFooter />
                <AiAssistantButton />
            </div>
        </>
    );
}

import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { DestinationCard } from "@/components/portal/DestinationCard";
import { resolveStorageUrl } from "@/lib/image";
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
                    <div className="relative overflow-hidden bg-warm pt-28 pb-14">
                        {(() => {
                            const raw = hero.image;
                            const bgSrc = typeof raw === "string" ? raw : null;
                            const src = bgSrc && (bgSrc.startsWith("/storage") || bgSrc.startsWith("/build") || bgSrc.startsWith("http") || bgSrc.startsWith("data:")) ? bgSrc : (typeof bgSrc === "string" && bgSrc.startsWith("/") ? bgSrc : null);
                            const finalSrc = src ?? (typeof hero.image === "string" ? hero.image : null);
                            return finalSrc ? <img src={finalSrc} alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.28] blur-[8px] scale-105" /> : null;
                        })()}
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-warm/75" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "240px 240px" }} />
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <h1 className="mt-6 max-w-2xl font-display text-[32px] font-bold leading-tight text-foreground md:text-[40px]">{label}</h1>
                            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">{hero.desc}</p>
                        </div>
                    </div>

                    <section className="bg-warm py-16 lg:py-20">
                        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                            {items?.length ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {items.map((it) => {
                                        const src = resolveStorageUrl(it.image);
                                        const img = src ?? fallbackImg[category] ?? destinasiImage;
                                        return (
                                            <DestinationCard
                                                key={it.slug}
                                                href={`/${category}/${it.slug}`}
                                                image={img}
                                                title={it.name}
                                                location={it.location ?? it.category}
                                                category={category}
                                                description={it.body?.slice(0, 110)}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
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

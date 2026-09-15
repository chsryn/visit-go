import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { PageBreadcrumb } from "@/components/portal/PageBreadcrumb";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { DestinationCard } from "@/components/portal/DestinationCard";
import { resolveStorageUrl } from "@/lib/image";
import { Sejarah } from "@/components/portal/Sejarah";
import { CategoryFilter } from "./shared/CategoryFilter";
import { ItemGrid } from "./shared/ItemGrid";
import { Lightbox } from "@/components/portal/Lightbox";
import { karawoBorder, karawoPattern } from "@/lib/karawo";
import { heroByCategory, fallbackImg, heroSvgPattern } from "./data";
import { IntroBudaya } from "./Budaya/IntroBudaya";
import { BudayaNavCards } from "./Budaya/BudayaNavCards";
import { IntroKuliner } from "./Kuliner/IntroKuliner";
import { IntroKerajinan } from "./Kerajinan/IntroKerajinan";
import { IntroDestinasi } from "./Destinasi/IntroDestinasi";

const toTitleCase = (str) =>
    str
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

export default function CategoryIndex({
    category = "destinasi",
    items = [],
    banner = null,
    kulinerCategories = [],
    activeKulinerCategory = "semua",
    destinationCategories = [],
    activeDestinationCategory = "semua",
    kerajinanCategories = [],
    activeKerajinanCategory = "semua",
    destinasiTerkait = [],
    galeriBudaya = [],
    activeSub = null,
}) {
    const fallback = heroByCategory[category] ?? heroByCategory.destinasi;
    const isSejarah = category === "budaya" && activeSub === "sejarah";
    const hero = banner
        ? {
              title: banner.name ?? fallback.title,
              image: banner.banner_image ?? fallback.image,
          }
        : fallback;
    const activeDestCat =
        category === "destinasi"
            ? destinationCategories.find(
                  (c) => c.slug === activeDestinationCategory,
              )
            : null;
    const label = isSejarah
        ? "Sejarah Gorontalo"
        : activeDestCat
          ? `${toTitleCase(activeDestCat.name)} Gorontalo`
          : `${hero.title}${["destinasi", "kuliner", "kerajinan"].includes(category) ? " Gorontalo" : ""}`;

    const [lightbox, setLightbox] = useState(null);
    useEffect(() => {
        if (lightbox === null) return;
        const onKey = (e) => {
            if (e.key === "Escape") setLightbox(null);
            if (e.key === "ArrowLeft")
                setLightbox(
                    (i) => (i - 1 + galeriBudaya.length) % galeriBudaya.length,
                );
            if (e.key === "ArrowRight")
                setLightbox((i) => (i + 1) % galeriBudaya.length);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, galeriBudaya.length]);
    const go = (dir) =>
        setLightbox(
            (i) => (i + dir + galeriBudaya.length) % galeriBudaya.length,
        );

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
                    {/* ─── Hero ─── */}
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
                                backgroundImage: heroSvgPattern,
                                backgroundSize: "240px 240px",
                            }}
                        />
                        {category === "budaya" && (
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay"
                                style={{
                                    backgroundImage: karawoPattern,
                                    backgroundRepeat: "repeat",
                                    backgroundSize: "240px 240px",
                                }}
                            />
                        )}
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <PageBreadcrumb items={[{ label }]} />
                            <h1 className="mt-6 max-w-2xl font-display text-[32px] font-bold leading-tight text-white md:text-[40px]">
                                {label}
                            </h1>
                        </div>
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"
                        />
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

                    {/* ─── Intro sections ─── */}
                    {category === "budaya" && (
                        <>
                            <IntroBudaya />
                            <BudayaNavCards />
                        </>
                    )}
                    {category === "destinasi" && (
                        <IntroDestinasi active={activeDestinationCategory} />
                    )}
                    {category === "kuliner" && <IntroKuliner />}
                    {category === "kerajinan" && <IntroKerajinan />}

                    {/* ─── Filters + Grid ─── */}
                    <section className="bg-[#FCFBFC] py-12 lg:py-16">
                        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                            {category === "kuliner" && (
                                <CategoryFilter
                                    id="kuliner-filter"
                                    label="Pilih Kategori Kuliner"
                                    value={activeKulinerCategory}
                                    route="/kuliner"
                                    param="kuliner_category"
                                    emptyOption="Semua UMKM Kuliner"
                                    categories={kulinerCategories}
                                />
                            )}
                            {category === "destinasi" && (
                                <CategoryFilter
                                    id="destinasi-filter"
                                    label="Pilih Kategori Destinasi"
                                    value={activeDestinationCategory}
                                    route="/destinasi"
                                    param="kategori"
                                    emptyOption="Semua Destinasi Wisata"
                                    categories={destinationCategories}
                                />
                            )}
                            {category === "kerajinan" && (
                                <CategoryFilter
                                    id="kerajinan-filter"
                                    label="Pilih Kategori Kerajinan"
                                    value={activeKerajinanCategory}
                                    route="/kerajinan"
                                    param="kerajinan_category"
                                    emptyOption="Semua Kerajinan"
                                    categories={kerajinanCategories}
                                />
                            )}

                            <ItemGrid
                                items={items}
                                category={category}
                                activeKulinerCategory={activeKulinerCategory}
                                activeDestinationCategory={activeDestinationCategory}
                                activeKerajinanCategory={activeKerajinanCategory}
                            />
                        </div>
                    </section>

                    {/* ─── Budaya: Cagar Budaya + Galeri ─── */}
                    {category === "budaya" && activeSub !== "sejarah" && (
                        <>
                            <section className="bg-[#FCFBFC] py-12 lg:py-16">
                                <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                                    <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
                                        <div>
                                            <h2 className="mt-2 font-display text-[26px] font-bold text-foreground md:text-[32px]">
                                                Destinasi Cagar Budaya Terkait
                                            </h2>
                                        </div>
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

                            <section className="bg-[#FCFBFC] py-12 lg:py-16">
                                <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                                    <div className="mb-8 text-center">
                                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
                                            Arsip Visual
                                        </span>
                                        <h2 className="mt-2 font-display text-[26px] font-bold text-foreground md:text-[32px]">
                                            Galeri Budaya Gorontalo
                                        </h2>
                                    </div>
                                    {galeriBudaya.length ? (
                                        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                                            {galeriBudaya.map((g, idx) => {
                                                const src =
                                                    g.image_url ??
                                                    resolveStorageUrl(g.image);
                                                if (!src) return null;
                                                return (
                                                    <button
                                                        key={
                                                            g.id ??
                                                            g.slug ??
                                                            g.name
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setLightbox(idx)
                                                        }
                                                        className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md group text-left"
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={
                                                                g.alt ?? g.name
                                                            }
                                                            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                            loading="lazy"
                                                        />
                                                    </button>
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

                <Lightbox
                    items={galeriBudaya}
                    index={lightbox}
                    onClose={() => setLightbox(null)}
                    go={go}
                />

                <SiteFooter />
                <AiAssistantButton />
            </div>
        </>
    );
}
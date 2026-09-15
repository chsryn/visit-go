import { useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { PageBreadcrumb } from "@/components/portal/PageBreadcrumb";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { resolveStorageUrl } from "@/lib/image";
import { karawoBorder } from "@/lib/karawo";
import { PaginationBar } from "@/components/portal/PaginationBar";
import { Lightbox } from "@/components/portal/Lightbox";
import { categoryLabels } from "../Category/data";
import bannerGaleri from "@/assets/banner-galeri.jpg"; // ponytail: pastikan asset asli Olele segera menggantikan placeholder ini

export default function GalleryIndex({ items, categories, activeCategory }) {
    const [lightbox, setLightbox] = useState(null);

    const data = Array.isArray(items) ? items : (items?.data ?? []);
    const paginator = Array.isArray(items) ? null : items;
    const hasPagination = paginator && paginator.last_page > 1;

    const active = activeCategory ?? "semua";
    const pills = ["semua", ...(categories ?? [])];

    useEffect(() => {
        if (lightbox === null) return;
        const onKey = (e) => {
            if (e.key === "Escape") setLightbox(null);
            if (e.key === "ArrowLeft")
                setLightbox((i) => (i - 1 + data.length) % data.length);
            if (e.key === "ArrowRight")
                setLightbox((i) => (i + 1) % data.length);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, data.length]);

    const go = (dir) =>
        setLightbox((i) => (i + dir + data.length) % data.length);

    return (
        <>
            <Head title="Galeri — Dulohupa AI" />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main className="min-h-screen h-auto overflow-visible">
                    {/* Hero - mirip referensi injourney */}
                    <div className="relative overflow-hidden bg-[#2A1E32] pt-28 pb-14">
                        <img
                            src={bannerGaleri}
                            alt=""
                            aria-hidden
                            className="absolute inset-0 size-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
                        <div className="absolute inset-0 bg-[#2A1E32]/80" />
                        <div className="absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <PageBreadcrumb items={[{ label: "Galeri" }]} />
                            <h1 className="font-display text-[32px] font-bold leading-tight text-white md:text-[40px]">
                                Galeri
                            </h1>
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

                    {/* Daftar Galeri + filter pills */}
                    <section className="bg-[#f9f7f3] py-10 lg:py-14 h-auto overflow-visible">
                        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                            <div className="text-center">
                                <div className="mx-auto flex justify-center">
                                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#715386]/10 text-[#715386]">
                                        ✦
                                    </span>
                                </div>
                                <h2 className="mt-3 font-display text-[28px] font-bold text-foreground md:text-[32px]">
                                    Daftar Galeri
                                </h2>
                                <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#715386]/30" />
                            </div>

                            {/* Pills - hardcode Semua + 5 kategori */}
                            <div className="mt-8 flex flex-wrap justify-center gap-2">
                                {pills.map((cat) => {
                                    const isActive = active === cat;
                                    const label =
                                        cat === "semua"
                                            ? "Semua"
                                            : (categoryLabels[cat] ?? cat);
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() =>
                                                router.get(
                                                    "/galeri",
                                                    cat === "semua"
                                                        ? {}
                                                        : { kategori: cat },
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    },
                                                )
                                            }
                                            className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors ${isActive ? "bg-foreground text-white shadow-sm" : "bg-white text-muted-foreground border border-border hover:bg-muted hover:text-foreground"}`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Masonry grid */}
                            <div className="mt-8">
                                {data?.length ? (
                                    <>
                                        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                                            {data.map((it, idx) => {
                                                const src = resolveStorageUrl(
                                                    it.image_url ?? it.image,
                                                );
                                                if (!src) return null;
                                                return (
                                                    <button
                                                        key={it.id ?? it.slug}
                                                        type="button"
                                                        onClick={() =>
                                                            setLightbox(idx)
                                                        }
                                                        className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md group text-left"
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={
                                                                it.alt ??
                                                                it.name
                                                            }
                                                            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                            loading="lazy"
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {hasPagination && (
                                            <PaginationBar
                                                paginator={paginator}
                                                className="mt-10"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Belum ada foto di kategori ini —
                                            tambah via admin Galeri.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                {/* Lightbox */}
                <Lightbox
                    items={data}
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

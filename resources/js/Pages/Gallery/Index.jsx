import { useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { resolveStorageUrl } from "@/lib/image";
import heroImg from "@/assets/hero-whale-shark.jpg";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";

const LABELS = {
    destinasi: "Destinasi",
    budaya: "Budaya",
    kuliner: "Kuliner",
    kerajinan: "Kerajinan",
    event: "Event",
};

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
            if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + data.length) % data.length);
            if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % data.length);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, data.length]);

    const go = (dir) => setLightbox((i) => (i + dir + data.length) % data.length);

    return (
        <>
            <Head title="Galeri — Dulohupa AI" />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    {/* Hero - mirip referensi injourney */}
                    <div className="relative overflow-hidden bg-foreground pt-20">
                        <img src={heroImg} alt="" aria-hidden className="absolute inset-0 size-full object-cover opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
                        <div className="absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                        <div className="relative mx-auto max-w-[1280px] px-6 py-14 lg:px-8 lg:py-20">
                            <h1 className="font-display text-[36px] font-bold leading-tight text-white md:text-[48px]">Gallery</h1>
                        </div>
                    </div>

                    {/* Daftar Galeri + filter pills */}
                    <section className="bg-[#f9f7f3] py-10 lg:py-14">
                        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                            <div className="text-center">
                                <div className="mx-auto flex justify-center">
                                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#715386]/10 text-[#715386]">✦</span>
                                </div>
                                <h2 className="mt-3 font-display text-[28px] font-bold text-foreground md:text-[32px]">Daftar Galeri</h2>
                                <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#715386]/30" />
                            </div>

                            {/* Pills - hardcode Semua + 5 kategori */}
                            <div className="mt-8 flex flex-wrap justify-center gap-2">
                                {pills.map((cat) => {
                                    const isActive = active === cat;
                                    const label = cat === "semua" ? "Semua" : (LABELS[cat] ?? cat);
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => router.get("/galeri", cat === "semua" ? {} : { kategori: cat }, { preserveState: true, preserveScroll: true })}
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
                                                const src = resolveStorageUrl(it.image_url ?? it.image);
                                                if (!src) return null;
                                                return (
                                                    <button
                                                        key={it.id ?? it.slug}
                                                        type="button"
                                                        onClick={() => setLightbox(idx)}
                                                        className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md group text-left"
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={it.alt ?? it.name}
                                                            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                            loading="lazy"
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {hasPagination && (
                                            <Pagination className="mt-10">
                                                <PaginationContent>
                                                    {paginator.links?.map((link, idx) => {
                                                        const isPrev = idx === 0;
                                                        const isNext = idx === paginator.links.length - 1;
                                                        const label = link.label.replace(/&laquo;|&raquo;/g, "").trim();
                                                        const isEllipsis = label === "...";
                                                        if (isEllipsis) return <PaginationItem key={idx}><PaginationEllipsis /></PaginationItem>;
                                                        if (isPrev) return <PaginationItem key={idx}><PaginationPrevious href={link.url ?? "#"} className={!link.url ? "pointer-events-none opacity-50" : ""} /></PaginationItem>;
                                                        if (isNext) return <PaginationItem key={idx}><PaginationNext href={link.url ?? "#"} className={!link.url ? "pointer-events-none opacity-50" : ""} /></PaginationItem>;
                                                        return <PaginationItem key={idx}><PaginationLink href={link.url ?? "#"} isActive={link.active} className={link.active ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}>{label}</PaginationLink></PaginationItem>;
                                                    })}
                                                </PaginationContent>
                                            </Pagination>
                                        )}
                                    </>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                                        <p className="text-sm text-muted-foreground">Belum ada foto di kategori ini — tambah via admin Galeri.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                {/* Lightbox */}
                {lightbox !== null && data[lightbox] && (() => {
                    const it = data[lightbox];
                    const src = resolveStorageUrl(it.image_url ?? it.image);
                    return (
                        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4" onClick={() => setLightbox(null)}>
                            <button type="button" aria-label="Tutup" onClick={() => setLightbox(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                                <X className="size-5" />
                            </button>
                            {data.length > 1 && (
                                <>
                                    <button type="button" aria-label="Sebelumnya" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20">
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <button type="button" aria-label="Berikutnya" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 max-sm:hidden">
                                        <ChevronRight className="size-5" />
                                    </button>
                                </>
                            )}
                            <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-[90vw]">
                                <img src={src} alt={it.alt ?? it.name} className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl" />
                                <p className="mt-3 text-center text-sm text-white/80">{it.name} {it.category ? `· ${LABELS[it.category] ?? it.category}` : ""} <span className="text-white/50"> {lightbox + 1} / {data.length}</span></p>
                            </div>
                        </div>
                    );
                })()}

                <SiteFooter />
                <AiAssistantButton />
            </div>
        </>
    );
}

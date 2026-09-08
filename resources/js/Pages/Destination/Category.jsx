import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import fallbackImage from "@/assets/kategori-destinasi.jpg";

function itemImage(item) {
    const raw = item.image;
    if (typeof raw === "string" && raw.trim() !== "") {
        return raw.startsWith("/") || raw.startsWith("http") || raw.includes("/build/")
            ? raw
            : `/${raw}`;
    }
    return fallbackImage;
}

/**
 * List destinasi per kategori dinamis.
 * Tab antar-kategori + indikator loading saat navigasi + empty state.
 */
export default function DestinationCategory({ category, categories, items }) {
    const [navigating, setNavigating] = useState(false);

    useEffect(() => {
        const offStart = router.on("start", () => setNavigating(true));
        const offFinish = router.on("finish", () => setNavigating(false));
        return () => {
            offStart();
            offFinish();
        };
    }, []);

    return (
        <>
            <Head title={`${category.name} — Visit Gorontalo`} />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    <div className="relative overflow-hidden bg-black pt-28 pb-12">
                        {category.banner_image && (
                            <img
                                src={category.banner_image}
                                alt={category.banner_alt ?? category.name}
                                className="absolute inset-0 size-full object-cover"
                            />
                        )}
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            <Link
                                href="/destinasi"
                                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20"
                            >
                                <ArrowLeft className="size-3.5" /> Semua kategori
                            </Link>
                            <h1 className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl">
                                {category.name}
                            </h1>
                            {category.description && (
                                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                                    {category.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tab kategori dinamis */}
                    <div className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
                        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3 lg:px-8">
                            {categories.map((c) => (
                                <Link
                                    key={c.slug}
                                    href={`/destinasi/kategori/${c.slug}`}
                                    className={cn(
                                        "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                                        c.slug === category.slug
                                            ? "bg-[#715386] text-white"
                                            : "bg-muted text-muted-foreground hover:bg-[#715386]/10 hover:text-foreground"
                                    )}
                                >
                                    {c.name}
                                    <span className="ml-1.5 text-xs opacity-70">
                                        {c.destinasis_count ?? 0}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <section className="relative bg-background py-[30px] md:py-[50px]">
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            {navigating ? (
                                <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                                    <Loader2 className="size-5 animate-spin" />
                                    Memuat destinasi…
                                </div>
                            ) : items?.length ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {items.map((it) => (
                                        <Link
                                            key={it.slug}
                                            href={`/destinasi/${it.slug}`}
                                            className="group relative block overflow-hidden rounded-[15px] bg-white p-[10px] shadow-soft border border-[#715386]/8 hover:shadow-card hover:-translate-y-1 transition-all"
                                        >
                                            <div className="overflow-hidden rounded-xl h-56">
                                                <img
                                                    src={itemImage(it)}
                                                    alt={it.alt ?? it.name}
                                                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-display text-lg leading-tight text-foreground">
                                                    {it.name}
                                                </h3>
                                                {it.location && (
                                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <MapPin className="size-3" />
                                                        {it.location}
                                                    </p>
                                                )}
                                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                                    {it.body?.slice(0, 110)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[#715386]/20 bg-[#715386]/[0.03] p-12 text-center">
                                    <p className="font-display text-lg text-foreground">
                                        Belum ada destinasi di kategori {category.name}
                                    </p>
                                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                                        Tambahkan destinasi ke kategori ini melalui panel admin.
                                    </p>
                                    <Link
                                        href="/destinasi"
                                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#715386] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                                    >
                                        <ArrowLeft className="size-3.5" /> Kembali ke kategori
                                    </Link>
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

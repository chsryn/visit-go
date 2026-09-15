import { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { PageBreadcrumb } from "@/components/portal/PageBreadcrumb";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { DestinationCard } from "@/components/portal/DestinationCard";
import DetailMap from "@/components/portal/DetailMap";
import {
    MapPin,
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { ViewCounter } from "@/components/portal/ViewCounter";
import { karawoBorder } from "@/lib/karawo";
import { fallbackImg, categoryLabels, fallbackBySlug } from "./Category/data";

function resolveImage(item, category) {
    const raw = item?.image;
    if (typeof raw === "string" && raw.trim() !== "") {
        // /storage/... , /build/... , http... , or Vite hashed string
        if (
            raw.startsWith("/") ||
            raw.startsWith("http") ||
            raw.includes("/build/")
        )
            return raw;
        return `/${raw}`;
    }
    return fallbackBySlug[item?.slug] ?? fallbackImg[category] ?? null;
}

export default function Detail({ item, category, related }) {
    const isEvent = category === "event";
    const title = item.name ?? item.title ?? "Detail";
    const image = resolveImage(item, category);
    const alt = item.alt ?? title;
    const body = item.body ?? item.answer ?? "";

    // Carousel: sampul + galeri (otomatis tiap 4 detik, bisa geser manual)
    const slides = useMemo(() => {
        const list = [];
        const cover =
            image && image.startsWith("/uploads/") ? `/storage${image}` : image;
        if (cover) list.push({ src: cover, alt });
        for (const g of item.images ?? []) {
            if (g?.image_url)
                list.push({ src: g.image_url, alt: g.alt ?? alt });
        }
        return list;
    }, [item, image, alt]);
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    useEffect(() => setIdx(0), [item?.slug]);
    useEffect(() => {
        if (paused || slides.length < 2) return;
        const t = setInterval(
            () => setIdx((i) => (i + 1) % slides.length),
            4000,
        );
        return () => clearInterval(t);
    }, [paused, slides.length]);
    const go = (dir) =>
        setIdx((i) => (i + dir + slides.length) % slides.length);

    return (
        <>
            <Head title={`${title} — Dulohupa AI`}>
                <meta name="description" content={body.slice(0, 160)} />
            </Head>
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main className="min-h-screen h-auto overflow-visible">
                    <div className="relative overflow-hidden bg-[#2A1E32] pt-28 pb-14">
                        {image && (
                            <img
                                src={
                                    image.startsWith("/") ||
                                    image.startsWith("http")
                                        ? image
                                        : `/${image}`
                                }
                                alt=""
                                aria-hidden
                                className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.26] blur-[8px] scale-105"
                            />
                        )}
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
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: "240px 240px",
                            }}
                        />
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <PageBreadcrumb
                                items={[
                                    {
                                        label:
                                            categoryLabels[category] ??
                                            "Kategori",
                                        href: `/${category}`,
                                    },
                                    { label: title },
                                ]}
                            />
                            <h1 className="max-w-2xl font-display text-[32px] font-bold leading-tight text-white md:text-[40px]">
                                {title}
                            </h1>
                            <ViewCounter className="mt-3 [&_span]:!text-white/70" />
                            {(item.kuliner_categories?.length ||
                                item.kerajinan_categories?.length ||
                                item.skala_usaha ||
                                item.harga) && (
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                    {(item.kuliner_categories ?? []).map(
                                        (c) => (
                                            <span
                                                key={c.slug}
                                                className="rounded-full bg-primary/10 px-3 py-1 font-semibold capitalize text-primary"
                                            >
                                                {c.name}
                                            </span>
                                        ),
                                    )}
                                    {(item.kerajinan_categories ?? []).map(
                                        (c) => (
                                            <span
                                                key={c.slug}
                                                className="rounded-full bg-primary/10 px-3 py-1 font-semibold capitalize text-primary"
                                            >
                                                {c.name}
                                            </span>
                                        ),
                                    )}
                                    {item.skala_usaha && (
                                        <span className="rounded-full bg-white px-3 py-1 font-medium capitalize text-muted-foreground border border-border">
                                            {item.skala_usaha}
                                        </span>
                                    )}
                                    {item.harga && (
                                        <span className="rounded-full bg-foreground px-3 py-1 font-semibold text-white">
                                            Rp{" "}
                                            {Number(item.harga).toLocaleString(
                                                "id-ID",
                                            )}
                                        </span>
                                    )}
                                </div>
                            )}
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

                    <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
                            <article className="min-w-0 space-y-6">
                                {slides.length > 0 && (
                                    <div
                                        className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                                        onMouseEnter={() => setPaused(true)}
                                        onMouseLeave={() => setPaused(false)}
                                    >
                                        <div className="relative flex items-center justify-center bg-black p-4 sm:p-8">
                                            <img
                                                src={slides[idx].src}
                                                alt=""
                                                aria-hidden
                                                className="pointer-events-none absolute inset-0 size-full scale-110 object-cover blur-2xl"
                                            />
                                            <img
                                                key={slides[idx].src}
                                                src={slides[idx].src}
                                                alt={slides[idx].alt}
                                                className="relative max-h-[520px] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                                                loading="eager"
                                            />
                                            {slides.length > 1 && (
                                                <>
                                                    <button
                                                        type="button"
                                                        aria-label="Foto sebelumnya"
                                                        onClick={() => go(-1)}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                                                    >
                                                        <ChevronLeft className="size-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        aria-label="Foto berikutnya"
                                                        onClick={() => go(1)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                                                    >
                                                        <ChevronRight className="size-5" />
                                                    </button>
                                                    <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white">
                                                        {idx + 1} /{" "}
                                                        {slides.length}
                                                    </span>
                                                    <span className="absolute bottom-3 left-3 flex gap-1.5">
                                                        {slides.map((s, i) => (
                                                            <button
                                                                key={s.src}
                                                                type="button"
                                                                aria-label={`Ke foto ${i + 1}`}
                                                                onClick={() =>
                                                                    setIdx(i)
                                                                }
                                                                className={`size-2 rounded-full transition-colors ${i === idx ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
                                                            />
                                                        ))}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
                                    <h2 className="font-display text-xl font-semibold text-foreground">
                                        Tentang
                                    </h2>
                                    <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground">
                                        {body}
                                    </p>
                                    {(item.produk ||
                                        item.kontak ||
                                        item.tags) && (
                                        <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
                                            {item.produk && (
                                                <p>
                                                    <span className="font-semibold text-foreground">
                                                        Produk:
                                                    </span>{" "}
                                                    <span className="text-muted-foreground">
                                                        {item.produk}
                                                    </span>
                                                </p>
                                            )}
                                            {item.kontak && (
                                                <p>
                                                    <span className="font-semibold text-foreground">
                                                        Kontak:
                                                    </span>{" "}
                                                    <span className="text-muted-foreground">
                                                        {item.kontak}
                                                    </span>
                                                </p>
                                            )}
                                            {item.tags && (
                                                <p>
                                                    <span className="font-semibold text-foreground">
                                                        Tags:
                                                    </span>{" "}
                                                    <span className="text-muted-foreground">
                                                        {item.tags}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {item.created_at && (
                                        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground/70">
                                            <Clock className="size-3.5" />{" "}
                                            Diperbarui{" "}
                                            {new Date(
                                                item.created_at,
                                            ).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    )}
                                </div>
                                {related?.length > 0 && (
                                    <section>
                                        <h3 className="font-display text-xl font-semibold text-foreground">
                                            {category === "kuliner" ||
                                            category === "kerajinan"
                                                ? `Rekomendasi UMKM terkait`
                                                : `Lokasi serupa di ${category}`}
                                        </h3>
                                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {related.map((r) => {
                                                const rImg = resolveImage(
                                                    r,
                                                    category,
                                                );
                                                return (
                                                    <DestinationCard
                                                        key={r.slug ?? r.id}
                                                        href={`/${category}/${r.slug}`}
                                                        image={
                                                            rImg ??
                                                            fallbackImg[
                                                                category
                                                            ]
                                                        }
                                                        title={r.name}
                                                        location={
                                                            r.skala_usaha ??
                                                            undefined
                                                        }
                                                        description={r.body?.slice(
                                                            0,
                                                            90,
                                                        )}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </section>
                                )}
                            </article>

                            <aside className="space-y-6 lg:sticky lg:top-24 self-start">
                                {item.has_location && (
                                    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                                        {item.latitude && item.longitude ? (
                                            <DetailMap
                                                latitude={item.latitude}
                                                longitude={item.longitude}
                                                name={item.name}
                                                location={item.location}
                                            />
                                        ) : (
                                            <div className="flex h-[220px] items-center justify-center bg-muted p-6 text-center text-sm text-muted-foreground">
                                                Peta belum tersedia — koordinat
                                                belum diisi admin.
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                                <MapPin className="size-4 text-primary" />{" "}
                                                Lokasi
                                            </h3>
                                            <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
                                                {item.location ??
                                                    item.area ??
                                                    "Gorontalo"}
                                            </p>
                                            {item.area &&
                                                item.location &&
                                                item.area !== item.location && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Area: {item.area}
                                                    </p>
                                                )}
                                            {item.latitude &&
                                                item.longitude && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {Number(
                                                            item.latitude,
                                                        ).toFixed(5)}
                                                        ,{" "}
                                                        {Number(
                                                            item.longitude,
                                                        ).toFixed(5)}
                                                    </p>
                                                )}
                                            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                                                {item.location
                                                    ? `Alamat sekitar ${item.location}`
                                                    : item.area
                                                      ? `Wilayah ${item.area}, Provinsi Gorontalo`
                                                      : "Alamat detail belum tersedia."}
                                            </p>
                                            <a
                                                href={
                                                    item.latitude &&
                                                    item.longitude
                                                        ? `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`
                                                        : `https://www.google.com/maps/search/${encodeURIComponent(item.location ?? item.area ?? title)}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline"
                                            >
                                                Buka di Google Maps →
                                            </a>
                                        </div>
                                    </div>
                                )}
                                <div className="rounded-2xl bg-[#2A1E32] p-6 text-white">
                                    <h3 className="font-display text-lg">
                                        Butuh bantuan?
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                                        Tanya Si Munggi untuk rekomendasi rute,
                                        kuliner, dan penginapan di sekitar{" "}
                                        {title}.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </div>
                </main>
                <SiteFooter />
                <AiAssistantButton />
            </div>
        </>
    );
}

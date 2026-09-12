import { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { DestinationCard } from "@/components/portal/DestinationCard";
import { MapPin, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import destinasiImage from "@/assets/kategori-destinasi.jpg";
import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";
import karawoImage from "@/assets/event-karawo.jpg";
import dikiliImage from "@/assets/event-dikili.jpg";
import fesbujatonImage from "@/assets/event-fesbujaton.jpg";

const fallbackBySlug = {
    "botubarani-pulo-cinta": destinasiImage,
    "tari-saronde-dikili": budayaImage,
    "milu-siram-ilabulo": kulinerImage,
    "sulaman-karawo": kerajinanImage,
    "karnaval-karawo-2026": karawoImage,
    "tradisi-dikili": dikiliImage,
    "fesbujaton-xx": fesbujatonImage,
};
const fallbackByCategory = {
    destinasi: destinasiImage,
    budaya: budayaImage,
    kuliner: kulinerImage,
    kerajinan: kerajinanImage,
    event: karawoImage,
};

function resolveImage(item, category) {
    const raw = item?.image;
    if (typeof raw === "string" && raw.trim() !== "") {
        // /storage/... , /build/... , http... , or Vite hashed string
        if (raw.startsWith("/") || raw.startsWith("http") || raw.includes("/build/")) return raw;
        return `/${raw}`;
    }
    return fallbackBySlug[item?.slug] ?? fallbackByCategory[category] ?? null;
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
        const cover = image && image.startsWith("/uploads/") ? `/storage${image}` : image;
        if (cover) list.push({ src: cover, alt });
        for (const g of item.images ?? []) {
            if (g?.image_url) list.push({ src: g.image_url, alt: g.alt ?? alt });
        }
        return list;
    }, [item, image, alt]);
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    useEffect(() => setIdx(0), [item?.slug]);
    useEffect(() => {
        if (paused || slides.length < 2) return;
        const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000);
        return () => clearInterval(t);
    }, [paused, slides.length, idx]);
    const go = (dir) => setIdx((i) => (i + dir + slides.length) % slides.length);

    return (
        <>
            <Head title={`${title} — Visit Gorontalo`}>
                <meta name="description" content={body.slice(0, 160)} />
            </Head>
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    <div className="relative overflow-hidden bg-warm pt-28 pb-14">
                        {image && <img src={image.startsWith("/") || image.startsWith("http") ? image : `/${image}`} alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.26] blur-[8px] scale-105" />}
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-warm/75" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://w3.org' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "240px 240px" }} />
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <h1 className="max-w-2xl font-display text-[32px] font-bold leading-tight text-foreground md:text-[40px]">{title}</h1>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
                            <article className="min-w-0 space-y-6">
                                {slides.length > 0 && (
                                    <div
                                        className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"
                                        onMouseEnter={() => setPaused(true)}
                                        onMouseLeave={() => setPaused(false)}
                                    >
                                        <div className="relative">
                                            <img
                                                key={slides[idx].src}
                                                src={slides[idx].src}
                                                alt={slides[idx].alt}
                                                className={
                                                    slides.length > 1
                                                        ? "aspect-[16/9] w-full rounded-xl object-cover"
                                                        : "max-h-[520px] w-full rounded-xl bg-muted object-contain"
                                                }
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
                                                        {idx + 1} / {slides.length}
                                                    </span>
                                                    <span className="absolute bottom-3 left-3 flex gap-1.5">
                                                        {slides.map((s, i) => (
                                                            <button
                                                                key={s.src}
                                                                type="button"
                                                                aria-label={`Ke foto ${i + 1}`}
                                                                onClick={() => setIdx(i)}
                                                                className={`size-2 rounded-full transition-colors ${i === idx ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
                                                            />
                                                        ))}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <p className="px-2 pt-2 text-xs text-muted-foreground">{slides[idx].alt} • {category}</p>
                                    </div>
                                )}
                                <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
                                    <h2 className="font-display text-xl font-semibold text-foreground">Tentang</h2>
                                    <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground">{body}</p>
                                    {item.created_at && <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground/70"><Clock className="size-3.5" /> Diperbarui {new Date(item.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</p>}
                                </div>

                                {related?.length > 0 && (
                                    <section>
                                        <h3 className="font-display text-xl font-semibold text-foreground">Lokasi serupa di {category}</h3>
                                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {related.map((r) => {
                                                const rImg = resolveImage(r, category);
                                                return <DestinationCard key={r.slug ?? r.id} href={`/${category}/${r.slug}`} image={rImg ?? fallbackByCategory[category]} title={r.name} description={r.body?.slice(0, 90)} />;
                                            })}
                                        </div>
                                    </section>
                                )}
                            </article>

                            <aside className="space-y-6 lg:sticky lg:top-24 self-start">
                                <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                                    {item.latitude && item.longitude ? (
                                        <div className="h-[220px] bg-muted">
                                            <iframe title="Peta lokasi" width="100%" height="220" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://openstreetmap.org{Number(item.longitude) - 0.01}%2C${Number(item.latitude) - 0.01}%2C${Number(item.longitude) + 0.01}%2C${Number(item.latitude) + 0.01}&layer=mapnik&marker=${item.latitude}%2C${item.longitude}`} style={{ border: 0 }} />
                                        </div>
                                    ) : (
                                        <div className="flex h-[220px] items-center justify-center bg-muted p-6 text-center text-sm text-muted-foreground">Peta belum tersedia — koordinat belum diisi admin.</div>
                                    )}
                                    <div className="p-5">
                                        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground"><MapPin className="size-4 text-primary" /> Lokasi</h3>
                                        <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">{item.location ?? item.area ?? "Gorontalo"}</p>
                                        {item.area && item.location && item.area !== item.location && <p className="text-xs text-muted-foreground">Area: {item.area}</p>}
                                        {(item.latitude && item.longitude) && <p className="mt-1 text-xs text-muted-foreground">{Number(item.latitude).toFixed(5)}, {Number(item.longitude).toFixed(5)}</p>}
                                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.location ? `Alamat sekitar ${item.location}` : item.area ? `Wilayah ${item.area}, Provinsi Gorontalo` : "Alamat detail belum tersedia."}</p>
                                        <a href={item.latitude && item.longitude ? `https://openstreetmap.org{item.latitude}&mlon=${item.longitude}#map=15/${item.latitude}/${item.longitude}` : `https://google.com{encodeURIComponent(item.location ?? item.area ?? title)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">Buka di peta →</a>
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-charcoal p-6 text-white">
                                    <h3 className="font-display text-lg">Butuh bantuan?</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/70">Tanya Si Munggi untuk rekomendasi rute, kuliner, dan penginapan di sekitar {title}.</p>
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

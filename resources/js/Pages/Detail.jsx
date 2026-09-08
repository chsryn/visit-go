import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { MapPin, Calendar, ArrowLeft, Clock } from "lucide-react";
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

    return (
        <>
            <Head title={`${title} — Visit Gorontalo`}>
                <meta name="description" content={body.slice(0, 160)} />
            </Head>
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    {/* Hero */}
                    <div className="relative h-[56vh] min-h-[380px] w-full overflow-hidden bg-black">
                        {image ? (
                            <img
                                src={image.startsWith("/") || image.startsWith("http") ? image : `/${image}`}
                                alt={alt}
                                className="absolute inset-0 size-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#715386] via-[#00923F]/40 to-[#D4A017]/20" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />
                        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 pt-24 lg:px-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                            >
                                <ArrowLeft className="size-3.5" /> Kembali ke Beranda
                            </Link>
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-accent px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-accent-foreground">
                                    {category}
                                </span>
                                {isEvent && item.month && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                        <Calendar className="size-3.5" /> {item.date} {item.month}
                                    </span>
                                )}
                                {(item.location || item.category) && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                        <MapPin className="size-3.5" /> {item.location ?? item.category}
                                    </span>
                                )}
                            </div>
                            <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                                {title}
                            </h1>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
                            <article className="min-w-0">
                                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
                                    <h2 className="font-display text-xl font-semibold text-foreground">Tentang</h2>
                                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                        {body}
                                    </p>
                                    {item.created_at && (
                                        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground/70">
                                            <Clock className="size-3.5" /> Diperbarui {new Date(item.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                                        </p>
                                    )}
                                </div>

                                {/* Related */}
                                {related?.length > 0 && (
                                    <section className="mt-10">
                                        <h3 className="font-display text-xl font-semibold text-foreground">Jelajahi juga</h3>
                                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {related.map((r) => (
                                                <Link
                                                    key={r.slug ?? r.id}
                                                    href={`/${category}/${r.slug}`}
                                                    className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                                                >
                                                    <div className="h-36 overflow-hidden bg-muted">
                                                        {(() => {
                                                            const rImg = resolveImage(r, category);
                                                            return rImg ? (
                                                                <img
                                                                    src={rImg}
                                                                    alt={r.alt ?? r.name}
                                                                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                    loading="lazy"
                                                                />
                                                            ) : null;
                                                        })()}
                                                    </div>
                                                    <div className="p-4">
                                                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                                                            {r.name}
                                                        </p>
                                                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                            {r.body?.slice(0, 90)}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </article>

                            {/* Sidebar info */}
                            <aside className="space-y-6">
                                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                                    <h3 className="text-sm font-semibold text-foreground">Informasi</h3>
                                    <dl className="mt-4 space-y-3 text-sm">
                                        <div className="flex justify-between gap-4">
                                            <dt className="text-muted-foreground">Kategori</dt>
                                            <dd className="font-medium capitalize text-foreground">{category}</dd>
                                        </div>
                                        {item.location && (
                                            <div className="flex justify-between gap-4">
                                                <dt className="text-muted-foreground">Lokasi</dt>
                                                <dd className="font-medium text-foreground text-right">{item.location}</dd>
                                            </div>
                                        )}
                                        {isEvent && item.date && (
                                            <div className="flex justify-between gap-4">
                                                <dt className="text-muted-foreground">Tanggal</dt>
                                                <dd className="font-medium text-foreground">{item.date} {item.month}</dd>
                                            </div>
                                        )}
                                        <div className="flex justify-between gap-4">
                                            <dt className="text-muted-foreground">Slug</dt>
                                            <dd className="font-mono text-xs text-foreground">{item.slug}</dd>
                                        </div>
                                    </dl>
                                    <Link
                                        href="/#ai-planner"
                                        className="mt-6 flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B8941F]"
                                    >
                                        Rencanakan Kunjungan
                                    </Link>
                                </div>
                                <div className="rounded-2xl bg-[#5B436C] p-6 text-primary-foreground">
                                    <h3 className="font-display text-lg">Butuh bantuan?</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
                                        Tanya Si Munggi untuk rekomendasi rute, kuliner, dan penginapan di sekitar {title}.
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

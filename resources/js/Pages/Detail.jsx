import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { DestinationCard } from "@/components/portal/DestinationCard";
import { MapPin, Calendar, Clock } from "lucide-react";
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
                    <div className="relative overflow-hidden bg-warm pt-28 pb-14">
                        {image && <img src={image.startsWith("/") || image.startsWith("http") ? image : `/${image}`} alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.26] blur-[8px] scale-105" />}
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-warm/75" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "240px 240px" }} />
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <h1 className="max-w-2xl font-display text-[32px] font-bold leading-tight text-foreground md:text-[40px]">{title}</h1>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
                            <article className="min-w-0 space-y-6">
                                {image && (
                                    <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                        <img src={image} alt={alt} className="aspect-[16/9] w-full rounded-xl object-cover" loading="eager" />
                                        <p className="px-2 pt-2 text-xs text-muted-foreground">{alt} • {category}</p>
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
                                            <iframe title="Peta lokasi" width="100%" height="220" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(item.longitude) - 0.01}%2C${Number(item.latitude) - 0.01}%2C${Number(item.longitude) + 0.01}%2C${Number(item.latitude) + 0.01}&layer=mapnik&marker=${item.latitude}%2C${item.longitude}`} style={{ border: 0 }} />
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
                                        <a href={item.latitude && item.longitude ? `https://www.openstreetmap.org/?mlat=${item.latitude}&mlon=${item.longitude}#map=15/${item.latitude}/${item.longitude}` : `https://www.google.com/maps/search/${encodeURIComponent(item.location ?? item.area ?? title)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">Buka di peta →</a>
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

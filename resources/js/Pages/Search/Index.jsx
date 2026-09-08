import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { Search, MapPin } from "lucide-react";
import destinasiImage from "@/assets/kategori-destinasi.jpg";
import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";
import karawoImage from "@/assets/event-karawo.jpg";

const fallbackImg = {
    destinasi: destinasiImage,
    budaya: budayaImage,
    kuliner: kulinerImage,
    kerajinan: kerajinanImage,
    event: karawoImage,
};

const typeLabels = {
    destinasi: "Destinasi",
    budaya: "Budaya",
    kuliner: "Kuliner",
    kerajinan: "Kerajinan",
    event: "Agenda",
};

export default function SearchIndex({ q: initialQ = "", type: initialType = null, results = [], counts = {}, total = 0 }) {
    const [q, setQ] = useState(initialQ);

    const go = (val, t = initialType) => {
        const v = (val ?? q).trim();
        if (!v && !t) return;
        router.get("/search", { q: v || initialQ, ...(t ? { type: t } : {}) }, { preserveState: true, preserveScroll: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        go();
    };

    const types = ["destinasi", "budaya", "kuliner", "kerajinan", "event"];

    const filtered = initialType ? results.filter((r) => r.category === initialType) : results;

    return (
        <>
            <Head title={initialQ ? `Cari "${initialQ}" — Visit Gorontalo` : "Cari — Visit Gorontalo"} />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    {/* Header search */}
                    <div className="relative overflow-hidden bg-black pt-28 pb-12">
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                                {initialQ ? `Hasil untuk "${initialQ}"` : "Cari"}
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-white/80">
                                {total > 0 ? `${total} hasil ditemukan` : initialQ ? "Coba kata kunci lain" : "Cari destinasi, budaya, kuliner, kerajinan, atau agenda Gorontalo"}
                                {initialType ? ` — ${typeLabels[initialType]}` : ""}
                            </p>

                            <form onSubmit={handleSubmit} className="mt-6 flex max-w-xl items-center gap-2 rounded-full bg-white/95 backdrop-blur p-1.5 shadow-lg">
                                <Search className="ml-3 size-4 shrink-0 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Cari Pulo Cinta, Karawo, Milu Siram..."
                                    className="flex-1 bg-transparent px-2 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                                />
                                <button type="submit" className="shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
                                    Cari
                                </button>
                            </form>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {["Pulo Cinta", "Karawo", "Milu Siram", "Botubarani"].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => {
                                            setQ(s);
                                            router.get("/search", { q: s });
                                        }}
                                        className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium text-white hover:bg-white/25"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            {/* Tabs */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => router.get("/search", { q: initialQ })}
                                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${!initialType ? "bg-white text-foreground" : "bg-white/15 text-white hover:bg-white/25"}`}
                                >
                                    Semua {total > 0 ? `(${total})` : ""}
                                </button>
                                {types.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => router.get("/search", { q: initialQ, type: t })}
                                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${initialType === t ? "bg-white text-foreground" : "bg-white/15 text-white hover:bg-white/25"}`}
                                    >
                                        {typeLabels[t]} {counts[t] ? `(${counts[t]})` : ""}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <section className="relative overflow-hidden bg-background py-8 md:py-12">
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            {!initialQ ? (
                                <div className="rounded-2xl border border-dashed border-[#715386]/20 bg-[#715386]/[0.03] p-12 text-center">
                                    <p className="text-sm text-muted-foreground">Masukkan kata kunci di atas untuk mencari.</p>
                                </div>
                            ) : filtered.length ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {filtered.map((it) => {
                                        const raw = it.image;
                                        const src =
                                            typeof raw === "string" && raw.trim() !== ""
                                                ? raw.startsWith("/") || raw.startsWith("http") || raw.includes("/build/")
                                                    ? raw
                                                    : `/${raw}`
                                                : null;
                                        const img = src ?? fallbackImg[it.category] ?? destinasiImage;
                                        return (
                                            <Link
                                                key={`${it.category}-${it.slug}`}
                                                href={it.href ?? `/${it.category}/${it.slug}`}
                                                className="group relative block overflow-hidden rounded-[15px] bg-white p-[10px] shadow-soft border border-[#715386]/8 hover:shadow-card hover:-translate-y-1 transition-all"
                                            >
                                                <div className="overflow-hidden rounded-xl h-56">
                                                    <img src={img} alt={it.alt ?? it.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="rounded-full bg-[#715386]/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-primary">{typeLabels[it.category] ?? it.category}</span>
                                                        {it.location && <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{it.location}</span>}
                                                    </div>
                                                    <h3 className="mt-2 font-display text-lg leading-tight text-foreground">{it.name}</h3>
                                                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[#715386]/20 bg-[#715386]/[0.03] p-12 text-center">
                                    <p className="text-sm font-medium text-foreground">Tidak ada hasil untuk &quot;{initialQ}&quot;</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Coba kata kunci lain seperti Pulo Cinta, Karawo, atau Botubarani.</p>
                                    <Link href="/#kategori" className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary/90">Jelajahi kategori</Link>
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

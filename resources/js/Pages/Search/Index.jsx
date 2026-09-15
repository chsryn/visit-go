import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { DestinationCard } from "@/components/portal/DestinationCard";
import { resolveStorageUrl } from "@/lib/image";
import { karawoBorder } from "@/lib/karawo";
import { Search } from "lucide-react";
import { fallbackImg, categoryLabels } from "../Category/data";

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
            <Head title={initialQ ? `Cari "${initialQ}" — Dulohupa AI` : "Cari — Dulohupa AI"} />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main className="min-h-screen h-auto overflow-visible">
                    <div className="relative overflow-hidden bg-[#2A1E32] pt-28 pb-14">
                        <img src={karawoImage} alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.16] blur-[8px] scale-105" />
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#2A1E32]/75" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23D4A017' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "240px 240px" }} />
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <h1 className="max-w-2xl font-display text-[32px] font-bold leading-tight text-white md:text-[40px]">{initialQ ? `Hasil untuk "${initialQ}"` : "Cari"}</h1>
                            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-white/70">{total > 0 ? `${total} hasil ditemukan` : initialQ ? "Coba kata kunci lain" : "Cari destinasi, budaya, kuliner, kerajinan, atau agenda Gorontalo"}{initialType ? ` — ${categoryLabels[initialType]}` : ""}</p>
                            <form onSubmit={handleSubmit} className="mt-6 flex max-w-xl items-center gap-2 rounded-full border border-border bg-white p-1.5 shadow-sm">
                                <Search className="ml-3 size-4 shrink-0 text-muted-foreground" />
                                <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari Pulo Cinta, Karawo, Milu Siram..." className="flex-1 bg-transparent px-2 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none" />
                                <button type="submit" className="shrink-0 rounded-full bg-sand px-6 py-2.5 text-sm font-bold text-white hover:bg-sand-deep">Cari</button>
                            </form>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {["Pulo Cinta", "Karawo", "Milu Siram", "Botubarani"].map((s) => (
                                    <button key={s} type="button" onClick={() => { setQ(s); router.get("/search", { q: s }); }} className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground shadow-sm hover:bg-muted">{s}</button>
                                ))}
                            </div>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <button type="button" onClick={() => router.get("/search", { q: initialQ })} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${!initialType ? "bg-sand text-white" : "border border-border bg-white text-foreground shadow-sm hover:bg-muted"}`}>Semua {total > 0 ? `(${total})` : ""}</button>
                                {types.map((t) => (
                                    <button key={t} type="button" onClick={() => router.get("/search", { q: initialQ, type: t })} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${initialType === t ? "bg-sand text-white" : "border border-border bg-white text-foreground shadow-sm hover:bg-muted"}`}>{categoryLabels[t]} {counts[t] ? `(${counts[t]})` : ""}</button>
                                ))}
                            </div>
                        </div>
                        <div aria-hidden className="h-[10px] w-full opacity-90 absolute inset-x-0 bottom-0 z-10" style={{ backgroundImage: karawoBorder, backgroundRepeat: "repeat-x", backgroundSize: "120px 12px" }} />
                    </div>
                    <section className="bg-[#FCFCFC] py-16 lg:py-20">
                        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                            {!initialQ ? (
                                <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center"><p className="text-sm text-muted-foreground">Masukkan kata kunci di atas untuk mencari.</p></div>
                            ) : filtered.length ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filtered.map((it) => {
                                        const src = resolveStorageUrl(it.image);
                                        const img = src ?? fallbackImg[it.category] ?? fallbackImg.destinasi;
                                        return <DestinationCard key={`${it.category}-${it.slug}`} href={it.href ?? `/${it.category}/${it.slug}`} image={img} title={it.name} location={it.location} category={categoryLabels[it.category] ?? it.category} description={it.body} />;
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                                    <p className="text-sm font-medium text-foreground">Tidak ada hasil untuk &quot;{initialQ}&quot;</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Coba kata kunci lain seperti Pulo Cinta, Karawo, atau Botubarani.</p>
                                    <Link href="/#kategori" className="mt-4 inline-flex rounded-full bg-sand px-5 py-2 text-xs font-bold text-white hover:bg-sand-deep">Jelajahi kategori</Link>
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

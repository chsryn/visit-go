import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { resolveStorageUrl } from "@/lib/image";
import { karawoBorder } from "@/lib/karawo";
import { Calendar } from "lucide-react";

export default function ArticleShow({ item, related }) {
    const src = resolveStorageUrl(item.image_url ?? item.image);

    return (
        <>
            <Head title={`${item.name} — Dulohupa AI`} />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main className="min-h-screen pb-16">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden bg-[#2A1E32] pt-28 pb-20">
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#2A1E32]/80" />

                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            {/* Breadcrumb — sejajar logo Navbar */}
                            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-white/60">
                                <Link href="/" className="transition-colors hover:text-white">Beranda</Link>
                                <span>›</span>
                                <Link href="/artikel" className="transition-colors hover:text-white">Artikel</Link>
                                <span>›</span>
                                <span className="text-white/90 line-clamp-1">{item.name}</span>
                            </nav>

                            {/* Judul Artikel */}
                            <h1 className="mt-4 max-w-3xl font-display text-2xl font-bold leading-snug text-white md:text-3xl lg:text-4xl">
                                {item.name}
                            </h1>

                            {/* Tanggal Publikasi */}
                            {item.created_at && (
                                <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
                                    <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                                        <Calendar className="size-3.5" />
                                        {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Ornamen Karawo Border di Bawah Hero */}
                        <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-[10px] w-full opacity-90" style={{ backgroundImage: karawoBorder, backgroundRepeat: "repeat-x", backgroundSize: "120px 12px" }} />
                    </div>

                    {/* Konten Artikel — gambar kiri teks kanan, lebar selaras 800px */}
                    <article className="mx-auto max-w-[800px] px-6 py-12 lg:px-8 lg:py-16">
                        <div className="flex flex-col gap-8 md:flex-row md:items-start">
                            {src && (
                                <div className="w-full shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 md:w-[340px] lg:w-[360px]">
                                    <img
                                        src={src}
                                        alt={item.alt ?? item.name}
                                        className="aspect-[4/3] w-full object-cover"
                                        loading="eager"
                                    />
                                </div>
                            )}
                            <div className="prose prose-neutral min-w-0 flex-1 max-w-none text-[15px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                {item.body}
                            </div>
                        </div>

                        {/* Artikel Terkait — perkecil & selaras */}
                        {related?.length > 0 && (
                            <section className="mx-auto mt-12 max-w-[800px] border-t border-border pt-8">
                                <h3 className="font-display text-lg font-bold text-foreground">Artikel Lainnya</h3>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {related.map((r) => {
                                        const rSrc = resolveStorageUrl(r.image_url ?? r.image);
                                        return (
                                            <Link
                                                key={r.slug}
                                                href={`/artikel/${r.slug}`}
                                                className="group flex gap-2.5 rounded-lg border border-border bg-white p-2.5 transition-all hover:border-primary/30 hover:shadow-sm"
                                            >
                                                {rSrc && (
                                                    <img
                                                        src={rSrc}
                                                        alt=""
                                                        className="size-16 shrink-0 rounded-md object-cover"
                                                    />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                                                        {r.name}
                                                    </p>
                                                    <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
                                                        {r.body?.slice(0, 70)}
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </article>
                </main>
                <SiteFooter />
                <AiAssistantButton />
            </div>
        </>
    );
}

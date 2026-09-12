import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { resolveStorageUrl } from "@/lib/image";
import { Calendar, ArrowRight } from "lucide-react";

export default function ArticleShow({ item, related }) {
    const src = resolveStorageUrl(item.image_url ?? item.image);
    return (
        <>
            <Head title={`${item.name} — Dulohupa AI`} />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    <div className="relative overflow-hidden bg-warm pt-28 pb-10">
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-warm/75" />
                        <div className="relative mx-auto max-w-[800px] px-6 lg:px-8">
                            <nav className="text-xs text-muted-foreground">
                                <Link href="/" className="hover:text-foreground">Beranda</Link>
                                <span className="mx-2">›</span>
                                <Link href="/artikel" className="hover:text-foreground">Artikel</Link>
                                <span className="mx-2">›</span>
                                <span className="text-foreground line-clamp-1">{item.name}</span>
                            </nav>
                            <h1 className="mt-4 font-display text-[28px] font-bold leading-tight text-foreground md:text-[36px]">{item.name}</h1>
                            {item.created_at && (
                                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Calendar className="size-3.5" /> {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                            )}
                        </div>
                    </div>

                    <article className="mx-auto max-w-[800px] px-6 pb-16 lg:px-8">
                        {src && <img src={src} alt={item.alt ?? item.name} className="w-full rounded-2xl object-cover shadow-sm" loading="eager" />}
                        <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-wrap text-[15px] leading-relaxed text-muted-foreground">
                            {item.body}
                        </div>

                        {related?.length > 0 && (
                            <section className="mt-12 border-t border-border pt-8">
                                <h3 className="font-display text-lg font-bold">Artikel lainnya</h3>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    {related.map((r) => {
                                        const rSrc = resolveStorageUrl(r.image_url ?? r.image);
                                        return (
                                            <Link key={r.slug} href={`/artikel/${r.slug}`} className="group flex gap-3 rounded-xl border border-border bg-white p-3 hover:shadow-sm">
                                                {rSrc && <img src={rSrc} alt="" className="size-20 shrink-0 rounded-lg object-cover" />}
                                                <div className="min-w-0">
                                                    <p className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">{r.name}</p>
                                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.body?.slice(0, 80)}</p>
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

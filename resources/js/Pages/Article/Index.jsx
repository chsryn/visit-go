import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { PageBreadcrumb } from "@/components/portal/PageBreadcrumb";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { resolveStorageUrl } from "@/lib/image";
import { karawoBorder } from "@/lib/karawo";
import heroImg from "@/assets/kategori-budaya.jpg";
import { Calendar, ArrowRight } from "lucide-react";
import { PaginationBar } from "@/components/portal/PaginationBar";

export default function ArticleIndex({ items }) {
    const data = Array.isArray(items) ? items : (items?.data ?? []);
    const paginator = Array.isArray(items) ? null : items;
    const hasPagination = paginator && paginator.last_page > 1;
    return (
        <>
            <Head title="Artikel — Dulohupa AI" />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main className="min-h-screen h-auto overflow-visible">
                    <div className="relative overflow-hidden bg-[#2A1E32] pt-28 pb-14">
                        <img
                            src={heroImg}
                            alt=""
                            aria-hidden
                            className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.24] blur-[8px] scale-105"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-[#2A1E32]/75"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent"
                        />
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <PageBreadcrumb items={[{ label: "Artikel" }]} />
                            <h1 className="mt-6 max-w-2xl font-display text-[32px] font-bold leading-tight text-white md:text-[40px]">
                                Artikel
                            </h1>
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

                    <section className="bg-[#FCFCFC] py-12 lg:py-16">
                        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                            {data?.length ? (
                                <>
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {data.map((it) => {
                                            const src = resolveStorageUrl(
                                                it.image_url ?? it.image,
                                            );
                                            return (
                                                <Link
                                                    key={it.slug}
                                                    href={`/artikel/${it.slug}`}
                                                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                                >
                                                    {src ? (
                                                        <div className="aspect-[16/10] overflow-hidden bg-muted">
                                                            <img
                                                                src={src}
                                                                alt={
                                                                    it.alt ??
                                                                    it.name
                                                                }
                                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="aspect-[16/10] bg-muted" />
                                                    )}
                                                    <div className="flex flex-1 flex-col p-5">
                                                        <h3 className="font-display text-[17px] font-bold leading-tight text-foreground line-clamp-2">
                                                            {it.name}
                                                        </h3>
                                                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                                            {it.body?.slice(
                                                                0,
                                                                130,
                                                            )}
                                                        </p>
                                                        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                                            Baca selengkapnya{" "}
                                                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                                                        </span>
                                                        {it.created_at && (
                                                            <span className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/70">
                                                                <Calendar className="size-3.5" />{" "}
                                                                {new Date(
                                                                    it.created_at,
                                                                ).toLocaleDateString(
                                                                    "id-ID",
                                                                    {
                                                                        day: "numeric",
                                                                        month: "long",
                                                                        year: "numeric",
                                                                    },
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    {hasPagination && (
                                        <PaginationBar
                                            paginator={paginator}
                                            className="mt-10"
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada artikel — tambah via admin
                                        Artikel.
                                    </p>
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

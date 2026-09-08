import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { ArrowRight, MapPin } from "lucide-react";
import fallbackImage from "@/assets/kategori-destinasi.jpg";

function bannerSrcOf(banner) {
    const raw = banner?.banner_image;
    if (typeof raw === "string" && raw.trim() !== "") return raw;
    return null;
}

function cardImage(cat) {
    const raw = cat.banner_image;
    if (typeof raw === "string" && raw.trim() !== "") return raw;
    return fallbackImage;
}

/**
 * Overview Destination — kartu kategori 100% dinamis dari database.
 * Tambah kategori via admin → otomatis tampil di sini.
 */
export default function DestinationIndex({ categories, banner }) {
    const heroSrc = bannerSrcOf(banner);
    const heroTitle = banner?.name ?? "Destinasi Wisata";
    const heroDesc =
        banner?.description ??
        "Jelajahi keindahan Gorontalo — pilih kategori untuk melihat koleksinya.";

    return (
        <>
            <Head title={`${heroTitle} — Visit Gorontalo`} />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    {/* Hero — banner dari DB jika ada */}
                    <div className="relative overflow-hidden bg-black pt-28 pb-12">
                        {heroSrc && (
                            <img
                                src={heroSrc}
                                alt={banner?.banner_alt ?? heroTitle}
                                className="absolute inset-0 size-full object-cover"
                            />
                        )}
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/40" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                                <MapPin className="size-3.5" /> Jelajahi Gorontalo
                            </p>
                            <h1 className="mt-6 font-display text-3xl font-bold text-white sm:text-4xl">
                                {heroTitle}
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                                {heroDesc}
                            </p>
                        </div>
                    </div>

                    {/* Kartu kategori dinamis */}
                    <section className="relative overflow-hidden bg-background py-[30px] md:py-[50px]">
                        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                            {categories?.length ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            href={`/destinasi/kategori/${cat.slug}`}
                                            className="group relative block overflow-hidden rounded-[15px] bg-white p-[10px] shadow-soft border border-[#715386]/8 hover:shadow-card hover:-translate-y-1 transition-all"
                                        >
                                            <div className="overflow-hidden rounded-xl h-56">
                                                <img
                                                    src={cardImage(cat)}
                                                    alt={cat.banner_alt ?? cat.name}
                                                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="font-display text-lg leading-tight text-foreground">
                                                        {cat.name}
                                                    </h3>
                                                    <span className="shrink-0 rounded-full bg-[#715386]/10 px-2.5 py-1 text-xs font-semibold text-[#715386]">
                                                        {cat.destinasis_count ?? 0} wisata
                                                    </span>
                                                </div>
                                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                                    {cat.description ?? "Lihat koleksi destinasi kategori ini."}
                                                </p>
                                                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#715386]">
                                                    Lihat koleksi
                                                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[#715386]/20 bg-[#715386]/[0.03] p-12 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada kategori destinasi — tambah via admin.
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

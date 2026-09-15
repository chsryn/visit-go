import { DestinationCard } from "@/components/portal/DestinationCard";
import { resolveStorageUrl } from "@/lib/image";
import { ItemGrid } from "../shared/ItemGrid";
import { fallbackImg } from "../data";
import { IntroBudaya } from "./IntroBudaya";
import { BudayaNavCards } from "./BudayaNavCards";

export function BudayaSection({
    items,
    category,
    destinasiTerkait = [],
    galeriBudaya = [],
}) {
    return (
        <>
            <IntroBudaya />
            <BudayaNavCards />
            <section className="bg-[#FCFBFC] py-12 lg:py-16">
                <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                    <ItemGrid items={items} category={category} />
                </div>
            </section>
            <section className="bg-[#FCFBFC] py-12 lg:py-16">
                        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                            <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
                                        Jejak Ruang
                                    </span>
                                    <h2 className="mt-2 font-display text-[26px] font-bold text-foreground md:text-[32px]">
                                        Destinasi Cagar Budaya Terkait
                                    </h2>
                                </div>
                                <p className="max-w-[40ch] text-sm text-muted-foreground">
                                    Benteng, masjid tua, dan kampung adat yang
                                    menjadi panggung hidup tradisi.
                                </p>
                            </div>
                            {destinasiTerkait.length ? (
                                <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
                                    {destinasiTerkait.map((it) => {
                                        const src = resolveStorageUrl(it.image);
                                        const img =
                                            src ?? fallbackImg.destinasi;
                                        const badge = it.destination_category
                                            ? [it.destination_category]
                                            : [];
                                        return (
                                            <div
                                                key={`des-${it.slug}`}
                                                className="transition-all duration-300"
                                            >
                                                <DestinationCard
                                                    href={`/destinasi/${it.slug}`}
                                                    image={img}
                                                    title={it.name}
                                                    category="destinasi"
                                                    description={it.body?.slice(
                                                        0,
                                                        110,
                                                    )}
                                                    badges={badge}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed bg-white p-12 text-center text-sm text-muted-foreground">
                                    Belum ada destinasi cagar budaya.
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="bg-white py-12 lg:py-16">
                        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                            <div className="mb-8 text-center">
                                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
                                    Arsip Visual
                                </span>
                                <h2 className="mt-2 font-display text-[26px] font-bold text-foreground md:text-[32px]">
                                    Galeri Budaya
                                </h2>
                                <p className="mx-auto mt-2 max-w-[60ch] text-sm text-muted-foreground">
                                    Dokumentasi tenun, upacara, dan lanskap
                                    budaya dari berbagai sudut Gorontalo.
                                </p>
                            </div>
                            {galeriBudaya.length ? (
                                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                                    {galeriBudaya.map((g) => {
                                        const src =
                                            g.image_url ??
                                            resolveStorageUrl(g.image);
                                        if (!src) return null;
                                        return (
                                            <div
                                                key={
                                                    g.id ??
                                                    g.slug ??
                                                    g.name
                                                }
                                                className="mb-4 break-inside-avoid overflow-hidden rounded-xl bg-white shadow-sm"
                                            >
                                                <img
                                                    src={src}
                                                    alt={g.alt ?? g.name}
                                                    className="w-full object-cover"
                                                    loading="lazy"
                                                />
                                                {g.name && (
                                                    <p className="px-3 py-2 text-xs font-medium text-foreground">
                                                        {g.name}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                                    Belum ada galeri budaya.
                                </div>
                            )}
                        </div>
                    </section>
        </>
    );
}
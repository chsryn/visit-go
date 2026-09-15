import { DestinationCard } from "@/components/portal/DestinationCard";
import { resolveStorageUrl } from "@/lib/image";
import { PaginationBar } from "@/components/portal/PaginationBar";
import { fallbackImg, fallbackBySlug } from "../data";

export function ItemGrid({
    items,
    category,
    activeKulinerCategory = "semua",
    activeDestinationCategory = "semua",
    activeKerajinanCategory = "semua",
}) {
    const rawData = Array.isArray(items)
        ? items
        : (items?.data ?? []);
    const paginator = Array.isArray(items)
        ? null
        : items;
    const hasPagination = paginator && paginator.last_page > 1;
    const isKulinerFiltered =
        category === "kuliner" && activeKulinerCategory !== "semua";
    const isDestinasiFiltered =
        category === "destinasi" && activeDestinationCategory !== "semua";
    const isKerajinanFiltered =
        category === "kerajinan" && activeKerajinanCategory !== "semua";
    const data = rawData;
    if (!rawData.length) {
        if (isKulinerFiltered) {
            return (
                <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        Kuliner tidak ditemukan
                    </p>
                </div>
            );
        }
        if (isDestinasiFiltered) {
            return (
                <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        Destinasi tidak ditemukan
                    </p>
                </div>
            );
        }
        if (isKerajinanFiltered) {
            return (
                <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        Kerajinan tidak ditemukan
                    </p>
                </div>
            );
        }
        return (
            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                <p className="text-sm text-muted-foreground">
                    Belum ada objek di kategori ini — tambah via admin.
                </p>
            </div>
        );
    }
    return (
        <>
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
                {data.map((it) => {
                    const src = resolveStorageUrl(it.image);
                    const img = src ?? fallbackBySlug[it.slug] ?? fallbackImg[category];
                    const kulinerBadges =
                        it.kuliner_categories ??
                        it.kulinerCategories ??
                        [];
                    const kerajinanBadges =
                        it.kerajinan_categories ??
                        it.kerajinanCategories ??
                        [];
                    const destinasiBadge =
                        it.destination_category ??
                        it.destinationCategory ??
                        null;
                    const budayaBadges = (() => {
                        if (category !== "budaya") return [];
                        const out = [];
                        if (it.area)
                            out.push({
                                name: it.area,
                                slug: it.area,
                            });
                        if (it.tags) {
                            const tags = String(it.tags)
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean)
                                .slice(0, 2);
                            tags.forEach((t) =>
                                out.push({
                                    name: t,
                                    slug: t,
                                }),
                            );
                        }
                        return out;
                    })();
                    const badges =
                        category === "kuliner"
                            ? kulinerBadges
                            : category === "kerajinan"
                              ? kerajinanBadges
                              : category === "destinasi" && destinasiBadge
                                ? [destinasiBadge]
                                : category === "budaya"
                                  ? budayaBadges
                                  : [];
                    return (
                        <div
                            key={it.slug}
                            className="transition-all duration-300"
                        >
                            <DestinationCard
                                href={`/${category}/${it.slug}`}
                                image={img}
                                title={it.name}
                                category={category}
                                description={it.body?.slice(0, 180)}
                                badges={badges}
                            />
                        </div>
                    );
                })}
            </div>
            {hasPagination &&
                !isKulinerFiltered &&
                !isDestinasiFiltered &&
                !isKerajinanFiltered && <PaginationBar paginator={paginator} />}
        </>
    );
}
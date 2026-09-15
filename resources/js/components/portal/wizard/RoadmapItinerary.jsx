import { ChevronDown, Clock, MapPin, UtensilsCrossed } from "lucide-react";

/* Hallmark · component: daily roadmap · genre: editorial · theme: inherited tokens (primary #715386 / accent #D4A017) */

/**
 * Jadwal perjalanan harian dari result.days: accordion native <details> per hari
 * (Hari 1 terbuka), aktivitas tersusun kolom (waktu kiri, detail kanan).
 */
export default function RoadmapItinerary({ days }) {
    if (!days || days.length === 0) return null;

    return (
        <section className="rounded-[15px] border border-white/30 bg-white/65 p-5 shadow-soft backdrop-blur-xl md:p-6">
            <h4 className=" text-xl font-bold text-foreground">Jadwal Perjalanan Harian</h4>
            <div className="mt-4">
                {days.map((day, index) => {
                    const activities = day.activities ?? [];
                    const dayImage =
                        activities.find(
                            (a) => typeof a?.image === "string" && a.image.trim() !== "",
                        )?.image ?? null;
                    return (
                        <details
                            key={day.day_number}
                            open={index === 0}
                            className="group mb-4 overflow-hidden rounded-[15px] border border-white/30 bg-card shadow-soft"
                        >
<summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 marker:hidden transition-colors hover:bg-primary/[0.06]">
                                <div className="flex min-w-0 items-center gap-3.5">
                                    {dayImage && (
                                        <img
                                            src={dayImage}
                                            alt={day.title}
                                            loading="lazy"
                                            className="size-10 shrink-0 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                                            Hari {day.day_number}
                                        </p>
                                        <span className="block truncate text-base font-bold text-foreground sm:text-lg">
                                            {day.title}
                                        </span>
                                    </div>
                                    <span className="hidden rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary sm:inline-flex">
                                        {activities.length} aktivitas
                                    </span>
                                </div>
                                <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                            </summary>

                            <div className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-300 ease-in-out group-open:grid-rows-[1fr] group-open:opacity-100">
                                <div className="overflow-hidden">
                                    <div className="border-t border-border/60 bg-background/40 px-5">
                                        <ol className="divide-y divide-border/60">
                                            {activities.map((act, actIdx) => (
                                                <li
                                                    key={actIdx}
                                                    className="grid gap-1.5 py-4 sm:grid-cols-[150px_1fr] sm:gap-6"
                                                >
                                                    <div>
                                                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-primary">
                                                            <Clock className="size-3.5" />
                                                            {act.time}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                            {act.location && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <MapPin className="size-3 text-accent" />
                                                                    {act.location}
                                                                </span>
                                                            )}
                                                            {act.cost_estimate && (
                                                                <span className="ml-auto font-medium">
                                                                    Est. {act.cost_estimate}
                                                                </span>
                                                            )}
                                                        </div>
<h5 className="mt-1 text-sm font-bold leading-snug text-foreground">
                                                        {act.activity}
                                                    </h5>
                                                        {act.food_recommendation && (
                                                            <p className="mt-2 inline-flex items-start gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                                <UtensilsCrossed className="mt-0.5 size-3.5 shrink-0" />
                                                                {act.food_recommendation}
                                                            </p>
                                                        )}
                                                        {act.notes && (
                                                            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                                                                {act.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </details>
                    );
                })}
            </div>
        </section>
    );
}
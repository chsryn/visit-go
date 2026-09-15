import { Check, Lightbulb, UtensilsCrossed } from "lucide-react";
import AiResultPlaces from "@/components/portal/AiResultPlaces";
import RoadmapItinerary from "./RoadmapItinerary";

/* Hallmark · component: itinerary result sheet · genre: editorial · theme: inherited tokens (primary #715386 / accent #D4A017) */

const budgetRows = (bb) => [
    { label: "Akomodasi", value: bb?.accommodation },
    { label: "Makan", value: bb?.food },
    { label: "Transport", value: bb?.transport },
    { label: "Tiket & aktivitas", value: bb?.attractions },
];

/** Blok hasil: header rencana, biaya, destinasi+peta, jadwal harian, kuliner/tips, peringatan area. */
export default function WizardResult({ result }) {
    const noData = result.no_data === true;
    const daysCount = Array.isArray(result.days) ? result.days.length : 0;
    const bb = result.budget_breakdown;

    return (
        <div id="ai-result" className="mt-12 space-y-8">
            {noData && (
                <div className="rounded-[15px] border border-amber-300/50 bg-amber-50/80 p-6 backdrop-blur-xl">
                    <h4 className="font-bold">Tidak tersedia di area ini</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Wisata dengan minat pilihanmu belum tersedia di area ini.
                    </p>
                </div>
            )}

            {!noData && (result.title || result.summary) && (
                <header className="rounded-[15px] border border-white/30 bg-white/65 p-6 shadow-soft backdrop-blur-xl">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-2">
                            {daysCount > 0 && (
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                                    Rencana perjalanan · {daysCount} hari
                                </p>
                            )}
                            <h3 className="text-pretty text-2xl font-bold tracking-tight text-foreground">
                                {result.title}
                            </h3>
                        </div>
                        {result._source && (
                            <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                                {result._source === "fallback" ? "Rencana lokal (tanpa AI)" : "Dulohupa AI"}
                            </span>
                        )}
                    </div>
                    {result.summary && (
                        <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                            {result.summary}
                        </p>
                    )}
                    {result.highlights?.length > 0 && (
                        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                            {result.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Check className="size-2.5" />
                                    </span>
                                    {h}
                                </li>
                            ))}
                        </ul>
                    )}
                </header>
            )}

            {!noData && bb && (
                <section className="rounded-[15px] border border-white/30 bg-white/65 p-6 shadow-soft backdrop-blur-xl">
                    <h4 className="text-xl font-bold">Perkiraan Biaya</h4>
                    <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {budgetRows(bb).map(({ label, value }) => (
                            <div key={label} className="rounded-xl bg-primary/[0.06] p-3">
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                    {label}
                                </dt>
                                <dd className="mt-1 text-sm font-bold text-foreground">{value ?? "—"}</dd>
                            </div>
                        ))}
                    </dl>
                    {bb.total_estimated && (
                        <p className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-sm">
                            <span className="font-semibold text-foreground">Total estimasi</span>
                            <span className="font-bold text-primary">{bb.total_estimated}</span>
                        </p>
                    )}
                </section>
            )}

            {!noData && result.places?.length > 0 && (
                <AiResultPlaces places={result.places} costEstimate={result.cost_estimate} />
            )}
            {!noData && result.days && <RoadmapItinerary days={result.days} />}

            {!noData && (result.food_highlights?.length > 0 || result.travel_tips?.length > 0) && (
                <div className="grid gap-6 md:grid-cols-2">
                    {result.food_highlights?.length > 0 && (
                        <section className="rounded-[15px] border border-white/30 bg-white/65 p-6 shadow-soft backdrop-blur-xl">
                            <h4 className="flex items-center gap-2 font-bold">
                                <UtensilsCrossed className="size-4 text-emerald-500" />
                                Kuliner
                            </h4>
                            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                                {result.food_highlights.map((f, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-emerald-500">•</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    {result.travel_tips?.length > 0 && (
                        <section className="rounded-[15px] border border-white/30 bg-white/65 p-6 shadow-soft backdrop-blur-xl">
                            <h4 className="flex items-center gap-2 font-bold">
                                <Lightbulb className="size-4 text-amber-500" />
                                Tips
                            </h4>
                            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                                {result.travel_tips.map((t, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-amber-500">•</span>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            )}

            {(!noData && (result.area_empty || (result.unavailable?.length > 0))) && (
                <div className="rounded-[15px] border border-amber-300/50 bg-amber-50/80 p-6 backdrop-blur-xl">
                    <h4 className="font-bold">Tidak tersedia di area ini</h4>
                    {result.area_empty ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                            Wisata di area pilihanmu belum tersedia — rekomendasi untuk minat ini belum bisa dibuat.
                        </p>
                    ) : (
                        <>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Minat berikut belum tersedia di area ini:
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {result.unavailable.map((u, i) => (
                                    <span
                                        key={i}
                                        className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800"
                                    >
                                        {u}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Wisata untuk minat ini belum tersedia di daerah tersebut. Hubungi admin untuk info terkini.
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
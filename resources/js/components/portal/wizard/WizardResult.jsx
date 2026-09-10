import { useState } from "react";
import { Check, Copy, Printer, CheckCircle2, Lightbulb, UtensilsCrossed, Wallet, ChevronDown, ChevronUp, Clock, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import AiResultPlaces from "@/components/portal/AiResultPlaces";

const JENIS_LABELS = {
    tiket_masuk: "Tiket Masuk",
    wahana: "Wahana / Aktivitas",
    sewa: "Sewa Fasilitas",
    lainnya: "Lainnya",
};

const rupiah = (n) =>
    n === null || n === undefined ? "—" : `Rp ${Number(n).toLocaleString("id-ID")}`;

/** Estimasi biaya DB: total dulu, rincian di balik tombol Detail. */
function CostEstimate({ estimate }) {
    const [showDetail, setShowDetail] = useState(false);
    if (!estimate) return null;
    const dests = estimate.destinations ?? [];
    const foods = estimate.foods ?? [];
    if (dests.length === 0 && foods.length === 0) return null;

    return (
        <div className="rounded-[15px] border border-emerald-300/40 bg-emerald-50/70 backdrop-blur-xl p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h4 className="flex items-center gap-2 font-display font-bold">
                        <Wallet className="size-4 text-emerald-600" /> Estimasi Biaya
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground">Dihitung dari data harga di database.</p>
                </div>
                <div className="flex items-center gap-3">
                    <p className="font-mono text-xl font-bold text-emerald-700">{rupiah(estimate.total)}</p>
                    <button
                        type="button"
                        onClick={() => setShowDetail((v) => !v)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/30 bg-white/70 px-4 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-600/10"
                    >
                        Detail
                        <ChevronDown className={cn("size-3.5 transition-transform", showDetail && "rotate-180")} />
                    </button>
                </div>
            </div>

            {showDetail && (
                <>
                    {dests.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {dests.map((d) => (
                                <div key={d.slug ?? d.name}>
                                    <p className="text-sm font-semibold">
                                        {d.name}
                                        {d.entry_fee !== null && d.entry_fee !== undefined && (
                                            <span className="ml-2 text-xs font-normal text-muted-foreground">
                                                mulai dari {rupiah(d.entry_fee)}
                                            </span>
                                        )}
                                    </p>
                                    <ul className="mt-1 space-y-1">
                                        {d.items.map((it, i) => (
                                            <li key={i} className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
                                                <span>
                                                    {it.label}
                                                    <span className="ml-1.5 rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                                        {JENIS_LABELS[it.jenis] ?? it.jenis}
                                                    </span>
                                                    {it.satuan && <span className="ml-1">/{it.satuan}</span>}
                                                </span>
                                                <span className="shrink-0 font-mono font-semibold text-foreground">{rupiah(it.harga)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {foods.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold">Kuliner (sesuai preferensimu)</p>
                            <ul className="mt-1 space-y-1">
                                {foods.map((f) => (
                                    <li key={f.name} className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
                                        <span>{f.name}</span>
                                        <span className="shrink-0 font-mono font-semibold text-foreground">{rupiah(f.harga)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-4 flex items-baseline justify-between border-t border-emerald-600/20 pt-3">
                        <span className="text-sm font-bold">Total estimasi</span>
                        <span className="font-mono text-lg font-bold text-emerald-700">{rupiah(estimate.total)}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">Total = seluruh item di atas. Harga dari database admin dan dapat berubah sewaktu-waktu.</p>
                </>
            )}
        </div>
    );
}

/** Planning: jadwal perjalanan harian (day accordion + timeline aktivitas). */
function WizardItinerary({ days }) {
    const [expanded, setExpanded] = useState(() => ({ 1: true }));
    if (!days || days.length === 0) return null;

    const toggle = (n) => setExpanded((p) => ({ ...p, [n]: !p[n] }));

    return (
        <div className="space-y-4">
            <h4 className="font-display text-xl font-bold text-foreground">
                📅 Jadwal Perjalanan Harian
            </h4>

            {days.map((day) => {
                const isExp = !!expanded[day.day_number];
                return (
                    <div
                        key={day.day_number}
                        className="overflow-hidden rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft transition-all duration-200"
                    >
                        <button
                            type="button"
                            onClick={() => toggle(day.day_number)}
                            className="flex w-full items-center justify-between bg-card p-5 text-left transition-colors hover:bg-[#715386]/[0.06]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
                                    H{day.day_number}
                                </span>
                                <span className="font-display text-base font-bold text-foreground sm:text-lg">
                                    {day.title}
                                </span>
                            </div>
                            {isExp ? (
                                <ChevronUp className="size-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="size-5 text-muted-foreground" />
                            )}
                        </button>

                        {isExp && (
                            <div className="border-t border-border/60 bg-background/40 p-5 space-y-4">
                                {(day.activities || []).map((act, actIdx) => (
                                    <div
                                        key={actIdx}
                                        className="relative pl-6 border-l-2 border-primary/40 space-y-1.5 pb-3 last:pb-0"
                                    >
                                        <span className="absolute -left-[7px] top-1 size-3 rounded-full border-2 border-primary bg-background" />

                                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                                            <span className="inline-flex items-center gap-1 text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md">
                                                <Clock className="size-3" />
                                                {act.time}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                                                <MapPin className="size-3 text-accent" />
                                                {act.location}
                                            </span>
                                            {act.cost_estimate && (
                                                <span className="ml-auto text-muted-foreground font-medium">
                                                    Est. {act.cost_estimate}
                                                </span>
                                            )}
                                        </div>

                                        <h5 className="text-sm font-bold text-foreground">
                                            {act.activity}
                                        </h5>

                                        {act.food_recommendation && (
                                            <div className="inline-flex items-start gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                                                <UtensilsCrossed className="size-3.5 shrink-0 mt-0.5" />
                                                <span>
                                                    <strong className="font-semibold">Kuliner:</strong> {act.food_recommendation}
                                                </span>
                                            </div>
                                        )}

                                        {act.notes && (
                                            <p className="text-xs text-muted-foreground italic">
                                                💡 {act.notes}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/** Blok hasil: ringkasan, estimasi biaya, peta destinasi, planning harian, kuliner/tips, catatan ketersediaan. */
export default function WizardResult({ result, durationDays, copied, onCopy }) {
    return (
        <div id="ai-result" className="mt-12 space-y-8">
            <Reveal y={30}><div className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                    <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-primary">{durationDays} hari</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold sm:text-3xl">{result.title}</h3>
                        <p className="text-base leading-relaxed text-muted-foreground">{result.summary}</p>
                        {result.highlights?.length>0 && <div className="flex flex-wrap gap-2 pt-2">{result.highlights.map((h,i)=><span key={i} className="inline-flex items-center gap-1 text-xs font-medium bg-[#715386]/10 px-3 py-1 rounded-lg"><CheckCircle2 className="size-3.5 text-primary"/>{h}</span>)}</div>}
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button onClick={onCopy} className="inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-xs font-semibold hover:bg-secondary">{copied ? <Check className="size-4 text-emerald-500"/> : <Copy className="size-4"/>}{copied?"Tersalin":"Salin"}</button>
                        <button onClick={()=>window.print()} className="inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-xs font-semibold hover:bg-secondary"><Printer className="size-4"/>Cetak</button>
                    </div>
                </div>
            </div></Reveal>
            {result.cost_estimate && <CostEstimate estimate={result.cost_estimate} />}
            {result.places && <AiResultPlaces places={result.places} />}
            {result.days && <WizardItinerary days={result.days} />}
            {(result.food_highlights?.length>0 || result.travel_tips?.length>0) && (
                <div className="grid gap-6 md:grid-cols-2">
                    {result.food_highlights?.length>0 && <div className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-6"><h4 className="flex items-center gap-2 font-display font-bold"><UtensilsCrossed className="size-4 text-emerald-500"/>Kuliner</h4><ul className="mt-4 space-y-2 text-xs text-muted-foreground">{result.food_highlights.map((f,i)=><li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{f}</li>)}</ul></div>}
                    {result.travel_tips?.length>0 && <div className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-6"><h4 className="flex items-center gap-2 font-display font-bold"><Lightbulb className="size-4 text-amber-500"/>Tips</h4><ul className="mt-4 space-y-2 text-xs text-muted-foreground">{result.travel_tips.map((t,i)=><li key={i} className="flex gap-2"><span className="text-amber-500">•</span>{t}</li>)}</ul></div>}
                </div>
            )}
            {(result.area_empty || (result.unavailable?.length > 0)) && (
                <div className="rounded-[15px] border border-amber-300/50 bg-amber-50/80 backdrop-blur-xl p-6">
                    <h4 className="font-display font-bold">⚠️ Tidak tersedia di area ini</h4>
                    {result.area_empty ? (
                        <p className="mt-2 text-sm text-muted-foreground">
                            Belum ada data database untuk area pilihanmu — rekomendasi di atas disusun AI dari pengetahuan umum Gorontalo.
                        </p>
                    ) : (
                        <>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Minat berikut tidak ditemukan di database area ini:
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {result.unavailable.map((u, i) => (
                                    <span key={i} className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800">
                                        {u}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                AI merekomendasikan alternatif dari pengetahuannya — hubungi admin untuk info terkini.
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

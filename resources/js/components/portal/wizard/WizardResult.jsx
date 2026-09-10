import { Check, Copy, Printer, CheckCircle2, Lightbulb, UtensilsCrossed } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import AiResultPlaces from "@/components/portal/AiResultPlaces";
import CostEstimate from "./CostEstimate";
import WizardItinerary from "./WizardItinerary";

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

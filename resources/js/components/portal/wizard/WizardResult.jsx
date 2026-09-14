import { Lightbulb, UtensilsCrossed } from "lucide-react";
import AiResultPlaces from "@/components/portal/AiResultPlaces";
import RoadmapItinerary from "./RoadmapItinerary";

/** Blok hasil: kartu destinasi+peta, roadmap jadwal harian, kuliner/tips, catatan ketersediaan. */
export default function WizardResult({ result }) {
    const noData = result.no_data === true;
    return (
        <div id="ai-result" className="mt-12 space-y-8">
            {noData && (
                <div className="rounded-[15px] border border-amber-300/50 bg-amber-50/80 backdrop-blur-xl p-6">
                    <h4 className="font-display font-bold">⚠️ Tidak tersedia di area ini</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Wisata dengan minat pilihanmu belum tersedia di area ini.
                    </p>
                </div>
            )}
            {!noData && result.places && <AiResultPlaces places={result.places} costEstimate={result.cost_estimate} />}
            {!noData && result.days && <RoadmapItinerary days={result.days} />}
            {!noData && (result.food_highlights?.length>0 || result.travel_tips?.length>0) && (
                <div className="grid gap-6 md:grid-cols-2">
                    {result.food_highlights?.length>0 && <div className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-6"><h4 className="flex items-center gap-2 font-display font-bold"><UtensilsCrossed className="size-4 text-emerald-500"/>Kuliner</h4><ul className="mt-4 space-y-2 text-xs text-muted-foreground">{result.food_highlights.map((f,i)=><li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{f}</li>)}</ul></div>}
                    {result.travel_tips?.length>0 && <div className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-6"><h4 className="flex items-center gap-2 font-display font-bold"><Lightbulb className="size-4 text-amber-500"/>Tips</h4><ul className="mt-4 space-y-2 text-xs text-muted-foreground">{result.travel_tips.map((t,i)=><li key={i} className="flex gap-2"><span className="text-amber-500">•</span>{t}</li>)}</ul></div>}
                </div>
            )}
            {(!noData && (result.area_empty || (result.unavailable?.length > 0))) && (
                <div className="rounded-[15px] border border-amber-300/50 bg-amber-50/80 backdrop-blur-xl p-6">
                    <h4 className="font-display font-bold">⚠️ Tidak tersedia di area ini</h4>
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
                                    <span key={i} className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800">
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

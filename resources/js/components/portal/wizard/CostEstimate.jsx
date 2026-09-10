import { useState } from "react";
import { Wallet, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const JENIS_LABELS = {
    tiket_masuk: "Tiket Masuk",
    wahana: "Wahana / Aktivitas",
    sewa: "Sewa Fasilitas",
    lainnya: "Lainnya",
};

const rupiah = (n) =>
    n === null || n === undefined ? "—" : `Rp ${Number(n).toLocaleString("id-ID")}`;

/**
 * Estimasi biaya dari database: tampil ringkas (total dulu),
 * rincian dibuka lewat tombol Detail.
 */
export default function CostEstimate({ estimate }) {
    const [showDetail, setShowDetail] = useState(false);
    if (!estimate) return null;
    const dests = estimate.destinations ?? [];
    const foods = estimate.foods ?? [];
    if (dests.length === 0 && foods.length === 0) return null;

    return (
        <div className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h4 className="flex items-center gap-2 font-display font-bold">
                        <Wallet className="size-4 text-black" /> Estimasi Biaya
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

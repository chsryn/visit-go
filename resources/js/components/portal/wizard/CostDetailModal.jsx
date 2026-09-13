import { useState } from "react";
import { Wallet, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const JENIS_LABELS = {
    tiket_masuk: "Tiket Masuk",
    wahana: "Wahana / Aktivitas",
    sewa: "Sewa Fasilitas",
    lainnya: "Lainnya",
};

const rupiah = (n) =>
    n === null || n === undefined ? "—" : `Rp ${Number(n).toLocaleString("id-ID")}`;

/**
 * Rincian biaya per destinasi (dari DB): tombol singkat "Estimasi Biaya"
 * di dalam kartu wisata, rincian harga dibuka lewat modal agar tidak menumpuk.
 */
export default function CostDetailModal({ dest }) {
    const [open, setOpen] = useState(false);
    if (!dest || !Array.isArray(dest.items) || dest.items.length === 0) return null;

    const openModal = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-600/20"
            >
                <Wallet className="size-3" />
                Estimasi Biaya
                <ChevronRight className="size-3" />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                    <DialogTitle className="flex items-center gap-2 font-display text-lg font-bold">
                        <Wallet className="size-5 text-emerald-600" /> Rincian Biaya — {dest.name}
                    </DialogTitle>

                    {dest.entry_fee !== null && dest.entry_fee !== undefined && (
                        <p className="text-xs text-muted-foreground">Tiket masuk mulai dari {rupiah(dest.entry_fee)}</p>
                    )}

                    <ul className="space-y-1">
                        {dest.items.map((it, i) => (
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

                    {dest.subtotal !== null && dest.subtotal !== undefined && (
                        <>
                            <div className="flex items-baseline justify-between border-t border-emerald-600/20 pt-3">
                                <span className="text-sm font-bold">Total estimasi</span>
                                <span className="font-mono text-lg font-bold text-emerald-700">{rupiah(dest.subtotal)}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Harga dapat berubah sewaktu-waktu.
                            </p>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
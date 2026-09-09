import { Search, ChevronRight } from "lucide-react";

/** Step 1: pilih destinasi (search + unggulan). */
export default function StepDestination({
    destSearch,
    setDestSearch,
    showDestDropdown,
    setShowDestDropdown,
    filteredDestinasi,
    destinasiList,
    destinasiUnggulan,
    selected,
    onSelect,
}) {
    return (
        <div>
            <h3 className="font-display text-xl font-bold text-foreground">dimana destinasi <span className="text-primary">yang ingin dituju?</span></h3>
            <p className="mt-1 text-xs text-muted-foreground">Hanya wilayah Gorontalo • Pilih 1 destinasi</p>
            <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    value={destSearch}
                    onChange={e => setDestSearch(e.target.value)}
                    onFocus={() => setShowDestDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDestDropdown(false), 150)}
                    placeholder="Cari Gorontalo, Bone Bolango..."
                    className="w-full rounded-xl border border-border bg-card px-10 py-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <ChevronRight className={`pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-transform ${showDestDropdown ? "rotate-90" : ""}`} />
                {showDestDropdown && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[220px] overflow-y-auto rounded-xl border border-border bg-white p-2 shadow-lg">
                        <p className="px-2 pb-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">Rekomendasi — Gorontalo</p>
                        {(destSearch ? filteredDestinasi : destinasiList).slice(0, 6).map(d => (
                            <button
                                key={d.value}
                                type="button"
                                onMouseDown={e => { e.preventDefault(); onSelect(d); }}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${selected === d.value ? "bg-primary text-white" : "hover:bg-secondary text-foreground"}`}
                            >
                                <span>
                                    {d.label} <span className={`ml-2 rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${selected === d.value ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>{d.unggulan ? "Unggulan" : "Rekomendasi"}</span>
                                </span>
                                <span className={`text-xs ${selected === d.value ? "text-white/80" : "text-muted-foreground"}`}>{d.desc}</span>
                            </button>
                        ))}
                        {(destSearch ? filteredDestinasi : destinasiList).length === 0 && <p className="p-3 text-xs text-muted-foreground">Tidak ada catatan</p>}
                    </div>
                )}
            </div>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">Destinasi unggulan</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {destinasiUnggulan.map(d => (
                    <button key={d.value} type="button" onClick={() => onSelect(d)} className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${selected === d.value ? "border-primary bg-primary text-white" : "border-border bg-card hover:bg-secondary"}`}>{d.label}<span className="block text-xs font-normal opacity-70">{d.desc}</span></button>
                ))}
            </div>
            {selected && <p className="mt-3 text-xs text-primary">Terpilih: <b>{selected}</b></p>}
        </div>
    );
}

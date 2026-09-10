import { Search, ChevronRight, Check, X } from "lucide-react";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { MAX_INTERESTS } from "./wizardOptions";

/*
    StepDestination (1), StepDate (2), StepPreferences (3).
 */
function StepDestination({
    destSearch, setDestSearch, showDestDropdown, setShowDestDropdown,
    filteredDestinasi, destinasiList, destinasiUnggulan, selected, onSelect,
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

function StepDate({ range, onSelectRange, month, onMonthChange, today, disabledAfter, isMobile, durationDays }) {
    return (
        <>
            <div className="text-center mb-4">
                <h3 className="font-display text-2xl font-bold text-foreground">Kapan petualanganmu dimulai?</h3>
                <p className="mt-1 text-sm text-muted-foreground">Pilih tanggal perjalananmu dan temukan tempat terbaik • Maks 30 hari</p>
            </div>
            <div className="bg-transparent">
                <CalendarPicker
                    mode="range"
                    selected={range}
                    onSelect={onSelectRange}
                    month={month}
                    onMonthChange={onMonthChange}
                    numberOfMonths={isMobile ? 1 : 2}
                    locale={localeId}
                    fromDate={today}
                    disabled={range.from ? [{ before: today }, { after: disabledAfter }] : { before: today }}
                    className="bg-transparent p-0 w-full [--cell-size:2rem] text-[13px] leading-none"
                    classNames={{
                        months: "flex flex-col md:flex-row gap-3 relative",
                        month: "bg-white/65 backdrop-blur-xl border border-white/30 rounded-2xl p-3.5 shadow-sm flex w-full flex-col gap-2 min-h-0",
                        month_caption: "h-7 text-[13px] font-semibold",
                        weekdays: "grid grid-cols-7 gap-px",
                        weekday: "flex items-center justify-center h-8 w-8 mx-auto text-[11px] leading-none",
                        week: "grid grid-cols-7 gap-px mt-1 w-full",
                        day: "flex items-center justify-center h-8 w-8 mx-auto p-0",
                        nav: "absolute inset-x-0 top-1.5 flex w-full items-center justify-between px-1.5 z-10 pointer-events-none",
                        button_previous: "relative z-20 pointer-events-auto",
                        button_next: "relative z-20 pointer-events-auto",
                    }}
                    showOutsideDays={false}
                />
            </div>
            <div className="mt-3 text-center text-sm text-gray-500">
                {range.from && range.to ? (
                    <p className="font-medium text-primary">{format(range.from, "d MMM yyyy", { locale: localeId })} — {format(range.to, "d MMM yyyy", { locale: localeId })} • <span className="font-bold">{durationDays} hari</span></p>
                ) : range.from ? (
                    <p>Pilih tanggal selesai (maks 30 hari, akan diburamkan jika lebih)</p>
                ) : (
                    <p>Pilih tanggal mulai dan selesai</p>
                )}
            </div>
        </>
    );
}

function StepPreferences({ form, interests, foods, penginapanList, onToggleInterest, onToggleFood, onChange }) {
    return (
        <div className="max-h-[520px] overflow-y-auto pr-1">
            <h3 className="font-display text-xl font-bold text-foreground">Ceritakan <span className="text-primary">minatmu!</span></h3>
            <p className="mt-1 text-xs text-muted-foreground">Pilih 1–{MAX_INTERESTS} minat • {form.interests.length}/{MAX_INTERESTS} • Tambahkan bebas</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {interests.map(o => {
                    const active = form.interests.includes(o.value);
                    const Icon = o.icon;
                    return (
                        <button key={o.value} type="button" onClick={() => onToggleInterest(o.value)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? "border-primary bg-primary text-primary-foreground shadow-md scale-105" : "border-border bg-white text-foreground hover:border-primary/30 hover:bg-secondary"}`}>
                            <Icon className="size-4" /> {o.label} {active && <Check className="size-3.5" />}
                        </button>
                    );
                })}
            </div>
            <div className="mt-4 flex gap-2">
                <input value={form.customInterest} onChange={e => onChange({ customInterest: e.target.value })} placeholder="Tambahkan minat bebas..." className="flex-1 rounded-xl border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <button type="button" onClick={() => { if (form.customInterest.trim()) { onToggleInterest(form.customInterest.trim()); onChange({ customInterest: "" }); } }} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">Tambah</button>
            </div>
            {form.interests.length>0 && <div className="mt-3 flex flex-wrap gap-1.5">{form.interests.map(v => <span key={v} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{v} <button type="button" onClick={() => onToggleInterest(v)}><X className="size-3" /></button></span>)}</div>}
            <p className="mt-6 text-xs font-semibold text-foreground">Preferensi makanan?</p>
            <div className="mt-2 flex flex-wrap gap-2">
                {foods.map(o => {
                    const active = form.food.includes(o.value);
                    const Icon = o.icon;
                    return (
                        <button key={o.value} type="button" onClick={() => onToggleFood(o.value)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${active ? "border-primary bg-primary text-white" : "border-border bg-card hover:bg-secondary"}`}>
                            <Icon className="size-3" /> {o.label} {active && <Check className="size-3" />}
                        </button>
                    );
                })}
            </div>
            <p className="mt-4 text-xs font-semibold text-foreground">Menginap di mana?</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
                {penginapanList.map(o => {
                    const active = form.penginapan === o.value;
                    const Icon = o.icon;
                    return (
                        <button key={o.value} type="button" onClick={() => onChange({ penginapan: o.value })} className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center ${active ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
                            <Icon className="size-5 text-primary" />
                            <span className="text-xs font-semibold">{o.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function WizardSteps({ step, ...rest }) {
    if (step === 1) return <StepDestination {...rest} />;
    if (step === 2) return <StepDate {...rest} />;
    return <StepPreferences {...rest} />;
}

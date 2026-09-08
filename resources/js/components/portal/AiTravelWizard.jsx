import { useState } from "react";
import {
    MapPin,
    Search,
    Calendar,
    Wallet,
    Palmtree,
    Fish,
    Mountain,
    Landmark,
    Camera,
    Heart,
    Fish as FishIcon,
    Leaf,
    Coffee,
    Salad,
    Check,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    RefreshCw,
    Copy,
    Printer,
    CheckCircle2,
    Clock,
    Lightbulb,
    ShoppingBag,
    PartyPopper,
    Compass,
    Gem as GemIcon,
    Music2,
    Palette,
    Accessibility,
    Baby,
    UtensilsCrossed,
    X,
    Home,
    Building2,
    Waves,
    Trees,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Stagger, cardVariants } from "@/components/ui/Reveal";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { differenceInCalendarDays, addDays, format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

const destinasiList = [
    { value: "Gorontalo", label: "Gorontalo, Gorontalo", desc: "Provinsi Gorontalo", unggulan: true },
    { value: "Kota Gorontalo", label: "Kota Gorontalo", desc: "Pusat kota", unggulan: false },
    { value: "Bone Bolango", label: "Bone Bolango", desc: "Botubarani", unggulan: false },
    { value: "Boalemo", label: "Boalemo", desc: "Pulo Cinta", unggulan: false },
    { value: "Pohuwato", label: "Pohuwato", desc: "Pantai barat", unggulan: false },
    { value: "Gorontalo Utara", label: "Gorontalo Utara", desc: "Saronde", unggulan: false },
    { value: "Kab. Gorontalo", label: "Kab. Gorontalo", desc: "Limboto", unggulan: false },
];
const destinasiUnggulan = destinasiList.filter(d => d.unggulan || ["Kota Gorontalo","Bone Bolango","Boalemo"].includes(d.value));



const interests = [
    { value: "Pantai", label: "Pantai", icon: Palmtree },
    { value: "Warisan Budaya", label: "Warisan Budaya", icon: Landmark },
    { value: "Alam & Petualangan", label: "Alam & Petualangan", icon: Mountain },
    { value: "Kesehatan & Spa", label: "Kesehatan & Spa", icon: Heart },
    { value: "Kuliner", label: "Kuliner", icon: UtensilsCrossed },
    { value: "Tempat wisata", label: "Tempat wisata", icon: MapPin },
    { value: "Kuliner mewah", label: "Kuliner mewah", icon: GemIcon },
    { value: "Belanja", label: "Belanja", icon: ShoppingBag },
    { value: "Festival", label: "Festival", icon: PartyPopper },
    { value: "Tur Wisata", label: "Tur Wisata", icon: Compass },
    { value: "Hidden Gems", label: "Hidden Gems", icon: Sparkles },
    { value: "Seni & Budaya", label: "Seni & Budaya", icon: Palette },
    { value: "Akses Difabel", label: "Akses Difabel", icon: Accessibility },
    { value: "Ramah Anak", label: "Ramah Anak", icon: Baby },
];

const foods = [
    { value: "Kuliner Khas Gorontalo", label: "Kuliner Khas Gorontalo", sub: "Milu siram", icon: UtensilsCrossed },
    { value: "Seafood Segar", label: "Seafood Segar", sub: "Ikan bakar", icon: FishIcon },
    { value: "Halal Food", label: "Halal Food", sub: "100% Halal", icon: Leaf },
    { value: "Western/Cafe", label: "Western / Cafe", sub: "Kopi & pastry", icon: Coffee },
    { value: "Vegan/Vegetarian", label: "Bebas Alergi", sub: "Vegan / Veg", icon: Salad },
    { value: "Tidak ada preferensi khusus", label: "Tidak ada preferensi", sub: "Bebas", icon: Leaf },
];

const penginapanList = [
    { value: "Hotel & Resor", label: "Hotel & Resor", icon: Building2 },
    { value: "Villa", label: "Villa", icon: Home },
    { value: "Hemat", label: "Hemat", icon: Wallet },
];

const steps = [
    { id: 1, title: "Destinasi", desc: "Di mana perjalananmu dimulai?" },
    { id: 2, title: "Tanggal", desc: "Kapan petualanganmu dimulai?" },
    { id: 3, title: "Minat & Preferensi", desc: "Ceritakan minatmu" },
];

function parseRupiah(str) {
    if (!str) return 0;
    const n = parseInt(String(str).replace(/[^\d]/g, ""), 10);
    return isNaN(n) ? 0 : n;
}
function formatRupiah(n) {
    return "Rp " + Number(n).toLocaleString("id-ID");
}
function calcEstimasiTotal(result) {
    if (!result) return 0;
    // Prioritas: jumlahkan cost_estimate tiap aktivitas (tiket+kuliner+aktivitas)
    const fromActivities = (result.days || []).flatMap(d => d.activities || []).reduce((acc, a) => acc + parseRupiah(a.cost_estimate || a.cost), 0);
    if (fromActivities > 0) return fromActivities;
    // Fallback ke budget_breakdown.total_estimated jika tidak ada cost_estimate
    return parseRupiah(result.budget_breakdown?.total_estimated);
}

export function AiTravelWizard() {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [form, setForm] = useState({ destinasi: "", durationDays: 3, interests: [], customInterest: "", food: [], penginapan: "" });
    const [range, setRange] = useState({ from: undefined, to: undefined });
    const [destSearch, setDestSearch] = useState("");
    const [showDestDropdown, setShowDestDropdown] = useState(false);
    const isMobile = useIsMobile();
    const [today] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
    const [month, setMonth] = useState(today);
    const durationDays = range.from && range.to ? Math.min(30, differenceInCalendarDays(range.to, range.from) + 1) : range.from ? 1 : form.durationDays;
    const disabledAfter = range.from ? addDays(range.from, 29) : undefined;
    const handleRange = (val) => {
        if (!val) { setRange({ from: undefined, to: undefined }); return; }
        if (val.from && val.to) {
            const d = differenceInCalendarDays(val.to, val.from) + 1;
            if (d > 30) { toast.error("Maksimal 30 hari"); return; }
            setRange(val);
            setForm(f => ({ ...f, durationDays: Math.min(30, d) }));
        } else {
            setRange(val);
            if (val.from && !val.to) setForm(f => ({ ...f, durationDays: 1 }));
        }
    };
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [expandedDays, setExpandedDays] = useState({});

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const isValid = () => {
        if (step === 1) return !!form.destinasi;
        if (step === 2) return !!range.from && !!range.to && durationDays >= 1 && durationDays <= 30;
        if (step === 3) return form.interests.length >= 1;
        return false;
    };

    const next = () => {
        if (!isValid()) {
            if (step === 1) return toast.error("Pilih destinasi dulu");
            if (step === 2) return toast.error("Pilih tanggal mulai & selesai (maks 30 hari)");
            if (step === 3) return toast.error("Pilih minimal 1 minat");
            return toast.error("Lengkapi dulu ya!");
        }
        if (step === 2) setForm(f => ({ ...f, durationDays }));
        if (step < totalSteps) { setDirection(1); setStep(s => s + 1); }
    };
    const back = () => { if (step > 1) { setDirection(-1); setStep(s => s - 1); } };

    const toggleInterest = (val) => {
        setForm(f => {
            const has = f.interests.includes(val);
            if (has) return { ...f, interests: f.interests.filter(v => v !== val) };
            if (f.interests.length >= 5) { toast.error("Maksimal 5 minat ya!"); return f; }
            return { ...f, interests: [...f.interests, val] };
        });
    };
    const toggleFood = (val) => {
        setForm(f => {
            const has = f.food.includes(val);
            if (has) return { ...f, food: f.food.filter(v => v !== val) };
            return { ...f, food: [...f.food, val] };
        });
    };

    const handleSubmit = async () => {
        if (!isValid()) return toast.error("Lengkapi minat & kuliner");
        setLoading(true);
        setResult(null);
        await new Promise(r => setTimeout(r, 900));
        try {
            const finalDays = range.from && range.to ? durationDays : form.durationDays;
            const durationLabel = `${finalDays} hari`;
            const allInterests = [...form.interests, ...(form.customInterest.trim() ? [form.customInterest.trim()] : [])];
            const res = await fetch("/api/ai-planner", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    location: form.destinasi || "Provinsi Gorontalo",
                    duration: durationLabel,
                    duration_days: finalDays,
                    interest: allInterests.join(", ") || "Pantai",
                    food_preference: form.food.join(", ") || "Kuliner Khas Gorontalo",
                    penginapan: form.penginapan || "Hotel & Resor",
                    custom_interest: form.customInterest.trim(),
                }),
            });
            const json = await res.json();
            if (json.success && json.data) {
                setResult(json.data);
                const exp = {};
                (json.data.days || []).forEach(d => exp[d.day_number] = true);
                setExpandedDays(exp);
                toast.success("Rencana perjalanan berhasil dibuat!");
                setTimeout(() => document.getElementById("ai-result")?.scrollIntoView({ behavior: "smooth" }), 100);
            } else toast.error("Gagal mendapatkan rekomendasi AI.");
        } catch (e) { toast.error("Gagal terhubung ke AI."); console.error(e); }
        finally { setLoading(false); }
    };

    const toggleDay = (n) => setExpandedDays(p => ({ ...p, [n]: !p[n] }));
    const copyToClipboard = () => {
        if (!result) return;
        let t = `🌟 ${result.title} 🌟\n\n📌 ${result.summary}\n\n`;
        (result.days || []).forEach(d => {
            t += `📅 HARI ${d.day_number}: ${d.title}\n`;
            (d.activities || []).forEach(a => {
                t += `  • [${a.time}] ${a.activity} @ ${a.location}\n`;
                if (a.food_recommendation) t += `    🍽 ${a.food_recommendation}\n`;
            });
            t += "\n";
        });
        if (result.budget_breakdown) t += `💰 Total: ${result.budget_breakdown.total_estimated}\n`;
        navigator.clipboard.writeText(t);
        setCopied(true); toast.success("Tersalin!"); setTimeout(() => setCopied(false), 2000);
    };

    const slideVariants = {
        enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
    };

    const filteredDestinasi = destinasiList.filter(d => !destSearch || d.label.toLowerCase().includes(destSearch.toLowerCase()));

    return (
        <section id="ai-planner" className="relative overflow-hidden bg-transparent py-[30px] md:py-[50px] scroll-mt-12">
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <Reveal y={30} className="max-w-xl">
                    <span className="text-[0.7rem] uppercase tracking-[0.15em] text-primary">AI Travel Assistant</span>
                    <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">Rencanakan Perjalanan Gorontalo dengan Pintar</h2>
                    {/* <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">4 langkah ala indonesia.travel — semua klik, tanpa dropdown.</p> */}
                </Reveal>

                {/* Progress 4 */}
                <div className="mt-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {steps.map(s => (
                                <div key={s.id} className="flex items-center gap-2">
                                    <div className={`flex size-8 items-center justify-center rounded-full border text-xs font-bold transition-all ${step >= s.id ? "bg-primary border-primary text-primary-foreground shadow-sm" : "bg-white border-border text-muted-foreground"} ${step === s.id ? "ring-2 ring-primary/20 scale-105" : ""}`}>
                                        {step > s.id ? <Check className="size-4" /> : s.id}
                                    </div>
                                    {s.id < totalSteps && <div className={`hidden h-[2px] w-8 sm:block ${step > s.id ? "bg-primary" : "bg-border"}`} />}
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{step} / {totalSteps}</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#715386]/10">
                        <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                    </div>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">{steps[step - 1].title} — {steps[step - 1].desc}</p>
                </div>

                {/* Wizard Card - rapat fit-content */}
                <div className="mt-8 flex flex-col w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm p-5 pb-7">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }} className="w-full">
                            {step === 1 && (
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
                                                        onMouseDown={e => { e.preventDefault(); setForm(f => ({ ...f, destinasi: d.value })); setDestSearch(d.label); setShowDestDropdown(false); }}
                                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${form.destinasi === d.value ? "bg-primary text-white" : "hover:bg-secondary text-foreground"}`}
                                                    >
                                                        <span>
                                                            {d.label} <span className={`ml-2 rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${form.destinasi === d.value ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>{d.unggulan ? "Unggulan" : "Rekomendasi"}</span>
                                                        </span>
                                                        <span className={`text-xs ${form.destinasi === d.value ? "text-white/80" : "text-muted-foreground"}`}>{d.desc}</span>
                                                    </button>
                                                ))}
                                                {(destSearch ? filteredDestinasi : destinasiList).length === 0 && <p className="p-3 text-xs text-muted-foreground">Tidak ada catatan</p>}
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-4 text-xs font-semibold text-muted-foreground">Destinasi unggulan</p>
                                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                        {destinasiUnggulan.map(d => (
                                            <button key={d.value} type="button" onClick={() => setForm(f => ({ ...f, destinasi: d.value }))} className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${form.destinasi === d.value ? "border-primary bg-primary text-white" : "border-border bg-card hover:bg-secondary"}`}>{d.label}<span className="block text-xs font-normal opacity-70">{d.desc}</span></button>
                                        ))}
                                    </div>
                                    {form.destinasi && <p className="mt-3 text-xs text-primary">Terpilih: <b>{form.destinasi}</b></p>}
                                </div>
                            )}
                            {step === 2 && (
                                <>
                                    <div className="text-center mb-4">
                                        <h3 className="font-display text-2xl font-bold text-foreground">Kapan petualanganmu dimulai?</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">Pilih tanggal perjalananmu dan temukan tempat terbaik • Maks 30 hari</p>
                                    </div>
                                    <div className="bg-transparent">
                                        <CalendarPicker
                                            mode="range"
                                            selected={range}
                                            onSelect={handleRange}
                                            month={month}
                                            onMonthChange={setMonth}
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
                            )}
                            {step === 3 && (
                                <div className="max-h-[520px] overflow-y-auto pr-1">
                                    <h3 className="font-display text-xl font-bold text-foreground">Ceritakan <span className="text-primary">minatmu!</span></h3>
                                    <p className="mt-1 text-xs text-muted-foreground">Pilih 1–5 minat • {form.interests.length}/5 • Tambahkan bebas</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {interests.map(o => {
                                            const active = form.interests.includes(o.value);
                                            const Icon = o.icon;
                                            return (
                                                <button key={o.value} type="button" onClick={() => toggleInterest(o.value)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? "border-primary bg-primary text-primary-foreground shadow-md scale-105" : "border-border bg-white text-foreground hover:border-primary/30 hover:bg-secondary"}`}>
                                                    <Icon className="size-4" /> {o.label} {active && <Check className="size-3.5" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <input value={form.customInterest} onChange={e => setForm(f => ({ ...f, customInterest: e.target.value }))} placeholder="Tambahkan minat bebas..." className="flex-1 rounded-xl border border-border bg-card px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                        <button type="button" onClick={() => { if (form.customInterest.trim()) { toggleInterest(form.customInterest.trim()); setForm(f => ({ ...f, customInterest: "" })); } }} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">Tambah</button>
                                    </div>
                                    {form.interests.length>0 && <div className="mt-3 flex flex-wrap gap-1.5">{form.interests.map(v => <span key={v} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{v} <button type="button" onClick={() => toggleInterest(v)}><X className="size-3" /></button></span>)}</div>}
                                    <p className="mt-6 text-xs font-semibold text-foreground">Preferensi makanan?</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {foods.map(o => {
                                            const active = form.food.includes(o.value);
                                            const Icon = o.icon;
                                            return (
                                                <button key={o.value} type="button" onClick={() => toggleFood(o.value)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${active ? "border-primary bg-primary text-white" : "border-border bg-card hover:bg-secondary"}`}>
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
                                                <button key={o.value} type="button" onClick={() => setForm(f => ({ ...f, penginapan: o.value }))} className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center ${active ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
                                                    <Icon className="size-5 text-primary" />
                                                    <span className="text-xs font-semibold">{o.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Nav - inside main card */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200">
                        <button type="button" onClick={back} disabled={step === 1} className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${step === 1 ? "border-transparent text-muted-foreground/40 cursor-not-allowed" : "border border-gray-300 bg-white hover:bg-gray-50 text-foreground"}`}>
                            <ChevronLeft className="size-4" /> Kembali
                        </button>
                        {step < totalSteps ? (
                            <button type="button" onClick={next} disabled={!isValid()} className={`inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed`}>
                                Lanjut <ChevronRight className="size-4" />
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmit} disabled={loading || !isValid()} className="inline-flex items-center gap-2 rounded-full bg-purple-300 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-purple-400 disabled:opacity-40">
                                {loading ? <><RefreshCw className="size-4 animate-spin" /> Merancang...</> : <>Mulai Rancang Itinerary ✨ <Sparkles className="size-4" /></>}
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="mt-8 rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-12 text-center">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-accent/15 text-primary"><Sparkles className="size-8 animate-bounce" /></div>
                        <h3 className="mt-6 text-xl font-bold text-foreground">AI Sedang Meracik Perjalanan Gorontalo Terbaik...</h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Merancang {form.durationDays} hari • {form.interests.join(", ")}</p>
                        <div className="mx-auto mt-6 max-w-xs overflow-hidden rounded-full bg-[#715386]/10 h-2"><div className="h-full bg-accent animate-pulse w-3/4 rounded-full" /></div>
                    </div>
                )}

                {/* Result — keep existing display */}
                {result && !loading && (
                    <div id="ai-result" className="mt-12 space-y-8">
                        <Reveal y={30}><div className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-6 md:p-8">
                            <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-primary">{form.durationDays} hari</span>
                                    </div>
                                    {(() => {
                                        const total = calcEstimasiTotal(result);
                                        return total > 0 ? (
                                            <div className="rounded-xl bg-primary px-4 py-3 text-white shadow-sm">
                                                <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] opacity-90">Estimasi Total Biaya</p>
                                                <p className="mt-1 text-xl font-bold tabular-nums">{formatRupiah(total)}</p>
                                                <p className="mt-1 text-[0.7rem] opacity-80">Akumulasi tiket destinasi + kuliner + aktivitas terpilih</p>
                                            </div>
                                        ) : null;
                                    })()}
                                    <h3 className="font-display text-2xl font-bold sm:text-3xl">{result.title}</h3>
                                    <p className="text-base leading-relaxed text-muted-foreground">{result.summary}</p>
                                    {result.highlights?.length>0 && <div className="flex flex-wrap gap-2 pt-2">{result.highlights.map((h,i)=><span key={i} className="inline-flex items-center gap-1 text-xs font-medium bg-[#715386]/10 px-3 py-1 rounded-lg"><CheckCircle2 className="size-3.5 text-primary"/>{h}</span>)}</div>}
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    <button onClick={copyToClipboard} className="inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-xs font-semibold hover:bg-secondary">{copied ? <Check className="size-4 text-emerald-500"/> : <Copy className="size-4"/>}{copied?"Tersalin":"Salin"}</button>
                                    <button onClick={()=>window.print()} className="inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2.5 text-xs font-semibold hover:bg-secondary"><Printer className="size-4"/>Cetak</button>
                                </div>
                            </div>
                        </div></Reveal>
                        {result.budget_breakdown && (
                            <Stagger stagger={0.08} className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-5">
                                {["accommodation","food","transport","attractions"].map(k=>(
                                    <motion.div key={k} variants={cardVariants} className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-4">
                                        <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">{k}</span>
                                        <p className="mt-1 text-lg font-bold">{result.budget_breakdown[k]}</p>
                                    </motion.div>
                                ))}
                                <motion.div variants={cardVariants} className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-4 col-span-2 sm:col-span-4 lg:col-span-1">
                                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-primary">Total</span>
                                    <p className="mt-1 text-xl font-bold text-primary">{result.budget_breakdown.total_estimated}</p>
                                </motion.div>
                            </Stagger>
                        )}
                        <div className="space-y-4">
                            <h4 className="font-display text-xl font-bold">📅 Jadwal Harian</h4>
                            {(result.days||[]).map(day=>{
                                const isExp=expandedDays[day.day_number];
                                return (
                                    <div key={day.day_number} className="overflow-hidden rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft">
                                        <button onClick={()=>toggleDay(day.day_number)} className="flex w-full items-center justify-between bg-card p-5 text-left hover:bg-[#715386]/[0.06]">
                                            <div className="flex items-center gap-3.5"><span className="flex size-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">H{day.day_number}</span><span className="font-display text-base font-bold sm:text-lg">{day.title}</span></div>
                                            {isExp ? <ChevronLeft className="size-5 rotate-90" /> : <ChevronRight className="size-5 rotate-90" />}
                                        </button>
                                        {isExp && <div className="border-t border-border/60 bg-background/40 p-5 space-y-4">
                                            {(day.activities||[]).map((act,i)=>(
                                                <div key={i} className="relative pl-6 border-l-2 border-primary/40 space-y-1.5 pb-3">
                                                    <span className="absolute -left-[7px] top-1 size-3 rounded-full border-2 border-primary bg-background" />
                                                    <div className="flex flex-wrap gap-2 text-xs font-semibold"><span className="inline-flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-md text-primary font-mono"><Clock className="size-3"/>{act.time}</span><span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="size-3 text-accent"/>{act.location}</span></div>
                                                    <h5 className="text-sm font-bold">{act.activity}</h5>
                                                    {act.food_recommendation && <div className="inline-flex gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-700 font-medium">🍽 {act.food_recommendation}</div>}
                                                    {act.notes && <p className="text-xs italic text-muted-foreground">💡 {act.notes}</p>}
                                                </div>
                                            ))}
                                        </div>}
                                    </div>
                                );
                            })}
                        </div>
                        {(result.food_highlights?.length>0 || result.travel_tips?.length>0) && (
                            <div className="grid gap-6 md:grid-cols-2">
                                {result.food_highlights?.length>0 && <div className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-6"><h4 className="flex items-center gap-2 font-display font-bold"><UtensilsCrossed className="size-4 text-emerald-500"/>Kuliner</h4><ul className="mt-4 space-y-2 text-xs text-muted-foreground">{result.food_highlights.map((f,i)=><li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{f}</li>)}</ul></div>}
                                {result.travel_tips?.length>0 && <div className="rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-6"><h4 className="flex items-center gap-2 font-display font-bold"><Lightbulb className="size-4 text-amber-500"/>Tips</h4><ul className="mt-4 space-y-2 text-xs text-muted-foreground">{result.travel_tips.map((t,i)=><li key={i} className="flex gap-2"><span className="text-amber-500">•</span>{t}</li>)}</ul></div>}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

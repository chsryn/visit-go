import { useState } from "react";
import {
    Sparkles,
    Calendar,
    Wallet,
    Compass,
    MapPin,
    Utensils,
    Clock,
    Copy,
    Check,
    Printer,
    RefreshCw,
    CheckCircle2,
    DollarSign,
    Lightbulb,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { toast } from "sonner";

const durations = ["1 hari", "2–3 hari", "4–5 hari", "1 minggu"];
const budgets = ["Hemat / Backpacker", "Menengah", "Premium / Sultan"];
const interests = [
    "Alam & Bahari",
    "Budaya & Sejarah",
    "Kuliner Khas",
    "Petualangan & Olahraga",
    "Belanja & Souvenir"
];
const locations = [
    "Kota Gorontalo",
    "Kab. Gorontalo",
    "Bone Bolango",
    "Pohuwato",
    "Boalemo",
    "Gorontalo Utara"
];
const foodPreferences = [
    "Halal Only",
    "Kuliner Khas Gorontalo",
    "Seafood Lover",
    "Vegetarian / Mild",
    "Non-Pedas"
];

const presets = [
    {
        name: "Weekend Backpacker Hiu Paus",
        duration: "2–3 hari",
        budget: "Hemat / Backpacker",
        interest: "Alam & Bahari",
        location: "Bone Bolango",
        food: "Halal Only"
    },
    {
        name: "Kuliner & Budaya 3 Hari",
        duration: "2–3 hari",
        budget: "Menengah",
        interest: "Kuliner Khas",
        location: "Kota Gorontalo",
        food: "Kuliner Khas Gorontalo"
    },
    {
        name: "Island Hopping & Resort Luxury",
        duration: "4–5 hari",
        budget: "Premium / Sultan",
        interest: "Alam & Bahari",
        location: "Boalemo",
        food: "Seafood Lover"
    }
];

function CustomSelect({ label, icon: Icon, options, value, onChange }) {
    return (
        <label className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                <Icon className="size-3.5 text-aqua" />
                {label}
            </span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border/80 bg-background/80 px-4 py-3.5 pr-10 text-sm font-medium text-foreground transition-all duration-200 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 hover:border-border"
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            </div>
        </label>
    );
}

export function AiPlanner() {
    const [duration, setDuration] = useState(durations[1]);
    const [budget, setBudget] = useState(budgets[1]);
    const [interest, setInterest] = useState(interests[0]);
    const [location, setLocation] = useState(locations[0]);
    const [foodPref, setFoodPref] = useState(foodPreferences[0]);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [expandedDays, setExpandedDays] = useState({});

    const applyPreset = (preset) => {
        setDuration(preset.duration);
        setBudget(preset.budget);
        setInterest(preset.interest);
        setLocation(preset.location);
        setFoodPref(preset.food);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("/api/ai-planner", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    duration,
                    budget,
                    interest,
                    location,
                    food_preference: foodPref
                })
            });

            const json = await res.json();
            if (json.success && json.data) {
                setResult(json.data);
                // Expand all days by default
                const exp = {};
                (json.data.days || []).forEach((d) => {
                    exp[d.day_number] = true;
                });
                setExpandedDays(exp);
                toast.success("Rencana perjalanan berhasil dibuat!");
            } else {
                toast.error("Gagal mendapatkan rekomendasi AI. Menggunakan rekomendasi default.");
            }
        } catch (err) {
            console.error("AI Planner error", err);
            toast.error("Terjadi masalah koneksi. Menampilkan itinerary fallback.");
        } finally {
            setLoading(false);
        }
    };

    const toggleDay = (dayNum) => {
        setExpandedDays((prev) => ({
            ...prev,
            [dayNum]: !prev[dayNum]
        }));
    };

    const copyToClipboard = () => {
        if (!result) return;
        let text = `🌟 ${result.title} 🌟\n\n`;
        text += `📌 ${result.summary}\n\n`;

        (result.days || []).forEach((d) => {
            text += `📅 HARI ${d.day_number}: ${d.title}\n`;
            (d.activities || []).forEach((act) => {
                text += `  • [${act.time}] ${act.activity} @ ${act.location}\n`;
                if (act.food_recommendation) text += `    🍽 Makanan: ${act.food_recommendation}\n`;
            });
            text += `\n`;
        });

        if (result.budget_breakdown) {
            text += `💰 ESTIMASI BIAYA:\n`;
            text += `  - Total: ${result.budget_breakdown.total_estimated}\n`;
        }

        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Itinerary berhasil disalin ke clipboard!");
        setTimeout(() => setCopied(false), 2500);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <section id="ai-planner" className="relative bg-secondary/40 py-24 scroll-mt-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-3.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-aqua">
                        <Sparkles className="size-3.5" />
                        AI Travel Assistant
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                        Rencanakan Perjalanan Gorontalo dengan Pintar
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                        Pilih durasi, anggaran, minat, lokasi, dan preferensi makanan Anda. Asisten AI kami akan menyusun rencana perjalanan personal dalam hitungan detik.
                    </p>
                </div>

                {/* Preset Chips */}
                <div className="mt-8 flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                        Rencana Cepat:
                    </span>
                    {presets.map((p, idx) => (
                        <button
                            key={idx}
                            onClick={() => applyPreset(p)}
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all duration-200 hover:border-terracotta hover:bg-terracotta/10 hover:text-terracotta"
                        >
                            <Sparkles className="size-3 text-terracotta" />
                            {p.name}
                        </button>
                    ))}
                </div>

                {/* Main Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 rounded-3xl border border-border/70 bg-card p-6 shadow-xl shadow-black/5 md:p-8"
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
                        <CustomSelect
                            label="Durasi"
                            icon={Calendar}
                            options={durations}
                            value={duration}
                            onChange={setDuration}
                        />
                        <CustomSelect
                            label="Budget"
                            icon={Wallet}
                            options={budgets}
                            value={budget}
                            onChange={setBudget}
                        />
                        <CustomSelect
                            label="Minat Utamamu"
                            icon={Compass}
                            options={interests}
                            value={interest}
                            onChange={setInterest}
                        />
                        <CustomSelect
                            label="Lokasi Tujuan"
                            icon={MapPin}
                            options={locations}
                            value={location}
                            onChange={setLocation}
                        />
                        <CustomSelect
                            label="Preferensi Makanan"
                            icon={Utensils}
                            options={foodPreferences}
                            value={foodPref}
                            onChange={setFoodPref}
                        />
                    </div>

                    <div className="mt-8 flex items-center justify-end border-t border-border/60 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-terracotta px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-terracotta/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sand-deep hover:shadow-xl sm:w-auto"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="size-4 animate-spin" />
                                    Menyusun Rekomendasi AI...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4" />
                                    Generate Itinerary Pintar
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Loading State Animation */}
                {loading && (
                    <div className="mt-12 rounded-3xl border border-terracotta/20 bg-card p-12 text-center shadow-lg">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta">
                            <Sparkles className="size-8 animate-bounce" />
                        </div>
                        <h3 className="mt-6 text-xl font-bold text-foreground">
                            AI Sedang Meracik Perjalanan Gorontalo Terbaik...
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                            Menyeimbangkan preferensi lokasi ({location}), budget ({budget}), dan menu kuliner ({foodPref}).
                        </p>
                        <div className="mx-auto mt-6 max-w-xs overflow-hidden rounded-full bg-secondary h-2">
                            <div className="h-full bg-terracotta animate-pulse w-3/4 rounded-full" />
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {result && !loading && (
                    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Summary Header Card */}
                        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl md:p-8">
                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-bold text-terracotta">
                                            {duration}
                                        </span>
                                        <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-bold text-aqua">
                                            {budget}
                                        </span>
                                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                                            📍 {location}
                                        </span>
                                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            🍽 {foodPref}
                                        </span>
                                    </div>
                                    <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                                        {result.title}
                                    </h3>
                                    <p className="text-base leading-relaxed text-muted-foreground">
                                        {result.summary}
                                    </p>

                                    {result.highlights && result.highlights.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {result.highlights.map((h, i) => (
                                                <span key={i} className="inline-flex items-center gap-1 text-xs font-medium text-foreground bg-secondary/80 px-3 py-1 rounded-lg">
                                                    <CheckCircle2 className="size-3.5 text-aqua" />
                                                    {h}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex shrink-0 items-center gap-3 border-t border-border/60 pt-4 md:border-t-0 md:pt-0">
                                    <button
                                        onClick={copyToClipboard}
                                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-secondary"
                                    >
                                        {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                                        {copied ? "Tersalin!" : "Salin"}
                                    </button>
                                    <button
                                        onClick={handlePrint}
                                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-secondary"
                                    >
                                        <Printer className="size-4" />
                                        Cetak
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Budget Breakdown Cards */}
                        {result.budget_breakdown && (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                                <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">Akomodasi</span>
                                    <p className="mt-1 text-lg font-bold text-foreground">{result.budget_breakdown.accommodation}</p>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">Konsumsi</span>
                                    <p className="mt-1 text-lg font-bold text-foreground">{result.budget_breakdown.food}</p>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">Transportasi</span>
                                    <p className="mt-1 text-lg font-bold text-foreground">{result.budget_breakdown.transport}</p>
                                </div>
                                <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">Tiket/Aktivitas</span>
                                    <p className="mt-1 text-lg font-bold text-foreground">{result.budget_breakdown.attractions}</p>
                                </div>
                                <div className="col-span-2 rounded-2xl border border-terracotta/30 bg-terracotta/5 p-4 shadow-sm sm:col-span-4 lg:col-span-1">
                                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-terracotta">Total Estimasi</span>
                                    <p className="mt-1 text-xl font-extrabold text-terracotta">{result.budget_breakdown.total_estimated}</p>
                                </div>
                            </div>
                        )}

                        {/* Day by Day Accordion / Timeline */}
                        <div className="space-y-4">
                            <h4 className="font-display text-xl font-bold text-foreground">
                                📅 Jadwal Perjalanan Harian
                            </h4>

                            {(result.days || []).map((day) => {
                                const isExp = expandedDays[day.day_number];
                                return (
                                    <div
                                        key={day.day_number}
                                        className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-200"
                                    >
                                        <button
                                            onClick={() => toggleDay(day.day_number)}
                                            className="flex w-full items-center justify-between bg-card p-5 text-left transition-colors hover:bg-secondary/40"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-terracotta text-sm font-bold text-primary-foreground">
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
                                                        className="relative pl-6 border-l-2 border-aqua/40 space-y-1.5 pb-3 last:pb-0"
                                                    >
                                                        <span className="absolute -left-[7px] top-1 size-3 rounded-full border-2 border-aqua bg-background" />

                                                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                                                            <span className="inline-flex items-center gap-1 text-aqua font-mono bg-aqua/10 px-2 py-0.5 rounded-md">
                                                                <Clock className="size-3" />
                                                                {act.time}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                                                                <MapPin className="size-3 text-terracotta" />
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
                                                                <Utensils className="size-3.5 shrink-0 mt-0.5" />
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

                        {/* Culinary Highlights & Tips */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {result.food_highlights && result.food_highlights.length > 0 && (
                                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                                    <h4 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                                        <Utensils className="size-4 text-emerald-500" />
                                        Rekomendasi Kuliner ({foodPref})
                                    </h4>
                                    <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                                        {result.food_highlights.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-emerald-500 font-bold">•</span>
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {result.travel_tips && result.travel_tips.length > 0 && (
                                <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
                                    <h4 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                                        <Lightbulb className="size-4 text-amber-500" />
                                        Tips Penting Perjalanan
                                    </h4>
                                    <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                                        {result.travel_tips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-amber-500 font-bold">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

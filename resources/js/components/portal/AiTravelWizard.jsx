import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { differenceInCalendarDays, addDays } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    destinasiList,
    destinasiUnggulan,
    interests,
    foods,
    penginapanList,
    steps,
    MAX_INTERESTS,
    MAX_TRIP_DAYS,
} from "./wizard/wizardOptions";
import StepDestination from "./wizard/StepDestination";
import StepDate from "./wizard/StepDate";
import StepPreferences from "./wizard/StepPreferences";
import WizardProgress from "./wizard/WizardProgress";
import WizardResult from "./wizard/WizardResult";

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
    const durationDays = range.from && range.to ? Math.min(MAX_TRIP_DAYS, differenceInCalendarDays(range.to, range.from) + 1) : range.from ? 1 : form.durationDays;
    const disabledAfter = range.from ? addDays(range.from, MAX_TRIP_DAYS - 1) : undefined;
    const handleRange = (val) => {
        if (!val) { setRange({ from: undefined, to: undefined }); return; }
        if (val.from && val.to) {
            const d = differenceInCalendarDays(val.to, val.from) + 1;
            if (d > MAX_TRIP_DAYS) { toast.error(`Maksimal ${MAX_TRIP_DAYS} hari`); return; }
            setRange(val);
            setForm(f => ({ ...f, durationDays: Math.min(MAX_TRIP_DAYS, d) }));
        } else {
            setRange(val);
            if (val.from && !val.to) setForm(f => ({ ...f, durationDays: 1 }));
        }
    };
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const isValid = () => {
        if (step === 1) return !!form.destinasi;
        if (step === 2) return !!range.from && !!range.to && durationDays >= 1 && durationDays <= MAX_TRIP_DAYS;
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
            if (f.interests.length >= MAX_INTERESTS) { toast.error(`Maksimal ${MAX_INTERESTS} minat ya!`); return f; }
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
    const patchForm = (patch) => setForm(f => ({ ...f, ...patch }));
    const selectDestinasi = (d) => {
        setForm(f => ({ ...f, destinasi: d.value }));
        setDestSearch(d.label);
        setShowDestDropdown(false);
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
                toast.success("Rencana perjalanan berhasil dibuat!");
                setTimeout(() => document.getElementById("ai-result")?.scrollIntoView({ behavior: "smooth" }), 100);
            } else toast.error("Gagal mendapatkan rekomendasi AI.");
        } catch (e) { toast.error("Gagal terhubung ke AI."); console.error(e); }
        finally { setLoading(false); }
    };

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
                </Reveal>

                <WizardProgress steps={steps} step={step} totalSteps={totalSteps} progress={progress} />

                {/* Wizard Card - rapat fit-content */}
                <div className="mt-8 flex flex-col w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm p-5 pb-7">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }} className="w-full">
                            {step === 1 && (
                                <StepDestination
                                    destSearch={destSearch}
                                    setDestSearch={setDestSearch}
                                    showDestDropdown={showDestDropdown}
                                    setShowDestDropdown={setShowDestDropdown}
                                    filteredDestinasi={filteredDestinasi}
                                    destinasiList={destinasiList}
                                    destinasiUnggulan={destinasiUnggulan}
                                    selected={form.destinasi}
                                    onSelect={selectDestinasi}
                                />
                            )}
                            {step === 2 && (
                                <StepDate
                                    range={range}
                                    onSelectRange={handleRange}
                                    month={month}
                                    onMonthChange={setMonth}
                                    today={today}
                                    disabledAfter={disabledAfter}
                                    isMobile={isMobile}
                                    durationDays={durationDays}
                                />
                            )}
                            {step === 3 && (
                                <StepPreferences
                                    form={form}
                                    interests={interests}
                                    foods={foods}
                                    penginapanList={penginapanList}
                                    onToggleInterest={toggleInterest}
                                    onToggleFood={toggleFood}
                                    onChange={patchForm}
                                />
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

                {/* Result */}
                {result && !loading && (
                    <WizardResult result={result} durationDays={form.durationDays} copied={copied} onCopy={copyToClipboard} />
                )}
            </div>
        </section>
    );
}

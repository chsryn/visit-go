import { useState } from "react";
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Compass,
    RefreshCw,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { differenceInCalendarDays, addDays } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    destinasiList,
    destinasiUnggulan,
    interests,
    steps,
    MAX_INTERESTS,
    MAX_TRIP_DAYS,
} from "./wizard/wizardOptions";
import WizardSteps from "./wizard/WizardSteps";
import WizardResult from "./wizard/WizardResult";

export function AiTravelWizard() {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);
    const [form, setForm] = useState({
        destinasi: "",
        durationDays: 3,
        interests: [],
        customInterest: "",
    });
    const [range, setRange] = useState({ from: undefined, to: undefined });
    const [destSearch, setDestSearch] = useState("");
    const [showDestDropdown, setShowDestDropdown] = useState(false);
    const isMobile = useIsMobile();
    const [today] = useState(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });
    const [month, setMonth] = useState(today);
    const durationDays =
        range.from && range.to
            ? Math.min(
                  MAX_TRIP_DAYS,
                  differenceInCalendarDays(range.to, range.from) + 1,
              )
            : range.from
              ? 1
              : form.durationDays;
    const disabledAfter = range.from
        ? addDays(range.from, MAX_TRIP_DAYS - 1)
        : undefined;
    const handleRange = (val) => {
        if (!val) {
            setRange({ from: undefined, to: undefined });
            return;
        }
        if (val.from && val.to) {
            const d = differenceInCalendarDays(val.to, val.from) + 1;
            if (d > MAX_TRIP_DAYS) {
                toast.error(`Maksimal ${MAX_TRIP_DAYS} hari`);
                return;
            }
            setRange(val);
            setForm((f) => ({
                ...f,
                durationDays: Math.min(MAX_TRIP_DAYS, d),
            }));
        } else {
            setRange(val);
            if (val.from && !val.to)
                setForm((f) => ({ ...f, durationDays: 1 }));
        }
    };
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const isValid = () => {
        if (step === 1) return !!form.destinasi;
        if (step === 2)
            return (
                !!range.from &&
                !!range.to &&
                durationDays >= 1 &&
                durationDays <= MAX_TRIP_DAYS
            );
        if (step === 3) return form.interests.length >= 1;
        return false;
    };

    const next = () => {
        if (!isValid()) {
            if (step === 1) return toast.error("Pilih destinasi dulu");
            if (step === 2)
                return toast.error(
                    "Pilih tanggal mulai & selesai (maks 30 hari)",
                );
            if (step === 3) return toast.error("Pilih minimal 1 minat");
            return toast.error("Lengkapi dulu ya!");
        }
        if (step === 2) setForm((f) => ({ ...f, durationDays }));
        if (step < totalSteps) {
            setDirection(1);
            setStep((s) => s + 1);
        }
    };
    const back = () => {
        if (step > 1) {
            setDirection(-1);
            setStep((s) => s - 1);
        }
    };

    const toggleInterest = (val) => {
        setForm((f) => {
            const has = f.interests.includes(val);
            if (has)
                return {
                    ...f,
                    interests: f.interests.filter((v) => v !== val),
                };
            if (f.interests.length >= MAX_INTERESTS) {
                toast.error(`Maksimal ${MAX_INTERESTS} minat ya!`);
                return f;
            }
            return { ...f, interests: [...f.interests, val] };
        });
    };
    const patchForm = (patch) => setForm((f) => ({ ...f, ...patch }));
    const selectDestinasi = (d) => {
        setForm((f) => ({ ...f, destinasi: d.value }));
        setDestSearch(d.label);
        setShowDestDropdown(false);
    };

    const handleSubmit = async () => {
        if (!isValid()) return toast.error("Lengkapi minat ya!");
        setLoading(true);
        setResult(null);
        try {
            const finalDays =
                range.from && range.to ? durationDays : form.durationDays;
            const durationLabel = `${finalDays} hari`;
            const allInterests = [
                ...form.interests,
                ...(form.customInterest.trim()
                    ? [form.customInterest.trim()]
                    : []),
            ];
            const csrf = document.querySelector(
                'meta[name="csrf-token"]',
            )?.content;
            const res = await fetch("/api/ai-planner", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    location: form.destinasi || "Provinsi Gorontalo",
                    duration: durationLabel,
                    duration_days: finalDays,
                    interest: allInterests.join(", ") || "Pantai",
                    custom_interest: form.customInterest.trim(),
                }),
            });
            if (res.status === 419) {
                toast.error("Sesi habis — muat ulang halaman.");
                return;
            }
            if (res.status === 429) {
                toast.error("Terlalu banyak permintaan — coba lagi sebentar.");
                return;
            }
            const json = await res.json();
            if (json.success && json.data) {
                setResult(json.data);
                toast.success("Rencana perjalanan berhasil dibuat!");
                setTimeout(
                    () =>
                        document
                            .getElementById("ai-result")
                            ?.scrollIntoView({ behavior: "smooth" }),
                    100,
                );
            } else
                toast.error(
                    json.message || "Gagal mendapatkan rekomendasi AI.",
                );
        } catch (e) {
            toast.error("Gagal terhubung ke AI.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const slideVariants = {
        enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
    };

    const filteredDestinasi = destinasiList.filter(
        (d) =>
            !destSearch ||
            d.label.toLowerCase().includes(destSearch.toLowerCase()),
    );

    return (
        <section
            id="ai-planner"
            className="relative overflow-x-clip bg-transparent py-[30px] md:py-[50px] scroll-mt-12"
        >
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <Reveal y={30} className="max-w-xl">

                    <h2 className="font-display text-[32px] font-bold leading-[1.04] tracking-tight text-foreground md:text-[30px]">
                        Rancang Perjalanan Wisata <br></br> Gorontalo dengan{" "}
                        <span className="font-normal italic text-ocean">
                            Dulohupa AI
                        </span>
                        <br></br>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Mulai rancang perjalanan wisata Gorontalo sesuai minatmu,<br></br> biarkan AI kami menyusun itinerary terbaik untukmu.
                    </p>
                </Reveal>

                <div className="mt-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {steps.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className={`flex size-8 items-center justify-center rounded-full border text-xs font-bold transition-all ${step >= s.id ? "bg-primary border-primary text-primary-foreground shadow-sm" : "bg-white border-border text-muted-foreground"} ${step === s.id ? "ring-2 ring-primary/20 scale-105" : ""}`}
                                    >
                                        {step > s.id ? (
                                            <Check className="size-4" />
                                        ) : (
                                            s.id
                                        )}
                                    </div>
                                    {s.id < totalSteps && (
                                        <div
                                            className={`hidden h-[2px] w-8 sm:block ${step > s.id ? "bg-primary" : "bg-border"}`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                            {step} / {totalSteps}
                        </span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#715386]/10">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                        {steps[step - 1].title} — {steps[step - 1].desc}
                    </p>
                </div>

                {/* Wizard Card - rapat fit-content */}
                <div className="mt-8 flex flex-col w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm p-5 pb-7">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="w-full"
                        >
                            <WizardSteps
                                step={step}
                                destSearch={destSearch}
                                setDestSearch={setDestSearch}
                                showDestDropdown={showDestDropdown}
                                setShowDestDropdown={setShowDestDropdown}
                                filteredDestinasi={filteredDestinasi}
                                destinasiList={destinasiList}
                                destinasiUnggulan={destinasiUnggulan}
                                selected={form.destinasi}
                                onSelect={selectDestinasi}
                                range={range}
                                onSelectRange={handleRange}
                                month={month}
                                onMonthChange={setMonth}
                                today={today}
                                disabledAfter={disabledAfter}
                                isMobile={isMobile}
                                durationDays={durationDays}
                                form={form}
                                interests={interests}
                                onToggleInterest={toggleInterest}
                                onChange={patchForm}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Nav - inside main card */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={back}
                            disabled={step === 1}
                            className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-medium transition-all ${step === 1 ? "border-transparent text-muted-foreground/40 cursor-not-allowed" : "border-border bg-white hover:bg-gray-50 text-foreground"}`}
                        >
                            <ChevronLeft className="size-4" /> Kembali
                        </button>
                        {step < totalSteps ? (
                            <button
                                type="button"
                                onClick={next}
                                disabled={!isValid()}
                                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-6 py-2.5 text-sm font-semibold text-foreground shadow-soft transition-all hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Lanjut <ChevronRight className="size-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading || !isValid()}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="size-4 animate-spin" />
                                        Membuat...
                                    </>
                                ) : (
                                    <>
                                        <Compass className="size-4" />
                                        Buat Rencana
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="mt-8 rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft p-12 text-center">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-accent/15 text-primary">
                            <Sparkles className="size-8 animate-bounce" />
                        </div>
                        <h3 className="mt-6 text-xl font-bold text-foreground">
                            AI Sedang Meracik Perjalanan Gorontalo Terbaik...
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                            Merancang {form.durationDays} hari •{" "}
                            {form.interests.join(", ")}
                        </p>
                        <div className="mx-auto mt-6 max-w-xs overflow-hidden rounded-full bg-[#715386]/10 h-2">
                            <div className="h-full bg-accent animate-pulse w-3/4 rounded-full" />
                        </div>
                    </div>
                )}

                {/* Result */}
                {result && !loading && <WizardResult result={result} />}
            </div>
        </section>
    );
}

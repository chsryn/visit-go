import { Check } from "lucide-react";
import { motion } from "framer-motion";

/** Indikator progres step wizard. */
export default function WizardProgress({ steps, step, totalSteps, progress }) {
    return (
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
    );
}

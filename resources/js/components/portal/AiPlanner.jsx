import { useState } from "react";
import { Sparkles } from "lucide-react";
const durations = ["1 hari", "2–3 hari", "4–5 hari", "1 minggu"];
const budgets = ["Hemat", "Menengah", "Premium"];
const interests = ["Alam & Bahari", "Budaya & Sejarah", "Kuliner", "Keluarga"];
function Select({ label, options, value, onChange, }) {
    return (<label className="flex min-w-0 flex-1 flex-col gap-2">
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
        {options.map((opt) => (<option key={opt}>{opt}</option>))}
      </select>
    </label>);
}
export function AiPlanner() {
    const [duration, setDuration] = useState(durations[1]);
    const [budget, setBudget] = useState(budgets[1]);
    const [interest, setInterest] = useState(interests[0]);
    const [submitted, setSubmitted] = useState(false);
    return (<section id="ai-planner" className="bg-secondary/50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-xl">
          <span className="text-[0.7rem] uppercase tracking-[0.35em] text-aqua">
            Asisten Perjalanan
          </span>
          <h2 className="mt-6 font-display text-3xl leading-tight text-foreground sm:text-4xl">
            Rencanakan Perjalanan Anda dengan AI
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Pilih durasi, budget, dan minat Anda &mdash; asisten kami akan menyusun
            rencana perjalanan Gorontalo yang pas untuk Anda.
          </p>
        </div>

        <form className="mt-12 flex flex-col gap-8 rounded-2xl bg-card p-8 shadow-md md:flex-row md:items-end" onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
        }}>
          <Select label="Durasi" options={durations} value={duration} onChange={setDuration}/>
          <Select label="Budget" options={budgets} value={budget} onChange={setBudget}/>
          <Select label="Minat" options={interests} value={interest} onChange={setInterest}/>
          <button type="submit" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-terracotta px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-sand-deep hover:shadow-md">
            <Sparkles className="size-4"/>
            Generate Itinerary
          </button>
        </form>

        {submitted && (<p className="mt-6 rounded-lg border border-border bg-card px-6 py-4 text-sm leading-relaxed text-muted-foreground">
            Fitur asisten AI akan segera hadir. Untuk saat ini, jelajahi kategori destinasi,
            budaya, kuliner, dan kerajinan di bawah ini.
          </p>)}
      </div>
    </section>);
}

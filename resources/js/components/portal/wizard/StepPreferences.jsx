import { Check, X } from "lucide-react";
import { MAX_INTERESTS } from "./wizardOptions";

/** Step 3: minat, minat bebas, makanan, dan penginapan. */
export default function StepPreferences({
    form,
    interests,
    foods,
    penginapanList,
    onToggleInterest,
    onToggleFood,
    onChange,
}) {
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

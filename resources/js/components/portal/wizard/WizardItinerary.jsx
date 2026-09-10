import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, MapPin, UtensilsCrossed } from "lucide-react";

/**
 * Planning: jadwal perjalanan harian (day accordion + timeline aktivitas).
 * Diadaptasi dari AiPlanner agar wizard punya satu tampilan planning.
 */
export default function WizardItinerary({ days }) {
    const [expanded, setExpanded] = useState(() => ({ 1: true }));
    if (!days || days.length === 0) return null;

    const toggle = (n) => setExpanded((p) => ({ ...p, [n]: !p[n] }));

    return (
        <div className="space-y-4">
            <h4 className="font-display text-xl font-bold text-foreground">
                📅 Jadwal Perjalanan Harian
            </h4>

            {days.map((day) => {
                const isExp = !!expanded[day.day_number];
                return (
                    <div
                        key={day.day_number}
                        className="overflow-hidden rounded-[15px] border border-white/30 bg-white/65 backdrop-blur-xl shadow-soft transition-all duration-200"
                    >
                        <button
                            type="button"
                            onClick={() => toggle(day.day_number)}
                            className="flex w-full items-center justify-between bg-card p-5 text-left transition-colors hover:bg-[#715386]/[0.06]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
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
                                        className="relative pl-6 border-l-2 border-primary/40 space-y-1.5 pb-3 last:pb-0"
                                    >
                                        <span className="absolute -left-[7px] top-1 size-3 rounded-full border-2 border-primary bg-background" />

                                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                                            <span className="inline-flex items-center gap-1 text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md">
                                                <Clock className="size-3" />
                                                {act.time}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                                                <MapPin className="size-3 text-accent" />
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
                                                <UtensilsCrossed className="size-3.5 shrink-0 mt-0.5" />
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
    );
}

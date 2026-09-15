import { useState } from "react";
import { Check, ChevronDown, RotateCcw } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function FilterDropdown({ ariaLabel, value, emptyValue = "semua", options, onChange }) {
    const [open, setOpen] = useState(false);
    const current = options.find((o) => o.value === value);
    const filtered = value !== emptyValue;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label={ariaLabel}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm font-medium shadow-xs outline-none transition-colors hover:border-primary/50 hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary/20 sm:w-64"
                >
                    <span className="truncate">{current?.label ?? "Semua"}</span>
                    <span className="flex shrink-0 items-center gap-1.5">
                        {filtered && (
                            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                        )}
                        <ChevronDown
                            aria-hidden
                            className={cn(
                                "size-4 text-muted-foreground transition-transform duration-200",
                                open && "rotate-180",
                            )}
                        />
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="center"
                className="min-w-56 rounded-xl bg-white/95 p-1.5 shadow-xl backdrop-blur-md"
            >
                {options.map((o) => {
                    const active = o.value === value;
                    return (
                        <DropdownMenuItem
                            key={o.value}
                            onClick={() => onChange(o.value)}
                            className={cn(
                                "cursor-pointer gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-primary/5",
                                active
                                    ? "font-semibold text-primary"
                                    : "text-muted-foreground",
                            )}
                        >
                            <span className="truncate">{o.label}</span>
                            <Check
                                aria-hidden
                                className={cn(
                                    "ml-auto size-4 shrink-0 transition-opacity",
                                    active ? "opacity-100" : "opacity-0",
                                )}
                            />
                        </DropdownMenuItem>
                    );
                })}
                {filtered && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onChange(emptyValue)}
                            className="cursor-pointer gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-primary/5"
                        >
                            <RotateCcw aria-hidden className="size-4 shrink-0" />
                            Reset Filter
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
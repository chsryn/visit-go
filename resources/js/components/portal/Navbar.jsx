import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
const links = [
    { label: "Destinasi", href: "#destinasi" },
    { label: "Budaya", href: "#kategori" },
    { label: "Kuliner", href: "#kategori" },
    { label: "Kerajinan", href: "#kategori" },
    { label: "Event", href: "#agenda" },
];
export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        // ini navbar blur
        // <header
        //     className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all duration-300 ${scrolled ? "bg-card/95 shadow-soft backdrop-blur-md" : "bg-black/40 backdrop-blur-md"}`}
        // >
        //     <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        //         <a href="#top" className="flex items-baseline gap-2">

        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-card shadow-md" : "bg-transparent"}`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                <a href="#top" className="flex items-end gap-1.5 pb-0.5">
                    <span
                        className={`font-display text-xl font-bold leading-none tracking-tight transition-colors duration-300 ${scrolled ? "text-ocean" : "text-primary-foreground"}`}
                    >
                        Visit
                    </span>
                    <span
                        className={`text-[0.7rem] font-semibold uppercase tracking-[0.25em] leading-none transition-colors duration-300 ${scrolled ? "text-muted-foreground" : "text-aqua-soft/80"}`}
                    >
                        Gorontalo wael
                    </span>
                </a>

                <nav className="hidden items-center gap-8 md:flex">
                    {links.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={`text-sm font-medium transition-colors duration-300 ${
                                scrolled
                                    ? "text-muted-foreground hover:text-ocean"
                                    : "text-primary-foreground/85 hover:text-primary-foreground"
                            }`}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="#ai-planner"
                        className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all duration-300 hover:-translate-y-1 hover:bg-sand-deep"
                    >
                        AI Guide Plan
                    </a>
                </nav>

                <button
                    type="button"
                    aria-label="Toggle menu"
                    onClick={() => setOpen((v) => !v)}
                    className={`md:hidden ${scrolled ? "text-ocean" : "text-primary-foreground"}`}
                >
                    {open ? (
                        <X className="size-6" />
                    ) : (
                        <Menu className="size-6" />
                    )}
                </button>
            </div>

            {open && (
                <div className="border-t border-border bg-card px-6 py-6 md:hidden">
                    <nav className="flex flex-col gap-4">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="text-sm font-medium text-muted-foreground"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#ai-planner"
                            onClick={() => setOpen(false)}
                            className="rounded-full bg-terracotta px-6 py-3 text-center text-sm font-semibold text-primary-foreground"
                        >
                            Rencanakan Perjalanan
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}

import { useEffect, useState, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X, ChevronDown, Check } from "lucide-react";
import { AudioPlayer } from "@/components/portal/AudioPlayer";

const langs = [
    { code: "id", label: "Indonesia", short: "ID" },
    { code: "en", label: "English", short: "EN" },
];

function triggerGoogleTranslate(code) {
    try {
        localStorage.setItem("locale", code);
        document.documentElement.lang = code;
        document.cookie = `googtrans=/id/${code};path=/`;
        document.cookie = `googtrans=/id/${code};path=/;domain=${window.location.hostname}`;
        const combo = document.querySelector(".goog-te-combo");
        if (combo) {
            combo.value = code;
            combo.dispatchEvent(new Event("change"));
            if (code === "id") {
                document.cookie =
                    "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
                document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname}`;
                window.location.reload();
            }
        } else if (code !== "id") window.location.reload();
        else {
            document.cookie =
                "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
            window.location.reload();
        }
    } catch {}
}

// Fallback jika props.nav belum terisi — cegah crash, tampilkan 6 slug MVP
const fallbackNav = {
    destinasi: [
        {
            label: "Wisata Hiu Paus Botubarani",
            href: "/destinasi/hiu-paus-botubarani",
            desc: "Bone Bolango",
        },
        {
            label: "Taman Laut Olele",
            href: "/destinasi/taman-laut-olele",
            desc: "Teluk Tomini",
        },
        { label: "Pulo Cinta", href: "/destinasi/pulo-cinta", desc: "Boalemo" },
    ],
    budaya: [
        {
            label: "Tari Saronde",
            href: "/budaya/tari-saronde",
            desc: "Tari Penyambutan",
        },
        {
            label: "Tradisi Dikili",
            href: "/budaya/tradisi-dikili",
            desc: "Maulid Nabi",
        },
    ],
    kuliner: [
        {
            label: "Milu Siram",
            href: "/kuliner/milu-siram",
            desc: "Jagung Siram",
        },
        { label: "Ilabulo", href: "/kuliner/ilabulo", desc: "Pepes Sagu" },
    ],
    kerajinan: [
        {
            label: "Sulaman Karawo",
            href: "/kerajinan/sulaman-karawo",
            desc: "Kota Gorontalo",
        },
        {
            label: "Anyaman Rotan",
            href: "/kerajinan/anyaman-rotan",
            desc: "Kerajinan Lokal",
        },
    ],
    event: [
        {
            label: "Karnaval Karawo 2026",
            href: "/event/karnaval-karawo-2026",
            desc: "11–13 Sep \u00B7 GPCC",
        },
        {
            label: "Tradisi Dikili",
            href: "/event/tradisi-dikili",
            desc: "Sep 2026",
        },
        {
            label: "FESBUJATON XX",
            href: "/event/fesbujaton-xx",
            desc: "9 Jul \u00B7 Mootilango",
        },
    ],
};

function DropdownPanel({ items }) {
    return (
        <div className="invisible absolute left-1/2 top-full z-50 mt-3 min-w-[240px] -translate-x-1/2 translate-y-1 rounded-lg border border-border bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="grid max-h-[320px] gap-0.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map((it) => (
                    <Link
                        key={it.href}
                        href={it.href}
                        className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                    >
                        {it.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export function Navbar() {
    const { props } = usePage();
    const nav = props.nav ?? null;

    const toItems = (rows, base) => {
        if (!Array.isArray(rows) || rows.length === 0) return null;
        return rows.map((r) => ({
            label: r.name,
            href: `/${base}/${r.slug}`,
        }));
    };

    const itemsByCat = {
        destinasi:
            toItems(
                nav?.categories?.filter((c) => c.category === "destinasi"),
                "destinasi",
            ) ?? fallbackNav.destinasi,
        budaya:
            toItems(
                nav?.categories?.filter((c) => c.category === "budaya"),
                "budaya",
            ) ?? fallbackNav.budaya,
        kuliner:
            toItems(
                nav?.categories?.filter((c) => c.category === "kuliner"),
                "kuliner",
            ) ?? fallbackNav.kuliner,
        kerajinan:
            toItems(
                nav?.categories?.filter((c) => c.category === "kerajinan"),
                "kerajinan",
            ) ?? fallbackNav.kerajinan,
        event: toItems(nav?.events, "event") ?? fallbackNav.event,
    };

    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(null);
    const [locale, setLocale] = useState(() => {
        try {
            const m = document.cookie.match(/(?:^|;)\s*googtrans=([^;]+)/);
            if (m) return decodeURIComponent(m[1]).split("/").pop() || "id";
            return (
                localStorage.getItem("locale") ||
                document.documentElement.lang ||
                "id"
            );
        } catch {
            return "id";
        }
    });
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef(null);
    const t = { plan: "AI Guide Plan", lang: locale === "en" ? "EN" : "ID" };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    useEffect(() => {
        const h = (e) => {
            if (langRef.current && !langRef.current.contains(e.target))
                setLangOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const menu = [
        { key: "destinasi", label: "Destinasi", items: itemsByCat.destinasi },
        { key: "budaya", label: "Budaya", items: itemsByCat.budaya },
        { key: "kuliner", label: "Kuliner", items: itemsByCat.kuliner },
        { key: "kerajinan", label: "Kerajinan", items: itemsByCat.kerajinan },
        { key: "event", label: "Event", items: itemsByCat.event },
    ];

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 border-white/20 shadow-soft" : "bg-transparent border-transparent"}`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                <Link
                    href="/"
                    className="flex flex-col items-start leading-none notranslate"
                    translate="no"
                >
                    <span
                        className={`font-display text-[24px] font-bold leading-none tracking-tight md:text-[28px] lg:text-[30px] ${scrolled ? "text-black" : "text-primary-foreground"}`}
                    >
                        Visit
                    </span>
                    <span
                        className={`text-[11px] font-semibold uppercase tracking-[0.14em] leading-none md:text-[13px] ${scrolled ? "text-black/60" : "text-primary-foreground/70"}`}
                    >
                        Gorontalo 
                    </span>
                </Link>

                <nav className="hidden items-center gap-4 md:flex lg:gap-5">
                    {menu.map((m) =>
                        m.key === "event" ? (
                            <Link
                                key={m.key}
                                href="/event"
                                className={`relative inline-flex items-center pb-1 text-[16px] font-semibold tracking-normal transition-colors ${scrolled ? "text-black hover:text-black" : "text-primary-foreground/85 hover:text-primary-foreground"}`}
                            >
                                {m.label}
                                <span className={`pointer-events-none absolute inset-x-0 -bottom-1 h-[1.5px] origin-left scale-x-0 transition-transform duration-300 hover:scale-x-100 ${scrolled ? "bg-black" : "bg-primary-foreground"}`} />
                            </Link>
                        ) : (
                            <div key={m.key} className="group relative">
                                <span className="group/link relative inline-flex items-center gap-1 pb-1">
                                    <Link
                                        href={`/${m.key}`}
                                        className={`text-[16px] font-semibold tracking-normal transition-colors ${scrolled ? "text-black group-hover/link:text-black" : "text-primary-foreground/85 group-hover/link:text-primary-foreground"}`}
                                    >
                                        {m.label}
                                    </Link>
                                    <ChevronDown
                                        className={`size-[0.85em] shrink-0 pointer-events-none transition-transform duration-300 group-hover/link:rotate-180 ${scrolled ? "text-black/70 group-hover/link:text-black" : "text-primary-foreground/80 group-hover/link:text-primary-foreground"}`}
                                    />
                                    <span
                                        className={`pointer-events-none absolute inset-x-0 -bottom-1 h-[1.5px] origin-left scale-x-0 transition-transform duration-300 group-hover/link:scale-x-100 ${scrolled ? "bg-black" : "bg-primary-foreground"}`}
                                    />
                                </span>
                                <DropdownPanel items={m.items} />
                            </div>
                        ),
                    )}
                    <div className="relative" ref={langRef}>
                        <button
                            type="button"
                            onClick={() => setLangOpen((v) => !v)}
                            className={`relative inline-flex items-center gap-1.5 pb-1 text-[16px] font-semibold tracking-normal transition-colors ${scrolled ? "text-black hover:text-black" : "text-primary-foreground/85 hover:text-primary-foreground"}`}
                        >
                            <img src={`/flags/${locale}.svg`} alt={locale} width="24" height="24" className="size-[1em] shrink-0 rounded-[2px] object-cover" />
                            {t.lang}
                            <ChevronDown
                                className={`size-[0.85em] shrink-0 text-current transition-transform duration-300 ${langOpen ? "rotate-180" : ""} ${scrolled ? "text-black/70" : "text-primary-foreground/80"}`}
                            />
                        </button>
                        {langOpen && (
                            <div className="absolute right-0 top-full mt-3 w-44 overflow-hidden rounded-sm border border-black/5 bg-white shadow-xl">
                                {langs.map((l) => (
                                    <button
                                        key={l.code}
                                        type="button"
                                        onClick={() => {
                                            setLocale(l.code);
                                            triggerGoogleTranslate(l.code);
                                            setLangOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between px-4 py-2.5 text-xs ${locale === l.code ? "bg-black/5 font-semibold text-foreground" : "text-black/60 hover:bg-black/5 hover:text-black"}`}
                                    >
                                        <span>
                                            {l.label} ({l.short})
                                        </span>
                                        {locale === l.code && (
                                            <Check className="size-3.5 text-black" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <AudioPlayer scrolled={scrolled} />
                </nav>

                <button
                    type="button"
                    aria-label="Toggle menu"
                    onClick={() => setOpen((v) => !v)}
                    className={`md:hidden ${scrolled ? "text-black" : "text-primary-foreground"}`}
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
                    <nav className="flex flex-col gap-1">
                        {menu.map((m) =>
                            m.key === "event" ? (
                                <Link
                                    key={m.key}
                                    href="/event"
                                    onClick={() => setOpen(false)}
                                    className="block border-b border-border/60 py-3 text-[16px] font-semibold tracking-normal text-foreground hover:text-primary last:border-0"
                                >
                                    {m.label}
                                </Link>
                            ) : (
                                <div
                                    key={m.key}
                                    className="border-b border-border/60 last:border-0"
                                >
                                    <div className="flex items-center justify-between py-3">
                                        <Link
                                            href={`/${m.key}`}
                                            onClick={() => setOpen(false)}
                                            className="text-[16px] font-semibold tracking-normal text-foreground hover:text-primary"
                                        >
                                            {m.label}
                                        </Link>
                                        <button
                                            type="button"
                                            aria-expanded={mobileOpen === m.key}
                                            onClick={() =>
                                                setMobileOpen((v) =>
                                                    v === m.key ? null : m.key,
                                                )
                                            }
                                            className="-mr-2 p-2"
                                        >
                                            <ChevronDown
                                                className={`size-[1em] shrink-0 text-foreground transition-transform duration-300 ${mobileOpen === m.key ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                    </div>
                                    <div
                                        className={`grid transition-all duration-300 ${mobileOpen === m.key ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                                    >
                                        <div className="overflow-hidden pb-3">
                                            <div className="grid gap-0.5 rounded-lg border border-border bg-white p-2 shadow-lg">
                                                {m.items.map((it) => (
                                                    <Link
                                                        key={it.href}
                                                        href={it.href}
                                                        onClick={() =>
                                                            setOpen(false)
                                                        }
                                                        className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                                                    >
                                                        {it.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                        <div className="flex gap-2 border-t border-border pt-4 mt-2">
                            {langs.map((l) => (
                                <button
                                    key={l.code}
                                    type="button"
                                    onClick={() => {
                                        setLocale(l.code);
                                        triggerGoogleTranslate(l.code);
                                        setOpen(false);
                                    }}
                                    className={`flex-1 rounded-sm border px-3 py-2 text-xs font-medium uppercase tracking-[0.15em] ${locale === l.code ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/60"}`}
                                >
                                    {l.label} ({l.short}){" "}
                                    {locale === l.code && "✓"}
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

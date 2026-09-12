import { useEffect, useState, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X, ChevronDown, Check, Sparkles } from "lucide-react";
import { AudioPlayer } from "@/components/portal/AudioPlayer";
import dulohupaLogo from "@/assets/dulohupa-ai.png";

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
// Grouped fallback ala InJourney (mega menu)
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
    destinasiGrouped: [
        {
            heading: "Cagar Budaya",
            viewAll: { label: "Lihat semua Cagar Budaya", href: "/destinasi?kategori=cagar-budaya" },
            items: [
                { label: "Benteng Otanaha", href: "/destinasi/benteng-otanaha" },
                { label: "Museum Pendarata", href: "/destinasi/museum-pendarata" },
                { label: "Rumah Adat Dulohupa", href: "/destinasi/rumah-adat-dulohupa" },
                { label: "Masjid Huntu", href: "/destinasi/masjid-huntu" },
            ],
        },
        {
            heading: "Destinasi Alam",
            viewAll: { label: "Lihat semua Destinasi Alam", href: "/destinasi?kategori=destinasi-alam" },
            items: [
                { label: "Hiu Paus Botubarani", href: "/destinasi/hiu-paus-botubarani" },
                { label: "Taman Laut Olele", href: "/destinasi/taman-laut-olele" },
                { label: "Pulo Cinta", href: "/destinasi/pulo-cinta" },
                { label: "Pulau Diyonumo", href: "/destinasi/pulau-diyonumo" },
                { label: "Pantai Taludaa", href: "/destinasi/pantai-taludaa" },
            ],
        },
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
    budayaGrouped: [
        {
            heading: "Sejarah",
            desc: "Tarian, tradisi & warisan Hulondalo",
            viewAll: { label: "Lihat semua Sejarah", href: "/budaya?sub=sejarah" },
            items: [
                { label: "Tari Saronde", href: "/budaya/tari-saronde" },
                { label: "Tradisi Dikili", href: "/budaya/tradisi-dikili" },
                { label: "Upacara Moloopu", href: "/budaya/moloopu" },
                { label: "Pohutu Limo Lo Pohalaa", href: "/budaya/pohutu-limo" },
            ],
        },
        {
            heading: "Kuliner",
            desc: "Rasa pesisir Teluk Tomini",
            viewAll: { label: "Lihat semua Kuliner", href: "/kuliner" },
            items: [
                { label: "Milu Siram", href: "/kuliner/milu-siram" },
                { label: "Ilabulo", href: "/kuliner/ilabulo" },
                { label: "Ayam Iloni", href: "/kuliner/ayam-iloni" },
                { label: "Sagela", href: "/kuliner/sagela" },
            ],
        },
        {
            heading: "Kerajinan",
            desc: "Karya tangan Gorontalo",
            viewAll: { label: "Lihat semua Kerajinan", href: "/kerajinan" },
            items: [
                { label: "Sulaman Karawo", href: "/kerajinan/sulaman-karawo" },
                { label: "Anyaman Rotan", href: "/kerajinan/anyaman-rotan" },
                { label: "Upiya Karanji", href: "/kerajinan/upiya-karanji" },
            ],
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
        <div className="invisible absolute left-0 top-full z-50 -translate-y-1 pt-2 opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="min-w-[240px] rounded-sm border border-border bg-white p-2 shadow-lg">
                <div className="grid max-h-[320px] gap-0.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {items.map((it) => (
                        <Link
                            key={it.href}
                            href={it.href}
                            className="rounded-sm px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-black/5 hover:text-foreground"
                        >
                            {it.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
// Mega / dropright ala InJourney — kiri kategori (Cagar Budaya | Destinasi Alam), kanan list dropright saat hover
function CaretIcon({ className = "" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" className={className} aria-hidden>
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
        </svg>
    );
}
function DroprightPanel({ sections }) {
    return (
        <div className="invisible absolute left-0 top-full z-50 -translate-y-1 pt-2 opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="w-[220px] rounded-sm border border-border bg-white shadow-xl">
                {sections.map((sec) => (
                    <div key={sec.heading} className="group/item relative">
                        <div className="flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-black/5 hover:text-foreground">
                            <Link href={sec.viewAll?.href ?? sec.items[0]?.href} className="flex-1 text-left">
                                {sec.heading}
                            </Link>
                            <CaretIcon className="size-3 shrink-0 -rotate-90 text-muted-foreground" />
                        </div>
                        {/* list dropright — solid, compact, menyatu -ml-[1px] */}
                        <div className="invisible absolute left-full top-0 z-10 -ml-[1px] w-[240px] -translate-x-1 rounded-sm rounded-l-none border border-border bg-white p-3 opacity-0 shadow-xl transition-[opacity,transform] duration-150 ease-out group-hover/item:visible group-hover/item:translate-x-0 group-hover/item:opacity-100">
                            <div className="flex flex-col gap-0.5">
                                {sec.items.map((it) => (
                                    <Link key={it.href} href={it.href} className="rounded-sm px-2.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-black/5 hover:text-foreground">
                                        {it.label}
                                    </Link>
                                ))}
                            </div>
                            {sec.viewAll && (
                                <Link href={sec.viewAll.href} className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
                                    {sec.viewAll.label} →
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
function MegaDropdownPanel({ sections }) {
    // alias untuk kompatibilitas — sekarang dropright untuk destinasi/budaya
    return <DroprightPanel sections={sections} />;
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
    // Grouped sections untuk mega menu (InJourney style)
    const groupedNav = {
        destinasi: fallbackNav.destinasiGrouped,
        budaya: fallbackNav.budayaGrouped,
    };
    // Jika backend sudah kirim nav.destinasiGrouped / nav.budayaGrouped, pakai itu (fallback sudah di atas)
    const sectionsByKey = {
        destinasi: nav?.destinasiGrouped ?? groupedNav.destinasi,
        budaya: nav?.budayaGrouped ?? groupedNav.budaya,
    };

    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(null);
    const [mobileSubOpen, setMobileSubOpen] = useState(null);
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
    const [isAiOpen, setIsAiOpen] = useState(false);
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
    useEffect(() => {
        if (open) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => { document.body.style.overflow = prev; };
        }
    }, [open]);
    useEffect(() => {
        const h = (e) => setIsAiOpen(!!e.detail);
        window.addEventListener("ai:state", h);
        return () => window.removeEventListener("ai:state", h);
    }, []);

    const menu = [
        { key: "destinasi", label: "Destinasi", sections: sectionsByKey.destinasi, mega: true },
        { key: "budaya", label: "Budaya", sections: sectionsByKey.budaya, mega: true },
        { key: "event", label: "Event", items: itemsByCat.event },
        { key: "galeri", label: "Galeri", href: "/galeri", direct: true },
        { key: "artikel", label: "Artikel", href: "/artikel", direct: true },
    ];

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 border-white/20 shadow-soft" : "bg-transparent border-transparent"}`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                <Link href="/" className="flex items-center gap-2.5 notranslate" translate="no">
                    <img src={dulohupaLogo} alt="Dulohupa AI" className={`h-10 w-auto object-contain -translate-y-[1.5px] ${scrolled ? "" : "brightness-0 invert"}`} />
                    <span className={`font-display text-[18px] font-bold leading-none tracking-tight md:text-[20px] ${scrolled ? "text-black" : "text-white"}`}>Dulohupa AI</span>
                </Link>

                <nav className="hidden items-center gap-4 md:flex lg:gap-5">
                    {menu.map((m) =>
                        m.direct ? (
                            <Link
                                key={m.key}
                                href={m.href}
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
                                {m.mega ? <MegaDropdownPanel sections={m.sections} /> : <DropdownPanel items={m.items} />}
                            </div>
                        ),
                    )}
                    <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent("ai:toggle"))}
                        aria-pressed={isAiOpen}
                        className={`hidden md:inline-flex w-[138px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-colors duration-300 ${scrolled ? "bg-black/5 border-black/10 text-black hover:bg-black/10" : "bg-white/10 border-white/20 text-white hover:bg-white/15"} ${isAiOpen ? (scrolled ? "ring-1 ring-black/15" : "ring-1 ring-white/20") : ""}`}
                    >
                        {isAiOpen ? <X className="size-4 shrink-0" /> : <Sparkles className="size-4 shrink-0" />}
                        <span className="tabular-nums">{isAiOpen ? "Tutup Chat" : "Tanya Munggi"}</span>
                    </button>
                    <AudioPlayer scrolled={scrolled} />
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
                <div className="max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-border bg-card px-6 py-6 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {menu.map((m) =>
                            m.direct ? (
                                <Link
                                    key={m.key}
                                    href={m.href}
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
                                            {m.mega ? (
                                                <div className="space-y-2 rounded-sm border border-border bg-white p-2 shadow-lg">
                                                    {m.sections.map((sec) => (
                                                        <div key={sec.heading} className="rounded-sm border border-transparent has-[button[aria-expanded=true]]:border-border has-[button[aria-expanded=true]]:bg-black/5">
                                                            <button type="button" aria-expanded={mobileSubOpen === sec.heading} onClick={() => setMobileSubOpen((v) => v === sec.heading ? null : sec.heading)} className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-foreground">
                                                                <span>{sec.heading}</span>
                                                                <CaretIcon className={`size-3 shrink-0 transition-transform ${mobileSubOpen === sec.heading ? "rotate-180" : "-rotate-90 opacity-60"}`} />
                                                            </button>
                                                            <div className={`grid transition-all ${mobileSubOpen === sec.heading ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                                                <div className="overflow-hidden">
                                                                    <div className="px-2 pb-2 pt-1">
                                                                        <div className="grid gap-0.5">
                                                                            {sec.items.map((it) => (
                                                                                <Link key={it.href} href={it.href} onClick={() => setOpen(false)} className="block rounded-sm px-3 py-2 text-sm text-foreground/80 hover:bg-black/5 hover:text-foreground">
                                                                                    {it.label}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                        {sec.viewAll && (
                                                                            <Link href={sec.viewAll.href} onClick={() => setOpen(false)} className="mt-2 inline-flex px-3 text-xs font-semibold text-primary hover:underline">
                                                                                {sec.viewAll.label} →
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="grid gap-0.5 rounded-sm border border-border bg-white p-2 shadow-lg">
                                                    {m.items.map((it) => (
                                                        <Link
                                                            key={it.href}
                                                            href={it.href}
                                                            onClick={() =>
                                                                setOpen(false)
                                                            }
                                                            className="rounded-sm px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-black/5 hover:text-foreground"
                                                        >
                                                            {it.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
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

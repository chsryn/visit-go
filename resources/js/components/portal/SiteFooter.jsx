import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    MapPin,
    Mail,
    Phone,
    Send,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import dulohupaLogo from "@/assets/dulohupa-ai.png";
import { TotalViewCounter } from "@/components/portal/ViewCounter";

const brandPaths = {
    Instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    YouTube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    Facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    X: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
};

function brandIcon(name, className = "size-4") {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d={brandPaths[name]} />
        </svg>
    );
}

const socialLinks = [
    { name: "Instagram", href: "https://instagram.com", icon: "Instagram", hover: "hover:bg-[#E1306C]" },
    { name: "YouTube", href: "https://youtube.com", icon: "YouTube", hover: "hover:bg-[#FF0000]" },
    { name: "Facebook", href: "https://facebook.com", icon: "Facebook", hover: "hover:bg-[#1877F2]" },
    { name: "X", href: "https://x.com", icon: "X", hover: "hover:bg-black" },
];

const quickNav = [
    { label: "Beranda", href: "/" },
    { label: "Destinasi", href: "/destinasi" },
    { label: "Kuliner", href: "/kuliner" },
    { label: "Event", href: "/event" },
    { label: "Tentang Kami", href: "/" },
];

const popularLinks = [
    { label: "Pulo Cinta", href: "/destinasi/pulo-cinta" },
    { label: "Benteng Otanaha", href: "/destinasi/benteng-otanaha" },
    { label: "Taman Laut Olele", href: "/destinasi/taman-laut-olele" },
    { label: "Milu Siram", href: "/kuliner/milu-siram" },
    { label: "Binthe Biluhuta", href: "/kuliner/binthe-biluhuta" },
];

const legalLinks = [
    { label: "Kebijakan Privasi", href: "/" },
    { label: "Syarat & Ketentuan", href: "/" },
];

function FooterColumnTitle({ children }) {
    return (
        <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
            {children}
        </h4>
    );
}

function FooterLink({ children, href }) {
    return (
        <Link
            href={href}
            className="group/link inline-flex items-center gap-1.5 text-sm leading-relaxed text-white/60 transition-all duration-300 hover:translate-x-1 hover:text-[#D4A017]"
        >
            <span className="h-px w-0 bg-[#D4A017] transition-all duration-300 group-hover/link:w-3" />
            {children}
        </Link>
    );
}

function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!email.trim()) return;
                setSubmitted(true);
            }}
            className="mt-4"
        >
            {submitted ? (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                    <span>
                        Terima kasih! Langganan berhasil — cerita wisata Gorontalo akan dikirim ke{" "}
                        <strong className="font-semibold">{email}</strong>.
                    </span>
                </div>
            ) : (
                <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/5 focus-within:border-[#D4A017]/60 focus-within:ring-2 focus-within:ring-[#D4A017]/20 transition-all">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email kamu..."
                        className="w-full min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="group/btn inline-flex shrink-0 items-center gap-1.5 bg-[#D4A017] px-3.5 text-xs font-semibold text-[#1F2937] transition-colors hover:bg-[#c08f12]"
                    >
                        Subscribe
                        <Send className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </button>
                </div>
            )}
        </form>
    );
}

export function SiteFooter() {
    const year = new Date().getFullYear();
    return (
        <footer className="relative overflow-hidden bg-[#151020] text-white">
            {/* Gradient accent border atas */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4A017]/70 to-transparent" />

            {/* Ornamen cahaya (glow) di pojok */}
            <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-[#715386]/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-20 size-96 rounded-full bg-[#D4A017]/15 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {/* Kolom 1 — Branding */}
                    <div className="space-y-5">
                        <Link href="/" className="inline-flex items-center gap-2.5 notranslate" translate="no">
                            <img
                                src={dulohupaLogo}
                                alt="Dulohupa AI"
                                className="h-10 w-auto -translate-y-[1.5px] object-contain brightness-0 invert"
                            />
                            <span className="font-display text-xl font-bold leading-none tracking-tight">
                                Dulohupa AI
                            </span>
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-white/60">
                            Portal Informasi Wisata &amp; Budaya Provinsi Gorontalo — jelajahi
                            pesona alam, tradisi, kuliner, dan kerajinan dari jantung Teluk
                            Tomini.
                        </p>
                        <div className="flex items-center gap-2.5">
                            {socialLinks.map(({ name, href, icon, hover }) => (
                                <a
                                    key={name}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={name}
                                    title={name}
                                    className={`flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:scale-110 hover:border-transparent hover:text-white hover:shadow-lg ${hover}`}
                                >
                                    {brandIcon(icon)}
                                </a>
                            ))}
                        </div>
                        <TotalViewCounter className="text-white/40" />
                    </div>

                    {/* Kolom 2 — Navigasi Cepat */}
                    <div className="space-y-5">
                        <FooterColumnTitle>Navigasi Cepat</FooterColumnTitle>
                        <nav className="flex flex-col items-start gap-2.5">
                            {quickNav.map((l) => (
                                <FooterLink key={l.label} href={l.href}>
                                    {l.label}
                                </FooterLink>
                            ))}
                        </nav>
                    </div>

                    {/* Kolom 3 — Destinasi / Kuliner Populer */}
                    <div className="space-y-5">
                        <FooterColumnTitle>Destinasi &amp; Kuliner</FooterColumnTitle>
                        <nav className="flex flex-col items-start gap-2.5">
                            {popularLinks.map((l) => (
                                <FooterLink key={l.label} href={l.href}>
                                    {l.label}
                                </FooterLink>
                            ))}
                        </nav>
                    </div>

                    {/* Kolom 4 — Newsletter / Kontak */}
                    <div className="space-y-5">
                        <FooterColumnTitle>Newsletter</FooterColumnTitle>
                        <p className="text-sm leading-relaxed text-white/60">
                            Dapatkan rekomendasi destinasi &amp; agenda event terbaru langsung
                            di inbox kamu.
                        </p>
                        <NewsletterForm />
                        <div className="space-y-2.5 border-t border-white/10 pt-5 text-sm text-white/60">
                            <p className="flex items-start gap-2.5">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-[#D4A017]" />
                                <span>
                                    Dinas Pariwisata Provinsi Gorontalo
                                    <br />
                                    Jl. Jendral Sudirman No. 57, Kota Gorontalo, 96128
                                </span>
                            </p>
                            <p className="flex items-center gap-2.5">
                                <Mail className="size-4 shrink-0 text-[#D4A017]" />
                                <a
                                    href="mailto:info@pariwisata.gorontaloprov.go.id"
                                    className="transition-colors hover:text-[#D4A017]"
                                >
                                    info@pariwisata.gorontaloprov.go.id
                                </a>
                            </p>
                            <p className="flex items-center gap-2.5">
                                <Phone className="size-4 shrink-0 text-[#D4A017]" />
                                <a
                                    href="tel:+62435821456"
                                    className="transition-colors hover:text-[#D4A017]"
                                >
                                    +62 (435) 821-456
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar — copyright & legal */}
            <div className="relative border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/45 sm:flex-row lg:px-8">
                    <p>
                        Copyright © {year}{" "}
                        <span className="font-semibold text-white/70">Dulohupa AI</span>. All
                        rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {legalLinks.map((l) => (
                            <Link
                                key={l.label}
                                href={l.href}
                                className="group inline-flex items-center gap-1 transition-all duration-300 hover:translate-x-0.5 hover:text-[#D4A017]"
                            >
                                {l.label}
                                <ArrowRight className="size-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    LayoutDashboard,
    MapPin,
    Landmark,
    CalendarDays,
    Images,
    Newspaper,
    KeyRound,
    User,
    Map as MapIcon,
    Store,
    ChevronDown,
    LogOut,
    Globe,
    Menu,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function isActive(url, href) {
    if (href === "/admin") return url === "/admin" || url === "/admin/";
    return url === href || url.startsWith(href + "/") || url.startsWith(href + "?");
}

export default function AdminLayout({ children, title, subtitle }) {
    const { url, props } = usePage();
    const flash = props.flash ?? {};
    const user = props.auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [umkmOpen, setUmkmOpen] = useState(url.startsWith("/admin/umkms"));
    const umkmJenis = props.adminUmkmJenis ?? [];
    const [destinasiOpen, setDestinasiOpen] = useState(url.startsWith("/admin/destinasis"));
    const destinasiCategories = props.adminDestinationCategories ?? [];

    const itemCls = (href) =>
        cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(url, href)
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
        );

    const sidebar = (
        <div className="flex h-full flex-col">
            <Link href="/admin" className="flex items-center gap-2.5 px-3 py-5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
                    V
                </span>
                <span className="leading-tight">
                    <span className="block font-display text-base font-bold">Visit Gorontalo</span>
                    <span className="block text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                        Admin Panel
                    </span>
                </span>
            </Link>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
                <Link href="/admin" className={itemCls("/admin")}>
                    <LayoutDashboard className="size-4 shrink-0" /> Dashboard
                </Link>

                {/* Destinasi — anak accordion = kategori dinamis dari database */}
                <button
                    type="button"
                    onClick={() => setDestinasiOpen((v) => !v)}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        url.startsWith("/admin/destinasis")
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <MapPin className="size-4 shrink-0" />
                    <span className="flex-1 text-left">Destinasi</span>
                    <ChevronDown className={cn("size-4 transition-transform", destinasiOpen && "rotate-180")} />
                </button>
                {destinasiOpen && (
                    <div className="ml-4 space-y-1 border-l border-border pl-3">
                        <Link
                            href="/admin/destinasis"
                            className={cn(
                                "block rounded-lg px-3 py-2 text-sm transition-colors",
                                url === "/admin/destinasis"
                                    ? "bg-primary/10 font-semibold text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            Semua Destinasi
                        </Link>
                        {destinasiCategories.map((c) => (
                            <Link
                                key={c.slug}
                                href={`/admin/destinasis?kategori=${encodeURIComponent(c.slug)}`}
                                className={cn(
                                    "block rounded-lg px-3 py-2 text-sm capitalize transition-colors",
                                    url === `/admin/destinasis?kategori=${encodeURIComponent(c.slug)}`
                                        ? "bg-primary/10 font-semibold text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {c.name}
                            </Link>
                        ))}
                        {destinasiCategories.length === 0 && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">Belum ada kategori.</p>
                        )}
                        <Link
                            href="/admin/destination-categories"
                            className={cn(
                                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                url.startsWith("/admin/destination-categories")
                                    ? "bg-primary/10 font-semibold text-primary"
                                    : "text-primary/80 hover:bg-muted hover:text-primary"
                            )}
                        >
                            + Kelola Kategori
                        </Link>
                    </div>
                )}

                <Link href="/admin/budayas" className={itemCls("/admin/budayas")}>
                    <Landmark className="size-4 shrink-0" /> Budaya
                </Link>

                {/* UMKM — anak accordion = jenis dinamis dari database */}
                <button
                    type="button"
                    onClick={() => setUmkmOpen((v) => !v)}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        url.startsWith("/admin/umkms")
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    <Store className="size-4 shrink-0" />
                    <span className="flex-1 text-left">UMKM</span>
                    <ChevronDown className={cn("size-4 transition-transform", umkmOpen && "rotate-180")} />
                </button>
                {umkmOpen && (
                    <div className="ml-4 space-y-1 border-l border-border pl-3">
                        <Link
                            href="/admin/umkms"
                            className={cn(
                                "block rounded-lg px-3 py-2 text-sm transition-colors",
                                url === "/admin/umkms"
                                    ? "bg-primary/10 font-semibold text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            Semua UMKM
                        </Link>
                        {umkmJenis.map((j) => (
                            <Link
                                key={j.slug}
                                href={`/admin/umkms?jenis=${encodeURIComponent(j.slug)}`}
                                className={cn(
                                    "block rounded-lg px-3 py-2 text-sm capitalize transition-colors",
                                    url === `/admin/umkms?jenis=${encodeURIComponent(j.slug)}`
                                        ? "bg-primary/10 font-semibold text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {j.name}
                            </Link>
                        ))}
                        {umkmJenis.length === 0 && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">Belum ada jenis.</p>
                        )}
                        <Link
                            href="/admin/umkm-jenis"
                            className={cn(
                                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                url.startsWith("/admin/umkm-jenis")
                                    ? "bg-primary/10 font-semibold text-primary"
                                    : "text-primary/80 hover:bg-muted hover:text-primary"
                            )}
                        >
                            + Kelola Jenis
                        </Link>
                    </div>
                )}
                <Link href="/admin/events" className={itemCls("/admin/events")}>
                    <CalendarDays className="size-4 shrink-0" /> Event
                </Link>
                <Link href="/admin/galleries" className={itemCls("/admin/galleries")}>
                    <Images className="size-4 shrink-0" /> Galeri
                </Link>
                <Link href="/admin/articles" className={itemCls("/admin/articles")}>
                    <Newspaper className="size-4 shrink-0" /> Artikel
                </Link>
                <Link href="/admin/ai-keys" className={itemCls("/admin/ai-keys")}>
                    <KeyRound className="size-4 shrink-0" /> AI Usage
                </Link>
                <Link href="/admin/maps" className={itemCls("/admin/maps")}>
                    <MapIcon className="size-4 shrink-0" /> Maps
                </Link>
                <Link href="/admin/profile" className={itemCls("/admin/profile")}>
                    <User className="size-4 shrink-0" /> User Profile
                </Link>
            </nav>

            <div className="space-y-1 border-t border-border p-3">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    <Globe className="size-4 shrink-0" /> Lihat Situs
                </Link>
                <Link
                    href="/admin/logout"
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                    <LogOut className="size-4 shrink-0" /> Logout
                </Link>
                {user && <p className="px-3 pt-1 text-xs text-muted-foreground">Login sebagai {user.email}</p>}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/40 font-sans">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card lg:block">
                {sidebar}
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        aria-hidden
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-card">
                        <button
                            type="button"
                            aria-label="Tutup menu"
                            onClick={() => setMobileOpen(false)}
                            className="absolute right-3 top-5 rounded-lg p-1.5 hover:bg-muted"
                        >
                            <X className="size-5" />
                        </button>
                        {sidebar}
                    </aside>
                </div>
            )}

            <div className="lg:pl-64">
                <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
                    <button
                        type="button"
                        aria-label="Buka menu"
                        onClick={() => setMobileOpen(true)}
                        className="rounded-lg p-2 hover:bg-muted lg:hidden"
                    >
                        <Menu className="size-5" />
                    </button>
                    <div>
                        <h1 className="font-display text-lg font-bold leading-tight">{title}</h1>
                        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                    </div>
                </header>

                <main className="p-4 sm:p-6">
                    {flash.success && (
                        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            {flash.error}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}

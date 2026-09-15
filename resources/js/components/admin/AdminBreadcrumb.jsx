import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";

export const DESTINASI_NAV = [
    { href: "/admin/destinasis", label: "Destinasi" },
    { href: "/admin/destination-prices", label: "Estimasi Harga" },
    { href: "/admin/destination-categories", label: "Kelola Kategori" },
];

export const UMKM_NAV = [
    { href: "/admin/umkms", label: "UMKM" },
    { href: "/admin/kuliner-categories", label: "Kategori Kuliner" },
    { href: "/admin/kerajinan-categories", label: "Kategori Kerajinan" },
];

export function AdminBreadcrumb({ items }) {
    const { url } = usePage();
    return (
        <div className="flex flex-wrap items-center gap-2">
            {items.map((it) => {
                const active = url === it.href || url.startsWith(it.href + "?");
                return (
                    <Link
                        key={it.href}
                        href={it.href}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium",
                            active
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                    >
                        {it.label}
                    </Link>
                );
            })}
        </div>
    );
}
import { Link } from "@inertiajs/react";

export function PageBreadcrumb({ items }) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="mb-3 flex flex-wrap items-center gap-2 text-xs text-white/80 sm:text-sm md:mb-4"
        >
            <Link
                href="/"
                className="transition-colors hover:text-white"
            >
                Beranda
            </Link>
            {items.map((it, i) => {
                const last = i === items.length - 1;
                return (
                    <span key={it.label ?? i} className="flex items-center gap-2 min-w-0">
                        <span aria-hidden className="text-white/40">
                            /
                        </span>
                        {it.href && !last ? (
                            <Link
                                href={it.href}
                                className="transition-colors hover:text-white"
                            >
                                {it.label}
                            </Link>
                        ) : (
                            <span className="truncate font-medium text-white max-w-[200px] sm:max-w-none">
                                {it.label}
                            </span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
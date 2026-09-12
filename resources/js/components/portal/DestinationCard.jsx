import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";

export function DestinationCard({ href, image, title, location, category, description, variant = "default" }) {
    if (variant === "featured") {
        return (
            <Link href={href} className="group relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl bg-foreground">
                <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative p-5">
                    {category && <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">{category}</span>}
                    <h3 className="mt-2 font-display text-xl font-bold text-white">{title}</h3>
                    {location && <p className="text-xs text-white/80">{location}</p>}
                    {description && <p className="mt-1 line-clamp-2 text-sm text-white/75">{description}</p>}
                </div>
            </Link>
        );
    }
    return (
        <Link href={href} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="p-4">
                <h3 className="font-display text-base font-bold leading-tight text-foreground line-clamp-1">{title}</h3>
                {location && <p className="text-xs text-muted-foreground">{location}</p>}
                {description && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>}
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">Lihat <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span>
            </div>
        </Link>
    );
}

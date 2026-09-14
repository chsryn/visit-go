import { Link } from "@inertiajs/react";

export function DestinationCard({
    href,
    image,
    title,
    location,
    description,
    badges = [],
}) {
    return (
        <Link href={href} className="group flex flex-col gap-4 cursor-pointer">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="flex flex-col gap-1">
                {location && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {location}
                    </span>
                )}
                <h3 className="font-display text-xl font-medium leading-tight text-foreground line-clamp-2 mt-2">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 min-h-[66px] mt-2">
                        {description}
                    </p>
                )}
                {badges.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {badges.map((b) => (
                            <span
                                key={b.slug ?? b.name}
                                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                            >
                                {b.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

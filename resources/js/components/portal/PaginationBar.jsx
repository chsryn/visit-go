import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";

export function PaginationBar({ paginator, className = "mt-14" }) {
    return (
        <Pagination className={className}>
            <PaginationContent>
                {paginator.links?.map((link, idx) => {
                    const isPrev = idx === 0;
                    const isNext = idx === paginator.links.length - 1;
                    const label = link.label
                        .replace(/&laquo;|&raquo;/g, "")
                        .trim();
                    const isEllipsis = label === "...";
                    if (isEllipsis) {
                        return (
                            <PaginationItem key={idx}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }
                    if (isPrev) {
                        return (
                            <PaginationItem key={idx}>
                                <PaginationPrevious
                                    href={link.url ?? "#"}
                                    className={
                                        !link.url
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                        );
                    }
                    if (isNext) {
                        return (
                            <PaginationItem key={idx}>
                                <PaginationNext
                                    href={link.url ?? "#"}
                                    className={
                                        !link.url
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                        );
                    }
                    return (
                        <PaginationItem key={idx}>
                            <PaginationLink
                                href={link.url ?? "#"}
                                isActive={link.active}
                                className={
                                    link.active
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "hover:bg-primary/10 hover:text-primary"
                                }
                            >
                                {label}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}
import { router } from "@inertiajs/react";
import { FilterDropdown } from "./FilterDropdown";

export function CategoryFilter({
    id,
    label,
    value,
    route,
    param,
    emptyOption,
    categories,
}) {
    const options = [
        { value: "semua", label: emptyOption },
        ...categories.map((c) => ({ value: c.slug, label: c.name })),
    ];
    return (
        <div className="mb-10 flex justify-start">
            <FilterDropdown
                id={id}
                ariaLabel={label}
                value={value}
                emptyValue="semua"
                options={options}
                onChange={(v) => {
                    router.get(
                        route,
                        v === "semua" ? {} : { [param]: v },
                        {
                            preserveState: true,
                            preserveScroll: true,
                        },
                    );
                }}
            />
        </div>
    );
}
import { router } from "@inertiajs/react";

export function CategoryFilter({
    id,
    label,
    value,
    route,
    param,
    emptyOption,
    categories,
}) {
    return (
        <div className="mb-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <label
                htmlFor={id}
                className="text-sm font-medium text-foreground"
            >
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => {
                    const v = e.target.value;
                    router.get(
                        route,
                        v === "semua" ? {} : { [param]: v },
                        {
                            preserveState: true,
                            preserveScroll: true,
                        },
                    );
                }}
                className="w-full sm:w-64 rounded-full border border-input bg-white px-4 py-2.5 text-sm font-medium shadow-xs outline-none focus-visible:border-ring"
            >
                <option value="semua">{emptyOption}</option>
                {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                        {c.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
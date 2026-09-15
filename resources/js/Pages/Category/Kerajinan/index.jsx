import { CategoryFilter } from "../shared/CategoryFilter";
import { ItemGrid } from "../shared/ItemGrid";
import { IntroKerajinan } from "./IntroKerajinan";

export function KerajinanSection({
    items,
    category,
    kerajinanCategories = [],
    activeKerajinanCategory = "semua",
}) {
    return (
        <>
            <IntroKerajinan />
            <section className="bg-[#FCFBFC] py-12 lg:py-16">
                <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                    <CategoryFilter
                        id="kerajinan-filter"
                        label="Pilih Kategori Kerajinan:"
                        value={activeKerajinanCategory}
                        route="/kerajinan"
                        param="kerajinan_category"
                        emptyOption="Semua Kerajinan"
                        categories={kerajinanCategories}
                    />
                    <ItemGrid
                        items={items}
                        category={category}
                        activeKerajinanCategory={activeKerajinanCategory}
                    />
                </div>
            </section>
        </>
    );
}
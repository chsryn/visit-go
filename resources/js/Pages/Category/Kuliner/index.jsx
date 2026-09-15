import { CategoryFilter } from "../shared/CategoryFilter";
import { ItemGrid } from "../shared/ItemGrid";
import { IntroKuliner } from "./IntroKuliner";

export function KulinerSection({
    items,
    category,
    kulinerCategories = [],
    activeKulinerCategory = "semua",
}) {
    return (
        <>
            <IntroKuliner />
            <section className="bg-[#FCFBFC] py-12 lg:py-16">
                <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                    <CategoryFilter
                        id="kuliner-filter"
                        label="Pilih Kategori Kuliner:"
                        value={activeKulinerCategory}
                        route="/kuliner"
                        param="kuliner_category"
                        emptyOption="Semua UMKM Kuliner"
                        categories={kulinerCategories}
                    />
                    <ItemGrid
                        items={items}
                        category={category}
                        activeKulinerCategory={activeKulinerCategory}
                    />
                </div>
            </section>
        </>
    );
}
import { CategoryFilter } from "../shared/CategoryFilter";
import { ItemGrid } from "../shared/ItemGrid";
import { IntroDestinasi } from "./IntroDestinasi";

export function DestinasiSection({
    items,
    category,
    destinationCategories = [],
    activeDestinationCategory = "semua",
}) {
    return (
        <>
            <IntroDestinasi />
            <section className="bg-[#FCFBFC] py-12 lg:py-16">
                <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                    <CategoryFilter
                        id="destinasi-filter"
                        label="Pilih Kategori Destinasi:"
                        value={activeDestinationCategory}
                        route="/destinasi"
                        param="kategori"
                        emptyOption="Semua Destinasi Wisata"
                        categories={destinationCategories}
                    />
                    <ItemGrid
                        items={items}
                        category={category}
                        activeDestinationCategory={activeDestinationCategory}
                    />
                </div>
            </section>
        </>
    );
}
import { ItemGrid } from "../shared/ItemGrid";

export function EventSection({ items, category }) {
    return (
        <section className="bg-[#FCFBFC] py-12 lg:py-16">
            <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                <ItemGrid items={items} category={category} />
            </div>
        </section>
    );
}
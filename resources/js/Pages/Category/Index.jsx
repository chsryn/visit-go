import { Head } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { karawoBorder } from "@/lib/karawo";
import { heroByCategory, heroSvgPattern } from "./data";
import { BudayaSection } from "./Budaya";
import { DestinasiSection } from "./Destinasi";
import { KulinerSection } from "./Kuliner";
import { KerajinanSection } from "./Kerajinan";
import { EventSection } from "./Event";

const sections = {
    budaya: BudayaSection,
    destinasi: DestinasiSection,
    kuliner: KulinerSection,
    kerajinan: KerajinanSection,
    event: EventSection,
};

export default function CategoryIndex({
    category,
    items,
    banner,
    kulinerCategories = [],
    activeKulinerCategory = "semua",
    destinationCategories = [],
    activeDestinationCategory = "semua",
    kerajinanCategories = [],
    activeKerajinanCategory = "semua",
    destinasiTerkait = [],
    galeriBudaya = [],
}) {
    const fallback = heroByCategory[category] ?? heroByCategory.destinasi;
    const hero = banner
        ? {
              title: banner.name ?? fallback.title,
              image: banner.banner_image ?? fallback.image,
          }
        : fallback;
    const label = hero.title;

    const ActiveSection = sections[category] ?? EventSection;

    const sectionProps = {
        items,
        category,
        kulinerCategories,
        activeKulinerCategory,
        destinationCategories,
        activeDestinationCategory,
        kerajinanCategories,
        activeKerajinanCategory,
        destinasiTerkait,
        galeriBudaya,
    };

    return (
        <>
            <Head title={`${label} — Dulohupa AI`} />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main className="min-h-screen h-auto overflow-visible">
                    <div className="relative overflow-hidden bg-[#2A1E32] pt-28 pb-14">
                        {(() => {
                            const raw = hero.image;
                            const bgSrc = typeof raw === "string" ? raw : null;
                            const src =
                                bgSrc &&
                                (bgSrc.startsWith("/storage") ||
                                    bgSrc.startsWith("/build") ||
                                    bgSrc.startsWith("http") ||
                                    bgSrc.startsWith("data:"))
                                    ? bgSrc
                                    : typeof bgSrc === "string" &&
                                        bgSrc.startsWith("/")
                                      ? bgSrc
                                      : null;
                            const finalSrc =
                                src ??
                                (typeof hero.image === "string"
                                    ? hero.image
                                    : null);
                            return finalSrc ? (
                                <img
                                    src={finalSrc}
                                    alt=""
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.28] blur-[8px] scale-105"
                                />
                            ) : null;
                        })()}
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-[#2A1E32]/80"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-[0.04]"
                            style={{
                                backgroundImage: heroSvgPattern,
                                backgroundSize: "240px 240px",
                            }}
                        />
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <h1 className="mt-6 max-w-2xl font-display text-[32px] font-bold leading-tight text-white md:text-[40px]">
                                {label}
                            </h1>
                        </div>
                        <div
                            aria-hidden
                            className="h-[10px] w-full opacity-90 absolute inset-x-0 bottom-0 z-10"
                            style={{
                                backgroundImage: karawoBorder,
                                backgroundRepeat: "repeat-x",
                                backgroundSize: "120px 12px",
                            }}
                        />
                    </div>

                    <ActiveSection {...sectionProps} />
                </main>
                <SiteFooter />
                <AiAssistantButton />
            </div>
        </>
    );
}
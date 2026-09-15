import { Reveal } from "@/components/ui/Reveal";
import { introSvgPattern } from "../data";
import pulauCintaImg from "@/assets/pulau-cinta.jpg";
import bentengOtanahaImg from "@/assets/benteng-otanaha.jpg";
import pulauDiyonumoImg from "@/assets/pulau-diyonumo.jpg";
import pantaiTaludaaImg from "@/assets/pantai-taludaa.jpg";
import destinasiAlamImg from "@/assets/destinasi-alam.jpg";
import patungPataniImg from "@/assets/patung-patani.jpg";
import busanaAdatImg from "@/assets/busana-adat-gorontalo.jpg";
import motifKarawoImg from "@/assets/motif-karawo.jpg";

const introDestinasi = {
    semua: {
        image: pulauCintaImg,
        alt: "Pulo Cinta Gorontalo",
        thumbs: [
            { src: bentengOtanahaImg, alt: "Benteng Otanaha Gorontalo" },
            { src: pulauDiyonumoImg, alt: "Pulau Diyonumo" },
            { src: pantaiTaludaaImg, alt: "Pantai Taludaa" },
        ],
        eyebrow: "Potensi Wisata Gorontalo",
        headline: ["Dari Teluk Tomini", "hingga benteng bersejarah."],
        paragraph:
            "Gorontalo menawarkan keindahan alam eksotis yang masih perawan—mulai dari titik penyelaman kelas dunia di Olele, interaksi dekat dengan Hiu Paus di Botubarani, hingga lanskap peninggalan sejarah yang megah.",
        points: [
            {
                label: "Diving Kelas Dunia",
                desc: "Titik penyelaman di Olele dengan keanekaragaman biota bawah laut yang masih terjaga.",
            },
            {
                label: "Berenang bersama Hiu Paus",
                desc: "Pengalaman langka berinteraksi dekat dengan Hiu Paus di perairan Botubarani.",
            },
            {
                label: "Benteng Bersejarah",
                desc: "Jejak peninggalan sejarah megah yang menghiasi lanskap Gorontalo.",
            },
        ],
    },
    "cagar-budaya": {
        image: bentengOtanahaImg,
        alt: "Benteng Otanaha Gorontalo",
        thumbs: [
            { src: patungPataniImg, alt: "Patung Patani Gorontalo" },
            { src: busanaAdatImg, alt: "Busana Adat Gorontalo" },
            { src: motifKarawoImg, alt: "Motif Karawo Gorontalo" },
        ],
        eyebrow: "Warisan Sejarah Gorontalo",
        headline: ["Menelusuri jejak sejarah", "yang berdiri kokoh."],
        paragraph:
            "Gorontalo menyimpan warisan sejarah yang terjaga—dari kokohnya Benteng Otanaha di atas bukit, kisah legenda Patung Patani, hingga tradisi serta motif karawo yang menjadi identitas budaya hingga kini.",
        points: [
            {
                label: "Benteng Otanaha",
                desc: "Benteng peninggalan era penyebaran Islam yang berdiri kokoh di atas bukit.",
            },
            {
                label: "Patung Patani",
                desc: "Sosok legendaris dengan kisah yang melintasi generasi masyarakat Gorontalo.",
            },
            {
                label: "Seni & Tradisi",
                desc: "Busana adat dan motif karawo yang menjadi identitas budaya hingga kini.",
            },
        ],
    },
    "wisata-alam": {
        image: destinasiAlamImg,
        alt: "Destinasi Alam Gorontalo",
        thumbs: [
            { src: pulauCintaImg, alt: "Pulo Cinta Gorontalo" },
            { src: pulauDiyonumoImg, alt: "Pulau Diyonumo" },
            { src: pantaiTaludaaImg, alt: "Pantai Taludaa" },
        ],
        eyebrow: "Keindahan Alam Gorontalo",
        headline: ["Keajaiban alam dari pesisir", "hingga laut lepas."],
        paragraph:
            "Gorontalo dihiasi keindahan alam yang masih perawan—mulai dari pantai berpasir putih, gugusan pulau eksotis, titik penyelaman kelas dunia di Olele, hingga interaksi dekat dengan Hiu Paus di Botubarani.",
        points: [
            {
                label: "Pantai & Pulau",
                desc: "Pasir putih dan gugusan pulau eksotis seperti Pulo Cinta dan Pulau Diyonumo.",
            },
            {
                label: "Snorkeling & Diving",
                desc: "Taman bawah laut Olele dengan terumbu karang dan biota laut kelas dunia.",
            },
            {
                label: "Ekowisata",
                desc: "Lanskap alam yang masih asri dari perbukitan hingga pesisir Teluk Tomini.",
            },
        ],
    },
};

export function IntroDestinasi({ active }) {
    const cfg = introDestinasi[active] ?? introDestinasi.semua;
    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] pt-8 pb-6 md:pt-12 md:pb-6">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: introSvgPattern,
                    backgroundSize: "240px 240px",
                }}
            />
            <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="order-2 lg:order-1">
                        <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                            <img
                                src={cfg.image}
                                alt={cfg.alt}
                                className="aspect-[4/3] w-full rounded-xl object-cover"
                            />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            {cfg.thumbs.map((t) => (
                                <div
                                    key={t.src}
                                    className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm"
                                >
                                    <img
                                        src={t.src}
                                        alt={t.alt}
                                        className="h-[72px] w-full rounded-lg object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Reveal y={16} className="order-1 lg:order-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
                            {cfg.eyebrow}
                        </span>
                        <h2 className="mt-3 font-display text-[34px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[44px]">
                            {cfg.headline[0]}
                            <br />
                            <span className="font-normal italic text-ocean">
                                {cfg.headline[1]}
                            </span>
                        </h2>
                        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
                            {cfg.paragraph}
                        </p>
                        <div className="mt-6 space-y-4 border-t border-border pt-6">
                            {cfg.points.map((p) => (
                                <div
                                    key={p.label}
                                    className="grid gap-1 text-sm md:grid-cols-[150px_1fr] md:gap-4"
                                >
                                    <span className="font-bold text-foreground">
                                        {p.label}
                                    </span>
                                    <span className="leading-relaxed text-muted-foreground">
                                        {p.desc}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
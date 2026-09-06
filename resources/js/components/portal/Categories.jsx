import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Reveal, Stagger, cardVariants } from "@/components/ui/Reveal";
import destinasiImage from "@/assets/kategori-destinasi.jpg";
import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";

const pillars = [
    {
        category: "destinasi",
        name: "Destinasi Wisata",
        body: "Botubarani, Pulo Cinta, Taman Laut Olele, dan pulau-pulau tersembunyi Teluk Tomini.",
        image: destinasiImage,
        alt: "Lagun biru kehijauan dengan vila di atas air di Pulo Cinta",
    },
    {
        category: "budaya",
        name: "Ensiklopedia Budaya",
        body: "Tradisi Dikili, Tari Saronde, adat istiadat, dan warisan lisan masyarakat Hulondalo.",
        image: budayaImage,
        alt: "Penari tradisional Gorontalo mengenakan busana sulaman Karawo",
    },
    {
        category: "kuliner",
        name: "Kuliner Khas",
        body: "Milu siram, ilabulo, sambal sagela, dan cita rasa laut khas pesisir Gorontalo.",
        image: kulinerImage,
        alt: "Hidangan khas Gorontalo tersaji di atas meja kayu",
    },
    {
        category: "kerajinan",
        name: "Kerajinan Daerah",
        body: "Sulaman Karawo, anyaman rotan, dan mahakarya tangan perajin lokal.",
        image: kerajinanImage,
        alt: "Tangan perajin menyulam motif Karawo di atas kain",
    },
];

export function Categories() {
    return (
        <section
            id="kategori"
            className="relative overflow-hidden bg-transparent py-[30px] md:py-[50px]"
        >
            {/* motif & gradient dipindah ke Welcome wrapper — biar tile-to-tile tanpa patah */}
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <Reveal y={30} className="mx-auto max-w-[573px] text-center">
                    <h2 className="font-display text-[24px] font-bold leading-[1.3] text-foreground md:text-[30px]">
                        Empat Pilar Kekayaan Gorontalo
                    </h2>
                    <p className="mt-[10px] text-sm leading-relaxed text-muted-foreground">
                        Empat pilar yang merangkai jati diri Gorontalo —
                        destinasi bahari, ensiklopedia budaya Hulondalo, kuliner
                        khas, dan kerajinan Karawo di jantung Teluk Tomini.
                    </p>
                </Reveal>

                <Stagger
                    stagger={0.08}
                    className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 md:mt-[50px]"
                >
                    {pillars.map((item) => (
                        <motion.div key={item.category} variants={cardVariants}>
                            <Link
                                href={`/${item.category}`}
                                className="group relative block overflow-hidden rounded-[15px] bg-white/65 backdrop-blur-xl backdrop-saturate-150 border border-white/30 shadow-soft supports-[backdrop-filter]:bg-white/55 dark:bg-card/60 dark:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                            >
                                <div className="overflow-hidden rounded-xl h-[348px] md:h-[368px]">
                                    <img
                                        src={item.image}
                                        alt={item.alt}
                                        width={1280}
                                        height={960}
                                        loading="lazy"
                                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                {/* slide-up detail — blur transparan hitam 20 */}
                                <div className="absolute inset-x-[10px] bottom-[10px] translate-y-[calc(100%+12px)] rounded-xl bg-black/20 backdrop-blur-xl backdrop-saturate-150 border border-white/20 p-5 shadow-soft supports-[backdrop-filter]:bg-black/20 transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] group-hover:translate-y-0 group-focus-within:translate-y-0">
                                    <h3 className="font-display text-lg text-white">
                                        {item.name}
                                    </h3>
                                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/85">
                                        {item.body}
                                    </p>
                                    <span className="mt-3 inline-flex text-xs font-semibold text-white">
                                        Lihat koleksi →
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </Stagger>
            </div>
        </section>
    );
}

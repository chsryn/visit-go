import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Reveal, Stagger, cardVariants } from "@/components/ui/Reveal";
import destinasiImage from "@/assets/kategori-destinasi.jpg";
import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";
import gorontalo from "@/assets/gorontalo.jpg"; // ponytail: placeholder Olele bawah laut, ganti dengan foto Olele asli jika sudah ada (resources/js/assets/olele-underwater.jpg)

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
            className="relative isolate overflow-hidden pt-[50px] pb-[70px] md:pt-[70px] md:pb-[90px]"
        >
            {/* parallax bg — Olele bawah laut, bg-fixed biar parallax (no jarallax). isolate+absolute tanpa -z-10 biar tidak ketutup bg-background */}
            <div aria-hidden className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-scroll md:bg-fixed"
                    style={{ backgroundImage: `url(${gorontalo})` }}
                />
                {/* fallback img untuk preload + a11y, hidden tapi bantu Vite preload */}
                <img src={gorontalo} alt="" className="hidden" aria-hidden />
                <div className="absolute inset-0 bg-[#1a1020]/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 pb-4 md:pb-6 lg:px-8">
                <Reveal
                    y={30}
                    className="mx-auto max-w-[640px] px-4 py-6 text-center md:py-10"
                >
                    <h2 className="font-display text-[24px] font-bold leading-[1.3] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)] md:text-[30px]">
                        Empat Pilar Kekayaan Gorontalo
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)] md:mt-5">
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
                                className="group relative block overflow-hidden rounded-[15px] border-0 bg-white/65 backdrop-blur-xl backdrop-saturate-150 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4),0_8px_16px_-8px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.08)_inset] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-14px_rgba(0,0,0,0.5),0_12px_24px_-10px_rgba(0,0,0,0.35)] transform-gpu dark:bg-card/60"
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

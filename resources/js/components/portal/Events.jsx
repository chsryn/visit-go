import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Reveal, cardVariants } from "@/components/ui/Reveal";
import { MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import karawoImage from "@/assets/event-karawo.jpg";
import dikiliImage from "@/assets/event-dikili.jpg";
import fesbujatonImage from "@/assets/event-fesbujaton.jpg";

const fallbackEvents = [
    {
        slug: "karnaval-karawo-2026",
        name: "Gorontalo Karnaval Karawo 2026",
        date: "11–13",
        month: "Sep 2026",
        location: "Pelataran GPCC, Kota Gorontalo",
        body: "Festival pariwisata \u201cRitme Hulondalo, Harmoni Warisan Gorontalo\u201d dengan parade busana sulaman Karawo dan pameran kuliner \u201cJelajah Rasa Nusantara\u201d.",
        image: karawoImage,
        alt: "Parade karnaval dengan busana sulaman Karawo di jalanan kota",
    },
    {
        slug: "tradisi-dikili",
        name: "Tradisi Dikili (Perayaan Maulid Nabi)",
        date: "Sep",
        month: "2026",
        location: "Masjid-masjid bersejarah, Gorontalo",
        body: "Tradisi zikir semalam suntuk masyarakat Gorontalo dalam merayakan Maulid Nabi yang sarat nilai religius dan kearifan lokal.",
        image: dikiliImage,
        alt: "Masjid bersejarah di Gorontalo saat senja dengan cahaya lentera hangat",
    },
    {
        slug: "fesbujaton-xx",
        name: "Festival Seni Budaya Jawa Tondano (FESBUJATON XX)",
        date: "9 Jul",
        month: "2026",
        location: "Desa Sidomukti, Mootilango, Kab. Gorontalo",
        body: "Agenda rutin tahunan pelestarian budaya, persaudaraan, dan toleransi masyarakat diaspora Jawa Tondano se-Indonesia Timur.",
        image: fesbujatonImage,
        alt: "Panggung festival budaya di tengah sawah desa dengan penampil berbusana tradisional",
    },
    {
        slug: "festival-pesona-teluk-tomini-2026",
        name: "Festival Pesona Teluk Tomini 2026",
        date: "20–22",
        month: "Nov 2026",
        location: "Pantai Bolihutuo, Boalemo",
        body: "Sail pass perahu hias, lomba foto bawah laut Olele, dan panggung musik etnik di tepi pantai Bolihutuo.",
        image: karawoImage,
        alt: "Festival Pesona Teluk Tomini",
    },
];
export function Events({ items }) {
    // ponytail: fallback hanya jika items undefined/null (dev), jika [] dari DB = no celebration → hide swiper
    const data = Array.isArray(items) ? items : fallbackEvents;
    const hasData = data.length > 0;
    const showSwiper = data.length > 3;
    return (
        <section
            id="agenda"
            className="relative bg-[#715386]/[0.04] py-12 md:py-16"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <Reveal
                    y={12}
                    className="mx-auto max-w-[640px] px-4 py-4 text-center md:py-6"
                >
                    {/* <span className="text-[0.7rem] uppercase tracking-[0.15em] text-primary">
                        Agenda Budaya
                    </span> */}
                    <h2 className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl">
                        Perayaan yang akan datang
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:mt-5">
                        Perayaan yang merangkai kalender budaya Gorontalo —
                        Karnaval Karawo, Tradisi Dikili, dan Festival Pesona
                        Teluk Tomini di jantung Hulondalo.
                    </p>
                </Reveal>

                {hasData ? (
                    <div className="relative mt-8 px-8 md:mt-10 lg:px-8">
                        <Swiper
                            modules={[Navigation]}
                            slidesPerView={1}
                            spaceBetween={20}
                            slidesPerGroup={1}
                            navigation={
                                showSwiper
                                    ? {
                                          nextEl: ".btn-next-event",
                                          prevEl: ".btn-prev-event",
                                      }
                                    : false
                            }
                            breakpoints={{
                                768: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                            className="!pb-6 !pt-2 [&_.swiper-wrapper]:!items-stretch"
                        >
                            {data.map((event, i) => {
                                const raw = event.image;
                                const fallbackMap = {
                                    "karnaval-karawo-2026": karawoImage,
                                    "tradisi-dikili": dikiliImage,
                                    "fesbujaton-xx": fesbujatonImage,
                                    "festival-pesona-teluk-tomini-2026":
                                        karawoImage,
                                };
                                const src =
                                    typeof raw === "string" && raw.trim() !== ""
                                        ? raw.startsWith("/") ||
                                          raw.startsWith("http") ||
                                          raw.includes("/build/")
                                            ? raw
                                            : `/${raw}`
                                        : (fallbackMap[event.slug] ??
                                          karawoImage);
                                return (
                                    <SwiperSlide
                                        key={event.slug ?? event.name}
                                        className="!h-auto flex"
                                    >
                                        <motion.div
                                            variants={cardVariants}
                                            transition={{
                                                delay: i * 0.07,
                                                duration: 0.6,
                                                ease: "easeOut",
                                            }}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{
                                                once: true,
                                                margin: "-50px",
                                                amount: 0.2,
                                            }}
                                            className="flex h-full w-full"
                                        >
                                            <Link
                                                href={`/event/${event.slug}`}
                                                className="group flex h-[320px] min-h-[320px] w-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-white/65 backdrop-blur-xl backdrop-saturate-150 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] dark:bg-card/60"
                                            >
                                                <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-muted">
                                                    <img
                                                        src={src}
                                                        alt={event.alt}
                                                        width={1280}
                                                        height={960}
                                                        loading="lazy"
                                                        className="size-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
                                                    />
                                                    <div className="absolute left-3 top-3 rounded-lg border border-white/15 bg-black/10 px-2.5 py-1.5 text-center shadow-sm backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-black/10">
                                                        <p className="text-xs font-bold leading-tight text-white">
                                                            {event.date}
                                                        </p>
                                                        <p className="text-[0.6rem] uppercase tracking-[0.15em] text-white/80">
                                                            {event.month}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="relative flex flex-1 flex-col overflow-hidden p-3.5 min-h-[108px]">
                                                    <img
                                                        src={src}
                                                        alt=""
                                                        aria-hidden
                                                        className="pointer-events-none absolute inset-0 size-full object-cover blur-[4px] scale-105"
                                                    />
                                                    <div
                                                        aria-hidden
                                                        className="pointer-events-none absolute inset-0 bg-primary/65 backdrop-blur-lg backdrop-saturate-150 supports-[backdrop-filter]:bg-primary/55"
                                                    />
                                                    <div className="relative">
                                                        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">
                                                            {event.name}
                                                        </p>
                                                        <p className="mt-1 line-clamp-2 text-xs leading-[1.5] text-white/80">
                                                            {event.body}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                        {showSwiper && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Previous slide"
                                    className="btn-prev-event absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all hover:scale-105 hover:text-primary md:flex h-12 w-12 md:-left-6 lg:-left-12"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="size-5"
                                    >
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next slide"
                                    className="btn-next-event absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all hover:scale-105 hover:text-primary md:flex h-12 w-12 md:-right-6 lg:-right-12"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="size-5"
                                    >
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <p className="mt-12 text-sm text-muted-foreground">
                        Belum ada perayaan mendatang.
                    </p>
                )}
            </div>
        </section>
    );
}

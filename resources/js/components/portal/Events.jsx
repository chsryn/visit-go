import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Reveal, cardVariants } from "@/components/ui/Reveal";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
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
];
export function Events({ items }) {
    const scroller = useRef(null);
    const scrollBy = (direction) => {
        scroller.current?.scrollBy({ left: direction * 400, behavior: "smooth" });
    };
    const data = items && items.length ? items : fallbackEvents;
    return (<section id="agenda" className="relative overflow-hidden bg-[#715386]/[0.04] py-[30px] md:py-[50px]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal y={12} className="max-w-xl">
            <span className="text-[0.7rem] uppercase tracking-[0.35em] text-primary">
              Agenda Budaya
            </span>
            <h2 className="mt-6 font-display text-3xl leading-tight text-foreground sm:text-4xl">
              Perayaan yang akan datang
            </h2>
          </Reveal>
          <div className="flex gap-4">
            <button type="button" aria-label="Geser ke kiri" onClick={() => scrollBy(-1)} className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
              <ArrowLeft className="size-5"/>
            </button>
            <button type="button" aria-label="Geser ke kanan" onClick={() => scrollBy(1)} className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
              <ArrowRight className="size-5"/>
            </button>
          </div>
        </div>

        <div ref={scroller} className="mt-16 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {data.map((event, i) => {
              const raw = event.image;
              const fallbackMap = {
                  "karnaval-karawo-2026": karawoImage,
                  "tradisi-dikili": dikiliImage,
                  "fesbujaton-xx": fesbujatonImage,
              };
              const src =
                  typeof raw === "string" && raw.trim() !== ""
                      ? raw.startsWith("/") || raw.startsWith("http") || raw.includes("/build/")
                          ? raw
                          : `/${raw}`
                      : fallbackMap[event.slug] ?? karawoImage;
              return (
              <motion.div key={event.slug ?? event.name} variants={cardVariants} transition={{ delay: i * 0.07, duration: 0.6, ease: "easeOut" }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px", amount: 0.2 }}>
              <Link href={`/event/${event.slug}`} className="group flex w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-card shadow-md transition-shadow duration-300 hover:shadow-xl sm:w-[400px]">
              <div className="relative h-56 overflow-hidden">
                <img src={src} alt={event.alt} width={1280} height={960} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute left-4 top-4 rounded-lg bg-card/95 px-4 py-2 text-center shadow-sm backdrop-blur-sm">
                  <p className="text-base font-bold leading-tight text-primary">{event.date}</p>
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
                    {event.month}
                  </p>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-display text-xl leading-snug text-foreground">
                  {event.name}
                </h3>
                <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-primary">
                  <MapPin className="size-3.5"/>
                  {event.location}
                </span>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {event.body}
                </p>
              </div>
            </Link>
            </motion.div>
          );})}
        </div>
      </div>
    </section>);
}

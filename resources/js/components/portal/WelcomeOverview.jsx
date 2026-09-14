import { useState, useEffect } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { resolveStorageUrl } from "@/lib/image";
import pulauCintaImg from "@/assets/pulau-cinta.jpg";
import pulauDiyonumoImg from "@/assets/pulau-diyonumo.jpg";
import bentengOtanahaImg from "@/assets/benteng-otanaha.jpg";
import motifKarawoImg from "@/assets/motif-karawo.jpg";
import menyulamKarawoImg from "@/assets/menyulam-karawo.webp";
import busanaAdatImg from "@/assets/busana-adat-gorontalo.jpg";
import patungPataniImg from "@/assets/patung-patani.jpg";

const FALLBACK = [busanaAdatImg, pulauCintaImg, bentengOtanahaImg, motifKarawoImg, menyulamKarawoImg, pulauDiyonumoImg, patungPataniImg];

function Thumb({ src, alt, className, delay = 0, activeSrc }) {
    const [shown, setShown] = useState(src);
    const [next, setNext] = useState(null);
    const [fading, setFading] = useState(false);
    useEffect(() => {
        if (!activeSrc || activeSrc === shown) return;
        setNext(activeSrc);
        const t1 = setTimeout(() => setFading(true), delay);
        const t2 = setTimeout(() => { setShown(activeSrc); setNext(null); setFading(false); }, delay + 700);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [activeSrc, delay, shown]);
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <img src={shown} alt={alt} className="size-full rounded-xl object-cover" loading="lazy" />
            {next && <img src={next} alt={alt} className={`absolute inset-0 size-full rounded-xl object-cover transition-opacity duration-700 ease-in-out ${fading ? "opacity-100" : "opacity-0"}`} />}
        </div>
    );
}

export function WelcomeOverview({ galleries = [] }) {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        if (!galleries.length) return;
        const id = setInterval(() => setTick((t) => t + 1), 5000);
        return () => clearInterval(id);
    }, [galleries.length]);

    const getSrc = (offset, fallback) => {
        if (!galleries.length) return fallback;
        const g = galleries[(tick + offset) % galleries.length];
        return resolveStorageUrl(g?.image_url ?? g?.image) ?? fallback;
    };

    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-12 md:py-16">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "240px 240px" }} />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[60%_40%] lg:gap-10">
                    <Reveal y={18}>
                        <span className="text-xs font-semibold uppercase tracking-[0.10em] text-muted-foreground">Selamat Datang di Gorontalo</span>
                        <h2 className="mt-3 font-display text-[40px] font-bold leading-[0.92] tracking-tight text-foreground md:text-[56px]">
                            Di mana Teluk<br />Tomini <span className="font-normal italic text-ocean">bertemu</span><br />Hulonthalo.
                        </h2>
                        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">Gorontalo adalah pesona tersembunyi di jantung Sulawesi, tempat keindahan alam, kekayaan budaya, dan keramahan masyarakat di dalam keberagaman.</p>
                        <div className="mt-7 grid max-w-[560px] grid-cols-12 gap-2">
                            <div className="relative col-span-7 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <Thumb src={busanaAdatImg} activeSrc={getSrc(0, busanaAdatImg)} alt="Budaya — Busana Adat Gorontalo" className="h-[108px] w-full rounded-xl" delay={0} />
                            </div>
                            <div className="relative col-span-5 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <Thumb src={pulauCintaImg} activeSrc={getSrc(1, pulauCintaImg)} alt="Destinasi — Pulo Cinta" className="h-[108px] w-full rounded-xl" delay={500} />
                            </div>
                            <div className="relative col-span-4 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <Thumb src={bentengOtanahaImg} activeSrc={getSrc(2, bentengOtanahaImg)} alt="Destinasi — Benteng Otanaha" className="h-[84px] w-full rounded-xl" delay={1000} />
                            </div>
                            <div className="relative col-span-4 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <Thumb src={motifKarawoImg} activeSrc={getSrc(3, motifKarawoImg)} alt="Kerajinan — Motif Karawo" className="h-[84px] w-full rounded-xl" delay={1500} />
                            </div>
                            <div className="relative col-span-4 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <Thumb src={menyulamKarawoImg} activeSrc={getSrc(4, menyulamKarawoImg)} alt="Kerajinan — Menyulam Karawo" className="h-[84px] w-full rounded-xl" delay={2000} />
                            </div>
                        </div>
                    </Reveal>
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                            <div className="aspect-[3/2] w-full overflow-hidden rounded-xl bg-black">
                                <iframe src="https://www.youtube.com/embed/oVU3NvwTC_Y" title="Gorontalo — Video" className="h-full w-full object-cover rounded-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen frameBorder="0" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <h3 className="font-display text-[15px] font-bold leading-tight text-foreground">Seputar Galeri — Provinsi Gorontalo</h3>
                            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">Mengenal Lebih Dalam — Serambi Madinah Provinsi Gorontalo.</p>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <Thumb src={pulauDiyonumoImg} activeSrc={getSrc(5, pulauDiyonumoImg)} alt="Pulau Diyonumo" className="h-[84px] w-full rounded-lg" delay={2500} />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <Thumb src={patungPataniImg} activeSrc={getSrc(6, patungPataniImg)} alt="Patung Patani — ikon Kota Gorontalo" className="h-[84px] w-full rounded-lg" delay={3000} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

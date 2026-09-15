import { Reveal } from "@/components/ui/Reveal";
import { introSvgPattern } from "../data";
import motifKarawoImg from "@/assets/motif-karawo.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";
import menyulamKarawoImg from "@/assets/menyulam-karawo.webp";
import busanaAdatImg from "@/assets/busana-adat-gorontalo.jpg";

export function IntroKerajinan() {
    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-8 md:py-12">
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
                    <div className="order-2 lg:order-1 grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img
                                    src={motifKarawoImg}
                                    alt="Motif Karawo"
                                    className="aspect-[4/3] w-full rounded-xl object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img
                                    src={kerajinanImage}
                                    alt="Anyaman"
                                    className="h-[120px] w-full rounded-xl object-cover"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img
                                    src={menyulamKarawoImg}
                                    alt="Menyulam Karawo"
                                    className="aspect-[4/3] w-full rounded-xl object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img
                                    src={busanaAdatImg}
                                    alt="Karawo pada busana"
                                    className="h-[120px] w-full rounded-xl object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <Reveal y={16} className="order-1 lg:order-2">
                        <h2 className="font-display text-[30px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[38px]">
                            Satu lubang,
                            <br />
                            <span className="font-normal italic text-ocean">
                                satu benang.
                            </span>
                        </h2>
                        <p className="mt-4 w-full text-[15px] leading-relaxed text-muted-foreground">
                            Karawo dibuat dengan mengiris dan mencabut benang —
                            bukan menambah. Kekosongan itu yang diisi motif
                            flora. Seminggu untuk satu kain, seumur hidup untuk
                            satu tangan yang mahir.
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
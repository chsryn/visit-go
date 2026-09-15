import { Reveal } from "@/components/ui/Reveal";
import { introSvgPattern } from "../data";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import binteImg from "@/assets/binte.jpg";

export function IntroKuliner() {
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
                <div className="grid items-start gap-10 lg:grid-cols-[55%_45%]">
                    <div className="order-2 lg:order-1">
                        <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                            <img
                                src={kulinerImage}
                                alt="Hidangan Gorontalo"
                                className="aspect-[4/3] w-full rounded-xl object-cover"
                            />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={binteImg}
                                    alt="Binthe Biluhuta"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={kulinerImage}
                                    alt="Ilabulo"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={binteImg}
                                    alt="Sambal Sagela"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <Reveal y={16} className="order-1 lg:order-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
                            Warisan Kuliner Gorontalo
                        </span>
                        <h2 className="mt-3 font-display text-[34px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[44px]">
                            Jagung, sagu,
                            <br />
                            <span className="font-normal italic text-ocean">
                                dan rempah asap.
                            </span>
                        </h2>
                        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground">
                            Dapur Gorontalo bertumpu pada hasil laut segar Teluk
                            Tomini dan jagung pulut lokal. Diolah tanpa santan
                            pekat, karakternya didominasi rasa gurih, asam segar
                            jeruk nipis, dan aroma asap yang kuat.
                        </p>

                        <div className="mt-6 space-y-4 border-t border-border pt-6">
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Binthe Biluhuta
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    Sup jagung pipil dengan suwiran cakalang,
                                    kelapa parut, kemangi, dan perasan jeruk
                                    nipis.
                                </span>
                            </div>
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Ilabulo
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    Adonan sagu berbumbu lada pedas berisi
                                    jeroan ayam, dibungkus daun woka lalu
                                    dibakar di atas bara.
                                </span>
                            </div>
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Sambal Sagela
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    Olahan ikan roa asap yang ditumbuk halus
                                    bersama cabai dan bawang hingga renyah serta
                                    gurih.
                                </span>
                            </div>
                        </div>
                        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                            Semua bisa dinikmati langsung di pasar dan warkop —
                            hangat, segar, dan dibuat di depan mata. Rasa yang
                            jujur tanpa pemanis adalah ciri paling kuat dapur
                            Gorontalo.
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
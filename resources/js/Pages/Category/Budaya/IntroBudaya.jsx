import { Reveal } from "@/components/ui/Reveal";
import { introSvgPattern } from "../data";
import budayaImage from "@/assets/kategori-budaya.jpg";
import busanaAdatImg from "@/assets/busana-adat-gorontalo.jpg";
import patungPataniImg from "@/assets/patung-patani.jpg";
import bentengOtanahaImg from "@/assets/benteng-otanaha.jpg";

export function IntroBudaya() {
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
                <div className="grid items-start gap-10 lg:grid-cols-[55%_45%]">
                    <div className="order-2 lg:order-1">
                        <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                            <img
                                src={budayaImage}
                                alt="Warisan budaya Gorontalo"
                                className="aspect-[4/3] w-full rounded-xl object-cover"
                            />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={busanaAdatImg}
                                    alt="Busana adat"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={patungPataniImg}
                                    alt="Patung Patani"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={bentengOtanahaImg}
                                    alt="Benteng Otanaha"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <Reveal y={16} className="order-1 lg:order-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">
                            Warisan Budaya Gorontalo
                        </span>
                        <h2 className="mt-3 font-display text-[34px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[44px]">
                            Adat yang
                            <br />
                            <span className="font-normal italic text-ocean">
                                masih hidup.
                            </span>
                        </h2>
                        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground">
                            Dari Pohutu Limo hingga Saronde dan Dikili — adat
                            Gorontalo dirawat sebagai ruang tamu: dipakai
                            sehari-hari, diwariskan, dan terus ditafsir ulang.
                            Jelajahi jejak sejarah, rasa, dan karya yang saling
                            terhubung.
                        </p>
                        <div className="mt-6 space-y-4 border-t border-border pt-6">
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Pohutu Limo
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    lima kerajaan yang menjadi falsafah
                                    persatuan Gorontalo
                                </span>
                            </div>
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Saronde & Dikili
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    tari penyambutan dan zikir semalam suntuk di
                                    masjid tua
                                </span>
                            </div>
                            <div className="grid md:grid-cols-[140px_1fr] md:gap-4 gap-1 text-sm">
                                <span className="font-bold text-foreground">
                                    Karawo
                                </span>
                                <span className="text-muted-foreground leading-relaxed">
                                    sulaman iris-cabut benang bermotif flora
                                    pesisir
                                </span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
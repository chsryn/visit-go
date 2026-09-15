import { Reveal } from "@/components/ui/Reveal";
import { introSvgPattern } from "../data";
import pulauCintaImg from "@/assets/pulau-cinta.jpg";
import bentengOtanahaImg from "@/assets/benteng-otanaha.jpg";
import pulauDiyonumoImg from "@/assets/pulau-diyonumo.jpg";
import pantaiTaludaaImg from "@/assets/pantai-taludaa.jpg";

export function IntroDestinasi() {
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
                    <div className="order-2 lg:order-1">
                        <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                            <img
                                src={pulauCintaImg}
                                alt="Pulo Cinta Gorontalo"
                                className="aspect-[4/3] w-full rounded-xl object-cover"
                            />
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={bentengOtanahaImg}
                                    alt="Benteng Otanaha"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={pulauDiyonumoImg}
                                    alt="Pulau Diyonumo"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm">
                                <img
                                    src={pantaiTaludaaImg}
                                    alt="Pantai Taludaa"
                                    className="h-[72px] w-full rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <Reveal y={16} className="order-1 lg:order-2">
                        <h2 className="font-display text-[30px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[38px]">
                            Dari Teluk Tomini
                            <br />
                            <span className="font-normal italic text-ocean">
                                hingga benteng bersejarah.
                            </span>
                        </h2>
                        <p className="mt-4 w-full text-[15px] leading-relaxed text-muted-foreground">
                            Gorontalo menawarkan keindahan alam eksotis yang
                            masih perawan—mulai dari titik penyelaman kelas
                            dunia di Olele, interaksi dekat dengan Hiu Paus di
                            Botubarani, hingga lanskap peninggalan sejarah yang
                            megah.
                        </p>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
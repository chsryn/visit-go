import { Reveal } from "@/components/ui/Reveal";
import destinasiImg from "@/assets/kategori-destinasi.jpg";
import budayaImg from "@/assets/kategori-budaya.jpg";
import kulinerImg from "@/assets/kategori-kuliner.jpg";
import kerajinanImg from "@/assets/kategori-kerajinan.jpg";
import gorontaloImg from "@/assets/gorontalo.jpg";

export function WelcomeOverview() {
    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-12 md:py-16">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "240px 240px",
                }}
            />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[60%_40%] lg:gap-10">
                    <Reveal y={18}>
                        <span className="text-xs font-semibold uppercase tracking-[0.10em] text-gray">Selamat Datang di Gorontalo</span>
                        <h2 className="mt-3 font-display text-[40px] font-bold leading-[0.92] tracking-tight text-foreground md:text-[56px]">
                            Di mana Teluk
                            <br />
                            Tomini <span className="font-normal italic text-ocean">bertemu</span>
                            <br />
                            Hulonthalo.
                        </h2>
                        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
                            Gorontalo adalah pesona tersembunyi di jantung Sulawesi, tempat keindahan alam, kekayaan budaya, dan keramahan masyarakat di dalam keberagaman.
                        </p>
                        <div className="mt-7 grid max-w-[560px] grid-cols-12 gap-2">
                            <div className="relative col-span-7 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img src={budayaImg} alt="Pelajari Budaya — Tari Saronde" className="h-[108px] w-full rounded-xl object-cover" />
                            </div>
                            <div className="relative col-span-5 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img src={destinasiImg} alt="Jelajahi Destinasi — Pulo Cinta" className="h-[108px] w-full rounded-xl object-cover" />
                            </div>
                            <div className="relative col-span-4 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img src={gorontaloImg} alt="Wilayah — peta Gorontalo" className="h-[84px] w-full rounded-xl object-cover" />
                            </div>
                            <div className="relative col-span-4 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img src={kerajinanImg} alt="Pilar Wisata — Karawo" className="h-[84px] w-full rounded-xl object-cover" />
                            </div>
                            <div className="relative col-span-4 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                                <img src={kulinerImg} alt="Event Tahunan — kuliner & festival" className="h-[84px] w-full rounded-xl object-cover" />
                            </div>
                        </div>
                    </Reveal>
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
                            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80&auto=format&fit=crop" alt="Teluk Tomini aerial — Taman Laut Olele" className="aspect-video w-full rounded-xl object-cover" loading="lazy" />
                        </div>
                        <div className="mt-3">
                            <h3 className="font-display text-[15px] font-bold leading-tight text-foreground">Teluk Tomini — rumah karang Salvador Dali</h3>
                            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">Satu-satunya habitat karang bermotif abstrak di Indonesia — snorkeling 5 meter sudah melihat taman warna-warni di Olele.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

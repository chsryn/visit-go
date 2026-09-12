import { Reveal } from "@/components/ui/Reveal";
import gorontalo from "@/assets/gorontalo.jpg"; // ponytail: placeholder Olele bawah laut, ganti dengan foto Olele asli jika sudah ada (resources/js/assets/olele-underwater.jpg)

export function Categories() {
    return (
        <section
            id="kategori"
            className="relative isolate flex min-h-[52vh] items-center justify-center overflow-hidden md:min-h-[62vh]"
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
                <div className="absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-6 lg:px-8">
                <Reveal
                    y={30}
                    className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-6 text-center md:py-10"
                >
                    <h2 className="font-display whitespace-nowrap text-center text-xl font-bold leading-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)] sm:text-3xl md:text-4xl lg:text-5xl">
                        Jelajahi Pesona Wisata & Budaya Gorontalo
                    </h2>
                    <p className="mt-4 max-w-2xl text-center text-base leading-relaxed text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)] md:mt-5 md:text-lg">
                        Dari eksotisme bahari Teluk Tomini dan cita rasa khas Gorontalo diselimuti dengan kain
                        Karawo, jelajahi ragam destinasi alam, warisan budaya
                        Hulonthalo.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}

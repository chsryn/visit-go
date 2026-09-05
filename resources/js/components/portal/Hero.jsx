import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-whale-shark.jpg";
import destinasiImage from "@/assets/kategori-destinasi.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";

const slides = [
    {
        image: heroImage,
        title: "Discover The Hidden Paradise",
        subtitle: "Telusuri keindahan Gorontalo yang belum tersentuh.",
    },
    {
        image: destinasiImage,
        title: "Rich Culture & Heritage",
        subtitle: "Rasakan kehangatan tradisi Hulondalo.",
    },
    {
        image: kulinerImage,
        title: "Authentic Culinary",
        subtitle: "Nikmati cita rasa pesisir yang tak terlupakan.",
    },
];

export function Hero() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(id);
    }, []);

    return (
        <section
            id="top"
            className="relative h-screen h-[100dvh] w-full overflow-hidden bg-black"
        >
            {slides.map((slide, index) => (
                <img
                    key={index}
                    src={slide.image}
                    alt={slide.title}
                    width={1920}
                    height={1280}
                    className={`absolute inset-0 size-full object-cover transition-all duration-1000 ease-in-out ${
                        index === current
                            ? "opacity-100 scale-105"
                            : "opacity-0 scale-100"
                    }`}
                />
            ))}

            <div className="absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative flex h-screen h-[100dvh] flex-col items-center justify-center px-6 text-center">
                <span className="text-[0.68rem] uppercase tracking-[0.35em] text-white/80">
                    Portal Informasi Wisata & Budaya Provinsi Gorontalo
                </span>
                <h1 className="mt-6 max-w-3xl font-display text-4xl font-light leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {slides[current].title}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
                    {slides[current].subtitle}
                </p>
            </div>

            <div className="absolute bottom-[30px] left-1/2 flex -translate-x-1/2 gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setCurrent(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-[5px] rounded-full transition-all duration-300 ${
                            index === current
                                ? "w-[15px] bg-white"
                                : "w-[15px] bg-white/30 hover:bg-white/60"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}

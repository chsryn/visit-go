import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-whale-shark.jpg";
import destinasiImage from "@/assets/saronde.jpeg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";

const slides = [
    {
        image: heroImage,
        title: "Discover Gorontalo's Hidden Wonders",
        subtitle:
            "Telusuri surga tersembunyi dan pesona alam bawah laut Gorontalo.",
    },
    {
        image: destinasiImage,
        title: "Rich Culture & Hulondalo Heritage",
        subtitle:
            "Berkenalan dengan budaya melalui kehangatan tradisi masyarakat lokal.",
    },
    {
        image: kulinerImage,
        title: "Authentic Gorontalo Culinary",
        subtitle:
            "Nikmati cita rasa khas Gorontalo yang tak terlupakan.",
    },
];

export function Hero() {
    const [current, setCurrent] = useState(0);
    const [q, setQ] = useState("");
    const go = (val) => {
        const v = (val ?? q).trim();
        if (!v) return;
        router.get("/search", { q: v });
    };

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
                <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {slides[current].title}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
                    {slides[current].subtitle}
                </p>
                <div className="mt-8 w-full max-w-xl">
                    <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 p-1.5 shadow-soft">
                        <Search className="ml-3 size-4 shrink-0 text-white/70" />
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && go()}
                            placeholder="Cari destinasi, budaya, kuliner Gorontalo..."
                            className="flex-1 bg-transparent px-2 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => go()}
                            className="shrink-0 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-white/90"
                        >
                            Cari
                        </button>
                    </div>
                </div>
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

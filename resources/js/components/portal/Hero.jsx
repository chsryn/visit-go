import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Search } from "lucide-react";
import heroImage from "@/assets/hero-whale-shark.jpg";
import destinasiImage from "@/assets/saronde.jpeg";
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
                    <div className="flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md border border-white/20 p-1.5 shadow-lg">
                        <Search className="ml-3 size-4 shrink-0 text-muted-foreground" />
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && go()}
                            placeholder="Cari destinasi, budaya, kuliner Gorontalo..."
                            className="flex-1 bg-transparent px-2 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                        <datalist id="hero-reco">
                            <option value="Pulo Cinta" />
                            <option value="Karawo" />
                            <option value="Milu Siram" />
                            <option value="Botubarani" />
                        </datalist>
                        <button
                            type="button"
                            onClick={() => go()}
                            className="shrink-0 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
                        >
                            Cari
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                        {["Pulo Cinta", "Karawo", "Milu Siram", "Botubarani"].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => go(s)}
                                className="rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/25"
                            >
                                {s}
                            </button>
                        ))}
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

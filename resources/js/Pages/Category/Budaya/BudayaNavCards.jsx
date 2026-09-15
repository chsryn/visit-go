import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";

export function BudayaNavCards() {
    const cards = [
        {
            title: "Sejarah & Peradaban",
            desc: "Jejak Hulontalangi, Pohala'a, hingga proklamasi Nani Wartabone.",
            image: budayaImage,
            href: "/sejarah",
            cta: "Jelajahi Sejarah",
            location: "Kota Gorontalo",
        },
        {
            title: "Kuliner Khas",
            desc: "Cita rasa pesisir Teluk Tomini — Milu Siram, Ilabulo, dan Sagela.",
            image: kulinerImage,
            href: "/kuliner",
            cta: "Lihat Kuliner Khas",
            location: "Teluk Tomini",
        },
        {
            title: "Kerajinan & Kriya",
            desc: "Karawo, anyaman rotan, dan karya tangan Gorontalo.",
            image: kerajinanImage,
            href: "/kerajinan",
            cta: "Lihat Kerajinan Daerah",
            location: "Kampung Karawo",
        },
    ];
    return (
        <section className="bg-white py-8 lg:py-12">
            <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid gap-6 md:grid-cols-3">
                    {cards.map((c) => (
                        <a key={c.title} href={c.href} className="group">
                            <div className="relative overflow-hidden rounded-3xl">
                                <img
                                    src={c.image}
                                    alt={c.title}
                                    className="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                                    loading="lazy"
                                />
                            </div>
                            <div className="mt-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-display text-lg font-semibold text-foreground">
                                            {c.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {c.location}
                                        </p>
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-arrow-up-right mt-1 size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        aria-hidden="true"
                                    >
                                        <path d="M7 7h10v10"></path>
                                        <path d="M7 17 17 7"></path>
                                    </svg>
                                </div>
                                <p className="mt-2 max-w-[34ch] text-sm leading-6 text-muted-foreground">
                                    {c.desc}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                                    {c.cta} <span aria-hidden>→</span>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
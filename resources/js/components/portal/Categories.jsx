import destinasiImage from "@/assets/kategori-destinasi.jpg";
import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";
const categories = [
    {
        id: "destinasi",
        name: "Destinasi Wisata",
        body: "Botubarani, Pulo Cinta, Taman Laut Olele, dan pulau-pulau tersembunyi Teluk Tomini.",
        image: destinasiImage,
        alt: "Lagun biru kehijauan dengan vila di atas air di Pulo Cinta",
    },
    {
        id: "budaya",
        name: "Ensiklopedia Budaya",
        body: "Tradisi Dikili, Tari Saronde, adat istiadat, dan warisan lisan masyarakat Hulondalo.",
        image: budayaImage,
        alt: "Penari tradisional Gorontalo mengenakan busana sulaman Karawo",
    },
    {
        id: "kuliner",
        name: "Kuliner Khas",
        body: "Milu siram, ilabulo, sambal sagela, dan cita rasa laut khas pesisir Gorontalo.",
        image: kulinerImage,
        alt: "Hidangan khas Gorontalo tersaji di atas meja kayu",
    },
    {
        id: "kerajinan",
        name: "Kerajinan Daerah",
        body: "Sulaman Karawo, anyaman rotan, dan mahakarya tangan perajin lokal.",
        image: kerajinanImage,
        alt: "Tangan perajin menyulam motif Karawo di atas kain",
    },
];
export function Categories() {
    return (
        <section id="kategori" className="bg-background py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="max-w-xl">
                    <span className="text-[0.7rem] uppercase tracking-[0.35em] text-aqua">
                        Jelajahi Kategori
                    </span>
                    <h2 className="mt-6 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                        Empat pilar kekayaan Gorontalo
                    </h2>
                </div>

                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((item) => (
                        <a
                            key={item.id}
                            id={item.id}
                            href="#top"
                            onClick={(e) => e.preventDefault()}
                            className="group relative block overflow-hidden rounded-2xl bg-card shadow-md transition-shadow duration-300 hover:shadow-xl"
                        >
                            <div className="h-80 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.alt}
                                    width={1280}
                                    height={960}
                                    loading="lazy"
                                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-6">
                                <h3 className="font-display text-xl text-primary-foreground">
                                    {item.name}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
                                    {item.body}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

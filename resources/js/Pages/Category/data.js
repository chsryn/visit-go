import destinasiImage from "@/assets/kategori-destinasi.jpg";
import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";
import karawoImage from "@/assets/event-karawo.jpg";
import binteImg from "@/assets/binte.jpg";
import motifKarawoImg from "@/assets/motif-karawo.jpg";
import pulauCintaImg from "@/assets/pulau-cinta.jpg";
import pulauDiyonumoImg from "@/assets/pulau-diyonumo.jpg";
import bentengOtanahaImg from "@/assets/benteng-otanaha.jpg";
import busanaAdatImg from "@/assets/busana-adat-gorontalo.jpg";
import patungPataniImg from "@/assets/patung-patani.jpg";

export const heroByCategory = {
    destinasi: {
        title: "Destinasi Wisata",
        image: destinasiImage,
    },
    budaya: {
        title: "Budaya Gorontalo",
        image: budayaImage,
    },
    kuliner: {
        title: "Kuliner Khas",
        image: kulinerImage,
    },
    kerajinan: {
        title: "Kerajinan Daerah",
        image: kerajinanImage,
    },
    event: {
        title: "Agenda Budaya",
        image: karawoImage,
    },
};

export const fallbackImg = {
    destinasi: destinasiImage,
    budaya: budayaImage,
    kuliner: kulinerImage,
    kerajinan: kerajinanImage,
    event: karawoImage,
};

export const getRotatedFallback = (category, itemId) => {
    const fallbacks = {
        kuliner: [kulinerImage, binteImg],
        kerajinan: [kerajinanImage, motifKarawoImg],
        destinasi: [
            destinasiImage,
            pulauCintaImg,
            pulauDiyonumoImg,
            bentengOtanahaImg,
        ],
        budaya: [budayaImage, busanaAdatImg, patungPataniImg],
    };

    const categoryFallbacks = fallbacks[category] || [fallbackImg[category]];
    if (categoryFallbacks.length === 0) return fallbackImg[category];

    const hash = String(itemId)
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return categoryFallbacks[hash % categoryFallbacks.length];
};

export const introSvgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`;

export const heroSvgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3C/g%3E%3C/svg%3E")`;

import destinasiImage from "@/assets/kategori-destinasi.jpg";
import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";
import karawoImage from "@/assets/event-karawo.jpg";
import dikiliImage from "@/assets/event-dikili.jpg";
import fesbujatonImage from "@/assets/event-fesbujaton.jpg";

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

export const fallbackBySlug = {
    "botubarani-pulo-cinta": fallbackImg.destinasi,
    "tari-saronde-dikili": fallbackImg.budaya,
    "milu-siram-ilabulo": fallbackImg.kuliner,
    "sulaman-karawo": fallbackImg.kerajinan,
    "karnaval-karawo-2026": fallbackImg.event,
    "tradisi-dikili": dikiliImage,
    "fesbujaton-xx": fesbujatonImage,
};

export const introSvgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`;

export const categoryLabels = {
    destinasi: "Destinasi",
    budaya: "Budaya",
    kuliner: "Kuliner",
    kerajinan: "Kerajinan",
    event: "Agenda",
};

export const heroSvgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3C/g%3E%3C/svg%3E")`;

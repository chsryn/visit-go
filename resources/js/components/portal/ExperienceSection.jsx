import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const gallery = [
    { title: "Explore", category: "Pulau & Pantai", desc: "Telusuri pulau tersembunyi Saronde & Pulo Cinta", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80&auto=format&fit=crop", span: "lg:col-span-8 lg:row-span-2" },
    { title: "Dive", category: "Bawah Laut", desc: "Karang Salvador Dali di Olele", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80&auto=format&fit=crop", span: "lg:col-span-4" },
    { title: "Taste", category: "Kuliner", desc: "Binte Biluhuta & Ilabulo yang pedas gurih", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&auto=format&fit=crop", span: "lg:col-span-4" },
    { title: "Culture", category: "Budaya", desc: "Tari Saronde & tradisi Dikili", img: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80&auto=format&fit=crop", span: "lg:col-span-4" },
    { title: "Relax", category: "Resor", desc: "Menginap tenang di Pulo Cinta", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&auto=format&fit=crop", span: "lg:col-span-4" },
    { title: "Adventure", category: "Sejarah", desc: "Sunset di Benteng Otanaha", img: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=600&q=80&auto=format&fit=crop", span: "lg:col-span-4" },
];

export function ExperienceSection() {
    const [lightbox, setLightbox] = useState(null);
    return (
        <section className="bg-[#FCFBFC] py-16 lg:py-20">
            <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <Reveal y={14} className="max-w-xl">
                        {/* <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sand">— Galeri</p> */}
                        <h2 className="mt-2 font-display text-[28px] font-bold leading-tight text-foreground md:text-4xl">
                            Jelajahi Potret Gorontalo
                            <br />
                            <span className="font-normal italic text-ocean">dalam bingkai</span>
                        </h2>
                    </Reveal>
                    <Reveal y={14} delay={0.08} className="max-w-md">
                        <div className="mt-3 hidden h-px w-full bg-border md:block" />
                    </Reveal>
                </div>
                <div className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-2 lg:grid-cols-12">
                    {gallery.map((g) => (
                        <button key={g.title} type="button" onClick={() => setLightbox(g)} className={`group relative overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm transition-all hover:shadow-md ${g.span}`}>
                            <img src={g.img} alt={g.title} className="h-full w-full rounded-xl object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
                        </button>
                    ))}
                </div>
            </div>
            <Dialog open={!!lightbox} onOpenChange={(v) => !v && setLightbox(null)}>
                <DialogContent className="max-w-3xl bg-white p-0 overflow-hidden">
                    <DialogTitle className="sr-only">{lightbox?.title}</DialogTitle>
                    {lightbox && (
                        <div>
                            <img src={lightbox.img} alt={lightbox.title} className="h-[420px] w-full object-cover" />
                            <div className="p-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sand">{lightbox.category}</p>
                                <h3 className="font-display text-lg font-bold text-foreground">{lightbox.title}</h3>
                                <p className="text-sm text-muted-foreground">{lightbox.desc}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}

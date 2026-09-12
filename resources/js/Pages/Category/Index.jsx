import { Head, Link } from "@inertiajs/react";
import { Navbar } from "@/components/portal/Navbar";
import { SiteFooter } from "@/components/portal/SiteFooter";
import { AiAssistantButton } from "@/components/portal/AiAssistantButton";
import { DestinationCard } from "@/components/portal/DestinationCard";
import { Reveal } from "@/components/ui/Reveal";
import { resolveStorageUrl } from "@/lib/image";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import destinasiImage from "@/assets/kategori-destinasi.jpg";
import budayaImage from "@/assets/kategori-budaya.jpg";
import kulinerImage from "@/assets/kategori-kuliner.jpg";
import kerajinanImage from "@/assets/kategori-kerajinan.jpg";
import karawoImage from "@/assets/event-karawo.jpg";
import busanaAdatImg from "@/assets/busana-adat-gorontalo.jpg";
import patungPataniImg from "@/assets/patung-patani.jpg";
import motifKarawoImg from "@/assets/motif-karawo.jpg";
import menyulamKarawoImg from "@/assets/menyulam-karawo.webp";
import pantaiTaludaaImg from "@/assets/pantai-taludaa.jpg";
import bentengOtanahaImg from "@/assets/benteng-otanaha.jpg";
import pulauCintaImg from "@/assets/pulau-cinta.jpg";
import pulauDiyonumoImg from "@/assets/pulau-diyonumo.jpg";

const heroByCategory = {
    destinasi: { title: "Destinasi Wisata", desc: "Jelajahi keindahan alam Gorontalo — dari hiu paus Botubarani hingga lagun Pulo Cinta.", image: destinasiImage },
    budaya: { title: "Budaya Gorontalo", desc: "Warisan Hulondalo: Tari Saronde, Tradisi Dikili, dan adat Pohutu Limo.", image: budayaImage },
    kuliner: { title: "Kuliner Khas", desc: "Cita rasa pesisir: Milu Siram, Ilabulo, dan sambal Sagela.", image: kulinerImage },
    kerajinan: { title: "Kerajinan Daerah", desc: "Mahakarya tangan: Sulaman Karawo dan anyaman rotan.", image: kerajinanImage },
    event: { title: "Agenda Budaya", desc: "Perayaan yang akan datang — Karnaval Karawo, Tradisi Dikili, FESBUJATON.", image: karawoImage },
};

const fallbackImg = {
    destinasi: destinasiImage,
    budaya: budayaImage,
    kuliner: kulinerImage,
    kerajinan: kerajinanImage,
    event: karawoImage,
};

function IntroBudaya() {
    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-12 md:py-16">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "240px 240px" }} />
            <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[58%_42%]">
                    <Reveal y={16}>
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">Adat yang masih dipakai</span>
                        <h2 className="mt-3 font-display text-[34px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[44px]">Bukan museum.<br /><span className="font-normal italic text-ocean">Ruang tamu.</span></h2>
                        <p className="mt-4 max-w-[50ch] text-[15px] leading-relaxed text-muted-foreground">Tari Saronde bukan pertunjukan untuk turis — ia membuka pintu. Dikili bukan seremoni — ia menjaga malam tetap terjaga. Di Gorontalo, adat tidak disimpan di lemari. Dipakai, diwaris, dilanjutkan.</p>
                        <div className="mt-6 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full border border-border bg-white px-3 py-1 font-medium">Bantayo Poboide</span>
                            <span className="rounded-full border border-border bg-white px-3 py-1 font-medium">Moloopu</span>
                            <span className="rounded-full border border-border bg-white px-3 py-1 font-medium">Pohutu Limo</span>
                        </div>
                        <div className="mt-7 grid max-w-[520px] grid-cols-12 gap-3 md:gap-4">
                            <div className="col-span-7 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={busanaAdatImg} alt="Busana adat Gorontalo" className="h-[108px] w-full rounded-xl object-cover md:h-[132px]" /></div>
                            <div className="col-span-5 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={patungPataniImg} alt="Patung Patani" className="h-[108px] w-full rounded-xl object-cover md:h-[132px]" /></div>
                            <div className="col-span-4 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={motifKarawoImg} alt="Detail motif Karawo" className="h-[84px] w-full rounded-xl object-cover md:h-[96px]" /></div>
                            <div className="col-span-4 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={bentengOtanahaImg} alt="Benteng Otanaha" className="h-[84px] w-full rounded-xl object-cover md:h-[96px]" /></div>
                            <div className="col-span-4 overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={menyulamKarawoImg} alt="Menyulam Karawo" className="h-[84px] w-full rounded-xl object-cover md:h-[96px]" /></div>
                        </div>
                    </Reveal>
                    <div className="relative">
                        <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={bentengOtanahaImg} alt="Benteng Otanaha" className="aspect-[4/3] w-full rounded-xl object-cover" /></div>
                        <p className="mt-3 font-display text-sm font-bold text-foreground">Benteng di atas bukit, kota di bawahnya.</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Otanaha bukan sekadar batu — ia titik pandang. Dari sini Danau Limboto terlihat seperti cermin yang retak oleh waktu.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function IntroKuliner() {
    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-12 md:py-16">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "240px 240px" }} />
            <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[55%_45%]">
                    <div className="order-2 lg:order-1">
                        <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={kulinerImage} alt="Hidangan Gorontalo" className="aspect-[4/3] w-full rounded-xl object-cover" /></div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm"><img src={pulauCintaImg} alt="Pesisir" className="h-[72px] w-full rounded-lg object-cover" /></div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm"><img src={pantaiTaludaaImg} alt="Pantai" className="h-[72px] w-full rounded-lg object-cover" /></div>
                            <div className="overflow-hidden rounded-xl border border-border bg-white p-1 shadow-sm"><img src={pulauDiyonumoImg} alt="Pulau" className="h-[72px] w-full rounded-lg object-cover" /></div>
                        </div>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Bahan dari Teluk Tomini · Teknik dari dapur ibu</p>
                    </div>
                    <Reveal y={16} className="order-1 lg:order-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">Dapur pesisir</span>
                        <h2 className="mt-3 font-display text-[34px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[44px]">Jagung, sagu,<br /><span className="font-normal italic text-ocean">dan asap.</span></h2>
                        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground">Milu Siram bukan sup jagung — ia kuah santan yang menunggu ikan. Ilabulo bukan pepes — ia sagu yang dibungkus daun woka agar tidak lupa bentuknya. Di Gorontalo, makanan tidak dibuat cepat. Dibuat pas.</p>
                        <ul className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
                            <li className="flex gap-3"><span className="font-bold text-foreground">Milu Siram</span><span className="text-muted-foreground">— jagung manis, ikan cakalang, santan kental</span></li>
                            <li className="flex gap-3"><span className="font-bold text-foreground">Ilabulo</span><span className="text-muted-foreground">— sagu, ayam, daun woka, kukus</span></li>
                            <li className="flex gap-3"><span className="font-bold text-foreground">Sagela</span><span className="text-muted-foreground">— ikan asap, sambal, nasi hangat</span></li>
                        </ul>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

function IntroKerajinan() {
    return (
        <section className="relative overflow-hidden bg-[#FCFBFC] py-12 md:py-16">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "240px 240px" }} />
            <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[42%_58%]">
                    <Reveal y={16}>
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean">Sabar yang bisa dipakai</span>
                        <h2 className="mt-3 font-display text-[34px] font-bold leading-[0.95] tracking-tight text-foreground md:text-[44px]">Satu lubang,<br /><span className="font-normal italic text-ocean">satu benang.</span></h2>
                        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground">Karawo dibuat dengan mengiris dan mencabut benang — bukan menambah. Kekosongan itu yang diisi motif flora. Seminggu untuk satu kain, seumur hidup untuk satu tangan yang mahir.</p>
                        <div className="mt-6 rounded-xl border border-border bg-white p-4 text-sm leading-relaxed text-muted-foreground">“Karawo bukan cepat atau lambat. Ia pas.” — perajin di Kampung Karawo</div>
                    </Reveal>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-3">
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={motifKarawoImg} alt="Motif Karawo" className="aspect-square w-full rounded-xl object-cover" /></div>
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={kerajinanImage} alt="Anyaman" className="h-[110px] w-full rounded-xl object-cover" /></div>
                        </div>
                        <div className="space-y-3">
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={menyulamKarawoImg} alt="Menyulam Karawo" className="aspect-[4/3] w-full rounded-xl object-cover" /></div>
                            <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm"><img src={busanaAdatImg} alt="Karawo pada busana" className="h-[110px] w-full rounded-xl object-cover" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function CategoryIndex({ category, items, banner }) {
    const fallback = heroByCategory[category] ?? heroByCategory.destinasi;
    const hero = banner
        ? { title: banner.name ?? fallback.title, desc: banner.description ?? fallback.desc, image: banner.banner_image ?? fallback.image }
        : fallback;
    const label = hero.title;

    return (
        <>
            <Head title={`${label} — Dulohupa AI`} />
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    <div className="relative overflow-hidden bg-[#FCFBFC] pt-28 pb-14">
                        {(() => {
                            const raw = hero.image;
                            const bgSrc = typeof raw === "string" ? raw : null;
                            const src = bgSrc && (bgSrc.startsWith("/storage") || bgSrc.startsWith("/build") || bgSrc.startsWith("http") || bgSrc.startsWith("data:")) ? bgSrc : (typeof bgSrc === "string" && bgSrc.startsWith("/") ? bgSrc : null);
                            const finalSrc = src ?? (typeof hero.image === "string" ? hero.image : null);
                            return finalSrc ? <img src={finalSrc} alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full object-cover opacity-[0.28] blur-[8px] scale-105" /> : null;
                        })()}
                        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#FCFBFC]/80" />
                        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[142px] bg-gradient-to-b from-black/40 to-transparent" />
                        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23715386' stroke-width='0.6' opacity='0.4'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: "240px 240px" }} />
                        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
                            <h1 className="mt-6 max-w-2xl font-display text-[32px] font-bold leading-tight text-foreground md:text-[40px]">{label}</h1>
                            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">{hero.desc}</p>
                        </div>
                    </div>

                    {category === 'budaya' && <IntroBudaya />}
                    {category === 'kuliner' && <IntroKuliner />}
                    {category === 'kerajinan' && <IntroKerajinan />}

                    <section className="bg-[#FCFBFC] py-20 lg:py-28">
                        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
                            {(() => {
                                const data = Array.isArray(items) ? items : (items?.data ?? []);
                                const paginator = Array.isArray(items) ? null : items;
                                const hasPagination = paginator && paginator.last_page > 1;
                                if (!data.length) {
                                    return (
                                        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                                            <p className="text-sm text-muted-foreground">Belum ada objek di kategori ini — tambah via admin.</p>
                                        </div>
                                    );
                                }
                                return (
                                    <>
                                        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
                                            {data.map((it) => {
                                                const src = resolveStorageUrl(it.image);
                                                const img = src ?? fallbackImg[category] ?? destinasiImage;
                                                return (
                                                    <DestinationCard
                                                        key={it.slug}
                                                        href={`/${category}/${it.slug}`}
                                                        image={img}
                                                        title={it.name}
                                                        location={it.location ?? it.category}
                                                        category={category}
                                                        description={it.body?.slice(0, 110)}
                                                    />
                                                );
                                            })}
                                        </div>
                                        {hasPagination && (
                                            <Pagination className="mt-14">
                                                <PaginationContent>
                                                    {paginator.links?.map((link, idx) => {
                                                        const isPrev = idx === 0;
                                                        const isNext = idx === paginator.links.length - 1;
                                                        const label = link.label.replace(/&laquo;|&raquo;/g, "").trim();
                                                        const isEllipsis = label === "...";
                                                        if (isEllipsis) {
                                                            return (
                                                                <PaginationItem key={idx}>
                                                                    <PaginationEllipsis />
                                                                </PaginationItem>
                                                            );
                                                        }
                                                        if (isPrev) {
                                                            return (
                                                                <PaginationItem key={idx}>
                                                                    <PaginationPrevious href={link.url ?? "#"} className={!link.url ? "pointer-events-none opacity-50" : ""} />
                                                                </PaginationItem>
                                                            );
                                                        }
                                                        if (isNext) {
                                                            return (
                                                                <PaginationItem key={idx}>
                                                                    <PaginationNext href={link.url ?? "#"} className={!link.url ? "pointer-events-none opacity-50" : ""} />
                                                                </PaginationItem>
                                                            );
                                                        }
                                                        return (
                                                            <PaginationItem key={idx}>
                                                                <PaginationLink href={link.url ?? "#"} isActive={link.active} className={link.active ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}>
                                                                    {label}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        );
                                                    })}
                                                </PaginationContent>
                                            </Pagination>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </section>
                </main>
                <SiteFooter />
                <AiAssistantButton />
            </div>
        </>
    );
}

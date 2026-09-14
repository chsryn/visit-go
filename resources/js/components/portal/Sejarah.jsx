import { Link } from "@inertiajs/react";
import { Clock, ExternalLink } from "lucide-react";
import { karawoBorder } from "@/lib/karawo";

export function Sejarah({ items, category = "budaya" }) {
    const data = Array.isArray(items) ? items : (items?.data ?? []);

    return (
        <div className="bg-[#FEFCF8] h-auto overflow-visible">
            <div className="relative border-b-[3px] border-[#4A2C1A] bg-[#2A1E32] text-[#FEFCF8] pt-24 lg:pt-28 pb-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-start justify-between gap-6">
                    <div>
                        <p className="text-[11px] tracking-[0.22em] text-[#D4A017]">ARSIP · BANTAYO POBOIDE — HULONTALO</p>
                        <h1 className="mt-1 font-display text-[30px] font-bold leading-none tracking-[-0.02em] md:text-[40px]">Sejarah Gorontalo</h1>
                        <p className="mt-1 font-serif text-[15px] tracking-wide text-[#D4A017]/90" dir="rtl">هولونتالو — Hulontalo</p>
                        <p className="mt-1 text-xs italic text-white/60">Hulontalangi · Lembah Mulia / Daratan Tergenang — Huidu Totolu (Tiga Gunung) — Pogulatalo (Tempat Menunggu)</p>
                    </div>
                    <div className="hidden shrink-0 text-right md:block">
                        <div className="inline-flex flex-col rounded-[4px] border border-[#D4A017]/40 bg-white/[0.06] px-3 py-2">
                            <span className="text-[10px] tracking-[0.18em] text-[#D4A017]">NO. ARSIP</span>
                            <span className="font-mono text-xs text-white">UU 38 / 2000 · 5 DES 2000</span>
                            <span className="mt-1 inline-flex self-end rounded bg-[#D4A017] px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-[#2A1E32]">SAH</span>
                        </div>
                        <p className="mt-2 text-[11px] text-white/50">Sumber: Wikipedia (13 Sep 2026) · gorontaloprov.go.id</p>
                    </div>
                </div>
                <div aria-hidden className="h-[10px] w-full opacity-90 absolute inset-x-0 bottom-0 z-10" style={{ backgroundImage: karawoBorder, backgroundRepeat: "repeat-x", backgroundSize: "120px 12px" }} />
            </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-auto overflow-visible">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E0EC] py-4 text-xs">
                    <nav className="text-muted-foreground">
                        <Link href="/" className="hover:text-foreground">Beranda</Link><span className="mx-2">/</span>
                        <Link href="/budaya" className="hover:text-foreground">Budaya</Link><span className="mx-2">/</span>
                        <span className="font-semibold text-foreground">Sejarah</span>
                    </nav>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Clock className="size-3.5" /> ±8 menit · naskah arsip</span>
                </div>

                <div className="border-b border-[#E8E0EC] py-6">
                    <p className="max-w-[68ch] font-display text-[17px] leading-relaxed text-[#2A1E32] md:text-[18px]">
                        Gorontalo di <em>Semenanjung Minahasa</em> — diapit Laut Sulawesi dan Teluk Tomini — adalah persekutuan lima Pohala’a dengan demokrasi Linula. Dari Situs Oluhuta &gt;2000 tahun hingga Suwawa 700 M, dari syahbandar Teluk Tomini hingga proklamasi Nani Wartabone 23 Januari 1942.
                    </p>
                </div>

                    <div className="mt-8 grid h-auto min-h-0 gap-10 overflow-visible pb-16 lg:grid-cols-[1fr_340px]">
                    <article className="min-w-0 h-auto overflow-visible max-w-[72ch]">
                        <div className="space-y-10 text-[15px] leading-[1.8] text-[#2A1E32]/90">
                            <section id="etimologi" className="scroll-mt-32">
                                <div className="flex items-baseline gap-3 border-b border-[#E8E0EC] pb-2">
                                    <span className="font-mono text-xs tracking-widest text-[#D4A017]">01 — HIKAYAT</span>
                                    <h2 className="font-display text-xl font-bold tracking-tight text-[#2A1E32]">Asal-usul Nama</h2>
                                </div>
                                <p className="mt-4"><span className="float-left mr-2 font-display text-[44px] font-bold leading-none text-[#715386]">H</span>ikayat ketua adat: Gorontalo mula-mula pulau kecil yang surut, memunculkan tiga gunung purba — <strong>Malenggalila</strong>, <strong>Tilongkabila</strong>, dan satu tak bernama. Lembah di selatan Tilongkabila disebut <em>Hulontalangi / Hulontalo</em> — cikal bakal Kota Gorontalo. Tafsir lain: <em>Huluntu</em> (lembah) + <em>Langi</em> (mulia) = “Lembah Mulia”; <em>Huntu</em> (onggokan tanah) + <em>Langi-Langi</em> (tergenang) = “Daratan Tergenang”; <em>Huidu Totolu / Goenong Tello</em> = “Tiga Gunung”; <em>Pogulatalo → Hulatalo</em> = “Tempat Menunggu”. Nama Holontalo diserap Portugis–Belanda menjadi Gorontalo.</p>
                                <p className="mt-3 rounded border-l-[3px] border-[#D4A017] bg-[#F5F0F7] px-4 py-3 text-sm italic text-muted-foreground">Catatan: ejaan Pegon هولونتالو masih dipakai di naskah Bantayo — latin “Gorontalo” adalah adaptasi kolonial.</p>
                                <div aria-hidden className="mt-6 h-[10px] w-full opacity-60" style={{ backgroundImage: karawoBorder, backgroundRepeat: "repeat-x", backgroundSize: "120px 12px" }} />
                            </section>

                            <section id="prasejarah" className="scroll-mt-32">
                                <div className="flex items-baseline gap-3 border-b border-[#E8E0EC] pb-2">
                                    <span className="font-mono text-xs tracking-widest text-[#D4A017]">02 — ARKEOLOGI</span>
                                    <h2 className="font-display text-xl font-bold">Situs Oluhuta</h2>
                                </div>
                                <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr] items-start">
                                    <div>
                                        <p>Balai Arkeologi Manado menemukan <strong>Situs Oluhuta</strong> di Gorontalo selatan — situs prasejarah &gt;2000 tahun di endapan lembah Hulontalo. Penelitian masih berlangsung: temuan meliputi makam prasejarah, fragmen gerabah, dan artefak batu yang mengindikasikan hunian pesisir awal sebelum Kerajaan Suwawa 700 M. Lokasinya di perbukitan selatan menghadap Teluk Tomini — konteks lanskap pesisir Botutonuo di foto samping. Jejak ini menandai lapisan peradaban tertua Gorontalo sebelum konfederasi Pohala’a.</p>
                                        <ul className="mt-3 list-disc pl-5 text-sm leading-relaxed text-muted-foreground">
                                            <li><span className="font-semibold text-foreground">Penemu:</span> Balai Arkeologi Manado (Sulawesi Utara)</li>
                                            <li><span className="font-semibold text-foreground">Usia & temuan:</span> &gt;2000 tahun — beberapa makam prasejarah & artefak masih diteliti</li>
                                        </ul>
                                    </div>
                                    <figure className="overflow-hidden rounded-[4px] border border-[#E8E0EC] bg-white self-start">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Pantai_Botutonuo.jpg" alt="Pesisir Gorontalo selatan — konteks Situs Oluhuta" className="w-full h-auto aspect-video object-cover grayscale sepia-[.30] contrast-125" loading="lazy" />
                                        <figcaption className="px-3 py-2 text-[11px] leading-snug text-muted-foreground">Pesisir selatan — konteks lanskap Situs Oluhuta. Foto: Pantai Botutonuo (Wikimedia).</figcaption>
                                    </figure>
                                </div>
                            </section>

                            <section id="kerajaan" className="scroll-mt-32">
                                <div className="flex items-baseline gap-3 border-b border-[#E8E0EC] pb-2">
                                    <span className="font-mono text-xs tracking-widest text-[#D4A017]">03 — 700 M</span>
                                    <h2 className="font-display text-xl font-bold">Pohala’a & Buatula Totolu</h2>
                                </div>
                                <p className="mt-4">Jazirah terbentuk ±1300 tahun lalu. <strong>Suwawa ±700 M (abad ke-8)</strong> tertua — makam raja di hulu Bulawa, makam Moluadu di hulu Bone. Konfederasi <strong>Pohala’a lima</strong> (Haga 1931): Gorontalo, Limboto, Suwawa, Bolango→Boalemo, Atinggola.</p>
                                <div className="mt-4 overflow-hidden rounded-[6px] border border-[#4A2C1A]/15 bg-[#2A1E32] text-[#FEFCF8]">
                                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 text-sm">
                                        <div className="p-4"><p className="font-mono text-[11px] tracking-widest text-[#D4A017]">BANTAYO</p><p className="font-display font-bold">Bate</p><p className="text-white/70">Pembuat aturan & garis besar kerajaan</p></div>
                                        <div className="p-4"><p className="font-mono text-[11px] tracking-widest text-[#D4A017]">BUBATO</p><p className="font-display font-bold">Olongia</p><p className="text-white/70">Pelaksana — mensejahterakan rakyat</p></div>
                                        <div className="p-4"><p className="font-mono text-[11px] tracking-widest text-[#D4A017]">BALA</p><p className="font-display font-bold">Pulubala</p><p className="text-white/70">Pertahanan & keamanan</p></div>
                                    </div>
                                    <p className="border-t border-white/10 px-4 py-3 text-xs italic text-white/60">Raja dipilih & diberhentikan Bantayo Poboide — musyawarah mufakat Linula. Tertulis di lontar adat, bukan piagam cetak.</p>
                                </div>
                                <figure className="mt-4 overflow-hidden rounded-[4px] border border-[#E8E0EC] bg-white">
                                    <img src="https://upload.wikimedia.org/wikipedia/id/3/3f/Jogugu_Gorontalo_1870.jpg" alt="Jogugu Gorontalo 1870 — arsip" className="w-full h-auto aspect-[4/3] object-contain bg-white/50 grayscale sepia contrast-125" loading="lazy" />
                                    <figcaption className="px-3 py-2 text-[11px] text-muted-foreground">Jogugu Gorontalo, 1870 — arsip Tropenmuseum. Struktur Bantayo beratap rumbia, tiang kayu.</figcaption>
                                </figure>
                            </section>

                            <section id="perdagangan" className="scroll-mt-32">
                                <div className="flex items-baseline gap-3 border-b border-[#E8E0EC] pb-2">
                                    <span className="font-mono text-xs tracking-widest text-[#D4A017]">04 — 1525</span>
                                    <h2 className="font-display text-xl font-bold">Teluk Tomini & Islam</h2>
                                </div>
                                <p className="mt-4">Diapit Laut Sulawesi–Teluk Tomini, jalur Ternate–Makassar. Niaga emas, budak, rotan, kopra — tertua setelah Makassar & Manado. Syahbandar tarik pajak di bawah Olongia; perdagangan bebas, bila dibatasi pedagang pindah kerajaan.</p>
                                <p>Islam abad ke-14 via <strong>Sultan Amai</strong>, pernikahan Amai–Owutango (Ogomanjolo, 1525), ulama Hadramaut–Minangkabau, menyebar ke Tomini-Bocht (Bolaang Mongondow, Buol, Luwuk, Donggala–Sultra).</p>
                                <figure className="mt-4 overflow-hidden rounded-[4px] border border-[#E8E0EC] bg-white">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/COLLECTIE_TROPENMUSEUM_Een_zeilschip_in_de_Baai_van_Gorontalo_TMnr_60000022.jpg" alt="Kapal layar di Teluk Gorontalo 1870" className="w-full h-auto aspect-video object-cover grayscale sepia-[.30] contrast-125" loading="lazy" />
                                    <figcaption className="px-3 py-2 text-[11px] text-muted-foreground">Kapal layar di Teluk Gorontalo, 1870 — albumen print Tropenmuseum. Perjanjian Bungaya 1667 & kunjungan Padtbrugge 1677 membuka sungai bagi VOC.</figcaption>
                                </figure>
                            </section>

                            <section id="kolonial" className="w-full scroll-mt-32">
                                <div className="flex items-baseline gap-3 border-b border-[#E8E0EC] pb-2">
                                    <span className="font-mono text-xs tracking-widest text-[#D4A017]">05 — 1677–1922</span>
                                    <h2 className="font-display text-xl font-bold">Masa Kolonial</h2>
                                </div>
                                <p className="mt-4 w-full text-left font-mono text-sm leading-relaxed text-muted-foreground">
                                    1824 — Limo Lo Pohalaa di bawah Asisten Residen<br />
                                    1889 — <em>Rechtstreeks Bestuur</em> (pemerintahan langsung)<br />
                                    1911 — Onder Afdeling Kwandang / Boalemo / Gorontalo<br />
                                    1920 — Distrik Kwandang, Limboto, Bone, Gorontalo, Boalemo<br />
                                    1922 — Afdeling Gorontalo, Boalemo, Buol
                                </p>
                                <p className="mt-3 w-full text-left text-xs italic text-muted-foreground">Ejaan kolonial “Goenong Tello” lebih sering di peta Belanda ketimbang “Hulontalo”.</p>
                            </section>

                            <section id="proklamasi" className="w-full scroll-mt-32 border border-[#FF0000]/15 bg-[#FF0000]/5 p-5 text-left">
                                <div className="flex items-baseline gap-3 border-b border-[#FF0000]/20 pb-2">
                                    <span className="bg-[#FF0000] px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-widest text-white">06 — 23 JAN 1942</span>
                                    <h2 className="font-display text-xl font-bold">Proklamasi Gorontalo</h2>
                                </div>
                                <p className="mt-4">Dipelopori <strong>H. Nani Wartabone</strong> — kibar Merah Putih & Indonesia Raya, 3 tahun sebelum 17 Agustus 1945. Berdaulat 1942–1944. Semboyan Permesta: <em>“Sekali ke Djogdja tetap ke Djogdja”</em> (Ayuba Wartabone).</p>
                                <figure className="mt-4 overflow-hidden rounded-[4px] border border-[#E8E0EC] bg-white">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/COLLECTIE_TROPENMUSEUM_Gouverneur-Generaal_De_Graeff_wordt_rondgereden_door_de_straten_van_Gorontalo_tijdens_een_bezoek_aan_Celebes_TMnr_60048800.jpg" alt="Gubernur Jenderal De Graeff di Gorontalo 1926 — arsip kolonial" className="w-full h-auto aspect-video object-contain bg-white/50 grayscale sepia contrast-125" loading="lazy" />
                                    <figcaption className="px-3 py-2 text-[11px] text-muted-foreground">Kontras: parade kolonial 1926 di jalan Gorontalo — 16 tahun sebelum proklamasi rakyat. Foto Tropenmuseum.</figcaption>
                                </figure>
                            </section>

                            <section id="provinsi" className="scroll-mt-32">
                                <div className="flex items-baseline gap-3 border-b border-[#E8E0EC] pb-2">
                                    <span className="font-mono text-xs tracking-widest text-[#D4A017]">07 — 2000</span>
                                    <h2 className="font-display text-xl font-bold">Pembentukan Provinsi</h2>
                                </div>
                                <p className="mt-4">23 Jan 2000 — P4GTR (Nelson Pomalingo & Natsir Mooduto) deklarasikan lepas dari Sulut (UU 10/1964). DPR sahkan 5 Des 2000, resmi 22 Des 2000. Penjabat Tursandi Alwi 16 Feb 2001. Hari jadi 16 Feb direvisi ke <strong>5 Desember</strong> (Perda DPRD 19 Agu 2015).</p>
                            </section>

                            <section id="falsafah" className="scroll-mt-32 border-t-[3px] border-[#4A2C1A] bg-[#F5F0F7] p-5">
                                <h2 className="font-display text-xl font-bold">Falsafah Hulontalo</h2>
                                <ul className="mt-3 list-none space-y-2 text-sm">
                                    <li className="border-l-2 border-[#715386] pl-3"><em>Aadati hula-hula to Sara’a, Sara’a hula-hula to Kuru’ani</em><br /><span className="text-xs text-muted-foreground">Adat bersendikan Syara’, Syara’ bersendikan Al-Quran</span></li>
                                    <li className="border-l-2 border-[#715386] pl-3"><em>Mohuyula</em> — bahu membahu</li>
                                    <li className="border-l-2 border-[#715386] pl-3"><em>Batanga Pomaya, Nyawa Podungalo, Harata Potombulu</em> — jasad bela tanah air</li>
                                </ul>
                                <p className="mt-4 text-center font-display italic text-[#715386]">“Adat tidak disimpan di lemari. Dipakai, diwaris, dilanjutkan.”</p>
                            </section>

                            <p className="border-t border-[#E8E0EC] pt-4 pb-12 mb-8 text-xs text-muted-foreground">
                                Ringkasan arsip: <a href="https://id.wikipedia.org/wiki/Gorontalo" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#715386] hover:underline">Wikipedia Gorontalo <ExternalLink className="size-3" /></a> · <a href="https://gorontaloprov.go.id/artikel/tentang-gorontalo" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#715386] hover:underline">gorontaloprov.go.id <ExternalLink className="size-3" /></a> · Hikayat Bantayo.
                            </p>
                        </div>
                    </article>

                    <aside className="h-auto self-start overflow-visible lg:sticky lg:top-28">
                        <div className="overflow-hidden rounded-[6px] border border-[#4A2C1A]/20 bg-white">
                            <div className="bg-[#4A2C1A] px-3 py-2 text-center">
                                <p className="font-mono text-[10px] tracking-[0.2em] text-[#D4A017]">CAP DAERAH</p>
                                <p className="font-display font-bold text-white">Hulontalo</p>
                            </div>
                            <div className="p-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Flag_of_Gorontalo.svg" alt="Bendera Gorontalo" className="h-20 w-full border border-[#E8E0EC] object-contain p-1" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/01/Coat_of_arms_of_Gorontalo.svg" alt="Lambang Gorontalo" className="h-20 w-full border border-[#E8E0EC] object-contain p-1" />
                                </div>
                                <p className="mt-2 text-center text-[10px] text-muted-foreground">Bendera & Lambang — jantung kesetiaan</p>
                                <table className="mt-3 w-full text-xs">
                                    <tbody className="[&>tr]:border-b [&>tr]:border-[#E8E0EC]/70 [&>tr>th]:py-1.5 [&>tr>th]:text-left [&>tr>th]:font-mono [&>tr>th]:text-[11px] [&>tr>th]:text-muted-foreground [&>tr>td]:py-1.5 [&>tr>td]:text-xs [&>tr>td]:font-medium">
                                        <tr><th>UU</th><td>38/2000</td></tr>
                                        <tr><th>Hari jadi</th><td>5 Des 2000</td></tr>
                                        <tr><th>Ibu kota</th><td>Kota Gorontalo</td></tr>
                                        <tr><th>Luas</th><td>12.025 km²</td></tr>
                                        <tr><th>Populasi</th><td>1,22 jt (2024)</td></tr>
                                        <tr><th>Koordinat</th><td>0°40′N 123°E</td></tr>
                                        <tr><th>Rumah adat</th><td>Dulohupa, Bantayo</td></tr>
                                        <tr><th>Lagu</th><td>Hulontalo Lipu’u</td></tr>
                                    </tbody>
                                </table>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Prov._Gorontalo.jpg" alt="Peta administrasi Gorontalo" className="mt-3 w-full aspect-square object-cover rounded border border-[#E8E0EC]" />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

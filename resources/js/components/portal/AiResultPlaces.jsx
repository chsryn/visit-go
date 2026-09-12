import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import fallbackImage from "@/assets/kategori-destinasi.jpg";

function dayRangeLabel(schedule) {
    const days = [...new Set((schedule ?? []).map((s) => s.day_number).filter(Number.isFinite))].sort((a, b) => a - b);
    if (days.length === 0) return null;
    if (days.length === 1) return `Hari ${days[0]}`;
    return `Hari ${days[0]}–${days[days.length - 1]}`;
}

function placeImage(p) {
    const raw = p?.image;
    if (typeof raw !== "string" || raw.trim() === "") return fallbackImage;
    if (raw.startsWith("http") || raw.startsWith("/storage") || raw.includes("/build/")) return raw;
    if (raw.startsWith("uploads/")) return `/storage/${raw}`;
    return raw.startsWith("/") ? raw : `/${raw}`;
}

function numberIcon(n, active) {
    return L.divIcon({
        className: "ai-result-pin",
        html: `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:${active ? "#D4A017" : "#715386"};color:#fff;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);font-size:12px;font-weight:700">${n}</span>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -13],
    });
}

/**
 * Hasil AI: daftar destinasi (70%) + peta interaktif (30%), dua arah.
 * - Klik kartu → peta terbang ke lokasi + popup terbuka + deskripsi tampil.
 * - Klik marker → kartu ter-highlight + ter-scroll ke tampilan.
 */
export default function AiResultPlaces({ places }) {
    const mapEl = useRef(null);
    const mapObj = useRef(null);
    const markers = useRef({});
    const cardRefs = useRef({});
    const [selected, setSelected] = useState(null);

    const withCoords = (places ?? []).filter(
        (p) => Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude))
    );

    // Init map once
    useEffect(() => {
        if (!mapEl.current || mapObj.current) return;
        const map = L.map(mapEl.current).setView([0.55, 123.06], 9);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);
        mapObj.current = map;
        const t = setTimeout(() => map.invalidateSize(), 200);
        return () => {
            clearTimeout(t);
            map.remove();
            mapObj.current = null;
            markers.current = {};
        };
    }, []);

    // Rebuild markers when places change
    useEffect(() => {
        const map = mapObj.current;
        if (!map) return;
        Object.values(markers.current).forEach((m) => m.remove());
        markers.current = {};
        const bounds = L.latLngBounds();
        withCoords.forEach((p, i) => {
            const m = L.marker([Number(p.latitude), Number(p.longitude)], {
                icon: numberIcon(i + 1, p.key === selected),
            }).addTo(map);
            m.bindPopup(`<strong>${p.name}</strong><br/><span style="color:#6B5A7A">${p.location ?? ""}</span>`);
            m.on("click", () => selectPlace(p.key, true));
            markers.current[p.key] = m;
            bounds.extend([Number(p.latitude), Number(p.longitude)]);
        });
        if (bounds.isValid()) map.fitBounds(bounds.pad(0.25));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [places]);

    // Refresh icon highlight on selection change
    useEffect(() => {
        withCoords.forEach((p, i) => {
            markers.current[p.key]?.setIcon(numberIcon(i + 1, p.key === selected));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    const selectPlace = (key, fromMap = false) => {
        const p = (places ?? []).find((x) => x.key === key);
        if (!p) return;
        setSelected(key);
        const cLat = Number(p.latitude);
        const cLng = Number(p.longitude);
        if (Number.isFinite(cLat) && Number.isFinite(cLng) && mapObj.current) {
            mapObj.current.flyTo([cLat, cLng], 14, { duration: 1 });
            const m = markers.current[key];
            if (m) setTimeout(() => m.openPopup(), 1050);
        }
        if (fromMap) {
            cardRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };

    if (!places || places.length === 0) {
        return (
            <div className="rounded-[15px] border border-dashed border-[#715386]/20 bg-white/60 p-10 text-center">
                <p className="font-display text-lg font-bold">Belum ada destinasi yang dikenali</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    AI tidak mengembalikan destinasi yang cocok dengan database. Coba ubah minat atau lokasi, lalu rancang ulang.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h4 className="font-display text-xl font-bold">📍 Destinasi Rekomendasi</h4>
            <p className="mt-1 text-xs text-muted-foreground">Klik kartu untuk melihat deskripsi &amp; fokus peta.</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-10">
                {/* Kiri 70% — daftar kartu */}
                <div className="space-y-4 lg:col-span-7">
                    {places.map((p, i) => {
                        const hasCoords =
                            Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude));
                        const isSel = selected === p.key;
                        const detail = p.body ?? "";
                        return (
                            <div
                                key={p.key}
                                ref={(el) => (cardRefs.current[p.key] = el)}
                                onClick={() => selectPlace(p.key)}
                                className={cn(
                                    "cursor-pointer overflow-hidden rounded-[15px] border bg-white/80 p-[10px] shadow-soft backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-card"
                                    // , isSel ? "border-[#D4A017] ring-2 ring-[#D4A017]/40" : "border-white/30"
                                )}
                            >
                                <div className="flex gap-4">
                                    <img
                                        src={placeImage(p)}
                                        alt={p.name}
                                        style={{ width: 133.77, height: 133.77 }}
                                        className="shrink-0 rounded-xl object-cover"
                                        loading="lazy"
                                    />
                                    <div className="min-w-0 flex-1 py-1">
                                        <div className="flex items-center gap-2">
                                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                                                {i + 1}
                                            </span>
                                            <h5 className="truncate font-display text-base font-bold leading-tight">
                                                {p.name}
                                            </h5>
                                        </div>
                                        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <MapPin className="size-3.5 shrink-0 text-accent" />
                                            <span className="truncate">
                                                {p.location ?? p.category}
                                                {hasCoords
                                                    ? ` · ${Number(p.latitude).toFixed(4)}, ${Number(p.longitude).toFixed(4)}`
                                                    : ""}
                                            </span>
                                        </p>
                                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                            {dayRangeLabel(p.schedule) && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                                    <CalendarDays className="size-3" />
                                                    {dayRangeLabel(p.schedule)}
                                                </span>
                                            )}
                                            {!hasCoords && (
                                                <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                                    Koordinat belum tersedia
                                                </span>
                                            )}
                                        </div>
                                        {(p.schedule ?? []).length > 0 && (
                                            <ul className="mt-1.5 space-y-1">
                                                {p.schedule.map((s, si) => (
                                                    <li key={si} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                                                        <span className="font-semibold text-foreground">H{s.day_number}</span>
                                                        {s.time && (
                                                            <span className="inline-flex items-center gap-1 font-mono">
                                                                <Clock className="size-3" />{s.time}
                                                            </span>
                                                        )}
                                                        {s.food && <span>· 🍽 {s.food}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                            {detail.slice(0, 110)}
                                        </p>
                                    </div>
                                </div>
                                {isSel && detail && (
                                    <div className="mt-3 rounded-xl bg-[#715386]/[0.05] p-4">
                                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                                            Deskripsi
                                        </p>
                                        <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                                            {detail}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Kanan 30% — peta sticky */}
                <div className="lg:col-span-3">
                    <div className="lg:sticky lg:top-24">
                        <div
                            ref={mapEl}
                            className="z-0 h-[320px] w-full overflow-hidden rounded-[15px] border border-white/30 shadow-soft lg:h-[520px]"
                        />
                        <p className="mt-2 text-center text-[11px] text-muted-foreground">
                            {withCoords.length} dari {places.length} destinasi tertanda di peta
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

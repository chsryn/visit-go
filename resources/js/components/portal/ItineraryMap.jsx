import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GORONTALO_CENTER = [0.55, 123.06];
const DAY_COLORS = ["#715386", "#D4A017", "#00923F", "#B45309", "#E11D48", "#2563EB", "#0891B2", "#7C3AED"];

function dayIcon(dayNum, color) {
    return L.divIcon({
        className: "itinerary-day-pin",
        html: `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${color};color:#fff;font-size:12px;font-weight:800;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)">${dayNum}</span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
    });
}

function isValidCoord(lat, lng) {
    const la = parseFloat(lat);
    const ln = parseFloat(lng);
    return Number.isFinite(la) && Number.isFinite(ln) && Math.abs(la) <= 90 && Math.abs(ln) <= 180;
}

export default function ItineraryMap({ days, className = "h-[420px]" }) {
    const ref = useRef(null);
    const mapRef = useRef(null);

    const points = [];
    (days || []).forEach((day) => {
        (day.activities || []).forEach((act, idx) => {
            if (isValidCoord(act.latitude, act.longitude)) {
                points.push({
                    lat: parseFloat(act.latitude),
                    lng: parseFloat(act.longitude),
                    day: day.day_number,
                    title: act.activity,
                    location: act.location,
                    time: act.time,
                    idx,
                });
            }
        });
    });

    useEffect(() => {
        if (!ref.current || points.length === 0) return;

        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        const map = L.map(ref.current).setView(GORONTALO_CENTER, 9);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map);

        const bounds = L.latLngBounds();
        const latlngs = [];

        points.forEach((p) => {
            const color = DAY_COLORS[(p.day - 1) % DAY_COLORS.length];
            const m = L.marker([p.lat, p.lng], { icon: dayIcon(p.day, color) }).addTo(map);
            m.bindPopup(
                `<div style="min-width:180px"><strong style="color:${color}">Hari ${p.day} • ${p.time ?? ""}</strong><br/><span style="font-weight:600">${p.title}</span><br/><span style="color:#6B7280;font-size:12px">${p.location ?? ""}</span><br/><span style="font-family:monospace;font-size:11px;color:#888">${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}</span></div>`
            );
            // tooltip on hover
            m.bindTooltip(`H${p.day}: ${p.location ?? p.title}`, { direction: "top", offset: [0, -14] });
            bounds.extend([p.lat, p.lng]);
            latlngs.push([p.lat, p.lng]);
        });

        if (latlngs.length > 1) {
            L.polyline(latlngs, { color: "#715386", weight: 3, opacity: 0.7, dashArray: "6 8", lineJoin: "round" }).addTo(map);
        }

        if (bounds.isValid()) {
            map.fitBounds(bounds.pad(points.length === 1 ? 0.5 : 0.15), { maxZoom: points.length === 1 ? 14 : 13 });
        }

        // fix size when container animates in
        setTimeout(() => map.invalidateSize(), 200);
        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(points.map((p) => `${p.lat},${p.lng},${p.day}`))]);

    if (points.length === 0) {
        return (
            <div className={`flex items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground ${className}`}>
                Belum ada koordinat untuk itinerary ini — lengkapi latitude/longitude destinasi di admin agar peta Leaflet tampil.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div ref={ref} className={`w-full ${className}`} />
            <div className="flex flex-wrap gap-2 border-t border-border bg-card px-4 py-2.5">
                {Array.from(new Set(points.map((p) => p.day))).map((d) => (
                    <span key={d} className="inline-flex items-center gap-1.5 text-xs font-medium">
                        <span className="inline-block size-3 rounded-full border border-white shadow-sm" style={{ background: DAY_COLORS[(d - 1) % DAY_COLORS.length] }} />
                        Hari {d}
                    </span>
                ))}
                <span className="ml-auto text-[11px] text-muted-foreground">{points.length} titik • garis putus = urutan perjalanan • data OSM/Leaflet</span>
            </div>
        </div>
    );
}

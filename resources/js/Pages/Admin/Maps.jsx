import { Head } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AdminLayout from "@/Layouts/AdminLayout";

// Fix default marker icons when bundled with Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const TYPE_COLORS = {
    destinasi: "#715386",
    budaya: "#D4A017",
    kuliner: "#00923F",
    kerajinan: "#B45309",
    event: "#FF0000",
};

const TYPE_LABELS = {
    destinasi: "Destinasi",
    budaya: "Budaya",
    kuliner: "Kuliner",
    kerajinan: "Kerajinan",
    event: "Event",
};

function dotIcon(color) {
    return L.divIcon({
        className: "admin-map-dot",
        html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10],
    });
}

export default function Maps() {
    const mapRef = useRef(null);
    const [points, setPoints] = useState([]);
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetch("/admin/api/map-points", { headers: { Accept: "application/json" } })
            .then((r) => r.json())
            .then((json) => {
                if (cancelled) return;
                const pts = json.points ?? [];
                setPoints(pts);
                const c = {};
                for (const p of pts) c[p.type] = (c[p.type] ?? 0) + 1;
                setCounts(c);
                setLoading(false);
            })
            .catch(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || points.length === 0) return;

        const map = L.map(mapRef.current).setView([0.55, 123.06], 9);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
        }).addTo(map);

        const bounds = L.latLngBounds();
        for (const p of points) {
            const marker = L.marker([p.latitude, p.longitude], {
                icon: dotIcon(TYPE_COLORS[p.type] ?? "#715386"),
            }).addTo(map);
            marker.bindPopup(
                `<strong>${p.name}</strong><br/><span style="color:#6B5A7A">${TYPE_LABELS[p.type] ?? p.type}</span>`
            );
            bounds.extend([p.latitude, p.longitude]);
        }
        if (bounds.isValid()) map.fitBounds(bounds.pad(0.2));

        return () => {
            map.remove();
        };
    }, [points]);

    return (
        <>
            <Head title="Maps — Admin" />
            <AdminLayout title="Maps" subtitle="Overview semua lokasi — destinasi, budaya, kuliner, kerajinan, event.">
                <div className="mb-4 flex flex-wrap gap-2">
                    {Object.entries(TYPE_LABELS).map(([type, label]) => (
                        <span
                            key={type}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium"
                        >
                            <span
                                className="inline-block size-3 rounded-full"
                                style={{ background: TYPE_COLORS[type] }}
                            />
                            {label}: {counts[type] ?? 0}
                        </span>
                    ))}
                </div>
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div ref={mapRef} className="h-[540px] w-full" />
                </div>
                {loading && <p className="mt-3 text-sm text-muted-foreground">Memuat titik peta…</p>}
                {!loading && points.length === 0 && (
                    <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                        Belum ada titik dengan koordinat — isi latitude/longitude pada modul masing-masing agar muncul di peta.
                    </div>
                )}
            </AdminLayout>
        </>
    );
}

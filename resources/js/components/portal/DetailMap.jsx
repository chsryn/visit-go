import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function DetailMap({ latitude, longitude, name, location }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const lat = Number(latitude);
        const lng = Number(longitude);
        const baseMaps = {
            Satelit: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19 }),
            Street: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }),
            Terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", { maxZoom: 17 }),
        };
        const map = L.map(el, { attributionControl: false }).setView([lat, lng], 14);
        baseMaps.Satelit.addTo(map);
        L.control.layers(baseMaps, null, { position: "topright" }).addTo(map);
        map.on("baselayerchange", (e) => {
            const max = e.layer?.options?.maxZoom;
            if (max && map.getZoom() > max) map.setZoom(max);
        });

        const m = L.marker([lat, lng]).addTo(map);
        m.bindPopup(
            `<strong>${name}</strong><br/><span style="color:#6B7280;font-size:12px">${location ?? ""}</span><br/><a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:6px;color:#715386;font-weight:700;text-decoration:none">Buka di Google Maps ↗</a>`
        ).openPopup();

        return () => {
            map.remove();
        };
    }, [latitude, longitude, name, location]);

    return <div ref={ref} className="h-[220px] w-full" />;
}
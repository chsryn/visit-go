import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin, Search, X } from "lucide-react";

const GORONTALO_CENTER = [0.55, 123.06];
const GORONTALO_ZOOM = 9;
const DETAIL_ZOOM = 13;
const SEARCH_ZOOM = 15;
const MIN_POI_ZOOM = 13;
const MAX_POI = 80;

const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
];

/* ---------- base maps (Leaflet-compatible, no API key) ---------- */
function baseLayers() {
    return {
        Street: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }),
        Satellite: L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                attribution: "Imagery &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
                maxZoom: 19,
            }
        ),
        Terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Style: <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
            maxZoom: 17,
        }),
        Terang: L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 20,
        }),
    };
}

/* ---------- POI categories ---------- */
const POI_CATS = {
    kesehatan: { icon: "🏥", label: "Kesehatan" },
    kuliner: { icon: "🍽️", label: "Kuliner" },
    menginap: { icon: "🏨", label: "Hotel" },
    ibadah: { icon: "🕌", label: "Ibadah" },
    spbu: { icon: "⛽", label: "SPBU" },
    wisata: { icon: "📷", label: "Wisata" },
    taman: { icon: "🌳", label: "Taman" },
    belanja: { icon: "🛍️", label: "Belanja" },
    pendidikan: { icon: "🎓", label: "Pendidikan" },
    bank: { icon: "🏧", label: "Bank/ATM" },
    umum: { icon: "📍", label: "Umum" },
};

function resolvePoi(tags) {
    const t = tags.tourism;
    if (t) {
        if (["hotel", "guest_house", "hostel", "motel", "apartment"].includes(t)) {
            return { ...POI_CATS.menginap, key: "menginap" };
        }
        return { ...POI_CATS.wisata, key: "wisata" };
    }
    const a = tags.amenity;
    if (a) {
        if (["restaurant", "cafe", "fast_food", "food_court", "ice_cream", "bar", "pub"].includes(a)) {
            return { ...POI_CATS.kuliner, key: "kuliner" };
        }
        if (["hospital", "clinic", "doctors", "dentist", "pharmacy"].includes(a)) {
            return { ...POI_CATS.kesehatan, key: "kesehatan" };
        }
        if (a === "hotel") return { ...POI_CATS.menginap, key: "menginap" };
        if (a === "fuel" || a === "charging") return { ...POI_CATS.spbu, key: "spbu" };
        if (a === "place_of_worship") {
            const r = (tags.religion || "").toLowerCase();
            if (r === "muslim" || r === "islam") return { icon: "🕌", label: "Masjid", key: "ibadah" };
            if (r === "christian") return { icon: "⛪", label: "Gereja", key: "ibadah" };
            if (r === "hindu") return { icon: "🛕", label: "Pura", key: "ibadah" };
            if (r === "buddhist") return { icon: "☸️", label: "Vihara", key: "ibadah" };
            return { ...POI_CATS.ibadah, key: "ibadah" };
        }
        if (["school", "university", "college", "kindergarten", "library"].includes(a)) {
            return { ...POI_CATS.pendidikan, key: "pendidikan" };
        }
        if (["bank", "atm"].includes(a)) return { ...POI_CATS.bank, key: "bank" };
    }
    const l = tags.leisure;
    if (l) {
        if (["park", "garden", "playground", "nature_reserve"].includes(l)) {
            return { ...POI_CATS.taman, key: "taman" };
        }
        return { ...POI_CATS.wisata, key: "wisata" };
    }
    const s = tags.shop;
    if (s) return { ...POI_CATS.belanja, key: "belanja" };
    return { ...POI_CATS.umum, key: "umum" };
}

function buildAddress(tags) {
    const parts = [
        [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" "),
        tags["addr:suburb"] || tags["addr:village"] || tags["addr:hamlet"],
        tags["addr:city"] || tags["addr:town"] || tags["addr:regency"],
    ].filter((p) => p && p.trim() !== "");
    return parts.join(", ");
}

function poiIcon(cat) {
    return L.divIcon({
        className: "location-picker-poi",
        html: `<span style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:9999px;background:#fff;border:1.5px solid #715386;box-shadow:0 1px 6px rgba(0,0,0,.35);font-size:13px;line-height:1">${cat.icon}</span>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
    });
}

function pinIcon() {
    return L.divIcon({
        className: "location-picker-pin",
        html: `<span style="display:block;width:22px;height:22px;border-radius:9999px 9999px 9999px 0;background:#715386;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);transform:rotate(-45deg)"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 21],
    });
}

function parseCoord(v) {
    const n = typeof v === "number" ? v : parseFloat(v);
    return Number.isFinite(n) ? n : null;
}

/* ---------- Overpass POI query (bbox: south,west,north,east) ---------- */
function overpassQuery(bbox) {
    const sel = (kv) => `${kv}(${bbox})`;
    const amenity =
        "hospital|clinic|doctors|dentist|pharmacy|restaurant|cafe|fast_food|food_court|ice_cream|hotel|fuel|place_of_worship|school|university|college|library|bank|atm|marketplace|theatre|cinema|police|fire_station|post_office|townhall|community_centre";
    const tourism = "hotel|guest_house|hostel|attraction|museum|gallery|artwork|viewpoint|theme_park|zoo|beach_resort";
    const leisure = "park|garden|stadium|swimming_pool|sports_centre|playground|marina|nature_reserve";
    const shop = "mall|supermarket|convenience|department_store|gift|souvenir";
    return `[out:json][timeout:20];(${[
        `node["amenity"~"^(${amenity})$"]`,
        `node["tourism"~"^(${tourism})$"]`,
        `node["leisure"~"^(${leisure})$"]`,
        `node["shop"~"^(${shop})$"]`,
        `way["amenity"~"^(hospital|restaurant|cafe|hotel|fuel|place_of_worship|school|mall|marketplace)$"]`,
        `way["tourism"~"^(hotel|attraction|museum|theme_park|zoo)$"]`,
        `way["leisure"~"^(park|stadium|swimming_pool)$"]`,
    ]
        .map(sel)
        .join(";")};);out center ${MAX_POI};`;
}

async function fetchPois(query) {
    let lastError = null;
    for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 25000);
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                body: `data=${encodeURIComponent(query)}`,
                signal: ctrl.signal,
            });
            clearTimeout(timer);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return Array.isArray(data?.elements) ? data.elements : [];
        } catch (e) {
            lastError = e;
        }
    }
    throw lastError ?? new Error("Overpass unreachable");
}

/**
 * Reusable map picker for admin forms.
 * - Search by place name/address (Nominatim, ID-biased) → fly to result + marker.
 * - Dynamic POIs from OpenStreetMap (Overpass): render per area+zoom, click for
 *   popup with "Pilih Lokasi Ini" button.
 * - Click map → place/move marker. Marker is draggable for fine-tuning.
 * - Existing coords → initial marker + centered view (edit mode).
 * - Base layer switcher: Street / Satellite / Terrain / Terang (no reload).
 */
export default function LocationPicker({ latitude, longitude, onChange }) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const poiLayerRef = useRef(null);
    const poiSeqRef = useRef(0);
    const poiTimerRef = useRef(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searchFailed, setSearchFailed] = useState(false);
    const [open, setOpen] = useState(false);
    const [poiStatus, setPoiStatus] = useState("idle");
    const [poiCount, setPoiCount] = useState(0);
    const debounceRef = useRef(null);

    const lat = parseCoord(latitude);
    const lng = parseCoord(longitude);
    const hasCoords = lat !== null && lng !== null;

    const emit = (cLat, cLng) => {
        onChangeRef.current?.(cLat.toFixed(7), cLng.toFixed(7));
    };

    const placeMarker = (map, cLat, cLng) => {
        if (markerRef.current) {
            markerRef.current.setLatLng([cLat, cLng]);
        } else {
            markerRef.current = L.marker([cLat, cLng], { icon: pinIcon(), draggable: true }).addTo(map);
            markerRef.current.on("dragend", () => {
                const p = markerRef.current.getLatLng();
                emit(p.lat, p.lng);
            });
        }
    };

    const selectPoi = (map, cLat, cLng) => {
        placeMarker(map, cLat, cLng);
        emit(cLat, cLng);
        map.closePopup();
    };

    const refreshPois = async (map, seq) => {
        const zoom = map.getZoom();
        const layer = poiLayerRef.current;
        if (!layer) return;
        if (zoom < MIN_POI_ZOOM) {
            layer.clearLayers();
            setPoiCount(0);
            setPoiStatus("zoom");
            return;
        }
        const b = map.getBounds();
        if (b.getEast() - b.getWest() > 0.8 || b.getNorth() - b.getSouth() > 0.6) {
            layer.clearLayers();
            setPoiCount(0);
            setPoiStatus("zoom");
            return;
        }
        setPoiStatus("loading");
        const bbox = `${b.getSouth().toFixed(5)},${b.getWest().toFixed(5)},${b.getNorth().toFixed(5)},${b.getEast().toFixed(5)}`;
        try {
            const elements = await fetchPois(overpassQuery(bbox));
            if (seq !== poiSeqRef.current) return; // stale response
            layer.clearLayers();
            let n = 0;
            for (const el of elements) {
                const tags = el.tags ?? {};
                if (!tags.name) continue; // skip unnamed clutter
                const c = el.type === "node" ? { lat: el.lat, lon: el.lon } : el.center;
                if (!c || !Number.isFinite(c.lat) || !Number.isFinite(c.lon)) continue;
                const cat = resolvePoi(tags);
                const m = L.marker([c.lat, c.lon], { icon: poiIcon(cat) });
                m.on("click", (e) => L.DomEvent.stopPropagation(e)); // don't drop manual marker
                m.bindPopup(() => poiPopup(tags, cat, c.lat, c.lon, (pLat, pLng) => selectPoi(map, pLat, pLng)), {
                    maxWidth: 260,
                });
                m.bindTooltip(tags.name, { direction: "top", offset: [0, -12] });
                m.addTo(layer);
                n += 1;
            }
            setPoiCount(n);
            setPoiStatus(n > 0 ? "ok" : "empty");
        } catch {
            if (seq !== poiSeqRef.current) return;
            setPoiStatus("error");
        }
    };

    const schedulePoiRefresh = (map) => {
        if (poiTimerRef.current) clearTimeout(poiTimerRef.current);
        poiTimerRef.current = setTimeout(() => {
            poiSeqRef.current += 1;
            refreshPois(map, poiSeqRef.current);
        }, 700);
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el || mapRef.current) return;

        const initLat = parseCoord(latitude);
        const initLng = parseCoord(longitude);
        const valid = initLat !== null && initLng !== null;

        const bases = baseLayers();
        const map = L.map(el).setView(
            valid ? [initLat, initLng] : GORONTALO_CENTER,
            valid ? DETAIL_ZOOM : GORONTALO_ZOOM
        );
        bases.Street.addTo(map);
        L.control.layers(bases, null, { position: "topright" }).addTo(map);
        L.control.scale({ imperial: false }).addTo(map);
        map.attributionControl.addAttribution(
            'Data POI &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        );
        map.on("baselayerchange", (e) => {
            const max = e.layer?.options?.maxZoom;
            if (max && map.getZoom() > max) map.setZoom(max);
        });

        poiLayerRef.current = L.layerGroup().addTo(map);

        if (valid) {
            placeMarker(map, initLat, initLng);
        }

        map.on("click", (e) => {
            const { lat: cLat, lng: cLng } = e.latlng;
            placeMarker(map, cLat, cLng);
            emit(cLat, cLng);
            setOpen(false);
        });
        map.on("moveend", () => schedulePoiRefresh(map));
        schedulePoiRefresh(map);

        // Form mounts conditionally — refresh size once layout settles.
        const t = setTimeout(() => map.invalidateSize(), 150);
        mapRef.current = map;

        return () => {
            clearTimeout(t);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            if (poiTimerRef.current) clearTimeout(poiTimerRef.current);
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
            poiLayerRef.current = null;
        };
        // Intentionally mount-once: parent remounts the form per open.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const runSearch = async (text) => {
        const q = text.trim();
        if (q.length < 3) {
            setResults([]);
            setOpen(false);
            return;
        }
        setSearching(true);
        setSearchFailed(false);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&countrycodes=id&accept-language=id&q=${encodeURIComponent(q)}`,
                { headers: { Accept: "application/json" } }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
            setOpen(true);
        } catch {
            setResults([]);
            setSearchFailed(true);
            setOpen(true);
        } finally {
            setSearching(false);
        }
    };

    const handleQuery = (v) => {
        setQuery(v);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runSearch(v), 500);
    };

    const chooseResult = (r) => {
        const cLat = parseFloat(r.lat);
        const cLng = parseFloat(r.lon);
        if (!Number.isFinite(cLat) || !Number.isFinite(cLng)) return;
        const map = mapRef.current;
        if (map) {
            map.flyTo([cLat, cLng], SEARCH_ZOOM, { duration: 1 });
            placeMarker(map, cLat, cLng);
        }
        emit(cLat, cLng);
        setQuery(r.display_name.split(",").slice(0, 2).join(","));
        setOpen(false);
    };

    return (
        <div className="space-y-2">
            {/* Search */}
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setOpen(true)}
                    onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                    placeholder="Cari rumah sakit, warung makan, hotel, kantor…"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-9 py-1 text-sm shadow-xs outline-none focus-visible:border-ring"
                />
                {searching ? (
                    <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                ) : query ? (
                    <button
                        type="button"
                        aria-label="Bersihkan pencarian"
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                            setOpen(false);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-4" />
                    </button>
                ) : null}
                {open && (
                    <div className="absolute inset-x-0 top-full z-[500] mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-card">
                        {searchFailed ? (
                            <p className="px-4 py-3 text-xs text-muted-foreground">
                                Pencarian gagal — periksa koneksi lalu coba lagi.
                            </p>
                        ) : results.length > 0 ? (
                            <ul className="max-h-56 overflow-y-auto py-1">
                                {results.map((r) => (
                                    <li key={r.place_id}>
                                        <button
                                            type="button"
                                            onClick={() => chooseResult(r)}
                                            className="flex w-full items-start gap-2 px-4 py-2.5 text-left hover:bg-muted"
                                        >
                                            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                                            <span>
                                                <span className="block text-sm font-medium leading-tight">
                                                    {r.display_name.split(",").slice(0, 2).join(",")}
                                                </span>
                                                <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                                                    {r.display_name}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="px-4 py-3 text-xs text-muted-foreground">
                                Tidak ditemukan — coba kata kunci lain.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Map */}
            <div
                ref={containerRef}
                className="z-0 h-72 w-full cursor-crosshair overflow-hidden rounded-xl border border-input"
            />

            {/* POI status + legend */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xs text-muted-foreground">
                    {poiStatus === "loading" && "Memuat tempat sekitar…"}
                    {poiStatus === "zoom" && "Perbesar peta untuk melihat tempat sekitar."}
                    {poiStatus === "error" && "Gagal memuat POI — geser/zoom peta untuk mencoba lagi."}
                    {poiStatus === "empty" && "Tidak ada tempat terdaftar di area ini."}
                    {poiStatus === "ok" && `${poiCount} tempat di area ini — klik ikon untuk detail.`}
                    {poiStatus === "idle" && "Geser atau perbesar peta untuk memuat tempat sekitar."}
                </span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
                {Object.values(POI_CATS)
                    .filter((c, i, arr) => arr.findIndex((x) => x.label === c.label) === i)
                    .map((c) => (
                        <span key={c.label} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <span>{c.icon}</span> {c.label}
                        </span>
                    ))}
            </div>

            <p className="font-mono text-xs text-muted-foreground">
                {hasCoords ? (
                    <>
                        {lat.toFixed(7)}, {lng.toFixed(7)}
                        <span className="font-sans"> — seret marker, pilih POI, atau klik peta untuk menyesuaikan.</span>
                    </>
                ) : (
                    "Belum ada titik — cari lokasi, pilih POI, atau klik peta untuk menandai."
                )}
            </p>
        </div>
    );
}

/* ---------- POI popup (plain DOM: Leaflet-safe, no React portal needed) ---------- */
function poiPopup(tags, cat, cLat, cLng, onSelect) {
    const wrap = document.createElement("div");
    wrap.style.minWidth = "200px";
    wrap.style.maxWidth = "240px";

    const addr = buildAddress(tags);
    const phone = tags.phone || tags["contact:phone"];
    const hours = tags.opening_hours;
    const site = tags.website || tags["contact:website"];

    const row = (label, value, isLink) => {
        if (!value) return "";
        const v = isLink
            ? `<a href="${value}" target="_blank" rel="noreferrer" style="color:#715386;word-break:break-all">${value}</a>`
            : value;
        return `<div style="margin-top:4px;font-size:12px;color:#555"><span style="color:#888">${label}: </span>${v}</div>`;
    };

    wrap.innerHTML =
        `<div style="font-size:14px;font-weight:700;line-height:1.3">${cat.icon} ${escapeHtml(tags.name)}</div>` +
        `<div style="margin-top:4px;font-size:11px;color:#715386;font-weight:600">${cat.label}</div>` +
        row("Alamat", escapeHtml(addr)) +
        row("Jam", escapeHtml(hours)) +
        row("Telp", escapeHtml(phone)) +
        row("Web", site, true) +
        `<div style="margin-top:6px;font-size:11px;color:#888;font-family:monospace">${cLat.toFixed(7)}, ${cLng.toFixed(7)}</div>`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Pilih Lokasi Ini";
    btn.style.cssText =
        "margin-top:8px;width:100%;padding:8px 12px;border:none;border-radius:8px;" +
        "background:#715386;color:#fff;font-size:13px;font-weight:600;cursor:pointer;";
    btn.onmouseenter = () => (btn.style.background = "#5B436C");
    btn.onmouseleave = () => (btn.style.background = "#715386");
    btn.onclick = () => onSelect(cLat, cLng);
    wrap.appendChild(btn);

    return wrap;
}

function escapeHtml(s) {
    if (s === null || s === undefined) return "";
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * Samakan format URL gambar: path upload relatif (`uploads/...`) → `/storage/...`,
 * path absolut/http/build dibiarkan. Kembalikan null bila kosong.
 */
export function resolveStorageUrl(raw) {
    if (typeof raw !== "string" || raw.trim() === "") return null;
    const p = raw.trim();
    if (p.startsWith("/storage") || p.startsWith("http") || p.includes("/build/")) return p;
    if (p.startsWith("uploads/")) return `/storage/${p}`;
    if (p.startsWith("/")) return p;
    return `/${p}`;
}

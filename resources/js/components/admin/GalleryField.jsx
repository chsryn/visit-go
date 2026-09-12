import { useRef, useState } from "react";
import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";

const THUMB = 155.55;

/**
 * Daftar foto terurut: paling kiri = sampul. Dukung tambah file,
 * hapus, dan drag untuk menyusun ulang (seret ke posisi baru).
 * Item: { kind: 'cover'|'gallery'|'new', id?, url, file? }
 */
export default function GalleryField({ value, onChange, hint }) {
    const items = value ?? [];
    const dragIdx = useRef(null);
    const [overIdx, setOverIdx] = useState(null);

    const addFiles = (fileList) => {
        const news = Array.from(fileList ?? [])
            .filter((f) => f.type.startsWith("image/"))
            .map((file) => ({ kind: "new", file, url: URL.createObjectURL(file) }));
        if (news.length > 0) onChange([...items, ...news]);
    };

    const removeAt = (idx) => {
        const target = items[idx];
        if (target?.kind === "new") URL.revokeObjectURL(target.url);
        onChange(items.filter((_, i) => i !== idx));
    };

    const move = (from, to) => {
        if (from == null || from === to) return;
        const next = [...items];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(next);
    };

    return (
        <div className="space-y-3">
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                }}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
            />
            {items.length === 0 ? (
                <p className="text-xs text-muted-foreground">Belum ada foto — pilih file di atas.</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {items.map((it, i) => (
                        <div
                            key={it.kind === "gallery" ? `g-${it.id}` : it.kind === "new" ? `n-${it.url}` : "cover"}
                            draggable
                            onDragStart={() => {
                                dragIdx.current = i;
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setOverIdx(i);
                            }}
                            onDragLeave={() => setOverIdx((v) => (v === i ? null : v))}
                            onDrop={(e) => {
                                e.preventDefault();
                                move(dragIdx.current, i);
                                dragIdx.current = null;
                                setOverIdx(null);
                            }}
                            onDragEnd={() => {
                                dragIdx.current = null;
                                setOverIdx(null);
                            }}
                            style={{ width: THUMB, height: THUMB }}
                            className={cn(
                                "group relative shrink-0 cursor-grab overflow-hidden rounded-xl border-2 border-border bg-muted active:cursor-grabbing",
                                i === 0 && "border-primary",
                                overIdx === i && "border-dashed border-primary"
                            )}
                            title={i === 0 ? "Sampul — seret foto lain ke sini untuk mengganti" : "Seret untuk memindah"}
                        >
                            <img src={it.url} alt="" className="size-full object-cover" draggable={false} />
                            <span className="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                                <GripVertical className="size-3" />
                                {i === 0 ? "Sampul" : `#${i + 1}`}
                            </span>
                            <button
                                type="button"
                                aria-label="Hapus foto"
                                onClick={() => removeAt(i)}
                                className="absolute right-1 top-1 rounded-lg bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
                            >
                                <X className="size-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
        </div>
    );
}

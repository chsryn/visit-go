import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Label } from "@/components/ui/label";

/**
 * Reusable single-image upload field for Inertia forms (issue.md §4).
 * - Shows live preview of the newly picked file, else the existing image_url.
 * - Parent passes `setData("image", file)` compatible setter via onFile.
 */
export default function ImageUpload({
    label = "Gambar",
    existingUrl = null,
    onFile,
    error = null,
    hint = "JPG/PNG/WebP, maks 4MB.",
}) {
    const [preview, setPreview] = useState(existingUrl);

    useEffect(() => {
        setPreview(existingUrl);
    }, [existingUrl]);

    const pick = (e) => {
        const file = e.target.files?.[0] ?? null;
        onFile?.(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreview(existingUrl);
    };

    const clear = () => {
        onFile?.(null);
        setPreview(null);
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div style={{ width: 155.55, height: 155.55 }}>
                {preview ? (
                    <div
                        style={{ width: 155.55, height: 155.55 }}
                        className="group relative shrink-0 overflow-hidden rounded-xl border-2 border-border bg-muted"
                    >
                        <img
                            src={preview}
                            alt="Pratinjau"
                            className="size-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={clear}
                            aria-label="Hapus gambar"
                            className="absolute right-1 top-1 rounded-lg bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
                        >
                            <X className="size-3.5" />
                        </button>
                    </div>
                ) : (
                    <label
                        style={{ width: 155.55, height: 155.55 }}
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-muted/40 text-muted-foreground hover:text-foreground"
                    >
                        <ImagePlus className="size-7" />
                        <span className="px-2 text-center text-[11px] font-medium">Klik untuk pilih gambar</span>
                        <input type="file" accept="image/*" className="hidden" onChange={pick} />
                    </label>
                )}
            </div>
            {preview && (
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-primary hover:underline">
                    Ganti gambar
                    <input type="file" accept="image/*" className="hidden" onChange={pick} />
                </label>
            )}
            <p className="text-[11px] text-muted-foreground">{hint}</p>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveStorageUrl } from "@/lib/image";

export function Lightbox({ items, index, onClose, go, srcOf }) {
    if (index === null || !items?.[index]) return null;
    const it = items[index];
    const raw = srcOf ? srcOf(it) : (it.image_url ?? it.image);
    const src = resolveStorageUrl(raw);
    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
            onClick={onClose}
        >
            <button
                type="button"
                aria-label="Tutup"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
                <X className="size-5" />
            </button>
            {items.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Sebelumnya"
                        onClick={(e) => {
                            e.stopPropagation();
                            go(-1);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="Berikutnya"
                        onClick={(e) => {
                            e.stopPropagation();
                            go(1);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 max-sm:hidden"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </>
            )}
            <div
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] max-w-[90vw]"
            >
                <img
                    src={src}
                    alt={it.alt ?? it.name}
                    className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
                />
                <p className="mt-3 text-center text-sm text-white/80">
                    {it.name}
                </p>
            </div>
        </div>
    );
}
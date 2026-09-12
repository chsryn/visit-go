import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Images, Trash2, Upload } from "lucide-react";

export default function DestinasiImages({ destinasi, images = [] }) {
    const [files, setFiles] = useState([]);
    const [busy, setBusy] = useState(false);
    const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));

    const submit = (e) => {
        e.preventDefault();
        if (files.length === 0) return;
        const fd = new FormData();
        files.forEach((f) => fd.append("images[]", f));
        setBusy(true);
        router.post(`/admin/destinasis/${destinasi.id}/images`, fd, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                setBusy(false);
                setFiles([]);
            },
        });
    };

    const remove = (id, idx) => {
        if (confirm(`Hapus foto ${idx + 1}?`)) {
            router.delete(`/admin/destination-images/${id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title={`Foto ${destinasi.name} — Admin`} />
            <AdminLayout
                title={`Foto — ${destinasi.name}`}
                subtitle="Galeri foto tambahan selain foto sampul. Bisa lebih dari 1 foto."
            >
                <div className="mb-4">
                    <Link
                        href="/admin/destinasis"
                        className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        ← Kembali ke Destinasi
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
                >
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Tambah foto (maks 10 sekaligus)</p>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
                        />
                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                                {previews.map((p, i) => (
                                    <img key={i} src={p.url} alt="" className="aspect-square rounded-xl object-cover" />
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <Button type="submit" disabled={busy || files.length === 0}>
                            <Upload className="size-4" />
                            {busy ? "Mengunggah…" : `Unggah ${files.length} foto`}
                        </Button>
                    </div>
                </form>

                <div className="mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
                    <p className="flex items-center gap-2 text-sm font-medium">
                        <Images className="size-4" /> {images.length} foto tersimpan
                    </p>
                    {images.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                            Belum ada foto tambahan — unggah lewat form di atas.
                        </p>
                    ) : (
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            {images.map((img, i) => (
                                <div key={img.id} className="group relative overflow-hidden rounded-xl border border-border">
                                    <img src={img.image_url} alt={img.alt ?? ""} className="aspect-square w-full object-cover" loading="lazy" />
                                    <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
                                        #{i + 1}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label="Hapus foto"
                                        onClick={() => remove(img.id, i)}
                                        className="absolute right-2 top-2 rounded-lg bg-black/60 p-2 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AdminLayout>
        </>
    );
}

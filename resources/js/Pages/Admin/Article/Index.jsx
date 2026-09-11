import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";

const statusBadge = (active) =>
    active ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Aktif</span>
    ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Nonaktif</span>
    );

export default function ArticleIndex({ items }) {
    return (
        <>
            <Head title="Artikel — Admin" />
            <AdminLayout title="Artikel" subtitle="Kelola artikel — nama, deskripsi, dan gambar.">
                <ResourceManager
                    items={items}
                    basePath="/admin/articles"
                    fields={[
                        { name: "name", label: "Nama" },
                        { name: "slug", label: "Slug (opsional)", hint: "Kosongkan untuk dibuat otomatis." },
                        { name: "body", label: "Deskripsi", type: "textarea", full: true },
                        { name: "alt", label: "Alt teks gambar" },
                        { name: "is_active", label: "Status", type: "checkbox" },
                    ]}
                    columns={[
                        {
                            key: "name",
                            label: "Nama",
                            render: (row) => (
                                <div className="flex items-center gap-3">
                                    {row.image_url && (
                                        <img src={row.image_url} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
                                    )}
                                    <div>
                                        <p className="font-medium leading-tight">{row.name}</p>
                                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">{row.slug}</p>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "is_active", label: "Status", render: (row) => statusBadge(row.is_active) },
                    ]}
                />
            </AdminLayout>
        </>
    );
}

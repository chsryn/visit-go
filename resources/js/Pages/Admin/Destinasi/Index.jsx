import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";

const statusBadge = (active) =>
    active ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Aktif</span>
    ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Nonaktif</span>
    );

const coords = (row) =>
    row.latitude && row.longitude ? (
        <span className="font-mono text-xs">
            {Number(row.latitude).toFixed(4)}, {Number(row.longitude).toFixed(4)}
        </span>
    ) : (
        <span className="text-xs text-muted-foreground">—</span>
    );

export default function DestinasiIndex({ items, categories, filterCategoryId }) {
    const activeCat = categories.find((c) => c.id === filterCategoryId);
    return (
        <>
            <Head title="Destination — Admin" />
            <AdminLayout
                title="Destination"
                subtitle={
                    activeCat
                        ? `Sub-kategori: ${activeCat.name} — grouping per tabel categories.`
                        : "Semua destinasi — pilih sub-kategori di sidebar untuk filter."
                }
            >
                <ResourceManager
                    items={items}
                    basePath="/admin/destinasis"
                    defaults={{ category_id: filterCategoryId ?? "" }}
                    fields={[
                        { name: "name", label: "Nama" },
                        { name: "slug", label: "Slug (opsional)", hint: "Kosongkan untuk dibuat otomatis." },
                        {
                            name: "category_id",
                            label: "Sub-kategori",
                            type: "select",
                            placeholder: "Pilih sub-kategori",
                            options: categories.map((c) => ({ value: c.id, label: c.name })),
                        },
                        { name: "body", label: "Deskripsi", type: "textarea", full: true },
                        { name: "location", label: "Lokasi (label)" },
                        { name: "latitude", label: "Latitude", type: "number", step: "any", placeholder: "cth: 0.5401" },
                        { name: "longitude", label: "Longitude", type: "number", step: "any", placeholder: "cth: 123.0298" },
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
                                        <p className="mt-0.5 text-xs text-muted-foreground">{row.category_name}</p>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "coords", label: "Koordinat", render: coords },
                        { key: "is_active", label: "Status", render: (row) => statusBadge(row.is_active) },
                    ]}
                />
            </AdminLayout>
        </>
    );
}

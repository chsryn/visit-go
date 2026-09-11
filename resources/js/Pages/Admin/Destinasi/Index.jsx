import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";

const statusBadge = (active) =>
    active ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Aktif</span>
    ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Nonaktif</span>
    );

const categoryBadge = (row) =>
    row.destination_category?.name ? (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium capitalize text-primary">
            {row.destination_category.name}
        </span>
    ) : (
        <span className="text-xs text-muted-foreground">—</span>
    );

const coords = (row) =>
    row.latitude && row.longitude ? (
        <span className="font-mono text-xs">
            {Number(row.latitude).toFixed(4)}, {Number(row.longitude).toFixed(4)}
        </span>
    ) : (
        <span className="text-xs text-muted-foreground">—</span>
    );

export default function DestinasiIndex({ items, filterKategori, categoryOptions = [] }) {
    const defaultCategoryId = categoryOptions.find((c) => c.slug === filterKategori)?.id ?? "";

    return (
        <>
            <Head title="Destinasi — Admin" />
            <AdminLayout
                title="Destinasi"
                subtitle={
                    filterKategori
                        ? `Kategori: ${filterKategori} — tambah baru untuk memperbanyak.`
                        : "Semua destinasi wisata — tambah kategori baru lewat Kelola Kategori."
                }
            >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                        Destinasi
                    </span>
                    <Link
                        href="/admin/destination-prices"
                        className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        Estimasi Harga
                    </Link>
                    <Link
                        href="/admin/destination-categories"
                        className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        Kelola Kategori
                    </Link>
                </div>
                <ResourceManager
                    items={items}
                    basePath="/admin/destinasis"
                    defaults={{ destination_category_id: defaultCategoryId }}
                    fields={[
                        { name: "name", label: "Nama" },
                        { name: "slug", label: "Slug (opsional)", hint: "Kosongkan untuk dibuat otomatis." },
                        {
                            name: "destination_category_id",
                            label: "Kategori",
                            type: "select",
                            placeholder: "Pilih kategori",
                            hint: "Kategori baru ditambahkan lewat halaman Kelola Kategori.",
                            options: categoryOptions.map((c) => ({ value: c.id, label: c.name })),
                        },
                        { name: "body", label: "Deskripsi", type: "textarea", full: true },
                        { name: "location", label: "Lokasi (label)" },
                        {
                            name: "area",
                            label: "Wilayah",
                            type: "select",
                            placeholder: "Pilih wilayah",
                            options: [
                                "Kota Gorontalo",
                                "Kab. Gorontalo",
                                "Bone Bolango",
                                "Boalemo",
                                "Pohuwato",
                                "Gorontalo Utara",
                            ].map((a) => ({ value: a, label: a })),
                        },
                        { name: "tags", label: "Tags (opsional)", placeholder: "cth: snorkeling, pantai, keluarga", hint: "Pisahkan dengan koma — dipakai AI untuk mencocokkan minat." },
                        { name: "location_picker", label: "Titik Lokasi — klik peta", type: "location", hint: "Klik lokasi pada peta, marker muncul dan koordinat terisi otomatis." },
                        { name: "latitude", label: "Latitude", readonly: true },
                        { name: "longitude", label: "Longitude", readonly: true },
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
                                        <p className="mt-0.5 text-xs text-muted-foreground">{row.location ?? row.area ?? "Destinasi"}</p>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "destination_category_id", label: "Kategori", render: categoryBadge },
                        { key: "coords", label: "Koordinat", render: coords },
                        { key: "is_active", label: "Status", render: (row) => statusBadge(row.is_active) },
                    ]}
                />
            </AdminLayout>
        </>
    );
}

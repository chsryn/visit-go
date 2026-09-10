import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";

const statusBadge = (active) =>
    active ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Aktif</span>
    ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Nonaktif</span>
    );

const rupiah = (v) =>
    v === null || v === undefined || v === ""
        ? <span className="text-xs text-muted-foreground">—</span>
        : `Rp ${Number(v).toLocaleString("id-ID")}`;

export default function KulinerIndex({ items }) {
    return (
        <>
            <Head title="Kuliner — Admin" />
            <AdminLayout title="Kuliner" subtitle="CRUD tabel kuliners — harga dalam rupiah & koordinat.">
                <ResourceManager
                    items={items}
                    basePath="/admin/kuliners"
                    fields={[
                        { name: "name", label: "Nama" },
                        { name: "slug", label: "Slug (opsional)", hint: "Kosongkan untuk dibuat otomatis." },
                        { name: "body", label: "Deskripsi", type: "textarea", full: true },
                        { name: "harga", label: "Harga (Rp)", type: "number", placeholder: "cth: 25000" },
                        { name: "location_picker", label: "Titik Lokasi — klik peta", type: "location", hint: "Klik lokasi pada peta, marker muncul dan koordinat terisi otomatis." },
                        { name: "latitude", label: "Latitude", readonly: true },
                        { name: "longitude", label: "Longitude", readonly: true },
                        { name: "alt", label: "Alt teks gambar" },
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
                        { name: "tags", label: "Tags (opsional)", placeholder: "cth: halal, pedas, seafood", hint: "Pisahkan dengan koma — dipakai AI untuk preferensi makanan." },
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
                                    <p className="font-medium leading-tight">{row.name}</p>
                                </div>
                            ),
                        },
                        { key: "harga", label: "Harga", render: (row) => rupiah(row.harga) },
                        { key: "is_active", label: "Status", render: (row) => statusBadge(row.is_active) },
                    ]}
                />
            </AdminLayout>
        </>
    );
}

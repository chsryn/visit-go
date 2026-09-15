import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";

const statusBadge = (active) =>
    active ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Aktif</span>
    ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Nonaktif</span>
    );

export default function BudayaIndex({ items }) {
    return (
        <>
            <Head title="Budaya — Admin" />
            <AdminLayout title="Budaya" subtitle="CRUD tabel budayas — jam operasional & titik koordinat.">
                <ResourceManager
                    items={items}
                    basePath="/admin/budayas"
                    fields={[
                        { name: "name", label: "Nama" },
                        { name: "slug", label: "Slug", required: true, hint: "Wajib diisi — contoh: tari-saronde-dikili." },
                        { name: "body", label: "Deskripsi", type: "textarea", full: true },
                        { name: "jam_buka", label: "Jam buka", type: "time" },
                        { name: "jam_tutup", label: "Jam tutup", type: "time" },
                        { name: "has_location", label: "Lokasi", type: "checkbox", checkboxLabel: "Perlihatkan lokasi & peta", hint: "Centang jika budaya berupa monumen atau tempat fisik. Biarkan kosong untuk tarian/adat warisan budaya." },
                        { name: "location_picker", label: "Titik Lokasi — klik peta", type: "location", visibleWhen: (v) => !!v.has_location, hint: "Klik lokasi pada peta, marker muncul dan koordinat terisi otomatis." },
                        { name: "latitude", label: "Latitude", readonly: true, visibleWhen: (v) => !!v.has_location },
                        { name: "longitude", label: "Longitude", readonly: true, visibleWhen: (v) => !!v.has_location },
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
                        { name: "tags", label: "Tags", placeholder: "cth: tari, sejarah, keluarga", hint: "Pisahkan dengan koma — dipakai AI untuk mencocokkan minat." },
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
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {row.jam_buka && row.jam_tutup ? `${row.jam_buka.slice(0, 5)}–${row.jam_tutup.slice(0, 5)}` : "Jam tidak diatur"}
                                        </p>
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

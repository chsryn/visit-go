import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";

const statusBadge = (active) =>
    active ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">
            Aktif
        </span>
    ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Nonaktif
        </span>
    );

export default function UmkmIndex({
    items,
    kulinerCategories = [],
    kerajinanCategories = [],
}) {
    return (
        <>
            <Head title="UMKM — Admin" />
            <AdminLayout
                title="UMKM"
                subtitle="Kelola UMKM — pilih setidaknya satu kategori Kuliner atau Kerajinan."
            >
                <ResourceManager
                    items={items}
                    basePath="/admin/umkms"
                    defaults={{}}
                    fields={[
                        {
                            name: "name",
                            label: "Nama UMKM",
                            section: "Informasi Dasar",
                        },
                        {
                            name: "slug",
                            label: "Slug",
                            hint: "Kosongkan untuk dibuat otomatis.",
                            section: "Informasi Dasar",
                            inline: true,
                        },
                        {
                            name: "kuliner_categories",
                            label: "Kategori Kuliner",
                            type: "checkbox-list",
                            hint: "Pilih satu atau lebih kategori kuliner.",
                            options: kulinerCategories.map((c) => ({
                                value: c.id,
                                label: c.name,
                            })),
                            initial: (row) => row.kuliner_category_ids ?? [],
                            section: "Kategori",
                        },
                        {
                            name: "kerajinan_categories",
                            label: "Kategori Kerajinan",
                            type: "checkbox-list",
                            hint: "Pilih satu atau lebih kategori kerajinan.",
                            options: kerajinanCategories.map((c) => ({
                                value: c.id,
                                label: c.name,
                            })),
                            initial: (row) => row.kerajinan_category_ids ?? [],
                            section: "Kategori",
                        },
                        {
                            name: "body",
                            label: "Deskripsi",
                            type: "textarea",
                            section: "Detail Usaha",
                        },
                        {
                            name: "produk",
                            label: "Produk",
                            type: "textarea",
                            placeholder:
                                "cth: Milu Siram, Ilabulo, Kopi Pinogu",
                            section: "Detail Usaha",
                            inline: true,
                        },
                        {
                            name: "kontak",
                            label: "Kontak",
                            placeholder: "cth: 0812-... / Jl. ...",
                            section: "Detail Usaha",
                        },
                        {
                            name: "harga",
                            label: "Harga (Rp)",
                            type: "number",
                            placeholder: "cth: 25000",
                            section: "Detail Usaha",
                            inline: true,
                        },
                        {
                            name: "location_picker",
                            label: "Titik Lokasi — klik peta",
                            type: "location",
                            hint: "Klik lokasi pada peta, marker muncul dan koordinat terisi otomatis.",
                            section: "Peta & Lokasi",
                        },
                        {
                            name: "latitude",
                            label: "Latitude",
                            readonly: true,
                            section: "Peta & Lokasi",
                            sidebar: false,
                        },
                        {
                            name: "longitude",
                            label: "Longitude",
                            readonly: true,
                            section: "Peta & Lokasi",
                            sidebar: false,
                        },
                        {
                            name: "skala_usaha",
                            label: "Skala Usaha",
                            type: "select",
                            placeholder: "Pilih skala",
                            options: [
                                { value: "mikro", label: "Mikro" },
                                { value: "kecil", label: "Kecil" },
                                { value: "menengah", label: "Menengah" },
                            ],
                            section: "Metadata",
                            sidebar: true,
                        },
                        {
                            name: "tags",
                            label: "Tags",
                            placeholder: "cth: halal, pedas, seafood",
                            hint: "Pisahkan dengan koma",
                            section: "Metadata",
                            sidebar: true,
                        },
                        {
                            name: "alt",
                            label: "Alt Teks Gambar",
                            section: "Metadata",
                            sidebar: true,
                        },
                        {
                            name: "is_active",
                            label: "Status",
                            type: "checkbox",
                            checkboxLabel: "Aktif",
                            section: "Metadata",
                            sidebar: true,
                        },
                    ]}
                    columns={[
                        {
                            key: "name",
                            label: "Nama",
                            render: (row) => (
                                <div className="flex items-center gap-3">
                                    {row.image_url && (
                                        <img
                                            src={row.image_url}
                                            alt=""
                                            className="size-10 shrink-0 rounded-lg object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium leading-tight">
                                            {row.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {row.kuliner_categories
                                                ?.map((c) => c.name)
                                                .join(", ") ||
                                                row.kerajinan_categories
                                                    ?.map((c) => c.name)
                                                    .join(", ") ||
                                                ""}
                                            {row.skala_usaha
                                                ? ` · ${row.skala_usaha}`
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            key: "kontak",
                            label: "Kontak",
                            render: (row) =>
                                row.kontak ?? (
                                    <span className="text-xs text-muted-foreground">
                                        —
                                    </span>
                                ),
                        },
                        {
                            key: "harga",
                            label: "Harga",
                            render: (row) =>
                                row.harga === null ||
                                row.harga === undefined ||
                                row.harga === "" ? (
                                    <span className="text-xs text-muted-foreground">
                                        —
                                    </span>
                                ) : (
                                    `Rp ${Number(row.harga).toLocaleString("id-ID")}`
                                ),
                        },
                        {
                            key: "is_active",
                            label: "Status",
                            render: (row) => statusBadge(row.is_active),
                        },
                    ]}
                />
            </AdminLayout>
        </>
    );
}

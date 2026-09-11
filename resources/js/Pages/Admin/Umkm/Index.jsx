import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";
import { cn } from "@/lib/utils";

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

export default function UmkmIndex({ items, filterJenis, tab, kuliners, jenisOptions }) {
    const [activeTab, setActiveTab] = useState(tab ?? "umkm");
    const defaultJenisId = jenisOptions.find((j) => j.slug === filterJenis)?.id ?? "";
    const kulinerJenisId = jenisOptions.find((j) => j.slug === "kuliner")?.id ?? "";

    const gotoTab = (t, extra = {}) => {
        setActiveTab(t);
        router.get("/admin/umkms", { tab: t, ...extra }, { preserveScroll: true, preserveState: false });
    };

    return (
        <>
            <Head title="UMKM — Admin" />
            <AdminLayout
                title="UMKM"
                subtitle={
                    filterJenis
                        ? `Jenis: ${filterJenis} — tambah baru untuk memperbanyak.`
                        : "Semua UMKM — tambah jenis baru langsung dari form."
                }
            >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => gotoTab("umkm", filterJenis ? { jenis: filterJenis } : {})}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium",
                            activeTab === "umkm"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        UMKM
                    </button>

                    <button
                        type="button"
                        onClick={() => gotoTab("kuliner")}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium",
                            activeTab === "kuliner"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        Kuliner
                    </button>
                </div>

                {activeTab === "umkm" ? (
                <ResourceManager
                    items={items}
                    basePath="/admin/umkms"
                    defaults={{ umkm_jenis_id: defaultJenisId }}
                    fields={[
                        { name: "name", label: "Nama UMKM" },
                        { name: "slug", label: "Slug (opsional)", hint: "Kosongkan untuk dibuat otomatis." },
                        {
                            name: "umkm_jenis_id",
                            label: "Jenis",
                            type: "select",
                            placeholder: "Pilih jenis",
                            hint: "Jenis baru ditambahkan lewat halaman Kelola Jenis.",
                            options: jenisOptions.map((j) => ({ value: j.id, label: j.name })),
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
                        },
                        { name: "body", label: "Deskripsi", type: "textarea", full: true },
                        { name: "produk", label: "Produk", type: "textarea", placeholder: "cth: Milu Siram, Ilabulo, Kopi Pinogu" },
                        { name: "kontak", label: "Kontak", placeholder: "cth: 0812-... / Jl. ..." },
                            { name: "harga", label: "Harga (Rp, opsional)", type: "number", placeholder: "cth: 25000" },
                            { name: "location_picker", label: "Titik Lokasi — klik peta", type: "location", hint: "Klik lokasi pada peta, marker muncul dan koordinat terisi otomatis." },
                            { name: "latitude", label: "Latitude", readonly: true },
                            { name: "longitude", label: "Longitude", readonly: true },
                            { name: "tags", label: "Tags (opsional)", placeholder: "cth: halal, pedas, seafood", hint: "Pisahkan dengan koma — dipakai AI untuk preferensi makanan." },
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
                                            <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                                                {row.jenis}{row.skala_usaha ? ` · ${row.skala_usaha}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            },
                            { key: "kontak", label: "Kontak", render: (row) => row.kontak ?? <span className="text-xs text-muted-foreground">—</span> },
                            { key: "harga", label: "Harga", render: (row) => row.harga === null || row.harga === undefined || row.harga === "" ? <span className="text-xs text-muted-foreground">—</span> : `Rp ${Number(row.harga).toLocaleString("id-ID")}` },
                            { key: "is_active", label: "Status", render: (row) => statusBadge(row.is_active) },
                        ]}
                    />
                ) : (
                    <ResourceManager
                        items={kuliners}
                        basePath="/admin/umkms"
                        defaults={{ umkm_jenis_id: kulinerJenisId }}
                        fields={[
                            { name: "name", label: "Nama kuliner" },
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
                )}
            </AdminLayout>
        </>
    );
}

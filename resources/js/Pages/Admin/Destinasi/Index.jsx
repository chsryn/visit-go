import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";
import { AdminBreadcrumb, DESTINASI_NAV } from "@/components/admin/AdminBreadcrumb";

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
                <div className="mb-4"><AdminBreadcrumb items={DESTINASI_NAV} /></div>
                <ResourceManager
                    items={items}
                    basePath="/admin/destinasis"
                    defaults={{ destination_category_id: defaultCategoryId }}
                    withImageUpload={false}
                    sidebarTitle="Status Publikasi"
                    formTitle="Destinasi Wisata"
                    formSubtitle="Perbarui informasi, foto, dan titik lokasi destinasi."
                    fields={[
                        { name: "name", label: "Nama", section: "Informasi Dasar", half: true },
                        { name: "slug", label: "Slug", section: "Informasi Dasar", half: true, required: true, hint: "Wajib diisi — contoh: botubarani-pulo-cinta." },
                        {
                            name: "destination_category_id",
                            label: "Kategori",
                            type: "select",
                            section: "Informasi Dasar",
                            half: true,
                            placeholder: "Pilih kategori",
                            hint: "Kategori baru ditambahkan lewat halaman Kelola Kategori.",
                            options: categoryOptions.map((c) => ({ value: c.id, label: c.name })),
                        },
                        { name: "tags", label: "Tags", section: "Informasi Dasar", half: true, placeholder: "cth: snorkeling, pantai, keluarga", hint: "Pisahkan dengan koma — dipakai AI untuk mencocokkan minat." },
                        { name: "body", label: "Deskripsi", type: "textarea", section: "Informasi Dasar" },
                        {
                            name: "gallery",
                            label: "Foto",
                            type: "gallery",
                            section: "Media & Galeri",
                            full: true,
                            hint: "Paling kiri = sampul. Seret foto untuk menyusun ulang; tambah beberapa sekaligus.",
                            initial: (row) => [
                                ...(row.image_url ? [{ kind: "cover", url: row.image_url }] : []),
                                ...((row.gallery ?? []).map((g) => ({ kind: "gallery", id: g.id, url: g.image_url }))),
                            ],
                        },
                        { name: "alt", label: "Alt teks gambar", section: "Media & Galeri" },
                        {
                            name: "area",
                            label: "Wilayah",
                            type: "select",
                            section: "Pemetaan Lokasi",
                            half: true,
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
                        { name: "location", label: "Lokasi (label)", section: "Pemetaan Lokasi", half: true },
                        { name: "location_picker", label: "Titik Lokasi — klik peta", type: "location", section: "Pemetaan Lokasi", hint: "Klik lokasi pada peta, marker muncul dan koordinat terisi otomatis." },
                        { name: "latitude", label: "Latitude", section: "Pemetaan Lokasi", half: true, readonly: true },
                        { name: "longitude", label: "Longitude", section: "Pemetaan Lokasi", half: true, readonly: true },
                        { name: "is_active", label: "Status", type: "checkbox", sidebar: true, checkboxLabel: "Aktif (Ditampilkan)" },
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
                        {
                            key: "images_count",
                            label: "Foto",
                            render: (row) => (
                                <Link
                                    href={`/admin/destinasis/${row.id}/images`}
                                    className="whitespace-nowrap rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                >
                                    {row.images_count ?? 0} foto →
                                </Link>
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

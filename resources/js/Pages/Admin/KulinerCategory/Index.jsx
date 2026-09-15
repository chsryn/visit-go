import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";
import { AdminBreadcrumb, UMKM_NAV } from "@/components/admin/AdminBreadcrumb";

const statusBadge = (active) =>
    active ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Aktif</span>
    ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Nonaktif</span>
    );

export default function KulinerCategoryIndex({ items }) {
    return (
        <>
            <Head title="Kategori Kuliner — Admin" />
            <AdminLayout
                title="Kategori Kuliner"
                subtitle="Kelola jenis kuliner khas — akan muncul sebagai opsi filter di halaman kuliner & form UMKM."
            >
                <div className="mb-4">
                    <AdminBreadcrumb items={UMKM_NAV} />
                </div>
                <ResourceManager
                    items={items}
                    basePath="/admin/kuliner-categories"
                    fields={[
                        { name: "name", label: "Nama kategori kuliner", placeholder: "cth: Binthe Biluhuta" },
                        { name: "is_active", label: "Status", type: "checkbox" },
                    ]}
                    columns={[
                        {
                            key: "name",
                            label: "Nama",
                            render: (row) => (
                                <div>
                                    <p className="font-medium capitalize leading-tight">{row.name}</p>
                                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                        {row.umkms_count ?? 0} umkm
                                    </p>
                                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">{row.slug}</p>
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

import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";
import { AdminBreadcrumb, DESTINASI_NAV } from "@/components/admin/AdminBreadcrumb";

const statusBadge = (active) =>
    active ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Aktif</span>
    ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Nonaktif</span>
    );

export default function DestinationCategories({ items }) {
    return (
        <>
            <Head title="Kategori Destinasi — Admin" />
            <AdminLayout
                title="Kategori Destinasi"
                subtitle="Master kategori — tambah di sini agar muncul di sidebar & form destinasi."
            >
                <div className="mb-4"><AdminBreadcrumb items={DESTINASI_NAV} /></div>
                <ResourceManager
                    items={items}
                    basePath="/admin/destination-categories"
                    fields={[
                        { name: "name", label: "Nama kategori", placeholder: "cth: wisata religi" },
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
                                        {row.destinasis_count ?? 0} destinasi
                                    </p>
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

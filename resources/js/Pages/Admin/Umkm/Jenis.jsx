import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";

const statusBadge = (active) =>
    active ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Aktif</span>
    ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Nonaktif</span>
    );

export default function UmkmJenis({ items }) {
    return (
        <>
            <Head title="Jenis UMKM — Admin" />
            <AdminLayout
                title="Jenis UMKM"
                subtitle="Master jenis — tambah di sini agar muncul di sidebar & form UMKM."
            >
                <div className="mb-4">
                    <Link
                        href="/admin/umkms"
                        className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        ← Kembali ke UMKM
                    </Link>
                </div>
                <ResourceManager
                    items={items}
                    basePath="/admin/umkm-jenis"
                    fields={[
                        { name: "name", label: "Nama jenis", placeholder: "cth: tenun" },
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

import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ResourceManager from "@/components/admin/ResourceManager";
import { cn } from "@/lib/utils";

const JENIS_LABELS = {
    tiket_masuk: "Tiket Masuk",
    wahana: "Wahana / Aktivitas",
    sewa: "Sewa Fasilitas",
    lainnya: "Lainnya",
};

const statusBadge = (active) =>
    active ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Aktif</span>
    ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Nonaktif</span>
    );

const rupiah = (v) => `Rp ${Number(v ?? 0).toLocaleString("id-ID")}`;

export default function DestinationPrices({ items, destinasis, filterDestinasiId }) {
    return (
        <>
            <Head title="Estimasi Harga — Admin" />
            <AdminLayout
                title="Destination"
                subtitle="Sub-bagian estimasi harga — dipakai AI untuk perkiraan biaya liburan."
            >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Link
                        href="/admin/destinasis"
                        className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        Destinasi
                    </Link>
                    <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                        Estimasi Harga
                    </span>
                    <select
                        value={filterDestinasiId ?? ""}
                        onChange={(e) =>
                            router.get(
                                "/admin/destination-prices",
                                e.target.value ? { destinasi_id: e.target.value } : {},
                                { preserveScroll: true }
                            )
                        }
                        className={cn(
                            "ml-auto flex h-9 rounded-md border border-input bg-transparent px-3 py-1",
                            "text-sm shadow-xs outline-none focus-visible:border-ring"
                        )}
                    >
                        <option value="">Semua destinasi</option>
                        {destinasis.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>

                <ResourceManager
                    items={items}
                    basePath="/admin/destination-prices"
                    defaults={{ destinasi_id: filterDestinasiId ?? "" }}
                    fields={[
                        {
                            name: "destinasi_id",
                            label: "Destinasi",
                            type: "select",
                            placeholder: "Pilih destinasi",
                            options: destinasis.map((d) => ({ value: d.id, label: d.name })),
                        },
                        {
                            name: "jenis",
                            label: "Jenis",
                            type: "select",
                            placeholder: "Pilih jenis",
                            options: Object.entries(JENIS_LABELS).map(([value, label]) => ({ value, label })),
                        },
                        { name: "label", label: "Nama item", placeholder: "cth: Tiket masuk kawasan" },
                        { name: "harga", label: "Harga (Rp)", type: "number", placeholder: "cth: 20000" },
                        { name: "satuan", label: "Satuan (opsional)", placeholder: "orang / unit / hari" },
                        { name: "catatan", label: "Catatan (opsional)", full: true },
                        { name: "is_active", label: "Status", type: "checkbox" },
                    ]}
                    columns={[
                        {
                            key: "label",
                            label: "Item",
                            render: (row) => (
                                <div>
                                    <p className="font-medium leading-tight">{row.label}</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {row.destinasi?.name} · {JENIS_LABELS[row.jenis] ?? row.jenis}
                                        {row.satuan ? ` / ${row.satuan}` : ""}
                                    </p>
                                </div>
                            ),
                        },
                        {
                            key: "harga",
                            label: "Harga",
                            render: (row) => <span className="font-mono text-xs">{rupiah(row.harga)}</span>,
                        },
                        { key: "is_active", label: "Status", render: (row) => statusBadge(row.is_active) },
                    ]}
                />
            </AdminLayout>
        </>
    );
}

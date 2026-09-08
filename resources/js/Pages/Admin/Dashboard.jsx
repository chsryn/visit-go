import { Head, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { MapPin, Landmark, UtensilsCrossed, Hammer, CalendarDays, ArrowRight } from "lucide-react";

function StatCard({ icon: Icon, label, value, href }) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
        >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
            </span>
            <span>
                <span className="block font-display text-2xl font-bold leading-none">{value}</span>
                <span className="mt-1 block text-xs font-medium text-muted-foreground">{label}</span>
            </span>
            <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
    );
}

export default function Dashboard({ stats, latest }) {
    return (
        <>
            <Head title="Dashboard — Admin Visit Gorontalo" />
            <AdminLayout title="Dashboard" subtitle="Ringkasan konten portal pariwisata Gorontalo.">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard icon={MapPin} label="Destinasi" value={stats.destinasi} href="/admin/destinasis" />
                    <StatCard icon={Landmark} label="Budaya" value={stats.budaya} href="/admin/budayas" />
                    <StatCard icon={UtensilsCrossed} label="Kuliner" value={stats.kuliner} href="/admin/kuliners" />
                    <StatCard icon={Hammer} label="Kerajinan" value={stats.kerajinan} href="/admin/kerajinans" />
                    <StatCard icon={CalendarDays} label="Event" value={stats.event} href="/admin/events" />
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <h2 className="font-display text-base font-bold">Destinasi terbaru</h2>
                        <ul className="mt-3 divide-y divide-border/60">
                            {(latest?.destinasi ?? []).map((d) => (
                                <li key={d.id} className="flex items-center gap-3 py-2.5 text-sm">
                                    <span className="flex-1 truncate font-medium">{d.name}</span>
                                    <span
                                        className={
                                            d.is_active
                                                ? "rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800"
                                                : "rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                                        }
                                    >
                                        {d.is_active ? "Aktif" : "Nonaktif"}
                                    </span>
                                </li>
                            ))}
                            {(latest?.destinasi ?? []).length === 0 && (
                                <li className="py-6 text-center text-sm text-muted-foreground">Belum ada data.</li>
                            )}
                        </ul>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <h2 className="font-display text-base font-bold">Event terbaru</h2>
                        <ul className="mt-3 divide-y divide-border/60">
                            {(latest?.events ?? []).map((e) => (
                                <li key={e.id} className="flex items-center gap-3 py-2.5 text-sm">
                                    <span className="flex-1 truncate font-medium">{e.name}</span>
                                    <span
                                        className={
                                            e.is_active
                                                ? "rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800"
                                                : "rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                                        }
                                    >
                                        {e.is_active ? "Aktif" : "Nonaktif"}
                                    </span>
                                </li>
                            ))}
                            {(latest?.events ?? []).length === 0 && (
                                <li className="py-6 text-center text-sm text-muted-foreground">Belum ada data.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}

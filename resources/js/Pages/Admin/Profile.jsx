import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile({ admin }) {
    const profile = useForm({ name: admin?.name ?? "", email: admin?.email ?? "" });
    const password = useForm({ current_password: "", password: "", password_confirmation: "" });

    return (
        <>
            <Head title="User Profile — Admin" />
            <AdminLayout title="User Profile" subtitle="Kelola nama, email, dan password akun admin.">
                <div className="grid gap-4 lg:grid-cols-2">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            profile.put("/admin/profile", { preserveScroll: true });
                        }}
                        className="space-y-4 rounded-2xl border border-border bg-card p-5"
                    >
                        <h2 className="font-display text-base font-bold">Data akun</h2>
                        <div className="space-y-2">
                            <Label>Nama</Label>
                            <Input value={profile.data.name} onChange={(e) => profile.setData("name", e.target.value)} />
                            {profile.errors.name && <p className="text-xs text-destructive">{profile.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={profile.data.email} onChange={(e) => profile.setData("email", e.target.value)} />
                            {profile.errors.email && <p className="text-xs text-destructive">{profile.errors.email}</p>}
                        </div>
                        <Button type="submit" disabled={profile.processing}>
                            {profile.processing ? "Menyimpan…" : "Simpan profil"}
                        </Button>
                    </form>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            password.put("/admin/profile/password", {
                                preserveScroll: true,
                                onSuccess: () => password.reset(),
                            });
                        }}
                        className="space-y-4 rounded-2xl border border-border bg-card p-5"
                    >
                        <h2 className="font-display text-base font-bold">Ganti password</h2>
                        <div className="space-y-2">
                            <Label>Password saat ini</Label>
                            <Input
                                type="password"
                                autoComplete="current-password"
                                value={password.data.current_password}
                                onChange={(e) => password.setData("current_password", e.target.value)}
                            />
                            {password.errors.current_password && (
                                <p className="text-xs text-destructive">{password.errors.current_password}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Password baru (min 8)</Label>
                            <Input
                                type="password"
                                autoComplete="new-password"
                                value={password.data.password}
                                onChange={(e) => password.setData("password", e.target.value)}
                            />
                            {password.errors.password && (
                                <p className="text-xs text-destructive">{password.errors.password}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Konfirmasi password baru</Label>
                            <Input
                                type="password"
                                autoComplete="new-password"
                                value={password.data.password_confirmation}
                                onChange={(e) => password.setData("password_confirmation", e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={password.processing}>
                            {password.processing ? "Menyimpan…" : "Ganti password"}
                        </Button>
                    </form>
                </div>
            </AdminLayout>
        </>
    );
}

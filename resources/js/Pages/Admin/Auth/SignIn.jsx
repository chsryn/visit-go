import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, MapPin } from "lucide-react";

export default function SignIn() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post("/admin/login");
    };

    return (
        <>
            <Head title="Admin Login — Visit Gorontalo" />
            <div className="grid min-h-screen font-sans lg:grid-cols-2">
                {/* Brand panel */}
                <div className="relative hidden overflow-hidden bg-primary lg:block">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='white' stroke-width='0.6' opacity='0.7'%3E%3Cpath d='M60 18 L70 30 L60 42 L50 30 Z'/%3E%3Cpath d='M60 42 L70 54 L60 66 L50 54 Z'/%3E%3Cpath d='M18 60 L30 50 L42 60 L30 70 Z'/%3E%3Cpath d='M78 60 L90 50 L102 60 L90 70 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: "240px 240px",
                        }}
                    />
                    <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
                        <div className="flex items-center gap-2.5">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 font-display text-xl font-bold backdrop-blur-sm">
                                V
                            </span>
                            <span className="font-display text-xl font-bold">Visit Gorontalo</span>
                        </div>
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                                <MapPin className="size-3.5" /> Hulondalo Admin Panel
                            </p>
                            <h2 className="mt-6 font-display text-4xl font-bold leading-tight">
                                Kelola destinasi, budaya, kuliner & event Gorontalo.
                            </h2>
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80">
                                Satu pintu untuk mengelola seluruh konten portal pariwisata — dari hiu
                                paus Botubarani hingga Karnaval Karawo.
                            </p>
                        </div>
                        <p className="text-xs text-primary-foreground/60">
                            © 2026 Visit Gorontalo — Dinas Pariwisata
                        </p>
                    </div>
                </div>

                {/* Form panel */}
                <div className="flex items-center justify-center bg-background p-6 sm:p-12">
                    <div className="w-full max-w-sm">
                        <div className="mb-8 lg:hidden">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-display text-xl font-bold text-primary-foreground">
                                V
                            </span>
                        </div>
                        <h1 className="font-display text-2xl font-bold">Selamat datang kembali</h1>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Masuk ke panel admin Visit Gorontalo.
                        </p>

                        <form onSubmit={submit} className="mt-8 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="username"
                                    placeholder="admin@visitgo.local"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive">{errors.password}</p>
                                )}
                            </div>

                            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                    className="size-4 rounded border-input accent-[#715386]"
                                />
                                Ingat saya
                            </label>

                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? "Memproses…" : "Masuk"}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-xs text-muted-foreground">
                            Lupa password? Hubungi superadmin Dinas Pariwisata.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

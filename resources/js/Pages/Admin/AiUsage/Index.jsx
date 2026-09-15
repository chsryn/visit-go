import { Head, router, useForm } from "@inertiajs/react";
import { Fragment, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PROVIDERS = ["groq", "tavily", "claude", "openai", "gemini", "grok", "other"];

function KeyStatus({ k }) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
                k.is_expired
                    ? "bg-red-100 text-red-800"
                    : k.is_expiring_soon
                      ? "bg-amber-100 text-amber-800"
                      : k.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-muted text-muted-foreground"
            )}
        >
            {k.is_expired ? (
                <><AlertTriangle className="size-3" /> Expired</>
            ) : k.is_expiring_soon ? (
                <><AlertTriangle className="size-3" /> Segera expired</>
            ) : k.is_active ? (
                <><CheckCircle2 className="size-3" /> Aktif</>
            ) : (
                "Nonaktif"
            )}
        </span>
    );
}

function RowActions({ onEdit, onDelete, align = "justify-end" }) {
    return (
        <div className={cn("flex items-center gap-1.5", align)}>
            <button
                type="button"
                aria-label="Edit"
                onClick={onEdit}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
                <Pencil className="size-4" />
            </button>
            <button
                type="button"
                aria-label="Hapus"
                onClick={onDelete}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
                <Trash2 className="size-4" />
            </button>
        </div>
    );
}

function KeyForm({ initial, submitLabel, onDone, onCancel }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        provider: initial?.provider ?? "groq",
        label: initial?.label ?? "",
        api_key: "",
        expires_at: initial?.expires_at ? String(initial.expires_at).slice(0, 16).replace(" ", "T") : "",
        is_active: initial?.is_active ?? true,
        _method: initial?.id ? "put" : "post",
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const url = initial?.id ? `/admin/ai-keys/${initial.id}` : "/admin/ai-keys";
                post(url, {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset("api_key");
                        onDone?.();
                    },
                });
            }}
            className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Provider</Label>
                    <select
                        value={data.provider}
                        onChange={(e) => setData("provider", e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none"
                    >
                        {PROVIDERS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    {errors.provider && <p className="text-xs text-destructive">{errors.provider}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Label</Label>
                    <Input value={data.label} placeholder="cth: Groq produksi" onChange={(e) => setData("label", e.target.value)} />
                    {errors.label && <p className="text-xs text-destructive">{errors.label}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label>API Key {initial?.id && <span className="font-normal text-muted-foreground">(kosongkan bila tidak diganti)</span>}</Label>
                    <Input
                        type="password"
                        value={data.api_key}
                        placeholder={initial?.id ? "••••••••" : "gsk_… / tvly-…"}
                        onChange={(e) => setData("api_key", e.target.value)}
                    />
                    {errors.api_key && <p className="text-xs text-destructive">{errors.api_key}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Expired <span className="font-normal text-muted-foreground">(opsional)</span></Label>
                    <Input type="datetime-local" value={data.expires_at} onChange={(e) => setData("expires_at", e.target.value)} />
                    {errors.expires_at && <p className="text-xs text-destructive">{errors.expires_at}</p>}
                </div>
                <div className="flex items-end pb-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={!!data.is_active}
                            onChange={(e) => setData("is_active", e.target.checked)}
                            className="size-4 accent-[#715386]"
                        />
                        Aktif
                    </label>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button type="submit" disabled={processing}>{processing ? "Menyimpan…" : submitLabel}</Button>
                {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>}
            </div>
        </form>
    );
}

export default function AiUsageIndex({ keys, envFallback }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState(null);

    return (
        <>
            <Head title="AI Usage — Admin" />
            <AdminLayout title="AI Usage" subtitle="Manajemen API key & monitoring token — dibaca dari DB, .env sebagai fallback.">
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Fallback .env — Groq: {envFallback?.groq ? "terisi" : "kosong"} · Tavily: {envFallback?.tavily ? "terisi" : "kosong"}
                    </p>
                    <Button size="sm" onClick={() => { setEditing(null); setShowCreate((v) => !v); }}>
                        {showCreate ? <X className="size-4" /> : <Plus className="size-4" />}
                        {showCreate ? "Tutup" : "Tambah key"}
                    </Button>
                </div>

                {showCreate && <KeyForm submitLabel="Simpan" onDone={() => setShowCreate(false)} onCancel={() => setShowCreate(false)} />}

                <div className="mt-4 rounded-2xl border border-border bg-card">
                    <div className="hidden overflow-x-auto sm:block">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Provider / Label</th>
                                    <th className="px-4 py-3 font-medium">Key</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Usage</th>
                                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {keys.data.map((k) => (
                                    <Fragment key={k.id}>
                                        <tr className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{k.provider}</p>
                                                <p className="text-xs text-muted-foreground">{k.label}</p>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs">{k.masked}</td>
                                            <td className="px-4 py-3">
                                                <KeyStatus k={k} />
                                                {k.expires_at && (
                                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                                        Exp: {new Date(k.expires_at).toLocaleDateString("id-ID")}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {k.usage_count}×
                                                {k.last_used_at && <span className="block">terakhir {new Date(k.last_used_at).toLocaleDateString("id-ID")}</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <RowActions
                                                    onEdit={() => { setShowCreate(false); setEditing(editing?.id === k.id ? null : k); }}
                                                    onDelete={() => { if (confirm(`Hapus key "${k.label}"?`)) router.delete(`/admin/ai-keys/${k.id}`, { preserveScroll: true }); }}
                                                />
                                            </td>
                                        </tr>
                                        {editing?.id === k.id && (
                                            <tr className="bg-muted/30">
                                                <td colSpan={5} className="px-4 py-4">
                                                    <KeyForm initial={k} submitLabel="Simpan perubahan" onDone={() => setEditing(null)} onCancel={() => setEditing(null)} />
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                                {keys.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                                            Belum ada API key — tambah key baru atau andalkan .env.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="space-y-3 p-3 sm:hidden">
                        {keys.data.map((k) => (
                            <div key={k.id}>
                                <div className="rounded-xl border border-border/80 bg-card p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium">{k.provider}</p>
                                            <p className="text-xs text-muted-foreground">{k.label}</p>
                                        </div>
                                        <KeyStatus k={k} />
                                    </div>
                                    <p className="mt-2 font-mono text-xs">{k.masked}</p>
                                    {k.expires_at && (
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                            Exp: {new Date(k.expires_at).toLocaleDateString("id-ID")}
                                        </p>
                                    )}
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {k.usage_count}×
                                        {k.last_used_at && <> · terakhir {new Date(k.last_used_at).toLocaleDateString("id-ID")}</>}
                                    </p>
                                    <div className="mt-3 border-t border-border/60 pt-2">
                                        <RowActions
                                            align="justify-start"
                                            onEdit={() => { setShowCreate(false); setEditing(editing?.id === k.id ? null : k); }}
                                            onDelete={() => { if (confirm(`Hapus key "${k.label}"?`)) router.delete(`/admin/ai-keys/${k.id}`, { preserveScroll: true }); }}
                                        />
                                    </div>
                                </div>
                                {editing?.id === k.id && (
                                    <div className="mt-2 rounded-xl border border-border/80 bg-muted/20 p-3">
                                        <KeyForm initial={k} submitLabel="Simpan perubahan" onDone={() => setEditing(null)} onCancel={() => setEditing(null)} />
                                    </div>
                                )}
                            </div>
                        ))}
                        {keys.data.length === 0 && (
                            <div className="rounded-xl border border-dashed border-border/80 px-4 py-10 text-center text-sm text-muted-foreground">
                                Belum ada API key — tambah key baru atau andalkan .env.
                            </div>
                        )}
                    </div>
                </div>

                {keys.links && (
                    <div className="flex flex-wrap items-center gap-1.5">
                        {keys.links.map((l, i) => (
                            <Button
                                key={i}
                                size="sm"
                                variant={l.active ? "default" : "outline"}
                                disabled={!l.url}
                                onClick={() => l.url && router.get(l.url, {}, { preserveScroll: true })}
                            >
                                <span dangerouslySetInnerHTML={{ __html: l.label }} />
                            </Button>
                        ))}
                    </div>
                )}
            </AdminLayout>
        </>
    );
}

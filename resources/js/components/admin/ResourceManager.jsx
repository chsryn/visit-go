import { Fragment, useState } from "react";
import { router } from "@inertiajs/react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import LocationPicker from "@/components/admin/LocationPicker";
import { cn } from "@/lib/utils";

const emptyFor = (fields) => {
    const o = {};
    for (const f of fields) {
        o[f.name] = f.default ?? (f.type === "checkbox" ? true : "");
    }
    o.image = null;
    return o;
};

function FieldInput({ field, value, onChange, error }) {
    if (field.type === "textarea") {
        return (
            <Textarea
                rows={4}
                value={value ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        );
    }
    if (field.type === "select") {
        return (
            <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring"
            >
                <option value="">— {field.placeholder ?? "Pilih"} —</option>
                {(field.options ?? []).map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        );
    }
    if (field.type === "checkbox") {
        return (
            <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="size-4 rounded border-input accent-[#715386]"
                />
                {field.checkboxLabel ?? "Aktif"}
            </label>
        );
    }
    return (
        <Input
            type={field.type ?? "text"}
            step={field.step}
            value={value ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

function LocationField({ field, values, onChange }) {
    const latField = field.latField ?? "latitude";
    const lngField = field.lngField ?? "longitude";
    return (
        <LocationPicker
            latitude={values[latField]}
            longitude={values[lngField]}
            onChange={(lat, lng) => {
                onChange(latField, lat);
                onChange(lngField, lng);
            }}
        />
    );
}

function ResourceForm({ fields, initial, existingImageUrl, imageField = "image", submitLabel, onSubmit, onCancel, busy }) {
    const [values, setValues] = useState(initial);
    const [file, setFile] = useState(null);
    const set = (name, v) => setValues((s) => ({ ...s, [name]: v }));

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ ...values, [imageField]: file });
            }}
            className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
        >
            <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                    <div key={f.name} className={cn("space-y-2", (f.full || f.type === "location") && "sm:col-span-2")}>
                        {f.type !== "checkbox" && <Label>{f.label}</Label>}
                        {f.type === "location" ? (
                            <LocationField field={f} values={values} onChange={set} />
                        ) : (
                            <FieldInput field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
                        )}
                        {f.hint && <p className="text-[11px] text-muted-foreground">{f.hint}</p>}
                    </div>
                ))}
                <div className="space-y-2 sm:col-span-2">
                    <ImageUpload existingUrl={existingImageUrl} onFile={setFile} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button type="submit" disabled={busy}>
                    {busy ? "Menyimpan…" : submitLabel}
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Batal
                    </Button>
                )}
            </div>
        </form>
    );
}

/**
 * Generic admin CRUD manager (table + create/edit forms + delete).
 * Keeps the 5 content modules consistent without duplicating code.
 */
export default function ResourceManager({ items, basePath, fields, columns, defaults = {}, imageField = "image", imageUrlKey = null, allowCreate = true }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState(null);
    const [busy, setBusy] = useState(false);
    const rows = items?.data ?? [];
    const urlKey = imageUrlKey ?? `${imageField}_url`;

    const submit = (payload, method, url, done) => {
        setBusy(true);
        const formData = new FormData();
        for (const [k, v] of Object.entries(payload)) {
            if (v === null || v === undefined || v === "") continue;
            if (k === imageField && !(v instanceof File)) continue;
            if (typeof v === "boolean") {
                formData.append(k, v ? "1" : "0");
                continue;
            }
            formData.append(k, v instanceof File ? v : String(v));
        }
        if (method !== "post") formData.append("_method", method);
        router.post(url, formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                setBusy(false);
                done?.();
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Total {items?.total ?? rows.length} data
                </p>
                {allowCreate && (
                    <Button size="sm" onClick={() => { setEditing(null); setShowCreate((v) => !v); }}>
                        {showCreate ? <X className="size-4" /> : <Plus className="size-4" />}
                        {showCreate ? "Tutup" : "Tambah"}
                    </Button>
                )}
            </div>

            {allowCreate && showCreate && (
                <ResourceForm
                    fields={fields}
                    initial={{ ...emptyFor(fields), ...defaults }}
                    busy={busy}
                    imageField={imageField}
                    submitLabel="Simpan"
                    onCancel={() => setShowCreate(false)}
                    onSubmit={(payload) =>
                        submit(payload, "post", basePath, () => setShowCreate(false))
                    }
                />
            )}

            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                            {columns.map((c) => (
                                <th key={c.key} className="px-4 py-3 font-medium">
                                    {c.label}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-right font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <Fragment key={row.id}>
                                <tr className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                                    {columns.map((c) => (
                                        <td key={c.key} className="px-4 py-3 align-top">
                                            {c.render ? c.render(row) : row[c.key]}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1.5">
                                            <button
                                                type="button"
                                                aria-label="Edit"
                                                onClick={() => { setShowCreate(false); setEditing(editing?.id === row.id ? null : row); }}
                                                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                                            >
                                                <Pencil className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Hapus"
                                                onClick={() => {
                                                    if (confirm(`Hapus "${row.name}"?`)) {
                                                        router.delete(`${basePath}/${row.id}`, { preserveScroll: true });
                                                    }
                                                }}
                                                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {editing?.id === row.id && (
                                    <tr key={`${row.id}-edit`} className="bg-muted/30">
                                        <td colSpan={columns.length + 1} className="px-4 py-4">
                                            <ResourceForm
                                                fields={fields}
                                                initial={Object.fromEntries(
                                                    fields.map((f) => [f.name, row[f.name] ?? (f.type === "checkbox" ? true : "")])
                                                )}
                                                existingImageUrl={row[urlKey]}
                                                imageField={imageField}
                                                busy={busy}
                                                submitLabel="Simpan perubahan"
                                                onCancel={() => setEditing(null)}
                                                onSubmit={(payload) =>
                                                    submit(payload, "put", `${basePath}/${row.id}`, () => setEditing(null))
                                                }
                                            />
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-sm text-muted-foreground">
                                    {allowCreate ? "Belum ada data — klik Tambah untuk membuat baru." : "Belum ada data."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {items?.links && (
                <div className="flex flex-wrap items-center gap-1.5">
                    {items.links.map((l, i) => (
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
        </div>
    );
}

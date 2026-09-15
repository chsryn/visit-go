import { Fragment, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Pencil, Plus, Trash2, X, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import GalleryField from "@/components/admin/GalleryField";
import LocationPicker from "@/components/admin/LocationPicker";
import { cn } from "@/lib/utils";

const emptyFor = (fields) => {
    const o = {};
    for (const f of fields) {
        if (f.type === "checkbox-list") o[f.name] = f.default ?? [];
        else
            o[f.name] =
                f.default ??
                (f.type === "checkbox" ? true : f.type === "gallery" ? [] : "");
    }
    o.image = null;
    return o;
};

function FieldInput({ field, value, onChange, error }) {
    if (field.type === "textarea") {
        return (
            <Textarea
                rows={field.rows ?? 4}
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
                onChange={(e) =>
                    onChange(e.target.value === "" ? null : e.target.value)
                }
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
    if (field.type === "checkbox-list") {
        const vals = Array.isArray(value) ? value : [];
        return (
            <div className="space-y-2">
                {(field.options ?? []).length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                        Belum ada kategori — tambah di Kelola Kategori.
                    </p>
                ) : (
                    (field.options ?? []).map((o) => {
                        const checked =
                            vals.includes(o.value) ||
                            vals.includes(String(o.value));
                        return (
                            <label
                                key={o.value}
                                className="flex cursor-pointer items-center gap-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                        const next = e.target.checked
                                            ? [...vals, o.value]
                                            : vals.filter(
                                                  (v) =>
                                                      v !== o.value &&
                                                      String(v) !==
                                                          String(o.value),
                                              );
                                        onChange(next);
                                    }}
                                    className="size-4 rounded border-input accent-[#715386]"
                                />
                                {o.label}
                            </label>
                        );
                    })
                )}
                {field.hint && (
                    <p className="text-[11px] text-muted-foreground">
                        {field.hint}
                    </p>
                )}
            </div>
        );
    }
    if (field.type === "gallery") {
        return (
            <GalleryField
                value={value ?? []}
                onChange={onChange}
                hint={field.hint}
            />
        );
    }
    if (field.readonly) {
        return (
            <div className="flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                {value ?? "—"}
            </div>
        );
    }
    return (
        <Input
            type={field.type ?? "text"}
            step={field.step}
            value={value ?? ""}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(e) => onChange(e.target.value)}
        />
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

function ResourceForm({
    fields,
    initial,
    existingImageUrl,
    imageField = "image",
    submitLabel,
    onSubmit,
    onCancel,
    busy,
    withImageUpload = true,
    errors = {},
}) {
    const [values, setValues] = useState(initial);
    const [file, setFile] = useState(null);
    const set = (name, v) => setValues((s) => ({ ...s, [name]: v }));
    // Error validasi untuk field galeri datang sebagai `gallery_order` / `images.*`
    const errorFor = (f) =>
        errors[f.name] ??
        (f.type === "gallery"
            ? (Object.entries(errors).find(
                  ([k]) => k === "gallery_order" || k.startsWith("images"),
              )?.[1] ?? null)
            : null);

    // Group fields by section
    const sections = {};
    const sidebarFields = [];

    fields.forEach((f) => {
        if (f.visibleWhen && !f.visibleWhen(values)) return;
        if (f.sidebar) {
            sidebarFields.push(f);
        } else {
            const section = f.section || "Umum";
            if (!sections[section]) sections[section] = [];
            sections[section].push(f);
        }
    });

    // For checkbox-list fields, arrange in grid
    const renderCheckboxList = (field, value) => {
        const vals = Array.isArray(value) ? value : [];
        return (
            <div className="space-y-2.5">
                {(field.options ?? []).length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                        Belum ada kategori — tambah di Kelola Kategori.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                        {(field.options ?? []).map((o) => {
                            const checked =
                                vals.includes(o.value) ||
                                vals.includes(String(o.value));
                            return (
                                <label
                                    key={o.value}
                                    className="flex cursor-pointer items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={(e) => {
                                            const next = e.target.checked
                                                ? [...vals, o.value]
                                                : vals.filter(
                                                      (v) =>
                                                          v !== o.value &&
                                                          String(v) !==
                                                              String(o.value),
                                                  );
                                            set(field.name, next);
                                        }}
                                        className="size-4 rounded border-input accent-[#715386]"
                                    />
                                    {o.label}
                                </label>
                            );
                        })}
                    </div>
                )}
                {field.hint && (
                    <p className="text-[11px] text-muted-foreground">
                        {field.hint}
                    </p>
                )}
            </div>
        );
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ ...values, [imageField]: file });
            }}
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
        >
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content (2 columns) */}
                <div className="space-y-6 lg:col-span-2">
                    {Object.entries(sections).map(
                        ([sectionName, sectionFields]) => (
                            <div key={sectionName}>
                                {sectionName !== "Umum" && (
                                    <h3 className="mb-3.5 font-display text-sm font-bold text-foreground">
                                        {sectionName}
                                    </h3>
                                )}

                                {sectionName === "Kategori" ? (
                                    // Special layout for categories
                                    <div className="space-y-3">
                                        {sectionFields.map((f) => (
                                            <div
                                                key={f.name}
                                                className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                                            >
                                                <Label className="text-sm font-semibold text-foreground">
                                                    {f.label}
                                                </Label>
                                                <div className="mt-3">
                                                    {renderCheckboxList(
                                                        f,
                                                        values[f.name],
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : sectionName === "Peta & Lokasi" ? (
                                    // Special layout for location
                                    <div className="space-y-4">
                                        {sectionFields.map((f) =>
                                            f.type === "location" ? (
                                                <div
                                                    key={f.name}
                                                    className="rounded-xl border border-stone-200 overflow-hidden"
                                                >
                                                    <LocationField
                                                        field={f}
                                                        values={values}
                                                        onChange={set}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    key={f.name}
                                                    className="space-y-2"
                                                >
                                                    <Label className="text-xs font-medium text-muted-foreground">
                                                        {f.label}
                                                    </Label>
                                                    <FieldInput
                                                        field={f}
                                                        value={values[f.name]}
                                                        onChange={(v) =>
                                                            set(f.name, v)
                                                        }
                                                        error={errorFor(f)}
                                                    />
                                                    {errorFor(f) && (
                                                        <p className="text-xs font-medium text-destructive">
                                                            {errorFor(f)}
                                                        </p>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    // Standard grid layout for other sections
                                    <div className="space-y-3">
                                        {sectionFields.map((f) => (
                                            <div
                                                key={f.name}
                                                className="space-y-2"
                                            >
                                                {f.type !== "checkbox" && (
                                                    <Label>{f.label}</Label>
                                                )}
                                                {f.type === "location" ? (
                                                    <LocationField
                                                        field={f}
                                                        values={values}
                                                        onChange={set}
                                                    />
                                                ) : (
                                                    <FieldInput
                                                        field={f}
                                                        value={values[f.name]}
                                                        onChange={(v) =>
                                                            set(f.name, v)
                                                        }
                                                        error={errorFor(f)}
                                                    />
                                                )}
                                                {f.hint &&
                                                    f.type !== "gallery" && (
                                                        <p className="text-[11px] text-muted-foreground">
                                                            {f.hint}
                                                        </p>
                                                    )}
                                                {errorFor(f) && (
                                                    <p className="text-xs font-medium text-destructive">
                                                        {errorFor(f)}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ),
                    )}
                </div>

                {/* Sidebar (1 column) */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Image Upload */}
                    {withImageUpload && (
                        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                            <h3 className="mb-3 font-display text-sm font-bold text-foreground">
                                Gambar
                            </h3>
                            <ImageUpload
                                existingUrl={existingImageUrl}
                                onFile={setFile}
                                error={errors[imageField]}
                            />
                        </div>
                    )}

                    {/* Metadata fields */}
                    {sidebarFields.length > 0 && (
                        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                            <h3 className="mb-3 font-display text-sm font-bold text-foreground">
                                Metadata
                            </h3>
                            <div className="space-y-3">
                                {sidebarFields.map((f) => (
                                    <div key={f.name}>
                                        {f.type !== "checkbox" && (
                                            <Label className="text-sm">
                                                {f.label}
                                            </Label>
                                        )}
                                        <div
                                            className={
                                                f.type !== "checkbox"
                                                    ? "mt-1.5"
                                                    : ""
                                            }
                                        >
                                            <FieldInput
                                                field={f}
                                                value={values[f.name]}
                                                onChange={(v) => set(f.name, v)}
                                                error={errorFor(f)}
                                            />
                                        </div>
                                        {f.hint && f.type !== "gallery" && (
                                            <p className="mt-1 text-[11px] text-muted-foreground">
                                                {f.hint}
                                            </p>
                                        )}
                                        {errorFor(f) && (
                                            <p className="text-xs font-medium text-destructive">
                                                {errorFor(f)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                        <Button
                            type="submit"
                            disabled={busy}
                            className="w-full"
                        >
                            {busy ? "Menyimpan…" : submitLabel}
                        </Button>
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                className="w-full hover:bg-primary/10 hover:text-primary"
                            >
                                Batal
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

/**
 * Generic admin CRUD manager (table + create/edit forms + delete).
 * Keeps the 5 content modules consistent without duplicating code.
 */
export default function ResourceManager({
    items,
    basePath,
    fields,
    columns,
    defaults = {},
    imageField = "image",
    imageUrlKey = null,
    allowCreate = true,
    withImageUpload = true,
}) {
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState(null);
    const [busy, setBusy] = useState(false);
    const rows = items?.data ?? [];
    const urlKey = imageUrlKey ?? `${imageField}_url`;

    const submit = (payload, method, url, done) => {
        setBusy(true);
        const formData = new FormData();
        for (const [k, v] of Object.entries(payload)) {
            const field = fields.find((f) => f.name === k);
            if (field?.type === "gallery") {
                // Kirim file baru + urutan (termasuk posisi sampul di index 0)
                const order = [];
                let newIdx = 0;
                for (const it of v ?? []) {
                    if (it.kind === "new" && it.file instanceof File) {
                        formData.append("images[]", it.file);
                        order.push({ kind: "new", index: newIdx++ });
                    } else if (it.kind === "cover") {
                        order.push({ kind: "cover" });
                    } else if (it.kind === "gallery" && it.id) {
                        order.push({ kind: "gallery", id: it.id });
                    }
                }
                formData.append("gallery_order", JSON.stringify(order));
                continue;
            }
            if (field?.type === "checkbox-list") {
                if (Array.isArray(v)) {
                    for (const id of v) formData.append(`${k}[]`, String(id));
                }
                continue;
            }
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
            // Form hanya ditutup bila sukses — saat validasi gagal, error tampil dan form tetap terbuka
            onSuccess: () => done?.(),
            onFinish: () => setBusy(false),
        });
    };
    const { errors } = usePage().props;
    const errorList = Object.values(errors ?? {});

    return (
        <div className="space-y-4">
            {errorList.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <p className="flex items-center gap-2 font-medium">
                        <CircleAlert className="size-4" /> Gagal menyimpan —
                        perbaiki berikut:
                    </p>
                    <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
                        {errorList.map((msg, i) => (
                            <li key={i}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Total {items?.total ?? rows.length} data
                </p>
                {allowCreate && (
                    <Button
                        size="sm"
                        onClick={() => {
                            setEditing(null);
                            setShowCreate((v) => !v);
                        }}
                    >
                        {showCreate ? (
                            <X className="size-4" />
                        ) : (
                            <Plus className="size-4" />
                        )}
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
                    withImageUpload={withImageUpload}
                    errors={errors}
                    submitLabel="Simpan"
                    onCancel={() => setShowCreate(false)}
                    onSubmit={(payload) =>
                        submit(payload, "post", basePath, () =>
                            setShowCreate(false),
                        )
                    }
                />
            )}

            <div className="rounded-2xl border border-border bg-card">
                <div className="hidden overflow-x-auto sm:block">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                                {columns.map((c) => (
                                    <th
                                        key={c.key}
                                        className="px-4 py-3 font-medium"
                                    >
                                        {c.label}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right font-medium">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <Fragment key={row.id}>
                                    <tr className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                                        {columns.map((c) => (
                                            <td
                                                key={c.key}
                                                className="px-4 py-3 align-top"
                                            >
                                                {c.render
                                                    ? c.render(row)
                                                    : row[c.key]}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3">
                                            <RowActions
                                                onEdit={() => {
                                                    setShowCreate(false);
                                                    setEditing(
                                                        editing?.id === row.id
                                                            ? null
                                                            : row,
                                                    );
                                                }}
                                                onDelete={() => {
                                                    if (
                                                        confirm(
                                                            `Hapus "${row.name}"?`,
                                                        )
                                                    )
                                                        router.delete(
                                                            `${basePath}/${row.id}`,
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        );
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    {editing?.id === row.id && (
                                        <tr
                                            key={`${row.id}-edit`}
                                            className="bg-muted/30"
                                        >
                                            <td
                                                colSpan={columns.length + 1}
                                                className="px-4 py-4"
                                            >
                                                <ResourceForm
                                                    fields={fields}
                                                    initial={Object.fromEntries(
                                                        fields.map((f) => [
                                                            f.name,
                                                            typeof f.initial ===
                                                            "function"
                                                                ? f.initial(row)
                                                                : (row[
                                                                      f.name
                                                                  ] ??
                                                                  (f.type ===
                                                                  "checkbox"
                                                                      ? true
                                                                      : f.type ===
                                                                              "checkbox-list" ||
                                                                          f.type ===
                                                                              "gallery"
                                                                        ? []
                                                                        : "")),
                                                        ]),
                                                    )}
                                                    existingImageUrl={
                                                        row[urlKey]
                                                    }
                                                    imageField={imageField}
                                                    withImageUpload={
                                                        withImageUpload
                                                    }
                                                    errors={errors}
                                                    busy={busy}
                                                    submitLabel="Simpan perubahan"
                                                    onCancel={() =>
                                                        setEditing(null)
                                                    }
                                                    onSubmit={(payload) =>
                                                        submit(
                                                            payload,
                                                            "put",
                                                            `${basePath}/${row.id}`,
                                                            () =>
                                                                setEditing(
                                                                    null,
                                                                ),
                                                        )
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                            {rows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={columns.length + 1}
                                        className="px-4 py-12 text-center text-sm text-muted-foreground"
                                    >
                                        {allowCreate
                                            ? "Belum ada data — klik Tambah untuk membuat baru."
                                            : "Belum ada data."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="space-y-3 p-3 sm:hidden">
                    {rows.map((row) => (
                        <div key={row.id}>
                            <div className="rounded-xl border border-border/80 bg-card p-3">
                                <div className="space-y-2.5">
                                    {columns.map((c) => (
                                        <div key={c.key}>
                                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                                {c.label}
                                            </p>
                                            <div className="mt-0.5 text-sm">
                                                {c.render
                                                    ? c.render(row)
                                                    : (row[c.key] ?? "—")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 border-t border-border/60 pt-2">
                                    <RowActions
                                        align="justify-start"
                                        onEdit={() => {
                                            setShowCreate(false);
                                            setEditing(
                                                editing?.id === row.id
                                                    ? null
                                                    : row,
                                            );
                                        }}
                                        onDelete={() => {
                                            if (confirm(`Hapus "${row.name}"?`))
                                                router.delete(
                                                    `${basePath}/${row.id}`,
                                                    { preserveScroll: true },
                                                );
                                        }}
                                    />
                                </div>
                            </div>
                            {editing?.id === row.id && (
                                <div className="mt-2 rounded-xl border border-border/80 bg-muted/20 p-3">
                                    <ResourceForm
                                        fields={fields}
                                        initial={Object.fromEntries(
                                            fields.map((f) => [
                                                f.name,
                                                typeof f.initial === "function"
                                                    ? f.initial(row)
                                                    : (row[f.name] ??
                                                      (f.type === "checkbox"
                                                          ? true
                                                          : f.type ===
                                                                  "checkbox-list" ||
                                                              f.type ===
                                                                  "gallery"
                                                            ? []
                                                            : "")),
                                            ]),
                                        )}
                                        existingImageUrl={row[urlKey]}
                                        imageField={imageField}
                                        withImageUpload={withImageUpload}
                                        errors={errors}
                                        busy={busy}
                                        submitLabel="Simpan perubahan"
                                        onCancel={() => setEditing(null)}
                                        onSubmit={(payload) =>
                                            submit(
                                                payload,
                                                "put",
                                                `${basePath}/${row.id}`,
                                                () => setEditing(null),
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    {rows.length === 0 && (
                        <div className="rounded-xl border border-dashed border-border/80 px-4 py-10 text-center text-sm text-muted-foreground">
                            {allowCreate
                                ? "Belum ada data — klik Tambah untuk membuat baru."
                                : "Belum ada data."}
                        </div>
                    )}
                </div>
            </div>

            {items?.links && (
                <div className="flex flex-wrap items-center gap-1.5">
                    {items.links.map((l, i) => (
                        <Button
                            key={i}
                            size="sm"
                            variant={l.active ? "default" : "outline"}
                            disabled={!l.url}
                            className={
                                l.active
                                    ? ""
                                    : "hover:bg-primary/10 hover:text-primary"
                            }
                            onClick={() =>
                                l.url &&
                                router.get(l.url, {}, { preserveScroll: true })
                            }
                        >
                            <span
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}

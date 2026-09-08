# Issue: Admin Dashboard & Database Restructuring

> Planning document — instruksi high-level untuk implementasi oleh programmer / model.

---

## 1. Login Admin

**Referensi UI:** `free-react-tailwind-admin-dashboard-main/src/pages/AuthPages/SignIn.tsx` & `src/components/auth/SignInForm.tsx`

- Konversi komponen SignIn dari **TSX → JSX** dan integrasikan ke Inertia.
- Buat halaman `resources/js/Pages/Admin/Auth/SignIn.jsx` — adaptasi layout & form dari template.
- Backend: buat `AuthController` dengan method `login` / `logout`, gunakan Laravel session auth (`Auth::attempt`).
- Tambahkan middleware `auth` pada semua route `/admin/*`.
- Route: `GET /admin/login` → form, `POST /admin/login` → proses, `POST /admin/logout`.

---

## 2. Sidebar Admin

**Referensi UI:** `free-react-tailwind-admin-dashboard-main/src/layout/AppSidebar.tsx`

Buat layout admin (`resources/js/Layouts/AdminLayout.jsx`) dengan sidebar yang berisi menu:

| # | Menu | Sub-menu | Keterangan |
|---|------|----------|------------|
| 1 | **Destination** | Sub-kategori dinamis dari tabel `categories` (misal: Pegunungan, Laut, Buatan) | Accordion / collapsible, data grouping per category |
| 2 | **Budaya** | — | CRUD tabel `budayas` |
| 3 | **Kuliner** | — | CRUD tabel `kuliners` |
| 4 | **Kerajinan** | — | CRUD tabel `kerajinans` (sudah ada page stub) |
| 5 | **Event** | — | CRUD tabel `events` (sudah ada) |
| 6 | **AI Usage** | — | Manajemen API key & monitoring token |
| 7 | **User Profile** | — | Profil admin |
| 8 | **Maps** | — | Peta semua lokasi |

> **Catatan:** Belum perlu implementasi logika CRUD di tahap ini — cukup halaman kosong + sidebar navigasi.

---

## 3. Database — Tabel Baru & Perubahan

### 3a. Tabel `budayas` (BARU)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigIncrements | PK |
| name | string | |
| slug | string, unique | |
| body | text | Deskripsi |
| image | string, nullable | Path file upload |
| alt | string, nullable | |
| latitude | decimal(10,7) | Ganti dari string lokasi |
| longitude | decimal(10,7) | |
| jam_buka | time | Jam operasional mulai |
| jam_tutup | time | Jam operasional selesai |
| is_active | boolean, default true | |
| timestamps | | |

### 3b. Tabel `kuliners` (BARU)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigIncrements | PK |
| name | string | |
| slug | string, unique | |
| body | text | |
| image | string, nullable | Path file upload |
| alt | string, nullable | |
| latitude | decimal(10,7) | |
| longitude | decimal(10,7) | |
| harga | integer | Harga dalam rupiah |
| is_active | boolean, default true | |
| timestamps | | |

### 3c. Modifikasi tabel `destinasis`

- **Hapus** kolom `category` (string) — relasi akan pakai FK ke `categories`.
- **Tambah** `category_id` → foreign key ke `categories.id`.
- **Ganti** lokasi string (jika ada) menjadi `latitude` decimal(10,7) & `longitude` decimal(10,7).
- **Tambah** kolom `image` sudah ada, pastikan support upload.

### 3d. Modifikasi tabel `events`

- **Ganti** kolom `location` (string) → `latitude` decimal(10,7) & `longitude` decimal(10,7).
- Tambah `location_name` (string) untuk label display.

### 3e. Tabel `categories` — review

- Tabel `categories` sudah ada. Digunakan sebagai **sub-kategori Destination** di FE (Pegunungan, Laut, Buatan).
- `destinasis.category_id` → FK ke `categories.id`.
- Tidak perlu perubahan schema, cukup pastikan relasi Eloquent benar.

### 3f. Tabel `kerajinans` — cek existing

- Cek apakah migration sudah ada. Jika belum, buat dengan schema mirip `budayas` (tanpa jam operasional, tanpa harga).

| Kolom | Tipe |
|-------|------|
| id | bigIncrements |
| name | string |
| slug | string, unique |
| body | text |
| image | string, nullable |
| alt | string, nullable |
| latitude | decimal(10,7) |
| longitude | decimal(10,7) |
| is_active | boolean, default true |
| timestamps | |

---

## 4. Upload Gambar

- Gunakan Laravel filesystem (`storage/app/public`) + symlink.
- Setiap modul (destinasi, budaya, kuliner, kerajinan, event) support single image upload.
- FE: komponen reusable `ImageUpload.jsx` — preview + upload via Inertia form.

---

## 5. AI Usage & API Key Management

Buat fitur di sidebar **AI Usage** untuk:

### 5a. Tabel `ai_api_keys` (BARU)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | bigIncrements | PK |
| provider | string | claude, grok, tavily, dll |
| label | string | Nama label untuk identifikasi |
| api_key | text, encrypted | Key disimpan terenkripsi |
| is_active | boolean, default true | |
| expires_at | datetime, nullable | Tanggal expired key |
| last_used_at | datetime, nullable | Terakhir digunakan |
| usage_count | integer, default 0 | Berapa kali dipakai |
| timestamps | | |

### 5b. Halaman Admin

- Tabel daftar API key: provider, label, status (active/expired), last used, usage count.
- Form tambah/edit key baru — pilih provider, isi label & key.
- Indikator visual jika key mendekati/sudah expired.
- Baca key aktif dari tabel ini (bukan `.env`) untuk service AI yang sudah ada (`AiPlannerService`, `ChatbotController`).

---

## 6. User Profile

**Referensi UI:** `free-react-tailwind-admin-dashboard-main/src/pages/UserProfiles.tsx` & `src/components/UserProfile/`

- Konversi dari TSX → JSX, integrasikan ke Inertia.
- Halaman: `resources/js/Pages/Admin/Profile.jsx`.
- Fitur: lihat & edit nama, email, avatar, ganti password.

---

## 7. Maps — Overview Semua Lokasi

- Halaman `resources/js/Pages/Admin/Maps.jsx`.
- Gunakan **Leaflet.js** (react-leaflet) — gratis, tanpa API key.
- Tampilkan semua pin dari: destinasi, budaya, kuliner, kerajinan, event.
- Setiap pin: icon berbeda per tipe, klik → popup nama + link ke detail.
- Backend: satu endpoint `/admin/api/map-points` → gabung semua latitude/longitude dari semua tabel.

---

## 8. Urutan Implementasi (Rekomendasi)

```
1. Login Admin + Middleware Auth
2. Layout Admin + Sidebar (halaman kosong)
3. Migration & Model (budayas, kuliners, kerajinans, modifikasi destinasis & events)
4. CRUD Destination + sub-kategori (categories)
5. CRUD Budaya, Kuliner, Kerajinan, Event
6. Upload Gambar (komponen reusable)
7. AI Usage & API Key Management
8. User Profile
9. Maps Overview
```

---

## Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React (JSX) + Inertia.js + TailwindCSS |
| Backend | Laravel (PHP) |
| Auth | Laravel session auth |
| Maps | Leaflet.js / react-leaflet |
| Template referensi | `free-react-tailwind-admin-dashboard-main` |

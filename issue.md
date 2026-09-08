# Issue: Kategori Destinasi Dinamis (Pegunungan, Laut, Buatan)

> Planning document — instruksi high-level untuk programmer / model implementor.
> Stack: **React (JSX) + Inertia.js** untuk FE, **Laravel** untuk backend.

---

## 1. Tujuan

Halaman **Destination** saat ini menampilkan kategori secara hardcode. Ubah agar kategori menjadi **data dinamis dari database**, dengan struktur:

- **Destination** sebagai parent
- **Category** sebagai child: `Pegunungan`, `Laut`, `Buatan` (data awal, bisa bertambah/berubah lewat admin)

Menambah kategori baru di database harus otomatis tampil di FE tanpa ubah kode.

---

## 2. Backend (Laravel)

- Siapkan tabel `categories` sebagai child dari Destination: kolom seperlunya saja (nama, slug unik, deskripsi, banner opsional, status aktif, penanda parent `destination`).
- Relasikan `destinasis` ke `categories` (satu destinasi = satu kategori).
- Sediakan endpoint/API untuk FE: daftar kategori aktif + destinasi per kategori (sertakan total per kategori untuk tampilan kartu).
- Sediakan seeder awal berisi 3 kategori: Pegunungan, Laut, Buatan.
- Pastikan CRUD kategori tersedia di panel admin (tambah/edit/nonaktifkan).

---

## 3. Frontend (React JSX)

- Halaman Destination mengambil daftar kategori dari backend (jangan hardcode).
- Tampilkan 3 kartu/tab kategori (Pegunungan, Laut, Buatan) — jumlah dan isinya mengikuti data.
- Klik kategori → tampilkan daftar destinasi milik kategori tersebut (filter via slug kategori).
- Sediakan state kosong yang ramah ("belum ada destinasi di kategori ini") dan loading state saat fetch.

---

## 4. Kriteria Selesai

- [ ] Kategori Destination 100% dari database, tidak ada nama kategori hardcode di FE
- [ ] Tiga kategori awal tampil: Pegunungan, Laut, Buatan
- [ ] Tambah kategori baru via admin langsung tampil di FE
- [ ] Tiap kategori menampilkan destinasi yang benar + jumlahnya
- [ ] Nonaktifkan kategori → hilang dari FE tanpa error

---

## 5. Di Luar Scope

- Perubahan desain/tema tampilan
- CRUD destinasi itu sendiri (dianggap sudah ada)

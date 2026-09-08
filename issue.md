# Issue: Pengembangan AI Assistance Rekomendasi Perjalanan (Visit-Go)

## 📌 Deskripsi Fitur
Pengembangan modul **AI Assistance** yang berfungsi menghasilkan rekomendasi rencana perjalanan (*itinerary*) secara cerdas dan terpersonalisasi berdasarkan parameter input pengguna (durasi, budget, minat, lokasi, dan preferensi makanan).

---

## 🎯 Parameter Input Utama
Sistem AI akan menerima parameter input dari pengguna:
1. **Durasi (Duration):** Lama perjalanan (contoh: 1 hari, 3 hari 2 malam atau rentang waktu dinamis dengan max 30 hari).
2. **Budget (Anggaran):** Alokasi dana perjalanan (contoh: Backpacker/Hemat, Sedang, Mewah, atau rentang nominal).
3. **Minat (Interests):** Kategori wisata favorit (contoh: Alam, Sejarah & Budaya, Petualangan, Kuliner, Belanja, Relaksasi).
4. **Lokasi (Location):** area destinasi tujuan (contoh:laut, gunung, atau preferensi lain).
5. **Preferensi Makanan (Food Preferences):** Restriksi atau preferensi kuliner (contoh: Halal, Vegetarian, Seafood, Kuliner Lokal, Bebas Alergen).

---

## 🏗️ Alokasi Tugas & Komponen High-Level

### Task 1: UI / Antarmuka Form Input (Frontend)
- Buat antarmuka form interaktif yang intuitif untuk menangkap 5 parameter input pengguna.
- Tambahkan elemen UI pendukung seperti *slider*, *checkbox/chip selection*, dan *dropdown pencarian lokasi*.
- Sediakan status indikator pemrosesan (*loading state/spinner/skeleton*) saat AI sedang melakukan kalkulasi rekomendasi.

### Task 2: Service Integration & Prompt Engineering (Backend)
- Buat *Service Layer* khusus (misalnya `AiRecommendationService`) untuk mengelola koneksi ke LLM API (seperti OpenAI, Gemini, Claude, Groq, Tavily).
- Rancang **System & User Prompt**:
  - Konfigurasikan AI agar bertindak sebagai *travel planner* profesional.
  - Sertakan instruksi format keluaran wajib dalam bentuk **JSON Terstruktur** (misal: JSON Schema/Structured Output) agar mudah diparse backend.
- Kelola API Key & batas *rate limit* melalui `.env`.

### Task 3: Pengayaan Context & Data Lokal (Knowledge & Database)
- Integrasikan data destinasi lokal yang tersimpan di database (`Destinasi`, `Event`, `Knowledge`) sebagai konteks acuan AI jika tersedia jika tidak ada maka buatkan db nya.
- Pastikan AI mengutamakan tempat wisata dan kuliner riil yang ada dalam cakupan database aplikasi atau bisa menambahkan tempat yang belum ada di database aplikasi jika tidak ada.

### Task 4: Parsing Output & Penyajian Rekomendasi (Presenter / View)
- Menerima dan memparse hasil keluaran AI JSON menjadi tampilan *Itinerary* interaktif.
- Struktur tampilan rekomendasi memuat:
  - Lokasi, nama tempat wisata dan gambar
  - Rencana perjalanan harian (*Day-by-Day timeline*: Pagi, Siang, Malam).
  - Estimasi pembagian alokasi budget (Akomodasi, Tiket Masuk, Makan, Transportasi).
  - Rekomendasi tempat makan spesifik sesuai preferensi makanan user.
- Sediakan mekanisme *fallback* dan penanganan *error* jika koneksi API terputus atau output gagal diparse.

### Task 5: Fitur Tambahan & Simpan Itinerary
- Opsi simpan rekomendasi ke profil pengguna (*Save Itinerary*).
- Opsi bagikan (*Share Link*) atau cetak/unduh ringkasan perjalanan.

---

## 🔄 High-Level Workflow (Alur Kerja Sistem)
1. **User Request**: User mengisi 5 parameter pada form dan menekan tombol "Buat Rekomendasi".
2. **Validation & Context Prep**: Backend memvalidasi input, lalu menyusun prompt beserta konteks lokasi/destinasi pendukung.
3. **AI Execution**: Backend memanggil LLM Service untuk memproses prompt.
4. **Response Parsing**: Backend memparse respons terstruktur (JSON) dari LLM Service.
5. **Render Results**: Frontend menampilkan rekomendasi perjalanan berupa garis waktu harian , lokasi dan estimasi biaya.

---

## ✅ Acceptance Criteria (Kriteria Keberhasilan)
- [ ] Form dapat menerima 5 parameter (Durasi, Budget, Minat, Lokasi, Preferensi Makanan) dengan validasi yang pas.
- [ ] AI berhasil menghasilkan rencana perjalanan yang relevan dengan kelima parameter tersebut.
- [ ] Rekomendasi makanan secara ketat mematuhi preferensi makanan yang dipilih pengguna.
- [ ] Respons AI berformat terstruktur (JSON) dan ditampilkan dengan rapi di antarmuka pengguna.
- [ ] Terdapat penanganan error yang ramah pengguna apabila LLM API mengalami gangguan.

---

## 💡 Panduan untuk Executer / Model Pelaksana
- Fokus utama implementasi adalah keandalan prompt (Prompt Engineering) agar LLM selalu mengembalikan JSON yang valid.
- Pastikan validasi input dilakukan di sisi client dan server sebelum dikirim ke LLM API.
- Gunakan struktur kode yang modular agar mudah mengganti provider LLM di kemudian hari.

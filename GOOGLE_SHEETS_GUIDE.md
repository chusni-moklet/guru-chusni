# 📊 Panduan Integrasi Google Spreadsheet & Google Apps Script
### Database Gratis & Real-Time untuk Website Profil Pendidik (`profilku`)

Website profil ini telah dilengkapi dengan integrasi database **Google Spreadsheet** melalui **Google Apps Script (GAS)** REST API. Anda dapat mengubah data profil, modul ajar, prestasi, foto galeri, linimasa karir, hingga melihat pesan masuk formulir langsung dari **Dashboard Admin (`admin-panel-secret-x9v2.html`)** maupun dari Spreadsheet Google Anda!

---

## ⚡ Langkah Mudah Setup (Hanya 3 Menit)

### Langkah 1: Buat Google Spreadsheet Baru
1. Buka peramban dan akses alamat: [sheets.new](https://sheets.new) (atau buat Google Spreadsheet baru di Google Drive Anda).
2. Beri nama spreadsheet Anda di pojok kiri atas, contoh: **Database Profil Pendidik**.

---

### Langkah 2: Buka Editor Google Apps Script
1. Pada menu navigasi atas Google Sheets, klik **Extensions (Ekstensi)** &rarr; pilih **Apps Script**.
2. Anda akan diarahkan ke editor kode Google Apps Script.
3. Hapus seluruh isi kode bawaan di dalam berkas `Code.gs`.

---

### Langkah 3: Salin Kode Backend (`Code.gs`)
1. Buka berkas `google-apps-script/Code.gs` yang ada di proyek ini.
2. Salin (*copy*) seluruh kode di dalamnya.
3. Tempelkan (*paste*) ke dalam editor `Code.gs` di Apps Script.
4. Klik tombol **Save (Simpan)** (ikon disket) atau tekan `Ctrl + S` / `Cmd + S`.

---

### Langkah 4: Jalankan Inisialisasi Database Otomatis
1. Di bagian toolbar atas editor Apps Script, cari menu dropdown fungsi (biasanya tertulis `myFunction`).
2. Ubah dropdown tersebut menjadi **`setupDatabase`**.
3. Klik tombol **Run (Jalankan)** (ikon segitiga / play).
4. **Persetujuan Izin Google:**
   - Google akan meminta izin akses (*Authorization Required*). Klik **Review Permissions**.
   - Pilih akun Google Anda.
   - Jika muncul peringatan *"Google hasn't verified this app"*, klik tautan kecil **Advanced (Lanjutan)** di kiri bawah, lalu klik **Go to Untitled project (unsafe)** / **Buka project**.
   - Klik **Allow (Izinkan)**.
5. Tunggu 5 detik hingga Execution log menampilkan pesan:
   `"Setup Berhasil! Semua sheet database telah dibuat."`
6. Periksa kembali Google Spreadsheet Anda, kini otomatis telah terbentuk 12 Sheet:
   - `Config` (Pengaturan profil, teks hero, sosial media)
   - `Modul` (Modul ajar, LKPD, slide, bank soal)
   - `Prestasi` (Penghargaan, sertifikasi, buku)
   - `Jadwal` (Jadwal KBM & bimbingan Senin - Jumat)
   - `Galeri` (Dokumentasi foto kegiatan)
   - `Testimoni` (Ulasan siswa, rekan, kepala sekolah)
   - `Kompetensi` (Mata pelajaran & fase kurikulum)
   - `EdTech` (Platform digital edukasi)
   - `Timeline` (Linimasa pendidikan & karir)
   - `FAQ` (Tanya jawab materi)
   - `PesanMasuk` (Pesan masuk dari form website)
   - `Users` (Akun login admin: `admin` / `admin123`)

---

### Langkah 5: Terapkan Sebagai Aplikasi Web (Deploy as Web App)
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy (Terapkan)** &rarr; pilih **New deployment (Penerapan baru)**.
2. Klik ikon gerigi ⚙️ di sebelah kiri *Select type*, lalu pilih **Web App (Aplikasi Web)**.
3. Isi kolom konfigurasi sebagai berikut:
   - **Description:** `API Database Profilku v1`
   - **Execute as:** **Me (email Anda sendiri)**
   - **Who has access:** **Anyone (Siapa saja)** ⚠️ *(Wajib dipilih agar website publik Anda dapat membaca data dan pengunjung dapat mengirim form)*.
4. Klik tombol **Deploy (Terapkan)**.
5. Salin URL yang dihasilkan pada bagian **Web App URL** (alamat yang berakhiran `/exec`).
   *Contoh format URL:*
   `https://script.google.com/macros/s/AKfycbx_AbCdEf123456789.../exec`

---

### Langkah 6: Hubungkan ke Dashboard Admin Website
1. Buka file `admin-panel-secret-x9v2.html` di browser Anda (URL disembunyikan untuk keamanan).
2. Masuk menggunakan akun admin:
   - **Username:** `admin`
   - **Password:** `password` (atau `admin123`)
3. Setelah masuk ke Dashboard, klik menu **Database & Spreadsheet** (ikon slider di sidebar).
4. Tempelkan URL Web App yang Anda salin tadi ke kolom **URL Web App Google Apps Script**.
5. Klik **Simpan URL**, kemudian klik **Uji Koneksi API**.
6. Sistem akan melakukan ping test dan menampilkan indikator hijau **🟢 Spreadsheet Aktif**.
7. Klik tombol **Sinkronkan Sekarang** di header atas untuk mengambil data awal.

**Selesai!** Kini website profil pendidik Anda telah 100% terhubung secara live ke Google Spreadsheet.

---

## 🔒 Manajemen Keamanan & Kredensial

1. **Ubah Kata Sandi:**
   Anda dapat mengubah kata sandi administrator kapan saja melalui menu **Pengaturan & Keamanan** di `admin-panel-secret-x9v2.html`. Perubahan password akan otomatis disinkronkan ke sheet `Users` di spreadsheet Anda.
2. **Backup Mandiri (JSON):**
   Pada tab Pengaturan, terdapat tombol **Ekspor Backup JSON**. Anda dapat mengunduh salinan cadangan seluruh database dalam 1 file JSON kapan pun dibutuhkan.
3. **Penyimpanan Lokal Otomatis (Offline-First):**
   Website ini menerapkan sistem *offline-first*. Data disimpan secara instan di `localStorage` peramban sehingga halaman terbuka dengan kecepatan kilat (0 detik tanpa loading lama) dan menyinkronkan data di latar belakang.

---

## ❓ FAQ & Troubleshooting

| Pertanyaan / Kendala | Solusi |
|---|---|
| **Data tidak berubah setelah diedit di spreadsheet?** | Buka `admin-panel-secret-x9v2.html` lalu klik tombol **Sinkronkan** di header atas, atau muat ulang halaman dengan menekan `Ctrl + F5` / `Cmd + Shift + R`. |
| **Koneksi bertuliskan "CORS Error" atau gagal ping?** | Pastikan saat melakukan Deploy Apps Script, opsi **Who has access** diatur ke **Anyone (Siapa saja)**, bukan *Only Myself*. Jika baru saja mengubah pengaturan, lakukan Deploy ulang via *Manage deployments* &rarr; *New version*. |
| **Pesan form kontak tidak masuk ke WhatsApp?** | Pastikan nomor WhatsApp di menu Profil & Identitas diawali dengan kode negara **62** tanpa spasi atau tanda plus (contoh: `6281234567890`). |
| **Bagaimana jika lupa password?** | Buka Google Spreadsheet Anda, buka sheet `Users`, lalu ubah kolom `Password` pada baris user `admin`. Atau gunakan kredensial lokal bawaan: `admin` / `password`. |

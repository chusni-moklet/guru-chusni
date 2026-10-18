# 🎓 Website Profil Guru & Pendidik Indonesia Modern 

Website profil profesional dan interaktif untuk guru / pendidik Indonesia. Didesain secara elegan, modern, responsif, dan siap disesuaikan (*customizable*) untuk portofolio digital, apresiasi Guru Penggerak, media berbagi Modul Ajar Kurikulum Merdeka, serta kanal komunikasi siswa dan orang tua.

--- 

## ✨ Fitur Unggulan

1. **Identitas & Filosofi Pendidikan**
   - Biodata resmi pendidik (NIP, NUPTK, Unit Kerja, Pendidikan, Status Sertifikasi).
   - Nilai dan filosofi mengajar berpusat pada murid (Ki Hajar Dewantara & Kurikulum Merdeka).
   - Linimasa (*timeline*) riwayat pendidikan, karir, dan milestone kepemimpinan sekolah.

2. **Kompetensi & Ekosistem EdTech**
   - Rincian mata pelajaran (Fase E & F, Matematika Wajib & Peminatan, Informatika, Olimpiade Sains).
   - Pengenalan perangkat lunak edukasi interaktif (GeoGebra, Google Classroom, Canva, Quizizz, Python).

3. **Pusat Sumber Belajar & Modul Ajar (OER)**
   - Fitur **Pencarian Langsung (Live Search)** berdasarkan kata kunci materi.
   - Filter kategori materi: *Semua*, *Modul Ajar*, *LKPD Interaktif*, *Slide Presentasi*, *Bank Soal UTBK*.
   - **Modal Pratinjau**: Pop-up interaktif rincian Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), dan dimensi Profil Pelajar Pancasila (P5).

4. **Prestasi & Jejak Penghargaan**
   - Showcase piala/medali lomba guru inovatif, sertifikasi pendidik, publikasi buku ber-ISBN, dan pembinaan olimpiade sains.

5. **Galeri Dokumentasi & Lightbox**
   - Dokumentasi foto suasana kelas, pameran gelar karya P5, dan workshop guru.
   - Filter kategori foto dan tampilan perbesar gambar (*lightbox preview*).

6. **Layanan Tanya Guru & Integrasi WhatsApp**
   - Formulir pesan interaktif dengan validasi status pengirim.
   - Tombol **"Teruskan ke WhatsApp"** yang otomatis memformat data form menjadi pesan chat WhatsApp terstruktur dan rapi.
   - FAQ Accordion untuk pertanyaan seputar materi dan bimbingan belajar.

9. **Fitur Antarmuka Modern**
   - **Dark Mode & Light Mode**: Tombol pengganti tema dengan deteksi otomatis dan penyimpanan preferensi di `localStorage`.
   - **Tombol Cetak Portofolio**: Opsi print-ready untuk mencetak profil ringkas langsung ke PDF atau printer kertas.
   - **Floating WhatsApp & Back to Top**: Akses cepat konsultasi dan navigasi ke atas halaman.
   - **100% Responsif**: Tampilan optimal di smartphone (HP), tablet, laptop, dan monitor desktop.

---

## 📁 Struktur Berkas

```
profilku/
│
├── index.html                 # Halaman utama profil pendidik
├── admin.html                 # Dashboard Admin & manajemen data
├── css/
│   ├── style.css              # Styling halaman utama (light/dark mode)
│   └── admin.css              # Styling modern dashboard admin
├── js/
│   ├── db.js                  # Data layer, local cache & sinkronisasi Google Apps Script
│   ├── main.js                # Interaktivitas halaman utama & render dinamis
│   └── admin.js               # Logika CRUD, autentikasi admin & uji koneksi API
├── google-apps-script/
│   └── Code.gs                # Kode backend Google Apps Script untuk Google Spreadsheet
├── GOOGLE_SHEETS_GUIDE.md     # Panduan lengkap integrasi Google Spreadsheet
└── README.md                  # Dokumentasi & panduan penggunaan
```

---

## 🔐 Dashboard Admin & Manajemen Database

Website ini telah dilengkapi **Portal Admin Modern (`admin.html`)** yang memungkinkan pendidik mengelola seluruh konten secara visual tanpa harus mengedit kode HTML secara manual:

- **Akses Admin:** Buka `admin.html` atau klik tombol **Admin** di pojok kanan atas website.
- **Kredensial Default:**
  - **Username:** `admin`
  - **Password:** `password` (atau `admin123`)
- **Fitur Admin:**
  1. **Profil & Biodata:** Ubah nama, gelar, NIP, NUPTK, foto profil, dan kutipan filosofi.
  2. **Modul Ajar & LKPD:** Tambah, edit, dan hapus modul dengan editor CP & ATP.
  3. **Prestasi & Sertifikasi:** Kelola piagam lomba, buku, dan pembimbingan olimpiade.
  4. **Galeri Dokumentasi:** Kelola foto dokumentasi aktivitas dan pameran P5.
  5. **Mata Pelajaran & Linimasa:** Kelola bidang ajar, integrasi EdTech, dan riwayat karir.
  6. **Kotak Masuk (Inbox):** Baca pesan yang dikirim pengunjung melalui form kontak dan balas langsung via WhatsApp.
  7. **Integrasi Google Spreadsheet:** Hubungkan langsung dengan Google Spreadsheet sebagai database cloud gratis tanpa server. Baca panduan lengkapnya di [GOOGLE_SHEETS_GUIDE.md](GOOGLE_SHEETS_GUIDE.md).

---

## 🚀 Cara Menjalankan Website

Website ini dibuat berbasis **Native HTML5, CSS3, dan Vanilla JavaScript**, sehingga **tidak memerlukan build-step maupun instalasi paket tambahan**.

### Cara 1: Buka Langsung di Peramban (Paling Mudah)
Cukup klik dua kali (*double click*) file `index.html`, atau klik kanan lalu pilih **Open with Google Chrome / Safari / Edge / Firefox**.

### Cara 2: Menjalankan dengan Server Lokal Python
Jika ingin menjalankan melalui server lokal:
```bash
# Di dalam folder profilku
python3 -m http.server 8000
```
Buka peramban Anda di alamat: `http://localhost:8000`

### Cara 3: Menggunakan VS Code Live Server
1. Buka folder `profilku` di VS Code.
2. Pasang ekstensi **Live Server**.
3. Klik tombol **"Go Live"** di pojok kanan bawah jendela VS Code.

---

## 🛠️ Panduan Kustomisasi

### 1. Mengubah Identitas & Biodata Guru
Buka file `index.html`, cari bagian:
- **Nama & Gelar:** Cari teks `Rahmat Hidayat, S.Pd., M.Pd.` dan ubah sesuai nama Anda.
- **NIP & NUPTK:** Cari kata kunci `NIP` atau `NUPTK` pada tabel `#tentang`.
- **Nama Sekolah:** Ganti `SMA Negeri 1 Harapan Bangsa` dengan nama instansi Anda.

### 2. Mengubah Foto Profil Guru
Pada `index.html` cari tag `<img>` di dalam div `.teacher-image-card`:
```html
<img 
  src="URL_FOTO_ANDA_ATAU_assets/foto-profil.jpg" 
  alt="Foto Profil Bpk. ..." 
  class="teacher-photo"
>
```
> *Tips:* Anda bisa menyimpan file foto Anda di dalam folder `assets/foto-profil.jpg` dan mengganti atribut `src` tersebut.

### 3. Mengubah Nomor WhatsApp & Email
- Pada `index.html`, ubah tautan WhatsApp di bagian navigasi, kontak, dan tombol floating:
  ```html
  https://wa.me/6281234567890
  ```
  Ganti `6281234567890` dengan nomor WhatsApp Anda (diawali kode negara `62` tanpa tanda `+` atau spasi).
- Pada `js/main.js`, cari baris berikut:
  ```javascript
  const waNumber = '6281234567890';
  ```
  Ganti dengan nomor WhatsApp aktif Anda.
- Ganti alamat email `rahmat.hidayat@sekolah.sch.id` dengan email Anda.

### 4. Menambah atau Mengubah Modul Ajar
Pada `index.html` di bagian section `#modul`, duplikasi atau edit salah satu blok `<article class="resource-card">`:
```html
<article class="resource-card" data-category="modul-ajar" data-keywords="kata kunci pencarian">
  <div class="resource-badge bg-primary">Modul Ajar • Fase E</div>
  ...
  <h3 class="resource-title">Judul Modul Anda</h3>
  ...
</article>
```
Untuk memperbarui detail Capaian Pembelajaran pada pop-up modal, perbarui objek `resourceData` di file `js/main.js`.

---

## 🌐 Panduan Publikasi / Hosting Gratis

Website ini sangat ringan (*static site*) dan dapat dipublikasikan secara gratis:

1. **GitHub Pages:**
   - Unggah (*push*) folder ini ke repositori GitHub.
   - Buka menu **Settings > Pages > Branch: main / root > Save**.
   - Website profil Anda langsung aktif di `https://username.github.io/profilku`.
2. **Vercel / Netlify:**
   - Cukup *drag and drop* folder `profilku` ke dashboard [Netlify Drop](https://app.netlify.com/drop) atau sambungkan repositori di [Vercel](https://vercel.com).
3. **Web Sekolah (cPanel / Hosting):**
   - Kompres berkas menjadi `.zip` lalu unggah ke direktori `public_html` atau subdomain sekolah (contoh: `guru.sman1harapanbangsa.sch.id`).

---

## 📄 Lisensi
Website profil ini dibuat untuk mendukung ekosistem **Kurikulum Merdeka** dan kemajuan pendidikan Indonesia. Bebas digunakan, dimodifikasi, dan disebarluaskan untuk kebutuhan akademis dan portofolio guru.

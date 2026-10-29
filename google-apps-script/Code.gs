/**
 * =========================================================================
 * BACKEND GOOGLE APPS SCRIPT - WEBSITE PROFIL PENDIDIK & DASHBOARD ADMIN
 * =========================================================================
 * Script ini berfungsi sebagai API RESTful untuk Google Spreadsheet sebagai
 * database dinamis website Profil Guru (profilku).
 *
 * FITUR:
 * 1. setupDatabase(): Otomatis membuat seluruh sheet & header jika belum ada.
 * 2. doGet(e): Mengambil data publik (semua modul, galeri, jadwal, dll).
 * 3. doPost(e): Otomatisasi login admin, pembaruan data, dan penerimaan pesan formulir.
 * =========================================================================
 */

// Konfigurasi Nama-Nama Sheet di Spreadsheet
var SHEETS = {
  CONFIG: "Config",
  MODUL: "Modul",
  PRESTASI: "Prestasi",
  JADWAL: "Jadwal",
  GALERI: "Galeri",
  KARYA: "Karya",
  TESTIMONI: "Testimoni",
  KOMPETENSI: "Kompetensi",
  EDTECH: "EdTech",
  TIMELINE: "Timeline",
  FAQ: "FAQ",
  PESAN_MASUK: "PesanMasuk",
  NAV_MENUS: "NavMenus",
  PELATIHAN: "Pelatihan",
  USERS: "Users"
};

/**
 * 1. FUNGSI SETUP AWAL DATABASE SPREADSHEET
 * Jalankan fungsi ini SATU KALI di editor Apps Script untuk inisialisasi sheet & data bawaan.
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Format Header
  var headerStyle = {
    background: "#1e293b",
    color: "#ffffff",
    fontWeight: "bold"
  };

  // 1. Sheet Config (Pengaturan Umum, Biodata, & Sosial)
  var sheetConfig = getOrCreateSheet(ss, SHEETS.CONFIG);
  if (sheetConfig.getLastRow() <= 1) {
    sheetConfig.clear();
    sheetConfig.appendRow(["Key", "Value", "Keterangan"]);
    var defaultConfigs = [
      ["site_title", "Profil Pendidik | Bpk. Rahmat Hidayat, S.Pd., M.Pd. - Guru Penggerak", "Judul Website"],
      ["teacher_name", "Rahmat Hidayat", "Nama Guru"],
      ["teacher_degrees", "S.Pd., M.Pd.", "Gelar"],
      ["teacher_tagline", "Guru Penggerak • Pengajar Matematika & Informatika", "Sub Gelar/Tagline"],
      ["school_name", "SMAN 1 Harapan Bangsa", "Nama Sekolah"],
      ["nuptk", "8452760661130092", "NUPTK"],
      ["nip", "19880415 201201 1 008", "NIP"],
      ["birth_info", "Bandung, 15 April 1988", "Tempat Tanggal Lahir"],
      ["last_education", "S2 Magister Pendidikan Matematika - ITB", "Pendidikan Terakhir"],
      ["teacher_status", "Guru Sertifikasi / Guru Ahli Madya", "Status Pendidik"],
      ["additional_role", "Wakil Kepala Sekolah Bidang Kurikulum / Fasilitator P5", "Peran Tambahan"],
      ["subjects_taught", "Matematika (Wajib & Peminatan), Informatika", "Mata Pelajaran Diampu"],
      ["city", "Kota Bandung, Jawa Barat", "Domisili/Kota"],
      ["address", "SMAN 1 Harapan Bangsa, Kota Bandung", "Alamat Instansi"],
      ["official_email", "rahmat.hidayat@sekolah.sch.id", "Email Resmi Sekolah"],
      ["personal_email", "rahmat.hidayat.guru@gmail.com", "Email Alternatif"],
      ["whatsapp_number", "6281234567890", "No. WhatsApp (Awali 62)"],
      ["hero_title", "Mendidik dengan Hati, Menginspirasi dengan Aksi & Teknologi", "Judul Utama Hero"],
      ["hero_desc", "Selamat datang di portal edukasi saya. Sebagai pendidik Matematika & Informatika, saya berkomitmen menghadirkan pembelajaran yang memanusiakan murid, interaktif, berbasis nalar kritis, dan relevan dengan tantangan abad ke-21.", "Deskripsi Hero"],
      ["hero_image", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80", "Foto Profil Guru"],
      ["announcement_text", "Modul Ajar Matematika Fase E & F (Kurikulum Merdeka) Semester Genap sudah tersedia untuk diunduh!", "Pengumuman Atas"],
      ["announcement_link", "#modul", "Link Pengumuman"],
      ["philosophy_quote", "Pendidikan bukan sekadar mengisi bejana yang kosong, melainkan menyalakan lentera yang menerangi masa depan setiap anak bangsa.", "Kutipan Filosofi"],
      ["bio_text1", "Bagi saya, ruang kelas bukan sekadar tempat mentransfer rumus dan angka, melainkan laboratorium pembentukan karakter nalar kritis, empati, dan ketangguhan mental murid.", "Paragraf Bio 1"],
      ["bio_text2", "Melalui pendekatan Pembelajaran Berdiferensiasi dan integrasi EdTech (Education Technology), setiap peserta didik dihargai keunikan cara belajarnya—baik visual, auditori, maupun kinestetik.", "Paragraf Bio 2"],
      ["stat_years", "12+", "Stat: Tahun Pengalaman"],
      ["stat_students", "1.200+", "Stat: Siswa Terbimbing"],
      ["stat_modules", "45+", "Stat: Modul & LKPD"],
      ["stat_certs", "16+", "Stat: Sertifikasi/Prestasi"],
      ["badge_award", "Juara 1 Guru Inovatif Prov. Jabar", "Teks Badge Mengapung 1"],
      ["badge_snbt", "98% Siswa Lolos SNBT", "Teks Badge Mengapung 2"],
      ["youtube_url", "https://youtube.com", "URL YouTube"],
      ["linkedin_url", "https://linkedin.com", "URL LinkedIn"],
      ["instagram_url", "https://instagram.com", "URL Instagram"],
      ["github_url", "https://github.com", "URL GitHub"]
    ];
    defaultConfigs.forEach(function(row) { sheetConfig.appendRow(row); });
  }

  // 2. Sheet Users (Admin Login)
  var sheetUsers = getOrCreateSheet(ss, SHEETS.USERS);
  if (sheetUsers.getLastRow() <= 1) {
    sheetUsers.clear();
    sheetUsers.appendRow(["Username", "Password", "Nama", "Role", "LastLogin"]);
    sheetUsers.appendRow(["admin", "admin123", "Bpk. Rahmat Hidayat", "Administrator", new Date().toISOString()]);
  }

  // 3. Sheet Modul Ajar
  var sheetModul = getOrCreateSheet(ss, SHEETS.MODUL);
  if (sheetModul.getLastRow() <= 1) {
    sheetModul.clear();
    sheetModul.appendRow(["ID", "Judul", "Kategori", "Badge", "Fase", "Snippet", "FileNotice", "DownloadLink", "CP", "ATP", "Diferensiasi", "Keywords"]);
    var defaultModul = [
      ["1", "Modul Ajar: Fungsi Eksponen & Logaritma Berdiferensiasi", "modul-ajar", "Modul Ajar • Fase E (Kelas X)", "Fase E (Kelas X)", "Dilengkapi pemetaan kebutuhan belajar murid, aktivitas kontekstual peluruhan radioaktif & bunga majemuk, serta asesmen formatif-sumatif lengkap.", "Modul_Ajar_Eksponen_Logaritma_FaseE.pdf", "#", "Menggeneralisasi sifat-sifat bilangan berpangkat dan menerapkan barisan/deret untuk memodelkan pertumbuhan & peluruhan.", "Mengidentifikasi sifat perpangkatan, menyelesaikan masalah kontekstual, menggunakan logaritma.", "Konten audio-visual, produk komik/video/infografis.", "eksponen logaritma fase e kelas 10 aljabar fungsi"],
      ["2", "LKPD Eksploratif: Vektor pada Ruang Berbantuan GeoGebra", "lkpd", "LKPD Interaktif • Fase F (Kelas XI)", "Fase F (Kelas XI)", "Lembar kerja siswa interaktif untuk mengkonstruksi konsep resultan gaya, perkalian titik (dot product), dan proyeksi ortogonal dengan barcode applet 3D.", "LKPD_Interaktif_Vektor_3D_GeoGebra.pdf", "#", "Menyatakan vektor pada bidang dan ruang dimensi tiga serta menggunakannya untuk masalah fisika dan geometri.", "Penemuan terbimbing rumus perkalian titik (Dot Product) dari sudut antara dua vektor ruang.", "Flipped classroom dengan applet GeoGebra 3D 360 derajat.", "vektor geometri ruang fase f kelas 11 lkpd lembar kerja siswa"],
      ["3", "Mastery Kit Penalaran Matematika UTBK-SNBT 2025", "bank-soal", "Bank Soal • Kelas XII / Alumni", "Kelas XII / Alumni", "Kompilasi 150 soal HOTS penalaran kuantitatif disertai metode pembahasan cepat sistematis dan peta kelemahan konsep.", "Mastery_Kit_UTBK_SNBT_Penalaran_Matematika_2025.pdf", "#", "Standar Uji BPPP Kemendikbud: penalaran dalam situasi nyata kontekstual tanpa rumus rumit.", "Penalaran Bilangan, Barisan, Geometri, dan Peluang.", "Disertai catatan jebakan soal dan pembahasan terstruktur.", "snbt utbk penalaran matematika kuantitatif bank soal pembahasan"],
      ["4", "Slide Visual: Statistika Inferensial & Uji Hipotesis", "slide", "Slide Presentasi • Fase F Tingkat Lanjut", "Fase F Tingkat Lanjut", "Template presentasi menarik dan interaktif untuk menjelaskan distribusi normal, kurva lonceng Gauss, z-score, dan uji signifikansi data riil.", "Slide_Statistika_Inferensial_FaseF.pptx", "#", "Memahami konsep kurva normal standar Gauss, nilai Z-score, dan taraf signifikansi.", "Presentasi 42 slide interaktif visualisasi kurva.", "Dapat diedit bebas di PowerPoint atau Canva for Education.", "statistika inferensial peluang distribusi normal presentasi slide canva powerpoint"],
      ["5", "Handout Praktis: Logika Pemrograman & Algoritma Python", "modul-ajar", "Modul Ajar • Informatika Fase E", "Informatika Fase E", "Panduan ramah pemula untuk siswa SMA belajar logika percabangan, perulangan, dan pemecahan masalah komputasi tanpa beban sintaks rumit.", "Handout_Python_SMA_FaseE.pdf", "#", "Memahami berpikir komputasional, dekomposisi masalah, pengenalan pola, dan perancangan algoritma Python 3.", "Dasar Python, Kondisional if-else, Perulangan, dan Proyek Mini.", "Latihan interaktif di Google Colab tanpa instalasi lokal.", "informatika python computational thinking berpikir komputasional fase e coding"],
      ["6", "Modul P5: \"Rekayasa & Teknologi Cerdas Hemat Energi Sekolah\"", "modul-ajar", "Modul Projek P5 • Seluruh Jenjang SMA", "Semua Jenjang SMA", "Panduan lengkap fasilitator projek penguatan profil pelajar Pancasila tema Rekayasa Teknologi, dilengkapi rubrik asesmen dimensi bernalar kritis & kreatif.", "Panduan_Projek_P5_Rekayasa_Teknologi_SMA.pdf", "#", "Dimensi P5: Bernalar Kritis, Gotong Royong, dan Kreatif.", "Observasi konsumsi energi, riset solusi, pembuatan prototipe, expo karya.", "Rubrik fasilitator projek dan lembar refleksi mandiri siswa.", "projek p5 rekayasa teknologi profil pelajar pancasila panduan fasilitator"]
    ];
    defaultModul.forEach(function(row) { sheetModul.appendRow(row); });
  }

  // 4. Sheet Prestasi
  var sheetPrestasi = getOrCreateSheet(ss, SHEETS.PRESTASI);
  if (sheetPrestasi.getLastRow() <= 1) {
    sheetPrestasi.clear();
    sheetPrestasi.appendRow(["ID", "Tahun", "Judul", "Penyelenggara", "Kategori", "Icon", "Deskripsi", "Highlight", "PdfUrl", "PdfFileName"]);
    var defaultPrestasi = [
      ["1", "2024", "Juara 1 Lomba Guru Inovatif SMA Tingkat Provinsi", "Dinas Pendidikan Provinsi Jawa Barat", "Juara", "fa-trophy", "Inovasi: \"MathSpace 3D: Aplikasi Web Augmented Reality untuk Visualisasi Geometri Ruang Siswa SMA Berdiferensiasi\".", "TRUE", "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "Piagam_Juara_1_Guru_Inovatif_Provinsi.pdf"],
      ["2", "2023", "Predikat Kelulusan Amat Baik Guru Penggerak (Angkatan 7)", "Direktorat Jenderal GTK Kemendikbudristek RI", "Sertifikasi", "fa-certificate", "Lulus program kepemimpinan pembelajaran selama 6 bulan intensif dengan proyek perubahan budaya positif dan komunitas praktisi sekolah.", "FALSE", "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "Sertifikat_Guru_Penggerak_Angkatan_7.pdf"],
      ["3", "2023", "Pembimbing Medali Perunggu OSN Matematika Tingkat Nasional", "Pusat Prestasi Nasional (Puspresnas)", "Pembina", "fa-medal", "Membimbing ananda Farhan Alamsyah (siswa SMAN 1 Harapan Bangsa) meraih Medali Perunggu Bidang Matematika SMA di OSN 2023.", "FALSE", "", ""],
      ["4", "2022", "Google Certified Educator Level 2", "Google for Education Global", "Sertifikasi", "fa-brands fa-google", "Sertifikasi keahlian tingkat lanjut dalam integrasi ekosistem Google Workspace for Education dalam alur manajemen kelas digital modern.", "FALSE", "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "Google_Certified_Educator_Level_2.pdf"],
      ["5", "2022", "Penulis Buku: \"Menyenangkan Belajar Matematika dengan Pendekatan STEAM\"", "Penerbit Eduka Mandiri • Ber-ISBN: 978-623-889-102-4", "Karya Tulis", "fa-book-journal-whills", "Buku panduan praktis bagi guru matematika jenjang SMP/SMA dalam mengaitkan konsep angka dengan sains, seni, dan teknologi terapan.", "FALSE", "", ""],
      ["6", "2021", "Guru Berprestasi & Berdedikasi Kota Bandung", "Pemerintah Kota Bandung & PGRI", "Penghargaan", "fa-star", "Apresiasi atas kontribusi pembuatan ratusan video tutorial pembelajaran terbuka gratis selama masa pembelajaran jarak jauh (PJJ).", "FALSE", "", ""]
    ];
    defaultPrestasi.forEach(function(row) { sheetPrestasi.appendRow(row); });
  }

  // 5. Sheet Jadwal
  var sheetJadwal = getOrCreateSheet(ss, SHEETS.JADWAL);
  if (sheetJadwal.getLastRow() <= 1) {
    sheetJadwal.clear();
    sheetJadwal.appendRow(["ID", "Hari", "Waktu", "Judul", "Ruang", "Badge", "BadgeColor", "Highlight"]);
    var defaultJadwal = [
      ["1", "senin", "07.15 - 08.00", "Upacara Bendera & Apel Pagi Guru", "Lapangan Utama SMAN 1 Harapan Bangsa", "Agenda Sekolah", "bg-info", "FALSE"],
      ["2", "senin", "08.00 - 10.15", "Matematika Wajib - Kelas X MIPA 1", "Ruang Kelas X-1 • Materi: Barisan & Deret Geometri", "KBM Fase E", "bg-primary", "TRUE"],
      ["3", "senin", "10.45 - 12.15", "Matematika Wajib - Kelas X MIPA 3", "Ruang Kelas X-3 • Materi: Barisan & Deret Aritmatika", "KBM Fase E", "bg-primary", "FALSE"],
      ["4", "senin", "13.30 - 15.00", "Jam Konsultasi Belajar Siswa & Tanya Tugas", "Ruang Guru / Perpustakaan Sekolah (Bebas mendaftar lebih awal)", "Layanan Konsultasi", "bg-success", "FALSE"],
      ["5", "selasa", "07.30 - 09.45", "Matematika Tingkat Lanjut - Kelas XI MIPA 2", "Ruang Kelas XI-2 • Materi: Polinomial & Suku Banyak", "KBM Fase F", "bg-purple", "FALSE"],
      ["6", "selasa", "10.15 - 12.30", "Matematika Tingkat Lanjut - Kelas XI MIPA 4", "Ruang Kelas XI-4 • Materi: Teorema Sisa & Faktor", "KBM Fase F", "bg-purple", "FALSE"],
      ["7", "selasa", "14.00 - 16.00", "Klinik OSN Matematika (Latihan Pembuktian Aljabar)", "Laboratorium Matematika / Ruang Bimbingan Olimpiade", "Bimbingan Talenta", "bg-amber", "FALSE"],
      ["8", "rabu", "07.15 - 09.30", "Informatika & Pemrograman Python - Kelas X-A", "Laboratorium Komputer 1 (Gedung IT)", "Informatika Fase E", "bg-primary", "FALSE"],
      ["9", "rabu", "10.00 - 12.15", "Informatika & Pemrograman Python - Kelas X-C", "Laboratorium Komputer 1 (Gedung IT)", "Informatika Fase E", "bg-primary", "FALSE"],
      ["10", "rabu", "13.30 - 15.30", "Koordinasi Fasilitator Projek P5 Tema Rekayasa", "Ruang Rapat Kurikulum / Lab Kolaborasi", "Koordinasi Guru", "bg-info", "FALSE"],
      ["11", "kamis", "07.30 - 09.45", "Matematika Peminatan - Kelas XII MIPA 1", "Ruang Kelas XII-1 • Materi: Limit Fungsi Trigonometri", "KBM Fase F", "bg-purple", "TRUE"],
      ["12", "kamis", "10.15 - 12.30", "Matematika Peminatan - Kelas XII MIPA 3", "Ruang Kelas XII-3 • Materi: Turunan Fungsi Trigonometri", "KBM Fase F", "bg-purple", "FALSE"],
      ["13", "kamis", "13.30 - 15.00", "Mentoring Komunitas Praktisi Guru Penggerak", "Ruang Guru / Daring via Google Meet", "Pengembangan Diri", "bg-success", "FALSE"],
      ["14", "jumat", "07.15 - 08.00", "Senam Sehat & Pembiasaan Karakter Pagi", "Lapangan Sekolah SMAN 1 Harapan Bangsa", "Program Sekolah", "bg-info", "FALSE"],
      ["15", "jumat", "08.15 - 10.30", "Pendampingan Lapangan Gelar Karya Projek P5", "Selasar Budaya & Ruang Pamer Sekolah", "Projek P5", "bg-emerald", "FALSE"],
      ["16", "jumat", "13.30 - 15.00", "Konsultasi Terbuka Wali Murid & Evaluasi Nilai", "Ruang Tamu Humas Sekolah / WhatsApp Hotline", "Layanan Wali Murid", "bg-amber", "FALSE"]
    ];
    defaultJadwal.forEach(function(row) { sheetJadwal.appendRow(row); });
  }

  // 6. Sheet Galeri
  var sheetGaleri = getOrCreateSheet(ss, SHEETS.GALERI);
  if (sheetGaleri.getLastRow() <= 1) {
    sheetGaleri.clear();
    sheetGaleri.appendRow(["ID", "Judul", "Kategori", "KategoriLabel", "ImgUrl", "Deskripsi"]);
    var defaultGaleri = [
      ["1", "Pembelajaran Matematika Kontekstual Berkelompok", "kelas", "Suasana Kelas", "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80", "Diskusi seru pemecahan masalah model matematika menggunakan papan interaktif."],
      ["2", "Gelar Karya P5: Rekayasa Prototipe Lampu Surya", "projek", "Projek P5", "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80", "Siswa mempresentasikan hasil rakitan sensor otomatis hemat energi."],
      ["3", "Lokakarya Berbagi Praktik Baik Kurikulum Merdeka", "pelatihan", "Workshop Guru", "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80", "Menjadi narasumber modul ajar berdiferensiasi bersama 60 guru SMA se-Kabupaten."],
      ["4", "Praktikum Pemrograman Algoritma Python", "kelas", "Suasana Kelas", "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80", "Membimbing siswa merancang simulasi perhitungan statistik mandiri di lab komputer."],
      ["5", "Bimbingan Intensif Kontingen OSN Matematika", "projek", "Projek & Ekstrakurikuler", "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", "Sesi telaah teorema geometri lanjutan dan latihan simulasi kompetisi nasional."],
      ["6", "Penganugerahan Pendidik Berprestasi & Inovatif", "pelatihan", "Prestasi & Pengakuan", "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80", "Momentum penerimaan piagam penghargaan apresiasi guru teladan dari Dinas Pendidikan."]
    ];
    defaultGaleri.forEach(function(row) { sheetGaleri.appendRow(row); });
  }

  // 6b. Sheet Karya (Website & Portofolio)
  var sheetKarya = getOrCreateSheet(ss, SHEETS.KARYA);
  if (sheetKarya.getLastRow() <= 1) {
    sheetKarya.clear();
    sheetKarya.appendRow(["ID", "NamaWebsite", "Deskripsi", "Link", "Thumbnail"]);
    var defaultKarya = [
      ["1", "Be-Ternak (Moklet)", "Platform manajemen peternakan ayam KUB pedaging & KUB petelur presisi. Dilengkapi telemetri IoT, recording harian, FCR otomatis, dan monitoring HDP.", "https://grati-ternak.web.app", "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80"],
      ["2", "Portal Modul & OER Kurikulum Merdeka", "Repositori bahan ajar digital, lembar kerja peserta didik (LKPD), modul ajar berdiferensiasi Matematika Fase E & F, dan simulasi GeoGebra.", "https://rahmathidayat.guru", "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"],
      ["3", "Klinik Olimpiade Sains & Penalaran", "Platform persiapan intensif OSN Matematika dan drill soal penalaran kuantitatif SNBT berbasis nalar kritis dan komputasional.", "https://olimpiade-matematika.sch.id", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"]
    ];
    defaultKarya.forEach(function(row) { sheetKarya.appendRow(row); });
  }

  // 7. Sheet Testimoni
  var sheetTestimoni = getOrCreateSheet(ss, SHEETS.TESTIMONI);
  if (sheetTestimoni.getLastRow() <= 1) {
    sheetTestimoni.clear();
    sheetTestimoni.appendRow(["ID", "Nama", "Peran", "FotoUrl", "Quote", "Rating"]);
    var defaultTesti = [
      ["1", "Farhan Alamsyah", "Alumni SMAN 1 • Mahasiswa STEI ITB (Peraih Medali OSN)", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80", "Dulu saya sangat takut dan trauma dengan matematika karena merasa rumusnya hafalan semua. Di kelas Pak Rahmat, kami diajak memahami alasan logis di balik rumus lewat visualisasi GeoGebra. Skor UTBK matematika saya naik drastis dan alhamdulillah diterima di STEI ITB!", "5"],
      ["2", "Dra. Hj. Nurjanah, M.M.", "Kepala Sekolah SMAN 1 Harapan Bangsa", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", "Pak Rahmat adalah figur pendidik penggerak sejati. Inisiatif beliau membagikan modul ajar berdiferensiasi dan melatih rekan-rekan guru menggunakan platform digital telah mengangkat kualitas pembelajaran di sekolah kami secara nyata.", "5"],
      ["3", "Ibu Ratna Dewi, S.E.", "Orang Tua Murid Kelas XI MIPA 1", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", "Komunikasi Pak Rahmat dengan kami para orang tua sangat transparan dan hangat. Beliau tidak hanya fokus pada nilai rapor, tetapi sangat peduli pada kesehatan mental dan minat belajar anak saya. Terima kasih banyak Pak Guru!", "5"]
    ];
    defaultTesti.forEach(function(row) { sheetTestimoni.appendRow(row); });
  }

  // 8. Sheet Kompetensi (Mata Pelajaran)
  var sheetKompetensi = getOrCreateSheet(ss, SHEETS.KOMPETENSI);
  if (sheetKompetensi.getLastRow() <= 1) {
    sheetKompetensi.clear();
    sheetKompetensi.appendRow(["ID", "Tingkat", "Judul", "Deskripsi", "Icon", "ColorClass", "FiturList"]);
    var defaultKompetensi = [
      ["1", "Fase E & F (Kelas X, XI, XII)", "Matematika Tingkat Lanjut & Wajib", "Aljabar linear, geometri analitik, trigonometri lanjutan, kalkulus diferensial-integral, matriks, serta statistika inferensial dengan pendekatan pemecahan masalah kontekstual.", "fa-square-root-variable", "bg-blue-subtle text-blue", "Visualisasi Geometri dengan GeoGebra 3D|Pemodelan Matematika Kasus Lingkungan & Bisnis|Bimbingan Tuntas UTBK-SNBT Skolastik"],
      ["2", "Program Sukses Ujian", "Literasi & Penalaran Numerasi (AKM & SNBT)", "Pelatihan intensif membaca grafik, menafsirkan data tabel, logika kuantitatif, dan estimasi cerdas untuk persiapan Asesmen Nasional dan seleksi masuk perguruan tinggi negeri impian.", "fa-calculator", "bg-emerald-subtle text-emerald", "Trik Cepat Nalar Matematis (Speed Math)|Simulasi Computer-Based Test (CBT) Mingguan|Bedah Tuntas Soal Asesmen Nasional HOTS"],
      ["3", "Fase E & Literasi Digital", "Informatika & Computational Thinking", "Pengenalan berpikir komputasional, algoritma dan pemrograman dasar menggunakan Python, etika kecerdasan buatan (AI), analisis data, dan cybersecurity awareness untuk remaja.", "fa-code", "bg-purple-subtle text-purple", "Pemrograman Visual & Python Sederhana|Pengolahan Data Spreadsheet & Data Dashboard|Literasi Etika AI & Keamanan Data Siswa"],
      ["4", "Ekstrakurikuler & Pembinaan Bakat", "Klub Olimpiade Sains (OSN Matematika)", "Pendampingan intensif bagi siswa berbakat matematika dengan silabus olimpiade: Teori Bilangan, Aljabar Lanjut, Kombinatorika, dan Geometri Euklidean.", "fa-award", "bg-amber-subtle text-amber", "Bank Soal OSN Kota, Provinsi, Nasional|Mentoring 1-on-1 & Pembahasan Bukti Matematis|Portofolio Prestasi Jalur Prestasi Mandiri PTN"]
    ];
    defaultKompetensi.forEach(function(row) { sheetKompetensi.appendRow(row); });
  }

  // 9. Sheet EdTech
  var sheetEdtech = getOrCreateSheet(ss, SHEETS.EDTECH);
  if (sheetEdtech.getLastRow() <= 1) {
    sheetEdtech.clear();
    sheetEdtech.appendRow(["ID", "Nama", "Icon", "ColorClass"]);
    var defaultEdtech = [
      ["1", "GeoGebra & Desmos", "fa-solid fa-shapes", "text-primary"],
      ["2", "Google Classroom & Workspace", "fa-brands fa-google", "text-danger"],
      ["3", "Canva for Education", "fa-solid fa-palette", "text-info"],
      ["4", "Quizizz & Kahoot Interaktif", "fa-solid fa-gamepad", "text-warning"],
      ["5", "Python & Jupyter Notebook", "fa-brands fa-python", "text-primary"],
      ["6", "Miro & Padlet Kolaborasi", "fa-solid fa-chalkboard", "text-success"]
    ];
    defaultEdtech.forEach(function(row) { sheetEdtech.appendRow(row); });
  }

  // 10. Sheet Timeline (Pendidikan & Karir)
  var sheetTimeline = getOrCreateSheet(ss, SHEETS.TIMELINE);
  if (sheetTimeline.getLastRow() <= 1) {
    sheetTimeline.clear();
    sheetTimeline.appendRow(["ID", "Tahun", "Judul", "Institusi", "Deskripsi"]);
    var defaultTimeline = [
      ["1", "2023 - Sekarang", "Fasilitator Daerah & Guru Penggerak Angkatan 7", "Kemendikbudristek RI", "Memimpin diseminasi Kurikulum Merdeka, memfasilitasi lokakarya guru, dan mendampingi perancangan modul ajar berdiferensiasi di 14 sekolah mitra."],
      ["2", "2018 - 2021", "Magister Pendidikan Matematika (S2) - IPK 3.92", "Institut Teknologi Bandung (ITB)", "Fokus riset: \"Pengembangan Media Pembelajaran Spasial 3D Dinamis Berbasis Augmented Reality untuk Meningkatkan Kemampuan Spasial Siswa SMA\"."],
      ["3", "2015 - Sekarang", "Guru Tetap Matematika & Pembina Tim Olimpiade (OSN)", "SMA Negeri 1 Harapan Bangsa", "Mengajar Matematika Fase E dan F, mengkoordinir klub sains, serta membimbing siswa meraih medali di tingkat kota, provinsi, dan nasional."],
      ["4", "2008 - 2012", "Sarjana Pendidikan Matematika (S1) - Cum Laude", "Universitas Pendidikan Indonesia (UPI)", "Lulusan terbaik fakultas, aktif dalam BEM, Himpunan Mahasiswa Matematika, dan relawan pengajar komunitas pelosok daerah."]
    ];
    defaultTimeline.forEach(function(row) { sheetTimeline.appendRow(row); });
  }

  // 11. Sheet FAQ
  var sheetFaq = getOrCreateSheet(ss, SHEETS.FAQ);
  if (sheetFaq.getLastRow() <= 1) {
    sheetFaq.clear();
    sheetFaq.appendRow(["ID", "Pertanyaan", "Jawaban"]);
    var defaultFaq = [
      ["1", "Apakah seluruh materi ajar dan modul di web ini boleh diunduh gratis?", "Ya, seluruh modul ajar, LKPD, dan kisi-kisi soal yang diunggah di situs ini berlisensi Open Educational Resources (OER). Anda bebas mengunduh, mempelajari, dan membagikannya kembali untuk kepentingan non-komersial pendidikan."],
      ["2", "Bagaimana alur pendaftaran bimbingan klinik olimpiade atau konsultasi privat?", "Siswa atau orang tua cukup mengisi formulir pada menu Kontak di halaman ini atau mengirim pesan langsung via WhatsApp resmi. Jadwal akan disesuaikan dengan jam luang yang tersedia pada tab Jadwal Mengajar."],
      ["3", "Apakah Pak Rahmat bersedia diundang sebagai narasumber workshop Kurikulum Merdeka?", "Tentu. Saya siap berkolaborasi sebagai pemateri lokakarya guru seputar Pembelajaran Berdiferensiasi, Pemanfaatan EdTech Geogebra/Python, maupun Asesmen Kurikulum Merdeka. Silakan kirimkan surat permohonan via email resmi."]
    ];
    defaultFaq.forEach(function(row) { sheetFaq.appendRow(row); });
  }

  // 12. Sheet PesanMasuk (Pesan dari Form Kontak)
  var sheetPesan = getOrCreateSheet(ss, SHEETS.PESAN_MASUK);
  if (sheetPesan.getLastRow() <= 1) {
    sheetPesan.clear();
    sheetPesan.appendRow(["ID", "Tanggal", "Nama", "Peran", "Email", "WhatsApp", "Topik", "Pesan", "Status"]);
    sheetPesan.appendRow([
      "MSG-1",
      new Date().toLocaleString("id-ID"),
      "Budi Santoso",
      "Siswa",
      "budi@example.com",
      "081234567890",
      "Konsultasi Belajar",
      "Halo Pak Rahmat, terima kasih atas modul ajar eksponennya. Sangat membantu tugas kelompok kami!",
      "Dibaca"
    ]);
  }

  // 13. Sheet NavMenus (Menu Navigasi Website)
  var sheetNav = getOrCreateSheet(ss, SHEETS.NAV_MENUS);
  if (sheetNav.getLastRow() <= 1) {
    sheetNav.clear();
    sheetNav.appendRow(["ID", "Label", "Href", "Icon", "IsActive", "Order"]);
    var defaultNav = [
      ["nav-1", "Beranda", "#beranda", "fa-solid fa-house", "TRUE", 1],
      ["nav-2", "Pendampingan", "#pendampingan", "fa-solid fa-people-arrows", "TRUE", 2],
      ["nav-3", "Kompetensi", "#kompetensi", "fa-solid fa-chalkboard-user", "TRUE", 3],
      ["nav-4", "Modul Ajar", "#modul", "fa-solid fa-book-open", "TRUE", 4],
      ["nav-5", "Portofolio", "#portofolio", "fa-solid fa-briefcase", "TRUE", 5],
      ["nav-6", "Pengembangan Diri", "#pengembangan-diri", "fa-solid fa-graduation-cap", "TRUE", 6],
      ["nav-7", "Kontak", "#kontak", "fa-solid fa-envelope", "TRUE", 7]
    ];
    defaultNav.forEach(function(row) { sheetNav.appendRow(row); });
  }

  // 14. Sheet Pelatihan (Riwayat Pengembangan Diri & Sertifikasi)
  var sheetPelatihan = getOrCreateSheet(ss, SHEETS.PELATIHAN);
  if (sheetPelatihan.getLastRow() <= 1) {
    sheetPelatihan.clear();
    sheetPelatihan.appendRow(["ID", "Judul", "Kategori", "Penyelenggara", "Periode", "JP", "Badge", "Deskripsi", "Skills", "CertificateUrl", "CertificateFile"]);
    var defaultPelatihan = [
      ["tr-1", "Pendidikan Guru Penggerak (PPGP) Angkatan 9", "kepemimpinan", "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI", "2023 - 2024", "310 JP", "Kemendikbudristek", "Program kepemimpinan pembelajaran berpusat pada murid, coaching alur TIRTA, dan budaya positif.", "Coaching TIRTA|Budaya Positif|Pembelajaran Berdiferensiasi", "#", "Sertifikat_PPGP_Angkatan9.pdf"],
      ["tr-2", "IC3 Digital Literacy Global Certification", "sertifikasi", "Certiport - A Pearson VUE Business", "Lisensi Aktif", "Global Credential", "Sertifikasi Global", "Standar internasional kecakapan komputasi dasar, komputasi awan, dan etika digital global.", "Computing Fundamentals|Key Applications|Living Online", "#", "Sertifikat_IC3_Digital_Literacy.pdf"],
      ["tr-3", "Diklat Upskilling & Reskilling Guru SMK Berstandar Industri", "diklat", "BBPPMPV BMTI Kemendikbudristek", "2023", "90 JP", "Industri Standard", "Pelatihan kejuruan teknologi informasi tingkat lanjut dan penyelarasan kurikulum vokasi masa depan.", "Vokasi Teknologi|Penyelarasan Kurikulum|Standard Industri", "#", "Sertifikat_Upskilling_BMTI.pdf"],
      ["tr-4", "Pemanfaatan Generative AI dalam Efisiensi Bahan Ajar & Asesmen HOTS", "ai", "Google for Education Partner & Komunitas Guru Inovatif", "2024", "36 JP", "Tren Teknologi", "Penerapan prompt engineering untuk diferensiasi konten KBM dan perancangan asesmen HOTS.", "Prompt Engineering|Asesmen HOTS|Automasi Guru", "#", "Sertifikat_Generative_AI.pdf"]
    ];
    defaultPelatihan.forEach(function(row) { sheetPelatihan.appendRow(row); });
  }

  return "Setup Berhasil! Semua sheet database telah dibuat.";
}

/**
 * 2. HANDLER GET (doGet)
 * Mengambil data dari spreadsheet untuk ditampilkan di website publik & dashboard admin.
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAll";
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    if (action === "ping") {
      return jsonResponse({ status: "success", message: "API Google Apps Script Profilku aktif!", timestamp: new Date().toISOString() });
    }

    if (action === "getAll") {
      var db = {
        config: getConfigData(ss),
        modul: getSheetDataAsObjects(ss, SHEETS.MODUL),
        prestasi: getSheetDataAsObjects(ss, SHEETS.PRESTASI),
        jadwal: getSheetDataAsObjects(ss, SHEETS.JADWAL),
        galeri: getSheetDataAsObjects(ss, SHEETS.GALERI),
        karya: getSheetDataAsObjects(ss, SHEETS.KARYA),
        testimoni: getSheetDataAsObjects(ss, SHEETS.TESTIMONI),
        kompetensi: getSheetDataAsObjects(ss, SHEETS.KOMPETENSI),
        edtech: getSheetDataAsObjects(ss, SHEETS.EDTECH),
        timeline: getSheetDataAsObjects(ss, SHEETS.TIMELINE),
        faq: getSheetDataAsObjects(ss, SHEETS.FAQ),
        nav_menus: getSheetDataAsObjects(ss, SHEETS.NAV_MENUS),
        pelatihan: getSheetDataAsObjects(ss, SHEETS.PELATIHAN),
        pesanMasuk: getSheetDataAsObjects(ss, SHEETS.PESAN_MASUK)
      };

      return jsonResponse({ status: "success", data: db });
    }

    if (action === "getSection") {
      var sectionName = e.parameter.section;
      var data = (sectionName.toLowerCase() === "config") ? getConfigData(ss) : getSheetDataAsObjects(ss, sectionName);
      return jsonResponse({ status: "success", section: sectionName, data: data });
    }

    return jsonResponse({ status: "error", message: "Aksi tidak dikenali" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * 3. HANDLER POST (doPost)
 * Menangani Login, Simpan Data, Simpan Pesan Formulir, dan Ubah Password.
 */
function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : "";
    var body = {};
    if (rawData) {
      try {
        body = JSON.parse(rawData);
      } catch (jsonErr) {
        // Fallback jika form-urlencoded
        body = e.parameter || {};
      }
    } else {
      body = e.parameter || {};
    }

    var action = body.action || "save";
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // AKSI 1: LOGIN ADMIN
    if (action === "login") {
      var username = (body.username || "").trim();
      var password = (body.password || "").trim();

      var users = getSheetDataAsObjects(ss, SHEETS.USERS);
      var matchedUser = null;

      for (var i = 0; i < users.length; i++) {
        if (users[i].Username === username && users[i].Password === password) {
          matchedUser = users[i];
          break;
        }
      }

      if (matchedUser) {
        // Update last login
        updateUserLastLogin(ss, username);
        var token = Utilities.base64Encode(username + ":" + new Date().getTime());
        return jsonResponse({
          status: "success",
          message: "Login berhasil",
          token: token,
          user: {
            username: matchedUser.Username,
            name: matchedUser.Nama || "Administrator",
            role: matchedUser.Role || "Admin"
          }
        });
      } else {
        return jsonResponse({ status: "error", message: "Username atau password salah!" });
      }
    }

    // AKSI 2: KIRIM PESAN DARI FORM KONTAK WEBSITE (Bisa dipanggil siapa saja)
    if (action === "sendMessage") {
      var sheetPesan = getOrCreateSheet(ss, SHEETS.PESAN_MASUK);
      var msgId = "MSG-" + new Date().getTime();
      var dateStr = new Date().toLocaleString("id-ID");
      
      sheetPesan.appendRow([
        msgId,
        dateStr,
        body.name || "-",
        body.role || "Umum",
        body.email || "-",
        body.whatsapp || "-",
        body.subject || "Konsultasi Belajar",
        body.message || "-",
        "Baru"
      ]);

      return jsonResponse({ status: "success", message: "Pesan berhasil disimpan ke spreadsheet!", id: msgId });
    }

    // AKSI 3: UPDATE STATUS PESAN MASUK (Tandai Dibaca / Dibalas)
    if (action === "updateMessageStatus") {
      var sheetPesan = getOrCreateSheet(ss, SHEETS.PESAN_MASUK);
      var rows = sheetPesan.getDataRange().getValues();
      var targetId = body.id;
      var newStatus = body.status || "Dibaca";

      for (var r = 1; r < rows.length; r++) {
        if (rows[r][0] == targetId) {
          sheetPesan.getRange(r + 1, 9).setValue(newStatus);
          return jsonResponse({ status: "success", message: "Status pesan diperbarui" });
        }
      }
      return jsonResponse({ status: "error", message: "Pesan tidak ditemukan" });
    }

    // AKSI 4: HAPUS PESAN MASUK
    if (action === "deleteMessage") {
      var sheetPesan = getOrCreateSheet(ss, SHEETS.PESAN_MASUK);
      var rows = sheetPesan.getDataRange().getValues();
      var targetId = body.id;

      for (var r = 1; r < rows.length; r++) {
        if (rows[r][0] == targetId) {
          sheetPesan.deleteRow(r + 1);
          return jsonResponse({ status: "success", message: "Pesan dihapus" });
        }
      }
      return jsonResponse({ status: "error", message: "Pesan tidak ditemukan" });
    }

    // AKSI 5: SIMPAN CONFIG (PROFIL & BIODATA)
    if (action === "saveConfig") {
      saveConfigData(ss, body.data || {});
      return jsonResponse({ status: "success", message: "Profil & Konfigurasi berhasil disimpan!" });
    }

    // AKSI 6: SIMPAN SATU SECTION TERTENTU (Modul, Prestasi, Jadwal, dll)
    if (action === "saveSection") {
      var sectionName = body.section;
      var items = body.data || [];
      saveSectionData(ss, sectionName, items);
      return jsonResponse({ status: "success", message: "Data " + sectionName + " berhasil disimpan!" });
    }

    // AKSI 7: SIMPAN SEMUA DATA SEKALIGUS (FULL SYNC)
    if (action === "saveAll") {
      var allData = body.data || {};
      if (allData.config) saveConfigData(ss, allData.config);
      if (allData.modul) saveSectionData(ss, SHEETS.MODUL, allData.modul);
      if (allData.prestasi) saveSectionData(ss, SHEETS.PRESTASI, allData.prestasi);
      if (allData.jadwal) saveSectionData(ss, SHEETS.JADWAL, allData.jadwal);
      if (allData.galeri) saveSectionData(ss, SHEETS.GALERI, allData.galeri);
      if (allData.karya) saveSectionData(ss, SHEETS.KARYA, allData.karya);
      if (allData.testimoni) saveSectionData(ss, SHEETS.TESTIMONI, allData.testimoni);
      if (allData.kompetensi) saveSectionData(ss, SHEETS.KOMPETENSI, allData.kompetensi);
      if (allData.edtech) saveSectionData(ss, SHEETS.EDTECH, allData.edtech);
      if (allData.timeline) saveSectionData(ss, SHEETS.TIMELINE, allData.timeline);
      if (allData.faq) saveSectionData(ss, SHEETS.FAQ, allData.faq);
      if (allData.nav_menus) saveSectionData(ss, SHEETS.NAV_MENUS, allData.nav_menus);
      if (allData.pelatihan) saveSectionData(ss, SHEETS.PELATIHAN, allData.pelatihan);

      return jsonResponse({ status: "success", message: "Seluruh data profil & database berhasil disimpan ke Spreadsheet!" });
    }

    // AKSI 8: UBAH PASSWORD ADMIN
    if (action === "changePassword") {
      var username = (body.username || "admin").trim();
      var oldPassword = (body.oldPassword || "").trim();
      var newPassword = (body.newPassword || "").trim();

      if (!newPassword || newPassword.length < 5) {
        return jsonResponse({ status: "error", message: "Password baru minimal 5 karakter!" });
      }

      var sheetUsers = getOrCreateSheet(ss, SHEETS.USERS);
      var rows = sheetUsers.getDataRange().getValues();
      var found = false;

      for (var r = 1; r < rows.length; r++) {
        if (rows[r][0] == username) {
          if (rows[r][1] != oldPassword) {
            return jsonResponse({ status: "error", message: "Password lama tidak sesuai!" });
          }
          sheetUsers.getRange(r + 1, 2).setValue(newPassword);
          found = true;
          break;
        }
      }

      if (found) {
        return jsonResponse({ status: "success", message: "Password admin berhasil diperbarui!" });
      } else {
        return jsonResponse({ status: "error", message: "Pengguna tidak ditemukan!" });
      }
    }

    return jsonResponse({ status: "error", message: "Aksi POST tidak dikenali" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// =========================================================================
// HELPER FUNCTIONS (PEMROSESAN SPREADSHEET & JSON)
// =========================================================================

function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function getConfigData(ss) {
  var sheet = getOrCreateSheet(ss, SHEETS.CONFIG);
  var values = sheet.getDataRange().getValues();
  var config = {};
  for (var i = 1; i < values.length; i++) {
    var key = values[i][0];
    var val = values[i][1];
    if (key) {
      config[key] = val;
    }
  }
  return config;
}

function saveConfigData(ss, configObj) {
  var sheet = getOrCreateSheet(ss, SHEETS.CONFIG);
  var values = sheet.getDataRange().getValues();
  var keyRowMap = {};
  
  for (var i = 1; i < values.length; i++) {
    var k = values[i][0];
    if (k) keyRowMap[k] = i + 1;
  }

  for (var key in configObj) {
    if (configObj.hasOwnProperty(key)) {
      var val = configObj[key];
      if (keyRowMap[key]) {
        sheet.getRange(keyRowMap[key], 2).setValue(val);
      } else {
        sheet.appendRow([key, val, "Custom User Key"]);
      }
    }
  }
}

function getSheetDataAsObjects(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0];
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var item = {};
    var hasContent = false;
    for (var j = 0; j < headers.length; j++) {
      var h = headers[j];
      var cellVal = row[j];
      item[h] = cellVal;
      if (cellVal !== "") hasContent = true;
    }
    if (hasContent) {
      result.push(item);
    }
  }

  return result;
}

function saveSectionData(ss, sheetName, items) {
  var sheet = getOrCreateSheet(ss, sheetName);
  if (!items || !items.length) {
    return;
  }

  var existingValues = sheet.getDataRange().getValues();
  var headers = [];

  if (existingValues.length > 0 && existingValues[0].length > 0 && existingValues[0][0] !== "") {
    headers = existingValues[0].slice();
    // Tambahkan header baru jika ada field di items yang belum terdaftar di baris 1 spreadsheet
    var headerLowerSet = {};
    for (var h = 0; h < headers.length; h++) {
      headerLowerSet[String(headers[h]).toLowerCase().trim()] = true;
    }
    for (var i = 0; i < items.length; i++) {
      for (var k in items[i]) {
        var kLower = String(k).toLowerCase().trim();
        if (!headerLowerSet[kLower] && typeof items[i][k] !== 'function') {
          headers.push(k);
          headerLowerSet[kLower] = true;
        }
      }
    }
  } else {
    // Buat header dari keys item pertama
    headers = Object.keys(items[0]);
  }

  // Khusus sheet Prestasi, pastikan selalu memiliki kolom berkas (PdfUrl & PdfFileName)
  if (sheetName === SHEETS.PRESTASI) {
    var hasPdfUrl = headers.some(function(h) { return String(h).toLowerCase() === 'pdfurl'; });
    var hasPdfFileName = headers.some(function(h) { return String(h).toLowerCase() === 'pdffilename'; });
    if (!hasPdfUrl) headers.push("PdfUrl");
    if (!hasPdfFileName) headers.push("PdfFileName");
  }

  sheet.clear();
  sheet.appendRow(headers);

  var rowsToAppend = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var row = [];
    for (var j = 0; j < headers.length; j++) {
      var h = headers[j];
      var val = item[h] !== undefined ? item[h] : "";
      if (val === "") {
        // Fallback case-insensitive & alias
        var hLower = h.toLowerCase();
        for (var key in item) {
          if (key.toLowerCase() === hLower && item[key] !== undefined) {
            val = item[key];
            break;
          }
        }
        if (val === "" && (h === "NamaWebsite" || h === "Judul")) val = item.title || item.nama || item.Nama || "";
        if (val === "" && (h === "Deskripsi" || h === "Snippet")) val = item.desc || item.deskripsi || item.snippet || "";
        if (val === "" && h === "Thumbnail") val = item.thumbnail || item.imgUrl || "";
        if (val === "" && h === "Link") val = item.link || item.url || "";
        if (val === "" && (h === "PdfUrl" || h === "pdfUrl")) val = item.pdfUrl || item.PdfUrl || "";
        if (val === "" && (h === "PdfFileName" || h === "pdfFileName")) val = item.pdfFileName || item.PdfFileName || "";
        if (val === "" && h === "ID") val = item.id || "";
      }
      row.push(val);
    }
    rowsToAppend.push(row);
  }

  if (rowsToAppend.length > 0) {
    sheet.getRange(2, 1, rowsToAppend.length, headers.length).setValues(rowsToAppend);
  }
}

function updateUserLastLogin(ss, username) {
  var sheet = getOrCreateSheet(ss, SHEETS.USERS);
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] == username) {
      sheet.getRange(i + 1, 5).setValue(new Date().toLocaleString("id-ID"));
      break;
    }
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

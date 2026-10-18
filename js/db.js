/**
 * =========================================================================
 * PROFILKU DATA STORE & GOOGLE APPS SCRIPT SYNC LAYER
 * =========================================================================
 * Mengelola data lokal (localStorage) dan sinkronisasi dua arah
 * dengan Google Spreadsheet melalui Google Apps Script Web App.
 * =========================================================================
 */

const DB = (function () {
  const STORAGE_KEY_DATA = 'profilku_data_v2';
  const STORAGE_KEY_GAS_URL = 'profilku_gas_url';
  const STORAGE_KEY_SESSION = 'profilku_admin_session';

  // Data Default Bawaan Lengkap
  const DEFAULT_DATA = {
    config: {
      site_title: "Profil Pendidik | Bpk. Muhammad Chusni Agus, M. Pd., Gr. - Guru Penggerak",
      teacher_name: "Muhammad Chusni Agus",
      teacher_degrees: "M. Pd., Gr.",
      teacher_tagline: "M. Pd., Gr. • Guru Penggerak",
      school_name: "SMK Telkom Malang",
      nuptk: "155766667130243",
      nip: "22880006",
      birth_info: "Malang, Jawa Timur",
      last_education: "S2 Magister Pendidikan Kejuruan - Universitas Negeri Malang",
      teacher_status: "Guru Sertifikasi",
      additional_role: "Kaur Prestasi, Laboratorium, Riset dan Inovasi",
      subjects_taught: "KIK, Informatika",
      city: "Kota Malang, Jawa Timur",
      address: "SMK Telkom Malang, Jawa Timur",
      official_email: "chusni@smktelkom-mlg.sch.id",
      personal_email: "chusni@smktelkom-mlg.sch.id",
      whatsapp_number: "6281234567890",
      hero_title: "Mendidik dengan Hati, Menginspirasi dengan Aksi & Teknologi",
      hero_desc: "Selamat datang di portal edukasi saya. Sebagai pendidik Matematika & Informatika, saya berkomitmen menghadirkan pembelajaran yang memanusiakan murid, interaktif, berbasis nalar kritis, dan relevan dengan tantangan abad ke-21.",
      hero_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      announcement_text: "Modul Ajar Matematika & Informatika Kurikulum Merdeka sudah tersedia untuk diunduh!",
      announcement_link: "#modul",
      philosophy_quote: "Pendidikan bukan sekadar mengisi bejana yang kosong, melainkan menyalakan lentera yang menerangi masa depan setiap anak bangsa.",
      bio_text1: "Bagi saya, ruang kelas bukan sekadar tempat mentransfer materi dan rumus, melainkan laboratorium pembentukan karakter nalar kritis, empati, dan ketangguhan mental murid.",
      bio_text2: "Melalui pendekatan Pembelajaran Berdiferensiasi dan integrasi EdTech (Education Technology), setiap peserta didik dihargai keunikan cara belajarnya—baik visual, auditori, maupun kinestetik.",
      stat_years: "12+",
      stat_students: "1.200+",
      stat_modules: "45+",
      stat_certs: "16+",
      badge_award: "Juara 1 Guru Inovatif Prov. Jabar",
      badge_snbt: "98% Siswa Lolos SNBT",
      youtube_url: "https://youtube.com",
      linkedin_url: "https://linkedin.com",
      instagram_url: "https://instagram.com",
      github_url: "https://github.com/chusni-moklet"
    },
    modul: [
      {
        id: "1",
        title: "Modul Ajar: Fungsi Eksponen & Logaritma Berdiferensiasi",
        category: "modul-ajar",
        badge: "Modul Ajar • Fase E (Kelas X)",
        fase: "Fase E (Kelas X)",
        snippet: "Dilengkapi pemetaan kebutuhan belajar murid, aktivitas kontekstual peluruhan radioaktif & bunga majemuk, serta asesmen formatif-sumatif lengkap.",
        fileNotice: "Modul_Ajar_Eksponen_Logaritma_FaseE.pdf",
        downloadLink: "#",
        cp: "Di akhir fase E, peserta didik dapat menggeneralisasi sifat-sifat bilangan berpangkat (termasuk bilangan pangkat pecahan), serta menerapkan barisan dan deret aritmetika dan geometri untuk memodelkan pertumbuhan dan peluruhan.",
        atp: "Mengidentifikasi sifat-sifat perkalian dan pembagian eksponen; Menyelesaikan permasalahan kontekstual pertumbuhan bakteri & bunga majemuk; Menggunakan logaritma sebagai invers dari operasi perpangkatan.",
        diferensiasi: "Konten audio-visual, komik matematika, dan produk laporan infografis/video/tulisan.",
        keywords: "eksponen logaritma fase e kelas 10 aljabar fungsi"
      },
      {
        id: "2",
        title: "LKPD Eksploratif: Vektor pada Ruang Berbantuan GeoGebra",
        category: "lkpd",
        badge: "LKPD Interaktif • Fase F (Kelas XI)",
        fase: "Fase F (Kelas XI)",
        snippet: "Lembar kerja siswa interaktif untuk mengkonstruksi konsep resultan gaya, perkalian titik (dot product), dan proyeksi ortogonal dengan barcode applet 3D.",
        fileNotice: "LKPD_Interaktif_Vektor_3D_GeoGebra.pdf",
        downloadLink: "#",
        cp: "Peserta didik dapat menyatakan vektor pada bidang dan ruang dimensi tiga, melakukan operasi aljabar pada vektor, serta menggunakannya untuk memecahkan masalah fisika dan geometri.",
        atp: "Aktivitas penemuan terbimbing: Menemukan rumus perkalian titik (Dot Product) dari sudut antara dua vektor ruang; Studi kasus aplikasi drone positioning dan navigasi GPS.",
        diferensiasi: "Flipped classroom dengan praktikum kolaboratif GeoGebra 3D di lab komputer.",
        keywords: "vektor geometri ruang fase f kelas 11 lkpd lembar kerja siswa"
      },
      {
        id: "3",
        title: "Mastery Kit Penalaran Matematika UTBK-SNBT 2025",
        category: "bank-soal",
        badge: "Bank Soal • Kelas XII / Alumni",
        fase: "Kelas XII / Alumni",
        snippet: "Kompilasi 150 soal HOTS penalaran kuantitatif disertai metode pembahasan cepat sistematis dan peta kelemahan konsep yang sering dihadapi calon mahasiswa.",
        fileNotice: "Mastery_Kit_UTBK_SNBT_Penalaran_Matematika_2025.pdf",
        downloadLink: "#",
        cp: "Dirancang sesuai kisi-kisi Asesmen Penalaran Matematika SNPMB terbaru yang menguji penalaran dalam situasi nyata kontekstual tanpa rumus rumit.",
        atp: "Penalaran Bilangan, Barisan, Geometri, Ketidakpastian/Peluang, dan Interpretasi Grafik Data Statistik.",
        diferensiasi: "Disertai catatan jebakan soal yang membedah kekeliruan umum siswa dalam membaca soal cerita panjang.",
        keywords: "snbt utbk penalaran matematika kuantitatif bank soal pembahasan"
      },
      {
        id: "4",
        title: "Slide Visual: Statistika Inferensial & Uji Hipotesis",
        category: "slide",
        badge: "Slide Presentasi • Fase F Tingkat Lanjut",
        fase: "Fase F Tingkat Lanjut",
        snippet: "Template presentasi menarik dan interaktif untuk menjelaskan distribusi normal, kurva lonceng Gauss, z-score, dan uji signifikansi data riil.",
        fileNotice: "Slide_Statistika_Inferensial_FaseF.pptx",
        downloadLink: "#",
        cp: "Deck presentasi interaktif 42 slide dengan animasi visual yang menjelaskan konsep kurva normal standar Gauss, nilai Z-score, taraf signifikansi, dan penarikan kesimpulan data riset ilmiah.",
        atp: "Memahami sebaran data normal, menghitung peluang z-score, dan merumuskan hipotesis nol & alternatif.",
        diferensiasi: "Dapat diedit bebas di PowerPoint atau Canva for Education dengan link kolaborasi guru.",
        keywords: "statistika inferensial peluang distribusi normal presentasi slide canva powerpoint"
      },
      {
        id: "5",
        title: "Handout Praktis: Logika Pemrograman & Algoritma Python",
        category: "modul-ajar",
        badge: "Modul Ajar • Informatika Fase E",
        fase: "Informatika Fase E",
        snippet: "Panduan ramah pemula untuk siswa SMA belajar logika percabangan, perulangan, dan pemecahan masalah komputasi tanpa beban sintaks rumit.",
        fileNotice: "Handout_Python_SMA_FaseE.pdf",
        downloadLink: "#",
        cp: "Siswa mampu memahami dekomposisi masalah, pengenalan pola, abstraksi, dan perancangan algoritma menggunakan bahasa pemrograman Python 3.",
        atp: "Dasar Variabel & Tipe Data, Logika Percabangan (if-else), Perulangan (loop), dan Mini-Project Perhitungan Rata-Rata Nilai.",
        diferensiasi: "Setiap bab dilengkapi latihan interaktif di Google Colab yang dapat dijalankan langsung di peramban siswa tanpa instalasi aplikasi tambahan.",
        keywords: "informatika python computational thinking berpikir komputasional fase e coding"
      },
      {
        id: "6",
        title: "Modul P5: \"Rekayasa & Teknologi Cerdas Hemat Energi Sekolah\"",
        category: "modul-ajar",
        badge: "Modul Projek P5 • Seluruh Jenjang SMA",
        fase: "Semua Jenjang SMA",
        snippet: "Panduan lengkap fasilitator projek penguatan profil pelajar Pancasila tema Rekayasa Teknologi, dilengkapi rubrik asesmen dimensi bernalar kritis & kreatif.",
        fileNotice: "Panduan_Projek_P5_Rekayasa_Teknologi_SMA.pdf",
        downloadLink: "#",
        cp: "Dimensi Profil Pelajar Pancasila: 1. Bernalar Kritis, 2. Gotong Royong, 3. Kreatif dalam memanfaatkan limbah elektronik untuk prototipe energi surya.",
        atp: "Observasi audit energi ruang kelas, perancangan miniatur panel surya cerdas, uji coba sensor gerak, dan expo gelar karya sekolah.",
        diferensiasi: "Dilengkapi lembar refleksi diri berkala, rubrik asesmen fasilitator projek, dan panduan expo gelar karya akhir semester.",
        keywords: "projek p5 rekayasa teknologi profil pelajar pancasila panduan fasilitator"
      }
    ],
    prestasi: [
      {
        id: "1",
        year: "2024",
        title: "Juara 1 Lomba Guru Inovatif SMA Tingkat Provinsi",
        issuer: "Dinas Pendidikan Provinsi Jawa Barat",
        category: "Juara",
        icon: "fa-trophy",
        desc: "Inovasi: \"MathSpace 3D: Aplikasi Web Augmented Reality untuk Visualisasi Geometri Ruang Siswa SMA Berdiferensiasi\".",
        highlight: true,
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        pdfFileName: "Piagam_Juara_1_Guru_Inovatif_Provinsi.pdf"
      },
      {
        id: "2",
        year: "2023",
        title: "Predikat Kelulusan Amat Baik Guru Penggerak (Angkatan 7)",
        issuer: "Direktorat Jenderal GTK Kemendikbudristek RI",
        category: "Sertifikasi",
        icon: "fa-certificate",
        desc: "Lulus program kepemimpinan pembelajaran selama 6 bulan intensif dengan proyek perubahan budaya positif dan komunitas praktisi sekolah.",
        highlight: false,
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        pdfFileName: "Sertifikat_Guru_Penggerak_Angkatan_7.pdf"
      },
      {
        id: "3",
        year: "2023",
        title: "Pembimbing Medali Perunggu OSN Matematika Tingkat Nasional",
        issuer: "Pusat Prestasi Nasional (Puspresnas)",
        category: "Pembina",
        icon: "fa-medal",
        desc: "Membimbing ananda Farhan Alamsyah (siswa SMAN 1 Harapan Bangsa) meraih Medali Perunggu Bidang Matematika SMA di OSN 2023.",
        highlight: false,
        pdfUrl: "",
        pdfFileName: ""
      },
      {
        id: "4",
        year: "2022",
        title: "Google Certified Educator Level 2",
        issuer: "Google for Education Global",
        category: "Sertifikasi",
        icon: "fa-brands fa-google",
        desc: "Sertifikasi keahlian tingkat lanjut dalam integrasi ekosistem Google Workspace for Education dalam alur manajemen kelas digital modern.",
        highlight: false,
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        pdfFileName: "Google_Certified_Educator_Level_2.pdf"
      },
      {
        id: "5",
        year: "2022",
        title: "Penulis Buku: \"Menyenangkan Belajar Matematika dengan Pendekatan STEAM\"",
        issuer: "Penerbit Eduka Mandiri • Ber-ISBN: 978-623-889-102-4",
        category: "Karya Tulis",
        icon: "fa-book-journal-whills",
        desc: "Buku panduan praktis bagi guru matematika jenjang SMP/SMA dalam mengaitkan konsep angka dengan sains, seni, dan teknologi terapan.",
        highlight: false,
        pdfUrl: "",
        pdfFileName: ""
      },
      {
        id: "6",
        year: "2021",
        title: "Guru Berprestasi & Berdedikasi Kota Bandung",
        issuer: "Pemerintah Kota Bandung & PGRI",
        category: "Penghargaan",
        icon: "fa-star",
        desc: "Apresiasi atas kontribusi pembuatan ratusan video tutorial pembelajaran terbuka gratis selama masa pembelajaran jarak jauh (PJJ).",
        highlight: false,
        pdfUrl: "",
        pdfFileName: ""
      }
    ],
    jadwal: [
      { id: "1", day: "senin", time: "07.15 - 08.00", title: "Upacara Bendera & Apel Pagi Guru", room: "Lapangan Utama SMAN 1 Harapan Bangsa", badge: "Agenda Sekolah", badgeColor: "bg-info", highlight: false },
      { id: "2", day: "senin", time: "08.00 - 10.15", title: "Matematika Wajib - Kelas X MIPA 1", room: "Ruang Kelas X-1 • Materi: Barisan & Deret Geometri", badge: "KBM Fase E", badgeColor: "bg-primary", highlight: true },
      { id: "3", day: "senin", time: "10.45 - 12.15", title: "Matematika Wajib - Kelas X MIPA 3", room: "Ruang Kelas X-3 • Materi: Barisan & Deret Aritmatika", badge: "KBM Fase E", badgeColor: "bg-primary", highlight: false },
      { id: "4", day: "senin", time: "13.30 - 15.00", title: "Jam Konsultasi Belajar Siswa & Tanya Tugas", room: "Ruang Guru / Perpustakaan Sekolah (Bebas mendaftar lebih awal)", badge: "Layanan Konsultasi", badgeColor: "bg-success", highlight: false },
      
      { id: "5", day: "selasa", time: "07.30 - 09.45", title: "Matematika Tingkat Lanjut - Kelas XI MIPA 2", room: "Ruang Kelas XI-2 • Materi: Polinomial & Suku Banyak", badge: "KBM Fase F", badgeColor: "bg-purple", highlight: false },
      { id: "6", day: "selasa", time: "10.15 - 12.30", title: "Matematika Tingkat Lanjut - Kelas XI MIPA 4", room: "Ruang Kelas XI-4 • Materi: Teorema Sisa & Faktor", badge: "KBM Fase F", badgeColor: "bg-purple", highlight: false },
      { id: "7", day: "selasa", time: "14.00 - 16.00", title: "Klinik OSN Matematika (Latihan Pembuktian Aljabar)", room: "Laboratorium Matematika / Ruang Bimbingan Olimpiade", badge: "Bimbingan Talenta", badgeColor: "bg-amber", highlight: false },

      { id: "8", day: "rabu", time: "07.15 - 09.30", title: "Informatika & Pemrograman Python - Kelas X-A", room: "Laboratorium Komputer 1 (Gedung IT)", badge: "Informatika Fase E", badgeColor: "bg-primary", highlight: false },
      { id: "9", day: "rabu", time: "10.00 - 12.15", title: "Informatika & Pemrograman Python - Kelas X-C", room: "Laboratorium Komputer 1 (Gedung IT)", badge: "Informatika Fase E", badgeColor: "bg-primary", highlight: false },
      { id: "10", day: "rabu", time: "13.30 - 15.30", title: "Koordinasi Fasilitator Projek P5 Tema Rekayasa", room: "Ruang Rapat Kurikulum / Lab Kolaborasi", badge: "Koordinasi Guru", badgeColor: "bg-info", highlight: false },

      { id: "11", day: "kamis", time: "07.30 - 09.45", title: "Matematika Peminatan - Kelas XII MIPA 1", room: "Ruang Kelas XII-1 • Materi: Limit Fungsi Trigonometri", badge: "KBM Fase F", badgeColor: "bg-purple", highlight: true },
      { id: "12", day: "kamis", time: "10.15 - 12.30", title: "Matematika Peminatan - Kelas XII MIPA 3", room: "Ruang Kelas XII-3 • Materi: Turunan Fungsi Trigonometri", badge: "KBM Fase F", badgeColor: "bg-purple", highlight: false },
      { id: "13", day: "kamis", time: "13.30 - 15.00", title: "Mentoring Komunitas Praktisi Guru Penggerak", room: "Ruang Guru / Daring via Google Meet", badge: "Pengembangan Diri", badgeColor: "bg-success", highlight: false },

      { id: "14", day: "jumat", time: "07.15 - 08.00", title: "Senam Sehat & Pembiasaan Karakter Pagi", room: "Lapangan Sekolah SMAN 1 Harapan Bangsa", badge: "Program Sekolah", badgeColor: "bg-info", highlight: false },
      { id: "15", day: "jumat", time: "08.15 - 10.30", title: "Pendampingan Lapangan Gelar Karya Projek P5", room: "Selasar Budaya & Ruang Pamer Sekolah", badge: "Projek P5", badgeColor: "bg-emerald", highlight: false },
      { id: "16", day: "jumat", time: "13.30 - 15.00", title: "Konsultasi Terbuka Wali Murid & Evaluasi Nilai", room: "Ruang Tamu Humas Sekolah / WhatsApp Hotline", badge: "Layanan Wali Murid", badgeColor: "bg-amber", highlight: false }
    ],
    galeri: [
      {
        id: "1",
        title: "Pembelajaran Matematika Kontekstual Berkelompok",
        category: "kelas",
        categoryLabel: "Suasana Kelas",
        imgUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
        desc: "Diskusi seru pemecahan masalah model matematika menggunakan papan interaktif."
      },
      {
        id: "2",
        title: "Gelar Karya P5: Rekayasa Prototipe Lampu Surya",
        category: "projek",
        categoryLabel: "Projek P5",
        imgUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
        desc: "Siswa mempresentasikan hasil rakitan sensor otomatis hemat energi."
      },
      {
        id: "3",
        title: "Lokakarya Berbagi Praktik Baik Kurikulum Merdeka",
        category: "pelatihan",
        categoryLabel: "Workshop Guru",
        imgUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
        desc: "Menjadi narasumber modul ajar berdiferensiasi bersama 60 guru SMA se-Kabupaten."
      },
      {
        id: "4",
        title: "Praktikum Pemrograman Algoritma Python",
        category: "kelas",
        categoryLabel: "Suasana Kelas",
        imgUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
        desc: "Membimbing siswa merancang simulasi perhitungan statistik mandiri di lab komputer."
      },
      {
        id: "5",
        title: "Bimbingan Intensif Kontingen OSN Matematika",
        category: "projek",
        categoryLabel: "Projek & Ekstrakurikuler",
        imgUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
        desc: "Sesi telaah teorema geometri lanjutan dan latihan simulasi kompetisi nasional."
      },
      {
        id: "6",
        title: "Penganugerahan Pendidik Berprestasi & Inovatif",
        category: "pelatihan",
        categoryLabel: "Prestasi & Pengakuan",
        imgUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
        desc: "Momentum penerimaan piagam penghargaan apresiasi guru teladan dari Dinas Pendidikan."
      }
    ],
    karya: [
      {
        id: "1",
        title: "Be-Ternak (Moklet)",
        desc: "Platform manajemen peternakan ayam KUB pedaging & KUB petelur presisi. Dilengkapi telemetri IoT, recording harian, FCR otomatis, dan monitoring HDP.",
        link: "https://grati-ternak.web.app",
        thumbnail: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "2",
        title: "Portal Modul & OER Kurikulum Merdeka",
        desc: "Repositori bahan ajar digital, lembar kerja peserta didik (LKPD), modul ajar berdiferensiasi Matematika Fase E & F, dan simulasi GeoGebra.",
        link: "https://rahmathidayat.guru",
        thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "3",
        title: "Klinik Olimpiade Sains & Penalaran",
        desc: "Platform persiapan intensif OSN Matematika dan drill soal penalaran kuantitatif SNBT berbasis nalar kritis dan komputasional.",
        link: "https://olimpiade-matematika.sch.id",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
      }
    ],
    testimoni: [
      {
        id: "1",
        name: "Farhan Alamsyah",
        role: "Alumni SMAN 1 • Mahasiswa STEI ITB (Peraih Medali OSN)",
        photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
        quote: "Dulu saya sangat takut dan trauma dengan matematika karena merasa rumusnya hafalan semua. Di kelas Pak Rahmat, kami diajak memahami alasan logis di balik rumus lewat visualisasi GeoGebra. Skor UTBK matematika saya naik drastis dan alhamdulillah diterima di STEI ITB!",
        rating: 5
      },
      {
        id: "2",
        name: "Dra. Hj. Nurjanah, M.M.",
        role: "Kepala Sekolah SMAN 1 Harapan Bangsa",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        quote: "Pak Rahmat adalah figur pendidik penggerak sejati. Inisiatif beliau membagikan modul ajar berdiferensiasi dan melatih rekan-rekan guru menggunakan platform digital telah mengangkat kualitas pembelajaran di sekolah kami secara nyata.",
        rating: 5
      },
      {
        id: "3",
        name: "Ibu Ratna Dewi, S.E.",
        role: "Orang Tua Murid Kelas XI MIPA 1",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        quote: "Komunikasi Pak Rahmat dengan kami para orang tua sangat transparan dan hangat. Beliau tidak hanya fokus pada nilai rapor, tetapi sangat peduli pada kesehatan mental dan minat belajar anak saya. Terima kasih banyak Pak Guru!",
        rating: 5
      }
    ],
    kompetensi: [
      {
        id: "1",
        tingkat: "Fase E & F (Kelas X, XI, XII)",
        judul: "Matematika Tingkat Lanjut & Wajib",
        desc: "Aljabar linear, geometri analitik, trigonometri lanjutan, kalkulus diferensial-integral, matriks, serta statistika inferensial dengan pendekatan pemecahan masalah kontekstual.",
        icon: "fa-square-root-variable",
        colorClass: "bg-blue-subtle text-blue",
        fiturList: [
          "Visualisasi Geometri dengan GeoGebra 3D",
          "Pemodelan Matematika Kasus Lingkungan & Bisnis",
          "Bimbingan Tuntas UTBK-SNBT Skolastik"
        ]
      },
      {
        id: "2",
        tingkat: "Program Sukses Ujian",
        judul: "Literasi & Penalaran Numerasi (AKM & SNBT)",
        desc: "Pelatihan intensif membaca grafik, menafsirkan data tabel, logika kuantitatif, dan estimasi cerdas untuk persiapan Asesmen Nasional dan seleksi masuk perguruan tinggi negeri impian.",
        icon: "fa-calculator",
        colorClass: "bg-emerald-subtle text-emerald",
        fiturList: [
          "Trik Cepat Nalar Matematis (Speed Math)",
          "Simulasi Computer-Based Test (CBT) Mingguan",
          "Bedah Tuntas Soal Asesmen Nasional HOTS"
        ]
      },
      {
        id: "3",
        tingkat: "Fase E & Literasi Digital",
        judul: "Informatika & Computational Thinking",
        desc: "Pengenalan berpikir komputasional, algoritma dan pemrograman dasar menggunakan Python, etika kecerdasan buatan (AI), analisis data, dan cybersecurity awareness untuk remaja.",
        icon: "fa-code",
        colorClass: "bg-purple-subtle text-purple",
        fiturList: [
          "Pemrograman Visual & Python Sederhana",
          "Pengolahan Data Spreadsheet & Data Dashboard",
          "Literasi Etika AI & Keamanan Data Siswa"
        ]
      },
      {
        id: "4",
        tingkat: "Ekstrakurikuler & Pembinaan Bakat",
        judul: "Klub Olimpiade Sains (OSN Matematika)",
        desc: "Pendampingan intensif bagi siswa berbakat matematika dengan silabus olimpiade: Teori Bilangan, Aljabar Lanjut, Kombinatorika, dan Geometri Euklidean.",
        icon: "fa-award",
        colorClass: "bg-amber-subtle text-amber",
        fiturList: [
          "Bank Soal OSN Kota, Provinsi, Nasional",
          "Mentoring 1-on-1 & Pembahasan Bukti Matematis",
          "Portofolio Prestasi Jalur Prestasi Mandiri PTN"
        ]
      }
    ],
    edtech: [
      { id: "1", name: "GeoGebra & Desmos", icon: "fa-solid fa-shapes", colorClass: "text-primary" },
      { id: "2", name: "Google Classroom & Workspace", icon: "fa-brands fa-google", colorClass: "text-danger" },
      { id: "3", name: "Canva for Education", icon: "fa-solid fa-palette", colorClass: "text-info" },
      { id: "4", name: "Quizizz & Kahoot Interaktif", icon: "fa-solid fa-gamepad", colorClass: "text-warning" },
      { id: "5", name: "Python & Jupyter Notebook", icon: "fa-brands fa-python", colorClass: "text-primary" },
      { id: "6", name: "Miro & Padlet Kolaborasi", icon: "fa-solid fa-chalkboard", colorClass: "text-success" }
    ],
    timeline: [
      {
        id: "1",
        year: "2023 - Sekarang",
        judul: "Fasilitator Daerah & Guru Penggerak Angkatan 7",
        institusi: "Kemendikbudristek RI",
        desc: "Memimpin diseminasi Kurikulum Merdeka, memfasilitasi lokakarya guru, dan mendampingi perancangan modul ajar berdiferensiasi di 14 sekolah mitra."
      },
      {
        id: "2",
        year: "2018 - 2021",
        judul: "Magister Pendidikan Matematika (S2) - IPK 3.92",
        institusi: "Institut Teknologi Bandung (ITB)",
        desc: "Fokus riset: \"Pengembangan Media Pembelajaran Spasial 3D Dinamis Berbasis Augmented Reality untuk Meningkatkan Kemampuan Spasial Siswa SMA\"."
      },
      {
        id: "3",
        year: "2015 - Sekarang",
        judul: "Guru Tetap Matematika & Pembina Tim Olimpiade (OSN)",
        institusi: "SMA Negeri 1 Harapan Bangsa",
        desc: "Mengajar Matematika Fase E dan F, mengkoordinir klub sains, serta membimbing siswa meraih medali di tingkat kota, provinsi, dan nasional."
      },
      {
        id: "4",
        year: "2008 - 2012",
        judul: "Sarjana Pendidikan Matematika (S1) - Cum Laude",
        institusi: "Universitas Pendidikan Indonesia (UPI)",
        desc: "Lulusan terbaik fakultas, aktif dalam BEM, Himpunan Mahasiswa Matematika, dan relawan pengajar komunitas pelosok daerah."
      }
    ],
    faq: [
      {
        id: "1",
        question: "Apakah seluruh materi ajar dan modul di web ini boleh diunduh gratis?",
        answer: "Ya, seluruh modul ajar, LKPD, dan kisi-kisi soal yang diunggah di situs ini berlisensi Open Educational Resources (OER). Anda bebas mengunduh, mempelajari, dan membagikannya kembali untuk kepentingan non-komersial pendidikan."
      },
      {
        id: "2",
        question: "Bagaimana alur pendaftaran bimbingan klinik olimpiade atau konsultasi privat?",
        answer: "Siswa atau orang tua cukup mengisi formulir pada menu Kontak di halaman ini atau mengirim pesan langsung via WhatsApp resmi. Jadwal akan disesuaikan dengan jam luang yang tersedia pada tab Jadwal Mengajar."
      },
      {
        id: "3",
        question: "Apakah Pak Rahmat bersedia diundang sebagai narasumber workshop Kurikulum Merdeka?",
        answer: "Tentu. Saya siap berkolaborasi sebagai pemateri lokakarya guru seputar Pembelajaran Berdiferensiasi, Pemanfaatan EdTech Geogebra/Python, maupun Asesmen Kurikulum Merdeka. Silakan kirimkan surat permohonan via email resmi."
      }
    ],
    pesanMasuk: [
      {
        id: "MSG-1",
        tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        nama: "Budi Santoso",
        peran: "Siswa",
        email: "budi@example.com",
        whatsapp: "081234567890",
        topik: "Konsultasi Belajar",
        pesan: "Halo Pak Rahmat, terima kasih atas modul ajar eksponennya. Sangat membantu tugas kelompok kami!",
        status: "Dibaca"
      }
    ]
  };

  // State memori runtime
  let currentData = null;
  const listeners = [];

  // Inisialisasi: Muat dari localStorage atau default
  function init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      if (stored) {
        currentData = JSON.parse(stored);
        // Pastikan semua key ada (backward compatibility)
        for (const k in DEFAULT_DATA) {
          if (!currentData[k]) currentData[k] = DEFAULT_DATA[k];
        }
        if (Array.isArray(currentData.prestasi)) {
          currentData.prestasi.forEach(p => {
            if (p.pdfUrl === undefined) {
              const def = DEFAULT_DATA.prestasi.find(x => x.id === p.id);
              p.pdfUrl = (def && def.pdfUrl) || '';
            }
            if (p.pdfFileName === undefined) {
              const def = DEFAULT_DATA.prestasi.find(x => x.id === p.id);
              p.pdfFileName = (def && def.pdfFileName) || '';
            }
          });
        }
      } else {
        currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        saveLocal();
      }
    } catch (e) {
      console.warn("Gagal membaca localStorage, memuat default data", e);
      currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }

  function saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(currentData));
      notifyListeners();
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage", e);
      // Fallback jika quota localStorage terlampaui (misal string Base64 besar)
      if (e && (e.name === 'QuotaExceededError' || e.code === 22 || e.number === -2147024882)) {
        try {
          const stripped = JSON.parse(JSON.stringify(currentData));
          if (Array.isArray(stripped.prestasi)) {
            stripped.prestasi.forEach(p => {
              if (p.pdfUrl && p.pdfUrl.startsWith('data:')) {
                p.pdfUrl = 'indexeddb:prestasi_' + p.id;
              }
            });
          }
          if (Array.isArray(stripped.modul)) {
            stripped.modul.forEach(m => {
              if (m.downloadLink && m.downloadLink.startsWith('data:')) {
                m.downloadLink = 'indexeddb:modul_' + m.id;
              }
            });
          }
          localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(stripped));
          console.log("Penyimpanan localStorage diamankan dengan referensi IndexedDB.");
          notifyListeners();
        } catch (innerErr) {
          console.error("Masih gagal menyimpan fallback ke localStorage:", innerErr);
        }
      }
    }
  }

  function notifyListeners() {
    listeners.forEach(fn => {
      try { fn(currentData); } catch (err) { console.error(err); }
    });
  }

  // Sinkronisasi otomatis antar-tab saat localStorage berubah di tab lain (misal di admin.html)
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY_DATA && e.newValue) {
        try {
          currentData = JSON.parse(e.newValue);
          notifyListeners();
        } catch (err) {
          console.warn("Cross-tab sync error:", err);
        }
      }
    });
  }

  // Ambil semua data
  function getAll() {
    if (!currentData) init();
    return currentData;
  }

  // Ambil bagian tertentu (config, modul, galeri, dll)
  function getSection(sectionName) {
    if (!currentData) init();
    return currentData[sectionName] || null;
  }

  // Simpan bagian tertentu ke memori & local storage
  function setSection(sectionName, data) {
    if (!currentData) init();
    currentData[sectionName] = data;
    saveLocal();
  }

  // Simpan seluruh data
  function setAll(data) {
    currentData = JSON.parse(JSON.stringify(data));
    saveLocal();
  }

  // Reset ke awal
  function resetToDefault() {
    currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveLocal();
    return currentData;
  }

  // URL Google Apps Script
  function getGASUrl() {
    return localStorage.getItem(STORAGE_KEY_GAS_URL) || '';
  }

  function setGASUrl(url) {
    const cleaned = (url || '').trim();
    localStorage.setItem(STORAGE_KEY_GAS_URL, cleaned);
    return cleaned;
  }

  // Tes Koneksi ke Google Apps Script Web App
  async function testConnection(customUrl) {
    const url = customUrl || getGASUrl();
    if (!url) {
      return { success: false, message: "URL Google Apps Script belum diisi." };
    }

    try {
      const testUrl = url + (url.includes('?') ? '&' : '?') + 'action=ping&_t=' + Date.now();
      const res = await fetch(testUrl, { method: 'GET' });
      const json = await res.json();
      if (json && json.status === 'success') {
        return { success: true, message: json.message || "Terhubung ke Google Spreadsheet!", timestamp: json.timestamp };
      }
      return { success: false, message: "Respon server tidak valid: " + JSON.stringify(json) };
    } catch (err) {
      return { success: false, message: "Koneksi gagal: " + err.message + ". Pastikan Deployment Apps Script diatur 'Anyone' (Siapa saja)." };
    }
  }

  // Sinkronisasi Ambil Data dari Google Spreadsheet (GET)
  async function syncFromGoogleSheets() {
    const url = getGASUrl();
    if (!url) {
      return { success: false, message: "URL Google Apps Script belum disetel." };
    }

    try {
      const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'action=getAll&_t=' + Date.now();
      const res = await fetch(fetchUrl, { method: 'GET' });
      const json = await res.json();

      if (json && json.status === 'success' && json.data) {
        // Normalisasi data dari sheets
        const incoming = json.data;
        if (incoming.config) currentData.config = Object.assign({}, currentData.config, incoming.config);
        if (Array.isArray(incoming.modul) && incoming.modul.length) {
          currentData.modul = incoming.modul.map(m => {
            const existing = (currentData.modul || []).find(x => String(x.id) === String(m.ID || m.id));
            let downloadLink = m.DownloadLink || m.downloadLink || '#';
            let fileNotice = m.FileNotice || m.fileNotice || '';
            // Pertahankan berkas lokal jika Google Sheets kosong atau referensi indexeddb
            if ((!downloadLink || downloadLink === '#' || downloadLink.startsWith('indexeddb:')) && existing && existing.downloadLink && existing.downloadLink !== '#') {
              downloadLink = existing.downloadLink;
              fileNotice = existing.fileNotice || fileNotice;
            }
            return {
              id: String(m.ID || m.id || ''),
              title: m.Judul || m.title || '',
              category: m.Kategori || m.category || 'modul-ajar',
              badge: m.Badge || m.badge || '',
              fase: m.Fase || m.fase || '',
              snippet: m.Snippet || m.snippet || '',
              fileNotice: fileNotice,
              downloadLink: downloadLink,
              cp: m.CP || m.cp || '',
              atp: m.ATP || m.atp || '',
              diferensiasi: m.Diferensiasi || m.diferensiasi || '',
              keywords: m.Keywords || m.keywords || ''
            };
          });
        }
        if (Array.isArray(incoming.prestasi) && incoming.prestasi.length) {
          currentData.prestasi = incoming.prestasi.map(p => {
            const existing = (currentData.prestasi || []).find(x => String(x.id) === String(p.ID || p.id));
            let pdfUrl = p.PdfUrl || p.pdfUrl || '';
            let pdfFileName = p.PdfFileName || p.pdfFileName || '';
            // Pertahankan berkas lokal jika Google Sheets kosong atau referensi indexeddb
            if ((!pdfUrl || pdfUrl.startsWith('indexeddb:')) && existing && existing.pdfUrl) {
              pdfUrl = existing.pdfUrl;
              pdfFileName = existing.pdfFileName || pdfFileName;
            }
            return {
              id: String(p.ID || p.id || ''),
              year: String(p.Tahun || p.year || ''),
              title: p.Judul || p.title || '',
              issuer: p.Penyelenggara || p.issuer || '',
              category: p.Kategori || p.category || '',
              icon: p.Icon || p.icon || 'fa-trophy',
              desc: p.Deskripsi || p.desc || '',
              highlight: String(p.Highlight || p.highlight).toUpperCase() === 'TRUE',
              pdfUrl: pdfUrl,
              pdfFileName: pdfFileName
            };
          });
        }
        if (Array.isArray(incoming.jadwal) && incoming.jadwal.length) {
          currentData.jadwal = incoming.jadwal.map(j => ({
            id: String(j.ID || j.id || ''),
            day: (j.Hari || j.day || 'senin').toLowerCase(),
            time: j.Waktu || j.time || '',
            title: j.Judul || j.title || '',
            room: j.Ruang || j.room || '',
            badge: j.Badge || j.badge || '',
            badgeColor: j.BadgeColor || j.badgeColor || 'bg-primary',
            highlight: String(j.Highlight || j.highlight).toUpperCase() === 'TRUE'
          }));
        }
        if (Array.isArray(incoming.galeri) && incoming.galeri.length) {
          currentData.galeri = incoming.galeri.map(g => ({
            id: String(g.ID || g.id || ''),
            title: g.Judul || g.title || '',
            category: (g.Kategori || g.category || 'kelas').toLowerCase(),
            categoryLabel: g.KategoriLabel || g.categoryLabel || '',
            imgUrl: g.ImgUrl || g.imgUrl || '',
            desc: g.Deskripsi || g.desc || ''
          }));
        }
        if (Array.isArray(incoming.karya) && incoming.karya.length) {
          currentData.karya = incoming.karya.map(k => ({
            id: String(k.ID || k.id || ''),
            title: k.NamaWebsite || k.title || k.Nama || '',
            desc: k.Deskripsi || k.desc || '',
            link: k.Link || k.link || '#',
            thumbnail: k.Thumbnail || k.thumbnail || k.ImgUrl || ''
          }));
        }
        if (Array.isArray(incoming.testimoni) && incoming.testimoni.length) {
          currentData.testimoni = incoming.testimoni.map(t => ({
            id: String(t.ID || t.id || ''),
            name: t.Nama || t.name || '',
            role: t.Peran || t.role || '',
            photo: t.FotoUrl || t.photo || '',
            quote: t.Quote || t.quote || '',
            rating: Number(t.Rating || t.rating || 5)
          }));
        }
        if (Array.isArray(incoming.kompetensi) && incoming.kompetensi.length) {
          currentData.kompetensi = incoming.kompetensi.map(k => ({
            id: String(k.ID || k.id || ''),
            tingkat: k.Tingkat || k.tingkat || '',
            judul: k.Judul || k.judul || '',
            desc: k.Deskripsi || k.desc || '',
            icon: k.Icon || k.icon || 'fa-book',
            colorClass: k.ColorClass || k.colorClass || 'bg-blue-subtle text-blue',
            fiturList: typeof k.FiturList === 'string' ? k.FiturList.split('|') : (k.fiturList || [])
          }));
        }
        if (Array.isArray(incoming.edtech) && incoming.edtech.length) {
          currentData.edtech = incoming.edtech.map(e => ({
            id: String(e.ID || e.id || ''),
            name: e.Nama || e.name || '',
            icon: e.Icon || e.icon || 'fa-solid fa-shapes',
            colorClass: e.ColorClass || e.colorClass || 'text-primary'
          }));
        }
        if (Array.isArray(incoming.timeline) && incoming.timeline.length) {
          currentData.timeline = incoming.timeline.map(tl => ({
            id: String(tl.ID || tl.id || ''),
            year: tl.Tahun || tl.year || '',
            judul: tl.Judul || tl.judul || '',
            institusi: tl.Institusi || tl.institusi || '',
            desc: tl.Deskripsi || tl.desc || ''
          }));
        }
        if (Array.isArray(incoming.faq) && incoming.faq.length) {
          currentData.faq = incoming.faq.map(f => ({
            id: String(f.ID || f.id || ''),
            question: f.Pertanyaan || f.question || '',
            answer: f.Jawaban || f.answer || ''
          }));
        }
        if (Array.isArray(incoming.pesanMasuk)) {
          currentData.pesanMasuk = incoming.pesanMasuk.map(pm => ({
            id: String(pm.ID || pm.id || ''),
            tanggal: pm.Tanggal || pm.tanggal || '',
            nama: pm.Nama || pm.nama || '',
            peran: pm.Peran || pm.peran || '',
            email: pm.Email || pm.email || '',
            whatsapp: pm.WhatsApp || pm.whatsapp || '',
            topik: pm.Topik || pm.topik || '',
            pesan: pm.Pesan || pm.pesan || '',
            status: pm.Status || pm.status || 'Baru'
          }));
        }

        saveLocal();
        return { success: true, message: "Berhasil menyinkronkan data dari Google Spreadsheet!" };
      } else {
        return { success: false, message: json.message || "Format data tidak sesuai." };
      }
    } catch (err) {
      return { success: false, message: "Gagal mengambil data dari Google Apps Script: " + err.message };
    }
  }

  // Sinkronisasi Simpan Seluruh Data ke Google Spreadsheet (POST)
  async function syncToGoogleSheets() {
    const url = getGASUrl();
    if (!url) {
      return { success: false, message: "URL Google Apps Script belum disetel. Data hanya tersimpan di browser (Lokal)." };
    }

    try {
      const payload = {
        action: 'saveAll',
        data: {
          config: currentData.config,
          modul: (currentData.modul || []).map(m => {
            let safeLink = m.downloadLink || '#';
            if (safeLink.startsWith('data:') && safeLink.length > 500) {
              safeLink = 'indexeddb:modul_' + m.id;
            }
            return Object.assign({}, m, { downloadLink: safeLink });
          }),
          prestasi: (currentData.prestasi || []).map(p => {
            let safePdfUrl = p.pdfUrl || '';
            if (safePdfUrl.startsWith('data:') && safePdfUrl.length > 500) {
              safePdfUrl = 'indexeddb:prestasi_' + p.id;
            }
            return {
              ID: p.id,
              id: p.id,
              Tahun: p.year,
              year: p.year,
              Judul: p.title,
              title: p.title,
              Penyelenggara: p.issuer,
              issuer: p.issuer,
              Kategori: p.category,
              category: p.category,
              Icon: p.icon,
              icon: p.icon,
              Deskripsi: p.desc,
              desc: p.desc,
              Highlight: p.highlight,
              highlight: p.highlight,
              PdfUrl: safePdfUrl,
              pdfUrl: safePdfUrl,
              PdfFileName: p.pdfFileName || '',
              pdfFileName: p.pdfFileName || ''
            };
          }),
          jadwal: currentData.jadwal,
          galeri: currentData.galeri,
          karya: (currentData.karya || []).map(k => ({
            ID: k.id,
            id: k.id,
            NamaWebsite: k.title,
            title: k.title,
            Deskripsi: k.desc,
            desc: k.desc,
            Link: k.link,
            link: k.link,
            Thumbnail: k.thumbnail,
            thumbnail: k.thumbnail
          })),
          testimoni: currentData.testimoni,
          kompetensi: currentData.kompetensi.map(k => ({
            ID: k.id,
            Tingkat: k.tingkat,
            Judul: k.judul,
            Deskripsi: k.desc,
            Icon: k.icon,
            ColorClass: k.colorClass,
            FiturList: Array.isArray(k.fiturList) ? k.fiturList.join('|') : k.fiturList
          })),
          edtech: currentData.edtech,
          timeline: currentData.timeline,
          faq: currentData.faq
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json && json.status === 'success') {
        return { success: true, message: "Berhasil menyimpan semua perubahan ke Google Spreadsheet!" };
      }
      return { success: false, message: json.message || "Gagal menyimpan ke Google Spreadsheet." };
    } catch (err) {
      return { success: false, message: "Koneksi simpan gagal: " + err.message };
    }
  }

  // Kirim Pesan Pengunjung dari Form Kontak Website
  async function submitVisitorMessage(msgData) {
    if (!currentData) init();

    const newId = "MSG-" + Date.now();
    const dateFormatted = new Date().toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });

    const msgObj = {
      id: newId,
      tanggal: dateFormatted,
      nama: msgData.name || "-",
      peran: msgData.role || "Umum",
      email: msgData.email || "-",
      whatsapp: msgData.whatsapp || "-",
      topik: msgData.subject || "Konsultasi Belajar",
      pesan: msgData.message || "-",
      status: "Baru"
    };

    if (!Array.isArray(currentData.pesanMasuk)) {
      currentData.pesanMasuk = [];
    }
    currentData.pesanMasuk.unshift(msgObj);
    saveLocal();

    // Kirim juga ke Google Apps Script di background jika URL tersedia
    const url = getGASUrl();
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'sendMessage',
            name: msgData.name,
            role: msgData.role,
            email: msgData.email,
            whatsapp: msgData.whatsapp,
            subject: msgData.subject,
            message: msgData.message
          })
        }).catch(e => console.warn("Background GAS message submit error:", e));
      } catch (err) {
        console.warn("GAS message submit error:", err);
      }
    }

    return { success: true, id: newId };
  }

  // Update Status Pesan Masuk (Admin)
  async function updateMessageStatus(id, newStatus) {
    if (!currentData) init();
    const item = currentData.pesanMasuk.find(m => m.id === id);
    if (item) {
      item.status = newStatus;
      saveLocal();

      const url = getGASUrl();
      if (url) {
        try {
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'updateMessageStatus', id: id, status: newStatus })
          }).catch(e => console.warn(e));
        } catch (e) {}
      }
      return true;
    }
    return false;
  }

  // Hapus Pesan Masuk (Admin)
  async function deleteMessage(id) {
    if (!currentData) init();
    currentData.pesanMasuk = currentData.pesanMasuk.filter(m => m.id !== id);
    saveLocal();

    const url = getGASUrl();
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'deleteMessage', id: id })
        }).catch(e => console.warn(e));
      } catch (e) {}
    }
    return true;
  }

  // Autentikasi Admin (Login & Logout)
  async function login(username, password) {
    const u = (username || '').trim();
    const p = (password || '').trim();

    if (!u || !p) {
      return { success: false, message: "Username dan password wajib diisi." };
    }

    const gasUrl = getGASUrl();
    if (gasUrl) {
      // Coba autentikasi via Google Apps Script
      try {
        const res = await fetch(gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'login', username: u, password: p })
        });
        const json = await res.json();
        if (json && json.status === 'success') {
          const session = {
            username: u,
            name: json.user ? json.user.name : "Administrator",
            role: json.user ? json.user.role : "Admin",
            token: json.token || 'gas_session_' + Date.now(),
            loginTime: Date.now()
          };
          sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
          // Sinkron data otomatis setelah login
          syncFromGoogleSheets().catch(e => console.warn(e));
          return { success: true, user: session };
        } else {
          // Jika GAS menolak karena kredensial salah, berikan error spesifik
          if (json && json.message) {
            return { success: false, message: json.message };
          }
        }
      } catch (err) {
        console.warn("GAS login error, mencoba fallback offline credentials...", err);
      }
    }

    // Fallback Offline / Default Administrator
    const savedLocalAdmin = JSON.parse(localStorage.getItem('profilku_admin_cred') || '{"username":"admin","password":"password"}');
    if (u === savedLocalAdmin.username && p === savedLocalAdmin.password) {
      const session = {
        username: u,
        name: "Bpk. Rahmat Hidayat",
        role: "Administrator (Mode Lokal)",
        token: 'local_session_' + Date.now(),
        loginTime: Date.now()
      };
      sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      return { success: true, user: session, note: "Login mode lokal/demo" };
    }

    return { success: false, message: "Username atau password salah! (Default: admin / password)" };
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
  }

  function getSession() {
    try {
      const sess = sessionStorage.getItem(STORAGE_KEY_SESSION);
      return sess ? JSON.parse(sess) : null;
    } catch (e) {
      return null;
    }
  }

  function isLoggedIn() {
    return !!getSession();
  }

  // Ubah Password Admin Lokal
  async function changePassword(oldPassword, newPassword) {
    if (!newPassword || newPassword.length < 5) {
      return { success: false, message: "Password baru minimal 5 karakter." };
    }

    const savedLocalAdmin = JSON.parse(localStorage.getItem('profilku_admin_cred') || '{"username":"admin","password":"password"}');
    if (oldPassword !== savedLocalAdmin.password) {
      return { success: false, message: "Password lama tidak sesuai." };
    }

    savedLocalAdmin.password = newPassword;
    localStorage.setItem('profilku_admin_cred', JSON.stringify(savedLocalAdmin));

    // Kirim juga ke Google Apps Script jika terhubung
    const url = getGASUrl();
    if (url) {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'changePassword',
            username: savedLocalAdmin.username,
            oldPassword: oldPassword,
            newPassword: newPassword
          })
        }).catch(e => console.warn(e));
      } catch (e) {}
    }

    return { success: true, message: "Password admin berhasil diubah!" };
  }

  // Backup & Restore
  function exportBackup() {
    return JSON.stringify(getAll(), null, 2);
  }

  function importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.config) {
        setAll(parsed);
        return { success: true, message: "Data berhasil dipulihkan dari backup!" };
      }
      return { success: false, message: "Format backup tidak valid." };
    } catch (e) {
      return { success: false, message: "Gagal membaca berkas JSON: " + e.message };
    }
  }

  /* --------------------------------------------------
     INDEXEDDB STORE UNTUK BERKAS PDF BESAR
     (Mencegah QuotaExceededError pada LocalStorage & Google Sheets)
     -------------------------------------------------- */
  const PdfStore = (function() {
    const DB_NAME = 'ProfilGuruPdfStore';
    const DB_VERSION = 1;
    const STORE_NAME = 'pdf_files';
    let dbInstance = null;

    function openDB() {
      return new Promise((resolve, reject) => {
        if (dbInstance) return resolve(dbInstance);
        if (typeof window === 'undefined' || !window.indexedDB) {
          return reject(new Error('IndexedDB tidak didukung oleh browser ini.'));
        }
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };
        req.onsuccess = (e) => {
          dbInstance = e.target.result;
          resolve(dbInstance);
        };
        req.onerror = (e) => reject(e.target.error);
      });
    }

    async function savePdf(id, dataUrl, fileName) {
      if (!id || !dataUrl) return false;
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction([STORE_NAME], 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.put({
            id: String(id),
            dataUrl: dataUrl,
            fileName: fileName || 'Dokumen.pdf',
            updatedAt: Date.now()
          });
          tx.oncomplete = () => resolve(true);
          tx.onerror = (e) => reject(e.target.error);
        });
      } catch (err) {
        console.warn('Gagal menyimpan PDF ke IndexedDB:', err);
        return false;
      }
    }

    async function getPdf(id) {
      if (!id) return null;
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction([STORE_NAME], 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(String(id));
          req.onsuccess = (e) => resolve(e.target.result || null);
          req.onerror = (e) => reject(e.target.error);
        });
      } catch (err) {
        console.warn('Gagal membaca PDF dari IndexedDB:', err);
        return null;
      }
    }

    async function deletePdf(id) {
      if (!id) return false;
      try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction([STORE_NAME], 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.delete(String(id));
          tx.oncomplete = () => resolve(true);
          tx.onerror = (e) => reject(e.target.error);
        });
      } catch (err) {
        console.warn('Gagal menghapus PDF dari IndexedDB:', err);
        return false;
      }
    }

    return {
      openDB,
      savePdf,
      getPdf,
      deletePdf
    };
  })();

  // Helper Universal untuk membuka / melihat berkas PDF & Gambar (Mendukung IndexedDB, base64 Data URL, Blob, maupun Link URL)
  async function openPdfDocument(pdfUrl, fileName = 'Dokumen.pdf') {
    if (!pdfUrl || pdfUrl === '#') {
      alert('Berkas (PDF / Gambar) belum tersedia atau belum diunggah.');
      return;
    }

    // 1. Jika disimpan di IndexedDB (indexeddb:id_dokumen)
    if (pdfUrl.startsWith('indexeddb:')) {
      const id = pdfUrl.replace('indexeddb:', '').trim();
      try {
        const record = await PdfStore.getPdf(id);
        if (record && record.dataUrl) {
          openPdfDocument(record.dataUrl, record.fileName || fileName);
          return;
        } else {
          alert('Berkas di penyimpanan lokal tidak ditemukan atau telah dibersihkan oleh browser.');
          return;
        }
      } catch (err) {
        console.error('Error membaca berkas dari IndexedDB:', err);
        alert('Gagal memuat berkas dari penyimpanan browser.');
        return;
      }
    }

    // 2. Jika berupa Base64 Data URL (data:application/pdf... atau data:image/...)
    if (pdfUrl.startsWith('data:')) {
      try {
        const parts = pdfUrl.split(';base64,');
        const contentType = (parts[0] ? parts[0].replace('data:', '') : '') || 'application/pdf';
        const base64Data = parts[1] || parts[0];
        const binaryStr = atob(base64Data);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        const newWin = window.open(blobUrl, '_blank');
        if (!newWin) {
          // Jika diblokir pop-up blocker browser, gunakan simulasi klik download
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = fileName || 'Dokumen';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => a.remove(), 500);
        }
        return;
      } catch (err) {
        console.error('Gagal membuka Blob Dokumen:', err);
      }
    }

    // 3. Jika berupa URL biasa (Google Drive, cloud storage, direct link)
    window.open(pdfUrl, '_blank');
  }

  // Listener untuk reaktif render di UI
  function onDataChanged(callback) {
    if (typeof callback === 'function') {
      listeners.push(callback);
    }
  }

  // Inisialisasi awal saat script dimuat
  init();

  return {
    getAll,
    getSection,
    setSection,
    setAll,
    resetToDefault,
    getGASUrl,
    setGASUrl,
    testConnection,
    syncFromGoogleSheets,
    syncToGoogleSheets,
    submitVisitorMessage,
    updateMessageStatus,
    deleteMessage,
    login,
    logout,
    getSession,
    isLoggedIn,
    changePassword,
    exportBackup,
    importBackup,
    openPdfDocument,
    openDocument: openPdfDocument,
    PdfStore,
    onDataChanged,
    DEFAULT_DATA
  };
})();

// Ekspor ke window agar bisa diakses di main.js & admin.js
window.DB = DB;
window.openPdfDocument = DB.openPdfDocument;
window.openDocument = DB.openPdfDocument;

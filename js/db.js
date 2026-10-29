/**
 * =========================================================================
 * PROFILKU DATA STORE & GOOGLE APPS SCRIPT SYNC LAYER
 * =========================================================================
 * Mengelola data lokal (localStorage) dan sinkronisasi dua arah
 * dengan Google Spreadsheet melalui Google Apps Script Web App.
 * =========================================================================
 */

const DB = (function () {
  const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbxSOTYBQCo78xH_SyR9iomP9Kr442SDY2vPgWVba2D3b1o2ZnaqkaDgqy61tLdpH2It/exec';
  const STORAGE_KEY_DATA = 'profilku_data_v3';
  const STORAGE_KEY_GAS_URL = 'profilku_gas_url';
  const STORAGE_KEY_SESSION = 'profilku_admin_session';

  // Data Default Bawaan Lengkap
  const DEFAULT_DATA = {
  "config": {
    "site_title": "Profil Pendidik | Bpk. Muhammad Chusni Agus, M. Pd., Gr. - Guru Penggerak",
    "teacher_name": "Muhammad Chusni Agus",
    "teacher_degrees": "M. Pd., Gr.",
    "teacher_tagline": "Guru Penggerak",
    "school_name": "SMK Telkom Malang",
    "nuptk": 155766667130243,
    "nip": 22880006,
    "birth_info": "Bandung, 15 April 1988",
    "last_education": "S2 Magister Pendidikan Kejuruan - UM",
    "teacher_status": "Guru Sertifikasi",
    "additional_role": "Kepala Urusan Laboratorium",
    "subjects_taught": "KIK, Informatika",
    "city": "Kota Malang, Jawa Timur",
    "address": "Jl. Danau Ranau, Sawojajar, Kec. Kedungkandang, Kota Malang, Jawa Timur 65139",
    "official_email": "chusni@smktelkom-mlg.sch.id",
    "personal_email": "chusniarin12@gmail.com",
    "whatsapp_number": 6285106655664,
    "hero_title": "Mendidik dengan Hati, Menginspirasi dengan Aksi & Teknologi",
    "hero_desc": "Selamat datang di portal edukasi saya. Sebagai pendidik Matematika & Informatika, saya berkomitmen menghadirkan pembelajaran yang memanusiakan murid, interaktif, berbasis nalar kritis, dan relevan dengan tantangan abad ke-21.",
    "hero_image": "assets/hero-chusni.jpg",
    "announcement_text": "Modul Ajar KIK Fase E & F (Kurikulum Merdeka) Semester Genap sudah tersedia untuk diunduh!",
    "announcement_link": "#modul",
    "philosophy_quote": "Pendidikan bukan sekadar mengisi bejana yang kosong, melainkan menyalakan lentera yang menerangi masa depan setiap anak bangsa.",
    "bio_text1": "Bagi saya, ruang kelas bukan sekadar tempat mentransfer rumus dan angka, melainkan laboratorium pembentukan karakter nalar kritis, empati, dan ketangguhan mental murid.",
    "bio_text2": "Melalui pendekatan Pembelajaran Berdiferensiasi dan integrasi EdTech (Education Technology), setiap peserta didik dihargai keunikan cara belajarnya—baik visual, auditori, maupun kinestetik.",
    "stat_years": "12+",
    "stat_students": "1.200+",
    "stat_modules": "45+",
    "stat_certs": "16+",
    "badge_award": "Juara 1 Guru Inovatif Prov. Jabar",
    "badge_snbt": "98% Siswa Lolos SNBT",
    "youtube_url": "https://www.youtube.com/@MUHAMMADCHUSNIAGUSSPd",
    "linkedin_url": "https://www.linkedin.com/in/muhammad-chusni-agus-a12846300/",
    "instagram_url": "https://www.instagram.com/chusniarin12/",
    "github_url": "https://github.com/chusni-moklet",
    "badge_award_sub": "Tingkat Provinsi Jawa Barat",
    "badge_award_icon": "fa-solid fa-trophy",
    "badge_award_color": "bg-amber",
    "badge_award_hide": "false",
    "badge_snbt_sub": "Bimbingan Penalaran Matematika",
    "badge_snbt_icon": "fa-solid fa-user-graduate",
    "badge_snbt_color": "bg-emerald",
    "badge_snbt_hide": "false",
    "badge_module": "28+ Modul Merdeka",
    "badge_module_sub": "Siap Pakai & Berdiferensiasi",
    "badge_module_icon": "fa-solid fa-book-bookmark",
    "badge_module_color": "bg-blue",
    "badge_module_hide": "false",
    "hero_tag_badge": "Guru Penggerak Kemendikdasmen",
    "hero_tag_sub": "SMK Telkom Malang",
    "pendampingan_subtitle": "Pendampingan & Profil Pendidik",
    "pendampingan_title": "Pendampingan Belajar, Karakter & Transformasi Digital",
    "pendampingan_desc": "Mewujudkan filosofi Ki Hajar Dewantara: \"Ing ngarsa sung tuladha, ing madya mangun karsa, tut wuri handayani\" melalui pendampingan akademik personal, pembinaan bakat talenta murid, dan kepemimpinan pembelajaran Guru Penggerak.",
    "pillar1_title": "Pendampingan Belajar Berpusat Pada Murid",
    "pillar1_desc": "Coaching akademik personal dan pembelajaran berdiferensiasi sesuai kodrat alam dan zaman murid.",
    "pillar2_title": "Pendampingan Riset, Inovasi & Lomba Siswa",
    "pillar2_desc": "Membina karya aplikasi digital, kompetisi IoT & Drone, hingga perlindungan HKI produk inovasi siswa.",
    "pillar3_title": "Kepemimpinan Guru Penggerak (P5)",
    "pillar3_desc": "Pengimbasan budaya positif sekolah, fasilitasi komunitas praktisi, dan Profil Pelajar Pancasila."
  },
  "modul": [
    {
        "id": "1",
        "title": "Modul Ajar: Pemrograman Visual Scratch & Logika Algoritma",
        "category": "modul-ajar",
        "badge": "Modul Ajar • Informatika Fase E",
        "fase": "Fase E (Kelas X)",
        "snippet": "Panduan praktis bagi siswa mempelajari konsep algoritma percabangan dan perulangan secara visual melalui pembuatan aplikasi hitung luas segitiga dan mini games interaktif.",
        "fileNotice": "Modul Scratch - Hitung Luas Segitiga.pdf",
        "downloadLink": "#",
        "cp": "Memahami konsep computational thinking dan merancang algoritma terstruktur dengan perkakas visual.",
        "atp": "Pengenalan blok Scratch, variabel, kondisional if-else, perulangan, dan pemecahan masalah kontekstual.",
        "diferensiasi": "Proyek bertingkat dari animasi cerita sederhana hingga pembuatan game interaktif.",
        "keywords": "scratch algoritma pemrograman visual fase e informatika logika komputasi luas segitiga"
    },
    {
        "id": "2",
        "title": "Handout Praktis: Pembuatan Game Edukatif Menggunakan Roblox Studio",
        "category": "modul-ajar",
        "badge": "Modul Ajar • Game Dev Fase E & F",
        "fase": "Fase E & F (Kelas X - XII)",
        "snippet": "Langkah demi langkah merancang lingkungan 3D, mekanik pemain, dan pemrograman skrip dasar Lua di Roblox Studio untuk pembelajaran gamifikasi.",
        "fileNotice": "Handout_Roblox_Studio_Game_Dev.pdf",
        "downloadLink": "#",
        "cp": "Menerapkan pemikiran algoritmik dan mekanika ruang dalam pengembangan media simulasi interaktif.",
        "atp": "Setup workspace Roblox Studio, manipulasi part 3D, scripting basic Lua, dan playtesting multiplayer.",
        "diferensiasi": "Siswa dapat memilih peran programmer, level designer, atau asset creator.",
        "keywords": "roblox studio game development lua 3d informatika smk telkom"
    },
    {
        "id": "3",
        "title": "Panduan Praktis: Modul KIK - Inkubasi Bisnis & Live Commerce Siswa",
        "category": "modul-ajar",
        "badge": "Modul Ajar • KIK Fase F",
        "fase": "Fase F (Kelas XI & XII)",
        "snippet": "Panduan pembelajaran kewirausahaan digital berbasis proyek menggunakan platform Moklive untuk melatih siswa melakukan kataloging produk dan live selling dengan AI copywriting.",
        "fileNotice": "Panduan_KIK_Kewirausahaan_Digital_Moklive.pdf",
        "downloadLink": "#",
        "cp": "Mengembangkan ide wirausaha digital yang layak jual dan memanfaatkan platform digital marketing.",
        "atp": "Riset pasar produk, pembuatan copywriting produk dengan AI, setup streaming katalog, evaluasi omzet.",
        "diferensiasi": "Pembagian role tim sesuai minat bisnis: marketing specialist, teknis stream, atau content creator.",
        "keywords": "kik kewirausahaan digital moklive live commerce pemasaran digital ai smk"
    },
    {
        "id": "4",
        "title": "LKPD Interaktif: Pemodelan Virtual Reality & Augmented Reality dengan Unity",
        "category": "lkpd",
        "badge": "LKPD Interaktif • Fase F Kejuruan",
        "fase": "Fase F (Kelas XI / XII)",
        "snippet": "Lembar kerja eksplorasi integrasi model 3D ke dalam aplikasi AR/VR untuk media promosi dan edukasi interaktif masa depan.",
        "fileNotice": "LKPD_AR_VR_Unity_Development.pdf",
        "downloadLink": "#",
        "cp": "Merancang antarmuka imersif untuk menyajikan data dan objek visual secara kontekstual.",
        "atp": "Import asset 3D, konfigurasi target image AR, build aplikasi mobile, dan pengujian interaktivitas.",
        "diferensiasi": "Panduan visual step-by-step untuk siswa pemula dan tantangan coding C# untuk siswa mahir.",
        "keywords": "ar vr unity augmented reality lkpd interaktif smk telkom virtual reality"
    },
    {
        "id": "5",
        "title": "Slide Presentasi: Literasi Digital, Etika AI & Cyber Security Siswa",
        "category": "slide",
        "badge": "Slide Presentasi • Seluruh Jenjang",
        "fase": "Semua Tingkat SMK",
        "snippet": "Materi visual komprehensif mengenai privasi data, jejak digital, pemanfaatan GenAI secara bertanggung jawab, serta persiapan sertifikasi IC3 Digital Literacy.",
        "fileNotice": "Slide_Literasi_Digital_Etika_AI.pptx",
        "downloadLink": "#",
        "cp": "Memahami aspek hukum, privasi, dan etika dalam pemanfaatan teknologi informasi dan kecerdasan buatan.",
        "atp": "36 slide visual interaktif siap pakai untuk KBM Informatika maupun seminar siswa.",
        "diferensiasi": "Dapat diedit bebas di PowerPoint atau Canva for Education.",
        "keywords": "literasi digital etika ai cyber security presentasi canva pptx ic3"
    },
    {
        "id": "6",
        "title": "Modul Projek P5: Rekayasa Teknologi IoT untuk Ketahanan Lingkungan",
        "category": "modul-ajar",
        "badge": "Modul Projek P5 • Fase E & F",
        "fase": "Fase E & F (Seluruh Siswa)",
        "snippet": "Panduan fasilitator P5 tema Rekayasa & Teknologi, studi kasus sistem telemetri sensor suhu, kelembaban, dan pakan otomatis peternakan cerdas (Be-Ternak).",
        "fileNotice": "Modul_P5_Rekayasa_Teknologi_IoT.pdf",
        "downloadLink": "#",
        "cp": "Menganalisis permasalahan riil di masyarakat dan merancang solusi rekayasa teknologi hemat energi.",
        "atp": "Identifikasi masalah lingkungan, perakitan mikrokontroler sensor, visualisasi dashboard, expo karya.",
        "diferensiasi": "Rubrik penilaian komprehensif dimensi Bernalar Kritis, Mandiri, dan Kreatif.",
        "keywords": "projek p5 rekayasa teknologi iot be-ternak smk kurikulum merdeka"
    }
],
  "prestasi": [
    {
      "id": "1793275660253",
      "year": "2026",
      "title": "Juara 2 - Anugerah Guru dan Kepala Sekolah Prima 2026",
      "issuer": "PGRI",
      "category": "Juara 2 Kota",
      "icon": "fa-trophy",
      "desc": "Kompetisi Best Practice Pembelajaran dengan AI",
      "highlight": false,
      "pdfUrl": "assets/docs/Juara 2 AGP 2026.jpeg",
      "pdfFileName": "Juara 2 AGP 2026.jpeg"
    },
    {
      "id": "1792285809157",
      "year": "2026",
      "title": "HKI - Portofolio",
      "issuer": "Dirjen HKI",
      "category": "HKI",
      "icon": "fa-trophy",
      "desc": "platform inovatif yang secara khusus menghubungkan portofolio para siswa dengan dunia industri teknologi. Melalui ekosistem terpadu ini, siswa dapat membuat CV dan menampilkan karya mereka. Sebaliknya, perusahaan mendapat kemudahan mencari dan merekrut talenta digital terverifikasi yang siap bekerja untuk memajukan bisnis mereka secara profesional.",
      "highlight": false,
      "pdfUrl": "assets/docs/Sertifikat_HKI_Portofolio_Siswa.pdf",
      "pdfFileName": "Sertifikat_HKI_Portofolio_Siswa.pdf"
    },
    {
      "id": "1792285921203",
      "year": "2026",
      "title": "HKI - Telkom Society",
      "issuer": "Dirjen HKI",
      "category": "HKI",
      "icon": "fa-trophy",
      "desc": "Platform untuk komunitas siswa untuk mengikuti lomba ata mengerjakan project sesuai role (hacker, hipster, hacker, public relation dan project manager).",
      "highlight": false,
      "pdfUrl": "assets/docs/Sertifikat_HKI_Telkom Society.pdf",
      "pdfFileName": "Sertifikat_HKI_Telkom Society.pdf"
    },
    {
      "id": "1792285249215",
      "year": "2025",
      "title": "PORTO-Q",
      "issuer": "Yayasan Pendidikan Telkom",
      "category": "Juara 1 Nasional",
      "icon": "fa-trophy",
      "desc": "INNOVFEST 2025 - Platform inovatif yang secara khusus menghubungkan portofolio para siswa dengan dunia industri teknologi dan perguruan tinggi.",
      "highlight": false,
      "pdfUrl": "assets/docs/SERTIFIKAT PORTO-Q.jpeg",
      "pdfFileName": "SERTIFIKAT PORTO-Q.jpeg"
    },
    {
      "id": "1792289307626",
      "year": "2024",
      "title": "Green Commute Challenge",
      "issuer": "Yayasan Pendidikan Telkom",
      "category": "Juara Nasional",
      "icon": "fa-trophy",
      "desc": "Lomba video pergi bekerja dengan transportasi ramah lingkungan",
      "highlight": false,
      "pdfUrl": "",
      "pdfFileName": ""
    },
    {
      "id": "1792285092050",
      "year": "2023",
      "title": "Inovator Prestatif",
      "issuer": "Kemenparekraf RI dan Malang Cerdas",
      "category": "Juara Malang Raya",
      "icon": "fa-trophy",
      "desc": "Guru Award 2023",
      "highlight": false,
      "pdfUrl": "https://drive.google.com/file/d/19pkWKC3VAoj6jrdpZDno9k0Nlzye5jYO/view?usp=sharing",
      "pdfFileName": "view"
    },
    {
      "id": "1792284961493",
      "year": "2022",
      "title": "Dewi Vtour",
      "issuer": "PT. Telkom Indonesia",
      "category": "Juara Favorit Nasional",
      "icon": "fa-trophy",
      "desc": "ABN 2022 - Website virtual tour lokasi wisata di kota Malang",
      "highlight": false,
      "pdfUrl": "https://drive.google.com/file/d/1VP4CrenDjNqXspl6Q9xdMnjbTcuatOCf/view?usp=sharing",
      "pdfFileName": "view"
    },
    {
      "id": "1792284735366",
      "year": "2021",
      "title": "SEMANGQA",
      "issuer": "Yayasan Pendidikan Telkom",
      "category": "Juara Harapan 3 Nasional",
      "icon": "fa-trophy",
      "desc": "#4 IDEATE - Aplikasi membaca Al-Quran untuk siswa SMK Telkom Malang",
      "highlight": false,
      "pdfUrl": "https://drive.google.com/file/d/1_s6kzUtvuAIUnGDBllpbwtAcp0KqsM_Q/view?usp=sharing",
      "pdfFileName": "view"
    },
    {
      "id": "1792284625904",
      "year": "2020",
      "title": "Filgaru Plus",
      "issuer": "Yayasan Pendidikan Telkom",
      "category": "Juara 2 Nasional",
      "icon": "fa-trophy",
      "desc": "#3 - IDEATE - Filter rumus pada platform instagram untuk meningkatkan minat belajar siswa",
      "highlight": false,
      "pdfUrl": "https://drive.google.com/file/d/1-XkfkgMCaw3xA7Gg8yntJu0UEEkFjsj2/view?usp=sharing",
      "pdfFileName": "view"
    },
    {
      "id": "1792284295308",
      "year": "2019",
      "title": "Hello Moklet",
      "issuer": "Yayasan Pendidikan Telkom",
      "category": "Juara 2 Nasional",
      "icon": "fa-trophy",
      "desc": "#2 ideate - Aplikasi Augmented Reality untuk promosi melalui brosur sekolah",
      "highlight": false,
      "pdfUrl": "https://drive.google.com/file/d/1HBFG-QxoA45nlyF_vqU2R4fRu3snBjml/view?usp=sharing",
      "pdfFileName": "1Tr1OhfdZsFJCNMHCcE0mNGguwROkiJNL"
    }
  ],
  "jadwal": [
    {
      "id": "1",
      "day": "senin",
      "time": "07.15 - 08.00",
      "title": "Upacara Bendera & Apel Pagi Guru",
      "room": "Lapangan Utama SMAN 1 Harapan Bangsa",
      "badge": "Agenda Sekolah",
      "badgeColor": "bg-info",
      "highlight": false
    },
    {
      "id": "2",
      "day": "senin",
      "time": "08.00 - 10.15",
      "title": "Matematika Wajib - Kelas X MIPA 1",
      "room": "Ruang Kelas X-1 • Materi: Barisan & Deret Geometri",
      "badge": "KBM Fase E",
      "badgeColor": "bg-primary",
      "highlight": true
    },
    {
      "id": "3",
      "day": "senin",
      "time": "10.45 - 12.15",
      "title": "Matematika Wajib - Kelas X MIPA 3",
      "room": "Ruang Kelas X-3 • Materi: Barisan & Deret Aritmatika",
      "badge": "KBM Fase E",
      "badgeColor": "bg-primary",
      "highlight": false
    },
    {
      "id": "4",
      "day": "senin",
      "time": "13.30 - 15.00",
      "title": "Jam Konsultasi Belajar Siswa & Tanya Tugas",
      "room": "Ruang Guru / Perpustakaan Sekolah (Bebas mendaftar lebih awal)",
      "badge": "Layanan Konsultasi",
      "badgeColor": "bg-success",
      "highlight": false
    },
    {
      "id": "5",
      "day": "selasa",
      "time": "07.30 - 09.45",
      "title": "Matematika Tingkat Lanjut - Kelas XI MIPA 2",
      "room": "Ruang Kelas XI-2 • Materi: Polinomial & Suku Banyak",
      "badge": "KBM Fase F",
      "badgeColor": "bg-purple",
      "highlight": false
    },
    {
      "id": "6",
      "day": "selasa",
      "time": "10.15 - 12.30",
      "title": "Matematika Tingkat Lanjut - Kelas XI MIPA 4",
      "room": "Ruang Kelas XI-4 • Materi: Teorema Sisa & Faktor",
      "badge": "KBM Fase F",
      "badgeColor": "bg-purple",
      "highlight": false
    },
    {
      "id": "7",
      "day": "selasa",
      "time": "14.00 - 16.00",
      "title": "Klinik OSN Matematika (Latihan Pembuktian Aljabar)",
      "room": "Laboratorium Matematika / Ruang Bimbingan Olimpiade",
      "badge": "Bimbingan Talenta",
      "badgeColor": "bg-amber",
      "highlight": false
    },
    {
      "id": "8",
      "day": "rabu",
      "time": "07.15 - 09.30",
      "title": "Informatika & Pemrograman Python - Kelas X-A",
      "room": "Laboratorium Komputer 1 (Gedung IT)",
      "badge": "Informatika Fase E",
      "badgeColor": "bg-primary",
      "highlight": false
    },
    {
      "id": "9",
      "day": "rabu",
      "time": "10.00 - 12.15",
      "title": "Informatika & Pemrograman Python - Kelas X-C",
      "room": "Laboratorium Komputer 1 (Gedung IT)",
      "badge": "Informatika Fase E",
      "badgeColor": "bg-primary",
      "highlight": false
    },
    {
      "id": "10",
      "day": "rabu",
      "time": "13.30 - 15.30",
      "title": "Koordinasi Fasilitator Projek P5 Tema Rekayasa",
      "room": "Ruang Rapat Kurikulum / Lab Kolaborasi",
      "badge": "Koordinasi Guru",
      "badgeColor": "bg-info",
      "highlight": false
    },
    {
      "id": "11",
      "day": "kamis",
      "time": "07.30 - 09.45",
      "title": "Matematika Peminatan - Kelas XII MIPA 1",
      "room": "Ruang Kelas XII-1 • Materi: Limit Fungsi Trigonometri",
      "badge": "KBM Fase F",
      "badgeColor": "bg-purple",
      "highlight": true
    },
    {
      "id": "12",
      "day": "kamis",
      "time": "10.15 - 12.30",
      "title": "Matematika Peminatan - Kelas XII MIPA 3",
      "room": "Ruang Kelas XII-3 • Materi: Turunan Fungsi Trigonometri",
      "badge": "KBM Fase F",
      "badgeColor": "bg-purple",
      "highlight": false
    },
    {
      "id": "13",
      "day": "kamis",
      "time": "13.30 - 15.00",
      "title": "Mentoring Komunitas Praktisi Guru Penggerak",
      "room": "Ruang Guru / Daring via Google Meet",
      "badge": "Pengembangan Diri",
      "badgeColor": "bg-success",
      "highlight": false
    },
    {
      "id": "14",
      "day": "jumat",
      "time": "07.15 - 08.00",
      "title": "Senam Sehat & Pembiasaan Karakter Pagi",
      "room": "Lapangan Sekolah SMAN 1 Harapan Bangsa",
      "badge": "Program Sekolah",
      "badgeColor": "bg-info",
      "highlight": false
    },
    {
      "id": "15",
      "day": "jumat",
      "time": "08.15 - 10.30",
      "title": "Pendampingan Lapangan Gelar Karya Projek P5",
      "room": "Selasar Budaya & Ruang Pamer Sekolah",
      "badge": "Projek P5",
      "badgeColor": "bg-emerald",
      "highlight": false
    },
    {
      "id": "16",
      "day": "jumat",
      "time": "13.30 - 15.00",
      "title": "Konsultasi Terbuka Wali Murid & Evaluasi Nilai",
      "room": "Ruang Tamu Humas Sekolah / WhatsApp Hotline",
      "badge": "Layanan Wali Murid",
      "badgeColor": "bg-amber",
      "highlight": false
    }
  ],
  "galeri": [
    {
        "id": "1793276000621",
        "title": "Pelatihan STEM Elevate Class - HAFECS",
        "category": "projek",
        "categoryLabel": "Pelatihan",
        "imgUrl": "assets/galeri/stem-hafecs.jpg",
        "desc": "Stem"
    },
    {
        "id": "1793236788126",
        "title": "Anugerah Guru dan Kepala Sekolah Prima 2026",
        "category": "pelatihan",
        "categoryLabel": "Kompetisi Guru",
        "imgUrl": "assets/galeri/anugerah-guru-prima-2026.jpg",
        "desc": "First Time Second Place"
    },
    {
        "id": "1792285437237",
        "title": "Pembelajaran Game menggunakan Roblox Studio",
        "category": "pelatihan",
        "categoryLabel": "Workshop Daring",
        "imgUrl": "assets/galeri/roblox-studio.jpg",
        "desc": "Kegiatan sharing best practice di lingkungan Yayasan Pendidikan Telkom"
    },
    {
        "id": "1792285615864",
        "title": "Pitching Day - Lomba PT. Telkom Indonesia",
        "category": "projek",
        "categoryLabel": "Pitching Day",
        "imgUrl": "assets/galeri/pitching-day.jpg",
        "desc": "Finalis Lomba Ayo Bikin Nyata"
    },
    {
        "id": "1792287837065",
        "title": "Lokakarya Guru Penggerak",
        "category": "kelas",
        "categoryLabel": "Guru Penggerak",
        "imgUrl": "assets/galeri/lokakarya-gp.jpg",
        "desc": "Program Guru Penggerak Angkatan ke-9"
    },
    {
        "id": "1792287920088",
        "title": "Pembimbing Lomba Business Plan",
        "category": "kelas",
        "categoryLabel": "Lomba",
        "imgUrl": "assets/galeri/business-plan.jpg",
        "desc": "Pembimbing lomba"
    },
    {
        "id": "1792288023372",
        "title": "LKS Web Technologies",
        "category": "kelas",
        "categoryLabel": "Lomba",
        "imgUrl": "assets/galeri/lks-web.jpg",
        "desc": "Lomba LKS Tingkat Kota Malang"
    },
    {
        "id": "1792288141777",
        "title": "Hari Nasional",
        "category": "kelas",
        "categoryLabel": "Pakaian Adat",
        "imgUrl": "assets/galeri/hari-nasional.jpg",
        "desc": "Hari Pakaian Adat"
    },
    {
        "id": "1792289134049",
        "title": "Drone Piloting - Malaysia",
        "category": "kelas",
        "categoryLabel": "Lomba Internasional",
        "imgUrl": "assets/galeri/drone-malaysia.jpg",
        "desc": "Lomba Drone Tingkat ASEAN"
    }
],
  "testimoni": [
    {
      "id": "1",
      "name": "Farhan Alamsyah",
      "role": "Alumni • Mahasiswa STEI ITB (Peraih Medali)",
      "photo": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
      "quote": "Di kelas Pak Chusni, kami diajak berpikir komputasional dan kreatif memecahkan masalah. Pendekatan belajar berbasis proyek teknologi membuka wawasan baru bagi kami!",
      "rating": 5
    },
    {
      "id": "2",
      "name": "Dra. Hj. Nurjanah, M.M.",
      "role": "Pendidik & Rekan Sejawat",
      "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      "quote": "Pak Chusni adalah figur pendidik penggerak sejati. Inisiatif beliau membagikan modul ajar berdiferensiasi dan melatih rekan-rekan guru menggunakan platform digital telah mengangkat kualitas pembelajaran secara nyata.",
      "rating": 5
    },
    {
      "id": "3",
      "name": "Ibu Ratna Dewi, S.E.",
      "role": "Orang Tua Murid",
      "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      "quote": "Komunikasi Pak Chusni dengan kami para orang tua sangat transparan dan hangat. Beliau tidak hanya fokus pada nilai akademik, tetapi sangat peduli pada minat dan karakter murid. Terima kasih banyak Pak Guru!",
      "rating": 5
    }
  ],
  "kompetensi": [
    {
        "id": "1",
        "tingkat": "Fase E (Kelas X)",
        "judul": "Informatika & Computational Thinking",
        "desc": "Pemecahan masalah terstruktur dengan logika algoritma, pengenalan bahasa pemrograman (Python & Scratch), analisis data, serta literasi keamanan siber dan etika AI.",
        "icon": "fa-code",
        "colorClass": "bg-purple-subtle text-purple",
        "fiturList": [
            "Logika Komputasi & Pemrograman Dasar (Python/Scratch)",
            "Analisis Data & Dashboard Spreadsheet",
            "Etika Kecerdasan Buatan (AI) & Literasi Digital"
        ]
    },
    {
        "id": "2",
        "tingkat": "Fase F (Kelas XI & XII)",
        "judul": "KIK & Pengembangan Produk Digital",
        "desc": "Pembelajaran kewirausahaan digital modern berbasis proyek nyata, mulai dari ideasi produk digital, perancangan prototipe, UI/UX, hingga strategi pemasaran live commerce.",
        "icon": "fa-lightbulb",
        "colorClass": "bg-emerald-subtle text-emerald",
        "fiturList": [
            "Inkubasi Produk Digital & Startup Siswa",
            "Praktik Live Selling & E-Commerce Digital (Moklive)",
            "Penyusunan Business Plan & Hak Kekayaan Intelektual (HKI)"
        ]
    },
    {
        "id": "3",
        "tingkat": "Peminatan Kejuruan & Lab",
        "judul": "Game Development & Immersive Tech (AR/VR)",
        "desc": "Praktik rancang bangun dunia virtual dan interaktif menggunakan Roblox Studio dan Unity 3D, memadukan pemrograman skrip visual, mekanik gameplay, dan pemodelan spasial.",
        "icon": "fa-vr-cardboard",
        "colorClass": "bg-blue-subtle text-blue",
        "fiturList": [
            "KBM Virtual & Game Design Berbantuan Roblox Studio",
            "Pembuatan Aplikasi Augmented Reality (AR) & VR",
            "Penerapan Logika Fisika & Simulasi 3D Interaktif"
        ]
    },
    {
        "id": "4",
        "tingkat": "Eksplorasi Kejuruan & Talenta",
        "judul": "IoT, Otomasi & Drone Piloting",
        "desc": "Integrasi perangkat keras cerdas, sensor telemetri untuk monitoring presisi (seperti proyek Be-Ternak), serta pembinaan navigasi dan pemanfaatan wahana nirawak (drone).",
        "icon": "fa-satellite-dish",
        "colorClass": "bg-amber-subtle text-amber",
        "fiturList": [
            "Perancangan Sensor Telemetri & IoT Pertanian/Peternakan",
            "Pelatihan Lisensi Pilot Drone & Navigasi Udara",
            "Bimbingan Lomba Inovasi Teknologi & LKS Web"
        ]
    }
],
  "edtech": [
    {
        "id": "1",
        "name": "Roblox Studio (Game Dev)",
        "icon": "fa-solid fa-gamepad",
        "colorClass": "text-danger"
    },
    {
        "id": "2",
        "name": "Scratch & Python",
        "icon": "fa-brands fa-python",
        "colorClass": "text-primary"
    },
    {
        "id": "3",
        "name": "Unity 3D (AR/VR)",
        "icon": "fa-solid fa-vr-cardboard",
        "colorClass": "text-info"
    },
    {
        "id": "4",
        "name": "Google Workspace for Education",
        "icon": "fa-brands fa-google",
        "colorClass": "text-warning"
    },
    {
        "id": "5",
        "name": "Canva for Education",
        "icon": "fa-solid fa-palette",
        "colorClass": "text-info"
    },
    {
        "id": "6",
        "name": "Figma & Miro (UI/UX Design)",
        "icon": "fa-solid fa-chalkboard",
        "colorClass": "text-success"
    }
],
  "timeline": [
    {
      "id": "4",
      "year": "2006",
      "judul": "Diploma III Teknik Elektro (D3)",
      "institusi": "Universitas Negeri Malang",
      "desc": "Produk inkubator anak ayam otomatis."
    },
    {
      "id": "3",
      "year": "2009",
      "judul": "Pendidikan Teknik Informatika",
      "institusi": "Universitas Negeri Malang",
      "desc": "Produk media pembelajaran menggunakan adobe flash."
    },
    {
      "id": "2",
      "year": "2012",
      "judul": "Magister Pendidikan Kejuruan (S2)",
      "institusi": "Universitas Negeri Malang",
      "desc": "Fokus riset: \"Pengembangan media pembelajaran sinkronisasi mata pelajaran RPL dengan Matematika\"."
    },
    {
      "year": "2014",
      "institusi": "SMK Telkom Malang",
      "judul": "Guru",
      "desc": "Mulai mengajar",
      "id": "1792288935559"
    },
    {
      "year": "2023",
      "institusi": "Kemdikdasmen",
      "judul": "Guru Pengggerak Angkatan ke-9",
      "desc": "Upskilling",
      "id": "1792277471291"
    },
    {
      "id": "1",
      "year": "2023 -2025",
      "judul": "Kaur Prestasi dan Ekstrakurikuler",
      "institusi": "SMK Telkom Malang",
      "desc": "Tingkatkan prestasi dan inovasi untuk keberlanjutan negeri"
    },
    {
      "year": "2026 - Sekarang",
      "institusi": "SMK Telkom Malang",
      "judul": "Kaur Laboratorium",
      "desc": "Laboratorium, Riset dan Inovasi",
      "id": "1792288792182"
    }
  ],
  "faq": [
    {
      "id": "1",
      "question": "Apakah seluruh materi ajar dan modul di web ini boleh diunduh gratis?",
      "answer": "Ya, seluruh modul ajar, LKPD, dan kisi-kisi soal yang diunggah di situs ini berlisensi Open Educational Resources (OER). Anda bebas mengunduh, mempelajari, dan membagikannya kembali untuk kepentingan non-komersial pendidikan."
    },
    {
      "id": "2",
      "question": "Bagaimana alur pendaftaran bimbingan klinik olimpiade atau konsultasi privat?",
      "answer": "Siswa atau orang tua cukup mengisi formulir pada menu Kontak di halaman ini atau mengirim pesan langsung via WhatsApp resmi. Jadwal akan disesuaikan dengan jam luang yang tersedia pada tab Jadwal Mengajar."
    },
    {
      "id": "3",
      "question": "Apakah Bpk. Muhammad Chusni Agus bersedia diundang sebagai narasumber workshop Kurikulum Merdeka?",
      "answer": "Tentu. Saya siap berkolaborasi sebagai pemateri lokakarya guru seputar Pembelajaran Berdiferensiasi, Pemanfaatan EdTech, Roblox/Informatika, maupun Asesmen Kurikulum Merdeka. Silakan kirimkan surat permohonan via email resmi."
    }
  ],
  "pesanMasuk": [
    {
      "id": "MSG-1",
      "tanggal": "17/10/2026, 20.20.01",
      "nama": "Budi Santoso",
      "peran": "Siswa",
      "email": "budi@example.com",
      "whatsapp": 81234567890,
      "topik": "Konsultasi Belajar",
      "pesan": "Halo Pak Chusni, terima kasih atas modul ajar dan bimbingannya. Sangat membantu tugas kelompok kami!",
      "status": "Dibaca"
    }
  ],
  "karya": [
    {
      "id": "2",
      "title": "Portofolio Siswa",
      "desc": "Platform inovatif yang secara khusus menghubungkan portofolio para siswa dengan dunia industri teknologi. Melalui ekosistem terpadu ini, siswa dapat membuat CV dan menampilkan karya mereka.",
      "link": "https://portofolio.smktelkom-mlg.sch.id/",
      "thumbnail": "data:image/jpeg;base64,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BERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBEVUFEVVRAREQUREVBERARVRBRFVEFEVUQERFAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFVURARERBERFEREBERUEREBERQEREBERARW4bENgOMErJA06JY4HR8uipLYhgcxs00cbnnTQ9wHMfZ5qi6iIoCIiAi8SSxwsL5XtYwd7nHQC9oCIvEkscQBke1gJDQXHWye4IPaIiAiIgIi8STRwgGWRrA4hoLiBs+SD2iIgIiICIiAi8vkZExz5HNYxo2XOOgFUEOALSCD1BHigqiIgIiICIiAisyXK0TJXyWImNi0JC54AZvu35K6CHAFpBB6gjxQVReXvbGxz5HBrGjbnOOgB5lUiljnibLE9skbxtrmnYI9hQe0ReJZY4IzJNI2Ng73PIAHxQe0ReIpY5mB8UjZGHuc07CD2iIgIqEhoJJAA6klUjkZNGHxPa9ju5zTsH4oPSIqOc1jS5xDWgbJJ0AEFUXlj2yMa9jg5rhsOB2CF6QEREBEXiOaOYOMUjHhri13K4HRHgfag9oiICIiAiIgIiICIiAi8SSxwgGWRrASGgudrZ8l7QEREBERARFR72RMc+RzWMaNlzjoAIKogIc0OaQQRsEeKICKqtSWIYpI45JWMfKSGNc4AuI79DxQXEREBERARULg1pc4gADZJ8FSORksYfG9r2O6hzTsFB6RF5kkZDG6SV7WMYNuc46AHmSg9IrTbUDzEGzRkyjmjAcPljv2PNXUBERAREQERUVFUVEQVREQERFAREQEREBERBwXCMrsflGh5/gMl2jQSe6Rjj0+o/aq8QyvyHEUMrXH1ehahrga6F7jt31aA+pZ7MFeHDTWNiDMjWtGxAC4Hrzb1veuoXr8BXGYLHwiMyW/XWWrO3DvJJcd7666Dp5LPfdizL2ZuOystDGiox1drXSy23EN2eoaAOvcseTiiduAuW+wiFynKIpGbLmOPMBsHyIK8ZHDvhztm67Ex5Ovaa3Y23nicBrpvwK8z4e5Nw3c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t4u3Lbzj2R7bbpiKI8w+U7lcNezvHemQxdufgpuOjjBtCCJnJzDvBbvr3eBTsMoTn91r6/Zx69RD+fkHP88jW+/XsW2WqNOwOJ33WsBhNIRBxcPn85OvPuWVjZLktFj8jDHDZO+ZkZ2B16fYpIy1RERRE2m0BURERVUTaIG0RNoCKm02g9oiKKIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiChAIII2D4LUjhbDNmEooR8wdza5ncu/7O9fYtuiqCIiiiIiAiIgd61H7lsN23a+oR83Nza27l3/Z3r7Ft0VQREUUREQEREBERAREQEREBERBZqVIKMAgrR9nGCSG7J6k7Pf7VeREBERAREQEREBFVUQEVUQURVRAREQEREBERAREQFRVVCgIiICIiAiqqICIiAiIgom0RUNqiKqIKm0RATaKiBtNoioIqIguIiLFRERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEVUQURVRBRVREBERAREQEREBERAREQFQqqogIiIKoiIKIiICIiAiKioKiqiAqIiIIiogIioqCIqIKqiIguoiLFRERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERVQURVRBRFVEFEVUQURVRBRFVEFEVUQURVRBRFVEFEVUQURVRBRVREBERAREQEREBERAREQEREBERAREQFRVRBRFVEBUVUQURVVEBERAVFVUVBUVVREEREFERFRRERBRERAVERUf//Z"
    },
    {
      "title": "Moklive",
      "link": "https://moklive.smktelkom-mlg.sch.id/",
      "desc": "platform live commerce yang dirancang untuk mendukung pembelajaran kewirausahaan digital para siswa. Website ini memfasilitasi siswa dalam berjualan melalui fitur katalog produk dan live selling (AI Copywriting) interaktif, sehingga memudahkan mereka menjangkau pelanggan, mempromosikan karya unggulan, dan mempraktikkan keterampilan bisnis secara langsung dalam sebuah ekosistem sekolah.",
      "thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAF8AyADASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAEGBAUHCAID/8QAVBAAAQQBAgQDAggJCQUFCAMBAQACAwQFBhEHEiExE0FRYXEUFRciMoGR0UJSVHSTlKGxsggWIzM2N1VywTQ1VmJzJEOCkuEYJkRTorPCwzjS8PH/xAAbAQEBAAMBAQEAAAAAAAAAAAAAAQIDBAUGB//EADgRAAIBAgQEAwcDAwQDAQAAAAABAgMRBBIhMQUTQVFhcZEUIoGhscHwFTJSU9HxBjRC4SMzYrL/2gAMAwEAAhEDEQA/AOcoiLwT9cCIiECIiAKVClUBSoUoAiIoQKERAEREBKIioJUqEQhKIiAIiIAiIgCIipAiIgCIioCIiAIiKAlSoUqECIiAIiIApUIhCUREAREQBERAFClQUIEREAREQgREQgREQEIiKgIiKgIiIAiIoCFClFSEIiIUIiIQIiIAiIgCIiECIiAIiIAiIgCIigIREQhCIipQiIhAoUlQhAiIgCIigCIixO0IiIQIiIApUKUAUqFKoCIihCEREAREQEoiKglERCEoiIAiIgCIiAIiIQIiKgIiKgIiIApUKVAApUKVCBERAEREARECEJREQBERAEREAQohQhCIiAIiIQIiIQIiIAoUqFQERFQEREAREUBCIioIREQBERCBERAEREAREQgREQBERAEREAREUBCIiEIREVKEREICoUlQhAiIgCIpQEIiLA7QiIhAiIgClEVAUqFKAIiKEIRSoQBERASiIqCVKhShAiIgCIiAIiIAiIqQIiIAiIqAiIgCIigJUqFKhAiIgCIiAKVClCBERAEREAREQBQpUIQIiIAiIhAiIhAiIgIREVAREVAREUAREQEIihUgREQoREQgREQBERAEREIEREAREQBERAERFAQiIhCEREKERFSBQpUIQIiICQhUqChCERFgdwREQgREQBSoUqgKVClAERFCEIiIAiIgJREVBKlQiEJREQBERAEREAREVIEREAREVAREQBEUqMBSoUqECIiAIiIApUIhCUREAREQBERAFBUoUIQiIgCIiECIiECIiAhFKhUBERUBERAERFAQiIqCEREAREQgREQBERAEREIEREAREQBERAERFAQiIhCERFShERCAqFJUIQKQoX0OyAKFKhCEIiLA7giIhAiIgC6rpHg3FqfTFXLOyr4DOCeQMB26rlS9ScJv7tMX/ld+9dOHhGcrSPF4ziauGoqdJ2dyl/8As+Q/42/9EF8S/wAnweGfBzhD/Lni6fsVi4icT7eic5BRgx8NlssPiFz3EEdSNunuWnwHHqvbyMVfMY0VIZHBvjxPJDPaQfJdDjQTys8aFXi06arQd1v0+hzfVvDjO6QHjWom2KZOwsQ9Wj3jyVXqw/CbkMG/L4r2s39NzsvZNupXyFKWrYjbNBM0tc1w3BBXlTNYT+bvEOTFgksr22BhPm0kFv7CFor0VTaa2PT4XxOWLjKFT9yV/M6X/wCz7D/jb/0QXGslU+AZSzUDufwJHM5vXY7L2YOy8eaj/tNk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",
      "id": "1792277992378"
    },
    {
      "id": "3",
      "title": "Portofolio Guru SMK Telkom Malang",
      "desc": "Platform digital inovatif yang dirancang khusus untuk mendokumentasikan dan menampilkan portofolio para guru untuk memudahkan pengajar/karyawan membagikan rekam jejak, prestasi, keahlian, serta pengalaman profesional.",
      "link": "https://porto-guru-moklet.vercel.app/",
      "thumbnail": "data:image/jpeg;base64,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"
    },
    {
      "id": "1",
      "title": "Be-Ternak (Moklet)",
      "desc": "Kolaborasi dengan BRMP Jawa Timur melalui Platform manajemen peternakan ayam KUB pedaging & petelur presisi. Dilengkapi telemetri IoT, recording harian, FCR otomatis, dan monitoring HDP.",
      "link": "https://be-ternak.vercel.app/",
      "thumbnail": "data:image/jpeg;base64,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"
    },
    {
      "title": "Venue Rental",
      "link": "https://venue-rental.vercel.app/",
      "desc": "Kolaborasi dengan pemerintah kota Batu melalui platform persewaan lapangan olahraga yang menawarkan proses booking cepat, mudah, dan aman. Situs ini menyediakan berbagai pilihan venue populer dengan informasi fasilitas, harga, lokasi, dan ketersediaan lapangan secara transparan, serta didukung sistem yang fleksibel untuk mempermudah pengguna menemukan tempat olahraga impian mereka.",
      "thumbnail": "data:image/jpeg;base64,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",
      "id": "1792279044089"
    },
    {
      "title": "Book Literasia",
      "link": "https://book-literasia.vercel.app/",
      "desc": "Platform untuk meningkatkan literasi SMK Telkom Malang. Situs ini menyediakan akses mudah bagi siswa ke ribuan e-book, katalog buku fisik, majalah digital, dan ruang pamer karya sastra siswa. Dilengkapi fitur poin, leaderboard, dan tantangan membaca untuk meningkatkan minat literasi pelajar secara interaktif.",
      "thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCAHDAyADASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAcBAwQFBgII/8QASxAAAQQBAgMEBAsGBQIEBgMAAQACAwQFERIGITEHE0FRFGFxkRYiMjZSVHOBobHBFSM1QpKyMzRydNFT4SRDYqIXRFWCwvAlk9L/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIFAwQG/8QAMBEBAAECAwYEBgIDAQAAAAAAAAECEQMUIQQSEzFRUhVBobEFMmGB0fAiM5HB4fH/2gAMAwEAAhEDEQA/AJYREVQREQECKiCqIiAiIgIqKqAiIgJ4oqeKCqIiAiIgIqKqAiIgIiogqiIgIiIB6IqHoqoCIiAiIgBFRVQEREBEVEFUREBERA8UVPFVQEREBERAREQEREBERAREQEREBERAREQEHRFQdEFUREBERARUVUBERARFRBVERAREQPFFTxVUBERARFRBVERAREQCioqoCIiAiIgDoioOiqgIiICIiAgRAgIiICIiAiIgIiICeKJ4oCIiAiIgIiICIiAiIgIiICIiAeiIeiICIiAiIgBECICIiAiIgIiICIiB4oniiAiIgIiICIiAiIgIiICIiAiIgIiICIiAg6Ig6ICIiAiIgIiICIiAiIgIiICIiB4oniiAiIgIiICIiAiIgFEKICIiAiIgDoiDoiAiIgIiICBECAiIgIiICIiAiIgJ4onigIiICIiAiIgIiICIiAiIgIiIB6Ih6IgIiICIiAEQIgIiICIiAiIgIiIHiieKICIiAiIgIiICIiAiIgIiICIiAiIgIiICDoiDogIiICIiAiIgIiICIiAiIgIiIHiieKICIiAiIgIiICIiAUQogIiICIiAOiIOiICIiAiIgIiBAREQEREBERAREQE8V4mlEEEkrgS2NpcQPUNVqK3Eted8Akq2YI7B2xyyMGxx8tQVunDrri9MM1V00zaZbpFqbGdbDelqRUrViSIAuMTQQNfvXu5mWUoar31bDpLJ0bE1o3A6a6EarXBr005pxKddeTZotdUzUFuGw4RyxSVgTJFK3Rw5arGrcTV53Qd5VswR2DpHLIwbHHy1BTg4munI4tGmrdIsSHIRzZGek1rhJA1rnE9Dr5KzFm60lK1acHsiqyOjfuHMlvl71nh19OnryXfp6tii1dLORXLLYH1rFd8jd0ffM0Dx6lYm4jEFptd2Nu948nYAwfH06kc1rgYl7WZ4tFr3btFr72Xix9CO1PDKO8IaIgBv1PhorrcjDJixfYHGIx95p46eXtWeHVa9tOTW/Te12Wi1hzkBFMRxySS2wCyJoG4DzPPkFeymThxVXv5mveCQ0NYNSSrwq7xFtZN+m0zfkzUVmpaju1YrEWuyRu4a9VhMzlZ+YdjQ1/et5b9BtJ010181Iw6pmYiOXMmumLTM82zPRFrshmq2NuV69gOBscg8abW+HNXm5CJ+UfQDXd4yMSF3hoU4ddr20N+m9rstFiX8hFj/AEfvWud38zYW7fAnz9XJXLttlGnLZka5zIm7iG9SpuVTbTmu9Gv0X0WsuZkU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BERAWry3D9HN7RfbJIwDTYHkNP3LaIg5j/4ecO8iKWhHiHlbvHYyDGROjrulLTpykkLtPZqsxEBERAREQEREA9EQ9EQEREBERACIEQEREBERAREQEREDxRPFEBERAREQEREBERAREQEREBERAREQEREBB0RB0QEREBERAREQEREBERAREQEREDxRPFEBERAREQEREBERAKIUQEREBERAHREHREBERAREQECIEBERAREQEREBERATxRU156IKoiICIiAioeXVVQEREBERAREQEREA9EQ9EQEREBE15ogBECICIiAiIgIqB7Tro4HTlyKqgImqIHiieKICIiAiIgIia6oCInVAREQEREBETqgIiICIiAg6Ig6ICIiAiIgIia69EBERAREQERNdUBERA8UTxRAREQEREBERAREQCiFEBERAREQB0RB0RAREQEREBUVUCAiIgIiIKLUZqRzLuIDXOaHWtHAHqNpWfkI7E1CdlSTu7Bb8R3kVqdt7KXseZ6bq0dR5kke9wO52mgDdPagyJcvZfPO2hS9IirnbI8v26nxDeXNWJL7buSwM8DnCKfviW/8A2dD7CsKXDNrXLRlxTromkMkcjH6aa+DuY0WczGyxWcKYq7IWVxKZGsOrWFzfX60Fy3mblRs1h+OIpwu0c90gDyPMDy+9XPSIncQta2NzpDSMgeHHpu6aefPqtDcxFqxVtRTY6SzecXFtmSTVgGvLQa8uXhoti6OU8QiOJwbMMWWg/RdvGiDIOatwPhkt48w1ppBG1xk1e0k6DULGZcux8Q5eOpXNggQkB79rWDZ+ZWvOInljqgYuQW4po3TWZpNxdo7mW810FGrLFm8pO9mkU/dbHeejdCgxZcpDdpULD4HgvtNjLN+mx418uvRbW9a9Doz2Nu7umF23z0WijxlptGtGYjuZkDM4a9Gann+K3OWhfYxVqGJu6R8bmtHmdEGqt5GWxhJbNykY67u7LGiXRztXDrp06qkly3FxNbhqwmdxgjIa5+1jeZ1KyclSnn4bZVjZumDIht9hbr+Stysu0+ILFyOo6eu+FjNGEbtRr01QezxBtx0th1csmglbDLCXfJJIHX79VnW7/o1ynBs3ekPLddfk6DVaZ+Ju2sXkJHRtZatStmZET02kaAn7lef6fkMlj530X14oHkv3uBOpHq8EF65mLlVs9g44+iQE7nOk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MT+z2OYPi/L1bp93RBYoz2KeQvU5pZbbIY2ysJAL+fh61fF52ShngFW9UPdk95JGG/cDqeayY6Ijyk13vNTLG1mzTpp46rKcA5paehGiDkKlmbFcKVHxTyufZeGAlu/uxqddoCy6F6wzKwwxSXbFaVru8dZgc3u3AaggkDkemizI8Dtx5pPtOdGx4fA4NAdEQdRz8VkVaFtlgTW8g+fa0taxrAxvPxI8Sg0RsZBuElygvyd5DK4NiOmxw36aFbBnpVDM0Y33ZbEdtrw9smmjSG6gjyWScI04WXHd+dJHF2/b01du6LIsY9ti5TsGQj0YPG3T5W5uiDnMjlJK8dm1XyNmzNC7XbFCe5AB6E6affqtnZdat8QCpFbkrwGmJXbOuu4jkvEvDcslGWgMi9tN+ujBGNRqddCfELaMx7WZT07vCT6OINmn/q111QaKa/dr4TJM9Ic+epYbGyY9SC5vX3q/PFegy1Wo3JTOZca8vcQNWFuh+L5arMmwTZq96IzkelzNlJ2/J0IOn4LKmoCbI1bZkINcPAbp8rcNEGhsXrlTD5qP0l75KbgI5nfK0OnX3rbZazLBPjWxPLRLZax+niNDyVX4WGVmRZLIXMvH4wA028tOSsNwc75aklvJPn9FkD2AxhoOnn6/Wg3SLHrwSxTTvksulbI7VjCABGPILIQEREBERAREQPFE8UQEREBERAREQEREAoiICIiAiIgDoiDoiAiIgIiICBECAiIgIiICIiAiIgJ4onigIiICIiAiIgIiICIiAiIgIiIB6Ih6IgIiICIiAEQIgIiICIiAiIgIiIHiieKICIiAiIgJoD1REBERAREQEREBERAREQEREBB0RB0QEREBERAREQEREBERAREQEREDxRPFEBERAREQEREBERAKIUQEREBERAHREHREBERAREQECIEBERAREQEREBERATxRPFAREQEREBERAREQEREBERAREQD0RD0RAREQEREAIgRAREQEREBERAREQPFE8UQEREBERAREQEREBERAREQEREBERAREQEHREHRAREQEREBERAREQEREBERAREQPFE8UQEREBERAREQEREAohRAREQEREAdEQdEQEREBERAQIgQEREBERAWDZzWOqSGOxciY8dWl3MLF4mvyY/CyywnSRxDAfLVRc5xc4lxJJ5kldHZNijHpmuqbQ+PaNq4U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offsmBVhXmrzEg+QfUSi86Oa4uYRz6g+K5r7V5Fa7yT6I96d5J9Ee9RV1Fa7yT6I96d5J9Ee9BdRWu8k+iPeneSfRHvQXUVrvJPoj3p3kn0R70F1Fa7yT6I96d5J9Ee9BdRWu8k+iPeneSfRHvQXUVrvJPoj3p3kn0R70F1Fa7yT6I96d5J9Ee9BdRWu8k+iPeneSfRHvQXUVrvJPoj3p3kn0R70F1Fa7yT6I96d5J9Ee9BdRWu8k+iPeneSfRHvQXUVrvJPoj3p3kn0R70F1eZeUTvYvHeSfRHvVDueRv0AHgEFQOQVURVFFVEQEREBUVUQEREBERBTxVU8UQEREBUVUQEREBERBRVQogIiICIiCg6KqDoiAiIgIiICBECAiIgIiICIiAiIgJ4onigIiICIiAiIgIiICIiAiIgIiIB6Ih6IgIiICIiAEQIgIiICIiAiIgIiIHiieKICIiAiIgIiICIiAiIgIiICIiAiIgIiICDoiDogIiICIiAiIgIiICIiAiIgIiIHiieKICIiAiIgIiICIiAUQogIiICIiAOiIOiICIiAiIgIEQICIiAiIgIiICIiAniieKAiIgIiICIiAiIgIiICIiAiIgHoiHoiAiIgIiIARAiAiIgIiICIiAiIgeKJ4ogIiICIiAiIgIiICIiAiIgIiICIiAiIgIOiIOiAiIgIiICIiAiIgIiICIiAiIgeKJ4ogIiICIiAiIgIiIBRCiAiIgIiIA6Ig6IgIiICIiAgRAgIiICIiAiprp1Tc3zQVRU3N803N80FU8VTc3zVNw16oPSKm5vmm5vmgqipub5pub5oKovO4earub5oKoqbm+abm+aCqKm5vmqbh5oPSKm5vmm5vmgqipub5pub5oKnoi87hp1VdzfNBVFTc3zTc3zQVRU3N803N80FQi87h5qu5vmgqipub5pub5oKoqbm+apuHmg9Iqbm+abm+aCqKm5vmm5vmgr4ovO4a9VXc3zQVRU3N803N80FUVNzfNU3DzQekVNzfNNzfNBVFTc3zTc3zQVRedw81Xc3zQVRU3N803N80FUVNzfNU3DzQekVNzfNNzfNBVFTc3zTc3zQVQdFTc3zVNw06oPSKm5vmm5vmgqipub5pub5oKovO4earub5oKoqbm+abm+aCqKm5vmqbh5oPSKm5vmm5vmgqipub5pub5oK+KLzuGvVV3N80FUVNzfNNzfNBVFTc3zVNw80HpFTc3zTc3zQVRU3N803N80FSi87h5qu5vmgqipub5pub5oKoqAg9FVAHREHREBERAREQECIgIiICIiAiIgIiICeKIgIiICIiAiIgIiICIiAiIgIiIB6IiICIiAiIgBERAREQEREBERAREQPFERAREQEREBERAREQEREBERAREQEREBERAQdERAREQEREBERAREQEREBERAREQPFERAREQEREBERAREQCiIgIiICIiAOiIiD/9k=",
      "id": "1792280758130"
    }
  ],
  "nav_menus": [
    { "id": "1", "label": "Beranda", "href": "#beranda", "icon": "fa-solid fa-house", "is_active": true, "order": 1 },
    { "id": "2", "label": "Pendampingan", "href": "#pendampingan", "icon": "fa-solid fa-people-arrows", "is_active": true, "order": 2 },
    { "id": "3", "label": "Kompetensi", "href": "#kompetensi", "icon": "fa-solid fa-chalkboard-user", "is_active": true, "order": 3 },
    { "id": "4", "label": "Modul Ajar", "href": "#modul", "icon": "fa-solid fa-book-open", "is_active": true, "order": 4 },
    { "id": "5", "label": "Portofolio", "href": "#portofolio", "icon": "fa-solid fa-briefcase", "is_active": true, "order": 5 },
    { "id": "6", "label": "Pengembangan Diri", "href": "#pengembangan-diri", "icon": "fa-solid fa-graduation-cap", "is_active": true, "order": 6 },
    { "id": "7", "label": "Kontak", "href": "#kontak", "icon": "fa-solid fa-envelope", "is_active": true, "order": 7 }
  ],
  "pelatihan": [
    {
      "id": "1",
      "title": "Pendidikan Guru Penggerak (PPGP) Angkatan 9",
      "category": "kepemimpinan",
      "organizer": "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI",
      "institution": "BBGP Jawa Timur",
      "duration": "310 JP",
      "year": "2023 - 2024",
      "badge_text": "Kemendikbudristek",
      "badge_type": "badge-verified",
      "icon": "fa-user-graduate",
      "icon_bg": "bg-purple-subtle text-purple",
      "desc": "Program pendidikan kepemimpinan pembelajaran intensif mencakup paradigma dan visi guru penggerak, praktik pembelajaran yang berpihak pada murid (berdiferensiasi & PSE), coaching alur TIRTA, serta pengelolaan program yang berdampak pada murid.",
      "skills": ["Coaching TIRTA", "Budaya Positif", "Pembelajaran Berdiferensiasi"]
    },
    {
      "id": "2",
      "title": "IC3 Digital Literacy Global Certification",
      "category": "sertifikasi",
      "organizer": "Certiport - A Pearson VUE Business (Standard International)",
      "institution": "Certiport / Pearson VUE",
      "duration": "Global Credential",
      "year": "Lisensi Aktif",
      "badge_text": "Sertifikasi Global",
      "badge_type": "badge-gold",
      "icon": "fa-id-card-clip",
      "icon_bg": "bg-blue-subtle text-blue",
      "desc": "Sertifikasi standar kompetensi literasi komputasi digital internasional yang memvalidasi penguasaan Computing Fundamentals, Key Applications (produktivitas digital perkantoran), dan Living Online (kolaborasi & keamanan siber).",
      "skills": ["Computing Fundamentals", "Cloud Collaboration", "Digital Safety"]
    },
    {
      "id": "3",
      "title": "Upskilling & Reskilling Guru Kejuruan: Teknologi Imersif (AR/VR)",
      "category": "teknologi",
      "organizer": "BBPPMPV Bidang Mesin dan Industri (BMTI) Kemendikbudristek",
      "institution": "BBPPMPV BMTI Cimahi",
      "duration": "90 JP",
      "year": "2023",
      "badge_text": "Diklat Vokasi",
      "badge_type": "badge-verified",
      "icon": "fa-vr-cardboard",
      "icon_bg": "bg-emerald-subtle text-emerald",
      "desc": "Pengembangan media ajar imersif 3D menggunakan Augmented Reality dan Virtual Reality untuk simulasi praktikum laboratorium virtual, visualisasi perangkat keras jaringan, dan interaksi spasial digital bagi siswa SMK.",
      "skills": ["Augmented Reality", "Virtual Lab", "3D Spatial Media"]
    },
    {
      "id": "4",
      "title": "Bimtek Perancangan Modul Ajar Berdiferensiasi Kurikulum Merdeka",
      "category": "ai",
      "organizer": "Balai Guru Penggerak (BGP) Provinsi Jawa Timur",
      "institution": "Dinas Pendidikan & BGP",
      "duration": "64 JP",
      "year": "2022 - 2023",
      "badge_text": "Pedagogi Kurikulum",
      "badge_type": "badge-cyan",
      "icon": "fa-book-open-reader",
      "icon_bg": "bg-amber-subtle text-amber",
      "desc": "Penyusunan Alur Tujuan Pembelajaran (ATP), modul ajar berbasis proyek terintegrasi profil pelajar Pancasila (P5), instrumen asesmen diagnostik dan formatif otentik, serta digitalisasi LKPD interaktif bagi sekolah menengah kejuruan.",
      "skills": ["Alur ATP & CP", "Asesmen Otentik", "P5 Digital"]
    },
    {
      "id": "5",
      "title": "Klinik Bimbingan Teknis Drafting HKI & Paten Inovasi Vokasi",
      "category": "sertifikasi",
      "organizer": "Direktorat Jenderal Kekayaan Intelektual (DJKI) Wilayah Jawa Timur",
      "institution": "DJKI Kemenkumham RI",
      "duration": "32 JP",
      "year": "2024",
      "badge_text": "Hak Cipta & Paten",
      "badge_type": "badge-gold",
      "icon": "fa-scale-balanced",
      "icon_bg": "bg-purple-subtle text-purple",
      "desc": "Pelatihan legalitas perlindungan hak cipta perangkat lunak, perancangan spesifikasi drafting paten sederhana karya alat berbasis IoT siswa SMK, dan strategi komersialisasi riset terapan sekolah vokasi.",
      "skills": ["Drafting Paten", "Hak Cipta Software", "Komersialisasi Riset"]
    },
    {
      "id": "6",
      "title": "Workshop Penyiapan Studio Live Commerce & Digital Selling (Moklive)",
      "category": "teknologi",
      "organizer": "PT Telkom Indonesia & Yayasan Pendidikan Telkom",
      "institution": "Telkom Schools & Ekosistem Digital",
      "duration": "48 JP",
      "year": "2024",
      "badge_text": "Kemitraan Industri",
      "badge_type": "badge-verified",
      "icon": "fa-shop",
      "icon_bg": "bg-rose-subtle text-rose",
      "desc": "Pelatihan infrastruktur broadcast streaming modern, manajemen inventori e-commerce terintegrasi, teknik komunikasi interaktif host penjualan produk kreatif siswa, dan integrasi kurikulum digital entrepreneurship di SMK Telkom.",
      "skills": ["Live Commerce", "Broadcast Tech", "Digital Marketing"]
    },
    {
      "id": "7",
      "title": "Sertifikasi Kompetensi Remote Pilot Drone & Integrasi Sensor IoT",
      "category": "teknologi",
      "organizer": "APDI & Federasi Aero Sport Indonesia (FASI)",
      "institution": "Asosiasi Pilot Drone Indonesia",
      "duration": "40 JP",
      "year": "Lisensi Resmi",
      "badge_text": "Lisensi Pilot APDI",
      "badge_type": "badge-gold",
      "icon": "fa-plane-up",
      "icon_bg": "bg-blue-subtle text-blue",
      "desc": "Sertifikasi lisensi penerbangan drone profesional (UAV), regulasi keselamatan udara CASR 107, pemetaan fotogrametri udara, serta integrasi modul sensor IoT telemetri data nirkabel untuk riset lingkungan siswa.",
      "skills": ["UAV Remote Pilot", "Aeromapping", "Sensor IoT Telemetri"]
    },
    {
      "id": "8",
      "title": "Pemanfaatan Generative AI dalam Efisiensi Bahan Ajar & Asesmen HOTS",
      "category": "ai",
      "organizer": "Google for Education Partner & Komunitas Guru Inovatif",
      "institution": "Komunitas Pendidik Digital",
      "duration": "36 JP",
      "year": "2024",
      "badge_text": "Tren Teknologi",
      "badge_type": "badge-cyan",
      "icon": "fa-wand-magic-sparkles",
      "icon_bg": "bg-cyan-subtle text-cyan",
      "desc": "Penerapan Prompt Engineering tingkat lanjut dengan Large Language Model (LLM) untuk diferensiasi materi belajar, perancangan bank soal Higher Order Thinking Skills (HOTS), dan otomatisasi administrasi guru berbasis kecerdasan buatan.",
      "skills": ["Prompt Engineering", "Asesmen HOTS", "Automasi Guru"]
    }
  ]
};

  // State memori runtime
  let currentData = null;
  const listeners = [];

  // Inisialisasi: Muat dari localStorage atau default
  function init() {
    try {
      let stored = localStorage.getItem(STORAGE_KEY_DATA);

      // Helper untuk mendeteksi apakah data masih mengandung dummy lama
      const isDataDummy = function(d) {
        if (!d || !d.config) return true;
        if (d.config.teacher_name === 'Rahmat Hidayat') return true;
        if (d.config.hero_image && d.config.hero_image.includes('images.unsplash.com')) return true;
        if (Array.isArray(d.prestasi) && d.prestasi.some(p => (p.title || p.name || '').includes('Guru Inovatif SMA Tingkat Provinsi'))) return true;
        if (Array.isArray(d.prestasi) && !d.prestasi.some(p => (p.title || p.name || '').includes('Hello Moklet'))) return true;
        if (Array.isArray(d.karya) && d.karya.some(k => (k.title || '').includes('Portal Modul & OER Kurikulum Merdeka') || (k.link || '').includes('rahmathidayat.guru'))) return true;
        if (Array.isArray(d.galeri) && d.galeri.some(g => (g.imgUrl || '').includes('photo-1580582932707-520aed937b7b'))) return true;
        // Cek materi modul dan kompetensi apakah masih materi matematika lama
        if (Array.isArray(d.modul) && d.modul.some(m => (m.title || '').includes('Fungsi Eksponen') || (m.title || '').includes('Vektor pada Ruang') || (m.title || '').includes('Mastery Kit Penalaran'))) return true;
        if (Array.isArray(d.kompetensi) && d.kompetensi.some(k => (k.judul || '').includes('Matematika Tingkat Lanjut') || (k.judul || '').includes('OSN Matematika') || (k.judul || '').includes('Aljabar Linear'))) return true;
        if (Array.isArray(d.edtech) && d.edtech.some(e => (e.name || '').includes('GeoGebra') || (e.name || '').includes('Desmos'))) return true;
        if (Array.isArray(d.timeline) && d.timeline.some(t => (t.institusi || '').includes('ITB') || (t.institusi || '').includes('SMAN 1 Harapan Bangsa'))) return true;
        return false;
      };

      // 1. Jika data v3 belum ada di perangkat ini, periksa versi lama (v2 atau v1)
      if (!stored) {
        const oldStored = localStorage.getItem('profilku_data_v2') || localStorage.getItem('profilku_data');
        if (oldStored) {
          try {
            const oldData = JSON.parse(oldStored);
            if (isDataDummy(oldData)) {
              console.log("Ditemukan data dummy versi lama di penyimpanan lokal. Membersihkan dan memuat data riil...");
              localStorage.removeItem('profilku_data_v2');
              localStorage.removeItem('profilku_data');
              stored = null;
            } else {
              // Jika ini adalah data kustom valid milik pengguna
              console.log("Memigrasi data kustom pengguna ke penyimpanan v3...");
              currentData = oldData;
              if (currentData.config) {
                currentData.config.hero_image = 'assets/hero-chusni.jpg';
              }
              for (const k in DEFAULT_DATA) {
                if (!currentData[k]) currentData[k] = JSON.parse(JSON.stringify(DEFAULT_DATA[k]));
              }
              saveLocal();
              return;
            }
          } catch (e) {
            stored = null;
          }
        }
      }

      // 2. Jika data v3 ada
      if (stored) {
        currentData = JSON.parse(stored);
        if (isDataDummy(currentData)) {
          console.log("Data tersimpan masih terdeteksi data dummy. Memperbarui otomatis ke data riil Bpk. Muhammad Chusni Agus...");
          currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));
          saveLocal();
          return;
        }

        // Sanitasi spesifik modul ajar jika masih berisi materi matematika
        if (Array.isArray(currentData.modul) && (currentData.modul.length === 0 || currentData.modul.some(m => (m.title || '').includes('Fungsi Eksponen') || (m.title || '').includes('Vektor pada Ruang')))) {
          console.log("Memperbarui modul ajar lama ke materi KIK & Informatika...");
          currentData.modul = JSON.parse(JSON.stringify(DEFAULT_DATA.modul));
        }

        // Sanitasi spesifik kompetensi jika masih berisi materi matematika
        if (Array.isArray(currentData.kompetensi) && (currentData.kompetensi.length === 0 || currentData.kompetensi.some(k => (k.judul || '').includes('Matematika Tingkat Lanjut') || (k.judul || '').includes('OSN Matematika')))) {
          console.log("Memperbarui kompetensi lama ke silabus KIK & Informatika...");
          currentData.kompetensi = JSON.parse(JSON.stringify(DEFAULT_DATA.kompetensi));
        }

        // Sanitasi spesifik edtech jika masih berisi GeoGebra
        if (Array.isArray(currentData.edtech) && (currentData.edtech.length === 0 || currentData.edtech.some(e => (e.name || '').includes('GeoGebra')))) {
          console.log("Memperbarui edtech lama ke perkakas EdTech SMK Telkom...");
          currentData.edtech = JSON.parse(JSON.stringify(DEFAULT_DATA.edtech));
        }

        // Sanitasi spesifik timeline jika masih berisi ITB / SMA Harapan Bangsa
        if (Array.isArray(currentData.timeline) && (currentData.timeline.length === 0 || currentData.timeline.some(t => (t.institusi || '').includes('ITB') || (t.institusi || '').includes('SMAN 1 Harapan Bangsa')))) {
          console.log("Memperbarui timeline ke karir SMK Telkom & UM...");
          currentData.timeline = JSON.parse(JSON.stringify(DEFAULT_DATA.timeline));
        }

        // Sanitasi spesifik galeri jika foto hilang, dummy, atau belum lengkap
        if (Array.isArray(currentData.galeri)) {
          const isBrokenGaleri = currentData.galeri.length < DEFAULT_DATA.galeri.length || 
            currentData.galeri.some(g => !g.imgUrl || g.imgUrl === 'assets/galeri-default.jpg' || g.imgUrl.includes('photo-1580582932707-520aed937b7b'));
          if (isBrokenGaleri) {
            console.log("Memperbarui galeri dari DEFAULT_DATA (memulihkan foto asli dokumentasi)...");
            currentData.galeri = currentData.galeri.map(g => {
              const gId = String(g.id || g.ID || '');
              const gTitle = (g.title || g.Judul || '').trim().toLowerCase();
              const def = (DEFAULT_DATA.galeri || []).find(d => 
                (d.id && String(d.id) === gId) || 
                (d.title && gTitle && d.title.trim().toLowerCase() === gTitle)
              );
              const isInvalidImg = !g.imgUrl || g.imgUrl === 'assets/galeri-default.jpg' || g.imgUrl.includes('photo-1580582932707-520aed937b7b');
              let imgUrl = isInvalidImg ? (def && def.imgUrl ? def.imgUrl : 'assets/galeri-default.jpg') : g.imgUrl;
              if (def && def.imgUrl && def.imgUrl.startsWith('assets/galeri/') && (imgUrl.startsWith('data:') || imgUrl === 'assets/galeri-default.jpg')) {
                imgUrl = def.imgUrl;
              }
              return {
                ...g,
                imgUrl: imgUrl
              };
            });
            // Pastikan setiap item bawaan DEFAULT_DATA ada di currentData.galeri
            DEFAULT_DATA.galeri.forEach(defItem => {
              const defId = String(defItem.id);
              const defTitle = (defItem.title || '').trim().toLowerCase();
              const exists = currentData.galeri.some(g => 
                String(g.id || g.ID || '') === defId || 
                ((g.title || g.Judul || '').trim().toLowerCase() === defTitle)
              );
              if (!exists) {
                currentData.galeri.push(JSON.parse(JSON.stringify(defItem)));
              }
            });
          }
        }

        // Sanitasi spesifik karya jika thumbnail kosong atau dummy
        if (Array.isArray(currentData.karya)) {
          const isBrokenKarya = currentData.karya.some(k => !k.thumbnail || k.thumbnail.includes('photo-1580582932707-520aed937b7b'));
          if (isBrokenKarya) {
            console.log("Memperbarui thumbnail karya dari DEFAULT_DATA...");
            currentData.karya = currentData.karya.map((k, idx) => {
              const def = DEFAULT_DATA.karya.find(d => d.title && d.title.trim().toLowerCase() === (k.title || '').trim().toLowerCase()) || DEFAULT_DATA.karya[idx];
              const isInvalidThumb = !k.thumbnail || k.thumbnail.includes('photo-1580582932707-520aed937b7b');
              return {
                ...k,
                thumbnail: isInvalidThumb ? (def && def.thumbnail ? def.thumbnail : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80') : k.thumbnail
              };
            });
          }
        }

        // Pastikan semua key ada (backward compatibility)
        for (const k in DEFAULT_DATA) {
          if (!currentData[k]) currentData[k] = JSON.parse(JSON.stringify(DEFAULT_DATA[k]));
        }
        if (currentData.config) {
          for (const ck in DEFAULT_DATA.config) {
            if (currentData.config[ck] === undefined) {
              currentData.config[ck] = DEFAULT_DATA.config[ck];
            }
          }
          if (!currentData.config.hero_image || currentData.config.hero_image.includes('images.unsplash.com')) {
            currentData.config.hero_image = 'assets/hero-chusni.jpg';
          }
        }
        if (!currentData.nav_menus || !currentData.nav_menus.length) {
          currentData.nav_menus = JSON.parse(JSON.stringify(DEFAULT_DATA.nav_menus));
        }
        if (!currentData.pelatihan || !currentData.pelatihan.length) {
          currentData.pelatihan = JSON.parse(JSON.stringify(DEFAULT_DATA.pelatihan));
        }
        if (Array.isArray(currentData.prestasi)) {
          // 1. Pastikan item baru dari DEFAULT_DATA (seperti Juara 2 AGP) dimasukkan jika belum ada di localStorage
          DEFAULT_DATA.prestasi.forEach(def => {
            const defId = String(def.id || '');
            const defTitle = (def.title || '').toLowerCase().trim();
            const exists = currentData.prestasi.some(p => 
              String(p.id) === defId || 
              (p.title && defTitle && (
                p.title.toLowerCase().trim() === defTitle ||
                p.title.toLowerCase().includes(defTitle) ||
                defTitle.includes(p.title.toLowerCase().trim())
              ))
            );
            if (!exists) {
              currentData.prestasi.unshift(JSON.parse(JSON.stringify(def)));
            }
          });

          // 2. Pulihkan URL berkas dari DEFAULT_DATA jika kosong atau referensi indexeddb lokal
          currentData.prestasi.forEach(p => {
            const pId = String(p.id || p.ID || '');
            const pTitle = (p.title || p.Judul || '').toLowerCase().trim();
            const def = DEFAULT_DATA.prestasi.find(x => 
              String(x.id) === pId || 
              (x.title && pTitle && (
                x.title.toLowerCase().trim() === pTitle ||
                x.title.toLowerCase().includes(pTitle) || 
                pTitle.includes(x.title.toLowerCase().trim())
              ))
            );
            if (def && def.pdfUrl) {
              if (!p.pdfUrl || p.pdfUrl.startsWith('indexeddb:')) {
                p.pdfUrl = def.pdfUrl;
                p.pdfFileName = def.pdfFileName || p.pdfFileName || '';
              }
            }
          });
        }
        saveLocal();
      } else {
        // Inisialisasi awal dengan DEFAULT_DATA lengkap riil
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
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
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
    return localStorage.getItem(STORAGE_KEY_GAS_URL) || DEFAULT_GAS_URL;
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

        // Modul Ajar (Validasi data riil vs dummy matematika)
        if (Array.isArray(incoming.modul) && incoming.modul.length) {
          const validModul = incoming.modul.filter(m => {
            const t = (m.Judul || m.title || '');
            return !t.includes('Fungsi Eksponen') && !t.includes('Vektor pada Ruang') && !t.includes('Mastery Kit Penalaran');
          });

          if (validModul.length > 0) {
            currentData.modul = validModul.map(m => {
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
          } else {
            currentData.modul = JSON.parse(JSON.stringify(DEFAULT_DATA.modul));
          }
        } else if (!currentData.modul || currentData.modul.length === 0) {
          currentData.modul = JSON.parse(JSON.stringify(DEFAULT_DATA.modul));
        }

        if (Array.isArray(incoming.prestasi) && incoming.prestasi.length) {
          currentData.prestasi = incoming.prestasi.map(p => {
            const pId = String(p.ID || p.id || '');
            const pTitle = (p.Judul || p.title || '').trim();
            const existing = (currentData.prestasi || []).find(x => String(x.id) === pId || (x.title && pTitle && x.title.toLowerCase().trim() === pTitle.toLowerCase().trim()));
            const defaultItem = (DEFAULT_DATA.prestasi || []).find(d => 
              String(d.id) === pId || 
              (d.title && pTitle && (
                d.title.toLowerCase().includes(pTitle.toLowerCase()) || 
                pTitle.toLowerCase().includes(d.title.toLowerCase())
              ))
            );

            let pdfUrl = p.PdfUrl || p.pdfUrl || '';
            let pdfFileName = p.PdfFileName || p.pdfFileName || '';

            // 1. Jika ada di existing lokal dan URL valid non-indexeddb
            if ((!pdfUrl || pdfUrl.startsWith('indexeddb:')) && existing && existing.pdfUrl && !existing.pdfUrl.startsWith('indexeddb:')) {
              pdfUrl = existing.pdfUrl;
              pdfFileName = existing.pdfFileName || pdfFileName;
            }
            // 2. Fallback ke DEFAULT_DATA (berkas statis assets/docs/ atau Google Drive)
            if ((!pdfUrl || pdfUrl.startsWith('indexeddb:')) && defaultItem && defaultItem.pdfUrl) {
              pdfUrl = defaultItem.pdfUrl;
              pdfFileName = defaultItem.pdfFileName || pdfFileName;
            }
            // 3. Fallback ke existing jika hanya ada indexeddb di perangkat ini
            if (!pdfUrl && existing && existing.pdfUrl) {
              pdfUrl = existing.pdfUrl;
              pdfFileName = existing.pdfFileName || pdfFileName;
            }

            return {
              id: pId,
              year: String(p.Tahun || p.year || ''),
              title: pTitle,
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
          currentData.galeri = incoming.galeri.map(g => {
            const gId = String(g.ID || g.id || '');
            const gTitle = (g.Judul || g.title || '').trim().toLowerCase();
            let imgUrl = g.ImgUrl || g.imgUrl || '';

            const def = (DEFAULT_DATA.galeri || []).find(d => 
              (d.id && String(d.id) === gId) || 
              (d.title && gTitle && d.title.trim().toLowerCase() === gTitle)
            );
            const existing = (currentData.galeri || []).find(e => 
              (e.id && String(e.id) === gId) || 
              (e.title && gTitle && e.title.trim().toLowerCase() === gTitle)
            );

            // Jika imgUrl dari Google Sheets adalah assets/galeri-default.jpg, kosong, atau dummy, pulihkan foto asli
            if (!imgUrl || imgUrl === 'assets/galeri-default.jpg' || imgUrl.includes('photo-1580582932707-520aed937b7b')) {
              if (def && def.imgUrl) {
                imgUrl = def.imgUrl;
              } else if (existing && existing.imgUrl && !existing.imgUrl.includes('galeri-default.jpg')) {
                imgUrl = existing.imgUrl;
              } else {
                imgUrl = 'assets/galeri-default.jpg';
              }
            } else if (def && def.imgUrl && def.imgUrl.startsWith('assets/galeri/') && imgUrl.startsWith('data:')) {
              imgUrl = def.imgUrl;
            }

            return {
              id: gId,
              title: g.Judul || g.title || '',
              category: (g.Kategori || g.category || 'kelas').toLowerCase(),
              categoryLabel: g.KategoriLabel || g.categoryLabel || '',
              imgUrl: imgUrl,
              desc: g.Deskripsi || g.desc || ''
            };
          });
        }
        if (Array.isArray(incoming.karya) && incoming.karya.length) {
          currentData.karya = incoming.karya.map((k, idx) => {
            let thumb = k.Thumbnail || k.thumbnail || k.ImgUrl || '';
            if (!thumb || thumb.includes('photo-1580582932707-520aed937b7b')) {
              const def = DEFAULT_DATA.karya.find(d => d.title && d.title.trim().toLowerCase() === (k.NamaWebsite || k.title || k.Nama || '').trim().toLowerCase()) || DEFAULT_DATA.karya[idx];
              const existing = (currentData.karya || []).find(e => e.title && e.title.trim().toLowerCase() === (k.NamaWebsite || k.title || k.Nama || '').trim().toLowerCase()) || (currentData.karya || [])[idx];
              if (existing && existing.thumbnail && existing.thumbnail.startsWith('data:') && existing.thumbnail.length > 500) {
                thumb = existing.thumbnail;
              } else if (def && def.thumbnail) {
                thumb = def.thumbnail;
              } else {
                thumb = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
              }
            }
            return {
              id: String(k.ID || k.id || ''),
              title: k.NamaWebsite || k.title || k.Nama || '',
              desc: k.Deskripsi || k.desc || '',
              link: k.Link || k.link || '#',
              thumbnail: thumb
            };
          });
        } else if (url) {
          // Fallback fetch karya terpisah jika sheet Karya belum masuk di getAll
          try {
            const karyaRes = await fetch(url + (url.includes('?') ? '&' : '?') + 'action=getSection&section=Karya');
            const karyaJson = await karyaRes.json();
            if (karyaJson && Array.isArray(karyaJson.data) && karyaJson.data.length) {
              currentData.karya = karyaJson.data.map((k, idx) => {
                let thumb = k.Thumbnail || k.thumbnail || k.ImgUrl || '';
                if (!thumb || thumb.includes('photo-1580582932707-520aed937b7b')) {
                  const def = DEFAULT_DATA.karya.find(d => d.title && d.title.trim().toLowerCase() === (k.NamaWebsite || k.title || k.Nama || '').trim().toLowerCase()) || DEFAULT_DATA.karya[idx];
                  thumb = (def && def.thumbnail) ? def.thumbnail : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                }
                return {
                  id: String(k.ID || k.id || ''),
                  title: k.NamaWebsite || k.title || k.Nama || '',
                  desc: k.Deskripsi || k.desc || '',
                  link: k.Link || k.link || '#',
                  thumbnail: thumb
                };
              });
            }
          } catch (e) {}
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

        // Kompetensi (Validasi data riil KIK & Informatika vs dummy matematika)
        if (Array.isArray(incoming.kompetensi) && incoming.kompetensi.length) {
          const validKomp = incoming.kompetensi.filter(k => {
            const j = (k.Judul || k.judul || '');
            return !j.includes('Matematika Tingkat Lanjut') && !j.includes('OSN Matematika') && !j.includes('Aljabar Linear');
          });

          if (validKomp.length > 0) {
            currentData.kompetensi = validKomp.map(k => ({
              id: String(k.ID || k.id || ''),
              tingkat: k.Tingkat || k.tingkat || '',
              judul: k.Judul || k.judul || '',
              desc: k.Deskripsi || k.desc || '',
              icon: k.Icon || k.icon || 'fa-book',
              colorClass: k.ColorClass || k.colorClass || 'bg-blue-subtle text-blue',
              fiturList: typeof k.FiturList === 'string' ? k.FiturList.split('|') : (k.fiturList || [])
            }));
          } else {
            currentData.kompetensi = JSON.parse(JSON.stringify(DEFAULT_DATA.kompetensi));
          }
        } else if (!currentData.kompetensi || currentData.kompetensi.length === 0) {
          currentData.kompetensi = JSON.parse(JSON.stringify(DEFAULT_DATA.kompetensi));
        }

        // EdTech (Validasi tools kekinian vs GeoGebra matematika lama)
        if (Array.isArray(incoming.edtech) && incoming.edtech.length) {
          const validEdtech = incoming.edtech.filter(e => {
            const n = (e.Nama || e.name || '');
            return !n.includes('GeoGebra') && !n.includes('Desmos');
          });

          if (validEdtech.length > 0) {
            currentData.edtech = validEdtech.map(e => ({
              id: String(e.ID || e.id || ''),
              name: e.Nama || e.name || '',
              icon: e.Icon || e.icon || 'fa-solid fa-shapes',
              colorClass: e.ColorClass || e.colorClass || 'text-primary'
            }));
          } else {
            currentData.edtech = JSON.parse(JSON.stringify(DEFAULT_DATA.edtech));
          }
        } else if (!currentData.edtech || currentData.edtech.length === 0) {
          currentData.edtech = JSON.parse(JSON.stringify(DEFAULT_DATA.edtech));
        }

        // Timeline (Validasi karir SMK Telkom & UM vs ITB Bandung)
        if (Array.isArray(incoming.timeline) && incoming.timeline.length) {
          const validTimeline = incoming.timeline.filter(tl => {
            const inst = (tl.Institusi || tl.institusi || '');
            return !inst.includes('ITB') && !inst.includes('SMAN 1 Harapan Bangsa');
          });

          if (validTimeline.length > 0) {
            currentData.timeline = validTimeline.map(tl => ({
              id: String(tl.ID || tl.id || ''),
              year: tl.Tahun || tl.year || '',
              judul: tl.Judul || tl.judul || '',
              institusi: tl.Institusi || tl.institusi || '',
              desc: tl.Deskripsi || tl.desc || ''
            }));
          } else {
            currentData.timeline = JSON.parse(JSON.stringify(DEFAULT_DATA.timeline));
          }
        } else if (!currentData.timeline || currentData.timeline.length === 0) {
          currentData.timeline = JSON.parse(JSON.stringify(DEFAULT_DATA.timeline));
        }

        if (Array.isArray(incoming.faq) && incoming.faq.length) {
          currentData.faq = incoming.faq.map(f => ({
            id: String(f.ID || f.id || ''),
            question: f.Pertanyaan || f.question || '',
            answer: f.Jawaban || f.answer || ''
          }));
        }
        if (Array.isArray(incoming.nav_menus) && incoming.nav_menus.length) {
          currentData.nav_menus = incoming.nav_menus.map((m, idx) => ({
            id: String(m.ID || m.id || 'nav-' + (idx + 1)),
            label: m.Label || m.label || '',
            href: m.Href || m.href || '',
            icon: m.Icon || m.icon || 'fa-solid fa-link',
            is_active: String(m.IsActive !== undefined ? m.IsActive : (m.is_active !== undefined ? m.is_active : true)).toUpperCase() !== 'FALSE',
            order: Number(m.Order || m.order || (idx + 1))
          })).sort((a, b) => a.order - b.order);
        } else if (!currentData.nav_menus || currentData.nav_menus.length === 0) {
          currentData.nav_menus = JSON.parse(JSON.stringify(DEFAULT_DATA.nav_menus));
        }

        if (Array.isArray(incoming.pelatihan) && incoming.pelatihan.length) {
          currentData.pelatihan = incoming.pelatihan.map((p, idx) => {
            const existing = (currentData.pelatihan || []).find(x => String(x.id) === String(p.ID || p.id));
            let certificateUrl = p.CertificateUrl || p.certificateUrl || '#';
            let certificateFile = p.CertificateFile || p.certificateFile || '';
            if ((!certificateUrl || certificateUrl === '#' || certificateUrl.startsWith('indexeddb:')) && existing && existing.certificateUrl && existing.certificateUrl !== '#') {
              certificateUrl = existing.certificateUrl;
              certificateFile = existing.certificateFile || certificateFile;
            }
            return {
              id: String(p.ID || p.id || 'tr-' + (idx + 1)),
              title: p.Judul || p.title || '',
              category: (p.Kategori || p.category || 'diklat').toLowerCase(),
              organizer: p.Penyelenggara || p.organizer || '',
              period: p.Periode || p.period || '',
              jp: p.JP || p.jp || '',
              badge: p.Badge || p.badge || '',
              desc: p.Deskripsi || p.desc || '',
              skills: typeof (p.Skills || p.skills) === 'string' ? (p.Skills || p.skills).split('|') : (p.skills || []),
              certificateUrl: certificateUrl,
              certificateFile: certificateFile
            };
          });
        } else if (!currentData.pelatihan || currentData.pelatihan.length === 0) {
          currentData.pelatihan = JSON.parse(JSON.stringify(DEFAULT_DATA.pelatihan));
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
            return {
              ID: m.id,
              id: m.id,
              Judul: m.title,
              title: m.title,
              Kategori: m.category,
              category: m.category,
              Badge: m.badge,
              badge: m.badge,
              Fase: m.fase,
              fase: m.fase,
              Snippet: m.snippet,
              snippet: m.snippet,
              FileNotice: m.fileNotice,
              fileNotice: m.fileNotice,
              DownloadLink: safeLink,
              downloadLink: safeLink,
              CP: m.cp,
              cp: m.cp,
              ATP: m.atp,
              atp: m.atp,
              Diferensiasi: m.diferensiasi,
              diferensiasi: m.diferensiasi,
              Keywords: m.keywords,
              keywords: m.keywords
            };
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
          galeri: (currentData.galeri || []).map(g => ({
            ID: g.id || '',
            id: g.id || '',
            Judul: g.title,
            title: g.title,
            Kategori: g.category,
            category: g.category,
            KategoriLabel: g.categoryLabel,
            categoryLabel: g.categoryLabel,
            ImgUrl: (g.imgUrl || '').startsWith('data:') && g.imgUrl.length > 500 ? 'assets/galeri-default.jpg' : (g.imgUrl || ''),
            imgUrl: (g.imgUrl || '').startsWith('data:') && g.imgUrl.length > 500 ? 'assets/galeri-default.jpg' : (g.imgUrl || ''),
            Deskripsi: g.desc || '',
            desc: g.desc || ''
          })),
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
          kompetensi: (currentData.kompetensi || []).map(k => ({
            ID: k.id,
            id: k.id,
            Tingkat: k.tingkat,
            tingkat: k.tingkat,
            Judul: k.judul,
            judul: k.judul,
            Deskripsi: k.desc,
            desc: k.desc,
            Icon: k.icon,
            icon: k.icon,
            ColorClass: k.colorClass,
            colorClass: k.colorClass,
            FiturList: Array.isArray(k.fiturList) ? k.fiturList.join('|') : (k.fiturList || ''),
            fiturList: Array.isArray(k.fiturList) ? k.fiturList.join('|') : (k.fiturList || '')
          })),
          edtech: (currentData.edtech || []).map(e => ({
            ID: e.id,
            id: e.id,
            Nama: e.name,
            name: e.name,
            Icon: e.icon,
            icon: e.icon,
            ColorClass: e.colorClass,
            colorClass: e.colorClass
          })),
          timeline: (currentData.timeline || []).map(tl => ({
            ID: tl.id,
            id: tl.id,
            Tahun: tl.year,
            year: tl.year,
            Judul: tl.judul,
            judul: tl.judul,
            Institusi: tl.institusi,
            institusi: tl.institusi,
            Deskripsi: tl.desc,
            desc: tl.desc
          })),
          faq: currentData.faq,
          nav_menus: (currentData.nav_menus || []).map(m => ({
            ID: m.id,
            id: m.id,
            Label: m.label,
            label: m.label,
            Href: m.href,
            href: m.href,
            Icon: m.icon,
            icon: m.icon,
            IsActive: m.is_active,
            is_active: m.is_active,
            Order: m.order,
            order: m.order
          })),
          pelatihan: (currentData.pelatihan || []).map(p => {
            let safeCertUrl = p.certificateUrl || '#';
            if (safeCertUrl.startsWith('data:') && safeCertUrl.length > 500) {
              safeCertUrl = 'indexeddb:pelatihan_' + p.id;
            }
            return {
              ID: p.id,
              id: p.id,
              Judul: p.title,
              title: p.title,
              Kategori: p.category,
              category: p.category,
              Penyelenggara: p.organizer,
              organizer: p.organizer,
              Periode: p.period,
              period: p.period,
              JP: p.jp,
              jp: p.jp,
              Badge: p.badge,
              badge: p.badge,
              Deskripsi: p.desc,
              desc: p.desc,
              Skills: Array.isArray(p.skills) ? p.skills.join('|') : (p.skills || ''),
              skills: Array.isArray(p.skills) ? p.skills.join('|') : (p.skills || ''),
              CertificateUrl: safeCertUrl,
              certificateUrl: safeCertUrl,
              CertificateFile: p.certificateFile || '',
              certificateFile: p.certificateFile || ''
            };
          })
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
        name: "Bpk. Muhammad Chusni Agus",
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

    const isImageFile = (fileName && /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(fileName)) ||
                        (pdfUrl && (pdfUrl.startsWith('data:image/') || /\.(jpe?g|png|webp)(\?|$)/i.test(pdfUrl)));

    // 1. Jika disimpan di IndexedDB (indexeddb:id_dokumen)
    if (pdfUrl.startsWith('indexeddb:')) {
      const id = pdfUrl.replace('indexeddb:', '').trim();
      try {
        const record = await PdfStore.getPdf(id);
        if (record && record.dataUrl) {
          openPdfDocument(record.dataUrl, record.fileName || fileName);
          return;
        } else {
          // Fallback ke DEFAULT_DATA jika id cocok
          const def = (DEFAULT_DATA.prestasi || []).find(d => String(d.id) === id || pdfUrl.includes(String(d.id)));
          if (def && def.pdfUrl && !def.pdfUrl.startsWith('indexeddb:')) {
            openPdfDocument(def.pdfUrl, def.pdfFileName || fileName);
            return;
          }
          alert('Berkas di penyimpanan lokal tidak ditemukan atau telah dibersihkan oleh browser.');
          return;
        }
      } catch (err) {
        console.error('Error membaca berkas dari IndexedDB:', err);
        alert('Gagal memuat berkas dari penyimpanan browser.');
        return;
      }
    }

    // Jika berkas berupa gambar dan halaman memiliki lightbox modal (seperti di index.html), buka via Lightbox Modal
    if (isImageFile && typeof document !== 'undefined') {
      const lightbox = document.getElementById('lightbox-modal');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxCaption = document.getElementById('lightbox-caption');
      if (lightbox && lightboxImg) {
        lightboxImg.src = pdfUrl;
        lightboxImg.alt = fileName || 'Sertifikat Gambar';
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<strong>${fileName || 'Pratinjau Sertifikat / Berkas'}</strong><br><a href="${encodeURI(pdfUrl)}" download="${fileName || 'Dokumen.jpg'}" style="display:inline-block; margin-top:0.5rem; color:#fff; border:1px solid #94a3b8; padding:0.3rem 0.8rem; border-radius:6px; text-decoration:none; font-size:0.85rem;"><i class="fa-solid fa-download"></i> Unduh Berkas</a>`;
        }
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
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

    // 3. Jika berupa URL biasa (Google Drive, cloud storage, direct link, assets/...)
    try {
      window.open(encodeURI(pdfUrl), '_blank');
    } catch (e) {
      window.open(pdfUrl, '_blank');
    }
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

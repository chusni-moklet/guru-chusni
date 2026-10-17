/**
 * =========================================================================
 * JAVASCRIPT DASHBOARD ADMIN PROFIL PENDIDIK
 * =========================================================================
 * Mengelola antarmuka, autentikasi, navigasi tab, pemrosesan CRUD,
 * dan sinkronisasi spreadsheet.
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});

const AdminApp = (function () {
  let currentModalAction = null; // { type: 'modul'|'prestasi'|..., id: '...', isEdit: bool }

  function init() {
    initTheme();
    initAuth();
    initNavigation();
    initSyncAndStatus();
    initProfileConfig();
    initModulCRUD();
    initPrestasiCRUD();
    initGaleriCRUD();
    initKaryaCRUD();
    initKompetensiCRUD();
    initTimelineCRUD();
    initInbox();
    initSettings();
    initModalHandlers();

    // Dengarkan perubahan data DB
    if (window.DB) {
      DB.onDataChanged(() => {
        renderAllViews();
      });
    }

    // Periksa status login saat pertama dimuat
    checkAuthState();
  }

  /* --------------------------------------------------
     1. TEMA & TAMPILAN
     -------------------------------------------------- */
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeToggleBtn = document.getElementById('admin-theme-toggle');
    if (!themeToggleBtn) return;

    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
      updateThemeIcon(current);
    });
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('admin-theme-toggle');
    if (!btn) return;
    btn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }

  /* --------------------------------------------------
     2. AUTENTIKASI (LOGIN & LOGOUT)
     -------------------------------------------------- */
  function initAuth() {
    const formLogin = document.getElementById('form-login');
    const btnTogglePass = document.getElementById('btn-toggle-login-pass');
    const passInput = document.getElementById('login-password');
    const btnLogout = document.getElementById('btn-admin-logout');

    if (btnTogglePass && passInput) {
      btnTogglePass.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        btnTogglePass.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    if (formLogin) {
      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = passInput.value;
        const btnSubmit = document.getElementById('btn-login-action');

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memeriksa Akun...';

        try {
          const res = await DB.login(username, password);
          if (res.success) {
            showToast(`Selamat datang, ${res.user.name}!`, 'success');
            checkAuthState();
          } else {
            showLoginAlert(res.message || 'Login gagal.');
          }
        } catch (err) {
          showLoginAlert('Terjadi kesalahan koneksi login: ' + err.message);
        } finally {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Dashboard';
        }
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin keluar dari Dashboard Admin?')) {
          DB.logout();
          checkAuthState();
          showToast('Anda telah keluar dari sistem.', 'info');
        }
      });
    }
  }

  function checkAuthState() {
    const authWrap = document.getElementById('auth-container');
    const dashboardWrap = document.getElementById('dashboard-container');
    const isLoggedIn = DB.isLoggedIn();

    if (isLoggedIn) {
      authWrap.style.display = 'none';
      dashboardWrap.style.display = 'flex';
      
      const session = DB.getSession();
      if (session) {
        document.getElementById('sidebar-user-name').textContent = session.name || session.username;
        document.getElementById('sidebar-user-role').textContent = session.role || 'Administrator';
      }

      renderAllViews();
      updateConnectionStatusUI();
    } else {
      authWrap.style.display = 'flex';
      dashboardWrap.style.display = 'none';
    }
  }

  function showLoginAlert(msg) {
    const alertBox = document.getElementById('login-alert');
    if (!alertBox) return;
    alertBox.style.display = 'block';
    alertBox.style.backgroundColor = 'var(--color-danger-subtle)';
    alertBox.style.borderColor = 'var(--color-danger)';
    alertBox.innerHTML = `<i class="fa-solid fa-circle-exclamation text-danger"></i> <strong>Pemberitahuan:</strong> ${msg}`;
  }

  /* --------------------------------------------------
     3. NAVIGASI TAB & SIDEBAR RESPONSIVE
     -------------------------------------------------- */
  function initNavigation() {
    const menuLinks = document.querySelectorAll('.sidebar-menu .menu-link');
    const views = document.querySelectorAll('.admin-view');
    const titleEl = document.getElementById('topbar-page-title');
    const subtitleEl = document.getElementById('topbar-page-subtitle');
    const sidebar = document.getElementById('admin-sidebar');
    const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar');

    const viewTitles = {
      'view-overview': { title: 'Ikhtisar & Status Database', sub: 'Ringkasan data profil pendidik dan status sinkronisasi Google Sheets.' },
      'view-profile': { title: 'Profil & Identitas Pendidik', sub: 'Ubah biodata resmi, NIP, NUPTK, foto profil, dan teks halaman depan.' },
      'view-modul': { title: 'Kelola Modul Ajar & Sumber Belajar', sub: 'Tambah, ubah, dan hapus modul kurikulum merdeka, LKPD, serta bank soal.' },
      'view-prestasi': { title: 'Kelola Prestasi & Penghargaan', sub: 'Daftar piagam kejuaraan, sertifikasi profesi, dan publikasi buku pendidik.' },
      'view-galeri': { title: 'Kelola Galeri Dokumentasi', sub: 'Kelola dokumentasi foto aktivitas kelas, gelar karya P5, dan workshop.' },
      'view-karya': { title: 'Kelola Portofolio Karya Website', sub: 'Kumpulan website dan aplikasi yang pernah dibuat lengkap dengan deskripsi, link, dan screenshot thumbnail.' },
      'view-kompetensi': { title: 'Mata Pelajaran & Ekosistem EdTech', sub: 'Rincian bidang ajar dan perangkat lunak pembelajaran interaktif.' },
      'view-timeline': { title: 'Linimasa Pendidikan & Karir', sub: 'Riwayat studi sarjana/magister dan tonggak kepemimpinan guru penggerak.' },
      'view-inbox': { title: 'Kotak Masuk Formulir Website', sub: 'Pesan pertanyaan dan permintaan konsultasi yang dikirim pengunjung web.' },
      'view-settings': { title: 'Pengaturan Database & Spreadsheet', sub: 'Koneksi API Google Apps Script, ubah password, dan backup JSON.' }
    };

    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetViewId = link.getAttribute('data-view');
        if (!targetViewId) return;

        // Toggle Active Link
        menuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Toggle Active View
        views.forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById(targetViewId);
        if (targetView) targetView.classList.add('active');

        // Update Title & Subtitle
        if (viewTitles[targetViewId]) {
          titleEl.textContent = viewTitles[targetViewId].title;
          subtitleEl.textContent = viewTitles[targetViewId].sub;
        }

        // Close mobile drawer if open
        if (window.innerWidth <= 992 && sidebar) {
          sidebar.classList.remove('open');
        }
      });
    });

    if (toggleSidebarBtn && sidebar) {
      toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }

  /* --------------------------------------------------
     4. STATUS SINKRONISASI & SPREADSHEET
     -------------------------------------------------- */
  function initSyncAndStatus() {
    const btnSync = document.getElementById('btn-sync-now');
    const syncIcon = document.getElementById('sync-icon');

    if (btnSync) {
      btnSync.addEventListener('click', async () => {
        const gasUrl = DB.getGASUrl();
        if (!gasUrl) {
          showToast('URL Google Apps Script belum diatur. Buka menu Pengaturan untuk memasukkan URL.', 'warning');
          return;
        }

        btnSync.disabled = true;
        if (syncIcon) syncIcon.classList.add('fa-spin');

        try {
          // Sinkronisasi data dari Google Spreadsheet
          const res = await DB.syncFromGoogleSheets();
          if (res.success) {
            showToast('Sinkronisasi Berhasil: ' + res.message, 'success');
            renderAllViews();
            updateConnectionStatusUI(true);
          } else {
            showToast('Sinkronisasi Gagal: ' + res.message, 'error');
            updateConnectionStatusUI(false);
          }
        } catch (err) {
          showToast('Error koneksi: ' + err.message, 'error');
        } finally {
          btnSync.disabled = false;
          if (syncIcon) syncIcon.classList.remove('fa-spin');
        }
      });
    }

    // Modal Panduan Cepat
    const btnQuickGuide = document.getElementById('btn-quick-guide');
    const btnOpenGasModal = document.getElementById('btn-open-gas-modal');
    const guideModal = document.getElementById('guide-modal');
    const btnCloseGuide = document.getElementById('btn-close-guide-modal');
    const btnCloseGuideFooter = document.getElementById('btn-close-guide-footer');

    function openGuide() {
      if (guideModal) guideModal.classList.add('active');
    }
    function closeGuide() {
      if (guideModal) guideModal.classList.remove('active');
    }

    if (btnQuickGuide) btnQuickGuide.addEventListener('click', openGuide);
    if (btnOpenGasModal) btnOpenGasModal.addEventListener('click', openGuide);
    if (btnCloseGuide) btnCloseGuide.addEventListener('click', closeGuide);
    if (btnCloseGuideFooter) btnCloseGuideFooter.addEventListener('click', closeGuide);
    if (guideModal) {
      guideModal.addEventListener('click', (e) => {
        if (e.target === guideModal) closeGuide();
      });
    }
  }

  function updateConnectionStatusUI(isConnected) {
    const indicator = document.getElementById('header-status-indicator');
    const statusText = document.getElementById('header-status-text');
    const overviewDesc = document.getElementById('overview-gas-status-desc');
    const overviewUrl = document.getElementById('overview-gas-url-display');
    const gasUrl = DB.getGASUrl();

    if (overviewUrl) {
      overviewUrl.textContent = gasUrl || 'Belum dikonfigurasi (Klik menu Pengaturan)';
    }

    if (!gasUrl) {
      if (indicator) {
        indicator.className = 'status-indicator status-local';
      }
      if (statusText) statusText.textContent = 'Mode Lokal';
      if (overviewDesc) {
        overviewDesc.innerHTML = 'Data tersimpan di penyimpanan browser (localStorage). Pasang URL Apps Script di tab Pengaturan untuk sinkronisasi otomatis ke Google Sheets.';
      }
    } else {
      if (isConnected === false) {
        if (indicator) indicator.className = 'status-indicator status-error';
        if (statusText) statusText.textContent = 'Gagal Konek';
      } else {
        if (indicator) indicator.className = 'status-indicator status-connected';
        if (statusText) statusText.textContent = 'Spreadsheet Aktif';
        if (overviewDesc) {
          overviewDesc.innerHTML = '<span style="color: var(--color-success); font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Terhubung ke Google Spreadsheet!</span> Seluruh perubahan otomatis tersinkron.';
        }
      }
    }
  }

  /* --------------------------------------------------
     5. RENDER ALL VIEWS (DATA UTAMA)
     -------------------------------------------------- */
  function renderAllViews() {
    renderOverviewStats();
    populateProfileForm();
    renderModulTable();
    renderPrestasiTable();
    renderGaleriTable();
    renderKaryaTable();
    renderKompetensiTables();
    renderTimelineTable();
    renderInboxTable();
  }

  /* --------------------------------------------------
     6. OVERVIEW STATS & RECENT INBOX
     -------------------------------------------------- */
  function renderOverviewStats() {
    const db = DB.getAll();
    if (!db) return;

    document.getElementById('stat-count-modul').textContent = db.modul ? db.modul.length : 0;
    document.getElementById('stat-count-prestasi').textContent = db.prestasi ? db.prestasi.length : 0;
    document.getElementById('stat-count-galeri').textContent = db.galeri ? db.galeri.length : 0;
    const statKarya = document.getElementById('stat-count-karya');
    if (statKarya) statKarya.textContent = db.karya ? db.karya.length : 0;
    
    const inboxCount = db.pesanMasuk ? db.pesanMasuk.length : 0;
    document.getElementById('stat-count-inbox').textContent = inboxCount;
    
    const unreadCount = db.pesanMasuk ? db.pesanMasuk.filter(m => m.status === 'Baru').length : 0;
    const badgeInbox = document.getElementById('badge-inbox-count');
    if (badgeInbox) {
      badgeInbox.textContent = unreadCount;
      badgeInbox.style.display = unreadCount > 0 ? 'inline-block' : 'none';
    }

    // Render Recent Inbox in Overview
    const tbody = document.getElementById('table-overview-inbox');
    if (!tbody) return;

    if (!db.pesanMasuk || db.pesanMasuk.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">Belum ada pesan masuk dari formulir website.</td></tr>`;
      return;
    }

    const recent = db.pesanMasuk.slice(0, 5);
    tbody.innerHTML = recent.map(msg => `
      <tr>
        <td><small>${msg.tanggal || '-'}</small></td>
        <td><strong>${escapeHtml(msg.nama)}</strong></td>
        <td><span class="table-badge" style="background: var(--color-primary-subtle); color: var(--color-primary);">${escapeHtml(msg.peran)}</span></td>
        <td>${escapeHtml(msg.topik)}</td>
        <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(msg.pesan)}</td>
        <td>
          <a href="https://wa.me/${cleanPhone(msg.whatsapp)}?text=${encodeURIComponent('Halo ' + msg.nama + ', menanggapi pesan Anda seputar ' + msg.topik)}" target="_blank" class="btn-action view" title="Balas via WhatsApp">
            <i class="fa-brands fa-whatsapp text-success"></i>
          </a>
        </td>
      </tr>
    `).join('');
  }

  /* --------------------------------------------------
     7. PROFIL & IDENTITAS CONFIG
     -------------------------------------------------- */
  function initProfileConfig() {
    const form = document.getElementById('form-profile-config');
    const inputImg = document.getElementById('input-profile-img-url');
    const previewImg = document.getElementById('preview-profile-img');

    const inputProfileFile = document.getElementById('input-profile-file');
    const btnBrowseProfile = document.getElementById('btn-browse-profile-file');

    if (btnBrowseProfile && inputProfileFile) {
      btnBrowseProfile.addEventListener('click', () => {
        inputProfileFile.click();
      });
    }

    if (inputProfileFile && inputImg && previewImg) {
      inputProfileFile.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          showToast('Sedang memproses foto dari direktori...', 'info');
          const res = await processImageFile(file, 800, 800, 0.85);
          inputImg.value = res.dataUrl;
          previewImg.src = res.dataUrl;
          showToast('Foto profil dari direktori berhasil dimuat! Klik Simpan Pengaturan.', 'success');
        } catch (err) {
          showToast(err.message || 'Gagal memproses foto profil.', 'error');
        }
      });
    }

    if (inputImg && previewImg) {
      inputImg.addEventListener('input', () => {
        previewImg.src = inputImg.value.trim();
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updatedConfig = Object.assign({}, DB.getSection('config'));

        formData.forEach((val, key) => {
          updatedConfig[key] = val.trim();
        });

        DB.setSection('config', updatedConfig);
        showToast('Profil dan identitas pendidik berhasil disimpan!', 'success');

        // Jika terhubung ke Google Apps Script, sinkronkan
        if (DB.getGASUrl()) {
          DB.syncToGoogleSheets().then(res => {
            if (res.success) showToast('Perubahan profil berhasil disimpan ke Google Sheets!', 'success');
          });
        }
      });
    }
  }

  function populateProfileForm() {
    const form = document.getElementById('form-profile-config');
    const previewImg = document.getElementById('preview-profile-img');
    const config = DB.getSection('config');
    if (!form || !config) return;

    for (const key in config) {
      const input = form.elements[key];
      if (input) {
        input.value = config[key];
      }
    }

    if (previewImg && config.hero_image) {
      previewImg.src = config.hero_image;
    }
  }

  /* --------------------------------------------------
     8. MODUL AJAR (CRUD)
     -------------------------------------------------- */
  function initModulCRUD() {
    const btnAdd = document.getElementById('btn-add-modul');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        openCrudModal('modul', null);
      });
    }
  }

  function renderModulTable() {
    const tbody = document.getElementById('table-modul-body');
    const items = DB.getSection('modul') || [];
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">Belum ada modul ajar. Klik tombol "Tambah Modul Baru".</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map((m, index) => `
      <tr>
        <td><strong>${escapeHtml(m.title)}</strong></td>
        <td><span class="table-badge" style="background: var(--color-primary-subtle); color: var(--color-primary);">${escapeHtml(m.category)}</span></td>
        <td>${escapeHtml(m.fase)}</td>
        <td><code>${escapeHtml(m.fileNotice || '-')}</code></td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn-action edit" onclick="AdminApp.editItem('modul', '${m.id}')" title="Ubah Modul">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-action delete" onclick="AdminApp.deleteItem('modul', '${m.id}')" title="Hapus Modul">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* --------------------------------------------------
     9. PRESTASI & PENGHARGAAN (CRUD)
     -------------------------------------------------- */
  function initPrestasiCRUD() {
    const btnAdd = document.getElementById('btn-add-prestasi');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        openCrudModal('prestasi', null);
      });
    }
  }

  function renderPrestasiTable() {
    const tbody = document.getElementById('table-prestasi-body');
    const items = DB.getSection('prestasi') || [];
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">Belum ada data prestasi.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(p => `
      <tr>
        <td><span class="table-badge" style="background: var(--color-warning-subtle); color: var(--color-warning);">${escapeHtml(p.year)}</span></td>
        <td><strong>${escapeHtml(p.title)}</strong></td>
        <td>${escapeHtml(p.issuer)}</td>
        <td>${escapeHtml(p.category)}</td>
        <td>
          ${p.pdfUrl ? `
            <button type="button" class="btn-pdf-badge" onclick="AdminApp.viewPdf('${escapeHtml(p.id)}')" title="Lihat Berkas PDF / Sertifikat">
              <i class="fa-solid fa-file-pdf"></i>
              <span>${escapeHtml(p.pdfFileName ? (p.pdfFileName.length > 18 ? p.pdfFileName.substring(0, 15) + '...' : p.pdfFileName) : 'Lihat PDF')}</span>
            </button>
          ` : '<span style="color: var(--admin-text-muted); font-size: 0.8rem;">-</span>'}
        </td>
        <td>${p.highlight ? '<span style="color: var(--color-success); font-weight: 600;"><i class="fa-solid fa-star"></i> Ya</span>' : '-'}</td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn-action edit" onclick="AdminApp.editItem('prestasi', '${p.id}')" title="Ubah Prestasi">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-action delete" onclick="AdminApp.deleteItem('prestasi', '${p.id}')" title="Hapus">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* --------------------------------------------------
     11. GALERI FOTO (CRUD)
     -------------------------------------------------- */
  function initGaleriCRUD() {
    const btnAdd = document.getElementById('btn-add-galeri');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        openCrudModal('galeri', null);
      });
    }
  }

  function renderGaleriTable() {
    const tbody = document.getElementById('table-galeri-body');
    const items = DB.getSection('galeri') || [];
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">Belum ada foto galeri.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(g => `
      <tr>
        <td>
          <img src="${escapeHtml(g.imgUrl)}" alt="" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--admin-border);">
        </td>
        <td><strong>${escapeHtml(g.title)}</strong></td>
        <td><span class="table-badge" style="background: var(--color-purple-subtle); color: var(--color-purple);">${escapeHtml(g.categoryLabel || g.category)}</span></td>
        <td><small>${escapeHtml(g.desc)}</small></td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn-action edit" onclick="AdminApp.editItem('galeri', '${g.id}')" title="Ubah Foto">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-action delete" onclick="AdminApp.deleteItem('galeri', '${g.id}')" title="Hapus">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* --------------------------------------------------
     KARYA WEBSITE (CRUD)
     -------------------------------------------------- */
  function initKaryaCRUD() {
    const btnAdd = document.getElementById('btn-add-karya');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        openCrudModal('karya', null);
      });
    }
  }

  function renderKaryaTable() {
    const tbody = document.getElementById('table-karya-body');
    const items = DB.getSection('karya') || [];
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">Belum ada karya website yang ditambahkan. Silakan klik "Tambah Karya Baru".</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(k => `
      <tr>
        <td>
          <img src="${escapeHtml(k.thumbnail)}" alt="" style="width: 72px; height: 48px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--admin-border); box-shadow: var(--shadow-sm);">
        </td>
        <td><strong>${escapeHtml(k.title)}</strong></td>
        <td><small style="display: block; max-width: 320px; line-height: 1.4;">${escapeHtml(k.desc)}</small></td>
        <td>
          <a href="${escapeHtml(k.link)}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); font-size: 0.8125rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Website
          </a>
        </td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn-action edit" onclick="AdminApp.editItem('karya', '${k.id}')" title="Ubah Karya">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-action delete" onclick="AdminApp.deleteItem('karya', '${k.id}')" title="Hapus">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* --------------------------------------------------
     13. KOMPETENSI & EDTECH (CRUD)
     -------------------------------------------------- */
  function initKompetensiCRUD() {
    const btnAddKomp = document.getElementById('btn-add-kompetensi');
    const btnAddEdtech = document.getElementById('btn-add-edtech');

    if (btnAddKomp) {
      btnAddKomp.addEventListener('click', () => {
        openCrudModal('kompetensi', null);
      });
    }
    if (btnAddEdtech) {
      btnAddEdtech.addEventListener('click', () => {
        openCrudModal('edtech', null);
      });
    }
  }

  function renderKompetensiTables() {
    // Mapel
    const tbodyKomp = document.getElementById('table-kompetensi-body');
    const kompetensiItems = DB.getSection('kompetensi') || [];
    if (tbodyKomp) {
      tbodyKomp.innerHTML = kompetensiItems.map(k => `
        <tr>
          <td><strong>${escapeHtml(k.judul)}</strong></td>
          <td><span class="table-badge" style="background: var(--color-primary-subtle); color: var(--color-primary);">${escapeHtml(k.tingkat)}</span></td>
          <td><small>${escapeHtml(k.desc)}</small></td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn-action edit" onclick="AdminApp.editItem('kompetensi', '${k.id}')" title="Ubah Mapel">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="btn-action delete" onclick="AdminApp.deleteItem('kompetensi', '${k.id}')" title="Hapus">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // EdTech
    const tbodyEdtech = document.getElementById('table-edtech-body');
    const edtechItems = DB.getSection('edtech') || [];
    if (tbodyEdtech) {
      tbodyEdtech.innerHTML = edtechItems.map(e => `
        <tr>
          <td><i class="${escapeHtml(e.icon)} ${escapeHtml(e.colorClass)}" style="font-size: 1.1rem; margin-right: 0.5rem;"></i> <strong>${escapeHtml(e.name)}</strong></td>
          <td><code>${escapeHtml(e.icon)}</code></td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn-action edit" onclick="AdminApp.editItem('edtech', '${e.id}')" title="Ubah Tool">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="btn-action delete" onclick="AdminApp.deleteItem('edtech', '${e.id}')" title="Hapus">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  /* --------------------------------------------------
     14. TIMELINE / LINIMASA (CRUD)
     -------------------------------------------------- */
  function initTimelineCRUD() {
    const btnAdd = document.getElementById('btn-add-timeline');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        openCrudModal('timeline', null);
      });
    }
  }

  function renderTimelineTable() {
    const tbody = document.getElementById('table-timeline-body');
    const items = DB.getSection('timeline') || [];
    if (!tbody) return;

    tbody.innerHTML = items.map(tl => `
      <tr>
        <td><strong>${escapeHtml(tl.year)}</strong></td>
        <td><strong>${escapeHtml(tl.judul)}</strong></td>
        <td>${escapeHtml(tl.institusi)}</td>
        <td><small>${escapeHtml(tl.desc)}</small></td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn-action edit" onclick="AdminApp.editItem('timeline', '${tl.id}')" title="Ubah Linimasa">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-action delete" onclick="AdminApp.deleteItem('timeline', '${tl.id}')" title="Hapus">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* --------------------------------------------------
     15. KOTAK PESAN MASUK (INBOX)
     -------------------------------------------------- */
  function initInbox() {
    // Actions are handled dynamically via buttons in renderInboxTable
  }

  function renderInboxTable() {
    const tbody = document.getElementById('table-inbox-body');
    const items = DB.getSection('pesanMasuk') || [];
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--admin-text-muted); padding: 2rem;">Kotak masuk kosong. Belum ada pesan dari formulir kontak website.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(msg => `
      <tr>
        <td><small>${msg.tanggal || '-'}</small></td>
        <td><strong>${escapeHtml(msg.nama)}</strong></td>
        <td><span class="table-badge" style="background: var(--color-primary-subtle); color: var(--color-primary);">${escapeHtml(msg.peran)}</span></td>
        <td>
          <div><a href="mailto:${escapeHtml(msg.email)}"><i class="fa-solid fa-envelope"></i> ${escapeHtml(msg.email)}</a></div>
          <div><a href="https://wa.me/${cleanPhone(msg.whatsapp)}" target="_blank"><i class="fa-brands fa-whatsapp text-success"></i> ${escapeHtml(msg.whatsapp)}</a></div>
        </td>
        <td><strong>${escapeHtml(msg.topik)}</strong></td>
        <td style="max-width: 250px;">${escapeHtml(msg.pesan)}</td>
        <td>
          <span class="table-badge" style="background: ${msg.status === 'Baru' ? 'var(--color-danger-subtle)' : 'var(--color-success-subtle)'}; color: ${msg.status === 'Baru' ? 'var(--color-danger)' : 'var(--color-success)'};">
            ${escapeHtml(msg.status || 'Baru')}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <a href="https://wa.me/${cleanPhone(msg.whatsapp)}?text=${encodeURIComponent('Halo ' + msg.nama + ', menanggapi pesan Anda di website profil guru seputar ' + msg.topik)}" target="_blank" class="btn-action view" title="Balas WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <button type="button" class="btn-action edit" onclick="AdminApp.toggleMessageRead('${msg.id}')" title="Ubah Status">
              <i class="fa-solid fa-check"></i>
            </button>
            <button type="button" class="btn-action delete" onclick="AdminApp.deleteMessageItem('${msg.id}')" title="Hapus Pesan">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async function toggleMessageRead(id) {
    const items = DB.getSection('pesanMasuk') || [];
    const item = items.find(m => m.id === id);
    if (!item) return;

    const newStatus = item.status === 'Baru' ? 'Dibaca' : 'Baru';
    await DB.updateMessageStatus(id, newStatus);
    showToast(`Status pesan diubah menjadi: ${newStatus}`, 'info');
    renderAllViews();
  }

  async function deleteMessageItem(id) {
    if (confirm('Hapus pesan ini dari riwayat?')) {
      await DB.deleteMessage(id);
      showToast('Pesan berhasil dihapus.', 'info');
      renderAllViews();
    }
  }

  /* --------------------------------------------------
     16. PENGATURAN, KONEKSI GAS & BACKUP
     -------------------------------------------------- */
  function initSettings() {
    const inputGasUrl = document.getElementById('setting-gas-url');
    const btnSaveGas = document.getElementById('btn-save-gas-url');
    const btnTestConn = document.getElementById('btn-test-gas-conn');
    const connResult = document.getElementById('conn-test-result');

    if (inputGasUrl) {
      inputGasUrl.value = DB.getGASUrl();
    }

    if (btnSaveGas && inputGasUrl) {
      btnSaveGas.addEventListener('click', async () => {
        const url = inputGasUrl.value.trim();
        DB.setGASUrl(url);
        showToast('URL Google Apps Script berhasil disimpan!', 'success');
        updateConnectionStatusUI();

        if (url) {
          btnSaveGas.disabled = true;
          const testRes = await DB.testConnection(url);
          btnSaveGas.disabled = false;
          if (testRes.success) {
            showToast('Koneksi terhubung ke Google Spreadsheet! Memulai sinkronisasi data...', 'success');
            await DB.syncFromGoogleSheets();
            renderAllViews();
            updateConnectionStatusUI(true);
          } else {
            showToast(testRes.message, 'warning');
            updateConnectionStatusUI(false);
          }
        }
      });
    }

    if (btnTestConn) {
      btnTestConn.addEventListener('click', async () => {
        const url = inputGasUrl ? inputGasUrl.value.trim() : DB.getGASUrl();
        if (!url) {
          showToast('Isi URL Google Apps Script terlebih dahulu.', 'warning');
          return;
        }

        btnTestConn.disabled = true;
        btnTestConn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menguji...';
        connResult.style.display = 'block';
        connResult.style.backgroundColor = 'var(--admin-bg)';
        connResult.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menghubungi endpoint Google Apps Script...';

        try {
          const res = await DB.testConnection(url);
          if (res.success) {
            connResult.style.backgroundColor = 'var(--color-success-subtle)';
            connResult.style.color = 'var(--color-success)';
            connResult.innerHTML = `<strong><i class="fa-solid fa-circle-check"></i> Berhasil!</strong> ${res.message} (Respon server valid)`;
            updateConnectionStatusUI(true);
          } else {
            connResult.style.backgroundColor = 'var(--color-danger-subtle)';
            connResult.style.color = 'var(--color-danger)';
            connResult.innerHTML = `<strong><i class="fa-solid fa-triangle-exclamation"></i> Gagal Terhubung:</strong> ${res.message}`;
            updateConnectionStatusUI(false);
          }
        } catch (err) {
          connResult.style.backgroundColor = 'var(--color-danger-subtle)';
          connResult.style.color = 'var(--color-danger)';
          connResult.innerHTML = `<strong><i class="fa-solid fa-triangle-exclamation"></i> Error:</strong> ${err.message}`;
        } finally {
          btnTestConn.disabled = false;
          btnTestConn.innerHTML = '<i class="fa-solid fa-network-wired"></i> Uji Koneksi API';
        }
      });
    }

    // Ubah Password Form
    const formPass = document.getElementById('form-change-password');
    if (formPass) {
      formPass.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldP = document.getElementById('input-old-pass').value;
        const newP = document.getElementById('input-new-pass').value;
        const confirmP = document.getElementById('input-confirm-pass').value;

        if (newP !== confirmP) {
          showToast('Konfirmasi password baru tidak cocok!', 'warning');
          return;
        }

        const res = await DB.changePassword(oldP, newP);
        if (res.success) {
          showToast(res.message, 'success');
          formPass.reset();
        } else {
          showToast(res.message, 'error');
        }
      });
    }

    // Export JSON Backup
    const btnExport = document.getElementById('btn-export-json');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const jsonStr = DB.exportBackup();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profilku-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Backup data JSON berhasil diunduh.', 'success');
      });
    }

    // Import JSON Backup
    const inputImport = document.getElementById('input-import-json');
    if (inputImport) {
      inputImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const res = DB.importBackup(event.target.result);
          if (res.success) {
            showToast(res.message, 'success');
            renderAllViews();
          } else {
            showToast(res.message, 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset Data
    const btnReset = document.getElementById('btn-reset-data');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data kembali ke bawaan awal? Semua data kustom akan digantikan dengan data contoh default.')) {
          DB.resetToDefault();
          showToast('Data telah direset ke default.', 'info');
          renderAllViews();
        }
      });
    }
  }

  /* --------------------------------------------------
     17. MODAL CRUD HANDLERS
     -------------------------------------------------- */
  function initModalHandlers() {
    const modal = document.getElementById('crud-modal');
    const btnClose = document.getElementById('btn-close-crud-modal');
    const btnCancel = document.getElementById('btn-cancel-crud-modal');
    const form = document.getElementById('form-crud-modal');

    function closeModal() {
      if (modal) modal.classList.remove('active');
      currentModalAction = null;
    }

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const success = await saveCrudModal();
        if (success !== false) closeModal();
      });
    }
  }

  function openCrudModal(type, id) {
    const modal = document.getElementById('crud-modal');
    const titleEl = document.getElementById('crud-modal-title');
    const bodyEl = document.getElementById('crud-modal-body');
    if (!modal || !titleEl || !bodyEl) return;

    const isEdit = !!id;
    currentModalAction = { type, id, isEdit };

    let items = DB.getSection(type) || [];
    let item = isEdit ? items.find(x => x.id === id) : null;

    let modalTitleText = '';
    let formHtml = '';

    switch (type) {
      case 'modul':
        modalTitleText = isEdit ? 'Ubah Modul Ajar' : 'Tambah Modul Ajar Baru';
        formHtml = `
          <div class="form-group">
            <label class="form-label">Judul Materi Pembelajaran</label>
            <input type="text" class="form-control" name="title" value="${escapeHtml(item ? item.title : '')}" required>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select class="form-control" name="category" required>
                <option value="modul-ajar" ${item && item.category === 'modul-ajar' ? 'selected' : ''}>Modul Ajar</option>
                <option value="lkpd" ${item && item.category === 'lkpd' ? 'selected' : ''}>LKPD Interaktif</option>
                <option value="slide" ${item && item.category === 'slide' ? 'selected' : ''}>Slide & Presentasi</option>
                <option value="bank-soal" ${item && item.category === 'bank-soal' ? 'selected' : ''}>Bank Soal & SNBT</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Fase / Kelas</label>
              <input type="text" class="form-control" name="fase" placeholder="Contoh: Fase E (Kelas X)" value="${escapeHtml(item ? item.fase : '')}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Cuplikan Ringkas (Snippet)</label>
            <textarea class="form-control" name="snippet" rows="2" required>${escapeHtml(item ? item.snippet : '')}</textarea>
          </div>
          <!-- Upload Berkas PDF Modul Ajar / LKPD -->
          <div class="form-group">
            <label class="form-label"><i class="fa-solid fa-file-pdf text-danger"></i> Upload Berkas Dokumen PDF dari Direktori</label>
            <div class="file-upload-wrapper">
              <input type="file" id="modal-modul-pdf-input" accept=".pdf,application/pdf" style="display: none;">
              
              <div class="file-upload-dropzone pdf-dropzone" id="modal-modul-pdf-dropzone">
                <div class="upload-icon" style="color: #ef4444;"><i class="fa-solid fa-file-arrow-up"></i></div>
                <div class="upload-text">
                  <span class="upload-main-text"><strong>Klik untuk memilih file PDF</strong> atau seret file ke sini</span>
                  <span class="upload-sub-text">Pilih dokumen Modul Ajar, LKPD, atau Bank Soal (PDF) dari komputer</span>
                </div>
                <button type="button" class="btn-browse-file" id="modal-modul-btn-browse" style="border-color: #ef4444; color: #ef4444;">Pilih File PDF</button>
              </div>

              <div class="upload-preview-container pdf-preview-card" id="modal-modul-pdf-preview" style="${item && item.downloadLink && item.downloadLink !== '#' ? 'display: flex;' : 'display: none;'}">
                <div class="pdf-preview-icon">
                  <i class="fa-solid fa-file-pdf"></i>
                </div>
                <div class="upload-preview-details">
                  <span id="modal-modul-pdf-name" class="upload-file-name">${item && item.fileNotice ? escapeHtml(item.fileNotice) : 'Dokumen_Modul.pdf'}</span>
                  <span id="modal-modul-pdf-meta" class="upload-file-meta">${item && item.downloadLink ? 'Berkas siap diunduh' : 'Siap disimpan'}</span>
                </div>
                <div class="upload-preview-actions" style="display: flex; gap: 0.35rem;">
                  <button type="button" class="btn-topbar-action" id="modal-modul-btn-view-pdf" title="Lihat Berkas PDF">
                    <i class="fa-solid fa-eye"></i> Buka
                  </button>
                  <button type="button" class="btn-topbar-action" id="modal-modul-btn-change-pdf" title="Ganti File">
                    <i class="fa-solid fa-arrows-rotate"></i> Ganti
                  </button>
                  <button type="button" class="btn-action delete" id="modal-modul-btn-remove-pdf" title="Hapus Berkas">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Nama Berkas Unduhan</label>
              <input type="text" class="form-control" name="fileNotice" id="modal-modul-file-notice" placeholder="Modul_Matematika_FaseE.pdf" value="${escapeHtml(item ? item.fileNotice : '')}">
            </div>
            <div class="form-group">
              <label class="form-label">Tautan / Link Berkas (Google Drive / Direct)</label>
              <input type="text" class="form-control" name="downloadLink" id="modal-modul-download-link" placeholder="#" value="${escapeHtml(item ? item.downloadLink : '#')}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Capaian Pembelajaran (CP)</label>
            <textarea class="form-control" name="cp" rows="2">${escapeHtml(item ? item.cp : '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Alur Tujuan Pembelajaran (ATP)</label>
            <textarea class="form-control" name="atp" rows="2">${escapeHtml(item ? item.atp : '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Diferensiasi Pembelajaran</label>
            <textarea class="form-control" name="diferensiasi" rows="2">${escapeHtml(item ? item.diferensiasi : '')}</textarea>
          </div>
        `;
        break;

      case 'prestasi':
        modalTitleText = isEdit ? 'Ubah Prestasi / Karya' : 'Tambah Prestasi Baru';
        formHtml = `
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Tahun</label>
              <input type="text" class="form-control" name="year" placeholder="2024" value="${escapeHtml(item ? item.year : new Date().getFullYear())}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <input type="text" class="form-control" name="category" placeholder="Juara / Sertifikasi / Buku" value="${escapeHtml(item ? item.category : '')}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Nama Prestasi / Judul Sertifikasi</label>
            <input type="text" class="form-control" name="title" value="${escapeHtml(item ? item.title : '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Penyelenggara / Lembaga Penerbit</label>
            <input type="text" class="form-control" name="issuer" value="${escapeHtml(item ? item.issuer : '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi Singkat / Inovasi</label>
            <textarea class="form-control" name="desc" rows="2">${escapeHtml(item ? item.desc : '')}</textarea>
          </div>

          <!-- Upload Berkas PDF (Sertifikat / Piagam / Dokumen) -->
          <div class="form-group">
            <label class="form-label"><i class="fa-solid fa-file-pdf text-danger"></i> Upload Berkas / Sertifikat (PDF)</label>
            <div class="file-upload-wrapper">
              <input type="file" id="modal-prestasi-pdf-input" accept=".pdf,application/pdf" style="display: none;">
              
              <div class="file-upload-dropzone pdf-dropzone" id="modal-prestasi-pdf-dropzone">
                <div class="upload-icon" style="color: #ef4444;"><i class="fa-solid fa-file-arrow-up"></i></div>
                <div class="upload-text">
                  <span class="upload-main-text"><strong>Klik untuk memilih berkas PDF</strong> atau seret file ke sini</span>
                  <span class="upload-sub-text">Pilih file PDF sertifikat/piagam dari direktori komputer (Format .pdf)</span>
                </div>
                <button type="button" class="btn-browse-file" id="modal-prestasi-btn-browse" style="border-color: #ef4444; color: #ef4444;">Pilih File PDF</button>
              </div>

              <!-- Preview info file PDF terpilih -->
              <div class="upload-preview-container pdf-preview-card" id="modal-prestasi-pdf-preview" style="${item && item.pdfUrl ? 'display: flex;' : 'display: none;'}">
                <div class="pdf-preview-icon">
                  <i class="fa-solid fa-file-pdf"></i>
                </div>
                <div class="upload-preview-details">
                  <span id="modal-prestasi-pdf-name" class="upload-file-name">${item && item.pdfFileName ? escapeHtml(item.pdfFileName) : (item && item.pdfUrl ? 'Dokumen_Sertifikat.pdf' : 'Berkas PDF')}</span>
                  <span id="modal-prestasi-pdf-meta" class="upload-file-meta">${item && item.pdfUrl ? 'Dokumen PDF tersimpan & siap dilihat' : 'Siap disimpan'}</span>
                </div>
                <div class="upload-preview-actions" style="display: flex; gap: 0.35rem;">
                  <button type="button" class="btn-topbar-action" id="modal-prestasi-btn-view-pdf" title="Lihat / Pratinjau Dokumen PDF">
                    <i class="fa-solid fa-eye"></i> Buka
                  </button>
                  <button type="button" class="btn-topbar-action" id="modal-prestasi-btn-change-pdf" title="Ganti File PDF">
                    <i class="fa-solid fa-arrows-rotate"></i> Ganti
                  </button>
                  <button type="button" class="btn-action delete" id="modal-prestasi-btn-remove-pdf" title="Hapus Berkas PDF">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>

              <!-- Hidden inputs -->
              <input type="hidden" name="pdfUrl" id="modal-prestasi-pdf-url" value="${escapeHtml(item ? (item.pdfUrl || '') : '')}">
              <input type="hidden" name="pdfFileName" id="modal-prestasi-pdf-filename" value="${escapeHtml(item ? (item.pdfFileName || '') : '')}">

              <!-- Alternatif: URL Google Drive / Link Cloud -->
              <div class="alt-url-toggle" style="margin-top: 0.5rem; font-size: 0.8rem;">
                <button type="button" id="btn-toggle-prestasi-pdf-url" style="background: none; border: none; color: var(--color-primary); cursor: pointer; text-decoration: underline; padding: 0;">
                  <i class="fa-solid fa-link"></i> Atau gunakan Tautan URL Dokumen (Google Drive / Cloud)
                </button>
              </div>
              <div id="wrapper-alt-prestasi-pdf-url" style="display: ${item && item.pdfUrl && !item.pdfUrl.startsWith('data:') && !item.pdfUrl.startsWith('indexeddb:') ? 'block' : 'none'}; margin-top: 0.5rem;">
                <input type="text" class="form-control" name="altPdfUrl" id="modal-prestasi-alt-pdf-url" placeholder="https://drive.google.com/file/d/... atau https://..." value="${escapeHtml(item && item.pdfUrl && !item.pdfUrl.startsWith('data:') && !item.pdfUrl.startsWith('indexeddb:') ? item.pdfUrl : '')}">
                <span style="font-size: 0.75rem; color: var(--admin-text-muted);">Masukkan link shareable Google Drive bila file PDF disimpan di cloud.</span>
              </div>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Icon FontAwesome</label>
              <input type="text" class="form-control" name="icon" placeholder="fa-trophy" value="${escapeHtml(item ? item.icon : 'fa-trophy')}">
            </div>
            <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.75rem;">
              <input type="checkbox" name="highlight" id="input-prestasi-highlight" ${item && item.highlight ? 'checked' : ''}>
              <label for="input-prestasi-highlight" style="cursor: pointer; font-size: 0.875rem;">Sorot / Tampilkan Khusus di Halaman Utama</label>
            </div>
          </div>
        `;
        break;



      case 'galeri':
        modalTitleText = isEdit ? 'Ubah Foto Galeri' : 'Tambah Foto Dokumentasi';
        formHtml = `
          <div class="form-group">
            <label class="form-label">Judul Foto Aktivitas</label>
            <input type="text" class="form-control" name="title" value="${escapeHtml(item ? item.title : '')}" required>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select class="form-control" name="category" required>
                <option value="kelas" ${item && item.category === 'kelas' ? 'selected' : ''}>Suasana Kelas</option>
                <option value="projek" ${item && item.category === 'projek' ? 'selected' : ''}>Projek P5 & STEM</option>
                <option value="pelatihan" ${item && item.category === 'pelatihan' ? 'selected' : ''}>Workshop & Berbagi</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Label Kategori Tampilan</label>
              <input type="text" class="form-control" name="categoryLabel" placeholder="Suasana Kelas" value="${escapeHtml(item ? (item.categoryLabel || '') : 'Suasana Kelas')}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fa-solid fa-cloud-arrow-up"></i> Upload File Gambar dari Direktori</label>
            <div class="file-upload-wrapper">
              <input type="file" id="modal-galeri-file-input" accept="image/*" style="display: none;">
              <div class="file-upload-dropzone" id="modal-galeri-dropzone">
                <div class="upload-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                <div class="upload-text">
                  <span class="upload-main-text"><strong>Klik untuk memilih gambar</strong> atau seret file ke sini</span>
                  <span class="upload-sub-text">Pilih file gambar dari direktori komputer (JPG, PNG, WEBP, GIF)</span>
                </div>
                <button type="button" class="btn btn-sm btn-outline" id="modal-galeri-btn-browse">
                  <i class="fa-solid fa-folder-open"></i> Buka Direktori File
                </button>
              </div>

              <!-- Pratinjau Foto Setelah Dipilih -->
              <div class="upload-preview-container" id="modal-galeri-preview-box" style="${item && item.imgUrl ? 'display: flex;' : 'display: none;'}">
                <img id="modal-galeri-preview-img" src="${item && item.imgUrl ? escapeHtml(item.imgUrl) : ''}" alt="Pratinjau Foto">
                <div class="upload-preview-details">
                  <span id="modal-galeri-file-name" class="upload-file-name">${item && item.imgUrl ? 'Foto Tersedia' : 'File Terpilih'}</span>
                  <span id="modal-galeri-file-meta" class="upload-file-meta">${item && item.imgUrl ? 'Klik ganti jika ingin mengganti gambar' : 'Siap disimpan'}</span>
                </div>
                <button type="button" class="btn btn-sm btn-outline" id="modal-galeri-btn-change" title="Pilih Foto Lain">
                  <i class="fa-solid fa-rotate"></i> Ganti File
                </button>
              </div>

              <!-- Input tersembunyi yang menyimpan data gambar (Base64 atau URL) -->
              <input type="hidden" name="imgUrl" id="modal-galeri-img-url" value="${escapeHtml(item ? item.imgUrl : '')}">

              <!-- Tautan alternatif URL online jika sewaktu-waktu dibutuhkan -->
              <div style="margin-top: 0.35rem;">
                <button type="button" id="btn-toggle-url-input" style="background: none; border: none; color: var(--color-primary); font-size: 0.775rem; cursor: pointer; text-decoration: underline; padding: 0;">
                  <i class="fa-solid fa-link"></i> Atau gunakan tautan URL online (Opsional)
                </button>
                <div id="wrapper-alt-url" style="display: none; margin-top: 0.4rem;">
                  <input type="url" class="form-control" id="modal-galeri-alt-url" placeholder="https://images.unsplash.com/... atau link gambar" value="${item && item.imgUrl && !item.imgUrl.startsWith('data:') ? escapeHtml(item.imgUrl) : ''}">
                  <small style="color: var(--admin-text-muted); font-size: 0.72rem;">Jika diisi, tautan ini akan menggantikan file gambar di atas.</small>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Keterangan Singkat Foto</label>
            <textarea class="form-control" name="desc" rows="2" required>${escapeHtml(item ? item.desc : '')}</textarea>
          </div>
        `;
        break;

      case 'karya':
        modalTitleText = isEdit ? 'Ubah Karya Website' : 'Tambah Karya Website Baru';
        formHtml = `
          <div class="form-group">
            <label class="form-label">Nama Website / Judul Aplikasi</label>
            <input type="text" class="form-control" name="title" placeholder="Contoh: Be-Ternak (Moklet)" value="${escapeHtml(item ? item.title : '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Tautan / Link Website (URL)</label>
            <input type="url" class="form-control" name="link" placeholder="https://domain-website.com" value="${escapeHtml(item ? item.link : '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi Website, Fitur & Teknologi</label>
            <textarea class="form-control" name="desc" rows="3" placeholder="Jelaskan ringkas tujuan website, fitur utama, atau ekosistem pengguna..." required>${escapeHtml(item ? item.desc : '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fa-solid fa-cloud-arrow-up"></i> Thumbnail Gambar Website (Upload dari Direktori)</label>
            <div class="file-upload-wrapper">
              <input type="file" id="modal-karya-file-input" accept="image/*" style="display: none;">
              <div class="file-upload-dropzone" id="modal-karya-dropzone">
                <div class="upload-icon"><i class="fa-solid fa-laptop-code"></i></div>
                <div class="upload-text">
                  <span class="upload-main-text"><strong>Klik untuk memilih screenshot / thumbnail</strong> atau seret file ke sini</span>
                  <span class="upload-sub-text">Pilih file gambar dari direktori komputer (JPG, PNG, WEBP, GIF)</span>
                </div>
                <button type="button" class="btn btn-sm btn-outline" id="modal-karya-btn-browse">
                  <i class="fa-solid fa-folder-open"></i> Buka Direktori File
                </button>
              </div>

              <!-- Pratinjau Thumbnail Setelah Dipilih -->
              <div class="upload-preview-container" id="modal-karya-preview-box" style="${item && item.thumbnail ? 'display: flex;' : 'display: none;'}">
                <img id="modal-karya-preview-img" src="${item && item.thumbnail ? escapeHtml(item.thumbnail) : ''}" alt="Pratinjau Thumbnail">
                <div class="upload-preview-details">
                  <span id="modal-karya-file-name" class="upload-file-name">${item && item.thumbnail ? 'Thumbnail Tersedia' : 'File Terpilih'}</span>
                  <span id="modal-karya-file-meta" class="upload-file-meta">${item && item.thumbnail ? 'Klik ganti jika ingin mengganti thumbnail' : 'Siap disimpan'}</span>
                </div>
                <button type="button" class="btn btn-sm btn-outline" id="modal-karya-btn-change" title="Pilih Gambar Lain">
                  <i class="fa-solid fa-rotate"></i> Ganti File
                </button>
              </div>

              <!-- Input tersembunyi yang menyimpan data gambar (Base64 atau URL) -->
              <input type="hidden" name="thumbnail" id="modal-karya-thumbnail-url" value="${escapeHtml(item ? item.thumbnail : '')}">

              <!-- Tautan alternatif URL online jika sewaktu-waktu dibutuhkan -->
              <div style="margin-top: 0.35rem;">
                <button type="button" id="btn-toggle-karya-url" style="background: none; border: none; color: var(--color-primary); font-size: 0.775rem; cursor: pointer; text-decoration: underline; padding: 0;">
                  <i class="fa-solid fa-link"></i> Atau gunakan tautan URL online (Opsional)
                </button>
                <div id="wrapper-alt-karya-url" style="display: none; margin-top: 0.4rem;">
                  <input type="url" class="form-control" id="modal-karya-alt-url" placeholder="https://images.unsplash.com/... atau link thumbnail" value="${item && item.thumbnail && !item.thumbnail.startsWith('data:') ? escapeHtml(item.thumbnail) : ''}">
                  <small style="color: var(--admin-text-muted); font-size: 0.72rem;">Jika diisi, tautan ini akan menggantikan thumbnail di atas.</small>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case 'kompetensi':
        modalTitleText = isEdit ? 'Ubah Mata Pelajaran' : 'Tambah Mata Pelajaran';
        formHtml = `
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Nama Mata Pelajaran</label>
              <input type="text" class="form-control" name="judul" value="${escapeHtml(item ? item.judul : '')}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Tingkat / Fase</label>
              <input type="text" class="form-control" name="tingkat" placeholder="Fase E & F (Kelas X, XI, XII)" value="${escapeHtml(item ? item.tingkat : '')}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi Silabus</label>
            <textarea class="form-control" name="desc" rows="3" required>${escapeHtml(item ? item.desc : '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Fitur Utama (Pisahkan dengan tanda pipa | )</label>
            <input type="text" class="form-control" name="fiturList" placeholder="Fitur 1|Fitur 2|Fitur 3" value="${escapeHtml(item ? (Array.isArray(item.fiturList) ? item.fiturList.join('|') : item.fiturList) : '')}">
          </div>
        `;
        break;

      case 'edtech':
        modalTitleText = isEdit ? 'Ubah Tool EdTech' : 'Tambah Tool EdTech';
        formHtml = `
          <div class="form-group">
            <label class="form-label">Nama Aplikasi / Perangkat Lunak</label>
            <input type="text" class="form-control" name="name" placeholder="GeoGebra & Desmos" value="${escapeHtml(item ? item.name : '')}" required>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Class Icon FontAwesome</label>
              <input type="text" class="form-control" name="icon" placeholder="fa-solid fa-shapes" value="${escapeHtml(item ? item.icon : 'fa-solid fa-shapes')}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Class Warna</label>
              <input type="text" class="form-control" name="colorClass" placeholder="text-primary" value="${escapeHtml(item ? item.colorClass : 'text-primary')}">
            </div>
          </div>
        `;
        break;

      case 'timeline':
        modalTitleText = isEdit ? 'Ubah Linimasa Karir' : 'Tambah Linimasa Baru';
        formHtml = `
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Tahun / Periode</label>
              <input type="text" class="form-control" name="year" placeholder="2023 - Sekarang" value="${escapeHtml(item ? item.year : '')}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Institusi / Lembaga</label>
              <input type="text" class="form-control" name="institusi" placeholder="Kemendikbudristek RI" value="${escapeHtml(item ? item.institusi : '')}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Jabatan / Jenjang Pendidikan</label>
            <input type="text" class="form-control" name="judul" value="${escapeHtml(item ? item.judul : '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Deskripsi Aktivitas & Pencapaian</label>
            <textarea class="form-control" name="desc" rows="3" required>${escapeHtml(item ? item.desc : '')}</textarea>
          </div>
        `;
        break;
    }

    titleEl.textContent = modalTitleText;
    bodyEl.innerHTML = formHtml;
    modal.classList.add('active');

    if (type === 'galeri') {
      setupGaleriFileUpload();
    }
    if (type === 'karya') {
      setupKaryaFileUpload();
    }
    if (type === 'prestasi') {
      setupPrestasiPdfUpload();
    }
    if (type === 'modul') {
      setupModulPdfUpload();
    }
  }

  /* --------------------------------------------------
     HELPER PROSES GAMBAR DARI DIREKTORI (CANVAS RESIZER)
     -------------------------------------------------- */
  function processImageFile(file, maxWidth = 800, maxHeight = 600, quality = 0.78) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('File yang dipilih bukan berkas gambar yang valid.'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          let canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          let dataUrl = canvas.toDataURL('image/jpeg', quality);

          // Jika string dataURL melebihi 45.000 karakter (batas aman Google Sheets adalah 50.000 karakter per cell),
          // kompres ulang secara bertahap agar aman tersimpan di Google Sheets & localStorage
          if (dataUrl.length > 45000) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.65);
          }
          if (dataUrl.length > 45000) {
            const smallerCanvas = document.createElement('canvas');
            smallerCanvas.width = Math.round(width * 0.75);
            smallerCanvas.height = Math.round(height * 0.75);
            const sCtx = smallerCanvas.getContext('2d');
            sCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
            dataUrl = smallerCanvas.toDataURL('image/jpeg', 0.65);
          }

          resolve({
            dataUrl,
            name: file.name,
            sizeKb: Math.round((dataUrl.length * 0.75) / 1024)
          });
        };
        img.onerror = () => reject(new Error('Gagal memuat format gambar.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file dari disk.'));
      reader.readAsDataURL(file);
    });
  }

  function setupGaleriFileUpload() {
    const fileInput = document.getElementById('modal-galeri-file-input');
    const dropzone = document.getElementById('modal-galeri-dropzone');
    const btnBrowse = document.getElementById('modal-galeri-btn-browse');
    const previewBox = document.getElementById('modal-galeri-preview-box');
    const previewImg = document.getElementById('modal-galeri-preview-img');
    const fileNameEl = document.getElementById('modal-galeri-file-name');
    const fileMetaEl = document.getElementById('modal-galeri-file-meta');
    const btnChange = document.getElementById('modal-galeri-btn-change');
    const imgUrlInput = document.getElementById('modal-galeri-img-url');
    const btnToggleUrl = document.getElementById('btn-toggle-url-input');
    const wrapperAltUrl = document.getElementById('wrapper-alt-url');
    const altUrlInput = document.getElementById('modal-galeri-alt-url');

    if (!fileInput || !dropzone || !imgUrlInput) return;

    const handleFile = async (file) => {
      if (!file) return;
      try {
        if (fileMetaEl) fileMetaEl.textContent = 'Sedang memproses dan mengompres gambar...';
        const res = await processImageFile(file, 1200, 900, 0.82);
        imgUrlInput.value = res.dataUrl;
        if (previewImg) previewImg.src = res.dataUrl;
        if (fileNameEl) fileNameEl.textContent = res.name;
        if (fileMetaEl) fileMetaEl.textContent = `Ukuran: ~${res.sizeKb} KB (Siap disimpan)`;
        if (previewBox) previewBox.style.display = 'flex';
        if (altUrlInput) altUrlInput.value = '';
        showToast('Foto dari direktori berhasil dipilih!', 'success');
      } catch (err) {
        showToast(err.message || 'Gagal memproses file gambar.', 'error');
      }
    };

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleFile(file);
    });

    if (btnBrowse) {
      btnBrowse.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (btnChange) {
      btnChange.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt && dt.files && dt.files[0];
      if (file) handleFile(file);
    });

    if (btnToggleUrl && wrapperAltUrl) {
      btnToggleUrl.addEventListener('click', () => {
        const isHidden = wrapperAltUrl.style.display === 'none';
        wrapperAltUrl.style.display = isHidden ? 'block' : 'none';
      });
    }

    if (altUrlInput) {
      altUrlInput.addEventListener('input', () => {
        const urlVal = altUrlInput.value.trim();
        if (urlVal) {
          imgUrlInput.value = urlVal;
          if (previewImg) previewImg.src = urlVal;
          if (fileNameEl) fileNameEl.textContent = 'Tautan Gambar Web';
          if (fileMetaEl) fileMetaEl.textContent = urlVal;
          if (previewBox) previewBox.style.display = 'flex';
        }
      });
    }
  }

  function setupKaryaFileUpload() {
    const fileInput = document.getElementById('modal-karya-file-input');
    const dropzone = document.getElementById('modal-karya-dropzone');
    const btnBrowse = document.getElementById('modal-karya-btn-browse');
    const previewBox = document.getElementById('modal-karya-preview-box');
    const previewImg = document.getElementById('modal-karya-preview-img');
    const fileNameEl = document.getElementById('modal-karya-file-name');
    const fileMetaEl = document.getElementById('modal-karya-file-meta');
    const btnChange = document.getElementById('modal-karya-btn-change');
    const thumbUrlInput = document.getElementById('modal-karya-thumbnail-url');
    const btnToggleUrl = document.getElementById('btn-toggle-karya-url');
    const wrapperAltUrl = document.getElementById('wrapper-alt-karya-url');
    const altUrlInput = document.getElementById('modal-karya-alt-url');

    if (!fileInput || !dropzone || !thumbUrlInput) return;

    const handleFile = async (file) => {
      if (!file) return;
      try {
        if (fileMetaEl) fileMetaEl.textContent = 'Sedang memproses dan mengompres gambar...';
        const res = await processImageFile(file, 800, 600, 0.78);
        thumbUrlInput.value = res.dataUrl;
        if (previewImg) previewImg.src = res.dataUrl;
        if (fileNameEl) fileNameEl.textContent = res.name;
        if (fileMetaEl) fileMetaEl.textContent = `Ukuran: ~${res.sizeKb} KB (Siap disimpan)`;
        if (previewBox) previewBox.style.display = 'flex';
        if (altUrlInput) altUrlInput.value = '';
        showToast('Thumbnail website dari direktori berhasil dipilih!', 'success');
      } catch (err) {
        showToast(err.message || 'Gagal memproses file thumbnail gambar.', 'error');
      }
    };

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleFile(file);
    });

    if (btnBrowse) {
      btnBrowse.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (btnChange) {
      btnChange.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt && dt.files && dt.files[0];
      if (file) handleFile(file);
    });

    if (btnToggleUrl && wrapperAltUrl) {
      btnToggleUrl.addEventListener('click', () => {
        const isHidden = wrapperAltUrl.style.display === 'none';
        wrapperAltUrl.style.display = isHidden ? 'block' : 'none';
      });
    }

    if (altUrlInput) {
      altUrlInput.addEventListener('input', () => {
        const urlVal = altUrlInput.value.trim();
        if (urlVal) {
          thumbUrlInput.value = urlVal;
          if (previewImg) previewImg.src = urlVal;
          if (fileNameEl) fileNameEl.textContent = 'Tautan Gambar Web';
          if (fileMetaEl) fileMetaEl.textContent = urlVal;
          if (previewBox) previewBox.style.display = 'flex';
        }
      });
    }
  }

  function setupPrestasiPdfUpload() {
    const fileInput = document.getElementById('modal-prestasi-pdf-input');
    const dropzone = document.getElementById('modal-prestasi-pdf-dropzone');
    const btnBrowse = document.getElementById('modal-prestasi-btn-browse');
    const previewBox = document.getElementById('modal-prestasi-pdf-preview');
    const fileNameEl = document.getElementById('modal-prestasi-pdf-name');
    const fileMetaEl = document.getElementById('modal-prestasi-pdf-meta');
    const btnView = document.getElementById('modal-prestasi-btn-view-pdf');
    const btnChange = document.getElementById('modal-prestasi-btn-change-pdf');
    const btnRemove = document.getElementById('modal-prestasi-btn-remove-pdf');
    const pdfUrlInput = document.getElementById('modal-prestasi-pdf-url');
    const pdfFileNameInput = document.getElementById('modal-prestasi-pdf-filename');
    const btnToggleUrl = document.getElementById('btn-toggle-prestasi-pdf-url');
    const wrapperAltUrl = document.getElementById('wrapper-alt-prestasi-pdf-url');
    const altUrlInput = document.getElementById('modal-prestasi-alt-pdf-url');

    if (!fileInput || !dropzone || !pdfUrlInput) return;

    const btnSubmitModal = document.getElementById('btn-submit-crud-modal');

    const handleFile = (file) => {
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        showToast('Harap pilih dokumen sertifikat berformat .pdf!', 'error');
        return;
      }

      const sizeKb = Math.round(file.size / 1024);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const displaySize = sizeKb > 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

      if (file.size > 15 * 1024 * 1024) {
        showToast(`File berukuran ${displaySize}. File PDF di atas 15MB disarankan menggunakan tautan Google Drive.`, 'warning', 6000);
      }

      window._isReadingPdfFile = true;
      if (btnSubmitModal) {
        btnSubmitModal.disabled = true;
        btnSubmitModal.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses File PDF...';
      }
      if (fileMetaEl) fileMetaEl.textContent = `Sedang memuat ${file.name} (${displaySize})...`;

      const reader = new FileReader();
      reader.onload = (e) => {
        window._isReadingPdfFile = false;
        if (btnSubmitModal) {
          btnSubmitModal.disabled = false;
          btnSubmitModal.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Data';
        }
        const dataUrl = e.target.result;
        pdfUrlInput.value = dataUrl;
        if (pdfFileNameInput) pdfFileNameInput.value = file.name;
        if (fileNameEl) fileNameEl.textContent = file.name;
        if (fileMetaEl) fileMetaEl.textContent = `Ukuran: ${displaySize} • Siap disimpan`;
        if (previewBox) previewBox.style.display = 'flex';
        if (altUrlInput) altUrlInput.value = '';
        showToast(`File PDF "${file.name}" (${displaySize}) berhasil dimuat!`, 'success');
      };
      reader.onerror = () => {
        window._isReadingPdfFile = false;
        if (btnSubmitModal) {
          btnSubmitModal.disabled = false;
          btnSubmitModal.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Data';
        }
        showToast('Gagal membaca file PDF dari disk.', 'error');
      };
      reader.readAsDataURL(file);
    };

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleFile(file);
    });

    if (btnBrowse) {
      btnBrowse.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (btnChange) {
      btnChange.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (btnRemove) {
      btnRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        pdfUrlInput.value = '';
        if (pdfFileNameInput) pdfFileNameInput.value = '';
        if (altUrlInput) altUrlInput.value = '';
        if (previewBox) previewBox.style.display = 'none';
        showToast('Berkas PDF dihapus.', 'info');
      });
    }

    if (btnView) {
      btnView.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = pdfUrlInput.value;
        const name = (pdfFileNameInput && pdfFileNameInput.value) || 'Sertifikat.pdf';
        if (url) {
          if (window.openPdfDocument) {
            window.openPdfDocument(url, name);
          } else {
            window.open(url, '_blank');
          }
        } else {
          showToast('Belum ada berkas PDF yang dipilih.', 'warning');
        }
      });
    }

    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt && dt.files && dt.files[0];
      if (file) handleFile(file);
    });

    if (btnToggleUrl && wrapperAltUrl) {
      btnToggleUrl.addEventListener('click', () => {
        const isHidden = wrapperAltUrl.style.display === 'none';
        wrapperAltUrl.style.display = isHidden ? 'block' : 'none';
      });
    }

    if (altUrlInput) {
      const syncAltUrl = () => {
        const urlVal = altUrlInput.value.trim();
        if (urlVal) {
          pdfUrlInput.value = urlVal;
          const inferredName = urlVal.split('/').pop().split('?')[0] || 'Dokumen_Online.pdf';
          if (pdfFileNameInput && !pdfFileNameInput.value) pdfFileNameInput.value = inferredName;
          if (fileNameEl) fileNameEl.textContent = pdfFileNameInput.value || inferredName;
          if (fileMetaEl) fileMetaEl.textContent = 'Tautan Dokumen Online: ' + (urlVal.length > 35 ? urlVal.substring(0, 32) + '...' : urlVal);
          if (previewBox) previewBox.style.display = 'flex';
        }
      };
      altUrlInput.addEventListener('input', syncAltUrl);
      altUrlInput.addEventListener('change', syncAltUrl);
      altUrlInput.addEventListener('paste', () => setTimeout(syncAltUrl, 50));
    }
  }

  function setupModulPdfUpload() {
    const fileInput = document.getElementById('modal-modul-pdf-input');
    const dropzone = document.getElementById('modal-modul-pdf-dropzone');
    const btnBrowse = document.getElementById('modal-modul-btn-browse');
    const previewBox = document.getElementById('modal-modul-pdf-preview');
    const fileNameEl = document.getElementById('modal-modul-pdf-name');
    const fileMetaEl = document.getElementById('modal-modul-pdf-meta');
    const btnView = document.getElementById('modal-modul-btn-view-pdf');
    const btnChange = document.getElementById('modal-modul-btn-change-pdf');
    const btnRemove = document.getElementById('modal-modul-btn-remove-pdf');
    const fileNoticeInput = document.getElementById('modal-modul-file-notice');
    const downloadLinkInput = document.getElementById('modal-modul-download-link');

    if (!fileInput || !dropzone || !downloadLinkInput) return;

    const btnSubmitModal = document.getElementById('btn-submit-crud-modal');

    const handleFile = (file) => {
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        showToast('Harap pilih dokumen berformat .pdf!', 'error');
        return;
      }

      const sizeKb = Math.round(file.size / 1024);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      const displaySize = sizeKb > 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

      if (file.size > 15 * 1024 * 1024) {
        showToast(`File berukuran ${displaySize}. File PDF di atas 15MB disarankan menggunakan tautan Google Drive.`, 'warning', 6000);
      }

      window._isReadingPdfFile = true;
      if (btnSubmitModal) {
        btnSubmitModal.disabled = true;
        btnSubmitModal.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses File PDF...';
      }
      if (fileMetaEl) fileMetaEl.textContent = `Sedang memuat ${file.name} (${displaySize})...`;

      const reader = new FileReader();
      reader.onload = (e) => {
        window._isReadingPdfFile = false;
        if (btnSubmitModal) {
          btnSubmitModal.disabled = false;
          btnSubmitModal.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Data';
        }
        const dataUrl = e.target.result;
        downloadLinkInput.value = dataUrl;
        if (fileNoticeInput) fileNoticeInput.value = file.name;
        if (fileNameEl) fileNameEl.textContent = file.name;
        if (fileMetaEl) fileMetaEl.textContent = `Ukuran: ${displaySize} • Siap diunduh`;
        if (previewBox) previewBox.style.display = 'flex';
        showToast(`File PDF "${file.name}" (${displaySize}) berhasil dimuat!`, 'success');
      };
      reader.onerror = () => {
        window._isReadingPdfFile = false;
        if (btnSubmitModal) {
          btnSubmitModal.disabled = false;
          btnSubmitModal.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Data';
        }
        showToast('Gagal membaca file PDF dari disk.', 'error');
      };
      reader.readAsDataURL(file);
    };

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleFile(file);
    });

    if (btnBrowse) {
      btnBrowse.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (btnChange) {
      btnChange.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (btnRemove) {
      btnRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        downloadLinkInput.value = '#';
        if (fileNoticeInput) fileNoticeInput.value = '';
        if (previewBox) previewBox.style.display = 'none';
        showToast('Berkas dokumen dihapus.', 'info');
      });
    }

    if (btnView) {
      btnView.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = downloadLinkInput.value;
        const name = (fileNoticeInput && fileNoticeInput.value) || 'Modul.pdf';
        if (url && url !== '#') {
          if (window.openPdfDocument) {
            window.openPdfDocument(url, name);
          } else {
            window.open(url, '_blank');
          }
        } else {
          showToast('Belum ada berkas PDF yang dipilih.', 'warning');
        }
      });
    }

    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt && dt.files && dt.files[0];
      if (file) handleFile(file);
    });

    if (downloadLinkInput) {
      downloadLinkInput.addEventListener('input', () => {
        const urlVal = downloadLinkInput.value.trim();
        if (urlVal && urlVal !== '#') {
          if (fileNameEl) fileNameEl.textContent = fileNoticeInput && fileNoticeInput.value ? fileNoticeInput.value : 'Dokumen Online';
          if (fileMetaEl) fileMetaEl.textContent = urlVal;
          if (previewBox) previewBox.style.display = 'flex';
        }
      });
    }
  }

  async function saveCrudModal() {
    if (!currentModalAction) return false;
    const { type, id, isEdit } = currentModalAction;
    const form = document.getElementById('form-crud-modal');
    if (!form) return false;

    // Pastikan tidak submit saat file sedang dibaca oleh FileReader
    if (window._isReadingPdfFile) {
      showToast('Harap tunggu hingga berkas PDF selesai diproses...', 'warning');
      return false;
    }

    const formData = new FormData(form);
    let items = DB.getSection(type) || [];
    let newItem = {};

    formData.forEach((val, key) => {
      if (key === 'highlight') {
        newItem[key] = true;
      } else if (key === 'rating') {
        newItem[key] = Number(val);
      } else if (key === 'fiturList') {
        newItem[key] = val.split('|').map(s => s.trim()).filter(Boolean);
      } else {
        newItem[key] = val.trim();
      }
    });

    if (!newItem.highlight && type === 'prestasi') {
      newItem.highlight = false;
    }

    if (type === 'galeri' && !newItem.imgUrl) {
      showToast('Harap pilih file gambar dari direktori atau masukkan URL gambar terlebih dahulu!', 'error');
      return false;
    }

    if (type === 'karya' && !newItem.thumbnail) {
      showToast('Harap pilih thumbnail gambar website dari direktori atau masukkan URL gambar!', 'error');
      return false;
    }

    const itemId = isEdit ? id : String(Date.now());
    newItem.id = itemId;

    // Penanganan khusus berkas PDF Prestasi (IndexedDB + fallback cloud URL)
    if (type === 'prestasi') {
      const hiddenUrl = document.getElementById('modal-prestasi-pdf-url');
      const hiddenName = document.getElementById('modal-prestasi-pdf-filename');
      const altUrl = document.getElementById('modal-prestasi-alt-pdf-url');

      let finalPdfUrl = (hiddenUrl && hiddenUrl.value.trim()) || newItem.pdfUrl || '';
      let finalPdfName = (hiddenName && hiddenName.value.trim()) || newItem.pdfFileName || '';

      if (!finalPdfUrl && altUrl && altUrl.value.trim()) {
        finalPdfUrl = altUrl.value.trim();
        if (!finalPdfName) {
          finalPdfName = finalPdfUrl.split('/').pop().split('?')[0] || 'Dokumen_Online.pdf';
        }
      }

      if (finalPdfUrl && finalPdfUrl.startsWith('data:')) {
        if (DB.PdfStore) {
          await DB.PdfStore.savePdf('prestasi_' + itemId, finalPdfUrl, finalPdfName);
          newItem.pdfUrl = 'indexeddb:prestasi_' + itemId;
        } else {
          newItem.pdfUrl = finalPdfUrl;
        }
      } else {
        newItem.pdfUrl = finalPdfUrl;
      }
      newItem.pdfFileName = finalPdfName || (newItem.title ? `${newItem.title}.pdf` : 'Berkas_Sertifikat.pdf');
    }

    // Penanganan khusus berkas PDF Modul Ajar (IndexedDB + fallback cloud URL)
    if (type === 'modul') {
      const hiddenLink = document.getElementById('modal-modul-download-link');
      const hiddenNotice = document.getElementById('modal-modul-file-notice');

      let finalLink = (hiddenLink && hiddenLink.value.trim()) || newItem.downloadLink || '#';
      let finalNotice = (hiddenNotice && hiddenNotice.value.trim()) || newItem.fileNotice || '';

      if (finalLink && finalLink.startsWith('data:')) {
        if (DB.PdfStore) {
          await DB.PdfStore.savePdf('modul_' + itemId, finalLink, finalNotice);
          newItem.downloadLink = 'indexeddb:modul_' + itemId;
        } else {
          newItem.downloadLink = finalLink;
        }
      } else {
        newItem.downloadLink = finalLink || '#';
      }
      newItem.fileNotice = finalNotice || (newItem.title ? `${newItem.title}.pdf` : 'Modul_Ajar.pdf');
    }

    if (isEdit) {
      items = items.map(x => x.id === id ? Object.assign({}, x, newItem) : x);
      showToast('Data berhasil diperbarui!', 'success');
    } else {
      items.push(newItem);
      showToast('Data baru berhasil ditambahkan!', 'success');
    }

    DB.setSection(type, items);
    renderAllViews();

    // Simpan ke Google Spreadsheet jika URL aktif
    if (DB.getGASUrl()) {
      DB.syncToGoogleSheets().then(res => {
        if (res.success) showToast('Tersimpan ke Google Sheets!', 'success');
      });
    }

    return true;
  }

  function editItem(type, id) {
    openCrudModal(type, id);
  }

  function deleteItem(type, id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      let items = DB.getSection(type) || [];
      items = items.filter(x => x.id !== id);
      DB.setSection(type, items);

      if (type === 'prestasi' && DB.PdfStore) {
        DB.PdfStore.deletePdf('prestasi_' + id);
      }
      if (type === 'modul' && DB.PdfStore) {
        DB.PdfStore.deletePdf('modul_' + id);
      }

      showToast('Data berhasil dihapus.', 'info');
      renderAllViews();

      if (DB.getGASUrl()) {
        DB.syncToGoogleSheets();
      }
    }
  }

  /* --------------------------------------------------
     18. TOAST NOTIFICATION UTILITY
     -------------------------------------------------- */
  function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-info-circle text-primary';
    if (type === 'success') iconClass = 'fa-circle-check text-success';
    if (type === 'error') iconClass = 'fa-circle-xmark text-danger';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation text-warning';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}" style="font-size: 1.25rem;"></i>
      <div style="flex: 1; font-size: 0.875rem;">${message}</div>
      <button style="background:none;border:none;cursor:pointer;color:var(--admin-text-muted);">&times;</button>
    `;

    toast.querySelector('button').addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  /* --------------------------------------------------
     19. STRING HELPERS
     -------------------------------------------------- */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function cleanPhone(num) {
    if (!num) return '6281234567890';
    let cleaned = String(num).replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) cleaned = '62' + cleaned.slice(1);
    return cleaned;
  }

  function viewPdf(id) {
    const items = DB.getSection('prestasi') || [];
    const item = items.find(x => x.id === id);
    if (!item || !item.pdfUrl) {
      showToast('Berkas PDF belum tersedia atau belum diunggah untuk prestasi ini.', 'warning');
      return;
    }
    if (window.openPdfDocument) {
      window.openPdfDocument(item.pdfUrl, item.pdfFileName || `${item.title}.pdf`);
    } else {
      window.open(item.pdfUrl, '_blank');
    }
  }

  return {
    init,
    editItem,
    deleteItem,
    toggleMessageRead,
    deleteMessageItem,
    showToast,
    viewPdf
  };
})();

// Ekspor ke window agar tombol onclick HTML dapat memanggilnya
window.AdminApp = AdminApp;

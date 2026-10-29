/**
 * PROFIL PENDIDIK - MAIN JAVASCRIPT
 * Bpk. Rahmat Hidayat, S.Pd., M.Pd. - Guru Penggerak
 * Features: Dark/Light Mode, Mobile Nav, Resources Search & Filter,
 * Resource Detail Modal, Day Schedule Tabs, Gallery Lightbox,
 * Contact Form with WhatsApp & Database Integration, FAQ Accordion, Back-to-Top,
 * dan Dynamic Data Layer (DB / Google Spreadsheet sync).
 */

function initApp() {
  initThemeToggle();
  initMobileNav();
  initNavbarScroll();
  initScrollSpy();
  initAccordion();
  initBackToTop();
  initContactForm();
  initPortfolioTabs();
  initTrainingFilters();

  // Integrasi Dynamic Database (LocalStorage + Google Apps Script)
  if (window.DB) {
    applyDynamicData();
    DB.onDataChanged(() => {
      applyDynamicData();
    });

    // Background sync jika URL Google Apps Script telah disetel
    if (DB.getGASUrl()) {
      DB.syncFromGoogleSheets().then(res => {
        if (res.success) {
          applyDynamicData();
        }
      }).catch(e => console.warn('Background sync note:', e));
    }
  } else {
    // Fallback inisialisasi modul & galeri statis
    initResourceFilterAndSearch();
    initResourceModal();
    initGalleryFilterAndLightbox();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* --------------------------------------------------
   0. DYNAMIC DATA RENDER (MENERAPKAN DATA DARI DATABASE)
   -------------------------------------------------- */
function applyDynamicData() {
  if (!window.DB) return;
  const db = DB.getAll();
  if (!db) return;

  try { renderDynamicNav(db.nav_menus); } catch (e) { console.error("Error renderDynamicNav:", e); }
  try { renderDynamicConfig(db.config); } catch (e) { console.error("Error renderDynamicConfig:", e); }
  try { renderDynamicModul(db.modul); } catch (e) { console.error("Error renderDynamicModul:", e); }
  try { renderDynamicPrestasi(db.prestasi); } catch (e) { console.error("Error renderDynamicPrestasi:", e); }
  try { renderDynamicKarya(db.karya); } catch (e) { console.error("Error renderDynamicKarya:", e); }
  try { renderDynamicGaleri(db.galeri); } catch (e) { console.error("Error renderDynamicGaleri:", e); }
  try { renderDynamicKompetensi(db.kompetensi, db.edtech); } catch (e) { console.error("Error renderDynamicKompetensi:", e); }
  try { renderDynamicPelatihan(db.pelatihan); } catch (e) { console.error("Error renderDynamicPelatihan:", e); }
  try { renderDynamicTimeline(db.timeline); } catch (e) { console.error("Error renderDynamicTimeline:", e); }

  // Inisialisasi ulang interaksi yang bergantung pada DOM baru
  try { initResourceFilterAndSearch(); } catch (e) {}
  try { initResourceModal(); } catch (e) {}
  try { initGalleryFilterAndLightbox(); } catch (e) {}
  try { initPortfolioTabs(); } catch (e) {}
}

function renderDynamicConfig(cfg) {
  if (!cfg) return;

  // 1. Announcement Bar
  const announceP = document.querySelector('.top-announcement .announcement-content p');
  const announceLink = document.querySelector('.top-announcement .announcement-link');
  if (announceP && cfg.announcement_text) announceP.textContent = cfg.announcement_text;
  if (announceLink && cfg.announcement_link) announceLink.href = cfg.announcement_link;

  // 2. Brand Name & Sub
  const brandNames = document.querySelectorAll('.brand-name');
  const brandSubs = document.querySelectorAll('.brand-sub');
  brandNames.forEach(el => el.textContent = cfg.teacher_name || 'Muhammad Chusni Agus');
  brandSubs.forEach(el => el.textContent = (cfg.teacher_degrees ? cfg.teacher_degrees + ' • ' : '') + (cfg.teacher_tagline || 'Guru Penggerak'));

  // 3. Hero Section
  const heroBadge = document.querySelector('.hero-tag .tag-badge');
  const heroSchool = document.querySelector('.hero-tag .tag-sub');
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-description');
  const teacherPhoto = document.querySelector('.teacher-photo');
  const overlayName = document.querySelector('.teacher-card-overlay .overlay-name');
  const overlayRole = document.querySelector('.teacher-card-overlay .overlay-role');

  if (heroBadge) {
    const badgeText = cfg.hero_tag_badge || 'Guru Penggerak Kemendikdasmen';
    heroBadge.innerHTML = `<i class="fa-solid fa-certificate"></i> ${escapeHtml(badgeText)}`;
  }
  if (heroSchool) {
    heroSchool.textContent = cfg.hero_tag_sub || cfg.school_name || 'SMK Telkom Malang';
  }
  if (heroTitle && cfg.hero_title) {
    heroTitle.innerHTML = escapeHtml(cfg.hero_title)
      .replace('Hati', '<span class="text-gradient">Hati</span>')
      .replace('Aksi & Teknologi', '<span class="text-gradient-alt">Aksi & Teknologi</span>');
  }
  if (heroDesc && cfg.hero_desc) heroDesc.textContent = cfg.hero_desc;
  if (teacherPhoto && cfg.hero_image) teacherPhoto.src = cfg.hero_image;
  if (overlayName && cfg.teacher_name) overlayName.textContent = 'Bpk. ' + cfg.teacher_name;
  if (overlayRole && cfg.teacher_tagline) overlayRole.textContent = cfg.teacher_tagline;

  // Hero Pills
  const pills = document.querySelectorAll('.hero-meta-pills .meta-pill');
  if (pills.length >= 3) {
    if (cfg.nuptk) pills[0].innerHTML = `<i class="fa-solid fa-id-card"></i> <span>NUPTK: <strong>${cfg.nuptk}</strong></span>`;
    if (cfg.teacher_status) pills[1].innerHTML = `<i class="fa-solid fa-award"></i> <span>Sertifikasi: <strong>${cfg.teacher_status}</strong></span>`;
    if (cfg.city) pills[2].innerHTML = `<i class="fa-solid fa-location-dot"></i> <span>${cfg.city}</span>`;
  }

  // Floating Badges in Hero Photo
  const badgeTopRightEl = document.querySelector('.badge-top-right');
  if (badgeTopRightEl) {
    if (cfg.badge_award_hide === 'true' || cfg.badge_award === '') {
      badgeTopRightEl.style.display = 'none';
    } else {
      badgeTopRightEl.style.display = '';
      const title = badgeTopRightEl.querySelector('.badge-title');
      const sub = badgeTopRightEl.querySelector('.badge-subtitle');
      const icon = badgeTopRightEl.querySelector('.badge-icon i');
      const iconBox = badgeTopRightEl.querySelector('.badge-icon');
      if (title && cfg.badge_award) title.textContent = cfg.badge_award;
      if (sub && cfg.badge_award_sub) sub.textContent = cfg.badge_award_sub;
      if (icon && cfg.badge_award_icon) icon.className = cfg.badge_award_icon;
      if (iconBox && cfg.badge_award_color) {
        iconBox.className = `badge-icon ${cfg.badge_award_color}`;
      }
    }
  }

  const badgeBottomLeftEl = document.querySelector('.badge-bottom-left');
  if (badgeBottomLeftEl) {
    if (cfg.badge_snbt_hide === 'true' || cfg.badge_snbt === '') {
      badgeBottomLeftEl.style.display = 'none';
    } else {
      badgeBottomLeftEl.style.display = '';
      const title = badgeBottomLeftEl.querySelector('.badge-title');
      const sub = badgeBottomLeftEl.querySelector('.badge-subtitle');
      const icon = badgeBottomLeftEl.querySelector('.badge-icon i');
      const iconBox = badgeBottomLeftEl.querySelector('.badge-icon');
      if (title && cfg.badge_snbt) title.textContent = cfg.badge_snbt;
      if (sub && cfg.badge_snbt_sub) sub.textContent = cfg.badge_snbt_sub;
      if (icon && cfg.badge_snbt_icon) icon.className = cfg.badge_snbt_icon;
      if (iconBox && cfg.badge_snbt_color) {
        iconBox.className = `badge-icon ${cfg.badge_snbt_color}`;
      }
    }
  }

  const badgeBottomRightEl = document.querySelector('.badge-bottom-right');
  if (badgeBottomRightEl) {
    if (cfg.badge_module_hide === 'true' || cfg.badge_module === '') {
      badgeBottomRightEl.style.display = 'none';
    } else {
      badgeBottomRightEl.style.display = '';
      const title = badgeBottomRightEl.querySelector('.badge-title');
      const sub = badgeBottomRightEl.querySelector('.badge-subtitle');
      const icon = badgeBottomRightEl.querySelector('.badge-icon i');
      const iconBox = badgeBottomRightEl.querySelector('.badge-icon');
      if (title && cfg.badge_module) title.textContent = cfg.badge_module;
      if (sub && cfg.badge_module_sub) sub.textContent = cfg.badge_module_sub;
      if (icon && cfg.badge_module_icon) icon.className = cfg.badge_module_icon;
      if (iconBox && cfg.badge_module_color) {
        iconBox.className = `badge-icon ${cfg.badge_module_color}`;
      }
    }
  }

  // Stats Counters
  const statNumbers = document.querySelectorAll('.stats-strip .stat-number');
  if (statNumbers.length >= 4) {
    if (cfg.stat_years) statNumbers[0].textContent = cfg.stat_years;
    if (cfg.stat_students) statNumbers[1].textContent = cfg.stat_students;
    if (cfg.stat_modules) statNumbers[2].textContent = cfg.stat_modules;
    if (cfg.stat_certs) statNumbers[3].textContent = cfg.stat_certs;
  }

  // Pendampingan Section Subtitle, Title, Desc & Quotes
  const pendampinganSub = document.querySelector('#pendampingan .section-subtitle');
  if (pendampinganSub && cfg.pendampingan_subtitle) {
    pendampinganSub.innerHTML = `<i class="fa-solid fa-people-arrows"></i> ${escapeHtml(cfg.pendampingan_subtitle)}`;
  }

  const pendampinganTitle = document.querySelector('#pendampingan .section-title');
  if (pendampinganTitle && cfg.pendampingan_title) {
    pendampinganTitle.textContent = cfg.pendampingan_title;
  }

  const pendampinganDesc = document.querySelector('#pendampingan .section-desc');
  if (pendampinganDesc) {
    if (cfg.pendampingan_desc) {
      pendampinganDesc.textContent = cfg.pendampingan_desc;
    } else if (cfg.philosophy_quote) {
      pendampinganDesc.innerHTML = `Mewujudkan filosofi Ki Hajar Dewantara: <em>"${escapeHtml(cfg.philosophy_quote)}"</em> melalui pendampingan akademik personal, pembinaan bakat talenta murid, dan kepemimpinan pembelajaran Guru Penggerak.`;
    }
  }

  const bioTexts = document.querySelectorAll('.bio-card .bio-text');
  if (bioTexts.length >= 2) {
    if (cfg.bio_text1) bioTexts[0].textContent = cfg.bio_text1;
    if (cfg.bio_text2) bioTexts[1].textContent = cfg.bio_text2;
  }

  // 3 Pilar Utama di Section Pendampingan
  const pillarItems = document.querySelectorAll('#pendampingan .pillars-list .pillar-item');
  if (pillarItems.length >= 3) {
    // Pilar 1
    if (cfg.pillar1_title) {
      const h4 = pillarItems[0].querySelector('h4');
      if (h4) h4.textContent = cfg.pillar1_title;
    }
    if (cfg.pillar1_desc) {
      const p = pillarItems[0].querySelector('p');
      if (p) p.textContent = cfg.pillar1_desc;
    }
    if (cfg.pillar1_icon) {
      const icon = pillarItems[0].querySelector('.pillar-icon i');
      if (icon) icon.className = cfg.pillar1_icon;
    }

    // Pilar 2
    if (cfg.pillar2_title) {
      const h4 = pillarItems[1].querySelector('h4');
      if (h4) h4.textContent = cfg.pillar2_title;
    }
    if (cfg.pillar2_desc) {
      const p = pillarItems[1].querySelector('p');
      if (p) p.textContent = cfg.pillar2_desc;
    }
    if (cfg.pillar2_icon) {
      const icon = pillarItems[1].querySelector('.pillar-icon i');
      if (icon) icon.className = cfg.pillar2_icon;
    }

    // Pilar 3
    if (cfg.pillar3_title) {
      const h4 = pillarItems[2].querySelector('h4');
      if (h4) h4.textContent = cfg.pillar3_title;
    }
    if (cfg.pillar3_desc) {
      const p = pillarItems[2].querySelector('p');
      if (p) p.textContent = cfg.pillar3_desc;
    }
    if (cfg.pillar3_icon) {
      const icon = pillarItems[2].querySelector('.pillar-icon i');
      if (icon) icon.className = cfg.pillar3_icon;
    }
  }

  // Biodata Table
  const tableRows = document.querySelectorAll('.biodata-table tbody tr');
  tableRows.forEach(row => {
    const thText = row.querySelector('th')?.textContent.trim() || '';
    const td = row.querySelector('td');
    if (!td) return;

    if (thText.includes('Nama Lengkap') && cfg.teacher_name) {
      td.innerHTML = `<strong>${cfg.teacher_name}${cfg.teacher_degrees ? ', ' + cfg.teacher_degrees : ''}</strong>`;
    } else if (thText.includes('NIP') && cfg.nip) {
      td.textContent = cfg.nip;
    } else if (thText.includes('NUPTK') && cfg.nuptk) {
      td.textContent = cfg.nuptk;
    } else if (thText.includes('Unit Kerja') && cfg.school_name) {
      td.textContent = cfg.school_name;
    } else if (thText.includes('Mata Pelajaran') && cfg.subjects_taught) {
      td.textContent = cfg.subjects_taught;
    } else if (thText.includes('Peran Tambahan') && cfg.additional_role) {
      td.textContent = cfg.additional_role;
    } else if (thText.includes('Status Pendidik') && cfg.teacher_status) {
      td.innerHTML = `<span class="badge-success"><i class="fa-solid fa-circle-check"></i> ${cfg.teacher_status}</span>`;
    } else if (thText.includes('Pendidikan') && cfg.last_education) {
      td.innerHTML = cfg.last_education.replace(/\n/g, '<br>');
    } else if (thText.includes('Email Resmi') && cfg.official_email) {
      td.innerHTML = `<a href="mailto:${cfg.official_email}">${cfg.official_email}</a>`;
    }
  });

  // Contact Info Section
  const waVal = document.querySelector('.info-item a.text-emerald');
  const waLinks = document.querySelectorAll('a[href*="wa.me"]');
  const cleanWA = (cfg.whatsapp_number || '6281234567890').replace(/[^0-9]/g, '');

  if (waVal && cfg.whatsapp_number) {
    waVal.textContent = '+' + cleanWA.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '$1 $2-$3-$4');
  }

  waLinks.forEach(link => {
    const originalHref = link.getAttribute('href');
    if (originalHref && originalHref.includes('wa.me/')) {
      link.href = `https://wa.me/${cleanWA}?text=${encodeURIComponent('Halo ' + (cfg.teacher_name || 'Bpk. Guru') + ', saya ingin berkonsultasi mengenai pembelajaran.')}`;
    }
  });

  // Footer text
  const footerQuote = document.querySelector('.footer-quote em');
  if (footerQuote && cfg.philosophy_quote) footerQuote.textContent = `"${cfg.philosophy_quote}"`;
}

function renderDynamicModul(modulList) {
  const container = document.getElementById('resources-grid');
  if (!container || !modulList || !modulList.length) return;

  container.innerHTML = modulList.map(m => {
    let badgeBg = 'bg-primary';
    let iconClass = 'fa-solid fa-square-root-variable';
    let fileFormat = 'PDF';

    if (m.category === 'lkpd') {
      badgeBg = 'bg-emerald';
      iconClass = 'fa-solid fa-compass-drafting';
    } else if (m.category === 'slide') {
      badgeBg = 'bg-purple';
      iconClass = 'fa-regular fa-file-powerpoint';
      fileFormat = 'PPTX / Canva';
    } else if (m.category === 'bank-soal') {
      badgeBg = 'bg-amber';
      iconClass = 'fa-solid fa-brain';
    }

    return `
      <article class="resource-card" data-category="${escapeHtml(m.category)}" data-keywords="${escapeHtml(m.keywords || m.title)}">
        <div class="resource-badge ${badgeBg}">${escapeHtml(m.badge || m.fase || 'Modul Ajar')}</div>
        <div class="resource-icon"><i class="${iconClass}"></i></div>
        <h3 class="resource-title">${escapeHtml(m.title)}</h3>
        <p class="resource-snippet">${escapeHtml(m.snippet)}</p>
        <div class="resource-meta">
          <span><i class="fa-regular fa-file-pdf text-danger"></i> ${fileFormat}</span>
          <span><i class="fa-solid fa-layer-group"></i> ${escapeHtml(m.fase)}</span>
        </div>
        <div class="resource-actions">
          <button class="btn btn-sm btn-outline btn-preview" data-id="${escapeHtml(m.id)}">
            <i class="fa-regular fa-eye"></i> Detail & CP
          </button>
          <a href="${escapeHtml(m.downloadLink || '#')}" class="btn btn-sm btn-primary btn-download" onclick="if (window.openPdfDocument && ('${escapeHtml(m.downloadLink || '')}'.startsWith('data:') || '${escapeHtml(m.downloadLink || '')}'.startsWith('indexeddb:'))) { event.preventDefault(); window.openPdfDocument('${escapeHtml(m.downloadLink || '')}', '${escapeHtml(m.fileNotice || 'Modul.pdf')}'); } else { alert('Mengunduh: ${escapeHtml(m.fileNotice || m.title)}'); return ${m.downloadLink && m.downloadLink !== '#' ? 'true' : 'false'}; }">
            <i class="fa-solid fa-download"></i> Unduh
          </a>
        </div>
      </article>
    `;
  }).join('');
}

let isPrestasiExpanded = false;

function renderDynamicPrestasi(prestasiList) {
  const container = document.querySelector('.awards-grid');
  if (!container || !prestasiList || !prestasiList.length) return;

  const LIMIT = 6;
  const total = prestasiList.length;
  const hasMore = total > LIMIT;

  container.innerHTML = prestasiList.map((p, index) => {
    const isExtra = index >= LIMIT;
    const isImg = (p.pdfFileName && /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(p.pdfFileName)) || 
                  (p.pdfUrl && (p.pdfUrl.startsWith('data:image/') || /\.(jpe?g|png|webp)(\?|$)/i.test(p.pdfUrl)));
    const btnClass = isImg ? 'award-pdf-btn is-image' : 'award-pdf-btn';
    const iconClass = isImg ? 'fa-solid fa-file-image' : 'fa-solid fa-file-pdf';
    const titleText = isImg ? 'Lihat Berkas / Sertifikat (Gambar)' : 'Lihat Berkas / Sertifikat (PDF)';
    const defaultName = isImg ? 'Sertifikat.jpg' : 'Sertifikat.pdf';
    const defaultLabel = isImg ? 'Lihat Sertifikat (Gambar)' : 'Lihat Sertifikat (PDF)';
    const cardStyle = (isExtra && !isPrestasiExpanded) ? 'display: none;' : '';
    const extraClass = isExtra ? 'award-card-extra' : '';

    return `
    <div class="award-card ${p.highlight ? 'highlight-award' : ''} ${extraClass}" ${cardStyle ? `style="${cardStyle}"` : ''}>
      <div class="award-year-badge">${escapeHtml(p.year)}</div>
      <div class="award-icon"><i class="fa-solid ${escapeHtml(p.icon || 'fa-trophy')}"></i></div>
      <h3 class="award-name">${escapeHtml(p.title)}</h3>
      <p class="award-issuer">${escapeHtml(p.issuer)}</p>
      <p class="award-desc">${escapeHtml(p.desc)}</p>
      ${p.pdfUrl ? `
        <div class="award-pdf-wrap">
          <button type="button" class="${btnClass}" onclick="window.openPdfDocument('${escapeHtml(p.pdfUrl)}', '${escapeHtml(p.pdfFileName || defaultName)}')" title="${titleText}">
            <i class="${iconClass}"></i>
            <span class="award-pdf-text">${escapeHtml(p.pdfFileName ? (p.pdfFileName.length > 25 ? p.pdfFileName.substring(0, 22) + '...' : p.pdfFileName) : defaultLabel)}</span>
            <i class="fa-solid fa-arrow-up-right-from-square award-pdf-ext"></i>
          </button>
        </div>
      ` : ''}
    </div>
    `;
  }).join('');

  // Handle Kontainer Tombol Toggle (Minimize / Maximize)
  let toggleWrap = document.getElementById('awards-toggle-wrap');
  if (!toggleWrap) {
    toggleWrap = document.createElement('div');
    toggleWrap.id = 'awards-toggle-wrap';
    toggleWrap.className = 'awards-toggle-wrap text-center';
    container.parentNode.insertBefore(toggleWrap, container.nextSibling);
  }

  if (hasMore) {
    toggleWrap.style.display = 'flex';
    renderAwardsToggleButton(toggleWrap, total, LIMIT);
  } else {
    toggleWrap.style.display = 'none';
    toggleWrap.innerHTML = '';
  }
}

function renderAwardsToggleButton(toggleWrap, total, limit) {
  const extraCount = total - limit;
  toggleWrap.innerHTML = `
    <button type="button" class="btn btn-toggle-awards ${isPrestasiExpanded ? 'is-expanded' : ''}" id="btn-toggle-awards" aria-expanded="${isPrestasiExpanded ? 'true' : 'false'}">
      <span class="btn-toggle-awards-icon"><i class="fa-solid ${isPrestasiExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}"></i></span>
      <span class="btn-toggle-awards-text">${isPrestasiExpanded ? 'Tampilkan Lebih Sedikit (Minimize)' : `Lihat Lebih Banyak (${extraCount} Prestasi Lainnya)`}</span>
    </button>
  `;

  const btn = toggleWrap.querySelector('#btn-toggle-awards');
  if (btn) {
    btn.onclick = () => {
      isPrestasiExpanded = !isPrestasiExpanded;
      const extraCards = document.querySelectorAll('.award-card-extra');

      if (isPrestasiExpanded) {
        extraCards.forEach(card => {
          card.style.display = 'flex';
        });
        btn.classList.add('is-expanded');
        btn.setAttribute('aria-expanded', 'true');
        const icon = btn.querySelector('.btn-toggle-awards-icon i');
        if (icon) icon.className = 'fa-solid fa-chevron-up';
        const text = btn.querySelector('.btn-toggle-awards-text');
        if (text) text.textContent = 'Tampilkan Lebih Sedikit (Minimize)';
      } else {
        extraCards.forEach(card => {
          card.style.display = 'none';
        });
        btn.classList.remove('is-expanded');
        btn.setAttribute('aria-expanded', 'false');
        const icon = btn.querySelector('.btn-toggle-awards-icon i');
        if (icon) icon.className = 'fa-solid fa-chevron-down';
        const text = btn.querySelector('.btn-toggle-awards-text');
        if (text) text.textContent = `Lihat Lebih Banyak (${extraCount} Prestasi Lainnya)`;

        const awardsSection = document.getElementById('prestasi');
        if (awardsSection) {
          const navHeight = 80;
          const targetY = awardsSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    };
  }
}

let isKaryaExpanded = false;

function renderDynamicKarya(karyaList) {
  const container = document.getElementById('karya-grid');
  if (!container) return;
  if (!karyaList || !karyaList.length) {
    karyaList = (window.DB && DB.getSection('karya')) || [];
  }
  if (!karyaList || !karyaList.length) return;

  const LIMIT = 6;
  const total = karyaList.length;
  const hasMore = total > LIMIT;

  container.innerHTML = karyaList.map((item, index) => {
    const isExtra = index >= LIMIT;
    const cardStyle = (isExtra && !isKaryaExpanded) ? 'display: none;' : '';
    const extraClass = isExtra ? 'project-card-extra' : '';

    return `
    <article class="project-card ${extraClass}" ${cardStyle ? `style="${cardStyle}"` : ''}>
      <div class="project-thumb-box">
        <img src="${escapeHtml(item.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80')}" alt="${escapeHtml(item.title || 'Website')}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';">
        <div class="project-thumb-badge"><i class="fa-solid fa-globe"></i> Website</div>
      </div>
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(item.title || 'Nama Website')}</h3>
        <p class="project-desc">${escapeHtml(item.desc || '')}</p>
        <div class="project-footer">
          <a href="${escapeHtml(item.link || '#')}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary project-visit-btn">
            <span>Kunjungi Website</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>
    </article>
    `;
  }).join('');

  // Handle Kontainer Tombol Toggle Karya (Minimize / Maximize)
  let toggleWrap = document.getElementById('karya-toggle-wrap');
  if (!toggleWrap) {
    toggleWrap = document.createElement('div');
    toggleWrap.id = 'karya-toggle-wrap';
    toggleWrap.className = 'karya-toggle-wrap text-center';
    container.parentNode.insertBefore(toggleWrap, container.nextSibling);
  }

  if (hasMore) {
    toggleWrap.style.display = 'flex';
    renderKaryaToggleButton(toggleWrap, total, LIMIT);
  } else {
    toggleWrap.style.display = 'none';
    toggleWrap.innerHTML = '';
  }
}

function renderKaryaToggleButton(toggleWrap, total, limit) {
  const extraCount = total - limit;
  toggleWrap.innerHTML = `
    <button type="button" class="btn btn-toggle-karya ${isKaryaExpanded ? 'is-expanded' : ''}" id="btn-toggle-karya" aria-expanded="${isKaryaExpanded ? 'true' : 'false'}">
      <span class="btn-toggle-icon"><i class="fa-solid ${isKaryaExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}"></i></span>
      <span class="btn-toggle-text">${isKaryaExpanded ? 'Tampilkan Lebih Sedikit (Minimize)' : `Lihat Lebih Banyak (${extraCount} Karya Lainnya)`}</span>
    </button>
  `;

  const btn = toggleWrap.querySelector('#btn-toggle-karya');
  if (btn) {
    btn.onclick = () => {
      isKaryaExpanded = !isKaryaExpanded;
      const extraCards = document.querySelectorAll('.project-card-extra');

      if (isKaryaExpanded) {
        extraCards.forEach(card => {
          card.style.display = 'flex';
        });
        btn.classList.add('is-expanded');
        btn.setAttribute('aria-expanded', 'true');
        const icon = btn.querySelector('.btn-toggle-icon i');
        if (icon) icon.className = 'fa-solid fa-chevron-up';
        const text = btn.querySelector('.btn-toggle-text');
        if (text) text.textContent = 'Tampilkan Lebih Sedikit (Minimize)';
      } else {
        extraCards.forEach(card => {
          card.style.display = 'none';
        });
        btn.classList.remove('is-expanded');
        btn.setAttribute('aria-expanded', 'false');
        const icon = btn.querySelector('.btn-toggle-icon i');
        if (icon) icon.className = 'fa-solid fa-chevron-down';
        const text = btn.querySelector('.btn-toggle-text');
        if (text) text.textContent = `Lihat Lebih Banyak (${extraCount} Karya Lainnya)`;

        const karyaSection = document.getElementById('karya');
        if (karyaSection) {
          const navHeight = 80;
          const targetY = karyaSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    };
  }
}

let isGaleriExpanded = false;
let currentGaleriFilter = 'all';

function renderDynamicGaleri(galeriList) {
  const container = document.getElementById('gallery-grid');
  if (!container || !galeriList || !galeriList.length) return;

  const defaultGaleri = (window.DB && window.DB.DEFAULT_DATA && window.DB.DEFAULT_DATA.galeri) || [];

  container.innerHTML = galeriList.map(g => {
    const gId = String(g.id || g.ID || '');
    const gTitle = (g.title || g.Judul || '').trim().toLowerCase();
    let img = g.imgUrl || g.ImgUrl || '';

    const def = defaultGaleri.find(d => 
      (d.id && String(d.id) === gId) || 
      (d.title && gTitle && d.title.trim().toLowerCase() === gTitle)
    );

    if (!img || img === 'assets/galeri-default.jpg' || img.includes('photo-1580582932707-520aed937b7b')) {
      if (def && def.imgUrl) {
        img = def.imgUrl;
      } else {
        img = 'assets/galeri-default.jpg';
      }
    } else if (def && def.imgUrl && def.imgUrl.startsWith('assets/galeri/') && img.startsWith('data:')) {
      img = def.imgUrl;
    }

    return `
    <div class="gallery-item" data-category="${escapeHtml((g.category || 'kelas').toLowerCase())}">
      <div class="gallery-thumb">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(g.title || '')}" loading="lazy" onerror="this.onerror=null; this.src='assets/galeri-default.jpg';">
        <div class="gallery-overlay">
          <div class="gallery-caption">
            <span class="gallery-tag">${escapeHtml(g.categoryLabel || g.category || 'Galeri')}</span>
            <h4>${escapeHtml(g.title || '')}</h4>
            <p>${escapeHtml(g.desc || '')}</p>
          </div>
          <button class="btn-zoom" aria-label="Perbesar Foto"><i class="fa-solid fa-maximize"></i></button>
        </div>
      </div>
    </div>
  `;
  }).join('');

  // Update total badge di filter "Semua Foto"
  const allFilterBtn = document.querySelector('#gallery-filters .gallery-filter-btn[data-filter="all"]');
  if (allFilterBtn) {
    allFilterBtn.textContent = `Semua Foto (${galeriList.length})`;
  }

  // Terapkan filter & batasan 6 foto (Minimize / Maximize)
  applyGalleryFilterAndLimit();
}

function applyGalleryFilterAndLimit() {
  const container = document.getElementById('gallery-grid');
  if (!container) return;

  const galleryItems = Array.from(container.querySelectorAll('.gallery-item'));
  if (!galleryItems.length) return;

  const LIMIT = 6;

  // 1. Dapatkan item yang cocok dengan filter kategori aktif
  const matchingItems = galleryItems.filter(item => {
    const cat = item.getAttribute('data-category');
    return currentGaleriFilter === 'all' || cat === currentGaleriFilter;
  });

  const total = matchingItems.length;
  const hasMore = total > LIMIT;

  // 2. Sembunyikan item yang tidak sesuai kategori
  galleryItems.forEach(item => {
    const cat = item.getAttribute('data-category');
    const isMatch = (currentGaleriFilter === 'all' || cat === currentGaleriFilter);
    if (!isMatch) {
      item.style.display = 'none';
      item.classList.remove('gallery-item-extra');
    }
  });

  // 3. Terapkan batasan 6 foto pada item yang cocok
  matchingItems.forEach((item, index) => {
    const isExtra = index >= LIMIT;
    if (isExtra) {
      item.classList.add('gallery-item-extra');
      if (isGaleriExpanded) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    } else {
      item.classList.remove('gallery-item-extra');
      item.style.display = 'block';
    }
  });

  // 4. Handle tombol toggle Galeri
  let toggleWrap = document.getElementById('gallery-toggle-wrap');
  if (!toggleWrap) {
    toggleWrap = document.createElement('div');
    toggleWrap.id = 'gallery-toggle-wrap';
    toggleWrap.className = 'gallery-toggle-wrap text-center';
    container.parentNode.insertBefore(toggleWrap, container.nextSibling);
  }

  if (hasMore) {
    toggleWrap.style.display = 'flex';
    renderGalleryToggleButton(toggleWrap, total, LIMIT);
  } else {
    toggleWrap.style.display = 'none';
    toggleWrap.innerHTML = '';
  }
}

function renderGalleryToggleButton(toggleWrap, total, limit) {
  const extraCount = total - limit;
  toggleWrap.innerHTML = `
    <button type="button" class="btn btn-toggle-gallery ${isGaleriExpanded ? 'is-expanded' : ''}" id="btn-toggle-gallery" aria-expanded="${isGaleriExpanded ? 'true' : 'false'}">
      <span class="btn-toggle-icon"><i class="fa-solid ${isGaleriExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}"></i></span>
      <span class="btn-toggle-text">${isGaleriExpanded ? 'Tampilkan Lebih Sedikit (Minimize)' : `Lihat Lebih Banyak (${extraCount} Foto Lainnya)`}</span>
    </button>
  `;

  const btn = toggleWrap.querySelector('#btn-toggle-gallery');
  if (btn) {
    btn.onclick = () => {
      isGaleriExpanded = !isGaleriExpanded;
      applyGalleryFilterAndLimit();

      if (!isGaleriExpanded) {
        const gallerySection = document.getElementById('galeri');
        if (gallerySection) {
          const navHeight = 80;
          const targetY = gallerySection.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    };
  }
}

function renderDynamicKompetensi(kompetensiList, edtechList) {
  const subContainer = document.querySelector('.subjects-grid');
  if (subContainer && kompetensiList && kompetensiList.length) {
    subContainer.innerHTML = kompetensiList.map(k => {
      const fitur = Array.isArray(k.fiturList) ? k.fiturList : (typeof k.fiturList === 'string' ? k.fiturList.split('|') : []);
      const fiturHtml = fitur.map(f => `<li><i class="fa-solid fa-check text-success"></i> ${escapeHtml(f)}</li>`).join('');

      return `
        <div class="subject-card">
          <div class="subject-icon-bg ${escapeHtml(k.colorClass || 'bg-blue-subtle text-blue')}">
            <i class="fa-solid ${escapeHtml(k.icon || 'fa-book')}"></i>
          </div>
          <span class="subject-level">${escapeHtml(k.tingkat)}</span>
          <h3 class="subject-title">${escapeHtml(k.judul)}</h3>
          <p class="subject-desc">${escapeHtml(k.desc)}</p>
          <ul class="subject-features">
            ${fiturHtml}
          </ul>
        </div>
      `;
    }).join('');
  }

  const toolContainer = document.querySelector('.tools-grid');
  if (toolContainer && edtechList && edtechList.length) {
    toolContainer.innerHTML = edtechList.map(e => `
      <div class="tool-pill"><i class="${escapeHtml(e.icon)} ${escapeHtml(e.colorClass)}"></i> ${escapeHtml(e.name)}</div>
    `).join('');
  }
}

function renderDynamicTimeline(timelineList) {
  const container = document.querySelector('.timeline-container');
  if (!container || !timelineList || !timelineList.length) return;

  container.innerHTML = timelineList.map(tl => `
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <span class="timeline-year">${escapeHtml(tl.year)}</span>
        <h4 class="timeline-heading">${escapeHtml(tl.judul)}</h4>
        <p class="timeline-institution">${escapeHtml(tl.institusi)}</p>
        <p class="timeline-desc">${escapeHtml(tl.desc)}</p>
      </div>
    </div>
  `).join('');
}

function renderDynamicNav(navMenus) {
  if (!navMenus || !navMenus.length) return;

  const activeMenus = navMenus
    .filter(m => m.is_active !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  if (!activeMenus.length) return;

  // 1. Desktop & Mobile Drawer Navbar
  const navList = document.querySelector('#nav-menu .nav-list');
  if (navList) {
    const currentActiveLink = navList.querySelector('.nav-link.active');
    const currentHref = currentActiveLink ? currentActiveLink.getAttribute('href') : '#beranda';

    navList.innerHTML = activeMenus.map((m, idx) => {
      const isActive = m.href === currentHref || (!currentActiveLink && idx === 0);
      return `
        <li>
          <a href="${escapeHtml(m.href)}" class="nav-link ${isActive ? 'active' : ''}">
            <i class="${escapeHtml(m.icon || 'fa-solid fa-link')}"></i> ${escapeHtml(m.label)}
          </a>
        </li>
      `;
    }).join('');
  }

  // 2. Footer Nav List
  const footerList = document.getElementById('footer-nav-list');
  if (footerList) {
    footerList.innerHTML = activeMenus.map(m => `
      <li>
        <a href="${escapeHtml(m.href)}">
          <i class="fa-solid fa-chevron-right"></i> ${escapeHtml(m.label)}
        </a>
      </li>
    `).join('');
  }
}

function renderDynamicPelatihan(pelatihanList) {
  const container = document.getElementById('training-grid');
  if (!container || !pelatihanList || !pelatihanList.length) return;

  const categoryColorMap = {
    'kepemimpinan': { iconBg: 'bg-purple-subtle text-purple', icon: 'fa-solid fa-user-graduate', badgeClass: 'badge-status badge-verified' },
    'sertifikasi': { iconBg: 'bg-blue-subtle text-blue', icon: 'fa-solid fa-id-card-clip', badgeClass: 'badge-status badge-gold' },
    'diklat': { iconBg: 'bg-emerald-subtle text-emerald', icon: 'fa-solid fa-chalkboard-user', badgeClass: 'badge-status badge-emerald' },
    'ai': { iconBg: 'bg-cyan-subtle text-cyan', icon: 'fa-solid fa-wand-magic-sparkles', badgeClass: 'badge-status badge-cyan' },
    'workshop': { iconBg: 'bg-amber-subtle text-amber', icon: 'fa-solid fa-users', badgeClass: 'badge-status badge-gold' }
  };

  container.innerHTML = pelatihanList.map(p => {
    const cat = (p.category || 'diklat').toLowerCase();
    const style = categoryColorMap[cat] || { iconBg: 'bg-blue-subtle text-blue', icon: 'fa-solid fa-certificate', badgeClass: 'badge-status badge-verified' };
    
    const skills = Array.isArray(p.skills) ? p.skills : (typeof p.skills === 'string' ? p.skills.split('|') : []);
    const skillsHtml = skills.map(s => `<span class="skill-pill">${escapeHtml(s.trim())}</span>`).join('');

    const hasCert = p.certificateUrl && p.certificateUrl !== '#';
    const certBtn = hasCert ? `
      <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-light);">
        <button type="button" class="btn btn-sm btn-outline-primary" style="font-size: 0.775rem; padding: 0.3rem 0.7rem; border-radius: 999px; cursor: pointer;" onclick="window.openPdfDocument ? window.openPdfDocument('${escapeHtml(p.certificateUrl)}', '${escapeHtml(p.certificateFile || p.title)}') : window.open('${escapeHtml(p.certificateUrl)}', '_blank')">
          <i class="fa-solid fa-file-pdf text-danger"></i> Unduh / Buka Sertifikat
        </button>
      </div>
    ` : '';

    return `
      <article class="training-card" data-category="${escapeHtml(cat)}">
        <div class="training-card-header">
          <div class="training-icon-box ${style.iconBg}">
            <i class="${style.icon}"></i>
          </div>
          <div class="training-badge-box">
            <span class="${style.badgeClass}"><i class="fa-solid fa-circle-check"></i> ${escapeHtml(p.badge || 'Kompetensi')}</span>
            <span class="training-year"><i class="fa-regular fa-calendar"></i> ${escapeHtml(p.period || '-')}</span>
          </div>
        </div>
        <div class="training-card-body">
          <div class="training-meta-tags">
            ${p.jp ? `<span class="training-tag"><i class="fa-solid fa-clock"></i> ${escapeHtml(p.jp)}</span>` : ''}
            ${p.organizer ? `<span class="training-tag"><i class="fa-solid fa-building-columns"></i> ${escapeHtml(p.organizer)}</span>` : ''}
          </div>
          <h3 class="training-title">${escapeHtml(p.title)}</h3>
          <p class="training-organizer">${escapeHtml(p.organizer || '')}</p>
          <p class="training-desc">
            ${escapeHtml(p.desc || '')}
          </p>
        </div>
        <div class="training-card-footer">
          <div class="training-skills">
            ${skillsHtml}
          </div>
          ${certBtn}
        </div>
      </article>
    `;
  }).join('');

  // Re-inisialisasi filter kategori pelatihan
  initTrainingFilters();
}

/* --------------------------------------------------
   1. DARK / LIGHT THEME TOGGLE
   -------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* --------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const overlay = document.getElementById('mobile-overlay');

  if (!toggleBtn || !navMenu || !overlay) return;

  function toggleMenu(open) {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', shouldOpen);
    toggleBtn.classList.toggle('active', shouldOpen);
    overlay.classList.toggle('active', shouldOpen);
    toggleBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', () => toggleMenu());
  overlay.addEventListener('click', () => toggleMenu(false));

  // Event delegation untuk link navigasi (menutup drawer saat link diklik)
  navMenu.addEventListener('click', (e) => {
    if (e.target.closest('.nav-link') && navMenu.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------
   2.1. NAVBAR SCROLL ELEVATION
   -------------------------------------------------- */
function initNavbarScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const onScroll = () => {
    if (window.pageYOffset > 15) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------
   3. SCROLL SPY (ACTIVE NAVIGATION HIGHLIGHT)
   -------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------
   4. RESOURCES SEARCH & FILTERING
   -------------------------------------------------- */
function initResourceFilterAndSearch() {
  const searchInput = document.getElementById('resource-search');
  const clearBtn = document.getElementById('resource-clear');
  const filterPills = document.querySelectorAll('#category-pills .pill-btn');
  const cards = document.querySelectorAll('.resource-card');
  const noResults = document.getElementById('no-resources');
  const resetBtn = document.getElementById('reset-filter-btn');

  if (!cards.length) return;

  let currentCategory = 'all';
  let currentKeyword = '';

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      const keywords = card.getAttribute('data-keywords') || '';
      const title = card.querySelector('.resource-title')?.textContent.toLowerCase() || '';
      const snippet = card.querySelector('.resource-snippet')?.textContent.toLowerCase() || '';
      
      const searchTarget = `${keywords} ${title} ${snippet}`.toLowerCase();
      const matchesCategory = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = (!currentKeyword || searchTarget.includes(currentKeyword));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    }
  }

  filterPills.forEach(pill => {
    pill.onclick = () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      currentCategory = pill.getAttribute('data-category');
      applyFilters();
    };
  });

  if (searchInput) {
    searchInput.oninput = (e) => {
      currentKeyword = e.target.value.trim().toLowerCase();
      if (clearBtn) clearBtn.style.display = currentKeyword.length > 0 ? 'block' : 'none';
      applyFilters();
    };

    if (clearBtn) {
      clearBtn.onclick = () => {
        searchInput.value = '';
        currentKeyword = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
        applyFilters();
      };
    }
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      if (searchInput) searchInput.value = '';
      currentKeyword = '';
      if (clearBtn) clearBtn.style.display = 'none';

      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      const allPill = document.querySelector('#category-pills [data-category="all"]');
      if (allPill) {
        allPill.classList.add('active');
        allPill.setAttribute('aria-selected', 'true');
      }
      currentCategory = 'all';
      applyFilters();
    };
  }
}

/* --------------------------------------------------
   5. RESOURCE DETAIL MODAL (DETAIL & CP)
   -------------------------------------------------- */
function initResourceModal() {
  const modal = document.getElementById('resource-modal');
  const modalCloseBtn = document.getElementById('btn-close-modal');
  const modalCloseAction = document.getElementById('btn-modal-close-action');
  const modalDownloadAction = document.getElementById('btn-modal-download-action');
  const modalCategoryBadge = document.getElementById('modal-category-badge');
  const modalTitle = document.getElementById('modal-resource-title');
  const modalBody = document.getElementById('modal-body-content');
  const previewBtns = document.querySelectorAll('.btn-preview');

  if (!modal) return;

  let activeFileName = "Materi_Edukasi.pdf";
  let activeDownloadLink = "#";

  function openModal(id) {
    let itemData = null;

    if (window.DB) {
      const modulList = DB.getSection('modul') || [];
      const found = modulList.find(m => String(m.id) === String(id));
      if (found) {
        itemData = {
          category: found.badge || found.fase || 'Modul Ajar',
          title: found.title,
          content: `
            <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);"><i class="fa-solid fa-bullseye text-primary"></i> Capaian Pembelajaran (CP):</h4>
            <p>${escapeHtml(found.cp || found.snippet)}</p>
            
            <h4 style="margin-top: 1rem; margin-bottom: 0.5rem; color: var(--text-primary);"><i class="fa-solid fa-list-check text-primary"></i> Alur Tujuan Pembelajaran (ATP):</h4>
            <p>${escapeHtml(found.atp || '-')}</p>

            <h4 style="margin-top: 1rem; margin-bottom: 0.5rem; color: var(--text-primary);"><i class="fa-solid fa-users text-primary"></i> Diferensiasi Pembelajaran:</h4>
            <p>${escapeHtml(found.diferensiasi || '-')}</p>

            <div style="background-color: var(--bg-secondary); border-left: 4px solid var(--brand-primary); padding: 0.85rem; border-radius: 4px; margin-top: 1rem;">
              <small><strong>Kelengkapan Berkas:</strong> Berkas resmi disusun sesuai panduan Kurikulum Merdeka Kemendikbudristek RI.</small>
            </div>
          `,
          fileNotice: found.fileNotice || 'Modul_Ajar.pdf',
          downloadLink: found.downloadLink || '#'
        };
      }
    }

    if (!itemData) return;

    modalCategoryBadge.textContent = itemData.category;
    modalTitle.textContent = itemData.title;
    modalBody.innerHTML = itemData.content;
    activeFileName = itemData.fileNotice;
    activeDownloadLink = itemData.downloadLink;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  previewBtns.forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      openModal(id);
    };
  });

  if (modalCloseBtn) modalCloseBtn.onclick = closeModal;
  if (modalCloseAction) modalCloseAction.onclick = closeModal;

  if (modalDownloadAction) {
    modalDownloadAction.onclick = () => {
      alert(`Memulai pengunduhan berkas resmi:\n"${activeFileName}"\n\nTerima kasih telah memanfaatkan sumber belajar terbuka ini!`);
      if (activeDownloadLink && activeDownloadLink !== '#') {
        if (window.openPdfDocument) {
          window.openPdfDocument(activeDownloadLink, activeFileName);
        } else {
          window.open(activeDownloadLink, '_blank');
        }
      }
      closeModal();
    };
  }

  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  document.onkeydown = (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  };
}


/* --------------------------------------------------
   7. GALERI FOTO & LIGHTBOX
   -------------------------------------------------- */
function initGalleryFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('#gallery-filters .gallery-filter-btn');
  const galleryItems = document.querySelectorAll('#gallery-grid .gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!galleryItems.length) return;

  // Inisialisasi batasan tampilan awal (6 foto)
  applyGalleryFilterAndLimit();

  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';
      currentGaleriFilter = filter;
      applyGalleryFilterAndLimit();
    };
  });

  // Event delegation untuk klik galeri / zoom lightbox (mendukung item dinamis)
  const galleryGrid = document.getElementById('gallery-grid');
  if (galleryGrid) {
    galleryGrid.addEventListener('click', (e) => {
      const thumb = e.target.closest('.gallery-thumb');
      if (!thumb) return;

      const img = thumb.querySelector('img');
      const title = thumb.querySelector('h4')?.textContent || '';
      const desc = thumb.querySelector('p')?.textContent || '';

      if (lightbox && lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title;
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<strong>${title}</strong><br><span style="font-size: 0.85rem; color: #cbd5e1;">${desc}</span>`;
        }
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.onclick = closeLightbox;
  if (lightbox) {
    lightbox.onclick = (e) => {
      if (e.target === lightbox) closeLightbox();
    };
  }
}

/* --------------------------------------------------
   8. FORMULIR KONTAK DENGAN DATABASE & WHATSAPP
   -------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-teacher-form');
  const alertBox = document.getElementById('form-alert');
  const btnWhatsApp = document.getElementById('btn-send-whatsapp');

  if (!form) return;

  function generateWhatsAppText() {
    const name = document.getElementById('form-name')?.value.trim() || 'Siswa/Wali';
    const role = document.getElementById('form-role')?.value || 'Umum';
    const email = document.getElementById('form-email')?.value.trim() || '-';
    const whatsapp = document.getElementById('form-whatsapp')?.value.trim() || '-';
    const subject = document.getElementById('form-subject')?.value || 'Konsultasi Belajar';
    const message = document.getElementById('form-message')?.value.trim() || '-';

    const teacherName = (window.DB && DB.getSection('config')?.teacher_name) || 'Muhammad Chusni Agus, M. Pd., Gr.';

    const text = 
      `*Halo Bpk. ${teacherName}*\n` +
      `Saya ingin berkonsultasi melalui portal website profil guru:\n\n` +
      `👤 *Nama:* ${name}\n` +
      `🏷️ *Status:* ${role}\n` +
      `📧 *Email:* ${email}\n` +
      `📱 *No. Kontak:* ${whatsapp}\n` +
      `📌 *Topik:* ${subject}\n\n` +
      `💬 *Isi Pesan:*\n"${message}"\n\n` +
      `_Pesan dikirim dari Formulir Website Profil Pendidik_`;

    return encodeURIComponent(text);
  }

  // Handle Form Submit (Menyimpan ke Database & Spreadsheet)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name')?.value.trim();
    const role = document.getElementById('form-role')?.value;
    const email = document.getElementById('form-email')?.value.trim();
    const whatsapp = document.getElementById('form-whatsapp')?.value.trim();
    const subject = document.getElementById('form-subject')?.value;
    const message = document.getElementById('form-message')?.value.trim();

    // Simpan ke database DB (localStorage + Google Apps Script jika terhubung)
    if (window.DB) {
      await DB.submitVisitorMessage({ name, role, email, whatsapp, subject, message });
    }

    // Tampilkan pesan berhasil
    if (alertBox) {
      alertBox.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
          <i class="fa-solid fa-circle-check" style="font-size: 1.5rem; color: #10b981; margin-top: 0.15rem;"></i>
          <div>
            <h4 style="margin-bottom: 0.25rem; color: var(--text-primary);">Pesan Berhasil Terkirim ke Guru!</h4>
            <p style="margin: 0; font-size: 0.875rem; color: var(--text-secondary);">
              Terima kasih, <strong>${escapeHtml(name)}</strong>. Pesan Anda telah tersimpan di kotak masuk guru dan database spreadsheet. Anda juga dapat langsung meneruskan pesan ke WhatsApp melalui tombol di bawah.
            </p>
          </div>
        </div>
      `;
      alertBox.classList.remove('hidden');
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => {
        alertBox.classList.add('hidden');
      }, 9000);
    }

    form.reset();
  });

  // Tombol Teruskan ke WhatsApp
  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      const name = document.getElementById('form-name')?.value.trim();
      const message = document.getElementById('form-message')?.value.trim();

      if (!name || !message) {
        alert('Mohon lengkapi minimal Nama dan Isi Pesan terlebih dahulu sebelum meneruskan ke WhatsApp.');
        document.getElementById('form-name')?.focus();
        return;
      }

      const cfgWA = (window.DB && DB.getSection('config')?.whatsapp_number) || '6281234567890';
      const cleanWA = cfgWA.replace(/[^0-9]/g, '');
      const encodedMsg = generateWhatsAppText();
      const waUrl = `https://wa.me/${cleanWA}?text=${encodedMsg}`;

      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
}

/* --------------------------------------------------
   9. FAQ ACCORDION
   -------------------------------------------------- */
function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = trigger.nextElementSibling;

      triggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherTrigger.nextElementSibling) {
            otherTrigger.nextElementSibling.style.maxHeight = null;
          }
        }
      });

      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------
   10. BACK TO TOP BUTTON
   -------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 380) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------
   11. HELPER ESCAPE HTML
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

/* --------------------------------------------------
   12. PORTOFOLIO TABS NAVIGATION (SIDEBAR FILTER)
   -------------------------------------------------- */
function initPortfolioTabs() {
  const tabBtns = document.querySelectorAll('.portfolio-nav-item, .portfolio-tab-btn');
  const groups = document.querySelectorAll('.portfolio-group');

  if (!tabBtns.length || !groups.length) return;

  function switchTab(target, shouldScroll = false) {
    if (!target) target = 'prestasi';

    tabBtns.forEach(btn => {
      const isMatch = btn.getAttribute('data-tab') === target;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    groups.forEach(grp => {
      const grpType = grp.getAttribute('data-group');
      if (target === 'all' || target === grpType) {
        grp.classList.remove('is-hidden');
      } else {
        grp.classList.add('is-hidden');
      }
    });

    if (shouldScroll) {
      const section = document.getElementById('portofolio');
      if (section) {
        const top = section.offsetTop - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.getAttribute('data-tab');
      switchTab(tab, false);
      if (history.pushState) {
        history.pushState(null, null, `#${tab === 'all' ? 'portofolio' : tab}`);
      }
    });
  });

  // Handle hash deep-linking (e.g. #karya, #prestasi, #galeri)
  function checkHash() {
    const hash = window.location.hash.replace('#', '');
    if (['karya', 'prestasi', 'galeri'].includes(hash)) {
      switchTab(hash, false);
    } else if (hash === 'portofolio') {
      // Default to 'prestasi' so content is compact and does not stretch long downwards
      switchTab('prestasi', false);
    } else {
      const activeBtn = document.querySelector('.portfolio-nav-item.active, .portfolio-tab-btn.active');
      const currentTab = activeBtn ? activeBtn.getAttribute('data-tab') : 'prestasi';
      switchTab(currentTab, false);
    }
  }

  window.addEventListener('hashchange', checkHash);
  checkHash();
  updatePortfolioSidebarCounts();
}

function updatePortfolioSidebarCounts() {
  const countPrestasi = document.querySelectorAll('#prestasi .award-card').length;
  const countKarya = document.querySelectorAll('#karya .project-card').length;
  const countGaleri = document.querySelectorAll('#galeri .gallery-item').length;

  const elP = document.getElementById('sidebar-count-prestasi');
  const elK = document.getElementById('sidebar-count-karya');
  const elG = document.getElementById('sidebar-count-galeri');
  const elA = document.getElementById('sidebar-count-all');

  if (elP && countPrestasi) elP.textContent = countPrestasi;
  if (elK && countKarya) elK.textContent = countKarya;
  if (elG && countGaleri) elG.textContent = countGaleri;
  if (elA) elA.textContent = (countPrestasi || 8) + (countKarya || 2) + (countGaleri || 8);
}

/* --------------------------------------------------
   14. PENGEMBANGAN DIRI & PELATIHAN (CATEGORY FILTERS)
   -------------------------------------------------- */
function initTrainingFilters() {
  const filterBtns = document.querySelectorAll('.training-filter-btn');
  const cards = document.querySelectorAll('.training-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = btn.getAttribute('data-category');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}


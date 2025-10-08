(function () {
  const docEl = document.documentElement;
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  const themeToggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');

  function setYear() {
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem('color-theme');
    } catch (_) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem('color-theme', theme);
    } catch (_) {}
  }

  function applyTheme(theme) {
    docEl.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function initTheme() {
    const stored = getStoredTheme();
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored);
      return;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const isDark = docEl.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  }

  function initNav() {
    if (!navToggle || !navList) return;
    navToggle.addEventListener('click', function () {
      const isOpen = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navList.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initRevealOnScroll() {
    const items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('show'); });
      return;
    }
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { obs.observe(el); });
  }

  function initProjectFilters() {
    const filterBar = document.getElementById('project-filters');
    const cards = Array.prototype.slice.call(document.querySelectorAll('#projects .card'));
    if (!filterBar) return;
    function applyFilter(key) {
      cards.forEach(function (card) {
        const tags = (card.getAttribute('data-tags') || '').split(/\s+/);
        const show = key === 'all' || tags.indexOf(key) !== -1;
        card.style.display = show ? '' : 'none';
      });
    }
    filterBar.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      const key = btn.getAttribute('data-filter');
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      applyFilter(key);
    });
    const first = filterBar.querySelector('[data-filter="all"]');
    if (first) first.classList.add('active');
  }

  function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;
    function open(data) {
      content.innerHTML = data;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true');
    }
    function close() {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('aria-modal', 'false');
    }
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.details-btn');
      if (!btn) return;
      const id = btn.getAttribute('data-project');
      var html = '';
      if (id === 'vcs') {
        html = '<h3>Virtual Classroom System</h3><p>Multi-role classroom app with uploads, access control, and notifications.</p><ul><li>Auth & role-based dashboards</li><li>Upload & restrict by branch/year</li><li>Email notifications</li><li>Stack: HTML, CSS, JS, PHP, MySQL</li></ul>';
      } else if (id === 'grampower') {
        html = '<h3>Grampower</h3><p>Village electricity monitoring and complaints system.</p><ul><li>Real-time status</li><li>Complaint workflow</li><li>Deployed on InfinityFree</li><li>Stack: PHP, MySQL</li></ul>';
      } else if (id === 'leetcode') {
        html = '<h3>LeetCode Problem Solving</h3><p>200+ problems solved with focus on core DSA.</p><ul><li>Arrays, Linked Lists, Stacks, Queues</li><li>Top 25% contests</li><li>Primary language: Java</li></ul>';
      }
      open(html);
    });
    [backdrop, closeBtn].forEach(function (el) { if (el) el.addEventListener('click', function () { close(); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) btn.classList.add('show'); else btn.classList.remove('show');
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initScrollSpy() {
    const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a[href^="#"]'));
    const sections = navLinks.map(function (a) { const id = a.getAttribute('href').slice(1); return document.getElementById(id); });
    function onScroll() {
      const y = window.scrollY + 100;
      let active = null;
      sections.forEach(function (sec, i) {
        if (!sec) return;
        const top = sec.offsetTop; const bottom = top + sec.offsetHeight;
        if (y >= top && y < bottom) active = navLinks[i];
      });
      navLinks.forEach(function (a) { a.classList.remove('active'); });
      if (active) active.classList.add('active');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initThemeToggle() {
    if (!themeToggle) return;
    themeToggle.addEventListener('click', toggleTheme);
  }

  function initVCard() {
    const link = document.getElementById('vcard-link');
    if (!link) return;
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Reddy;Suram Sathwik;;;',
      'FN:Suram Sathwik Reddy',
      'TEL;TYPE=CELL:+919014941863',
      'EMAIL:suramsathwikreddy292@gmail.com',
      'URL:https://github.com/sathwikre',
      'END:VCARD'
    ].join('\n');
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'SuramSathwikReddy.vcf');
  }

  setYear();
  initTheme();
  initNav();
  initSmoothScroll();
  initThemeToggle();
  initRevealOnScroll();
  initProjectFilters();
  initProjectModal();
  initBackToTop();
  initScrollSpy();
  initVCard();
})();



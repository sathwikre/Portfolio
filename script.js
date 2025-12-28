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
    const header = document.querySelector('.site-header');
    function headerOffset() {
      return header ? header.getBoundingClientRect().height : 0;
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const targetId = href.slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
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
      } else if (id === 'grievance') {
        html = '<h3>Student Grievance Portal</h3><p>Online grievance management system for students to submit and track complaints easily.</p><ul><li>Complaint submission and tracking system</li><li>Admin panel for issue triage and resolution workflows</li><li>Role-based access control</li><li>Improved transparency and student–institution communication</li><li>Stack: HTML, CSS, JavaScript, PHP, MySQL</li></ul>';
      } else if (id === 'leetcode') {
        html = '<h3>LeetCode Problem Solving</h3><p>200+ problems solved with focus on core DSA.</p><ul><li>Arrays, Linked Lists, Stacks, Queues</li><li>Top 25% contests</li><li>Primary language: Java</li></ul>';
      }
      open(html);
    });
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.vcs-live-btn');
      if (!btn) return;
      e.preventDefault();
      const html = '<h3>Virtual Classroom System</h3><p style="margin-top: 1rem;">This project is not deployed for free due to large size.</p>';
      open(html);
    });
    [backdrop, closeBtn].forEach(function (el) { if (el) el.addEventListener('click', function () { close(); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function initBadgeModal() {
    const modal = document.getElementById('badge-modal');
    const backdrop = document.getElementById('badge-modal-backdrop');
    const closeBtn = document.getElementById('badge-modal-close');
    const image = document.getElementById('badge-modal-image');
    if (!modal || !image) return;
    function open(imgSrc, imgAlt) {
      image.src = imgSrc;
      image.alt = imgAlt || 'Badge';
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
      const badgeImg = e.target.closest('.badge-img');
      if (!badgeImg) return;
      e.preventDefault();
      const imgSrc = badgeImg.getAttribute('data-badge-image') || badgeImg.getAttribute('src');
      const imgAlt = badgeImg.getAttribute('alt') || 'Badge';
      open(imgSrc, imgAlt);
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

  // Staggered reveal helper: elements with class `stagger-child` will reveal children in sequence
  function initStaggeredReveal() {
    if (!('IntersectionObserver' in window)) return;
    const parents = Array.prototype.slice.call(document.querySelectorAll('.stagger-child'));
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const parent = entry.target;
        const step = parseInt(parent.getAttribute('data-delay-step') || '80', 10);
        Array.prototype.slice.call(parent.children).forEach(function (child, i) {
          child.style.setProperty('--stagger-index', String(i));
          child.style.setProperty('--stagger-step', step + 'ms');
          setTimeout(function () { child.classList.add('show'); }, i * step);
        });
        obs.unobserve(parent);
      });
    }, { threshold: 0.12 });
    parents.forEach(function (p) { obs.observe(p); });
  }

  // Simple typewriter effect for elements with `data-typer` attribute
  function initTypewriter() {
    const typers = Array.prototype.slice.call(document.querySelectorAll('[data-typer]'));
    typers.forEach(function (el) {
      const text = el.textContent.trim();
      el.textContent = '';
      el.classList.add('typewriter');
      const cursor = document.createElement('span'); cursor.className = 'typer-cursor';
      el.parentNode && el.parentNode.insertBefore(cursor, el.nextSibling);
      let i = 0;
      const speed = parseInt(el.getAttribute('data-typer-speed') || '70', 10);
      function step() {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(step, speed);
        } else {
          setTimeout(function () { cursor.style.opacity = '0.6'; }, 600);
        }
      }
      if (!('IntersectionObserver' in window)) { step(); return; }
      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { step(); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.2 });
      obs.observe(el);
    });
  }

  function initButtonRipples() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height) * 0.6;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(function () { try { ripple.remove(); } catch (e) {} }, 650);
      });
    });
  }

  function initHeroParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = document.querySelector('.hero');
    const heroArt = document.querySelector('.hero-art');
    if (!hero || !heroArt) return;
    let lastX = 0, lastY = 0;
    hero.addEventListener('mousemove', function (e) {
      const r = hero.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const cy = (e.clientY - r.top) / r.height - 0.5;
      const tx = cx * 6; // horizontal movement px
      const ty = cy * 6; // vertical movement px
      // use translate3d on container so internal animations (floatY) continue
      heroArt.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
      lastX = tx; lastY = ty;
    });
    // subtle scroll parallax
    window.addEventListener('scroll', function () {
      const offset = Math.min(window.scrollY * 0.02, 20);
      heroArt.style.transform = 'translate3d(' + lastX + 'px,' + (lastY - offset) + 'px,0)';
    }, { passive: true });
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

  // small page-load class to enable a global fade-in
  window.addEventListener('load', function () {
    if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('is-loaded');
    } else {
      // reduced motion: still show content immediately
      document.body.classList.add('is-loaded');
    }
    // set CSS header height var to the real header height (handles responsive changes)
    try {
      var hdr = document.querySelector('.site-header');
      if (hdr) {
        document.documentElement.style.setProperty('--header-height', hdr.getBoundingClientRect().height + 'px');
      }
    } catch (e) {}
  });

  // update header height on resize (debounced)
  (function () {
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () {
      try {
        var hdr = document.querySelector('.site-header');
        if (hdr) document.documentElement.style.setProperty('--header-height', hdr.getBoundingClientRect().height + 'px');
      } catch (e) {}
    }, 120); }, { passive: true });
  })();

  // Initialize enhanced motion features
  initButtonRipples();
  initHeroParallax();

  setYear();
  initTheme();
  initNav();
  initSmoothScroll();
  initThemeToggle();
  initRevealOnScroll();
  initStaggeredReveal();
  initTypewriter();
  initProjectFilters();
  initProjectModal();
  initBadgeModal();
  initBackToTop();
  initScrollSpy();
  initVCard();
  // motion helpers called after initializers
})();



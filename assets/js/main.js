(() => {
  'use strict';

  const STORAGE_KEY = 'site-lang';
  const html = document.documentElement;
  const supportedLangs = ['en', 'ja', 'zh'];

  /* ---------- Language toggle ---------- */
  const initialLang = (() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && supportedLangs.includes(stored)) return stored;
    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if (browser === 'ja') return 'ja';
    if (browser === 'zh') return 'zh';
    return 'en';
  })();

  const setLang = (lang) => {
    if (!supportedLangs.includes(lang)) return;
    html.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    document.querySelectorAll('.lang-toggle__opt').forEach((opt) => {
      opt.classList.toggle('is-active', opt.dataset.lang === lang);
    });
  };

  setLang(initialLang);

  const toggle = document.getElementById('lang-toggle');
  if (toggle) {
    toggle.addEventListener('click', (e) => {
      const target = e.target.closest('.lang-toggle__opt');
      if (target && target.dataset.lang) {
        setLang(target.dataset.lang);
      } else {
        setLang(html.lang === 'en' ? 'ja' : 'en');
      }
    });
  }

  /* ---------- Nav: scrolled state + active section link ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 4);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav__links a'));
  const linkBySection = new Map();
  navLinks.forEach((a) => {
    const id = a.getAttribute('href').replace('#', '');
    linkBySection.set(id, a);
  });

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove('is-active'));
            const link = linkBySection.get(entry.target.id);
            if (link) link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

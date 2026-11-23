(() => {
  'use strict';
  const TOTAL = 75;
  const gallery = document.getElementById('gallery');
  const filters = document.getElementById('filters');
  const viewer = document.getElementById('viewer');
  const viewerImg = document.getElementById('viewerImg');
  const viewerTitle = document.getElementById('viewerTitle');
  const viewerCount = document.getElementById('viewerCount');
  const viewerIndex = document.getElementById('viewerIndex');
  const progress = document.getElementById('progress');
  let works = [];
  let current = 0;
  let filter = 'all';
  const pad = n => String(n).padStart(2, '0');
  const titleFor = n => {
    const titles = ['Little Study','A Quiet Moment','Lines & Light','Dream Fragment','Flowers','Portrait Study','Untitled','Memory Sketch','Color Study','Small World'];
    return titles[(n - 1) % titles.length];
  };
  const categoryFor = n => {
    if ([6,11,13,24,26,29,33,34,35,37,43,55,57].includes(n)) return 'color';
    if (n >= 27 || [18,24,26].includes(n)) return 'portrait';
    return 'pencil';
  };
  const createCard = (n) => {
    const category = categoryFor(n);
    const card = document.createElement('article');
    card.className = 'art-card';
    card.dataset.category = category;
    card.dataset.index = n - 1;
    card.style.animationDelay = `${Math.min((n % 12) * 35, 350)}ms`;
    const frame = document.createElement('div'); frame.className = 'art-image';
    const img = document.createElement('img'); img.loading = 'lazy'; img.decoding = 'async'; img.src = `assets/art-${pad(n)}.jpg`; img.alt = `Artwork ${pad(n)}`;
    img.onerror = () => { card.remove(); };
    frame.appendChild(img);
    const meta = document.createElement('div'); meta.className = 'art-meta';
    meta.innerHTML = `<span class="art-number">NO. ${pad(n)}</span><span>${category.toUpperCase()}</span>`;
    const title = document.createElement('h3'); title.className = 'art-title'; title.textContent = titleFor(n);
    const type = document.createElement('div'); type.className = 'art-type'; type.textContent = 'FROM HER SKETCHBOOK';
    card.append(frame, meta, title, type);
    card.addEventListener('click', () => openViewer(n - 1));
    return card;
  };
  for (let n = 1; n <= TOTAL; n++) {
    works.push({ src: `assets/art-${pad(n)}.jpg`, title: titleFor(n), category: categoryFor(n) });
    gallery.appendChild(createCard(n));
  }
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    filter = button.dataset.filter;
    filters.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === button));
    gallery.querySelectorAll('.art-card').forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
  });
  function openViewer(index) {
    current = index;
    updateViewer();
    viewer.classList.add('open'); viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeViewer() {
    viewer.classList.remove('open'); viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function updateViewer() {
    const item = works[current];
    viewerImg.src = item.src;
    viewerImg.alt = `Artwork ${pad(current + 1)}`;
    viewerTitle.textContent = item.title;
    viewerIndex.textContent = pad(current + 1);
    viewerCount.textContent = `${pad(current + 1)} / ${TOTAL}`;
  }
  document.getElementById('closeViewer').addEventListener('click', closeViewer);
  document.getElementById('prev').addEventListener('click', () => { current = (current - 1 + TOTAL) % TOTAL; updateViewer(); });
  document.getElementById('next').addEventListener('click', () => { current = (current + 1) % TOTAL; updateViewer(); });
  viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
  document.addEventListener('keydown', e => {
    if (!viewer.classList.contains('open')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowLeft') { current = (current - 1 + TOTAL) % TOTAL; updateViewer(); }
    if (e.key === 'ArrowRight') { current = (current + 1) % TOTAL; updateViewer(); }
  });
  document.getElementById('menuToggle').addEventListener('click', () => document.querySelector('.nav-links').classList.toggle('show'));
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('show')));
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  }, { passive: true });
})();

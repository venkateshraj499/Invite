// ===== Gate overlay: triggered by gate.js via custom event (single-page, no navigation) =====
(function gateAnimation(){
  const overlay = document.getElementById('gateOverlay');
  if (!overlay) return;

  const ease    = 'cubic-bezier(.77,0,.18,1)';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pre-hide hero elements so they animate in gracefully when panels open
  const photoWrap = document.querySelector('.hero__photo-wrap');
  const eyebrow   = document.querySelector('.hero__eyebrow');
  const word1     = document.querySelector('.hero__names .word:nth-child(1)');
  const amp       = document.querySelector('.hero__amp');
  const word2     = document.querySelector('.hero__names .word:nth-child(3)');
  const date      = document.querySelector('.hero__date');

  function hide(el){ if(el){ el.style.opacity='0'; el.style.transform='translateY(22px)'; el.style.animation='none'; } }
  if(photoWrap){ photoWrap.style.opacity='0'; photoWrap.style.transform='translateY(60px)'; }
  [eyebrow, word1, amp, word2, date].forEach(hide);

  const reveal = (el, delay, dy='22px') => {
    if(!el) return;
    el.animate(
      [{ opacity:0, transform:`translateY(${dy})` }, { opacity:1, transform:'translateY(0)' }],
      { duration:750, delay, easing:'cubic-bezier(.22,.61,.36,1)', fill:'forwards' }
    );
  };

  // Wait for gate.js to signal the silhouette has faded, then run panel animation
  document.addEventListener('gate-silhouette-done', function runPanels(){
    document.removeEventListener('gate-silhouette-done', runPanels);
    document.body.classList.add('gate-active');

    if (reduced){
      overlay.remove();
      document.body.classList.remove('gate-active');
      if(photoWrap){ photoWrap.style.cssText=''; }
      [eyebrow, word1, amp, word2, date].forEach(el => { if(el) el.style.cssText=''; });
      return;
    }

    const panelL = overlay.querySelector('.go__panel--l');
    const panelR = overlay.querySelector('.go__panel--r');
    const lockEl = overlay.querySelector('.go__lock');
    const shackle = overlay.querySelector('.go__shackle');

    // Phase 1: lock zooms in
    lockEl.animate(
      [{ transform:'translate(-50%,-50%) scale(1)' },
       { transform:'translate(-50%,-50%) scale(2.2)' }],
      { duration:550, easing:'cubic-bezier(.22,.61,.36,1)', fill:'forwards' }
    );
    // Phase 2: shackle lifts (lock opens)
    shackle.animate(
      [{ transform:'translateY(0)' }, { transform:'translateY(-7px)' }],
      { duration:360, delay:220, easing:'ease-out', fill:'forwards' }
    );
    // Phase 3: lock fades
    lockEl.animate(
      [{ opacity:1 }, { opacity:0 }],
      { duration:220, delay:500, fill:'forwards' }
    );
    // Phase 4: panels slide apart
    const slideOpts = { duration:800, delay:660, easing:ease, fill:'forwards' };
    panelL.animate([{ transform:'translateX(0)' },{ transform:'translateX(-101%)' }], slideOpts);
    const slideR = panelR.animate([{ transform:'translateX(0)' },{ transform:'translateX(101%)' }], slideOpts);

    // Phase 5: hero rises and text cascades in as panels open
    if(photoWrap){
      photoWrap.animate(
        [{ opacity:0, transform:'translateY(60px)' }, { opacity:1, transform:'translateY(0)' }],
        { duration:900, delay:700, easing:'cubic-bezier(.22,.61,.36,1)', fill:'forwards' }
      );
    }
    reveal(eyebrow, 750);
    reveal(word1, 880);
    reveal(amp, 1000);
    reveal(word2, 1080);
    reveal(date, 1200);

    slideR.onfinish = () => {
      overlay.remove();
      document.body.classList.remove('gate-active');
    };
  });
})();

// ===== Background music =====
(function bgm(){
  const audio = document.getElementById('bgm');
  const toggle = document.getElementById('audioToggle');
  if (!audio || !toggle) return;

  function sync(){
    const audible = !audio.paused && !audio.muted;
    toggle.classList.toggle('is-playing', audible);
    toggle.classList.toggle('is-muted', !audible);
    toggle.setAttribute('aria-pressed', String(audible));
    toggle.setAttribute('aria-label', audible ? 'Mute background music' : 'Play background music');
  }

  audio.volume = 0.55;

  // Music is started by gate.js inside the genuine click gesture (single-page,
  // no navigation needed) — just initialise the UI state here.
  sync();

  toggle.addEventListener('click', () => {
    if (audio.paused){
      audio.muted = false;
      audio.play().then(sync).catch(sync);
    } else {
      audio.muted = !audio.muted;
      sync();
    }
  });
})();

// ===== Ribbon untie =====
(function ribbon(){
  const card = document.getElementById('inviteCard');
  const tapHint = document.getElementById('tapHint');
  const countdown = document.getElementById('countdown');

  function untie(){
    if (card.classList.contains('revealed')) return;
    card.classList.add('revealed');
    countdown.classList.add('is-visible');
  }
  card.addEventListener('click', untie);
  tapHint.addEventListener('click', untie);
})();

// ===== Countdown (to Reception, 22 Aug 2026 6:30 PM IST) =====
(function countdown(){
  const target = new Date('2026-08-22T18:30:00+05:30').getTime();
  const els = {
    d: document.getElementById('cdDays'),
    h: document.getElementById('cdHours'),
    m: document.getElementById('cdMins'),
    s: document.getElementById('cdSecs'),
  };
  function tick(){
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.d.textContent = String(d).padStart(2, '0');
    els.h.textContent = String(h).padStart(2, '0');
    els.m.textContent = String(m).padStart(2, '0');
    els.s.textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
})();

// ===== Scroll reveal (IntersectionObserver) =====
(function scrollReveal(){
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .itinerary__line');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  targets.forEach((t) => io.observe(t));
})();

// ===== Pre-wedding story: stagger photos + arrow navigation =====
(function storyFilmstrips(){
  const filmstrips = document.querySelectorAll('[data-filmstrip]');
  if (!filmstrips.length) return;

  // Scroll-reveal stagger
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  filmstrips.forEach((strip) => {
    strip.querySelectorAll('.story__photo').forEach((photo, i) => {
      photo.style.transitionDelay = `${(i % 6) * 90}ms`;
      io.observe(photo);
    });
  });

  // Arrow button navigation
  document.querySelectorAll('.story__filmstrip-wrap').forEach((wrap) => {
    const strip = wrap.querySelector('[data-filmstrip]');
    const prev = wrap.querySelector('.story__arrow--prev');
    const next = wrap.querySelector('.story__arrow--next');
    if (!strip) return;

    function scrollBy(dir){
      const photoW = strip.querySelector('.story__photo')?.offsetWidth || 280;
      strip.scrollBy({ left: dir * (photoW + 16), behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', () => scrollBy(-1));
    if (next) next.addEventListener('click', () => scrollBy(1));
  });
})();

// ===== Gallery: render from manifest + lightbox =====
(function gallery(){
  const grid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');

  let photos = [];
  let currentIndex = 0;

  function openLightbox(index, sourceEl){
    currentIndex = index;
    const photo = photos[index];
    lightboxImg.src = `images/optimized/${photo.file}`;
    lightboxImg.alt = photo.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');

    // FLIP-style transition: image grows from its exact grid position to full-screen,
    // using the native Web Animations API (no animation library needed for this).
    if (sourceEl && 'animate' in lightboxImg){
      const startRect = sourceEl.getBoundingClientRect();
      requestAnimationFrame(() => {
        const endRect = lightboxImg.getBoundingClientRect();
        const dx = startRect.left - endRect.left;
        const dy = startRect.top - endRect.top;
        const sx = startRect.width / endRect.width;
        const sy = startRect.height / endRect.height;
        lightboxImg.animate([
          { transform:`translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.6 },
          { transform:'translate(0, 0) scale(1, 1)', opacity: 1 }
        ], { duration: 450, easing: 'cubic-bezier(.22,.61,.36,1)' });
      });
    }
  }
  function closeLightbox(){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  function nav(delta){
    currentIndex = (currentIndex + delta + photos.length) % photos.length;
    const photo = photos[currentIndex];
    lightboxImg.removeAttribute('style');
    lightboxImg.src = `images/optimized/${photo.file}`;
    lightboxImg.alt = photo.alt;
  }

  btnClose.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', () => nav(-1));
  btnNext.addEventListener('click', () => nav(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });

  // Reads from window.PHOTOS (data/photos.js) — a plain script, not fetched JSON,
  // so this also works when the file is opened directly via file:// (no server needed).
  photos = (window.PHOTOS && window.PHOTOS.gallery) || [];
  grid.innerHTML = photos.map((p, i) => `
    <div class="gallery__item span-${p.span}" data-index="${i}">
      <img src="images/optimized/${p.file}" alt="${p.alt}" loading="lazy" style="--focal:${p.focal || '50% 50%'}" />
    </div>
  `).join('');

  const items = grid.querySelectorAll('.gallery__item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((item, i) => {
    item.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(item);
    item.addEventListener('click', () => openLightbox(i, item.querySelector('img')));
  });
})();

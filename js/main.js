// ===== Welcome confetti (plays once, right after unlocking on the gate page) =====
(function welcomeConfetti(){
  if (sessionStorage.getItem('just-unlocked') !== '1') return;
  sessionStorage.removeItem('just-unlocked');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Jewel tones pulled from the wedding's own palette (gold sherwani, teal/maroon
  // sarees) rather than generic primary-color party confetti.
  const CONFETTI_COLORS = ['#C9A227', '#9B2335', '#1F5C5C', '#C2185B', '#2C5F9E', '#2E7D5B', '#F7F3EC', '#E08E2B'];

  function rad(deg){ return deg * Math.PI / 180; }

  function makePiece(x, y, angleMin, angleMax, distMin, distMax){
    const el = document.createElement('span');
    el.className = 'confetti-piece';
    const isCircle = Math.random() < 0.4;
    const size = 7 + Math.random() * 9;
    el.style.width = size + 'px';
    el.style.height = isCircle ? size + 'px' : (size * 0.4) + 'px';
    el.style.borderRadius = isCircle ? '50%' : '1px';
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);

    const angle = angleMin + Math.random() * (angleMax - angleMin);
    const dist = distMin + Math.random() * (distMax - distMin);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const sway = (Math.random() - 0.5) * 90;
    const fall = 260 + Math.random() * 240;
    const rot = Math.random() * 900 - 450;
    const duration = 2200 + Math.random() * 900;

    const anim = el.animate([
      { transform:'translate(-50%, -50%) rotate(0deg)', opacity:1, offset:0 },
      { transform:`translate(${dx}px, ${dy}px) rotate(${rot * 0.4}deg)`, opacity:1, offset:0.3 },
      { transform:`translate(${dx + sway}px, ${dy + fall * 0.55}px) rotate(${rot * 0.75}deg)`, opacity:1, offset:0.7 },
      { transform:`translate(${dx + sway * 1.6}px, ${dy + fall}px) rotate(${rot}deg)`, opacity:0, offset:1 }
    ], { duration, easing:'cubic-bezier(.18,.7,.3,1)', fill:'forwards' });
    anim.onfinish = () => el.remove();
  }

  function burst(){
    const w = window.innerWidth, h = window.innerHeight;
    const small = w < 480;
    const x = w / 2, y = h * 0.42;

    const centerCount = small ? 60 : 110;
    for (let i = 0; i < centerCount; i++){
      makePiece(x, y, 0, Math.PI * 2, 100, small ? 220 : 340);
    }

    const cannonCount = small ? 30 : 55;
    for (let i = 0; i < cannonCount; i++){
      makePiece(0, h, rad(-80), rad(-20), 200, w * (small ? 0.7 : 0.85));
      makePiece(w, h, rad(-160), rad(-100), 200, w * (small ? 0.7 : 0.85));
    }
  }

  setTimeout(burst, 200);
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

  // Try to autoplay with sound on page load. Browsers may block this since
  // there's no preceding gesture on this exact page load — if so, fall back
  // to muted autoplay (always allowed) so the toggle's next tap can unmute
  // instantly instead of leaving the track fully stopped.
  audio.play().then(sync).catch(() => {
    audio.muted = true;
    audio.play().catch(() => {});
    sync();
  });

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

// ===== Pre-wedding story: stagger photos into view per filmstrip =====
(function storyFilmstrips(){
  const filmstrips = document.querySelectorAll('[data-filmstrip]');
  if (!filmstrips.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  filmstrips.forEach((strip) => {
    const photos = strip.querySelectorAll('.story__photo');
    photos.forEach((photo, i) => {
      photo.style.transitionDelay = `${(i % 5) * 100}ms`;
      io.observe(photo);
    });
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

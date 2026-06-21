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
  // resume from where the gate page left off, so the song feels continuous
  // across the navigation instead of restarting at 0:00
  const savedTime = parseFloat(sessionStorage.getItem('bgm-time'));
  if (!isNaN(savedTime) && savedTime > 0) audio.currentTime = savedTime;
  // honor whatever mute state the guest chose on the gate page (on by default)
  audio.muted = sessionStorage.getItem('bgm-muted') === 'true';

  // The guest just tapped "unlock" on the gate page — a genuine, very recent
  // gesture — so we try to carry that momentum into autoplay here. Browsers
  // may still block it (each page load is its own autoplay decision); if so,
  // fall back to muted autoplay (always allowed) so the toggle's next tap
  // can unmute instantly instead of leaving the track fully stopped.
  if (sessionStorage.getItem('bgm-intent') === 'on'){
    audio.play().then(sync).catch(() => {
      audio.muted = true;
      audio.play().catch(() => {});
      sync();
    });
  } else {
    sync();
  }

  toggle.addEventListener('click', () => {
    if (audio.paused){
      audio.muted = false;
      audio.play().then(() => { sessionStorage.setItem('bgm-muted', 'false'); sync(); }).catch(sync);
    } else {
      audio.muted = !audio.muted;
      sessionStorage.setItem('bgm-muted', String(audio.muted));
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

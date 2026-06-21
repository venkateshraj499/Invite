(function(){
  const gate = document.getElementById('gate');
  const iris = document.getElementById('iris');
  const bgm = document.getElementById('bgm');
  const muteToggle = document.getElementById('muteToggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let unlocked = false;
  let muted = false; // the guest's chosen preference — music is on by default

  function syncMuteUI(){
    if (!muteToggle) return;
    muteToggle.classList.toggle('is-muted', muted);
    muteToggle.setAttribute('aria-pressed', String(muted));
    muteToggle.setAttribute('aria-label', muted ? 'Unmute music' : 'Mute music');
  }
  syncMuteUI();

  // Autoplay the track muted the instant the page loads — every browser
  // allows muted autoplay with no gesture required. This means the song has
  // already been buffering for however long the guest looks at this screen,
  // so when they actually tap to unlock, we just flip .muted to false —
  // an instant, zero-buffering switch — instead of racing to start fresh
  // playback in the ~2s window before the page navigates away.
  if (bgm){
    bgm.volume = 0.55;
    bgm.muted = true;
    const tryPlay = () => bgm.play().catch(() => {});
    tryPlay();
    // the very first attempt can be rejected if the browser hasn't finished
    // readying the media yet — retry once it actually signals it's playable
    bgm.addEventListener('canplay', tryPlay, { once: true });
    bgm.addEventListener('loadeddata', tryPlay, { once: true });
  }

  if (muteToggle){
    muteToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // don't let this tap also trigger unlock()
      muted = !muted;
      if (bgm) bgm.muted = muted;
      sessionStorage.setItem('bgm-muted', String(muted));
      syncMuteUI();
    });
    muteToggle.addEventListener('keydown', (e) => e.stopPropagation());
  }

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
    const duration = 1300 + Math.random() * 1000;

    const anim = el.animate([
      { transform:'translate(-50%, -50%) rotate(0deg)', opacity:1, offset:0 },
      { transform:`translate(${dx}px, ${dy}px) rotate(${rot * 0.4}deg)`, opacity:1, offset:0.3 },
      { transform:`translate(${dx + sway}px, ${dy + fall * 0.55}px) rotate(${rot * 0.75}deg)`, opacity:1, offset:0.7 },
      { transform:`translate(${dx + sway * 1.6}px, ${dy + fall}px) rotate(${rot}deg)`, opacity:0, offset:1 }
    ], { duration, easing:'cubic-bezier(.18,.7,.3,1)', fill:'forwards' });
    anim.onfinish = () => el.remove();
  }

  function burstConfetti(x, y){
    const w = window.innerWidth, h = window.innerHeight;
    const small = w < 480;

    // central burst from the guest's own tap point
    const centerCount = small ? 60 : 110;
    for (let i = 0; i < centerCount; i++){
      makePiece(x, y, 0, Math.PI * 2, 100, small ? 220 : 340);
    }

    // two "popper cannons" firing up and inward from the bottom corners,
    // for a grander, full-screen celebration rather than one small puff
    const cannonCount = small ? 30 : 55;
    for (let i = 0; i < cannonCount; i++){
      makePiece(0, h, rad(-80), rad(-20), 200, w * (small ? 0.7 : 0.85));
      makePiece(w, h, rad(-160), rad(-100), 200, w * (small ? 0.7 : 0.85));
    }
  }

  function unlock(x, y){
    if (unlocked) return;
    unlocked = true;
    iris.style.left = x + 'px';
    iris.style.top = y + 'px';
    // force layout so the position is applied before the scale transition starts
    iris.getBoundingClientRect();
    gate.classList.add('is-unlocking');
    if (!reduced) burstConfetti(x, y);

    // Unmute (it's already been silently playing/buffering since page load —
    // see above) rather than starting fresh playback here. We carry the
    // playback position forward via sessionStorage so invite.html can resume
    // from the same spot instead of restarting at 0:00, making the handoff
    // feel like one continuous track.
    if (bgm){
      bgm.muted = muted;
      if (bgm.paused) bgm.play().catch(() => {}); // safety net if the early muted autoplay never started
    }
    sessionStorage.setItem('bgm-intent', 'on');
    sessionStorage.setItem('bgm-muted', String(muted));

    const delay = reduced ? 0 : 1900;
    setTimeout(() => {
      if (bgm) sessionStorage.setItem('bgm-time', String(bgm.currentTime || 0));
      window.location.href = 'invite.html';
    }, delay);
  }

  gate.addEventListener('click', (e) => unlock(e.clientX, e.clientY));
  gate.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      const r = gate.getBoundingClientRect();
      unlock(r.width / 2, r.height / 2);
    }
  });
})();

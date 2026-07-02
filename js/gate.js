(function () {
  const gate = document.getElementById("gate");
  let unlocked = false;

  function unlock() {
    if (unlocked) return;
    unlocked = true;

    // Fade out the silhouette gate
    gate.classList.add("is-fading");

    // Start music immediately — we're in a genuine click, guaranteed to work
    const audio = document.getElementById("bgm");
    if (audio) {
      audio.volume = 0.55;
      audio.play().catch(() => {});
    }

    // After silhouette fades, trigger the charcoal panel animation
    setTimeout(() => {
      gate.style.display = "none";
      document.dispatchEvent(new CustomEvent("gate-silhouette-done"));
    }, 370);
  }

  gate.addEventListener("click", () => unlock());
  gate.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      unlock();
    }
  });
})();

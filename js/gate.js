(function () {
  const gate = document.getElementById("gate");
  let unlocked = false;

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    gate.classList.add("is-unlocking");
    // The celebration plays on invite.html itself once it's actually loaded —
    // trying to hold this page open long enough for a confetti burst to
    // finish just produces a dead, blank-feeling pause before navigation.
    sessionStorage.setItem("just-unlocked", "1");
    window.location.href = "invite.html";
  }

  gate.addEventListener("click", () => unlock());
  gate.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      unlock();
    }
  });
})();

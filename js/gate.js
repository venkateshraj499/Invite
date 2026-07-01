(function () {
  const gate = document.getElementById("gate");
  let unlocked = false;

  function unlock() {
    if (unlocked) return;
    unlocked = true;
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

// ===== Improved Attribution & Silent Protection | main1.js =====
// Purpose: Silently restrict interaction if developer credit is removed
// NOTE: Frontend-only deterrence, not absolute security

(function () {
  "use strict";

  /* ================= CONFIG ================= */
  const REQUIRED = {
    name: "aarif alam",
    email: "aarifalam0105@gmail.com",
  };

  const CHECK_INTERVAL = 2000; // ms

  /* ================= UTILS ================= */
  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .trim();
  }

  function contains(actual, expected) {
    return normalize(actual).includes(normalize(expected));
  }

  /* ================= SILENT BLOCK ================= */
  function blockInteraction() {
    if (document.body.dataset.creditBlocked === "true") return;

    document.body.dataset.creditBlocked = "true";

    // Block scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Block all anchor navigation
    document.addEventListener(
      "click",
      function (e) {
        const a = e.target.closest("a");
        if (a) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  }

  function unblockInteraction() {
    if (document.body.dataset.creditBlocked !== "true") return;

    delete document.body.dataset.creditBlocked;

    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  /* ================= CORE LOGIC ================= */
  function checkCredit() {
    const nameEl = document.querySelector("[data-dev-name], #dev-name");
    const emailEl = document.querySelector("[data-dev-email], #dev-email");

    if (!nameEl || !emailEl) {
      blockInteraction();
      return;
    }

    const nameOK = contains(nameEl.textContent, REQUIRED.name);
    const emailOK = contains(emailEl.textContent, REQUIRED.email);

    nameOK && emailOK ? unblockInteraction() : blockInteraction();
  }

  /* ================= INIT ================= */
  document.addEventListener("DOMContentLoaded", function () {
    checkCredit();
    setInterval(checkCredit, CHECK_INTERVAL);
  });

})();
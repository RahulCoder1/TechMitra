/* =========================================================
   TECHMITRA — shared glass effects for careers & admin
========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  // Intro
  requestAnimationFrame(function () {
    setTimeout(function () { document.body.classList.add("is-ready"); }, 80);
  });

  // Scroll reveal
  var els = Array.prototype.slice.call(document.querySelectorAll(".c-reveal"));
  els.forEach(function (el, i) {
    var sibs = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.setProperty("--d", Math.min(sibs, 6) * 90 + "ms");
  });
  if (!("IntersectionObserver" in window) || reduce) {
    els.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  // Stagger job cards whenever careers.js re-renders them
  var grid = document.getElementById("jobsContainer");
  function stagger() {
    if (!grid) return;
    Array.prototype.forEach.call(grid.children, function (card, i) { card.style.setProperty("--i", Math.min(i, 8)); });
  }
  if (grid && "MutationObserver" in window) {
    new MutationObserver(stagger).observe(grid, { childList: true });
    stagger();
  }
  var rows = document.getElementById("adminJobsTable");
  if (rows && "MutationObserver" in window) {
    new MutationObserver(function () {
      Array.prototype.forEach.call(rows.children, function (r, i) { r.style.animationDelay = Math.min(i, 10) * 60 + "ms"; });
    }).observe(rows, { childList: true });
  }

  // Cursor light on glass cards
  if (fine && !reduce) {
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".spot, .career-job-card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    }, { passive: true });
  }
})();

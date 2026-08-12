// FORGE letters: hover, focus, or click a letter and its stage takes the floor.
// Adapted from the void concept; brand colors unchanged (red letter accent,
// paper stage name, slate question). Reduced motion swaps without animation.
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var line = document.getElementById("forge-line");
  var panel = document.getElementById("forge-panel");
  if (!line || !panel) return;
  var items = [].slice.call(line.querySelectorAll(".forge-item"));
  var pLetter = document.getElementById("forge-panel-letter");
  var pStage = document.getElementById("forge-panel-stage");
  var pQ = document.getElementById("forge-panel-q");
  var swapTimer = null;

  function setForge(item) {
    if (!item || item.classList.contains("active")) return;
    items.forEach(function (it) {
      var on = it === item;
      it.classList.toggle("active", on);
      var b = it.querySelector(".forge-letter-btn");
      if (b) b.setAttribute("aria-expanded", on ? "true" : "false");
    });
    var write = function () {
      var btn = item.querySelector(".forge-letter-btn");
      if (pLetter && btn) pLetter.textContent = btn.textContent;
      if (pStage) pStage.textContent = item.getAttribute("data-stage") || "";
      if (pQ) pQ.textContent = item.getAttribute("data-q") || "";
      panel.classList.remove("swap");
    };
    if (reduced) { write(); return; }
    panel.classList.add("swap");
    if (swapTimer) clearTimeout(swapTimer);
    swapTimer = setTimeout(write, 300);
  }

  items.forEach(function (item) {
    var btn = item.querySelector(".forge-letter-btn");
    if (!btn) return;
    btn.addEventListener("mouseenter", function () { setForge(item); });
    btn.addEventListener("focus", function () { setForge(item); });
    btn.addEventListener("click", function () { setForge(item); });
  });
})();

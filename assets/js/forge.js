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
  var pStage = document.getElementById("forge-panel-stage");
  var pQ = document.getElementById("forge-panel-q");
  var swapTimer = null;

  // Stage name renders with its FORGE letter in red, so the big letter
  // above is not repeated in the panel.
  function stageMarkup(name) {
    if (!name) return "";
    var b = document.createElement("b");
    b.className = "fl";
    b.textContent = name.charAt(0);
    return b.outerHTML + name.slice(1).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  function setForge(item) {
    if (!item || item.classList.contains("active")) return;
    items.forEach(function (it) {
      var on = it === item;
      it.classList.toggle("active", on);
      var b = it.querySelector(".forge-letter-btn");
      if (b) b.setAttribute("aria-expanded", on ? "true" : "false");
    });
    var write = function () {
      if (pStage) pStage.innerHTML = stageMarkup(item.getAttribute("data-stage") || "");
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

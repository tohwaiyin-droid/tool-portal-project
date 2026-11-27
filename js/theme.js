// Light/dark theme switch, shared by every page.
// Light is the default. The visitor's choice is remembered in the browser.
(function () {
  var KEY = "theme";
  var root = document.documentElement;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* storage blocked: ignore */ }
  }

  // Runs immediately (script is in <head>) so the page never flashes the wrong theme.
  root.setAttribute("data-theme", saved() === "dark" ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (!button) return;

    function refresh() {
      var dark = root.getAttribute("data-theme") === "dark";
      button.textContent = dark ? "Switch to light theme" : "Switch to dark theme";
      button.setAttribute("aria-pressed", dark ? "true" : "false");
    }

    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      save(next);
      refresh();
    });

    refresh();
  });
})();

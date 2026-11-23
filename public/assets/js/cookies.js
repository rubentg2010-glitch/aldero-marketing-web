/* ALDERO MARKETING — gestión de cookies (consentimiento)
   ----------------------------------------------------------
   Para activar Google Analytics, pon tu ID de medición abajo (ej. "G-ABC123XYZ").
   Solo se cargará si el visitante acepta las cookies de análisis. */
(function () {
  "use strict";

  var GA_ID = ""; // ← tu ID de Google Analytics 4 (déjalo vacío si no usas analítica)
  var KEY = "aldero-cookies";
  var root = document.documentElement;

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  }
  function save(analytics) {
    var data = { necessary: true, analytics: !!analytics, date: new Date().toISOString(), v: 1 };
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    apply(data);
    return data;
  }
  function apply(data) {
    if (data && data.analytics && GA_ID && !window.__alderoGA) {
      window.__alderoGA = true;
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { anonymize_ip: true });
    }
  }

  var banner;
  function build() {
    banner = document.createElement("section");
    banner.className = "cookie";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Preferencias de cookies");
    banner.innerHTML =
      '<div class="cookie__main">' +
        '<p class="cookie__title">Cookies</p>' +
        '<p class="cookie__text">Usamos cookies técnicas necesarias y, solo si nos dejas, cookies de análisis para saber cómo se usa la web y mejorarla. <a href="cookies">Más información</a></p>' +
      '</div>' +
      '<div class="cookie__prefs" hidden>' +
        '<label class="cookie__opt"><span><b>Necesarias</b><small>Imprescindibles para que la web funcione y recordar tu elección.</small></span><input type="checkbox" checked disabled><i aria-hidden="true"></i></label>' +
        '<label class="cookie__opt"><span><b>Análisis</b><small>Estadísticas anónimas de visitas (Google Analytics).</small></span><input type="checkbox" data-ck-analytics><i aria-hidden="true"></i></label>' +
      '</div>' +
      '<div class="cookie__actions">' +
        '<button type="button" class="cookie__btn" data-ck="reject">Rechazar</button>' +
        '<button type="button" class="cookie__btn cookie__btn--ghost" data-ck="config">Configurar</button>' +
        '<button type="button" class="cookie__btn" data-ck="accept">Aceptar</button>' +
      '</div>';
    document.body.appendChild(banner);

    var prefs = banner.querySelector(".cookie__prefs");
    var chk = banner.querySelector("[data-ck-analytics]");
    var cfgBtn = banner.querySelector('[data-ck="config"]');
    var current = read();
    if (current) chk.checked = !!current.analytics;

    banner.addEventListener("click", function (e) {
      var b = e.target.closest("[data-ck]");
      if (!b) return;
      var act = b.getAttribute("data-ck");
      if (act === "accept") { save(true); close(); }
      else if (act === "reject") { save(false); close(); }
      else if (act === "config") {
        if (prefs.hidden) { prefs.hidden = false; cfgBtn.textContent = "Guardar selección"; }
        else { save(chk.checked); close(); }
      }
    });
  }
  function open(withPrefs) {
    if (!banner) build();
    banner.classList.add("is-open");
    if (withPrefs) {
      banner.querySelector(".cookie__prefs").hidden = false;
      banner.querySelector('[data-ck="config"]').textContent = "Guardar selección";
    }
  }
  function close() { if (banner) banner.classList.remove("is-open"); }

  // Enlaces "Configurar cookies" en el pie y en la política
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-cookie-settings]");
    if (t) { e.preventDefault(); open(true); }
  });

  var stored = read();
  apply(stored);
  if (!stored) {
    // En la portada esperamos a que termine la intro para no taparla
    var tries = 0;
    (function wait() {
      var introRunning = root.classList.contains("intro-on") && !root.classList.contains("intro-done");
      if (introRunning && tries++ < 40) { setTimeout(wait, 100); return; }
      setTimeout(function () { open(false); }, 600);
    })();
  }
})();

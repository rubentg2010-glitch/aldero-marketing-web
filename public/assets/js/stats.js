/* Estadísticas propias de aldero.es: anónimas, sin cookies ni identificadores. */
(function () {
  "use strict";
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") { window.alderoStat = function () {}; return; }
  var mob = window.matchMedia && matchMedia("(max-width: 820px)").matches ? "m" : "d";
  function send(t, x) {
    try {
      var body = JSON.stringify({ t: t, p: location.pathname, r: t === "vista" ? document.referrer : "", d: mob, x: x || "" });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/evento", new Blob([body], { type: "text/plain" }));
      else fetch("/api/evento", { method: "POST", body: body, keepalive: true });
    } catch (e) {}
  }
  window.alderoStat = send;
  send("vista");
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a, button"); if (!a) return;
    var href = a.getAttribute("href") || "";
    if (a.classList.contains("hero__sticker")) send("pegatina");
    else if (a.closest(".hero__pick-opts")) send("eleccion", a.textContent.trim());
    if (/wa\.me\/34711553395|api\.whatsapp\.com/.test(href)) send("whatsapp");
    else if (/^tel:/.test(href)) send("llamada");
  }, true);
  document.addEventListener("submit", function (e) {
    var f = e.target; if (f && /\/api\/contacto/.test(f.getAttribute("action") || "") && !f.closest(".rec")) send("formulario");
  }, true);
})();

/* Servicios: barra que marca el servicio en pantalla y accesos directos desde la guía */
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".srv-tabs a"));
  var chaps = Array.prototype.slice.call(document.querySelectorAll(".chap[data-chap]"));
  if (!tabs.length || !chaps.length) return;
  var bar = document.querySelector(".srv-tabs");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setOn(i) {
    tabs.forEach(function (t, n) {
      var on = n === i;
      t.classList.toggle("is-on", on);
      if (on) { t.setAttribute("aria-current", "true"); } else { t.removeAttribute("aria-current"); }
      if (on && bar.scrollWidth > bar.clientWidth) {
        bar.scrollTo({ left: t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
      }
    });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setOn(+e.target.getAttribute("data-chap")); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    chaps.forEach(function (c) { io.observe(c); });
  }

  function go(i, e) {
    var c = chaps[i]; if (!c) return;
    if (e) e.preventDefault();
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 70;
    var y = c.getBoundingClientRect().top + window.pageYOffset - navH - bar.offsetHeight - 24;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    setOn(i);
    c.classList.remove("is-picked"); void c.offsetWidth; c.classList.add("is-picked");
    var t = c.querySelector(".chap__t"); if (t) { t.setAttribute("tabindex", "-1"); setTimeout(function () { t.focus({ preventScroll: true }); }, reduce ? 0 : 700); }
  }
  tabs.forEach(function (t) { t.addEventListener("click", function (e) { go(+t.getAttribute("data-tab"), e); }); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-goto]"), function (a) {
    a.addEventListener("click", function (e) { go(+a.getAttribute("data-goto"), e); });
  });
})();
/* esconde el botón flotante de WhatsApp cuando ya hay botones de contacto en pantalla */
(function () {
  var zones = document.querySelectorAll("#contacto, .footer, footer");
  if (!zones.length || !("IntersectionObserver" in window)) return;
  var vis = new Set();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) vis.add(e.target); else vis.delete(e.target); });
    document.documentElement.classList.toggle("wa-hide", vis.size > 0);
  }, { threshold: .15 });
  Array.prototype.forEach.call(zones, function (z) { io.observe(z); });
})();

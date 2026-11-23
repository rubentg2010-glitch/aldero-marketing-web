/* Simulador "Así te verían en Google": todo en el navegador, sin enviar datos */
(function () {
  var root = document.querySelector(".sim");
  if (!root) return;
  var form = root.querySelector("[data-sim-form]");
  var q = root.querySelector("[data-sim-query]");
  var you = root.querySelector("[data-sim-you]");
  var url = root.querySelector("[data-sim-url]");
  var fav = root.querySelector("[data-sim-fav]");
  var title = root.querySelector("[data-sim-title]");
  var desc = root.querySelector("[data-sim-desc]");
  var comp = root.querySelector("[data-sim-comp]");
  var dir = root.querySelector("[data-sim-dir]");
  var cta = root.querySelector("[data-sim-cta]");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DEF = { negocio: "Taller Pérez", actividad: "Mecánico", ciudad: "Málaga" };

  function val(name) {
    var v = (form.elements[name].value || "").replace(/\s+/g, " ").trim();
    return v || DEF[name];
  }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function slug(t) {
    return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24) || "tunegocio";
  }

  var typing = null;
  function typeQuery(text) {
    clearInterval(typing);
    if (reduce) { q.textContent = text; return; }
    var i = 0;
    q.textContent = "";
    typing = setInterval(function () {
      i++;
      q.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(typing);
    }, 28);
  }
  function pop() {
    if (reduce || !you.animate) return;
    you.animate([
      { opacity: 0, transform: "translateY(26px) scale(.98)" },
      { opacity: 1, transform: "translateY(0) scale(1)" }
    ], { duration: 650, delay: 120, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" });
  }

  var last = "";
  function render(animate) {
    var n = val("negocio"), a = val("actividad"), c = val("ciudad");
    var key = n + "|" + a + "|" + c;
    if (key === last && !animate) return;
    last = key;
    var al = a.toLowerCase();
    url.textContent = slug(n) + ".es";
    fav.textContent = n.charAt(0).toUpperCase();
    title.textContent = n + " · " + cap(al) + " en " + c;
    desc.textContent = cap(al) + " en " + c + ". Pide presupuesto sin compromiso por WhatsApp.";
    comp.textContent = cap(al) + " en " + c + " · otra web";
    dir.textContent = "Directorio de negocios en " + c;
    var msg = form.elements.negocio.value.trim()
      ? "Hola, he probado el simulador de ALDERO MARKETING. Mi negocio es " + n + " (" + al + " en " + c + ") y quiero salir así en Google."
      : "Hola, he probado el simulador de ALDERO MARKETING y quiero salir así en Google con mi negocio.";
    cta.href = "https://wa.me/34711553395?text=" + encodeURIComponent(msg);
    typeQuery(al + " en " + c.toLowerCase());
    pop();
  }

  var t;
  form.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { render(false); }, 260); });
  form.addEventListener("submit", function (e) { e.preventDefault(); render(true); });

  // Demostración automática la primera vez que se ve el bloque
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); render(true); root.classList.add("is-seen"); }
    }, { threshold: 0.35 });
    io.observe(root);
  } else {
    render(true);
  }
})();

/* "Tu web de ejemplo": formulario en dos pasos → /api/boceto → muestra el boceto en un iframe. */
(function () {
  "use strict";
  var form = document.querySelector("[data-wx-form]");
  if (!form) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var steps = form.querySelectorAll("[data-wx-step]");
  var load = $("[data-wx-load]"), res = $("[data-wx-res]"), frame = $("[data-wx-frame]");
  var t = form.querySelector('input[name="t"]');
  if (t) t.value = String(Date.now());
  var WA = "https://wa.me/34711553395?text=";

  function go(n) {
    steps.forEach(function (s) {
      var on = s.getAttribute("data-wx-step") === String(n);
      s.hidden = !on;
      s.classList.toggle("is-on", on);
    });
    form.querySelectorAll("[data-wx-dot]").forEach(function (d) {
      d.classList.toggle("is-on", Number(d.getAttribute("data-wx-dot")) <= n);
    });
    var top = form.getBoundingClientRect().top + window.scrollY - 110;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
  }
  function err(n, msg) { var e = $('[data-wx-error="' + n + '"]'); e.textContent = msg || ""; e.className = "cform__status" + (msg ? " is-err" : ""); }
  function telOk(v) { var d = v.replace(/[^\d+]/g, "").replace(/^(\+34|0034)/, ""); return /^[6789]\d{8}$/.test(d); }

  $("[data-wx-next]").addEventListener("click", function () {
    var f = form.elements;
    if (!f.nombre.value.trim()) return err(1, "Pon tu nombre."), f.nombre.focus();
    if (!telOk(f.telefono.value)) return err(1, "Pon un teléfono español válido, por ejemplo 612 345 678."), f.telefono.focus();
    if (f.email.value.trim() && !f.email.checkValidity()) return err(1, "Revisa el email o déjalo en blanco."), f.email.focus();
    if (!f.acepto.checked) return err(1, "Tienes que aceptar la política de privacidad para continuar.");
    err(1, "");
    go(2);
    f.negocio.focus({ preventScroll: true });
  });
  $("[data-wx-back]").addEventListener("click", function () { go(1); });

  var frases = ["Leyendo lo que nos has contado…", "Pensando los textos de tu web…", "Eligiendo secciones y colores…", "Montando el diseño…", "Últimos retoques…"];
  var timer;
  function cargando(on) {
    var lt = $("[data-wx-load-text]"), i = 0;
    clearInterval(timer);
    if (on) { lt.textContent = frases[0]; timer = setInterval(function () { i = Math.min(i + 1, frases.length - 1); lt.textContent = frases[i]; }, 7000); }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    if (!f.negocio.value.trim()) return err(2, "Pon el nombre de tu negocio."), f.negocio.focus();
    if (!f.ciudad.value.trim()) return err(2, "Pon tu ciudad o zona."), f.ciudad.focus();
    err(2, "");
    var data = new FormData(form);
    form.hidden = true; load.hidden = false; cargando(true);
    load.scrollIntoView({ block: "center", behavior: "smooth" });
    fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (r) {
        cargando(false); load.hidden = true;
        if (!r.ok) {
          form.hidden = false;
          if (r.limite) { go(2); err(2, r.msg); } else { go(2); err(2, r.msg || "No se ha podido crear el ejemplo. Inténtalo de nuevo en un momento."); }
          return;
        }
        var negocio = f.negocio.value.trim();
        frame.src = r.url;
        $("[data-wx-full]").href = r.url;
        $("[data-wx-url]").textContent = (negocio.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "") || "tunegocio") + ".es";
        $("[data-wx-wa]").href = WA + encodeURIComponent("Hola, soy " + f.nombre.value.trim() + ". He visto la web de ejemplo de " + negocio + " (ref. " + r.id + ") y quiero que me hagáis la de verdad.");
        res.hidden = false;
        var dot = form.querySelector('[data-wx-dot="3"]'); if (dot) dot.classList.add("is-on");
        res.scrollIntoView({ block: "start", behavior: "smooth" });
      })
      .catch(function () {
        cargando(false); load.hidden = true; form.hidden = false; go(2);
        err(2, "No se ha podido conectar. Revisa tu conexión e inténtalo de nuevo.");
      });
  });

  $("[data-wx-again]").addEventListener("click", function () {
    res.hidden = true; frame.removeAttribute("src"); form.hidden = false;
    if (t) t.value = String(Date.now());
    go(2);
  });
})();

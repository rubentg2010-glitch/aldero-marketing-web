/* "Recomienda y ganáis los dos" — ventana + código personal para compartir cuando quieras */
(function () {
  "use strict";
  var KEY = "aldero-recomienda", DAYS = 14, DELAY = 25000;
  var d = document, root = d.documentElement, SITE = "https://aldero.es";
  var st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  if (/[?&]norecomienda/.test(location.search)) return;

  var WA_ME = "https://wa.me/34711553395?text=" + encodeURIComponent("Hola, vengo de la web de Aldero Marketing y quiero recomendaros un negocio para la promoción «Recomienda y ganáis los dos».");
  var html =
    '<div class="rec__bg" data-rec-close></div>' +
    '<div class="rec__card" role="dialog" aria-modal="true" aria-labelledby="recTitle">' +
      '<button class="rec__x" type="button" data-rec-close aria-label="Cerrar">×</button>' +
      '<div class="rec__badge" aria-hidden="true">' +
        '<svg class="rec__gift" viewBox="0 0 64 64"><rect x="10" y="26" width="44" height="30" rx="4" fill="rgba(255,255,255,.16)" stroke="#fff" stroke-width="2"/><rect x="6" y="18" width="52" height="10" rx="3" fill="rgba(255,255,255,.24)" stroke="#fff" stroke-width="2"/><path d="M32 18v38" stroke="#fff" stroke-width="2"/><path class="rec__bow" d="M32 18c-6-10-18-10-16-3 1 4 10 3 16 3zm0 0c6-10 18-10 16-3-1 4-10 3-16 3z" fill="#fff"/></svg>' +
        '<b><span class="rec__num">-15</span><small>%</small></b><span class="rec__for">para ti <i>+</i> para él</span>' +
        '<span class="rec__days" data-days></span>' +
      '</div>' +
      '<div class="rec__body">' +
        /* Vista 1: conseguir código */
        '<div class="rec__view" data-view="code">' +
          '<p class="rec__eyebrow">🎁 Promoción de lanzamiento</p><h2 id="recTitle" class="rec__title">Recomienda Aldero<br>y <em>ganáis los dos.</em></h2>' +
          '<p class="rec__lead">No hace falta que pienses en nadie ahora. Te damos <b>tu código personal</b> y lo compartes cuando quieras: si alguien contrata su web con él, <b>os lleváis un 15 % de descuento cada uno</b>.</p>' +
          '<form class="rec__form" data-form="code" novalidate>' +
            '<div class="rec__row">' +
              '<label class="rec__f"><span>Tu nombre</span><input name="nombre" required maxlength="80" autocomplete="name"></label>' +
              '<label class="rec__f"><span>Tu WhatsApp o email</span><input name="contacto" required maxlength="120" autocomplete="tel"></label>' +
            '</div>' +
            '<label class="rec__ok"><input type="checkbox" name="acepto" value="1" required><span>Acepto la <a href="privacidad">política de privacidad</a>.</span></label>' +
            '<button class="btn btn--blue rec__send rec__glow" type="submit">Conseguir mi código gratis →</button>' +
            '<p class="rec__msg" role="status" aria-live="polite"></p>' +
          '</form>' +
          '<button class="rec__switch" type="button" data-go="ref">¿Ya tienes a alguien en mente? Recomiéndalo ahora →</button>' +
        '</div>' +
        /* Vista 2: recomendar ya */
        '<div class="rec__view" data-view="ref" hidden>' +
          '<h2 class="rec__title">¿A quién nos<br><em>recomiendas?</em></h2>' +
          '<p class="rec__lead">Déjanos sus datos y contactamos de tu parte. Si contrata, <b>15 % de descuento para los dos</b>.</p>' +
          '<form class="rec__form" data-form="ref" novalidate>' +
            '<div class="rec__row">' +
              '<label class="rec__f"><span>Tu nombre</span><input name="nombre" required maxlength="80" autocomplete="name"></label>' +
              '<label class="rec__f"><span>Tu WhatsApp o email</span><input name="contacto" required maxlength="120" autocomplete="tel"></label>' +
            '</div>' +
            '<label class="rec__f"><span>Negocio que nos recomiendas</span><input name="negocio" required maxlength="120" placeholder="Ej.: Peluquería Ana, Málaga"></label>' +
            '<label class="rec__f"><span>Su teléfono o web <i>(opcional)</i></span><input name="negocio_contacto" maxlength="120"></label>' +
            '<label class="rec__ok"><input type="checkbox" name="acepto" value="1" required><span>Acepto la <a href="privacidad">política de privacidad</a>.</span></label>' +
            '<button class="btn btn--blue rec__send" type="submit">Enviar recomendación</button>' +
            '<p class="rec__msg" role="status" aria-live="polite"></p>' +
          '</form>' +
          '<button class="rec__switch" type="button" data-go="code">← Mejor dame mi código para más tarde</button>' +
        '</div>' +
        /* Vista 3: tu código */
        '<div class="rec__view" data-view="mine" hidden>' +
          '<p class="rec__title rec__title--sm">Este es <em>tu código.</em></p>' +
          '<p class="rec__lead">Compártelo cuando quieras con quien necesite web. Cuando contrate diciendo tu código, os aplicamos el 15 % a los dos.</p>' +
          '<div class="rec__codebox"><span class="rec__code" data-code></span><button class="rec__copy" type="button" data-copy>Copiar</button></div>' +
          '<div class="rec__acts"><a class="btn btn--blue rec__share" data-share target="_blank" rel="noopener">Compartir por WhatsApp</a><button class="btn rec__later" type="button" data-rec-close>Lo guardo para luego</button></div>' +
          '<p class="rec__note">Lo tienes siempre en el botón del regalo 🎁 de abajo a la izquierda.</p>' +
        '</div>' +
        /* Vista 4: recomendación enviada */
        '<div class="rec__view" data-view="sent" hidden>' +
          '<p class="rec__title rec__title--sm">¡Recibido! <em>Gracias.</em></p>' +
          '<p class="rec__lead">Contactaremos con el negocio de tu parte. Cuando contrate, os aplicamos el 15 % a los dos.</p>' +
          '<button class="btn btn--blue" type="button" data-rec-close>Seguir viendo la web</button>' +
        '</div>' +
        '<p class="rec__alt">¿Prefieres hablarlo por WhatsApp? <a href="' + WA_ME + '" target="_blank" rel="noopener">Escríbenos aquí</a></p>' +
        '<p class="rec__legal">Válido hasta el 31 de enero de 2027. El descuento se aplica sobre el presupuesto de diseño web cuando el negocio recomendado lo contrata. No acumulable con otras ofertas.</p>' +
      '</div>' +
    '</div>';

  var box, pill, lastFocus;
  function makeCode(name) {
    var n = (name || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z]/g, " ").trim().split(/\s+/)[0] || "AMIGO";
    return "ALDERO-" + n.slice(0, 8) + "-" + String(Math.floor(100 + Math.random() * 900));
  }
  function shareUrl(code) {
    var t = "Te paso esto por si necesitas web para tu negocio: Aldero Marketing hace webs en Málaga. Si les dices mi código *" + code + "* te llevas un 15 % de descuento 👉 " + SITE;
    return "https://wa.me/?text=" + encodeURIComponent(t);
  }
  function show(view) {
    box.querySelectorAll(".rec__view").forEach(function (v) { v.hidden = v.dataset.view !== view; });
    box.querySelector(".rec__alt").hidden = view === "mine" || view === "sent";
    if (view === "mine") {
      box.querySelector("[data-code]").textContent = st.code;
      box.querySelector("[data-share]").href = shareUrl(st.code);
    }
  }
  function post(fields) {
    var fd = new FormData();
    Object.keys(fields).forEach(function (k) { fd.append(k, fields[k]); });
    fd.append("acepto", "1"); fd.append("web", ""); fd.append("t", String(st.opened || Date.now() - 10000));
    return fetch("/api/contacto", { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); });
  }
  function validate(form) {
    form.querySelectorAll(".is-bad").forEach(function (x) { x.classList.remove("is-bad"); });
    var bad = [].filter.call(form.querySelectorAll("[required]"), function (i) { return i.type === "checkbox" ? !i.checked : !i.value.trim(); });
    bad.forEach(function (i) { i.closest("label").classList.add("is-bad"); });
    if (bad.length) { form.querySelector(".rec__msg").textContent = "Rellena los campos marcados."; bad[0].focus(); }
    return !bad.length;
  }
  function busy(form, on, label) { var b = form.querySelector(".rec__send"); b.disabled = on; if (label) b.textContent = label; }

  function build() {
    box = d.createElement("div"); box.className = "rec"; box.hidden = true; box.innerHTML = html; d.body.appendChild(box);
    box.addEventListener("click", function (e) {
      if (e.target.closest("[data-rec-close]")) close();
      var go = e.target.closest("[data-go]"); if (go) show(go.dataset.go);
      if (e.target.closest("[data-copy]")) {
        var btn = e.target.closest("[data-copy]");
        var done = function () { btn.textContent = "¡Copiado!"; setTimeout(function () { btn.textContent = "Copiar"; }, 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(st.code).then(done, done); else done();
      }
    });
    var fc = box.querySelector('[data-form="code"]'), fr = box.querySelector('[data-form="ref"]');
    fc.addEventListener("submit", function (e) {
      e.preventDefault(); if (!validate(fc)) return;
      var code = makeCode(fc.nombre.value); busy(fc, true, "Creando tu código…"); fc.querySelector(".rec__msg").textContent = "";
      post({ nombre: fc.nombre.value, contacto: fc.contacto.value, servicio: "Código de recomendación", pagina: "Ventana Recomienda y ganáis los dos",
        mensaje: "NUEVO CÓDIGO DE RECOMENDACIÓN: " + code + "\nPertenece a: " + fc.nombre.value + " (" + fc.contacto.value + ")\nSi alguien contrata diciendo este código, 15 % de descuento para los dos." })
        .then(function (j) {
          if (j && j.ok) { st.code = code; st.sent = true; save(); show("mine"); updatePill(); if (window.alderoStat) alderoStat("codigo"); }
          else { fc.querySelector(".rec__msg").textContent = (j && j.msg) || "No se ha podido crear. Prueba por WhatsApp."; }
          busy(fc, false, "Conseguir mi código gratis →");
        }).catch(function () { fc.querySelector(".rec__msg").textContent = "No se ha podido crear. Prueba por WhatsApp."; busy(fc, false, "Conseguir mi código gratis →"); });
    });
    fr.addEventListener("submit", function (e) {
      e.preventDefault(); if (!validate(fr)) return;
      busy(fr, true, "Enviando…"); fr.querySelector(".rec__msg").textContent = "";
      post({ nombre: fr.nombre.value, contacto: fr.contacto.value, servicio: "Recomendación (−15 % los dos)", pagina: "Ventana Recomienda y ganáis los dos",
        mensaje: "RECOMENDACIÓN (promo −15 % para los dos)\nNegocio recomendado: " + fr.negocio.value + "\nContacto del negocio: " + (fr.negocio_contacto.value || "no indicado") + "\nRecomienda: " + fr.nombre.value + " (" + fr.contacto.value + ")" + (st.code ? "\nSu código: " + st.code : "") })
        .then(function (j) {
          if (j && j.ok) { st.sent = true; save(); show("sent"); if (window.alderoStat) alderoStat("recomendacion"); }
          else fr.querySelector(".rec__msg").textContent = (j && j.msg) || "No se ha podido enviar. Prueba por WhatsApp.";
          busy(fr, false, "Enviar recomendación");
        }).catch(function () { fr.querySelector(".rec__msg").textContent = "No se ha podido enviar. Prueba por WhatsApp."; busy(fr, false, "Enviar recomendación"); });
    });
    d.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        var f = [].filter.call(box.querySelectorAll("button,input,a[href]"), function (x) { return x.offsetParent !== null; });
        if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  function daysLeft() { var end = new Date(2027, 0, 31, 23, 59).getTime(); return Math.max(0, Math.ceil((end - Date.now()) / 864e5)); }
  function countUp() {
    var n = box.querySelector(".rec__num"), t0 = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { n.textContent = "-15"; return; }
    (function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 900), e = 1 - Math.pow(1 - k, 3); n.textContent = "-" + Math.round(15 * e); if (k < 1) requestAnimationFrame(step); })(performance.now());
  }
  function open(auto) {
    if (!box) build();
    if (auto === true && window.alderoStat) alderoStat("promo");
    var dl = daysLeft(), dd = box.querySelector("[data-days]"); dd.textContent = dl ? "Solo quedan " + dl + " días" : ""; dd.hidden = !dl;
    setTimeout(countUp, 350);
    lastFocus = d.activeElement; st.opened = Date.now(); st.seen = Date.now(); save();
    show(st.code ? "mine" : "code");
    box.hidden = false; root.classList.add("rec-open");
    requestAnimationFrame(function () { box.classList.add("is-in"); });
    setTimeout(function () { var x = box.querySelector(".rec__x"); if (x) x.focus({ preventScroll: true }); }, 400);
  }
  function close() {
    if (!box || box.hidden) return;
    box.classList.remove("is-in"); root.classList.remove("rec-open");
    setTimeout(function () { box.hidden = true; }, 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    updatePill(); pill.dataset.force = "1"; pill.classList.add("is-shown");
  }
  function updatePill() {
    if (!pill) {
      pill = d.createElement("button"); pill.type = "button"; pill.className = "rec-pill";
      pill.addEventListener("click", open); d.body.appendChild(pill);
    }
    pill.innerHTML = st.code ? '<i aria-hidden="true">🎁</i><span>Tu código</span>' : '<i aria-hidden="true">🎁</i><span>Gana un 15 %</span>';
    pill.setAttribute("aria-label", st.code ? "Ver tu código de recomendación" : "Recomienda Aldero y gana un 15 % de descuento");
    requestAnimationFrame(function () { pill.classList.add("is-in"); });
    if (!pill.dataset.wired) {
      pill.dataset.wired = "1";
      var chk = function () { pill.classList.toggle("is-shown", (window.scrollY || 0) > 350 || !!pill.dataset.force); };
      addEventListener("scroll", chk, { passive: true }); chk();
    }
  }
  var start = Date.now(), recent = st.seen && Date.now() - st.seen < DAYS * 864e5;
  if (recent || st.sent || st.code) {
    var ready = function () { setTimeout(updatePill, 600); };
    if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", ready); else ready();
    return;
  }
  (function wait() {
    var blocked = root.classList.contains("ck-open") || root.classList.contains("menu-open");
    var max = Math.max(1, root.scrollHeight - innerHeight), half = (window.scrollY || 0) / max > 0.45;
    if ((Date.now() - start < DELAY && !half) || blocked) return setTimeout(wait, 700);
    if (recent || st.sent) updatePill(); else open(true);
  })();
  window.AlderoRecomienda = { open: open };
})();

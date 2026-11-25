/* Ventana "Recomienda y ganáis los dos" — aldero.es */
(function () {
  "use strict";
  var KEY = "aldero-recomienda", DAYS = 14, DELAY = 5000;
  var d = document, root = d.documentElement;
  try {
    var st = JSON.parse(localStorage.getItem(KEY) || "null");
    if (st && (st.sent || Date.now() - st.t < DAYS * 864e5)) return;
  } catch (e) {}
  if (/[?&]norecomienda/.test(location.search)) return;
  function save(sent) { try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), sent: !!sent })); } catch (e) {} }

  var WA = "https://wa.me/34711553395?text=" + encodeURIComponent("Hola, vengo de la web de Aldero Marketing y quiero recomendaros un negocio para la promoción «Recomienda y ganáis los dos».");
  var html =
    '<div class="rec__bg" data-rec-close></div>' +
    '<div class="rec__card" role="dialog" aria-modal="true" aria-labelledby="recTitle">' +
      '<button class="rec__x" type="button" data-rec-close aria-label="Cerrar">×</button>' +
      '<div class="rec__badge" aria-hidden="true"><b>-10<small>%</small></b><span>para los dos</span></div>' +
      '<div class="rec__body">' +
        '<h2 id="recTitle" class="rec__title">Recomienda un negocio<br>y <em>ganáis los dos.</em></h2>' +
        '<p class="rec__lead">¿Conoces a alguien que necesite web? Preséntanoslo y, si contrata con Aldero, <b>tú y él os lleváis un 10 % de descuento</b> en vuestra web.</p>' +
        '<form class="rec__form" id="recForm" action="/api/contacto" method="post" novalidate>' +
          '<div class="rec__row">' +
            '<label class="rec__f"><span>Tu nombre</span><input name="nombre" required maxlength="80" autocomplete="name"></label>' +
            '<label class="rec__f"><span>Tu WhatsApp o email</span><input name="contacto" required maxlength="120" autocomplete="tel"></label>' +
          '</div>' +
          '<label class="rec__f"><span>Negocio que nos recomiendas</span><input name="negocio" required maxlength="120" placeholder="Ej.: Peluquería Ana, Málaga"></label>' +
          '<label class="rec__f"><span>Su teléfono o web <i>(opcional)</i></span><input name="negocio_contacto" maxlength="120"></label>' +
          '<input type="hidden" name="mensaje"><input type="hidden" name="servicio" value="Recomendación (−10 % los dos)">' +
          '<input type="hidden" name="pagina" value="Ventana Recomienda y ganáis los dos"><input type="hidden" name="t">' +
          '<label class="rec__hp" aria-hidden="true">No rellenes esto<input name="web" tabindex="-1" autocomplete="off"></label>' +
          '<label class="rec__ok"><input type="checkbox" name="acepto" value="1" required><span>Acepto la <a href="privacidad">política de privacidad</a>.</span></label>' +
          '<button class="btn btn--blue rec__send" type="submit">Quiero el descuento</button>' +
          '<p class="rec__msg" role="status" aria-live="polite"></p>' +
        '</form>' +
        '<div class="rec__done" hidden>' +
          '<p class="rec__title rec__title--sm">¡Recibido! <em>Gracias.</em></p>' +
          '<p class="rec__lead">Contactaremos con el negocio de tu parte. Cuando contrate, os aplicamos el 10 % a los dos. Tu código:</p>' +
          '<p class="rec__code">ALDERO-AMIGO</p>' +
          '<button class="btn btn--blue" type="button" data-rec-close>Seguir viendo la web</button>' +
        '</div>' +
        '<p class="rec__alt">¿Prefieres contarlo por WhatsApp? <a href="' + WA + '" target="_blank" rel="noopener">Escríbenos aquí</a></p>' +
        '<p class="rec__legal">Válido hasta el 31 de enero de 2027. El descuento se aplica sobre el presupuesto de diseño web cuando el negocio recomendado lo contrata. No acumulable con otras ofertas.</p>' +
      '</div>' +
    '</div>';

  var box, lastFocus;
  function build() {
    box = d.createElement("div"); box.className = "rec"; box.hidden = true; box.innerHTML = html; d.body.appendChild(box);
    box.addEventListener("click", function (e) { if (e.target.closest("[data-rec-close]")) close(); });
    var form = box.querySelector("#recForm"), msg = box.querySelector(".rec__msg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = [].filter.call(form.querySelectorAll("[required]"), function (i) { return i.type === "checkbox" ? !i.checked : !i.value.trim(); });
      form.querySelectorAll(".is-bad").forEach(function (x) { x.classList.remove("is-bad"); });
      if (bad.length) { bad.forEach(function (i) { i.closest("label").classList.add("is-bad"); }); msg.textContent = "Rellena los campos marcados."; bad[0].focus(); return; }
      form.mensaje.value = "RECOMENDACIÓN (promo −10 % para los dos)\nNegocio recomendado: " + form.negocio.value + "\nContacto del negocio: " + (form.negocio_contacto.value || "no indicado") + "\nRecomienda: " + form.nombre.value + " (" + form.contacto.value + ")";
      var btn = form.querySelector(".rec__send"); btn.disabled = true; btn.textContent = "Enviando…"; msg.textContent = "";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
        .then(function (j) {
          if (j && j.ok) { save(true); form.hidden = true; box.querySelector(".rec__done").hidden = false; box.querySelector(".rec__alt").hidden = true; }
          else { msg.textContent = (j && j.msg) || "No se ha podido enviar. Prueba por WhatsApp."; btn.disabled = false; btn.textContent = "Quiero el descuento"; }
        })
        .catch(function () { msg.textContent = "No se ha podido enviar. Prueba por WhatsApp."; btn.disabled = false; btn.textContent = "Quiero el descuento"; });
    });
    d.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        var f = [].filter.call(box.querySelectorAll("button,input,a[href]"), function (x) { return x.offsetParent !== null && !x.closest(".rec__hp"); });
        if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  function open() {
    if (!box) build();
    lastFocus = d.activeElement;
    box.querySelector('input[name="t"]').value = Date.now();
    box.hidden = false; root.classList.add("rec-open");
    requestAnimationFrame(function () { box.classList.add("is-in"); });
    setTimeout(function () { var x = box.querySelector(".rec__x"); if (x) x.focus({ preventScroll: true }); }, 400);
    save(false);
  }
  function close() {
    if (!box || box.hidden) return;
    box.classList.remove("is-in"); root.classList.remove("rec-open");
    setTimeout(function () { box.hidden = true; }, 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  var start = Date.now();
  (function wait() {
    var cookiesOpen = root.classList.contains("ck-open") || root.classList.contains("menu-open");
    if (Date.now() - start >= DELAY && !cookiesOpen && !d.querySelector("dialog[open]")) open();
    else setTimeout(wait, 700);
  })();
  window.AlderoRecomienda = { open: open };
})();

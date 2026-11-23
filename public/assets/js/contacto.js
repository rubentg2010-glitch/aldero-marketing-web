/* Formulario de contacto: envío sin recargar la página a /api/contacto (Worker). */
(function () {
  "use strict";
  var forms = document.querySelectorAll("[data-contact-form]");
  if (!forms.length) return;

  var params = new URLSearchParams(location.search);

  forms.forEach(function (form) {
    var status = form.querySelector("[data-contact-status]");
    var btn = form.querySelector("button[type=submit]");
    var t = form.querySelector('input[name="t"]');
    if (t) t.value = String(Date.now());

    function show(msg, kind) {
      status.textContent = msg;
      status.className = "cform__status" + (kind ? " is-" + kind : "");
    }

    // Vuelta del envío sin JavaScript (redirección del Worker)
    if (params.has("enviado")) show("¡Mensaje enviado! Te respondemos lo antes posible.", "ok");
    else if (params.has("error")) show("No se ha podido enviar. Escríbenos por WhatsApp o a hola@aldero.es.", "err");

    form.addEventListener("submit", function (e) {
      if (!window.fetch || !window.FormData) return;
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      btn.disabled = true;
      form.classList.add("is-sending");
      show("Enviando…");
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (t) t.value = String(Date.now());
            show("¡Mensaje enviado! Te respondemos lo antes posible.", "ok");
          } else {
            show(res.msg || "No se ha podido enviar. Escríbenos por WhatsApp o a hola@aldero.es.", "err");
          }
        })
        .catch(function () { show("No se ha podido enviar. Escríbenos por WhatsApp o a hola@aldero.es.", "err"); })
        .then(function () { btn.disabled = false; form.classList.remove("is-sending"); });
    });
  });
})();

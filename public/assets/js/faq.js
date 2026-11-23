/* Preguntas frecuentes: apertura y cierre animados (una abierta cada vez) */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll("details.faq__item"));
  if (!items.length) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var EASE = "cubic-bezier(.22, 1, .36, 1)";

  items.forEach(function (d) {
    var summary = d.querySelector("summary");
    // Envuelve la respuesta para poder animar su altura
    var body = document.createElement("div");
    body.className = "faq__body";
    var inner = document.createElement("div");
    inner.className = "faq__inner";
    while (summary.nextSibling) inner.appendChild(summary.nextSibling);
    body.appendChild(inner);
    d.appendChild(body);
    d._anim = null;

    summary.addEventListener("click", function (e) {
      if (reduce || !body.animate) return; // comportamiento nativo
      e.preventDefault();
      if (d.open && !d.classList.contains("is-closing")) close(d); else open(d);
    });
  });

  function open(d) {
    items.forEach(function (o) { if (o !== d && o.open) close(o); });
    var body = d.querySelector(".faq__body"), inner = d.querySelector(".faq__inner");
    if (d._anim) d._anim.cancel();
    var start = d.classList.contains("is-closing") ? body.offsetHeight : 0;
    d.classList.remove("is-closing");
    d.open = true;
    d.classList.add("is-open");
    var end = body.scrollHeight;
    d._anim = body.animate([{ height: start + "px" }, { height: end + "px" }], { duration: 560, easing: EASE });
    inner.animate([
      { opacity: 0, transform: "translateY(14px)", filter: "blur(6px)" },
      { opacity: 1, transform: "translateY(0)", filter: "blur(0)" }
    ], { duration: 620, delay: 90, easing: EASE, fill: "backwards" });
    d._anim.onfinish = function () { d._anim = null; body.style.height = ""; };
  }

  function close(d) {
    var body = d.querySelector(".faq__body"), inner = d.querySelector(".faq__inner");
    if (d._anim) d._anim.cancel();
    d.classList.add("is-closing");
    d.classList.remove("is-open");
    var start = body.offsetHeight;
    inner.animate([{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-8px)" }], { duration: 260, easing: "ease-in", fill: "forwards" })
      .onfinish = function (ev) { ev.target.cancel(); };
    d._anim = body.animate([{ height: start + "px" }, { height: "0px" }], { duration: 420, easing: EASE });
    d._anim.onfinish = function () {
      d._anim = null;
      d.open = false;
      d.classList.remove("is-closing");
    };
  }
})();

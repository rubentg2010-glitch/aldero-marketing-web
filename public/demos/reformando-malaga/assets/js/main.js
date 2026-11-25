(function () {
  "use strict";
  window.__rmOK = true;
  var d = document, h = d.documentElement, $ = function (s, c) { return (c || d).querySelector(s); }, $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasG = typeof window.gsap !== "undefined";
  var IMG = "https://reformandomalaga.com/wp-content/uploads/2026/10/";
  var TEL = "600 72 04 87", MAIL = "reformandomalaga@gmail.com";
  var y = $("#y"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (hasG && window.ScrollTrigger) { lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(); }
  }
  function goTo(target) {
    var el = typeof target === "string" ? $(target) : target; if (!el) return;
    var off = -(parseInt(getComputedStyle(h).getPropertyValue("--nav")) || 70);
    if (lenis) lenis.scrollTo(el, { offset: off }); else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + off, behavior: reduce ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); if (id.length < 2) return;
      var t = $(id); if (!t) return; e.preventDefault(); closeDrawer(); goTo(t);
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  /* ---------- Nav ---------- */
  var nav = $("#nav"), last = 0, prog = $("#progress"), fab = $(".fab");
  function onScroll() {
    var sy = window.scrollY || 0;
    nav.classList.toggle("is-solid", sy > 30);
    nav.classList.toggle("is-hidden", sy > 400 && sy > last && !d.body.classList.contains("menu-open"));
    last = sy;
    var max = d.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = "scaleX(" + (max > 0 ? sy / max : 0) + ")";
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var secs = ["inicio", "servicios", "proyectos", "nosotros", "opiniones", "contacto"].map(function (i) { return $("#" + i); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { $$(".menu a").forEach(function (a) { a.classList.toggle("is-on", a.getAttribute("href") === "#" + e.target.id); }); } });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { if (s) io.observe(s); });
    var hideFab = new IntersectionObserver(function (es) { es.forEach(function (e) { fab.classList.toggle("is-off", e.isIntersecting); }); }, { threshold: .15 });
    hideFab.observe($("#contacto")); hideFab.observe($(".foot"));
    var coast = $(".coast");
    new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { coast.classList.add("is-in"); o.disconnect(); } }); }, { threshold: .3 }).observe(coast);
  }

  /* ---------- Drawer ---------- */
  var burger = $("#burger"), drawer = $("#drawer");
  function closeDrawer() { if (drawer.hidden) return; drawer.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Abrir menú"); d.body.classList.remove("menu-open"); if (lenis) lenis.start(); }
  burger.addEventListener("click", function () {
    var open = drawer.hidden; drawer.hidden = !open;
    burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    d.body.classList.toggle("menu-open", open);
    if (open) { if (lenis) lenis.stop(); if (hasG && !reduce) gsap.from($$("#drawer nav a"), { y: 30, opacity: 0, stagger: .05, duration: .5, ease: "power3.out" }); }
    else if (lenis) lenis.start();
  });
  addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDrawer(); closeLb(); } });

  /* ---------- Intro + hero ---------- */
  var intro = $("#intro");
  function heroIn(delay) {
    var els = { lines: $$(".hero__title .ln>span"), arch: $(".arch"), img: $(".arch img"), soft: $$(".hero__tag,.hero__sub,.hero__ctas,.hero__proof"), extra: $$(".hero__cap,.hero__badge") };
    if (!hasG || reduce) { h.classList.remove("js"); return; }
    var tl = gsap.timeline({ delay: delay || 0, defaults: { ease: "power4.out" } });
    tl.fromTo(els.arch, { clipPath: "inset(100% 0% 0% 0% round 999px 999px 6px 6px)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 6px 6px)", duration: 1.3, ease: "expo.inOut" }, 0)
      .to(els.img, { scale: 1, duration: 1.8, ease: "power3.out" }, .1)
      .fromTo(els.lines, { y: 0, yPercent: 112 }, { y: 0, yPercent: 0, duration: 1.05, stagger: .09 }, .15)
      .to(els.soft, { opacity: 1, duration: .8, stagger: .08 }, .55)
      .from(els.soft, { y: 16, duration: .8, stagger: .08 }, .55)
      .to(els.extra, { opacity: 1, duration: .7, stagger: .12 }, .9)
      .from(els.extra, { y: 20, duration: .7, stagger: .12 }, .9);
  }
  function endIntro(fast) {
    try { sessionStorage.setItem("rm-intro", "1"); } catch (e) {}
    if (!intro || intro.classList.contains("done")) return;
    if (!hasG || fast) { intro.classList.add("done"); heroIn(0); return; }
    gsap.fromTo(intro, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)", duration: .75, ease: "expo.inOut", onComplete: function () { intro.classList.add("done"); } });
    heroIn(.3);
  }
  if (h.classList.contains("no-intro") || !hasG || reduce) { if (intro) intro.classList.add("done"); heroIn(.1); }
  else {
    gsap.set(".hero__title .ln>span", { yPercent: 112 });
    var tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: function () { endIntro(false); } });
    tl.from(".intro__name span", { yPercent: 60, opacity: 0, duration: .8, stagger: .12 })
      .to(".intro__line", { scaleX: 1, duration: .8, ease: "expo.inOut" }, .35)
      .from(".intro__msg", { opacity: 0, y: 10, duration: .6 }, .8)
      .to({}, { duration: .45 });
    $("#introSkip").addEventListener("click", function () { tl.kill(); endIntro(false); });
  }

  /* ---------- Reveals ---------- */
  if (hasG && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    $$(".reveal-t").forEach(function (el) { gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }); });
    ScrollTrigger.batch(".reveal", { start: "top 90%", onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1, stagger: .1, ease: "power3.out" }); } });
    $$(".pic").forEach(function (p, i) {
      gsap.fromTo(p, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: p, start: "top 85%" } });
      gsap.fromTo(p.querySelector("img"), { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.to(".intro2__deco", { xPercent: 18, ease: "none", scrollTrigger: { trigger: ".intro2", start: "top bottom", end: "bottom top", scrub: true } });
  } else { $$(".reveal,.reveal-t").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; }); }

  /* ---------- Gallery ---------- */
  var G = [
    ["reforma-de-banos-en-malaga", "ducha", "Mampara de cuadrícula negra y porcelánico efecto mármol", 1],
    ["banos-reformas-malaga", "integral", "Mueble de madera, lavabo sobre encimera y ducha", 0],
    ["malaga-reformas-de-banos", "detalle", "Lavabo de piedra y espejo con luz LED", 1],
    ["cambio-banera-por-ducha-malaga", "ducha", "Cambio de bañera por plato de ducha extraplano", 0],
    ["reformando-malaga", "integral", "Espejo redondo retroiluminado y azulejo verde", 1],
    ["platos-de-ducha-malaga", "ducha", "Mampara corredera de perfil negro", 0],
    ["reforma-bano-malaga", "detalle", "Azulejo hidráulico en la zona de ducha", 1],
    ["banos-malaga", "integral", "Ducha con mampara y mueble suspendido", 0],
    ["cambio-banera-por-plato-de-ducha-en-malaga", "ducha", "Plato de ducha con grifería negra", 1],
    ["duchas-costa-del-sol", "detalle", "Mueble de madera y espejo retroiluminado", 0],
    ["reforma-de-banos-costa-del-sol", "integral", "Ducha de obra con azulejo verde", 1],
    ["malaga-reforma-banos", "ducha", "Ducha con mampara y grifería negra", 0],
    ["duchas-malaga", "integral", "Baño renovado con lavabo sobre encimera", 1],
    ["platos-ducha-costa-del-sol", "ducha", "Ducha con mampara de cristal y mueble de madera", 0]
  ];
  var TAG = { ducha: "Cambio a ducha", integral: "Baño completo", detalle: "Detalles" };
  var gal = $("#gallery");
  G.forEach(function (g, i) {
    var b = d.createElement("button"); b.type = "button"; b.className = "g-item " + (g[3] ? "g-item--tall" : "g-item--short"); b.dataset.cat = g[1]; b.dataset.i = i;
    b.setAttribute("aria-label", "Ampliar foto: " + g[2]);
    b.innerHTML = '<img loading="lazy" decoding="async" src="' + IMG + g[0] + '.webp" alt="' + g[2] + '" width="600" height="800"><span class="g-tag">' + TAG[g[1]] + "</span>";
    gal.appendChild(b);
  });
  var visible = G.map(function (_, i) { return i; });
  $$(".filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      $$(".filters button").forEach(function (x) { x.classList.toggle("is-on", x === btn); });
      var f = btn.dataset.f; visible = [];
      $$(".g-item").forEach(function (it) { var on = f === "todos" || it.dataset.cat === f; it.classList.toggle("is-out", !on); if (on) visible.push(+it.dataset.i); });
      if (hasG && !reduce) gsap.fromTo(".g-item:not(.is-out)", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, stagger: .04, ease: "power3.out" });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });
  var lb = $("#lb"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), cur = 0, lastFocus = null;
  function showLb(i) { cur = i; var g = G[i]; lbImg.src = IMG + g[0] + ".webp"; lbImg.alt = g[2]; lbCap.textContent = g[2] + " · " + TAG[g[1]]; }
  function openLb(i) { lastFocus = d.activeElement; showLb(i); lb.hidden = false; if (lenis) lenis.stop(); $("#lbX").focus(); }
  function closeLb() { if (lb.hidden) return; lb.hidden = true; if (lenis) lenis.start(); if (lastFocus) lastFocus.focus(); }
  function step(n) { var k = visible.indexOf(cur); k = (k + n + visible.length) % visible.length; showLb(visible[k]); }
  gal.addEventListener("click", function (e) { var it = e.target.closest(".g-item"); if (it) openLb(+it.dataset.i); });
  $("#lbX").addEventListener("click", closeLb); $("#lbP").addEventListener("click", function () { step(-1); }); $("#lbN").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  addEventListener("keydown", function (e) { if (lb.hidden) return; if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });

  /* ---------- Configurador ---------- */
  var st = { pared: "marmol", plato: "blanco", mampara: "fija", grif: "negro" };
  var NAMES = {
    pared: { marmol: "pared efecto mármol", verde: "azulejo verde", arena: "porcelánico arena", antracita: "porcelánico antracita" },
    plato: { blanco: "plato blanco", crema: "plato crema", gris: "plato gris", negro: "plato negro" },
    mampara: { fija: "mampara fija", corredera: "mampara corredera", abatible: "mampara abatible" },
    grif: { negro: "grifería en negro mate", cromo: "grifería cromada", oro: "grifería en oro cepillado" }
  };
  var SHORT = { marmol: "Mármol", verde: "Verde", arena: "Arena", antracita: "Antracita", blanco: "Blanco", crema: "Crema", gris: "Gris", fija: "Fija", corredera: "Corredera", abatible: "Abatible", negro: "Negro mate", cromo: "Cromo", oro: "Oro" };
  var PAT = { marmol: "pMarmol", verde: "pVerde", arena: "pArena", antracita: "pAntracita" };
  var PLATO = { blanco: "#F6F5F1", crema: "#E3D8C4", gris: "#9A9A94", negro: "#2A2B2A" };
  var METAL = { negro: "#1F1F1F", cromo: "#B9BEC2", oro: "#B59A75" };
  var NS = "http://www.w3.org/2000/svg";
  function el(tag, at) { var e = d.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); return e; }
  function drawScreen() {
    var g = $("#screen"), m = METAL[st.grif]; while (g.firstChild) g.removeChild(g.firstChild);
    var glass = { fill: "url(#glass)", stroke: "rgba(255,255,255,.55)", "stroke-width": "1" };
    if (st.mampara === "fija") {
      g.appendChild(el("rect", Object.assign({ x: 178, y: 40, width: 158, height: 348 }, glass)));
      g.appendChild(el("rect", { x: 176, y: 40, width: 4, height: 348, fill: m }));
      g.appendChild(el("rect", { x: 178, y: 46, width: 222, height: 4, fill: m }));
      g.appendChild(el("path", { d: "M200 70l40 60M210 70l30 45", stroke: "rgba(255,255,255,.35)", "stroke-width": "2" }));
    } else if (st.mampara === "corredera") {
      g.appendChild(el("rect", { x: 40, y: 34, width: 300, height: 7, fill: m }));
      g.appendChild(el("rect", Object.assign({ x: 44, y: 41, width: 154, height: 345 }, glass)));
      g.appendChild(el("rect", Object.assign({ x: 182, y: 41, width: 154, height: 345 }, glass)));
      g.appendChild(el("rect", { x: 182, y: 41, width: 3, height: 345, fill: m }));
      g.appendChild(el("rect", { x: 195, y: 41, width: 3, height: 345, fill: m }));
      g.appendChild(el("rect", { x: 188, y: 190, width: 4, height: 50, rx: 2, fill: m }));
      g.appendChild(el("rect", { x: 40, y: 384, width: 300, height: 4, fill: m }));
      g.appendChild(el("path", { d: "M60 70l40 60M260 70l40 60", stroke: "rgba(255,255,255,.35)", "stroke-width": "2" }));
    } else {
      g.appendChild(el("rect", Object.assign({ x: 180, y: 40, width: 156, height: 346 }, glass)));
      g.appendChild(el("rect", { x: 333, y: 40, width: 3, height: 346, fill: m }));
      g.appendChild(el("rect", { x: 174, y: 90, width: 12, height: 22, rx: 2, fill: m }));
      g.appendChild(el("rect", { x: 174, y: 316, width: 12, height: 22, rx: 2, fill: m }));
      g.appendChild(el("rect", { x: 196, y: 190, width: 5, height: 60, rx: 2.5, fill: m }));
      g.appendChild(el("path", { d: "M210 70l40 60", stroke: "rgba(255,255,255,.35)", "stroke-width": "2" }));
    }
  }
  function sumText() { return NAMES.pared[st.pared] + ", " + NAMES.plato[st.plato] + ", " + NAMES.mampara[st.mampara] + " y " + NAMES.grif[st.grif]; }
  function renderConf() {
    $("#wall").setAttribute("fill", "url(#" + PAT[st.pared] + ")");
    $("#plato").setAttribute("fill", PLATO[st.plato]);
    $$("#shower .metal rect").forEach(function (r) { r.setAttribute("fill", METAL[st.grif]); });
    drawScreen();
    var s = sumText(); $("#confSum").textContent = s.charAt(0).toUpperCase() + s.slice(1) + ".";
    $("#confTag").textContent = [SHORT[st.pared], SHORT[st.plato], SHORT[st.mampara], SHORT[st.grif]].join(" · ");
  }
  $$("#opts [data-k]").forEach(function (grp) {
    grp.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      st[grp.dataset.k] = b.dataset.v;
      $$("button", grp).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      renderConf();
      if (hasG && !reduce) gsap.fromTo("#shower", { scale: .985 }, { scale: 1, duration: .5, ease: "power3.out", transformOrigin: "50% 100%" });
    });
  });
  renderConf();

  /* ---------- Form prefill ---------- */
  var form = $("#form");
  function setTipo(t) { var s = form.tipo; for (var i = 0; i < s.options.length; i++) if (s.options[i].text === t) s.selectedIndex = i; }
  $$("[data-tipo]").forEach(function (a) { a.addEventListener("click", function () { setTipo(a.dataset.tipo); }); });
  $("#confSend").addEventListener("click", function () {
    setTipo("Ducha y mampara");
    var s = sumText(); form.mensaje.value = "Me gustaría una ducha con " + s + ".";
    form.mensaje.dispatchEvent(new Event("input"));
  });

  /* ---------- Reviews carousel ---------- */
  var track = $("#rvTrack"), cards = $$(".rv__card"), idx = 0;
  function perView() { return innerWidth <= 820 ? 1 : innerWidth <= 1024 ? 2 : 3; }
  function maxIdx() { return Math.max(0, cards.length - perView()); }
  function rvGo(i) {
    idx = Math.max(0, Math.min(maxIdx(), i));
    var w = cards[0].getBoundingClientRect().width + 20;
    track.style.transform = "translateX(" + (-idx * w) + "px)";
    $("#rvCount").textContent = (idx + 1) + " / " + (maxIdx() + 1);
  }
  $("#rvPrev").addEventListener("click", function () { rvGo(idx - 1); });
  $("#rvNext").addEventListener("click", function () { rvGo(idx >= maxIdx() ? 0 : idx + 1); });
  addEventListener("resize", function () { rvGo(idx); });
  var sx = null; track.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) rvGo(idx + (dx < 0 ? 1 : -1)); sx = null; });
  rvGo(0);

  /* ---------- Form ---------- */
  function check(f) {
    var ok = true;
    $$(".fl, .check", form).forEach(function (w) { w.classList.remove("is-bad"); });
    [["nombre", function (v) { return v.trim().length > 1; }], ["telefono", function (v) { return /^[0-9 +]{9,15}$/.test(v.trim()); }], ["localidad", function (v) { return v.trim().length > 1; }], ["tipo", function (v) { return !!v; }]].forEach(function (r) {
      if (!r[1](f[r[0]].value)) { f[r[0]].closest(".fl").classList.add("is-bad"); ok = false; }
    });
    if (f.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value)) { f.email.closest(".fl").classList.add("is-bad"); ok = false; }
    if (!f.privacidad.checked) { f.privacidad.closest(".check").classList.add("is-bad"); ok = false; }
    return ok;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault(); var f = form, msg = $("#formMsg");
    if (!check(f)) { msg.textContent = "Revisa los campos marcados."; var bad = $(".is-bad input, .is-bad select", form); if (bad) bad.focus(); return; }
    var body = ["Nombre: " + f.nombre.value, "Teléfono: " + f.telefono.value, f.email.value ? "Correo: " + f.email.value : "", "Localidad: " + f.localidad.value, "Tipo de reforma: " + f.tipo.value, "", f.mensaje.value].filter(function (x, i) { return x || i === 5; }).join("\n");
    var subj = "Solicitud de presupuesto · " + f.tipo.value + " · " + f.localidad.value;
    location.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
    msg.textContent = "Se ha abierto tu correo con la solicitud lista para enviar. Si lo prefieres, llámanos al " + TEL + ".";
  });
  $$("input, select", form).forEach(function (i) { i.addEventListener("input", function () { var w = i.closest(".fl, .check"); if (w) w.classList.remove("is-bad"); }); i.addEventListener("change", function () { var w = i.closest(".fl, .check"); if (w) w.classList.remove("is-bad"); }); });
})();

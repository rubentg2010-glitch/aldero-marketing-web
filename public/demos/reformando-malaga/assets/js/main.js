(function () {
  "use strict";
  window.__rmOK = true;
  var d = document, h = d.documentElement;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var G = window.gsap, ST = window.ScrollTrigger, hasG = !!(G && ST);
  var REAL = "https://reformandomalaga.com/wp-content/uploads/2026/10/";
  var U = function (id, w, q) { return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=" + w + "&q=" + (q || 75); };
  var MAIL = "reformandomalaga@gmail.com", TEL = "600 72 04 87";
  var y = $("#y"); if (y) y.textContent = new Date().getFullYear();
  if (hasG) G.registerPlugin(ST);

  /* ---------------- Smooth scroll ---------------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    if (hasG) { lenis.on("scroll", ST.update); G.ticker.add(function (t) { lenis.raf(t * 1000); }); G.ticker.lagSmoothing(0); }
    else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
  }
  function lock(on) { if (lenis) { on ? lenis.stop() : lenis.start(); } d.body.style.overflow = on ? "hidden" : ""; }
  function goTo(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -60, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 60, behavior: reduce ? "auto" : "smooth" });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); if (id.length < 2) return;
      var t = $(id); if (!t) return;
      e.preventDefault(); closeDrawer(); goTo(t);
    });
  });

  /* ---------------- Nav / progress / dock ---------------- */
  var nav = $("#nav"), prog = $("#progress"), dock = $("#dock"), hero = $(".hero"), last = 0;
  function onScroll() {
    var sy = window.scrollY || 0, hh = hero ? hero.offsetHeight - 90 : 300;
    nav.classList.toggle("is-solid", sy > hh);
    nav.classList.toggle("is-hidden", sy > hh + 200 && sy > last + 2);
    if (sy < last - 2) nav.classList.remove("is-hidden");
    last = sy;
    var max = h.scrollHeight - innerHeight;
    prog.style.transform = "scaleX(" + (max > 0 ? sy / max : 0) + ")";
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if ("IntersectionObserver" in window) {
    var ids = ["servicios", "disena", "proyectos", "nosotros", "opiniones", "contacto"];
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) $$(".menu a").forEach(function (a) { a.classList.toggle("is-on", a.getAttribute("href") === "#" + e.target.id); }); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach(function (i) { var el = $("#" + i); if (el) io.observe(el); });
    if (innerWidth > 820) {
      var off = new IntersectionObserver(function (es) { es.forEach(function (e) { dock.classList.toggle("is-off", e.isIntersecting); }); }, { threshold: .25 });
      off.observe($(".end"));
    }
  }

  /* ---------------- Drawer ---------------- */
  var burger = $("#burger"), drawer = $("#drawer");
  function closeDrawer() {
    if (drawer.hidden) return;
    drawer.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Abrir menú");
    d.body.classList.remove("menu-open"); lock(false);
  }
  burger.addEventListener("click", function () {
    if (!drawer.hidden) return closeDrawer();
    drawer.hidden = false; burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Cerrar menú");
    d.body.classList.add("menu-open"); lock(true);
    if (hasG && !reduce) {
      G.fromTo(drawer, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .7, ease: "expo.inOut" });
      G.fromTo($$("#drawer nav a"), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .05, duration: .7, delay: .25, ease: "power3.out" });
    }
  });

  /* ---------------- Intro + hero ---------------- */
  var intro = $("#intro");
  function heroIn(delay) {
    if (!hasG || reduce) return;
    var tl = G.timeline({ delay: delay || 0 });
    tl.fromTo(".hero__img", { scale: 1.18 }, { scale: 1.06, duration: 2.2, ease: "power3.out" }, 0)
      .fromTo(".hero__title .ln>span", { y: 0, yPercent: 110 }, { y: 0, yPercent: 0, duration: 1.1, stagger: .09, ease: "power4.out" }, .05)
      .fromTo(".hero__kicker", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8, ease: "power3.out" }, .25)
      .fromTo([".hero__sub", ".hero__ctas"], { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9, stagger: .1, ease: "power3.out" }, .5)
      .fromTo([".hero__rating", ".hero__coords", ".hero__scroll", ".hero__insp"], { opacity: 0 }, { opacity: 1, duration: 1, stagger: .08 }, .7);
  }
  function finishIntro() { try { sessionStorage.setItem("rm-intro", "1"); } catch (e) {} if (intro) intro.classList.add("done"); }
  if (!intro || h.classList.contains("no-intro") || !hasG || reduce) { finishIntro(); heroIn(.05); }
  else {
    G.set(".hero__title .ln>span", { y: 0, yPercent: 110 });
    G.set([".hero__kicker", ".hero__sub", ".hero__ctas", ".hero__rating", ".hero__coords", ".hero__scroll", ".hero__insp"], { opacity: 0 });
    var it = G.timeline({ onComplete: finishIntro });
    it.to(".intro__mark path", { strokeDashoffset: 0, duration: .6, ease: "power2.inOut", stagger: .1 })
      .to(".intro__name", { clipPath: "inset(0% 0% 0% 0%)", duration: .55, ease: "power3.out" }, .2)
      .to(".intro__id", { opacity: 0, duration: .3 }, .95)
      .to(".intro__bar--t", { yPercent: -100, duration: .8, ease: "expo.inOut" }, 1.0)
      .to(".intro__bar--b", { yPercent: 100, duration: .8, ease: "expo.inOut" }, 1.0)
      .add(function () { heroIn(0); }, 1.05);
    $("#introSkip").addEventListener("click", function () { it.progress(1); });
  }

  /* ---------------- Scroll animations ---------------- */
  if (hasG && !reduce) {
    G.to(".hero__img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    G.to(".hero__inner", { yPercent: -18, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    G.from(".mani__big .mw, .mani__big .pill", { yPercent: 70, opacity: 0, duration: 1.1, stagger: .06, ease: "power4.out", scrollTrigger: { trigger: ".mani__big", start: "top 80%" } });
    G.from(".mani__big .pill", { scaleX: 0, duration: 1.2, ease: "expo.out", stagger: .2, scrollTrigger: { trigger: ".mani__big", start: "top 75%" } });

    var rv = ".label, .h2, .mani__p, .mani__facts div, .srv-feat__txt > *, .srv-row, .det__list li, .det__data div, .rev__main, .rev__c, .rev__g, .zon__p, .zon__links li, .faq details, .end__sub, .end__btn, .end__contact a, .cfg__panel, .prj__note, .filters";
    $$(rv).forEach(function (el) { if (el.closest(".hero") || el.closest(".qp") || el.closest(".drawer")) return; el.classList.add("rv"); });
    ST.batch(".rv", { start: "top 88%", once: true, onEnter: function (b) { G.to(b, { opacity: 1, y: 0, duration: 1.1, stagger: .08, ease: "power3.out", overwrite: true }); } });

    $$(".srv-feat__img, .det__img").forEach(function (f) {
      G.fromTo(f, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", scrollTrigger: { trigger: f, start: "top 82%" } });
      var im = f.querySelector("img");
      G.fromTo(im, { yPercent: -8 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true } });
    });
    [".pano__img", ".end__img"].forEach(function (s) { G.fromTo(s, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: $(s).parentNode, start: "top bottom", end: "bottom top", scrub: true } }); });
    G.fromTo(".pano__img img", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".pano", start: "top bottom", end: "center center", scrub: true } });
    [".pano__txt", ".end__title"].forEach(function (s) {
      G.from(s + " .ln>span", { yPercent: 110, duration: 1.2, stagger: .1, ease: "power4.out", scrollTrigger: { trigger: s, start: "top 82%" } });
    });
    G.from(".foot__big", { yPercent: 40, opacity: 0, duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: ".foot", start: "top 85%" } });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (fine && !reduce && hasG) {
    $$(".mag").forEach(function (b) {
      var xTo = G.quickTo(b, "x", { duration: .5, ease: "power3" }), yTo = G.quickTo(b, "y", { duration: .5, ease: "power3" });
      b.addEventListener("mousemove", function (e) { var r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
      b.addEventListener("mouseleave", function () { xTo(0); yTo(0); });
    });
  }

  /* ---------------- Service hover image ---------------- */
  var cur = $("#cursor"), curImg = $("#cursorImg");
  if (fine && innerWidth > 1024 && hasG) {
    var cx = G.quickTo(cur, "left", { duration: .6, ease: "power3" }), cy = G.quickTo(cur, "top", { duration: .6, ease: "power3" });
    addEventListener("mousemove", function (e) { cx(e.clientX); cy(e.clientY); }, { passive: true });
    $$(".srv-row").forEach(function (r) {
      r.addEventListener("mouseenter", function () { curImg.src = r.dataset.img; cur.classList.add("on"); });
      r.addEventListener("mouseleave", function () { cur.classList.remove("on"); });
    });
  }

  /* ---------------- Gallery ---------------- */
  var GAL = [
    ["reforma-de-banos-en-malaga", "ducha", "Mampara de cuadrícula negra y porcelánico efecto mármol", "x"],
    ["banos-reformas-malaga", "integral", "Mueble de madera, lavabo sobre encimera y ducha", "t"],
    ["malaga-reformas-de-banos", "detalle", "Lavabo de piedra y espejo con luz LED", "s"],
    ["cambio-banera-por-ducha-malaga", "banera", "Bañera sustituida por plato de ducha extraplano", "w"],
    ["reformando-malaga", "integral", "Espejo redondo retroiluminado y azulejo verde", "t"],
    ["platos-de-ducha-malaga", "ducha", "Mampara corredera de perfil negro", "s"],
    ["reforma-bano-malaga", "detalle", "Azulejo hidráulico en la zona de ducha", "t"],
    ["cambio-banera-por-plato-de-ducha-en-malaga", "banera", "Plato de ducha con grifería negra", "w"],
    ["banos-malaga", "integral", "Ducha con mampara y mueble suspendido", "x"],
    ["duchas-costa-del-sol", "detalle", "Mueble de madera y espejo retroiluminado", "s"],
    ["reforma-de-banos-costa-del-sol", "ducha", "Ducha de obra con azulejo verde", "t"],
    ["malaga-reforma-banos", "banera", "Ducha con mampara y grifería negra", "s"],
    ["duchas-malaga", "integral", "Baño renovado con lavabo sobre encimera", "w"],
    ["platos-ducha-costa-del-sol", "ducha", "Ducha con mampara de cristal y mueble de madera", "t"]
  ];
  var CAT = { banera: "Cambio de bañera", integral: "Reforma integral", ducha: "Ducha moderna", detalle: "Detalle y acabado" };
  var gal = $("#gallery");
  GAL.forEach(function (g, i) {
    var b = d.createElement("button"); b.type = "button"; b.className = "g-item " + g[3]; b.dataset.cat = g[1]; b.dataset.i = i;
    b.setAttribute("aria-label", "Ampliar: " + g[2]);
    b.innerHTML = '<img decoding="async" src="' + REAL + g[0] + '.webp" alt="' + g[2] + '" width="600" height="800"><span class="g-cap"><span>' + g[2] + "</span><b>" + CAT[g[1]] + "</b></span>";
    gal.appendChild(b);
  });
  if (hasG && !reduce) {
    ST.batch(".g-item", { start: "top 92%", once: true, onEnter: function (b) {
      G.fromTo(b, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, stagger: .08, ease: "expo.inOut" });
      G.fromTo(b.map(function (x) { return x.querySelector("img"); }), { scale: 1.3 }, { scale: 1, duration: 1.6, stagger: .08, ease: "expo.out", clearProps: "transform" });
    } });
  }
  var visible = GAL.map(function (_, i) { return i; });
  $$(".filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      $$(".filters button").forEach(function (x) { var on = x === btn; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", String(on)); });
      var f = btn.dataset.f; visible = [];
      var show = function () {
        $$(".g-item").forEach(function (it) { var on = f === "todos" || it.dataset.cat === f; it.classList.toggle("is-out", !on); if (on) visible.push(+it.dataset.i); it.style.clipPath = ""; });
        if (hasG && !reduce) G.fromTo(".g-item:not(.is-out)", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8, stagger: .05, ease: "power3.out" });
        if (ST) ST.refresh();
      };
      if (hasG && !reduce) G.to(".g-item:not(.is-out)", { opacity: 0, y: -10, duration: .25, stagger: .015, onComplete: show }); else show();
    });
  });
  var lb = $("#lb"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbCount = $("#lbCount"), curI = 0, lastFocus = null;
  function showLb(i) {
    curI = i; var g = GAL[i];
    var k = visible.indexOf(i);
    lbCount.textContent = String(k + 1).padStart(2, "0") + " / " + String(visible.length).padStart(2, "0");
    lbCap.textContent = g[2] + " · " + CAT[g[1]];
    if (hasG && !reduce) { G.fromTo(lbImg, { opacity: 0, scale: .97 }, { opacity: 1, scale: 1, duration: .6, ease: "power3.out" }); }
    lbImg.src = REAL + g[0] + ".webp"; lbImg.alt = g[2];
  }
  function openLb(i) { lastFocus = d.activeElement; lb.hidden = false; showLb(i); lock(true); $("#lbX").focus(); }
  function closeLb() { if (lb.hidden) return; lb.hidden = true; lock(false); if (lastFocus) lastFocus.focus(); }
  function step(n) { var k = visible.indexOf(curI); k = (k + n + visible.length) % visible.length; showLb(visible[k]); }
  gal.addEventListener("click", function (e) { var it = e.target.closest(".g-item"); if (it) openLb(+it.dataset.i); });
  $("#lbX").addEventListener("click", closeLb); $("#lbP").addEventListener("click", function () { step(-1); }); $("#lbN").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  var tsx = null; lb.addEventListener("touchstart", function (e) { tsx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) { if (tsx === null) return; var dx = e.changedTouches[0].clientX - tsx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); tsx = null; });

  /* ---------------- Configurator ---------------- */
  var TEX = {
    marmol: ["photo-1566041510394-cf7c8fe21800", "Mármol blanco"],
    travertino: ["photo-1780253460324-9d49f88c74fc", "Travertino"],
    microcemento: ["photo-1787602525716-3c36be37d5fb", "Microcemento"],
    zellige: ["photo-1532901074349-dc9d1505589c", "Zellige verde"],
    nero: ["photo-1786673211400-90f79d15b1ff", "Mármol negro"],
    hidraulico: ["photo-1624963839265-55161fbef7fe", "Hidráulico"]
  };
  var PLATO = { blanco: ["#F4F2EC", "Blanco"], arena: ["#D8CBB4", "Arena"], piedra: ["#A8A49B", "Gris piedra"], antracita: ["#3D3F3D", "Antracita"], negro: ["#1E1F1E", "Negro"] };
  var METAL = { negro: ["#1B1B1B", "Negro mate"], cromo: ["#C2C7CA", "Cromo"], oro: ["#B8955F", "Oro cepillado"], gunmetal: ["#4B4D4E", "Gun metal"], blanco: ["#ECEBE6", "Blanco"] };
  var MAMP = { fija: "Fija · walk-in", corredera: "Corredera", abatible: "Abatible", industrial: "Cuadrícula industrial" };
  var GRIF = { empotrada: "Empotrada + rociador de techo", columna: "Columna termostática", barra: "Barra deslizante" };
  var st = { pared: "marmol", plato: "blanco", mampara: "fija", perfil: "negro", grif: "empotrada" };
  var NS = "http://www.w3.org/2000/svg", XL = "http://www.w3.org/1999/xlink";
  function el(tag, at, parent) { var e = d.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (parent) parent.appendChild(e); return e; }
  var layer = "A";
  function setTex(which, id) {
    var url = U(id, 900, 72);
    ["tex" + which + "img", "texS" + which + "img"].forEach(function (n) { var im = d.getElementById(n); im.setAttribute("href", url); im.setAttributeNS(XL, "href", url); });
  }
  function wall(first) {
    var id = TEX[st.pared][0];
    if (first) { setTex("A", id); return; }
    var next = layer === "A" ? "B" : "A";
    setTex(next, id);
    var pre = new Image(); pre.onload = pre.onerror = function () {
      $("#walls" + next).setAttribute("opacity", "1"); $("#walls" + next).style.opacity = 1;
      $("#walls" + layer).style.opacity = 0;
      layer = next;
    };
    pre.src = U(id, 900, 72);
  }
  function metal(x, y, w, hgt, rx, g) {
    var m = METAL[st.perfil][0];
    el("rect", { x: x, y: y, width: w, height: hgt, rx: rx || 0, fill: m }, g);
    el("rect", { x: x, y: y, width: w, height: hgt, rx: rx || 0, fill: "url(#gMetal)", opacity: st.perfil === "negro" ? .25 : .6 }, g);
  }
  function glass(x, y, w, hgt, g) {
    el("rect", { x: x, y: y, width: w, height: hgt, fill: "url(#gGlass)", stroke: "rgba(255,255,255,.32)", "stroke-width": 1 }, g);
    el("polygon", { points: (x + w * .12) + "," + y + " " + (x + w * .3) + "," + y + " " + (x + w * .05) + "," + (y + hgt * .5) + " " + x + "," + (y + hgt * .5) + " " + x + "," + (y + hgt * .32), fill: "#fff", opacity: .07 }, g);
    el("line", { x1: x + w * .62, y1: y + 30, x2: x + w * .92, y2: y + 160, stroke: "#fff", "stroke-opacity": .18, "stroke-width": 3 }, g);
  }
  function drawScreen() {
    var g = $("#screen"); while (g.firstChild) g.removeChild(g.firstChild);
    var T = 30, B = 812;
    if (st.mampara === "fija") {
      glass(330, T, 430, B - T, g);
      metal(326, T, 6, B - T, 0, g); metal(756, T, 8, B - T, 0, g);
      metal(332, 64, 468, 6, 3, g);
      metal(330, B - 6, 430, 6, 0, g);
    } else if (st.mampara === "corredera") {
      metal(36, T - 8, 728, 10, 2, g);
      glass(44, T + 2, 380, B - T - 6, g);
      glass(384, T + 2, 376, B - T - 6, g);
      metal(380, T + 2, 5, B - T - 6, 0, g); metal(420, T + 2, 5, B - T - 6, 0, g);
      metal(396, 380, 7, 110, 3.5, g);
      metal(36, B - 6, 728, 6, 0, g); metal(36, T - 8, 8, B - T + 8, 0, g); metal(756, T - 8, 8, B - T + 8, 0, g);
    } else if (st.mampara === "abatible") {
      glass(510, T, 250, B - T, g); metal(756, T, 8, B - T, 0, g);
      glass(250, T + 4, 256, B - T - 8, g);
      metal(500, 150, 16, 34, 3, g); metal(500, 640, 16, 34, 3, g);
      metal(264, 360, 7, 150, 3.5, g);
      metal(510, 64, 290, 6, 3, g);
    } else {
      glass(330, T, 430, B - T, g);
      var w = 9;
      metal(326, T, w, B - T, 0, g); metal(755, T, w, B - T, 0, g); metal(326, T, 438, w, 0, g); metal(326, B - w, 438, w, 0, g);
      metal(541, T, 7, B - T, 0, g);
      [250, 470, 640].forEach(function (yy) { metal(330, yy, 430, 7, 0, g); });
    }
  }
  function water(g, x, y, spread, len) {
    var w = el("g", { class: "water", opacity: .5 }, g);
    for (var i = -3; i <= 3; i++) el("line", { x1: x + i * spread / 7, y1: y, x2: x + i * spread / 4.2, y2: y + len, stroke: "#fff", "stroke-width": 1.2, "stroke-dasharray": "4 14", "stroke-linecap": "round" }, w);
  }
  function drawTaps() {
    var g = $("#taps"); while (g.firstChild) g.removeChild(g.firstChild);
    if (st.grif === "empotrada") {
      metal(462, 70, 6, 60, 0, g);
      el("ellipse", { cx: 465, cy: 134, rx: 78, ry: 11, fill: METAL[st.perfil][0] }, g);
      el("ellipse", { cx: 465, cy: 134, rx: 78, ry: 11, fill: "url(#gMetal)", opacity: .4 }, g);
      el("ellipse", { cx: 465, cy: 137, rx: 70, ry: 6, fill: "#000", opacity: .25 }, g);
      water(g, 465, 145, 130, 520);
      metal(444, 452, 48, 48, 4, g);
      el("circle", { cx: 468, cy: 476, r: 11, fill: "#000", opacity: .2 }, g);
      metal(466, 468, 26, 6, 3, g);
      metal(520, 470, 16, 16, 8, g);
    } else if (st.grif === "columna") {
      metal(590, 150, 7, 400, 3.5, g);
      metal(500, 150, 97, 7, 3.5, g);
      el("ellipse", { cx: 500, cy: 162, rx: 52, ry: 8, fill: METAL[st.perfil][0] }, g);
      el("ellipse", { cx: 500, cy: 162, rx: 52, ry: 8, fill: "url(#gMetal)", opacity: .4 }, g);
      water(g, 500, 170, 90, 480);
      metal(548, 540, 100, 22, 11, g);
      el("circle", { cx: 556, cy: 551, r: 14, fill: METAL[st.perfil][0], stroke: "#000", "stroke-opacity": .2 }, g);
      el("circle", { cx: 640, cy: 551, r: 14, fill: METAL[st.perfil][0], stroke: "#000", "stroke-opacity": .2 }, g);
      el("path", { d: "M600 562 C 610 640, 660 620, 650 520", fill: "none", stroke: "#2a2a2a", "stroke-width": 3, opacity: .6 }, g);
      metal(644, 470, 10, 54, 5, g);
    } else {
      metal(600, 260, 6, 300, 3, g);
      metal(596, 252, 14, 10, 3, g); metal(596, 556, 14, 10, 3, g);
      metal(606, 300, 16, 12, 3, g);
      el("ellipse", { cx: 628, cy: 296, rx: 12, ry: 20, fill: METAL[st.perfil][0], transform: "rotate(-24 628 296)" }, g);
      el("ellipse", { cx: 628, cy: 296, rx: 12, ry: 20, fill: "url(#gMetal)", opacity: .4, transform: "rotate(-24 628 296)" }, g);
      water(g, 620, 312, 50, 400);
      el("path", { d: "M622 312 C 650 420, 560 560, 590 610", fill: "none", stroke: "#2a2a2a", "stroke-width": 3, opacity: .55 }, g);
      metal(566, 600, 60, 22, 6, g);
      metal(586, 588, 24, 8, 4, g);
    }
  }
  function renderSum() {
    var rows = [["Revestimiento", TEX[st.pared][1]], ["Plato", PLATO[st.plato][1]], ["Mampara", MAMP[st.mampara]], ["Perfilería", METAL[st.perfil][1]], ["Grifería", GRIF[st.grif]]];
    $("#cfgSum").innerHTML = rows.map(function (r) { return "<li><span>" + r[0] + "</span>" + r[1] + "</li>"; }).join("");
    $("#cfgBadge").textContent = TEX[st.pared][1] + " · " + MAMP[st.mampara];
  }
  function designText() { return "Revestimiento " + TEX[st.pared][1].toLowerCase() + ", plato " + PLATO[st.plato][1].toLowerCase() + ", mampara " + MAMP[st.mampara].toLowerCase() + ", perfilería " + METAL[st.perfil][1].toLowerCase() + " y grifería " + GRIF[st.grif].toLowerCase() + "."; }
  function render(key) {
    if (!key || key === "pared") wall(!key);
    var pc = PLATO[st.plato][0]; $("#plato").setAttribute("fill", pc); $("#platoEdge").setAttribute("fill", pc);
    $(".drain").setAttribute("fill", METAL[st.perfil][0]);
    drawScreen(); drawTaps(); renderSum();
    if (key) { var v = $("#cfgView"); v.classList.remove("flash"); void v.offsetWidth; v.classList.add("flash"); }
  }
  $$("#cfgPanel [data-k]").forEach(function (grp) {
    grp.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      st[grp.dataset.k] = b.dataset.v;
      $$("button", grp).forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); });
      render(grp.dataset.k);
    });
  });
  var curStep = 0, stepBtns = $$(".cfg__steps button"), panes = $$(".cfg__pane");
  function goStep(i) {
    stepBtns[curStep].classList.add("done");
    curStep = i;
    stepBtns.forEach(function (b, k) { if (k === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
    panes.forEach(function (p, k) { p.classList.toggle("is-on", k === i); });
    $("#cfgNext").innerHTML = i === panes.length - 1 ? "Volver al inicio <i>↺</i>" : "Siguiente paso <i>→</i>";
    stepBtns[i].scrollIntoView({ block: "nearest", inline: "center" });
  }
  stepBtns.forEach(function (b, k) { b.addEventListener("click", function () { goStep(k); }); });
  $("#cfgNext").addEventListener("click", function () { goStep((curStep + 1) % panes.length); });
  Object.keys(TEX).forEach(function (k) { var im = new Image(); im.src = U(TEX[k][0], 900, 72); });
  render();

  /* ---------------- Quote panel ---------------- */
  var qp = $("#qp"), form = $("#form"), qpLast = null;
  function setTipo(t) { var s = form.tipo; for (var i = 0; i < s.options.length; i++) if (s.options[i].text === t) { s.selectedIndex = i; return; } }
  function openQuote(tipo, design) {
    qpLast = d.activeElement; closeDrawer();
    if (tipo) setTipo(tipo);
    var box = $("#qpDesign");
    if (design) { box.hidden = false; $("#qpDesignTxt").textContent = design; if (!form.mensaje.value) form.mensaje.value = "Me gustaría una ducha con este diseño: " + design; }
    else box.hidden = true;
    qp.hidden = false; lock(true); dock.classList.add("is-off");
    setTimeout(function () { form.nombre.focus(); }, 350);
  }
  function closeQuote() { if (qp.hidden) return; qp.hidden = true; lock(false); dock.classList.remove("is-off"); if (qpLast) qpLast.focus(); }
  $$(".js-quote").forEach(function (b) {
    b.addEventListener("click", function () { openQuote(b.dataset.tipo, b.id === "cfgQuote" ? designText() : null); });
  });
  $$("[data-close]", qp).forEach(function (x) { x.addEventListener("click", closeQuote); });
  addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeQuote(); closeLb(); closeDrawer(); }
    if (!lb.hidden) { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); }
    if (e.key === "Tab" && !qp.hidden) {
      var f = $$("button, input, select, textarea, a[href]", $(".qp__panel")).filter(function (x) { return x.offsetParent !== null; });
      if (e.shiftKey && d.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && d.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------------- Form ---------------- */
  function check() {
    var ok = true, f = form;
    $$(".fl, .check", f).forEach(function (w) { w.classList.remove("is-bad"); });
    [["nombre", function (v) { return v.trim().length > 1; }], ["telefono", function (v) { return /^(\+?34)?[6789]\d{8}$/.test(v.replace(/[\s.-]/g, "")); }], ["localidad", function (v) { return v.trim().length > 1; }], ["tipo", function (v) { return !!v; }]].forEach(function (r) {
      if (!r[1](f[r[0]].value)) { f[r[0]].closest(".fl").classList.add("is-bad"); ok = false; }
    });
    if (f.email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value)) { f.email.closest(".fl").classList.add("is-bad"); ok = false; }
    if (!f.privacidad.checked) { f.privacidad.closest(".check").classList.add("is-bad"); ok = false; }
    return ok;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault(); var f = form, msg = $("#formMsg");
    if (!check()) { msg.textContent = "Revisa los campos marcados."; var bad = $(".is-bad input, .is-bad select", f); if (bad) bad.focus(); return; }
    var lines = ["Nombre: " + f.nombre.value, "Teléfono: " + f.telefono.value];
    if (f.email.value) lines.push("Correo: " + f.email.value);
    lines.push("Localidad: " + f.localidad.value, "Tipo de reforma: " + f.tipo.value, "", f.mensaje.value);
    var subj = "Solicitud de presupuesto · " + f.tipo.value + " · " + f.localidad.value;
    location.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(lines.join("\n"));
    msg.textContent = "Se ha abierto tu correo con la solicitud lista para enviar. Si lo prefieres, llámanos al " + TEL + ".";
  });
  $$("input, select, textarea", form).forEach(function (i) {
    ["input", "change"].forEach(function (ev) { i.addEventListener(ev, function () { var w = i.closest(".fl, .check"); if (w) w.classList.remove("is-bad"); }); });
  });

  addEventListener("load", function () { if (ST) ST.refresh(); });
})();

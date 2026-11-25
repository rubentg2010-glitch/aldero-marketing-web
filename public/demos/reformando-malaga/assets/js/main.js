(function () {
  "use strict";
  window.__rmOK = true;
  var d = document, h = d.documentElement;
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var G = window.gsap, ST = window.ScrollTrigger, hasG = !!(G && ST);
  var REAL = "/api/obra/rm/";
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
      .fromTo([".hero__sub", ".hero__ctas"], { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9, stagger: .1, ease: "power3.out" }, .5)
      .fromTo([".hero__rating", ".hero__coords", ".hero__scroll", ".hero__insp"], { opacity: 0 }, { opacity: 1, duration: 1, stagger: .08 }, .7);
  }
  function finishIntro() { try { sessionStorage.setItem("rm-intro", "1"); } catch (e) {} if (intro) intro.classList.add("done"); }
  if (!intro || h.classList.contains("no-intro") || !hasG || reduce) { finishIntro(); heroIn(.05); }
  else {
    G.set(".hero__title .ln>span", { y: 0, yPercent: 110 });
    G.set([".hero__sub", ".hero__ctas", ".hero__rating", ".hero__coords", ".hero__scroll", ".hero__insp"], { opacity: 0 });
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

    var rv = ".label, .h2, .mani__p, .mani__facts div, .srv-feat__txt > *, .srv-row, .det__list li, .det__data div, .rev__main, .rev__c, .rev__g, .zon__p, .zon__links li, .faq details, .end__sub, .end__btn, .end__contact a, .cfg__intro, .studio, .prj__note, .filters";
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
  gal.addEventListener("scroll", function () {
    var items = $$(".g-item:not(.is-out)", gal); if (!items.length) return;
    var w = items[0].getBoundingClientRect().width + 10, k = Math.round(gal.scrollLeft / w);
    $("#galCount").textContent = Math.min(k + 1, items.length) + " / " + items.length;
  }, { passive: true });
  $$(".filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      $$(".filters button").forEach(function (x) { var on = x === btn; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", String(on)); });
      var f = btn.dataset.f; visible = [];
      var show = function () {
        $$(".g-item").forEach(function (it) { var on = f === "todos" || it.dataset.cat === f; it.classList.toggle("is-out", !on); if (on) visible.push(+it.dataset.i); it.style.clipPath = ""; });
        if (hasG && !reduce) G.fromTo(".g-item:not(.is-out)", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8, stagger: .05, ease: "power3.out" });
        gal.scrollLeft = 0; $("#galCount").textContent = "1 / " + visible.length;
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

  /* ---------------- Configurator (3D studio) ---------------- */
  var TEX = {
    marmol: ["photo-1566041510394-cf7c8fe21800", "Mármol blanco"],
    travertino: ["photo-1780253460324-9d49f88c74fc", "Travertino"],
    microcemento: ["photo-1787602525716-3c36be37d5fb", "Microcemento"],
    zellige: ["photo-1532901074349-dc9d1505589c", "Zellige verde"],
    nero: ["photo-1786673211400-90f79d15b1ff", "Mármol negro"],
    hidraulico: ["photo-1624963839265-55161fbef7fe", "Hidráulico"]
  };
  var PLATO = { blanco: ["#F4F2EC", "Blanco"], arena: ["#D8CBB4", "Arena"], piedra: ["#A8A49B", "Gris piedra"], antracita: ["#3D3F3D", "Antracita"], negro: ["#1E1F1E", "Negro"] };
  var METAL = { negro: ["#1A1A1A", "Negro mate", .12], cromo: ["#B9BFC3", "Cromo", .55], oro: ["#B8955F", "Oro cepillado", .4], gunmetal: ["#4B4D4E", "Gun metal", .25], blanco: ["#EAE9E4", "Blanco", .3] };
  var MAMP = { fija: "Fija · walk-in", corredera: "Corredera", abatible: "Abatible", industrial: "Cuadrícula industrial" };
  var GRIF = { empotrada: "Empotrada + rociador de techo", columna: "Columna termostática", barra: "Barra deslizante" };
  var KICK = { pared: "Revestimiento", plato: "Plato de ducha", mampara: "Mampara", perfil: "Perfilería y grifería", grif: "Grifería" };
  var st = { pared: "marmol", plato: "blanco", mampara: "fija", perfil: "negro", grif: "empotrada" };
  var scene = $("#scene"), stage = $("#cfgStage"), parts = $("#parts"), glassEl = $("#glass3d"), fixBack = $("#fixBack"), water = $("#water");

  function fit() {
    var W = stage.clientWidth, H = stage.clientHeight, s = Math.max(W / 1000, H / 640);
    scene.style.transform = "translate(" + ((W - 1000 * s) / 2) + "px," + ((H - 640 * s) / 2) + "px) scale(" + s + ")";
  }
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(stage); else addEventListener("resize", fit);
  fit();

  function div(parent, cls, x, y, w, hh, tf, extra) {
    var e = d.createElement("div"); e.className = cls;
    e.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + hh + "px;" + (tf ? "transform:" + tf + ";" : "") + (extra || "");
    parent.appendChild(e); return e;
  }
  function wallTex(first) {
    var url = "url(" + U(TEX[st.pared][0], 900, 72) + ")";
    $$(".wall", scene).forEach(function (w) {
      var t = d.createElement("div"); t.className = "tex"; t.style.backgroundImage = url;
      if (first) { var old0 = w.querySelector(".tex"); old0.style.backgroundImage = url; return; }
      t.style.opacity = 0; w.insertBefore(t, w.firstChild.nextSibling);
      var olds = $$(".tex", w).filter(function (x) { return x !== t; });
      var im = new Image(); im.onload = im.onerror = function () {
        requestAnimationFrame(function () { t.style.opacity = 1; });
        setTimeout(function () { olds.forEach(function (o) { o.remove(); }); }, 1100);
      };
      im.src = U(TEX[st.pared][0], 900, 72);
    });
  }
  function buildGlass() {
    glassEl.innerHTML = "";
    var Z = "translateZ(-210px)", gl, f;
    if (st.mampara === "fija" || st.mampara === "industrial") {
      gl = div(glassEl, "gl", 470, 110, 530, 530, Z);
      div(glassEl, "m", 992, 110, 8, 530, Z);
      div(glassEl, "m mh", 470, 634, 530, 6, Z);
      div(glassEl, "m mh", 470, 110, 550, 7, "translateZ(-210px) rotateY(90deg)", "transform-origin:0 50%");
      if (st.mampara === "industrial") {
        [[0, 0, 530, 9], [0, 521, 530, 9], [0, 0, 9, 530], [521, 0, 9, 530], [261, 0, 8, 530], [0, 175, 530, 8], [0, 350, 530, 8]].forEach(function (r) { div(gl, "m", r[0], r[1], r[2], r[3]); });
      } else div(glassEl, "m", 466, 110, 5, 530, Z, "--shine:.1;opacity:.9");
    } else if (st.mampara === "corredera") {
      div(glassEl, "gl", 0, 116, 540, 524, "translateZ(-202px)");
      div(glassEl, "gl", 460, 116, 540, 524, "translateZ(-186px)");
      div(glassEl, "m mh", 0, 104, 1000, 12, "translateZ(-194px)");
      div(glassEl, "m mh", 0, 634, 1000, 6, "translateZ(-194px)");
      div(glassEl, "m", 532, 116, 8, 524, "translateZ(-202px)");
      div(glassEl, "m", 460, 116, 8, 524, "translateZ(-186px)");
      div(glassEl, "m", 478, 320, 9, 140, "translateZ(-183px)", "border-radius:5px");
      div(glassEl, "m", 512, 320, 9, 140, "translateZ(-205px)", "border-radius:5px");
    } else {
      div(glassEl, "gl", 650, 110, 350, 530, Z);
      div(glassEl, "m", 992, 110, 8, 530, Z);
      div(glassEl, "m mh", 650, 110, 550, 7, "translateZ(-210px) rotateY(90deg)", "transform-origin:0 50%");
      var door = div(glassEl, "gl", 300, 112, 350, 526, "translateZ(-210px) rotateY(26deg)", "transform-origin:100% 50%");
      div(door, "m", 20, 200, 9, 140, "", "border-radius:5px");
      div(door, "m", 334, 50, 16, 46); div(door, "m", 334, 430, 16, 46);
    }
  }
  function buildTaps() {
    parts.innerHTML = ""; fixBack.innerHTML = "";
    var ceil = $("#rainCeil"); ceil.style.opacity = st.grif === "empotrada" ? 1 : 0;
    if (st.grif === "empotrada") {
      water.style.cssText = "left:420px;top:0;width:160px;height:640px;transform:translateZ(-530px);clip-path:polygon(28% 0,72% 0,100% 100%,0 100%)";
      div(fixBack, "m", 640, 330, 64, 64, "", "border-radius:4px");
      div(fixBack, "m", 660, 350, 24, 24, "", "border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.4)");
      div(fixBack, "m", 680, 358, 44, 8, "", "border-radius:4px");
      div(fixBack, "m", 730, 352, 20, 20, "", "border-radius:50%");
    } else if (st.grif === "columna") {
      water.style.cssText = "left:504px;top:158px;width:120px;height:482px;transform:translateZ(-640px);clip-path:polygon(30% 0,70% 0,100% 100%,0 100%)";
      div(fixBack, "m", 560, 150, 9, 330, "", "border-radius:4px");
      div(fixBack, "m mh", 506, 470, 120, 24, "", "border-radius:12px");
      div(fixBack, "m", 500, 466, 32, 32, "", "border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.4)");
      div(fixBack, "m", 600, 466, 32, 32, "", "border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.4)");
      div(parts, "m mh", 560, 148, 122, 8, "translateZ(-760px) rotateY(-90deg)", "transform-origin:0 50%");
      div(parts, "m", 514, 104, 100, 100, "translateZ(-640px) rotateX(90deg)", "border-radius:50%;backface-visibility:visible;box-shadow:inset 0 0 0 5px rgba(0,0,0,.25)");
    } else {
      water.style.cssText = "left:600px;top:236px;width:90px;height:404px;transform:translateZ(-735px) rotate(6deg);clip-path:polygon(35% 0,65% 0,100% 100%,0 100%);opacity:.35";
      div(fixBack, "m", 640, 190, 8, 330, "", "border-radius:4px");
      div(fixBack, "m", 634, 186, 20, 14, "", "border-radius:3px"); div(fixBack, "m", 634, 512, 20, 14, "", "border-radius:3px");
      div(fixBack, "m", 648, 236, 22, 14, "", "border-radius:3px");
      div(fixBack, "m", 662, 196, 24, 54, "rotate(-22deg)", "border-radius:12px");
      div(fixBack, "m", 610, 560, 70, 26, "", "border-radius:6px");
      div(fixBack, "m", 630, 546, 30, 10, "", "border-radius:5px");
      var hose = d.createElement("div"); hose.className = "hose";
      hose.innerHTML = '<svg viewBox="0 0 120 380" width="120" height="380" style="position:absolute;left:600px;top:240px;overflow:visible"><path d="M70 10 C 120 120, 10 250, 40 340" fill="none" stroke="#2a2a2a" stroke-width="5" opacity=".7"/></svg>';
      fixBack.appendChild(hose);
    }
  }
  function apply() {
    var m = METAL[st.perfil];
    scene.style.setProperty("--metal", m[0]); scene.style.setProperty("--shine", m[2]);
    scene.style.setProperty("--plato", PLATO[st.plato][0]);
  }
  function labels() {
    var vals = [TEX[st.pared][1], PLATO[st.plato][1], MAMP[st.mampara], METAL[st.perfil][1], GRIF[st.grif].split(" +")[0]];
    vals.forEach(function (v, i) { $("#t" + i).textContent = v; });
    $("#cfgSum").textContent = TEX[st.pared][1] + ", plato " + PLATO[st.plato][1].toLowerCase() + ", mampara " + MAMP[st.mampara].toLowerCase() + " y acabados en " + METAL[st.perfil][1].toLowerCase() + ".";
  }
  function designText() { return "Revestimiento " + TEX[st.pared][1].toLowerCase() + ", plato " + PLATO[st.plato][1].toLowerCase() + ", mampara " + MAMP[st.mampara].toLowerCase() + ", perfilería " + METAL[st.perfil][1].toLowerCase() + " y grifería " + GRIF[st.grif].toLowerCase() + "."; }
  function hud(k, name) {
    $("#hudKicker").textContent = KICK[k]; var n = $("#hudName"); n.textContent = name;
    if (hasG && !reduce) G.fromTo(n, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: "power3.out" });
  }
  function render(key) {
    apply();
    if (!key || key === "pared") wallTex(!key);
    if (!key || key === "mampara") buildGlass();
    if (!key || key === "grif") buildTaps();
    labels();
    if (key) {
      stage.classList.remove("flash"); void stage.offsetWidth; stage.classList.add("flash");
      if (key === "mampara" && hasG && !reduce) G.from("#glass3d > *", { opacity: 0, duration: .6, stagger: .03 });
    }
  }
  $$("#cfgPanel [data-k]").forEach(function (grp) {
    grp.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var k = grp.dataset.k; st[k] = b.dataset.v;
      $$("button", grp).forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); });
      render(k); hud(k, b.querySelector("span").textContent);
    });
  });
  $$(".hud--tr button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".hud--tr button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      scene.classList.remove("lit-warm", "lit-day", "lit-night"); scene.classList.add("lit-" + b.dataset.light);
    });
  });
  var curStep = 0, tabs = $$(".tabs button"), panes = $$(".opts .pane");
  function goStep(i) {
    curStep = i;
    tabs.forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); });
    panes.forEach(function (p, k) { p.classList.toggle("is-on", k === i); });
    $("#cfgNext").textContent = i === panes.length - 1 ? "Volver al primer paso ↺" : "Siguiente paso →";
    var tb = tabs[i]; if (tb.parentNode.parentNode.scrollWidth > tb.parentNode.parentNode.clientWidth) tb.parentNode.parentNode.scrollTo({ left: tb.parentNode.offsetLeft - 20, behavior: "smooth" });
  }
  tabs.forEach(function (b, k) { b.addEventListener("click", function () { goStep(k); }); });
  $("#cfgNext").addEventListener("click", function () { goStep((curStep + 1) % panes.length); });
  setTimeout(function () { Object.keys(TEX).forEach(function (k) { var im = new Image(); im.src = U(TEX[k][0], 900, 72); }); }, 2500);
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

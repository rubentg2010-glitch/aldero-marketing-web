/* ALDERO MARKETING — interacciones y animaciones (GSAP + ScrollTrigger + SplitText) */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Testimonios: ventana con el caso de cada cliente ---------- */
  var lastCaseBtn = null;
  $$("[data-case]").forEach(function (btn) {
    var d = document.getElementById(btn.getAttribute("data-case"));
    if (!d || typeof d.showModal !== "function") return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      lastCaseBtn = btn;
      root.classList.add("case-open");
      d.showModal();
      d.scrollTop = 0;
    });
  });
  $$("dialog.case").forEach(function (d) {
    d.addEventListener("click", function (e) {
      if (e.target === d || e.target.closest("[data-case-close]")) d.close();
    });
    d.addEventListener("close", function () {
      root.classList.remove("case-open");
      if (lastCaseBtn) lastCaseBtn.focus({ preventScroll: true });
    });
  });

  /* ---------- Navegación: fondo al hacer scroll y se oculta al bajar ---------- */
  var nav = $("[data-nav]");
  var lastY = window.scrollY;
  var menuOpen = false;
  function onScrollNav() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 24);
      if (!menuOpen) nav.classList.toggle("is-hidden", y > 400 && y > lastY + 2);
      if (y < lastY - 2) nav.classList.remove("is-hidden");
    }
    lastY = y;
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  var navLinks = $$(".nav__links a");
  if ("IntersectionObserver" in window && navLinks.length) {
    var activeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + entry.target.id;
          a.classList.toggle("is-active", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (a) { var s = document.getElementById(a.getAttribute("href").slice(1)); if (s) activeObs.observe(s); });
  }

  /* ---------- Menú móvil ---------- */
  var toggle = $("[data-menu-toggle]");
  var menu = $("[data-menu]");
  var closeTimer;
  function openMenu() {
    clearTimeout(closeTimer);
    menuOpen = true;
    menu.hidden = false;
    nav.classList.remove("is-hidden");
    requestAnimationFrame(function () { menu.classList.add("is-open"); nav.classList.add("is-open"); });
    toggle.setAttribute("aria-expanded", "true");
    $(".sr-only", toggle).textContent = "Cerrar menú";
    document.body.classList.add("is-locked");
    var first = $("a", menu);
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 80);
  }
  function closeMenu(returnFocus) {
    if (!menuOpen) return;
    menuOpen = false;
    menu.classList.remove("is-open");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    $(".sr-only", toggle).textContent = "Abrir menú";
    document.body.classList.remove("is-locked");
    closeTimer = setTimeout(function () { menu.hidden = true; }, reduceMotion ? 0 : 500);
    if (returnFocus) toggle.focus();
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () { menuOpen ? closeMenu(true) : openMenu(); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { closeMenu(false); }); });
    document.addEventListener("keydown", function (e) {
      if (!menuOpen) return;
      if (e.key === "Escape") { closeMenu(true); return; }
      if (e.key === "Tab") {
        var f = [toggle].concat($$("a", menu)), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    });
    window.addEventListener("resize", function () { if (window.innerWidth > 1100) closeMenu(false); });
  }

  /* ---------- Buscador del hero: sube hasta el puesto 1 ---------- */
  var list = $("[data-serp-list]");
  var you = $("[data-you]");
  var query = $("[data-query]");
  var msg = $("[data-msg]");
  var pillRank = $("[data-pill-rank]");
  var pillFill = $("[data-pill-fill]");
  var queries = ["reformas integrales cerca de mí", "clínica dental en mi ciudad", "mejor taller mecánico cerca", "abogado laboralista cerca de mí", "peluquería abierta hoy"];
  var qi = 0;
  var ranks = ["#7", "#4", "#2", "#1"];

  function setPill(i) {
    if (pillRank) pillRank.textContent = ranks[Math.min(i, ranks.length - 1)];
    if (pillFill) pillFill.style.transform = "scaleX(" + [0.2, 0.45, 0.72, 1][Math.min(i, 3)] + ")";
  }
  function flipMoveUp(item) {
    var prev = item.previousElementSibling;
    if (!prev) return false;
    var items = [item, prev];
    var first = items.map(function (el) { return el.getBoundingClientRect().top; });
    list.insertBefore(item, prev);
    items.forEach(function (el, i) {
      el.style.transition = "none";
      el.style.transform = "translateY(" + (first[i] - el.getBoundingClientRect().top) + "px)";
    });
    void list.offsetHeight;
    items.forEach(function (el) { el.style.transition = "transform .4s cubic-bezier(.22,1,.36,1)"; el.style.transform = ""; });
    return true;
  }
  function typeQuery(text, done) {
    if (!query) { done(); return; }
    var i = 0;
    query.textContent = "";
    (function step() { query.textContent = text.slice(0, i); i++; if (i <= text.length) setTimeout(step, 16 + Math.random() * 14); else done(); })();
  }
  function runCycle() {
    list.appendChild(you);
    you.classList.remove("is-top");
    if (msg) msg.classList.remove("is-visible");
    setPill(0);
    typeQuery(queries[qi++ % queries.length], function () {
      var step = 0;
      var climb = setInterval(function () {
        step++;
        if (!flipMoveUp(you)) {
          clearInterval(climb);
          you.classList.add("is-top");
          setPill(3);
          if (msg) msg.classList.add("is-visible");
          setTimeout(runCycle, 3800);
        } else { setPill(step); }
      }, 440);
    });
  }
  if (list && you) {
    if (reduceMotion) {
      list.insertBefore(you, list.firstElementChild);
      you.classList.add("is-top");
      setPill(3);
      if (msg) msg.classList.add("is-visible");
    } else {
      setTimeout(runCycle, 900);
    }
  }

  /* =========================================================
     Animaciones con GSAP (si no hay GSAP o se pide movimiento
     reducido, todo queda visible y estático)
     ========================================================= */
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger, SplitText = window.SplitText;
  var introEl = $("[data-intro]");
  function endIntro() {
    root.classList.add("intro-done");
    try { sessionStorage.setItem("aldero-intro", "1"); } catch (e) {}
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }
  if (reduceMotion || !gsap || !ScrollTrigger) {
    root.classList.remove("anim");
    endIntro();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (SplitText) gsap.registerPlugin(SplitText);
  root.classList.add("anim-ok");

  var ease = "expo.out";

  /* Entrada del hero (todo visible en menos de 1,2 s) */
  var heroTl = gsap.timeline({ paused: true, defaults: { ease: ease } });
  heroTl.to("[data-hero-line]", { y: 0, duration: 0.9, stagger: 0.07 })
        .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 0.55, stagger: 0.04 }, "-=0.65")
        .to(".hero__visual", { opacity: 1, y: 0, scale: 1, duration: 0.85 }, "-=0.75");

  /* ---------- Intro cinematográfica (≈2,8 s escritorio · ≈2 s móvil) ---------- */
  var introActive = introEl && root.classList.contains("intro-on") && !root.classList.contains("intro-done");
  if (introActive) {
    root.classList.add("intro-run");
    var introImgs = $$("img", introEl).map(function (img) {
      return img.complete ? Promise.resolve() : new Promise(function (r) { img.onload = r; img.onerror = r; });
    });
    Promise.race([Promise.all(introImgs), new Promise(function (r) { setTimeout(r, 400); })]).then(playIntro, playIntro);
  } else {
    heroTl.play();
  }

  function playIntro() {
    var isMobile = window.innerWidth < 720;
    var veil = $("[data-intro-veil]", introEl);
    var line = $("[data-intro-line]", introEl);
    var word = $("[data-intro-word]", introEl);
    var letters = $$("[data-il]", introEl);
    var inners = $$("[data-il-in]", introEl);
    var letterA = letters[0];
    var skipBtn = $("[data-intro-skip]", introEl);
    var finished = false;
    var spread = Math.min(window.innerWidth * 0.05, 64);

    // Geometría de la "A" dentro del logotipo (coordenadas de la imagen de 970 × 138)
    var TRI = [[126, 36], [56, 112], [192, 112]];   // hueco interior de la A
    var ORIGIN = [124, 88];                           // centro del hueco
    var geo = null;
    function measure() {
      var r = letterA.getBoundingClientRect();
      var k = r.height / 138;
      geo = { k: k, left: r.left, top: r.top, ox: r.left + ORIGIN[0] * k, oy: r.top + ORIGIN[1] * k };
      gsap.set(letterA, { transformOrigin: (ORIGIN[0] * k) + "px " + (ORIGIN[1] * k) + "px" });
      // escala mínima para que el hueco cubra toda la pantalla
      var lo = 1, hi = 600;
      for (var n = 0; n < 24; n++) { var mid = (lo + hi) / 2; if (covers(mid)) hi = mid; else lo = mid; }
      geo.S = hi * 1.08;
    }
    function triAt(sc) {
      return TRI.map(function (p) {
        var x = geo.left + p[0] * geo.k, y = geo.top + p[1] * geo.k;
        return [geo.ox + (x - geo.ox) * sc, geo.oy + (y - geo.oy) * sc];
      });
    }
    function inside(pt, t) {
      function sgn(a, b, c) { return (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1]); }
      var d1 = sgn(pt, t[0], t[1]), d2 = sgn(pt, t[1], t[2]), d3 = sgn(pt, t[2], t[0]);
      return !(((d1 < 0) || (d2 < 0) || (d3 < 0)) && ((d1 > 0) || (d2 > 0) || (d3 > 0)));
    }
    function covers(sc) {
      var t = triAt(sc);
      return [[0, 0], [W, 0], [W, H], [0, H]].every(function (c) { return inside(c, t); });
    }
    var cam = { s: 1 };
    var W = window.innerWidth, H = window.innerHeight;
    function drawHole() {
      if (!geo) return;
      var pts = triAt(cam.s).map(function (p) { return p[0].toFixed(1) + "px " + p[1].toFixed(1) + "px"; });
      var path = "polygon(evenodd, 0px 0px, " + W + "px 0px, " + W + "px " + H + "px, 0px " + H + "px, 0px 0px, " + pts[0] + ", " + pts[1] + ", " + pts[2] + ", " + pts[0] + ", 0px 0px)";
      veil.style.clipPath = path;
      veil.style.webkitClipPath = path;
    }

    var finish = function () {
      if (finished) return;
      finished = true;
      removeSkipListeners();
      if (heroTl.progress() === 0 && !heroTl.isActive()) heroTl.play(0);
      endIntro();
    };

    gsap.set(letters, { x: function (i) { return (i - 2.5) * spread; } });
    gsap.set(word, { scale: 1.1 });

    var tl = gsap.timeline({ defaults: { ease: ease }, onComplete: finish });
    tl.timeScale(isMobile ? 1.35 : 1);

    // 1 · Impacto: una línea azul atraviesa la pantalla
    tl.to(line, { scaleX: 1, duration: 0.62, ease: "expo.inOut" }, 0)
      .fromTo(skipBtn, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.2)

    // 2 · ALDERO sale de la línea letra a letra y el tracking se cierra
      .to(inners, { y: 0, duration: 0.8, stagger: 0.055 }, 0.32)
      .to(letters, { x: 0, duration: 1.05, ease: "power3.out" }, 0.32)
      .to(word, { scale: 1, duration: 1.2, ease: "power2.out" }, 0.32)
      .to(line, { scaleX: 0.0, opacity: 0, duration: 0.6, ease: "power3.in" }, 0.95)

    // 3 · Momento wow: el resto de letras se abre y la cámara atraviesa la "A"
      .add(function () { measure(); drawHole(); }, 1.24)
      .to(inners.slice(1), { y: "-112%", duration: 0.5, ease: "power3.in", stagger: 0.035 }, 1.18)
      .to(cam, { s: function () { return geo ? geo.S : 60; }, duration: 1.0, ease: "power3.in", onUpdate: function () { drawHole(); gsap.set(letterA, { scale: cam.s }); } }, 1.3)
      .to(letterA, { opacity: 0, duration: 0.3, ease: "power1.in" }, 2.0)
      .to(skipBtn, { opacity: 0, duration: 0.2 }, 1.3)

    // 4 · La portada entra mientras el hueco termina de abrirse
      .add(function () { heroTl.play(0); }, 1.72)
      .set(veil, { opacity: 0 }, 2.3);

    function skip() { if (!finished) { tl.progress(1, false); } }
    function onKey(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip(); }
    function removeSkipListeners() {
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", onKey);
    }
    skipBtn.addEventListener("click", skip);
    window.addEventListener("wheel", skip, { passive: true, once: true });
    window.addEventListener("touchstart", skip, { passive: true, once: true });
    window.addEventListener("keydown", onKey);
  }

  /* Parallax del hero al hacer scroll */
  gsap.to("[data-parallax-title]", { yPercent: -18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__visual", { y: -90, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__glow", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* La cinta acelera con la velocidad del scroll */
  var tapeAnims = $$(".tape__track").map(function (el) { return el.getAnimations ? el.getAnimations()[0] : null; }).filter(Boolean);
  if (tapeAnims.length) {
    var resetRate;
    ScrollTrigger.create({
      trigger: ".tape", start: "top bottom", end: "bottom top",
      onUpdate: function (self) {
        var rate = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 6);
        tapeAnims.forEach(function (a) { a.playbackRate = rate; });
        clearTimeout(resetRate);
        resetRate = setTimeout(function () { tapeAnims.forEach(function (a) { a.playbackRate = 1; }); }, 160);
      }
    });
  }

  /* Servicios como capítulos: el visual fijo cambia según el capítulo activo */
  var chapWrap = $(".chapters");
  if (chapWrap) {
    var chapItems = $$("[data-chap]", chapWrap);
    var chapVis = $$("[data-chap-visual]", chapWrap);
    var current = -1;
    var setChap = function (i) {
      if (i === current) return;
      current = i;
      chapItems.forEach(function (c, n) { c.classList.toggle("is-on", n === i); });
      chapVis.forEach(function (v, n) {
        v.classList.toggle("is-on", n === i);
        v.classList.toggle("is-off", n < i);
      });
    };
    ScrollTrigger.matchMedia({
      "(min-width: 981px)": function () {
        chapWrap.classList.add("is-live");
        setChap(0);
        var triggers = chapItems.map(function (c, n) {
          return ScrollTrigger.create({ trigger: c, start: "top 55%", end: "bottom 55%", onToggle: function (self) { if (self.isActive) setChap(n); } });
        });
        return function () { chapWrap.classList.remove("is-live"); triggers.forEach(function (t) { t.kill(); }); };
      },
      "(max-width: 980px)": function () {
        var ts = chapItems.map(function (c) {
          return ScrollTrigger.create({ trigger: c, start: "top 75%", once: true, onEnter: function () { c.classList.add("is-in"); } });
        });
        return function () { ts.forEach(function (t) { t.kill(); }); };
      }
    });
    gsap.utils.toArray("[data-chap-title]").forEach(function (t) {
      gsap.from(t, { yPercent: 40, opacity: 0, duration: 0.9, ease: ease, scrollTrigger: { trigger: t, start: "top 85%", once: true } });
    });
  }

  /* Titulares que aparecen línea a línea */
  if (SplitText) {
    $$("[data-split]").forEach(function (el) {
      SplitText.create(el, {
        type: "lines", mask: "lines", linesClass: "split-line", autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.lines, { yPercent: 105, duration: 0.85, stagger: 0.07, ease: ease, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        }
      });
    });

    /* Manifiesto: las palabras se encienden con el scroll */
    $$("[data-words]").forEach(function (el) {
      var split = SplitText.create(el, { type: "words", wordsClass: "word" });
      gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 62%", scrub: 0.4 } });
    });
  }

  /* "destacar." — el bloque azul se dibuja detrás de la palabra */
  var hlBg = $("[data-hl-bg]");
  if (hlBg) {
    gsap.fromTo(hlBg, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-hl]", start: "top 72%", end: "top 48%", scrub: 0.4 } });
    gsap.fromTo("[data-hl] em", { color: "rgba(242,242,238,.14)" }, { color: "#FFFFFF", ease: "none", scrollTrigger: { trigger: "[data-hl]", start: "top 74%", end: "top 55%", scrub: 0.4 } });
  }
  var pbg = $("[data-parallax-bg]");
  if (pbg) gsap.fromTo(pbg, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: true } });

  /* Elementos que se revelan al entrar en pantalla */
  gsap.set("[data-reveal]", { opacity: 0, y: 28 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 90%", once: true,
    onEnter: function (batch) { gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: ease, overwrite: true }); }
  });

  /* Imágenes: recorte + zoom + parallax */
  $$("[data-img-reveal]").forEach(function (box) {
    var inner = $("[data-img-inner]", box);
    gsap.fromTo(box, { clipPath: "inset(18% 8% 18% 8% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.1, ease: ease, scrollTrigger: { trigger: box, start: "top 88%", once: true } });
    if (inner) gsap.fromTo(inner, { scale: 1.18 }, { scale: 1, duration: 1.3, ease: ease, scrollTrigger: { trigger: box, start: "top 88%", once: true } });
  });

  /* Transición hacia el bloque de auditoría */
  var clipPanel = $("[data-clip]");
  if (clipPanel) {
    gsap.fromTo(clipPanel, { clipPath: "inset(6% 5% 6% 5% round 56px)" }, { clipPath: "inset(0% 0% 0% 0% round 56px)", ease: "none", scrollTrigger: { trigger: clipPanel, start: "top 95%", end: "top 40%", scrub: true } });
  }
  var scaleIn = $("[data-scale-in]");
  if (scaleIn) {
    gsap.fromTo(scaleIn, { scale: 0.82, opacity: 0.4 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: scaleIn, start: "top 95%", end: "top 45%", scrub: true } });
  }

  /* Línea de los 4 pasos */
  var stepsLine = $("[data-steps-line]");
  if (stepsLine) {
    var stepEls = $$(".step");
    gsap.to(stepsLine, { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 80%", end: "bottom 60%", scrub: true,
      onUpdate: function (self) { stepEls.forEach(function (st, i) { st.classList.toggle("is-on", self.progress >= i / stepEls.length + 0.04); }); } } });
  }

  /* Galería horizontal de proyectos (escritorio) */
  var mm = gsap.matchMedia();
  mm.add("(min-width: 861px)", function () {
    var section = $("[data-work]");
    var track = $("[data-work-track]");
    if (!section || !track) return;
    var distance = function () { return Math.max(0, track.scrollWidth - document.documentElement.clientWidth + parseFloat(getComputedStyle(track.parentElement).paddingLeft) * 2); };
    var hTween = gsap.to(track, {
      x: function () { return -distance(); }, ease: "none",
      scrollTrigger: { trigger: section, start: "top top", end: function () { return "+=" + distance(); }, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    // Profundidad: cada captura se desplaza un poco más lenta que su marco
    $$(".project__media img", track).forEach(function (img) {
      gsap.fromTo(img, { xPercent: -5, scale: 1.12 }, {
        xPercent: 5, ease: "none",
        scrollTrigger: { trigger: img.closest(".project"), containerAnimation: hTween, start: "left right", end: "right left", scrub: true }
      });
    });
  });

  /* Servicios: círculo con icono que sigue al cursor */
  var floatEl = $("[data-srv-float]");
  var srvList = $("[data-srv]");
  if (finePointer && floatEl && srvList) {
    var fx = gsap.quickTo(floatEl, "x", { duration: 0.45, ease: "power3" });
    var fy = gsap.quickTo(floatEl, "y", { duration: 0.45, ease: "power3" });
    var icons = $$("[data-icon-svg]", floatEl);
    srvList.addEventListener("pointermove", function (e) { fx(e.clientX); fy(e.clientY); });
    $$(".srv__link", srvList).forEach(function (link) {
      link.addEventListener("pointerenter", function () {
        var key = link.getAttribute("data-icon");
        icons.forEach(function (svg) { svg.classList.toggle("is-on", svg.getAttribute("data-icon-svg") === key); });
        floatEl.classList.add("is-on");
      });
    });
    srvList.addEventListener("pointerleave", function () { floatEl.classList.remove("is-on"); });
  }

  /* Botones magnéticos */
  if (finePointer) {
    $$("[data-magnetic]").forEach(function (el) {
      var strength = parseFloat(el.getAttribute("data-magnetic")) || 0.2;
      var mx = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      var my = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * strength);
        my((e.clientY - r.top - r.height / 2) * strength);
      });
      el.addEventListener("pointerleave", function () { mx(0); my(0); });
    });
  }

  /* ---------- Cursor personalizado (solo ratón) ---------- */
  if (finePointer) {
    var cDot = document.createElement("div"); cDot.className = "cursor-dot";
    var cRing = document.createElement("div"); cRing.className = "cursor-ring";
    cRing.innerHTML = '<span class="cursor-ring__label"></span>';
    document.body.appendChild(cRing); document.body.appendChild(cDot);
    var cLabel = cRing.firstChild;
    root.classList.add("has-cursor");
    var dx = gsap.quickTo(cDot, "x", { duration: 0.08, ease: "power3" });
    var dy = gsap.quickTo(cDot, "y", { duration: 0.08, ease: "power3" });
    var rx = gsap.quickTo(cRing, "x", { duration: 0.38, ease: "power3" });
    var ry = gsap.quickTo(cRing, "y", { duration: 0.38, ease: "power3" });
    var shown = false;
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      if (!shown) { shown = true; gsap.set([cDot, cRing], { x: e.clientX, y: e.clientY }); root.classList.add("cursor-on"); }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    }, { passive: true });
    document.addEventListener("mouseleave", function () { root.classList.remove("cursor-on"); shown = false; });
    window.addEventListener("pointerdown", function () { root.classList.add("cursor-down"); });
    window.addEventListener("pointerup", function () { root.classList.remove("cursor-down"); });

    var setState = function (state, label) {
      root.classList.remove("cursor-link", "cursor-view", "cursor-wa", "cursor-hide");
      if (state) root.classList.add("cursor-" + state);
      cLabel.textContent = label || "";
    };
    document.addEventListener("pointerover", function (e) {
      var t = e.target;
      if (t.closest(".srv__link")) return setState("hide");           // en servicios manda el círculo con icono
      if (t.closest(".project__media-link")) return setState("view", "Ver web");
      if (t.closest(".project--next, .cta__orb")) return setState("wa", "Hablemos");
      if (t.closest("a, button")) return setState("link");
      setState(null);
    });
  }

  /* Recalcular cuando cargan las fuentes */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();

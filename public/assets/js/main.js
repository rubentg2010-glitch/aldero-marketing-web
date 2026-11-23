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

  /* ---------- Intro cinematográfica (≈1,6 s escritorio · ≈1,2 s móvil) ---------- */
  var introActive = introEl && root.classList.contains("intro-on") && !root.classList.contains("intro-done");
  if (introActive) {
    root.classList.add("intro-run");
    var introImgs = $$("img", introEl).map(function (img) {
      return img.complete ? Promise.resolve() : new Promise(function (r) { img.onload = r; img.onerror = r; });
    });
    Promise.race([Promise.all(introImgs), new Promise(function (r) { setTimeout(r, 450); })]).then(playIntro, playIntro);
  } else {
    heroTl.play();
  }

  function playIntro() {
    var isMobile = window.innerWidth < 720;
    var stage = $("[data-intro-stage]", introEl);
    var bg = $("[data-intro-bg]", introEl);
    var logoBox = $("[data-intro-logo]", introEl);
    var logoImg = $("img", logoBox);
    var shine = $("[data-intro-sweep]", introEl);
    var flash = $("[data-intro-flash]", introEl);
    var skipBtn = $("[data-intro-skip]", introEl);
    var dust = $("[data-intro-dust]", introEl);
    var finished = false;
    var stopDust = function () {};

    // Punto de entrada de la cámara: el vértice de la "A" azul del logo
    var r = logoBox.getBoundingClientRect();
    var ax = r.left + r.width * 0.13, ay = r.top + r.height * 0.09;
    gsap.set(stage, { transformOrigin: ax + "px " + ay + "px" });
    flash.style.setProperty("--fx", ax + "px");
    flash.style.setProperty("--fy", ay + "px");

    if (!isMobile && dust && dust.getContext) stopDust = runDust(dust);

    var finish = function () {
      if (finished) return;
      finished = true;
      stopDust();
      removeSkipListeners();
      if (heroTl.progress() === 0 && !heroTl.isActive()) heroTl.play(0);
      endIntro();
    };

    var tl = gsap.timeline({ defaults: { ease: ease }, onComplete: finish });
    tl.timeScale(isMobile ? 1.35 : 1);

    // 0 · Desde la oscuridad: aparecen las curvas de luz con profundidad
    tl.fromTo(bg, { opacity: 0, scale: 1.14, filter: "blur(14px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.0, ease: "power3.out" }, 0)

    // 1 · Impacto del logo: barrido con máscara, desenfoque y escala
      .fromTo(logoImg, { opacity: 1, clipPath: "inset(0% 100% 0% 0%)", filter: "blur(10px)" }, { clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", duration: 0.75, ease: "power3.out" }, 0.08)
      .fromTo(logoBox, { scale: 1.08 }, { scale: 1, duration: 0.95 }, 0.08)
      .fromTo(shine, { backgroundPosition: "140% 0" }, { backgroundPosition: "-40% 0", duration: 0.75, ease: "power2.inOut" }, 0.35)

    // 2 · Momento wow: la cámara entra por el vértice de la "A" y estalla en luz
      .to(stage, { scale: isMobile ? 7 : 9, duration: 0.55, ease: "power3.in" }, 0.88)
      .to(flash, { opacity: 1, duration: 0.3, ease: "power2.in" }, 1.08)
      .to(skipBtn, { opacity: 0, duration: 0.2 }, 1.0)
      .add(function () { heroTl.play(0); }, 1.18)

    // 3 · La luz se disuelve y deja la portada
      .to(introEl, { opacity: 0, duration: 0.38, ease: "power2.out" }, 1.36);

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

  /* Polvo de luz muy sutil (solo escritorio, solo durante la intro) */
  function runDust(canvas) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = canvas.width = Math.round(window.innerWidth * dpr);
    var h = canvas.height = Math.round(window.innerHeight * dpr);
    var parts = [];
    for (var i = 0; i < 70; i++) parts.push({ x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.4 + 0.4) * dpr, vx: (Math.random() - 0.5) * 0.25 * dpr, vy: (-Math.random() * 0.35 - 0.05) * dpr, a: Math.random() * 0.6 + 0.2 });
    var raf, running = true;
    (function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.y < 0) p.y = h;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = "#CFDAFF";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    })();
    return function () { running = false; cancelAnimationFrame(raf); };
  }

  /* Parallax del hero al hacer scroll */
  gsap.to("[data-parallax-title]", { yPercent: -18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__visual", { y: -90, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__glow", { yPercent: 30, scale: 1.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

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
    gsap.to(track, {
      x: function () { return -distance(); }, ease: "none",
      scrollTrigger: { trigger: section, start: "top top", end: function () { return "+=" + distance(); }, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 }
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

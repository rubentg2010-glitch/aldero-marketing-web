/* García Laminados y Vinilos — interacción y animaciones */
(() => {
const BASE = window.GL_BASE || "";
const D = document, B = D.body;
const WA = B.dataset.wa || "34632106364";
const MAIL = B.dataset.mail || "laminadosgarcia@hotmail.com";
const IMG = window.PIMG || {};
const PROD = window.GL_PRODUCTS || [];
const SHOW = 6;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasG = !!window.gsap && !reduce;
if (!hasG) B.classList.add("no-anim");
const waLink = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- catálogo por colecciones ---------- */
for (const box of D.querySelectorAll(".models")) {
  const col = box.dataset.col, name = box.dataset.name;
  const list = PROD.filter(p => p.c === col);
  const grid = box.querySelector(".mgrid");
  grid.innerHTML = list.map((p, i) => {
    const im = p.img ? [p.img, p.img2].filter(Boolean) : IMG[p.s];
    const ph = im && im.length
      ? `<div class="ph"><img src="${esc(im[0])}" alt="Suelo Roble ${esc(p.n)}, colección ${esc(name)}" loading="lazy">${im[1] ? `<img src="${esc(im[1])}" alt="" loading="lazy">` : ""}</div>`
      : `<div class="ph ph-tmp" role="img" aria-label="Imagen provisional del modelo ${esc(p.n)}"><span>Imagen provisional</span></div>`;
    return `<article class="model"${i >= SHOW ? " hidden" : ""}>${ph}<h5>Roble ${esc(p.n)}</h5><div class="meta"><span>${esc(name)}</span><b>${esc(p.p)}</b></div><a class="tlink" href="${waLink(`Hola, me interesa el suelo Roble ${p.n} (${name}). ¿Me podéis dar información y presupuesto?`)}" target="_blank" rel="noopener">Solicitar información →</a></article>`;
  }).join("");
  box.querySelector(".mh span").textContent = `${list.length} acabados · precio por m²`;
  const more = box.querySelector(".more");
  if (list.length <= SHOW) more.remove();
  else {
    more.textContent = `Ver todos los acabados (${list.length})`;
    more.addEventListener("click", () => {
      const open = more.dataset.open === "1";
      grid.querySelectorAll(".model").forEach((m, i) => { if (i >= SHOW) m.hidden = open; });
      more.dataset.open = open ? "0" : "1";
      more.textContent = open ? `Ver todos los acabados (${list.length})` : "Ver menos acabados";
      refresh();
    });
  }
}
for (const btn of D.querySelectorAll("[data-explore]")) {
  const box = D.getElementById(btn.getAttribute("aria-controls"));
  btn.addEventListener("click", () => {
    const open = !box.classList.contains("open");
    box.classList.toggle("open", open);
    box.querySelector(".in").inert = !open;
    btn.setAttribute("aria-expanded", open);
    btn.querySelector("span").textContent = open ? "Ocultar acabados" : "Explorar colección";
    if (open && hasG) gsap.fromTo(box.querySelectorAll(".model:not([hidden])"), {y: 30, opacity: 0}, {y: 0, opacity: 1, duration: .8, stagger: .06, ease: "power3.out", delay: .25});
    setTimeout(() => { refresh(); if (open) go(box, -110); }, 450);
  });
  box.querySelector(".in").inert = true;
}

/* ---------- menú ---------- */
const top = D.getElementById("top"), drawer = D.getElementById("drawer"), burger = D.getElementById("burger");
if (top && drawer && burger) {
const setTop = () => top.classList.toggle("solid", scrollY > 60);
addEventListener("scroll", setTop, {passive: true}); setTop();
const openD = () => { drawer.classList.add("open"); burger.setAttribute("aria-expanded", "true"); drawer.inert = false; B.classList.add("locked"); D.getElementById("close").focus(); };
const shut = () => { drawer.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); drawer.inert = true; B.classList.remove("locked"); };
drawer.inert = true;
burger.addEventListener("click", openD);
D.getElementById("close").addEventListener("click", () => { shut(); burger.focus(); });
drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", shut));
addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("open")) { shut(); burger.focus(); } });
}
/* sección activa */
const links = [...D.querySelectorAll(".menu a")];
const io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) links.forEach(a => a.classList.toggle("act", a.getAttribute("href") === "#" + e.target.id)); }, {rootMargin: "-45% 0px -50% 0px"});
links.forEach(a => { const s = D.querySelector(a.getAttribute("href")); if (s && s.tagName === "SECTION") io.observe(s); });

/* ---------- formulario (WhatsApp o correo, sin simular envíos) ---------- */
const form = D.getElementById("form"), fmsg = D.getElementById("fmsg");
let via = "wa";
if (form) {
form.querySelectorAll("button[type=submit]").forEach(b => b.addEventListener("click", () => via = b.dataset.v));
form.addEventListener("submit", e => {
  e.preventDefault();
  const v = id => D.getElementById(id).value.trim();
  fmsg.textContent = "";
  if (!v("f-n") || !v("f-t")) { fmsg.textContent = "Indica tu nombre y un teléfono para poder contactarte."; D.getElementById(v("f-n") ? "f-t" : "f-n").focus(); return; }
  const txt = `Hola, soy ${v("f-n")} (tel. ${v("f-t")}${v("f-e") ? ", " + v("f-e") : ""}). Me interesa: ${v("f-p")}. ${v("f-m")}`.trim();
  const url = via === "wa" ? waLink(txt) : `mailto:${MAIL}?subject=${encodeURIComponent("Solicitud de presupuesto: " + v("f-p"))}&body=${encodeURIComponent(txt)}`;
  let w = true;
  if (via === "wa") { w = window.open(url, "_blank"); if (w) w.opener = null; } else location.href = url;
  const a = D.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; a.className = "btn b-light";
  a.textContent = via === "wa" ? "Abrir WhatsApp" : "Abrir el correo";
  fmsg.append(via === "wa" ? (w ? "Se ha abierto WhatsApp con tu mensaje. Solo tienes que pulsar enviar. " : "Pulsa el botón para abrir WhatsApp con tu mensaje. ") : "Se abrirá tu correo con el mensaje preparado. Si no se abre: ", a);
});
}

/* ---------- cursor ---------- */
const cur = D.getElementById("cur");
if (cur && matchMedia("(pointer:fine) and (min-width:1024px)").matches && !reduce) {
  addEventListener("mousemove", e => { cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, {passive: true});
  D.addEventListener("mouseover", e => cur.classList.toggle("big", !!e.target.closest("a,button,.model,.sv,.gal figure")));
}

/* ---------- desplazamiento suave ---------- */
let lenis = null;
const refresh = () => window.ScrollTrigger && ScrollTrigger.refresh();
const go = (t, off = -80) => lenis ? lenis.scrollTo(t, {offset: off, duration: 1.2}) : t.scrollIntoView({behavior: reduce ? "auto" : "smooth"});
D.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
  const id = a.getAttribute("href"); if (id.length < 2) return;
  const t = D.querySelector(id); if (!t) return;
  e.preventDefault(); go(t); history.replaceState(null, "", id);
}));

/* ---------- titular por palabras ---------- */
const h1 = D.getElementById("h1");
/* el titular se escribe letra a letra (palabras agrupadas para que no se partan) */
const splitChars = el => { const walk = n => [...n.childNodes].map(c => c.nodeType === 3 ? c.textContent.split(/(\s+)/).map(w => w.trim() ? `<span class="w">${[...w].map(ch => `<span class="ch">${ch}</span>`).join("")}</span>` : w).join("") : (c.innerHTML = walk(c), c.outerHTML)).join(""); el.innerHTML = walk(el) + '<span class="caret" aria-hidden="true"></span>'; };
if (hasG && h1) { h1.setAttribute("aria-label", h1.textContent); splitChars(h1); gsap.set("#h1 .ch", {opacity: 0}); }
const heroIn = () => {
  if (!hasG || !h1) return;
  const chars = h1.querySelectorAll(".ch"), caret = h1.querySelector(".caret"), per = Math.min(.05, 1.5 / chars.length);
  gsap.timeline()
    .set(caret, {opacity: 1})
    .to(chars, {opacity: 1, duration: .01, stagger: {each: per, onStart() { this.targets()[0].after(caret); }}, ease: "none"})
    .to(caret, {opacity: 0, duration: .25, repeat: 3, yoyo: true, ease: "steps(1)"})
    .to(caret, {opacity: 0, duration: .2});
  gsap.from(".hero .side", {y: 30, opacity: 0, duration: 1, delay: .7, ease: "power3.out"});
  gsap.from(".hero .ph", {scale: 1.12, duration: 2.2, ease: "power3.out"});
};

/* ---------- animaciones de scroll ---------- */
if (hasG && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis && matchMedia("(pointer:fine)").matches) {
    lenis = new Lenis({lerp: .1}); window.GL_LENIS = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  }
  if (D.querySelector(".hero")) gsap.to(".hero .ph", {yPercent: 10, ease: "none", scrollTrigger: {trigger: ".hero", start: "top top", end: "bottom top", scrub: true}});
  D.querySelectorAll(".rv").forEach(el => gsap.to(el, {opacity: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: {trigger: el, start: "top 88%"}}));
  D.querySelectorAll(".mask,.tex,.feat,.gal figure").forEach(m => {
    gsap.fromTo(m, {clipPath: "inset(18% 8% 18% 8% round 28px)"}, {clipPath: "inset(0% 0% 0% 0% round 22px)", duration: 1.5, ease: "power4.out", scrollTrigger: {trigger: m, start: "top 88%"}, onComplete: () => m.style.clipPath = ""});
    const im = m.querySelector("img"); if (im) gsap.fromTo(im, {scale: 1.22}, {scale: 1, duration: 1.9, ease: "power3.out", scrollTrigger: {trigger: m, start: "top 88%"}, clearProps: "transform"});
  });
  D.querySelectorAll("[data-speed]").forEach(el => gsap.to(el, {yPercent: -parseFloat(el.dataset.speed), ease: "none", scrollTrigger: {trigger: el, start: "top bottom", end: "bottom top", scrub: true}}));
  gsap.utils.toArray(".fin h3, .coll h3, .sv h3").forEach(el => gsap.from(el, {y: 40, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: {trigger: el, start: "top 90%"}}));
  addEventListener("load", refresh);
} else {
  D.querySelectorAll(".rv").forEach(el => el.style.cssText = "opacity:1;transform:none");
}

/* ---------- intro cinematográfica ---------- */
const intro = D.getElementById("intro");
const curtain = D.getElementById("curtain");
const seen = (() => { try { return sessionStorage.getItem("gv-intro"); } catch (e) { return null; } })();
const mark = () => { try { sessionStorage.setItem("gv-intro", "1"); } catch (e) {} };
const rm = el => el && el.remove();
if (!intro) { heroIn(); return; }
const phrase = D.getElementById("phrase");
phrase.innerHTML = phrase.dataset.text.split(" ").map(w => `<span>${esc(w)}</span>`).join(" ");
const PL = [1, 2, 3, 4, 5, 2, 1, 3, 4];
const nP = innerWidth < 700 ? 5 : 9;
const planks = intro.querySelector(".planks");
const urls = PL.slice(0, nP).map(n => `${BASE}assets/img/intro/p${n}.webp`);
if (planks) planks.innerHTML = urls.map(u => `<i style="background-image:url(${u})"></i>`).join("");
/* espera a que las tablas estén decodificadas (máx. 700 ms) para que la animación vaya fluida */
const ready = Promise.race([Promise.all([...new Set(urls)].map(u => { const im = new Image(); im.src = u; return im.decode().catch(() => {}); })), new Promise(r => setTimeout(r, 700))]);
const endIntro = () => {
  mark(); B.classList.remove("locked");
  if (!hasG) { rm(intro); rm(curtain); heroIn(); return; }
  /* salida: las tablas se abren en direcciones alternas y descubren la portada */
  intro.style.background = "transparent";
  gsap.timeline({onComplete: () => { rm(intro); rm(curtain); refresh(); }})
    .to("#intro .in, #intro .bar, #intro .skip", {opacity: 0, y: -14, duration: .35, ease: "power2.in"})
    .add(() => intro.classList.remove("on"), "<")          /* las maderas se aclaran y se ven a todo color */
    .add("abrir", "+=.25")
    .to("#intro .planks i", {yPercent: i => i % 2 ? 103 : -103, duration: 1.05, stagger: {each: .07, from: "center"}, ease: "power3.inOut"}, "abrir")
    .add(heroIn, "abrir+=.15");                            /* el titular se escribe mientras se retiran las láminas */
};
if (seen || !hasG) { rm(intro); rm(curtain); heroIn(); }
else {
  B.classList.add("locked"); intro.classList.add("on");
  gsap.set("#intro .planks i", {yPercent: 102, y: 0});
  /* intro de 3 s: tablas que se instalan, logotipo, frase y apertura */
  const tl = gsap.timeline({paused: true, onComplete: endIntro, defaults: {force3D: true}});
  tl.to("#bar", {width: "100%", duration: 1.75, ease: "none"}, 0)
    .to("#intro .planks i", {yPercent: 0, duration: .75, stagger: .05, ease: "power4.out"}, 0)
    .to("#intro .logo span", {y: 0, duration: .8, ease: "power4.out"}, .5)
    .to("#intro .sub", {opacity: 1, duration: .5}, .85)
    .to("#phrase span", {opacity: 1, y: 0, stagger: .045, duration: .4, ease: "power2.out"}, .85)
    .to({}, {duration: .1});
  ready.then(() => requestAnimationFrame(() => tl.play()));
  const stop = e => { e && e.preventDefault(); tl.kill(); endIntro(); };
  D.getElementById("skip").addEventListener("click", stop);
  addEventListener("keydown", e => { if (e.key === "Escape" && D.getElementById("intro")) stop(); });
}
})();

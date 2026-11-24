/* «Recorre tu hogar» — recorrido por estancias con visualizador de materiales.
   - Fotos de estancia: window.GL_ROOM_IMG[estancia] = {img, hs, viz} (fotos propias) o, mientras no existan,
     fotos provisionales de la empresa (fb).
   - Visualizador: aplica suelos y revestimientos sobre la foto con perspectiva (visualizador.js).
     Es una simulación orientativa con texturas reales del catálogo.
   - Foto real de un acabado instalado: window.GL_LOOKS = { salon: { engelberg: "ruta.webp" } } */
(() => {
const B = window.GL_BASE || "";
const D = document;
const LOCAL = window.GL_ROOM_IMG || {};
const LOOKS = window.GL_LOOKS || {};
const IMG = window.PIMG || {};
const PROD = window.GL_PRODUCTS || [];
const WA = D.body.dataset.wa || "34632106364";
const V = window.GLViz;

const COLS = {
  helvetic: {n: "Helvetic Performance", t: "Laminado", sp: ["AC5 · Clase 33", "8 mm", "Aquastop"], tipo: "Suelo laminado"},
  pure: {n: "Pure Laminate", t: "Laminado", sp: ["AC5 · Clase 33", "8, 10 y 12 mm", "Bisel 4 lados"], tipo: "Suelo laminado"},
  rigid: {n: "RIGID LVT SPC", t: "Vinílico", sp: ["100 % resistente al agua", "5,5 mm", "Clase 23/31"], tipo: "Suelo vinílico"},
  elemental: {n: "Elemental SPC", t: "Vinílico", sp: ["Clase 33", "Capa de uso 0,55 mm", "Antideslizante"], tipo: "Suelo vinílico"},
  kobert: {n: "Kobert‑In", t: "Revestimiento", sp: ["PE: Cs2d0 · 21 diseños", "FR: Bs1d0 · 23 diseños", "100 % hidrófugo"], tipo: "Revestimiento Kobert-In"}
};
/* tonos con texturas reales de muestras del catálogo (para visualizar) */
const TONES = [
  {k: "claro", n: "Roble claro", src: B + "assets/img/srv-armarios.webp"},
  {k: "natural", n: "Roble natural", src: B + "assets/img/col-rigid.webp"},
  {k: "miel", n: "Roble miel", src: B + "assets/img/col-pure.webp"},
  {k: "medio", n: "Roble medio", src: B + "assets/img/nos-detalle.webp"},
  {k: "gris", n: "Roble gris", src: B + "assets/img/col-elemental.webp"}
];
const KOB = [
  {n: "Alto brillo", s: "alto-brillo", tex: "tex-gloss", d: "Superficie brillante y reflectante, con el aspecto de la piedra pulida.", mk: () => V.panelTex("k-gloss", "gloss", B + "assets/img/kobert.webp"), gloss: .9},
  {n: "Mate texturizado", s: "mate-texturizado", tex: "tex-matte", d: "Acabado mate con textura que imita el tacto de las superficies naturales.", mk: () => V.panelTex("k-matte", "matte"), gloss: 0},
  {n: "Ultramate", s: "ultramate", tex: "tex-ultra", d: "Superficie suave y uniforme, sin reflejos.", mk: () => V.panelTex("k-ultra", "ultra"), gloss: 0}
];
const FLOOR = ["helvetic", "pure", "rigid", "elemental"];

/* estancias: textos + configuración provisional (foto, puntos y superficies en % de la foto) */
const ROOMS = [
  {k: "entrada", n: "Entrada y recibidor", h: "La primera <em>impresión</em>", p: "El suelo marca el tono de toda la casa desde el primer paso. Pulsa el punto del suelo y prueba los tonos.", cr: "Clay Banks",
   fb: {img: B + "assets/img/nos-espacio.webp", pos: [50, 88], hs: [{x: 52, y: 80, l: "Suelo", s: "suelo", c: FLOOR}],
    viz: [{id: "suelo", poly: [[0, 61.5], [100, 59.5], [100, 100], [0, 100]], quad: [[-40, 100], [140, 100], [81.5, 60], [18.5, 60]], rep: [3.2, 1.6]}]}},
  {k: "salon", n: "Salón", h: "Donde la casa <em>se vive</em>", p: "Amplitud, calidez y una madera que no lo es. Cambia el suelo y mira cómo cambia el ambiente.", cr: "Spacejoy",
   fb: {img: B + "assets/img/gal-salon.webp", hs: [{x: 14, y: 66, l: "Suelo", s: "suelo", c: FLOOR}],
    viz: [{id: "suelo", poly: [[0, 59.5], [27.5, 61], [27.5, 70.5], [46, 71.5], [46.5, 65.5], [53.5, 66], [53.5, 70.5], [100, 69.5], [100, 92], [60, 84.5], [30, 78.5], [0, 73.5]], quad: [[-10, 92], [110, 92], [100, 58], [0, 58]], rep: [1.1, .95], rot: 1},
          {id: "pared", poly: [[24.5, 0], [59.5, 0], [59.5, 57], [47, 63], [46.5, 36], [27, 36], [24.5, 31]], occ: [[[24, 15.5], [36, 13.5], [49, 13], [50, 21], [47.5, 31], [44, 37], [28, 37.5], [25, 31], [23.8, 23]], [[29.5, 0], [46.5, 0], [44.5, 7], [39, 9.5], [37.5, 16], [33.5, 16], [32.5, 9.5], [30, 6.5]]], quad: [[22, 63], [62, 63], [62, 0], [22, 0]], rep: [1.5, .75]}]}},
  {k: "cocina", n: "Cocina", h: "Resistente <em>al agua</em>, cálida al pisar", p: "En la cocina mandan el agua y el uso intensivo: vinílicos SPC o laminado con Aquastop. Pruébalos aquí.", cr: "Zac Gudakov",
   fb: {img: B + "assets/img/hero-cocina.webp", hs: [{x: 42, y: 84, l: "Suelo", s: "suelo", c: ["rigid", "elemental", "helvetic"]}, {x: 89, y: 34, l: "Pared", s: "pared", c: ["kobert"]}],
    viz: [{id: "suelo", poly: [[12, 44], [26, 42.5], [38, 47], [70, 61.5], [76, 64], [77, 68], [100, 71], [100, 100], [0, 100], [0, 76], [7, 75], [9.5, 64.5], [12, 64]], occ: [[[17.8, 38.5], [22, 38], [25.6, 41.5], [26.2, 45.8], [24.2, 48.2], [19.2, 48], [17.6, 44.5]]], quad: [[-60, 100], [110, 100], [43.4, 55], [-2.2, 55]], rep: [1.7, .9]},
          {id: "pared", poly: [[78, 0], [100, 0], [100, 66.8], [78, 63.8]], quad: [[78, 63.8], [100, 66.8], [100, 0], [78, 0]], rep: [1.1, 1.1], soft: .45}]}},
  {k: "dormitorio", n: "Dormitorio", h: "El lugar <em>más sereno</em>", p: "Tonos naturales y tacto cálido. Un suelo que invita a descalzarse: elige el tono que más te calma.", cr: "laura adai",
   fb: {img: B + "assets/img/srv-puertas.webp", pos: [50, 92], hs: [{x: 30, y: 84, l: "Suelo", s: "suelo", c: ["pure", "helvetic", "rigid", "elemental"]}],
    viz: [{id: "suelo", poly: [[0, 63], [46, 69], [50, 72], [71, 74], [72, 90], [75, 92.5], [95, 92.5], [100, 88], [100, 100], [0, 100]], quad: [[-30, 100], [120, 100], [95, 62], [0, 62]], rep: [3, 1.4]}]}},
  {k: "bano", n: "Baño y revestimientos", h: "Paredes <em>que se transforman</em>", p: "Kobert‑In: paneles hidrófugos de gran formato que se instalan sin obra y sin polvo. Cambia el acabado de la pared.", cr: "Peter Muniz",
   fb: {img: B + "assets/img/kobert.webp", hs: [{x: 50, y: 50, l: "Pared", s: "pared", c: ["kobert"]}],
    viz: [{id: "pared", poly: [[0, 0], [100, 0], [100, 100], [0, 100]], quad: [[0, 100], [100, 100], [100, 0], [0, 0]], rep: [1.3, .65], soft: .5}]}}
];
ROOMS.forEach(r => { const l = LOCAL[r.k]; r.cfg = l ? {img: l.img || l, hs: l.hs || [], viz: l.viz || null} : r.fb; r.prov = !l; });
window.GL_ROOMS = ROOMS;
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
const strip = s => s.replace(/<[^>]+>/g, "");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const G = () => !reduce && window.gsap;

/* ---------- teaser en la página ---------- */
const strip_ = D.getElementById("rooms");
if (strip_) strip_.innerHTML = ROOMS.map((r, i) => `<button class="rcard" type="button" data-room="${i}"><span class="rimg"><img src="${esc(r.cfg.img)}" alt="" loading="lazy"></span><span class="rtx"><small>0${i + 1}</small><b>${esc(r.n)}</b></span></button>`).join("");

/* ---------- estructura ---------- */
const T = D.createElement("div");
T.id = "tour"; T.setAttribute("role", "dialog"); T.setAttribute("aria-modal", "true"); T.setAttribute("aria-label", "Recorre tu hogar"); T.hidden = true;
T.innerHTML = `
<div class="t-stage">${ROOMS.map((r, i) => `<div class="t-room" data-i="${i}"><div class="t-pic" style="--op:${(r.cfg.pos || [50, 50]).map(v => v + "%").join(" ")}"><img data-src="${esc(r.cfg.img)}" alt="${esc(r.n)}"><canvas class="t-viz" hidden aria-hidden="true"></canvas><img class="t-look" alt="" hidden></div><span class="t-sim" hidden>Simulación orientativa</span><div class="t-hs">${r.cfg.hs.map((h, j) => `<button class="hs" type="button" data-h="${j}" style="--x:${h.x};--y:${h.y}" aria-label="${esc(h.l)}: probar materiales"><i></i><span>${esc(h.l)}</span></button>`).join("")}</div></div>`).join("")}</div>
<div class="t-shade"></div>
<header class="t-top">
  <div class="t-brand"><b>García</b><span>Recorre tu hogar</span></div>
  <nav class="t-rooms" aria-label="Estancias">${ROOMS.map((r, i) => `<button type="button" data-go="${i}">${esc(r.n)}</button>`).join("")}</nav>
  <div class="t-acts"><a class="t-link" href="#laminados" data-exit>Catálogo</a><a class="t-link" href="#contacto" data-exit>Presupuesto</a><button class="t-close" type="button" aria-label="Salir del recorrido">×</button></div>
</header>
<div class="t-copy"><span class="t-num"></span><h2 class="t-h"></h2><p class="t-p"></p><div class="t-cta"><button class="btn b-light" type="button" data-mat>Probar materiales</button></div><small class="t-cr"></small></div>
<div class="t-nav"><button class="t-arrow" type="button" data-dir="-1" aria-label="Estancia anterior">←</button><div class="t-prog"><i></i></div><button class="t-arrow" type="button" data-dir="1" aria-label="Estancia siguiente">→</button></div>
<aside class="t-panel" aria-label="Materiales" hidden><button class="t-pclose" type="button" aria-label="Cerrar materiales">×</button><div class="t-pin"></div></aside>`;
D.body.append(T);
const rooms = [...T.querySelectorAll(".t-room")];
const panel = T.querySelector(".t-panel"), pin = T.querySelector(".t-pin");
let cur = 0, open = false, lastFocus = null, busy = false;

/* visualizadores (se crean al entrar en cada estancia) */
const VZ = {};
const vizFor = i => {
  const r = ROOMS[i];
  if (!V || !V.ok || !r.cfg.viz) return null;
  if (!VZ[i]) { const cv = rooms[i].querySelector(".t-viz"); VZ[i] = {viz: new V.Viz(cv, r.cfg.img, r.cfg.viz), applied: {}}; VZ[i].viz.ready.catch(() => { VZ[i].bad = true; }); }
  return VZ[i].bad ? null : VZ[i];
};
async function apply(surface, mat, label) {
  const z = vizFor(cur); if (!z) return false;
  const any = await z.viz.set(surface, mat);
  if (mat) z.applied[surface] = label; else delete z.applied[surface];
  const room = rooms[cur];
  room.querySelector(".t-viz").hidden = !any; room.querySelector(".t-sim").hidden = !any;
  if (any && G()) gsap.fromTo(room.querySelector(".t-viz"), {opacity: .35}, {opacity: 1, duration: .6, ease: "power2.out"});
  return true;
}

/* coloca los puntos según cómo recorta la pantalla la foto (object-fit: cover) */
const place = () => rooms.forEach(el => {
  const im0 = el.querySelector(".t-pic img"), W = el.clientWidth, H = el.clientHeight;
  if (!im0.naturalWidth) return;
  const r = im0.naturalWidth / im0.naturalHeight;
  let w = W, h = W / r; if (h < H) { h = H; w = H * r; }
  const pos = ROOMS[+el.dataset.i].cfg.pos || [50, 50], ox = (W - w) * pos[0] / 100, oy = (H - h) * pos[1] / 100;
  el.querySelectorAll(".hs").forEach(b => {
    const x = ox + w * (+b.style.getPropertyValue("--x")) / 100, y = oy + h * (+b.style.getPropertyValue("--y")) / 100;
    let X = Math.min(Math.max(x, 28), W - 28), Y = Math.min(Math.max(y, 120), H - 60);
    /* que no caiga encima de los textos ni de las flechas */
    for (const sel of [".t-copy", ".t-nav"]) {
      const z = T.querySelector(sel).getBoundingClientRect(), m = 34;
      if (X > z.left - m && X < z.right + m && Y > z.top - m && Y < z.bottom + m) {
        if (sel === ".t-copy" && z.right + m + 40 < W * .8) X = z.right + m + 40; else Y = z.top - m - 10;
      }
    }
    b.style.left = X + "px"; b.style.top = Y + "px";
    b.classList.toggle("l", X > W * .62);
  });
});
rooms.forEach(r => r.querySelector(".t-pic img").addEventListener("load", () => open && place()));
addEventListener("resize", () => open && place());

const setCopy = () => {
  const r = ROOMS[cur];
  T.querySelector(".t-num").textContent = `0${cur + 1} / 0${ROOMS.length}`;
  T.querySelector(".t-h").innerHTML = r.h;
  T.querySelector(".t-p").textContent = r.p;
  T.querySelector(".t-cr").textContent = r.prov ? `${r.n} · Imagen provisional de ambiente` : `${r.n} · Imagen de inspiración · Foto: ${r.cr} / Unsplash`;
  T.querySelector(".t-prog i").style.width = ((cur + 1) / ROOMS.length * 100) + "%";
  T.querySelectorAll(".t-rooms button").forEach((b, i) => b.setAttribute("aria-current", i === cur ? "true" : "false"));
  T.querySelector("[data-mat]").hidden = !r.cfg.hs.length;
};
const show = (i, dir = 1) => {
  i = (i + ROOMS.length) % ROOMS.length;
  if (busy || i === cur) return;
  const prev = rooms[cur], next = rooms[i];
  closePanel(); cur = i; setCopy(); vizFor(i);
  next.classList.add("on"); prev.classList.remove("on");
  if (G()) {
    busy = true;
    gsap.set(next, {zIndex: 2}); gsap.set(prev, {zIndex: 1});
    gsap.fromTo(next, {clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)"}, {clipPath: "inset(0 0% 0 0%)", duration: 1.1, ease: "power4.inOut", onComplete: () => { busy = false; gsap.set(next, {clearProps: "clipPath"}); }});
    gsap.fromTo(next.querySelector(".t-pic"), {scale: 1.2, xPercent: dir * 4}, {scale: 1.05, xPercent: 0, duration: 1.5, ease: "power3.out"});
    gsap.to(prev.querySelector(".t-pic"), {scale: 1.1, xPercent: -dir * 6, duration: 1.1, ease: "power4.inOut"});
    gsap.fromTo(T.querySelectorAll(".t-copy > *"), {y: 24, opacity: 0}, {y: 0, opacity: 1, duration: .8, stagger: .06, delay: .45, ease: "power3.out"});
    gsap.fromTo(next.querySelectorAll(".hs"), {scale: 0, opacity: 0}, {scale: 1, opacity: 1, duration: .6, stagger: .12, delay: .95, ease: "back.out(2)"});
  }
  place();
};
const openTour = (i = 0) => {
  const cu = D.getElementById("cur"); if (cu) cu.style.opacity = 0;
  T.querySelectorAll(".t-pic img[data-src]").forEach(im => { im.src = im.dataset.src; im.removeAttribute("data-src"); });
  lastFocus = D.activeElement; open = true; T.hidden = false;
  D.body.classList.add("locked"); window.GL_LENIS && window.GL_LENIS.stop();
  rooms.forEach(r => r.classList.remove("on")); cur = i; rooms[i].classList.add("on"); setCopy(); place(); vizFor(i);
  if (G()) {
    gsap.fromTo(T, {clipPath: "circle(0% at 50% 60%)"}, {clipPath: "circle(150% at 50% 60%)", duration: 1.1, ease: "power4.inOut", onComplete: () => gsap.set(T, {clearProps: "clipPath"})});
    gsap.fromTo(rooms[i].querySelector(".t-pic"), {scale: 1.3}, {scale: 1.05, duration: 1.9, ease: "power3.out"});
    gsap.fromTo(T.querySelectorAll(".t-copy > *, .t-top, .t-nav"), {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: .9, stagger: .05, delay: .45, ease: "power3.out"});
    gsap.fromTo(rooms[i].querySelectorAll(".hs"), {scale: 0, opacity: 0}, {scale: 1, opacity: 1, duration: .6, stagger: .12, delay: 1, ease: "back.out(2)"});
  }
  T.querySelector(".t-close").focus();
};
const closeTour = then => {
  closePanel();
  const done = () => { const cu = D.getElementById("cur"); if (cu) cu.style.opacity = ""; T.hidden = true; open = false; D.body.classList.remove("locked"); window.GL_LENIS && window.GL_LENIS.start(); if (then) then(); else lastFocus && lastFocus.focus(); };
  if (G()) gsap.to(T, {opacity: 0, duration: .45, ease: "power2.out", onComplete: () => { gsap.set(T, {clearProps: "opacity"}); done(); }}); else done();
};

/* ---------- panel de materiales ---------- */
let H = null, col = null, sel = null;
const modelImg = p => p.img || (IMG[p.s] && IMG[p.s][0]);
const sw = p => { const im = modelImg(p); return im ? `<img src="${esc(im)}" alt="">` : `<span class="tmp">Imagen provisional</span>`; };
function renderPanel() {
  const r = ROOMS[cur], z = vizFor(cur), isK = col === "kobert", C = COLS[col];
  const items = isK ? KOB : PROD.filter(p => p.c === col);
  if (!sel || !items.includes(sel)) sel = items[0];
  const applied = z && z.applied[H.s];
  const canViz = !!z;
  const look = !isK && LOOKS[r.k] && LOOKS[r.k][sel.s];
  pin.innerHTML = `
    <span class="eyebrow">${esc(r.n)} · ${esc(H.l)}</span>
    <h3>${isK ? "Cambia la <em>pared</em>" : "Prueba el <em>suelo</em>"}</h3>
    ${canViz && !isK ? `<div class="t-sec"><b>Visualiza un tono</b><span>Texturas reales de nuestras muestras</span></div>
      <div class="t-tones"><button type="button" class="t-tone${!applied ? " on" : ""}" data-tone=""><span class="th orig">Original</span><b>Original</b></button>${TONES.map(t => `<button type="button" class="t-tone${applied === t.n ? " on" : ""}" data-tone="${t.k}"><span class="th"><img src="${esc(t.src)}" alt=""></span><b>${esc(t.n)}</b></button>`).join("")}</div>` : ""}
    ${H.c.length > 1 ? `<div class="t-sec"><b>Colecciones</b><span>Elige el modelo que quieres pedir</span></div><div class="t-chips" role="tablist">${H.c.map(c => `<button type="button" role="tab" aria-selected="${c === col}" data-col="${c}">${esc(COLS[c].n)}<small>${esc(COLS[c].t)}</small></button>`).join("")}</div>` : ""}
    ${isK && canViz ? `<div class="t-sec"><b>Elige un acabado</b><span>Se aplica en la pared</span></div>` : ""}
    <div class="t-sw">${isK && canViz ? `<button type="button" class="t-it${!applied ? " on" : ""}" data-orig><span class="th orig">Original</span><b>Original</b></button>` : ""}${items.map(p => `<button type="button" class="t-it${p === sel && (!isK || !canViz || applied === p.n) ? " on" : ""}" data-s="${esc(p.s)}"><span class="th ${p.tex ? "tex " + p.tex : ""}">${p.tex ? "" : sw(p)}</span><b>${isK ? "" : "Roble "}${esc(p.n)}</b></button>`).join("")}</div>
    <div class="t-det">
      <div class="t-big ${sel.tex ? "tex " + sel.tex : ""}">${sel.tex ? '<span class="lbl">Representación</span>' : sw(sel)}</div>
      <div><small>${esc(C.n)}${isK ? "" : " · " + esc(C.t)}</small><h4>${isK ? "" : "Roble "}${esc(sel.n)}</h4>${isK ? `<p>${esc(sel.d)}</p>` : `<p class="pr">${esc(sel.p)}</p>`}<ul>${C.sp.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div>
    </div>
    <p class="t-vis">${look ? `<button type="button" class="tlink" data-look>Ver foto real de este acabado en la estancia</button>` : (canViz ? (isK ? "La pared muestra una simulación orientativa del acabado." : (modelImg(sel) ? "Al elegir el modelo se aplica su textura en el suelo." : "Este modelo aún no tiene foto: prueba arriba el tono más parecido o pide la muestra.")) : "Pide la muestra y te la llevamos.")}</p>
    <div class="t-pacts">
      <a class="btn b-wa" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(`Hola, me interesa el acabado ${isK ? "Kobert-In " + sel.n : "Roble " + sel.n + " (" + C.n + ")"} para ${strip(r.n).toLowerCase()}.${applied && !isK ? " He probado el tono «" + applied + "» en el visualizador." : ""} ¿Me podéis dar información y presupuesto?`)}">Me interesa este acabado</a>
      <button class="btn b-line" type="button" data-form>Pedir presupuesto</button>
    </div>
    <a class="t-all" href="${isK ? "#revestimientos" : (col === "rigid" || col === "elemental" ? "#vinilicos" : "#laminados")}" data-exit>Ver la colección completa en el catálogo →</a>`;
  pin.querySelectorAll("[data-col]").forEach(b => b.onclick = () => { col = b.dataset.col; sel = null; renderPanel(); });
  pin.querySelectorAll("[data-tone]").forEach(b => b.onclick = async () => {
    const t = TONES.find(x => x.k === b.dataset.tone);
    pin.querySelectorAll(".t-tone").forEach(x => x.classList.toggle("on", x === b));
    if (!t) await apply(H.s, null); else await apply(H.s, {key: "t-" + t.k, canvas: await V.plankTex("t-" + t.k, t.src)}, t.n);
    renderPanel();
  });
  const orig = pin.querySelector("[data-orig]");
  if (orig) orig.onclick = async () => { await apply(H.s, null); renderPanel(); };
  pin.querySelectorAll(".t-it[data-s]").forEach(b => b.onclick = async () => {
    sel = items.find(p => p.s === b.dataset.s);
    if (isK && canViz) await apply(H.s, {key: "k-" + sel.s, canvas: await sel.mk(), gloss: sel.gloss}, sel.n);
    else if (!isK && canViz && modelImg(sel)) await apply(H.s, {key: "m-" + sel.s, canvas: await V.plankTex("m-" + sel.s, modelImg(sel))}, "Roble " + sel.n);
    renderPanel();
  });
  const lb = pin.querySelector("[data-look]");
  if (lb) lb.onclick = () => { const L = rooms[cur].querySelector(".t-look"); L.src = look; L.alt = `${r.n} con suelo Roble ${sel.n}`; L.hidden = false; if (G()) gsap.fromTo(L, {opacity: 0}, {opacity: 1, duration: .9}); };
  pin.querySelector("[data-form]").onclick = () => toForm(C.tipo, `Me interesa ${isK ? "Kobert-In, acabado " + sel.n : "el suelo Roble " + sel.n + " (" + C.n + ")"} para ${strip(r.n).toLowerCase()}.${applied && !isK ? " Tono probado: " + applied + "." : ""}`);
  pin.querySelectorAll("[data-exit]").forEach(bindExit);
}
function openPanel(hi) {
  H = ROOMS[cur].cfg.hs[hi]; if (!H) return; col = H.c[0]; sel = null; renderPanel();
  panel.hidden = false; T.classList.add("pan");
  rooms[cur].querySelectorAll(".hs").forEach((b, j) => b.classList.toggle("act", j === hi));
  if (G()) gsap.fromTo(panel, {xPercent: innerWidth > 820 ? 100 : 0, yPercent: innerWidth > 820 ? 0 : 100}, {xPercent: 0, yPercent: 0, duration: .7, ease: "power4.out"});
  panel.querySelector(".t-pclose").focus();
}
function closePanel() {
  if (panel.hidden) return;
  panel.hidden = true; T.classList.remove("pan");
  T.querySelectorAll(".hs.act").forEach(b => b.classList.remove("act"));
  rooms.forEach(r => { r.querySelector(".t-look").hidden = true; });
}
function toForm(tipo, msg) {
  closeTour(() => {
    const s = D.getElementById("f-p"), m = D.getElementById("f-m");
    if (s) [...s.options].forEach(o => { if (o.text === tipo) s.value = o.value; });
    if (m) m.value = msg;
    const c = D.getElementById("contacto");
    if (c) { window.GL_LENIS ? window.GL_LENIS.scrollTo(c, {offset: -80, immediate: true}) : c.scrollIntoView(); setTimeout(() => { const n = D.getElementById("f-n"); n && n.focus({preventScroll: true}); }, 300); }
  });
}
function bindExit(a) {
  a.onclick = e => { e.preventDefault(); const t = D.querySelector(a.getAttribute("href")); closeTour(() => { if (t) window.GL_LENIS ? window.GL_LENIS.scrollTo(t, {offset: -80, immediate: true}) : t.scrollIntoView(); }); };
}

/* ---------- eventos ---------- */
D.querySelectorAll("[data-tour]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openTour(+(b.dataset.tour || 0)); }));
strip_ && strip_.querySelectorAll("[data-room]").forEach(b => b.addEventListener("click", () => openTour(+b.dataset.room)));
T.querySelector(".t-close").onclick = () => closeTour();
T.querySelectorAll("[data-dir]").forEach(b => b.onclick = () => show(cur + +b.dataset.dir, +b.dataset.dir));
T.querySelectorAll("[data-go]").forEach(b => b.onclick = () => show(+b.dataset.go, +b.dataset.go >= cur ? 1 : -1));
T.querySelectorAll(".hs").forEach(b => b.onclick = () => openPanel(+b.dataset.h));
T.querySelector("[data-mat]").onclick = () => openPanel(0);
T.querySelector(".t-pclose").onclick = () => { closePanel(); const b = rooms[cur].querySelector(".hs"); b && b.focus(); };
T.querySelectorAll(".t-top [data-exit]").forEach(bindExit);
D.addEventListener("keydown", e => {
  if (!open) return;
  if (e.key === "Escape") { panel.hidden ? closeTour() : closePanel(); }
  else if (e.key === "ArrowRight" && panel.hidden) show(cur + 1, 1);
  else if (e.key === "ArrowLeft" && panel.hidden) show(cur - 1, -1);
  else if (e.key === "Tab") {
    const f = [...T.querySelectorAll("button,a[href]")].filter(x => x.offsetParent !== null && !x.closest("[hidden]"));
    if (!f.length) return; const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && D.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && D.activeElement === z) { e.preventDefault(); a.focus(); }
  }
});
let sx = null, sy = 0;
T.addEventListener("pointerdown", e => { if (e.target.closest(".hs,.t-panel,button,a")) return; sx = e.clientX; sy = e.clientY; });
T.addEventListener("pointerup", e => { if (sx === null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) && panel.hidden) show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); });
if (matchMedia("(pointer:fine)").matches && !reduce) T.addEventListener("mousemove", e => { if (!window.gsap || busy) return; gsap.to(rooms[cur].querySelector(".t-pic"), {x: (e.clientX / innerWidth - .5) * -18, y: (e.clientY / innerHeight - .5) * -12, duration: 1.2, ease: "power2.out"}); });
window.GL_TOUR = {open: openTour, close: closeTour, show: i => show(i, 1), apply, openPanel};
})();

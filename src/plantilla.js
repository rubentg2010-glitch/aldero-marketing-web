// Plantillas de los bocetos de "Tu web de ejemplo". La IA solo escribe el texto;
// el diseño sale de aquí, para que siempre tenga calidad y no parezca "hecho con IA".

const I = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</g></svg>`;

export const ICONOS = {
  herramienta: I('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L3.6 17.1a1.9 1.9 0 0 0 2.7 2.7l5.7-5.7a4 4 0 0 0 5.1-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>'),
  coche: I('<path d="M5 16h14M3.5 16v-3.2L5.7 8a2 2 0 0 1 1.8-1.1h9a2 2 0 0 1 1.8 1.1l2.2 4.8V16"/><path d="M3.5 13h17"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/>'),
  corazon: I('<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z"/><path d="M7.5 12h2.3l1.2-2 2 4 1.2-2h2.3"/>'),
  diente: I('<path d="M7.5 4C5.3 4 4 5.8 4 8c0 2.3 1 3.6 1.4 6 .4 2.6.9 6 2.4 6 1.6 0 1.6-4.5 4.2-4.5s2.6 4.5 4.2 4.5c1.5 0 2-3.4 2.4-6 .4-2.4 1.4-3.7 1.4-6 0-2.2-1.3-4-3.5-4-1.8 0-2.6 1-4.5 1S9.3 4 7.5 4z"/>'),
  plato: I('<path d="M5 3v7a2 2 0 0 0 2 2v9M9 3v7a2 2 0 0 1-2 2M7 3v5"/><path d="M17 21V3c-2 1.5-3 4-3 7 0 2 1 3 3 3"/>'),
  copa: I('<path d="M7 3h10l-.6 5A4.5 4.5 0 0 1 12 12a4.5 4.5 0 0 1-4.4-4L7 3zM12 12v8M8 20h8"/><path d="M7.5 7h9"/>'),
  tijeras: I('<circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M8.2 7.6 20 18M8.2 16.4 20 6M13 12h.01"/>'),
  estrella: I('<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>'),
  casa: I('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5M10 20v-5h4v5"/>'),
  martillo: I('<path d="m14 6 4 4M15.5 4.5l4 4-2.5 2.5-4-4zM13 7.5 4 16.5a1.8 1.8 0 0 0 2.5 2.5l9-9"/>'),
  hoja: I('<path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15"/><path d="M5 19 13 11"/>'),
  escudo: I('<path d="M12 3 5 6v5c0 4.5 3 8.3 7 9.5 4-1.2 7-5 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>'),
  reloj: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  chat: I('<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>'),
  grafica: I('<path d="M4 20h16M6 16l4-5 3 3 5-7"/><path d="M15 7h3v3"/>'),
  bolsa: I('<path d="M5 8h14l-1 12H6zM9 8V6.5a3 3 0 0 1 6 0V8"/>'),
  persona: I('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>'),
  rayo: I('<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>'),
  check: I('<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.4 2.4 4.6-4.8"/>'),
  mapa: I('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>'),
  pincel: I('<path d="M18.5 3.5a2 2 0 0 1 2.8 2.8L13 14.6l-3.6-3.6z"/><path d="M9.4 11c-2.4 0-4 1.6-4 4 0 1.6-.8 2.7-2.4 3 1.5 1.4 3.3 2 5 2 3 0 4.6-2 4.6-4.6"/>'),
  documento: I('<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>'),
};

export const ESTILOS = {
  oscuro: { nombre: "Oscuro y moderno" },
  claro: { nombre: "Claro y elegante" },
  vivo: { nombre: "Colorido y alegre" },
};

export const SECTORES = {
  taller: {
    nombre: "Taller mecánico", iconos: ["herramienta", "coche", "escudo", "reloj", "rayo", "check"],
    servicios: ["Revisión y mantenimiento", "Frenos y suspensión", "Diagnosis electrónica"],
    hero: "Tu coche, en buenas manos en {ciudad}", heroTexto: "te decimos qué le pasa a tu coche y cuánto cuesta arreglarlo antes de tocar nada.",
    textoServicio: "Te explicamos qué hay que hacer y te damos presupuesto antes de empezar.",
    ventajas: ["Presupuesto antes de empezar", "Te explicamos cada reparación", "Contacto directo por WhatsApp"],
    sobre: "Trabajamos con cuidado, explicando cada reparación y sin sorpresas en la factura.",
  },
  clinica: {
    nombre: "Clínica", iconos: ["corazon", "persona", "escudo", "reloj", "check", "diente"],
    servicios: ["Primera consulta", "Tratamientos", "Seguimiento"],
    hero: "Cuidamos de tu salud en {ciudad}", heroTexto: "te atendemos con calma y te explicamos cada paso del tratamiento.",
    textoServicio: "Te atendemos con calma y te explicamos todo con claridad.",
    ventajas: ["Atención cercana", "Explicaciones claras", "Cita fácil por WhatsApp"],
    sobre: "Nuestro objetivo es que cada paciente se sienta escuchado y sepa en todo momento qué estamos haciendo.",
  },
  restaurante: {
    nombre: "Restaurante", iconos: ["plato", "copa", "estrella", "reloj", "mapa", "chat"],
    servicios: ["Nuestra carta", "Menú del día", "Reservas para grupos"],
    hero: "Ven a comer bien en {ciudad}", heroTexto: "cocinamos con producto de calidad y te reservamos mesa en un mensaje.",
    textoServicio: "Cocina hecha con cariño y producto de calidad.",
    ventajas: ["Reserva en un mensaje", "Producto de calidad", "Ambiente cercano"],
    sobre: "Queremos que cada visita se note: buena comida, buen trato y ganas de volver.",
  },
  peluqueria: {
    nombre: "Peluquería y estética", iconos: ["tijeras", "estrella", "pincel", "corazon", "reloj", "persona"],
    servicios: ["Corte y peinado", "Color", "Tratamientos"],
    hero: "Sal de aquí sintiéndote bien", heroTexto: "te asesoramos para que salgas con un resultado que te encante.",
    textoServicio: "Te asesoramos para conseguir el resultado que buscas.",
    ventajas: ["Asesoramiento personal", "Cita por WhatsApp", "Resultados que se notan"],
    sobre: "Escuchamos lo que quieres y te aconsejamos con sinceridad para que el resultado te encante.",
  },
  tienda: {
    nombre: "Tienda", iconos: ["bolsa", "estrella", "check", "mapa", "chat", "rayo"],
    servicios: ["Nuestros productos", "Asesoramiento", "Encargos"],
    hero: "Lo que buscas, en {ciudad}", heroTexto: "te asesoramos para que te lleves justo lo que necesitas.",
    textoServicio: "Te ayudamos a elegir lo que de verdad necesitas.",
    ventajas: ["Atención personalizada", "Productos seleccionados", "Pregunta por WhatsApp"],
    sobre: "Seleccionamos cada producto con cuidado y te atendemos como nos gusta que nos atiendan.",
  },
  profesional: {
    nombre: "Servicios profesionales", iconos: ["documento", "persona", "escudo", "grafica", "chat", "check"],
    servicios: ["Primera consulta", "Gestión completa", "Asesoramiento continuo"],
    hero: "Te lo ponemos fácil", heroTexto: "te explicamos tu caso sin tecnicismos y nos encargamos de lo complicado.",
    textoServicio: "Te lo explicamos claro y nos encargamos del papeleo.",
    ventajas: ["Trato directo", "Sin tecnicismos", "Respuesta rápida"],
    sobre: "Trabajamos de forma cercana y clara, para que siempre sepas en qué punto está tu asunto.",
  },
  reformas: {
    nombre: "Reformas", iconos: ["martillo", "casa", "pincel", "herramienta", "check", "reloj"],
    servicios: ["Reformas integrales", "Cocinas y baños", "Pintura y acabados"],
    hero: "Reformas bien hechas en {ciudad}", heroTexto: "te damos presupuesto cerrado y cumplimos lo que acordamos.",
    textoServicio: "Presupuesto claro y trabajo bien rematado.",
    ventajas: ["Presupuesto sin compromiso", "Trabajo limpio", "Plazos claros"],
    sobre: "Cuidamos cada detalle de la obra y te mantenemos informado de principio a fin.",
  },
  otro: {
    nombre: "Negocio local", iconos: ["estrella", "check", "chat", "persona", "rayo", "mapa"],
    servicios: ["Servicio principal", "Asesoramiento", "Atención personalizada"],
    hero: "Lo que necesitas, en {ciudad}", heroTexto: "te atendemos de forma cercana y te respondemos rápido.",
    textoServicio: "Te atendemos de forma cercana y sin complicaciones.",
    ventajas: ["Trato cercano", "Respuesta rápida", "Contacto por WhatsApp"],
    sobre: "Nos gusta hacer las cosas bien y tratar a cada cliente como se merece.",
  },
};

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function hexRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lum([r, g, b]) {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function mix(h, w, t) {
  const a = hexRgb(h), b = hexRgb(w);
  return "#" + a.map((c, i) => Math.round(c + (b[i] - c) * t).toString(16).padStart(2, "0")).join("");
}
// Ajusta el color de acento para que se lea bien sobre el fondo del estilo.
function acentoLegible(color, fondoOscuro) {
  let c = color;
  for (let i = 0; i < 8; i++) {
    const L = lum(hexRgb(c));
    if (fondoOscuro && L < 0.12) c = mix(c, "#ffffff", 0.18);
    else if (!fondoOscuro && L > 0.45) c = mix(c, "#000000", 0.15);
    else break;
  }
  return c;
}

const MARCA =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260"><text x="210" y="130" transform="rotate(-24 210 130)" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#888">EJEMPLO IA · ALDERO</text></svg>`,
  );

export function renderBoceto(b) {
  const d = b.datos;
  const c = b.contenido;
  const sec = SECTORES[d.sector] || SECTORES.otro;
  const estilo = ESTILOS[d.estilo] ? d.estilo : "oscuro";
  const oscuro = estilo === "oscuro";
  const acc = acentoLegible(d.color || "#2D5BFF", oscuro);
  const sobreAcc = lum(hexRgb(acc)) > 0.42 ? "#111111" : "#ffffff";
  const tel = d.telefono ? d.telefono.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4") : "";
  const ini = esc((d.negocio || "?").trim().charAt(0).toUpperCase());
  const iconoHero = ICONOS[sec.iconos[0]];
  const anio = new Date(b.creado).getFullYear();

  const pal = {
    oscuro: { bg: "#0B0C10", bg2: "#13151B", line: "rgba(255,255,255,.09)", text: "#F2F2F0", muted: "#A0A3AD", head: "'Bricolage', 'Arial Narrow', sans-serif", headW: 750, headS: "78%", headT: "uppercase", headLs: "-.01em" },
    claro: { bg: "#F7F4EE", bg2: "#FFFFFF", line: "rgba(20,18,14,.1)", text: "#1C1A17", muted: "#6B665E", head: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif", headW: 500, headS: "100%", headT: "none", headLs: "-.02em" },
    vivo: { bg: "#FFFFFF", bg2: "#F4F5F8", line: "rgba(10,12,20,.09)", text: "#10121A", muted: "#5C6070", head: "'Bricolage', 'Arial Rounded MT Bold', sans-serif", headW: 800, headS: "100%", headT: "none", headLs: "-.035em" },
  }[estilo];

  const servicios = c.servicios
    .map(
      (x, i) => `<article class="card">
        <span class="card__ico">${ICONOS[x.icono] || ICONOS.estrella}</span>
        <span class="card__n">0${i + 1}</span>
        <h3>${esc(x.titulo)}</h3>
        <p>${esc(x.texto)}</p>
      </article>`,
    )
    .join("");
  const ventajas = c.ventajas.map((v) => `<li>${ICONOS.check}<span>${esc(v)}</span></li>`).join("");
  const chips = c.ventajas.slice(0, 3).map((v) => `<span class="chip">${esc(v)}</span>`).join("");
  const proceso = c.proceso.map((p, i) => `<li><span class="step__n">${i + 1}</span><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></li>`).join("");
  const faq = c.faq.map((f, i) => `<details${i === 0 ? " open" : ""}><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`).join("");

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="data:,">
<title>${esc(d.negocio)} · Ejemplo generado con IA · ALDERO</title>
<style>
@font-face{font-family:"Bricolage";src:url(/assets/fonts/bricolage.woff2) format("woff2");font-weight:200 800;font-stretch:75% 100%;font-display:swap}
@font-face{font-family:"Geist";src:url(/assets/fonts/geist.woff2) format("woff2");font-weight:100 900;font-display:swap}
:root{--bg:${pal.bg};--bg2:${pal.bg2};--line:${pal.line};--text:${pal.text};--muted:${pal.muted};--acc:${acc};--on-acc:${sobreAcc};--head:${pal.head};--r:${estilo === "claro" ? "6px" : estilo === "vivo" ? "26px" : "18px"}}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:110px}
body{font-family:"Geist",system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg);color:var(--text);line-height:1.55;-webkit-font-smoothing:antialiased;padding-top:44px}
a{color:inherit;text-decoration:none}
h1,h2,h3{font-family:var(--head);font-weight:${pal.headW};font-stretch:${pal.headS};text-transform:${pal.headT};letter-spacing:${pal.headLs};line-height:1.02}
.wrap{width:min(1160px,calc(100% - 40px));margin:0 auto}
/* aviso fijo */
.aviso{position:fixed;inset:0 0 auto;z-index:100;background:#07080B;color:#E9EAEE;font:500 13px/1.3 "Geist",system-ui,sans-serif;display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 16px;text-align:center;border-bottom:1px solid #2D5BFF}
.aviso b{color:#7D9BFF;letter-spacing:.08em;font-size:11.5px;flex:none}.aviso__s{display:none}
.marca{position:fixed;inset:0;z-index:90;pointer-events:none;background:url("${MARCA}") repeat;opacity:${oscuro ? ".09" : ".11"}}
/* nav */
.nav{position:sticky;top:44px;z-index:20;background:color-mix(in srgb,var(--bg) 86%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;height:70px;gap:20px}
.logo{display:flex;align-items:center;gap:12px;font-family:var(--head);font-weight:${pal.headW};font-stretch:${pal.headS};font-size:20px;letter-spacing:${pal.headLs}}
.logo__m{width:38px;height:38px;border-radius:${estilo === "claro" ? "50%" : "11px"};background:var(--acc);color:var(--on-acc);display:grid;place-items:center;font-size:19px}
.nav__links{display:flex;gap:28px;font-size:15px;color:var(--muted)}
.nav__links a:hover{color:var(--text)}
.btn{white-space:nowrap;display:inline-flex;align-items:center;gap:10px;padding:14px 24px;border-radius:999px;font-weight:600;font-size:15.5px;border:1px solid transparent;transition:transform .2s,box-shadow .2s}
.btn--acc{background:var(--acc);color:var(--on-acc);box-shadow:0 14px 34px -14px var(--acc)}
.btn--acc:hover{transform:translateY(-2px)}
.btn--line{border-color:var(--line);color:var(--text)}
.btn svg{width:18px;height:18px}
/* hero */
.hero{position:relative;overflow:hidden;padding:clamp(56px,9vw,120px) 0 clamp(60px,8vw,110px)}
.hero::before{content:"";position:absolute;width:780px;height:780px;right:-260px;top:-300px;border-radius:50%;background:radial-gradient(circle,var(--acc) 0,transparent 62%);opacity:${oscuro ? ".28" : ".18"};filter:blur(10px)}
${estilo === "vivo" ? ".hero{background:linear-gradient(160deg,var(--acc) 0%,color-mix(in srgb,var(--acc) 70%,#000) 100%);color:var(--on-acc)}.hero::before{background:radial-gradient(circle,#fff 0,transparent 60%);opacity:.18}.hero .kick,.hero .hero__p{color:var(--on-acc);opacity:.85}.hero .btn--acc{background:var(--on-acc);color:var(--acc);box-shadow:none}.hero .btn--line{border-color:color-mix(in srgb,var(--on-acc) 40%,transparent);color:var(--on-acc)}" : ""}
.hero .wrap{position:relative;display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(30px,5vw,70px);align-items:center}
.kick{display:inline-flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--acc)}
.kick::before{content:"";width:28px;height:2px;background:currentColor}
.hero h1{font-size:clamp(42px,6.4vw,${estilo === "oscuro" ? "92px" : "80px"});margin:22px 0 24px}
.hero__p{font-size:clamp(17px,1.5vw,20px);color:var(--muted);max-width:34em}
.hero__cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px}
.visual{position:relative;aspect-ratio:4/5;border-radius:calc(var(--r) * 1.6);background:linear-gradient(150deg,color-mix(in srgb,var(--acc) 92%,#fff) 0%,var(--acc) 45%,color-mix(in srgb,var(--acc) 55%,#000) 100%);color:var(--on-acc);padding:30px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;box-shadow:0 40px 90px -40px color-mix(in srgb,var(--acc) 80%,#000)}
${estilo === "vivo" ? ".visual{background:var(--bg);color:var(--text);box-shadow:0 40px 90px -30px rgba(0,0,0,.45)}.visual .visual__ico{background:var(--acc);color:var(--on-acc)}.visual .chip{background:var(--bg2);border-color:var(--line)}" : ""}
.visual::after{content:"";position:absolute;inset:auto -30% -40% auto;width:90%;aspect-ratio:1;border-radius:50%;border:1px solid currentColor;opacity:.18}
.visual__ico{width:76px;height:76px;border-radius:22px;background:color-mix(in srgb,currentColor 14%,transparent);display:grid;place-items:center}
.visual__ico svg{width:40px;height:40px}
.visual__big{font-family:var(--head);font-weight:${pal.headW};font-stretch:${pal.headS};font-size:clamp(28px,2.6vw,38px);line-height:1.05;text-transform:${pal.headT};max-width:12em}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.chip{font-size:13px;padding:7px 13px;border-radius:999px;border:1px solid color-mix(in srgb,currentColor 30%,transparent);background:color-mix(in srgb,currentColor 8%,transparent)}
/* secciones */
section{padding:clamp(70px,9vw,120px) 0}
.sec-h{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:46px;flex-wrap:wrap}
.sec-h h2{font-size:clamp(34px,4.4vw,60px);max-width:13em}
.sec-h p{color:var(--muted);max-width:28em}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.grid--2{grid-template-columns:repeat(2,1fr)}
.card{position:relative;padding:30px;border-radius:var(--r);background:var(--bg2);border:1px solid var(--line);transition:transform .25s,border-color .25s}
.card:hover{transform:translateY(-4px);border-color:var(--acc)}
.card__ico{display:grid;place-items:center;width:52px;height:52px;border-radius:14px;background:color-mix(in srgb,var(--acc) 14%,transparent);color:var(--acc);margin-bottom:26px}
.card__ico svg{width:27px;height:27px}
.card__n{position:absolute;top:28px;right:28px;font-size:13px;color:var(--muted);font-variant-numeric:tabular-nums}
.card h3{font-size:${estilo === "oscuro" ? "24px" : "23px"};margin-bottom:10px}
.card p{color:var(--muted);font-size:15.5px}
.ventajas{background:var(--acc);color:var(--on-acc);padding:30px 0}
.ventajas ul{list-style:none;display:flex;justify-content:space-around;gap:24px;flex-wrap:wrap}
.ventajas li{display:flex;align-items:center;gap:10px;font-weight:600;font-size:16.5px}
.ventajas svg{width:22px;height:22px}
.sobre .wrap{display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,6vw,90px);align-items:start}
.sobre h2{font-size:clamp(34px,4.2vw,56px)}
.sobre__t{font-size:clamp(18px,1.6vw,21px);color:var(--muted);margin-top:22px}
.steps{list-style:none;display:grid;gap:14px}
.steps li{display:grid;grid-template-columns:auto 1fr;column-gap:20px;padding:24px;border-radius:var(--r);border:1px solid var(--line);background:var(--bg2)}
.step__n{grid-row:span 2;width:44px;height:44px;border-radius:50%;background:var(--acc);color:var(--on-acc);display:grid;place-items:center;font-weight:700}
.steps h3{font-size:21px;margin-bottom:4px}
.steps p{color:var(--muted);font-size:15.5px}
.faq{max-width:820px}
.faq details{border-bottom:1px solid var(--line);padding:22px 0}
.faq summary{cursor:pointer;list-style:none;font-weight:600;font-size:18px;display:flex;justify-content:space-between;gap:20px}
.faq summary::after{content:"+";color:var(--acc);font-size:24px;line-height:1}
.faq details[open] summary::after{content:"−"}
.faq details p{color:var(--muted);margin-top:12px}
.cierre{padding:0 0 clamp(70px,9vw,120px)}
.cierre__box{position:relative;overflow:hidden;border-radius:calc(var(--r) * 1.6);padding:clamp(40px,6vw,80px);background:var(--acc);color:var(--on-acc);display:grid;grid-template-columns:1.3fr .7fr;gap:30px;align-items:center}
.cierre__box::before{content:"";position:absolute;width:520px;height:520px;right:-160px;bottom:-260px;border-radius:50%;border:1px solid currentColor;opacity:.2}
.cierre h2{font-size:clamp(34px,4.6vw,64px)}
.cierre p{margin-top:16px;font-size:18px;opacity:.85}
.cierre__btns{display:grid;gap:12px;position:relative}
.cierre .btn{justify-content:center;background:var(--on-acc);color:var(--acc)}
.cierre .btn--line{background:transparent;color:var(--on-acc);border-color:color-mix(in srgb,var(--on-acc) 40%,transparent)}
footer{border-top:1px solid var(--line);padding:34px 0 120px;color:var(--muted);font-size:14px}
footer .wrap{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
/* pie fijo de Aldero */
.aldero{position:fixed;z-index:101;left:50%;bottom:16px;transform:translateX(-50%);width:min(760px,calc(100% - 24px));display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 12px 12px 20px;border-radius:18px;background:#07080B;color:#E9EAEE;font:500 14px/1.35 "Geist",system-ui,sans-serif;box-shadow:0 20px 50px -14px rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.1)}
.aldero a{flex:none;background:#2D5BFF;color:#fff;padding:11px 18px;border-radius:12px;font-weight:600}
@media (max-width:900px){
  .nav__links{display:none}
  .hero .wrap,.sobre .wrap,.cierre__box{grid-template-columns:1fr}
  .visual{aspect-ratio:16/11}
  .grid{grid-template-columns:1fr}
  .aviso{font-size:12px;padding:0 12px;height:44px}.aviso__l{display:none}.aviso__s{display:inline}
  .grid--2{grid-template-columns:1fr}
  .aldero{bottom:10px;padding:8px 8px 8px 14px;font-size:13px}.aldero__l{display:none}
  .aldero a{padding:10px 14px}
  .nav .btn{padding:11px 16px;font-size:14px}
}
@media (max-width:560px){
  .nav .btn{display:none}
}
</style>
</head>
<body>
<div class="aviso" role="note"><b>EJEMPLO IA</b><span class="aviso__l">Hecho automáticamente con IA. No es la web que te entregamos: la tuya la diseña a mano el equipo de Aldero.</span><span class="aviso__s">No es tu web final: la diseña a mano nuestro equipo.</span></div>
<div class="marca" aria-hidden="true"></div>

<header class="nav"><div class="wrap">
  <a class="logo" href="#inicio"><span class="logo__m">${ini}</span>${esc(d.negocio)}</a>
  <nav class="nav__links" aria-label="Menú"><a href="#servicios">Servicios</a><a href="#nosotros">Nosotros</a><a href="#preguntas">Preguntas</a><a href="#contacto">Contacto</a></nav>
  <a class="btn btn--acc" href="#contacto">${esc(c.boton)}</a>
</div></header>

<main id="inicio">
  <section class="hero"><div class="wrap">
    <div>
      <span class="kick">${esc(sec.nombre)} · ${esc(d.ciudad)}</span>
      <h1>${esc(c.hero_titulo)}</h1>
      <p class="hero__p">${esc(c.hero_texto)}</p>
      <div class="hero__cta">
        <a class="btn btn--acc" href="#contacto">${esc(c.boton)} <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
        <a class="btn btn--line" href="#servicios">Ver servicios</a>
      </div>
    </div>
    <div class="visual" aria-hidden="true">
      <span class="visual__ico">${iconoHero}</span>
      <div><p class="visual__big">${esc(c.eslogan)}</p><div class="chips">${chips}</div></div>
    </div>
  </div></section>

  <div class="ventajas"><div class="wrap"><ul>${ventajas}</ul></div></div>

  <section id="servicios"><div class="wrap">
    <div class="sec-h"><h2>Lo que hacemos por ti</h2><p>${esc(c.eslogan)}.</p></div>
    <div class="grid${c.servicios.length === 4 ? " grid--2" : ""}">${servicios}</div>
  </div></section>

  <section class="sobre" id="nosotros"><div class="wrap">
    <div><span class="kick">Nosotros</span><h2 style="margin-top:18px">${esc(c.sobre_titulo)}</h2><p class="sobre__t">${esc(c.sobre_texto)}</p></div>
    <ol class="steps">${proceso}</ol>
  </div></section>

  <section id="preguntas"><div class="wrap">
    <div class="sec-h"><h2>Preguntas frecuentes</h2></div>
    <div class="faq">${faq}</div>
  </div></section>

  <div class="cierre" id="contacto"><div class="wrap"><div class="cierre__box">
    <div><h2>${esc(c.cierre_titulo)}</h2><p>${esc(c.cierre_texto)}</p></div>
    <div class="cierre__btns">
      <a class="btn" href="#contacto">${ICONOS.chat} Escríbenos por WhatsApp</a>
      ${tel ? `<a class="btn btn--line" href="#contacto">Llamar al ${esc(tel)}</a>` : ""}
    </div>
  </div></div></div>
</main>

<footer><div class="wrap"><span>© ${anio} ${esc(d.negocio)} · ${esc(d.ciudad)}</span><span>Ejemplo generado por ALDERO MARKETING</span></div></footer>

<div class="aldero" role="complementary"><span><span class="aldero__l">¿Te imaginas tu negocio así? </span>Nuestro equipo de diseñadores te hace la de verdad, a medida.</span><a href="https://wa.me/34711553395?text=${encodeURIComponent(`Hola, he visto la web de ejemplo de ${d.negocio} (ref. ${b.id}) y quiero que me hagáis la de verdad.`)}" target="_blank" rel="noopener">Quiero la mía</a></div>
</body>
</html>`;
}

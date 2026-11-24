// "Tu web de ejemplo": el cliente deja sus datos, la IA de Cloudflare (Workers AI,
// cupo gratis diario) escribe el contenido y nosotros lo pintamos con nuestras
// plantillas (plantilla.js). El boceto se guarda en KV y a Rubén le llega un email.
import { sendMail } from "./mail.js";
import { renderBoceto, ICONOS, ESTILOS, SECTORES } from "./plantilla.js";

const MODELOS = ["@cf/google/gemma-4-26b-a4b-it", "@cf/zai-org/glm-4.7-flash"];
const LIM = { porTelefono: 2, porIp: 4, globalDia: 80 };
const TTL_BOCETO = 60 * 60 * 24 * 60; // 60 días
const TTL_CONTADOR = 60 * 60 * 36;

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function mismoOrigen(request) {
  const origin = request.headers.get("origin");
  return !origin || new URL(origin).host === new URL(request.url).host;
}

function normTel(s) {
  const d = String(s).replace(/[^\d+]/g, "").replace(/^\+?34/, "").replace(/^0034/, "");
  return /^[6789]\d{8}$/.test(d) ? d : null;
}

async function sha(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function contar(env, key, max) {
  const n = Number((await env.BOCETOS.get(key)) || 0);
  if (n >= max) return false;
  await env.BOCETOS.put(key, String(n + 1), { expirationTtl: TTL_CONTADOR });
  return true;
}

export async function crearBoceto(request, env, ctx) {
  if (!mismoOrigen(request)) return json({ ok: false, msg: "Origen no válido." }, 403);
  let f;
  try {
    f = await request.formData();
  } catch {
    return json({ ok: false, msg: "No se ha podido leer el formulario." }, 400);
  }
  const get = (k, max = 200) => String(f.get(k) || "").trim().slice(0, max);

  // Antispam
  if (get("web")) return json({ ok: false, msg: "No se ha podido crear el ejemplo." }, 400);
  const t = Number(get("t"));
  if (t && Date.now() - t < 6000) return json({ ok: false, msg: "Vas muy rápido. Espera unos segundos y vuelve a intentarlo." }, 429);

  const datos = {
    nombre: get("nombre", 80),
    telefono: normTel(get("telefono", 30)),
    email: get("email", 120),
    negocio: get("negocio", 70),
    sector: SECTORES[get("sector", 30)] ? get("sector", 30) : "otro",
    ciudad: get("ciudad", 60),
    servicios: get("servicios", 600),
    deseos: get("deseos", 1200),
    estilo: ESTILOS[get("estilo", 20)] ? get("estilo", 20) : "oscuro",
    color: /^#[0-9a-f]{6}$/i.test(get("color", 7)) ? get("color", 7) : "#2D5BFF",
  };
  if (!datos.nombre || !datos.negocio || !datos.ciudad) return json({ ok: false, msg: "Faltan datos: tu nombre, el nombre del negocio y la ciudad." }, 400);
  if (!datos.telefono) return json({ ok: false, msg: "Pon un teléfono español válido para que podamos contactarte." }, 400);
  if (datos.email && !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(datos.email)) datos.email = "";
  if (!get("acepto")) return json({ ok: false, msg: "Tienes que aceptar la política de privacidad." }, 400);

  const hoy = new Date().toISOString().slice(0, 10);
  const ip = request.headers.get("cf-connecting-ip") || "0";
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  const verUrl = new URL(`/api/boceto/ver/${id}`, request.url).toString();

  // Límites: por teléfono, por IP y cupo global del día (para no salir del plan gratis).
  const okTel = await contar(env, `n:tel:${await sha(datos.telefono)}:${hoy}`, LIM.porTelefono);
  const okIp = okTel && (await contar(env, `n:ip:${await sha(ip)}:${hoy}`, LIM.porIp));
  if (!okTel || !okIp) {
    ctx.waitUntil(avisar(env, datos, null, "Ha llegado al límite diario de ejemplos (le contactamos igualmente)."));
    return json({ ok: false, limite: true, msg: "Ya has creado los ejemplos que se pueden hacer hoy. Tenemos tus datos y te escribimos nosotros." }, 429);
  }
  const okGlobal = await contar(env, `n:global:${hoy}`, LIM.globalDia);
  if (!okGlobal) {
    ctx.waitUntil(avisar(env, datos, null, "Cupo diario de IA agotado: no se generó boceto. ¡Contáctale tú!"));
    return json({ ok: false, limite: true, msg: "Hoy hemos llegado al máximo de ejemplos automáticos. Tenemos tus datos y nuestro equipo te escribe por WhatsApp." }, 429);
  }

  let contenido = null;
  let modelo = "plantilla";
  for (const m of MODELOS) {
    try {
      contenido = await generar(env, m, datos);
      if (contenido) {
        modelo = m;
        break;
      }
    } catch (err) {
      console.error("Workers AI", m, err && err.message);
    }
  }
  if (!contenido) contenido = contenidoBase(datos);

  const boceto = { id, creado: new Date().toISOString(), modelo, datos: { ...datos, email: undefined }, contenido };
  await env.BOCETOS.put(`b:${id}`, JSON.stringify(boceto), { expirationTtl: TTL_BOCETO });
  ctx.waitUntil(avisar(env, datos, verUrl, modelo === "plantilla" ? "La IA no respondió: se usó el texto base." : `Generado con ${modelo}.`));

  return json({ ok: true, id, url: `/api/boceto/ver/${id}` });
}

export async function verBoceto(id, env) {
  const raw = await env.BOCETOS.get(`b:${id}`);
  if (!raw) {
    return new Response("Este ejemplo ya no existe o ha caducado.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }
  const html = renderBoceto(JSON.parse(raw));
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, max-age=300",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'; font-src 'self'; img-src data: 'self'; frame-ancestors 'self'; base-uri 'none'; form-action 'none'",
    },
  });
}

// ------------------------------------------------------------------ IA

function prompt(d) {
  const sector = SECTORES[d.sector].nombre;
  return [
    {
      role: "system",
      content: `Eres redactor web senior de la agencia ALDERO MARKETING (España). Escribes en español de España, cercano, claro y profesional, sin tópicos ni relleno. Tu tarea: escribir el CONTENIDO de una web de ejemplo para un negocio a partir de lo que pide su dueño. El diseño ya lo ponemos nosotros: tú solo devuelves JSON.

REGLAS IMPORTANTES:
- No inventes datos que no te han dado: nada de años de experiencia, número de clientes, premios, certificaciones, reseñas, opiniones, precios, direcciones, horarios ni nombres de personas.
- No uses emojis ni signos de exclamación en exceso. Nada de mayúsculas sostenidas.
- Usa la ciudad y el sector para que suene local y concreto.
- Si el dueño pide algo concreto (secciones, tono, servicios), respétalo.
- Iconos permitidos para los servicios: ${Object.keys(ICONOS).join(", ")}.

Devuelve SOLO un objeto JSON válido, sin texto antes ni después, con esta forma exacta:
{
  "eslogan": "frase corta de marca (máx. 8 palabras)",
  "hero_titulo": "titular potente (máx. 9 palabras)",
  "hero_texto": "1 o 2 frases que expliquen qué ofrece y por qué elegirle",
  "boton": "texto del botón principal (máx. 4 palabras)",
  "servicios": [ { "titulo": "máx. 5 palabras", "texto": "1 frase", "icono": "uno de la lista" } ],
  "ventajas": [ "3 o 4 razones cortas para elegirle (máx. 6 palabras cada una)" ],
  "sobre_titulo": "máx. 7 palabras",
  "sobre_texto": "2 o 3 frases sobre el negocio, sin inventar datos",
  "proceso": [ { "titulo": "máx. 4 palabras", "texto": "1 frase" } ],
  "faq": [ { "p": "pregunta típica de un cliente", "r": "respuesta breve y prudente" } ],
  "cierre_titulo": "llamada a la acción final (máx. 8 palabras)",
  "cierre_texto": "1 frase"
}
"servicios": entre 3 y 6. "proceso": exactamente 3 pasos. "faq": exactamente 3.`,
    },
    {
      role: "user",
      content: `Negocio: ${d.negocio}
Sector: ${sector}
Ciudad o zona: ${d.ciudad}
Servicios o productos que ofrece: ${d.servicios || "(no lo ha dicho: deduce los típicos del sector)"}
Lo que quiere para su web: ${d.deseos || "(no lo ha dicho)"}
Estilo visual elegido: ${ESTILOS[d.estilo].nombre}`,
    },
  ];
}

async function generar(env, modelo, d) {
  const out = await env.AI.run(modelo, { messages: prompt(d), max_tokens: 4096, temperature: 0.7 });
  const texto =
    (out && out.choices && out.choices[0] && out.choices[0].message && out.choices[0].message.content) ||
    (out && typeof out.response === "string" ? out.response : out && typeof out.response === "object" ? JSON.stringify(out.response) : "");
  const ini = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");
  if (ini < 0 || fin <= ini) return null;
  let c;
  try {
    c = JSON.parse(texto.slice(ini, fin + 1));
  } catch {
    return null;
  }
  return validar(c, d);
}

const s = (v, max) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

function validar(c, d) {
  if (!c || typeof c !== "object") return null;
  const base = contenidoBase(d);
  const lista = (v, n, fn) => (Array.isArray(v) ? v.map(fn).filter(Boolean).slice(0, n) : []);
  const r = {
    eslogan: s(c.eslogan, 80) || base.eslogan,
    hero_titulo: s(c.hero_titulo, 90) || base.hero_titulo,
    hero_texto: s(c.hero_texto, 260) || base.hero_texto,
    boton: s(c.boton, 30) || base.boton,
    servicios: lista(c.servicios, 6, (x) =>
      x && s(x.titulo, 50) ? { titulo: s(x.titulo, 50), texto: s(x.texto, 180), icono: ICONOS[x.icono] ? x.icono : "estrella" } : null,
    ),
    ventajas: lista(c.ventajas, 4, (x) => s(x, 60) || null),
    sobre_titulo: s(c.sobre_titulo, 70) || base.sobre_titulo,
    sobre_texto: s(c.sobre_texto, 500) || base.sobre_texto,
    proceso: lista(c.proceso, 3, (x) => (x && s(x.titulo, 40) ? { titulo: s(x.titulo, 40), texto: s(x.texto, 160) } : null)),
    faq: lista(c.faq, 3, (x) => (x && s(x.p, 120) && s(x.r, 300) ? { p: s(x.p, 120), r: s(x.r, 300) } : null)),
    cierre_titulo: s(c.cierre_titulo, 80) || base.cierre_titulo,
    cierre_texto: s(c.cierre_texto, 200) || base.cierre_texto,
  };
  if (r.servicios.length < 3) r.servicios = base.servicios;
  if (r.ventajas.length < 3) r.ventajas = base.ventajas;
  if (r.proceso.length < 3) r.proceso = base.proceso;
  if (r.faq.length < 2) r.faq = base.faq;
  return r;
}

// Texto base por si la IA falla o se agota el cupo: así el cliente siempre ve algo.
export function contenidoBase(d) {
  const sec = SECTORES[d.sector] || SECTORES.otro;
  const servs = d.servicios
    ? d.servicios.split(/[,;\n·]+/).map((x) => x.trim()).filter(Boolean).slice(0, 6)
    : [];
  const servicios = (servs.length >= 3 ? servs : sec.servicios).map((t, i) => ({
    titulo: t.charAt(0).toUpperCase() + t.slice(1, 50),
    texto: sec.textoServicio,
    icono: sec.iconos[i % sec.iconos.length],
  }));
  return {
    eslogan: `${sec.nombre} en ${d.ciudad}`,
    hero_titulo: sec.hero.replace("{ciudad}", d.ciudad),
    hero_texto: `En ${d.negocio} ${sec.heroTexto}`,
    boton: "Pide información",
    servicios,
    ventajas: sec.ventajas,
    sobre_titulo: `Así trabajamos en ${d.negocio}`,
    sobre_texto: `${d.negocio} es un negocio de ${d.ciudad}. ${sec.sobre}`,
    proceso: [
      { titulo: "Nos escribes", texto: "Cuéntanos qué necesitas por WhatsApp o por teléfono." },
      { titulo: "Te respondemos", texto: "Te explicamos las opciones y lo que cuesta, sin compromiso." },
      { titulo: "Nos ponemos", texto: "Quedamos contigo y lo hacemos como lo hemos hablado." },
    ],
    faq: [
      { p: "¿Cómo puedo pedir información?", r: "Escríbenos por WhatsApp o llámanos y te respondemos lo antes posible." },
      { p: `¿Trabajáis fuera de ${d.ciudad}?`, r: "Cuéntanos dónde estás y te decimos si podemos ayudarte." },
      { p: "¿Tiene algún compromiso pedir presupuesto?", r: "Ninguno. Te explicamos todo y decides tú." },
    ],
    cierre_titulo: "¿Hablamos?",
    cierre_texto: "Escríbenos y te respondemos lo antes posible.",
  };
}

// ------------------------------------------------------------------ aviso a Rubén

async function avisar(env, d, verUrl, nota) {
  const text = [
    "Nuevo cliente desde \"Tu web de ejemplo\" en aldero.es",
    "",
    `Nombre: ${d.nombre}`,
    `Teléfono: ${d.telefono}  →  https://wa.me/34${d.telefono}`,
    d.email ? `Email: ${d.email}` : null,
    "",
    `Negocio: ${d.negocio}`,
    `Sector: ${(SECTORES[d.sector] || SECTORES.otro).nombre}`,
    `Ciudad: ${d.ciudad}`,
    `Estilo: ${ESTILOS[d.estilo].nombre} · color ${d.color}`,
    "",
    "Servicios:",
    d.servicios || "(no lo ha dicho)",
    "",
    "Lo que quiere para su web:",
    d.deseos || "(no lo ha dicho)",
    "",
    verUrl ? `Su web de ejemplo: ${verUrl}` : "No se generó web de ejemplo.",
    nota ? `Nota: ${nota}` : null,
    "",
    "Escríbele cuanto antes, mientras tiene el ejemplo fresco.",
  ].filter((l) => l !== null).join("\n");
  try {
    await sendMail(env, { subject: `Web de ejemplo: ${d.negocio} (${d.telefono})`, text, replyTo: d.email || null });
  } catch (err) {
    console.error("Error enviando aviso de boceto", err);
  }
}

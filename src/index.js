// Worker de aldero.es: sirve la web estática (carpeta public/) y recibe el
// formulario de contacto en POST /api/contacto, que se reenvía por email a
// la dirección verificada en Cloudflare Email Routing (binding CONTACTO).
import { EmailMessage } from "cloudflare:email";

const FROM = "web@aldero.es";
const LIMITS = { nombre: 80, contacto: 120, servicio: 60, mensaje: 3000 };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/evento") return evento(request, env, ctx);
    if (url.pathname === "/api/estadisticas") return estadisticas(request, env, url);
    if (url.pathname === "/api/contacto") {
      if (request.method !== "POST") return new Response("Método no permitido", { status: 405, headers: { Allow: "POST" } });
      return contacto(request, env);
    }
    if (url.pathname.startsWith("/api/obra/rm/")) return obraRM(request, url);
    return env.ASSETS.fetch(request);
  },
};

// Fotos de obras de Reformando Málaga para su demo (/demos/reformando-malaga/).
// Se piden una vez a su web y se sirven cacheadas desde aldero.es, para no
// depender de su servidor en cada visita. Solo nombres .webp de su galería.
async function obraRM(request, url) {
  const name = url.pathname.slice("/api/obra/rm/".length);
  if (request.method !== "GET" || !/^[a-z0-9-]{3,80}\.webp$/.test(name)) return new Response("No encontrado", { status: 404 });
  const cache = caches.default;
  const key = new Request(url.origin + "/api/obra/rm/" + name);
  let res = await cache.match(key);
  if (res) return res;
  const up = await fetch("https://reformandomalaga.com/wp-content/uploads/2026/10/" + name, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; AlderoDemo/1.0)", Accept: "image/webp,image/*" },
    cf: { cacheTtl: 2592000, cacheEverything: true },
  });
  if (!up.ok || !(up.headers.get("content-type") || "").startsWith("image/")) return new Response("No disponible", { status: 502, headers: { "Cache-Control": "no-store" } });
  res = new Response(up.body, { headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=2592000, immutable", "X-Content-Type-Options": "nosniff" } });
  await cache.put(key, res.clone());
  return res;
}

async function contacto(request, env) {
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");
  const reply = (ok, msg, status = 200) =>
    wantsJson
      ? Response.json({ ok, msg }, { status, headers: { "Cache-Control": "no-store" } })
      : Response.redirect(new URL(ok ? "/?enviado=1#contacto" : "/?error=1#contacto", request.url).toString(), 303);

  // Solo aceptamos envíos desde la propia web.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return reply(false, "Origen no válido.", 403);

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(false, "No se ha podido leer el formulario.", 400);
  }
  const get = (k) => String(form.get(k) || "").trim();

  // Antispam: campo trampa oculto y tiempo mínimo para rellenarlo.
  if (get("web")) return reply(true, "Mensaje enviado.");
  const t = Number(get("t"));
  if (t && Date.now() - t < 3000) return reply(true, "Mensaje enviado.");

  const nombre = get("nombre").slice(0, LIMITS.nombre);
  const contacto = get("contacto").slice(0, LIMITS.contacto);
  const mensaje = get("mensaje").slice(0, LIMITS.mensaje);
  const servicio = get("servicio").slice(0, LIMITS.servicio);
  if (!nombre || !contacto || !mensaje) return reply(false, "Rellena tu nombre, cómo contactarte y el mensaje.", 400);
  if (!get("acepto")) return reply(false, "Tienes que aceptar la política de privacidad.", 400);
  if (/https?:\/\//i.test(nombre)) return reply(true, "Mensaje enviado.");

  const esEmail = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(contacto);
  const pagina = get("pagina").slice(0, 200);
  const cuerpo = [
    "Nuevo mensaje desde el formulario de aldero.es",
    "",
    `Nombre: ${nombre}`,
    `Contacto: ${contacto}`,
    servicio ? `Servicio: ${servicio}` : null,
    pagina ? `Página: ${pagina}` : null,
    "",
    "Mensaje:",
    mensaje,
    "",
    "—",
    esEmail ? "Puedes responder a este correo y le llegará directamente." : "Te ha dejado un teléfono: escríbele o llámale.",
  ].filter((l) => l !== null).join("\r\n");

  const headers = [
    `From: "Web Aldero" <${FROM}>`,
    `To: ${env.CONTACTO_DESTINO || "hola@aldero.es"}`,
    esEmail ? `Reply-To: ${clean(contacto)}` : null,
    `Subject: ${encodeWord(`Nuevo contacto web: ${nombre}${servicio ? " · " + servicio : ""}`)}`,
    `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`,
    `Message-ID: <${crypto.randomUUID()}@aldero.es>`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
  ].filter(Boolean);
  const raw = headers.join("\r\n") + "\r\n\r\n" + wrap(b64(cuerpo)) + "\r\n";

  try {
    await env.CONTACTO.send(new EmailMessage(FROM, env.CONTACTO_DESTINO, raw));
  } catch (err) {
    console.error("Error enviando el formulario", err);
    return reply(false, "No se ha podido enviar. Escríbenos por WhatsApp o a hola@aldero.es.", 502);
  }
  return reply(true, "Mensaje enviado.");
}

function clean(s) {
  return s.replace(/[\r\n]/g, "");
}
function b64(s) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
function wrap(s) {
  return s.replace(/.{1,76}/g, "$&\r\n").trimEnd();
}
function encodeWord(s) {
  return `=?UTF-8?B?${b64(clean(s))}?=`;
}


// ---------- Estadísticas propias, sin cookies ni IP ----------
// Cada visita o clic manda un evento anónimo: tipo, página, web de origen,
// móvil/ordenador y país. No se guarda IP, ni identificador, ni cookies.
const TIPOS = new Set(["vista", "whatsapp", "llamada", "codigo", "recomendacion", "formulario", "pegatina", "eleccion", "promo"]);
async function evento(request, env, ctx) {
  const ok = new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  if (request.method !== "POST" || !env.DB) return ok;
  const ua = request.headers.get("user-agent") || "";
  if (/bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp/i.test(ua)) return ok;
  let b;
  try { b = JSON.parse((await request.text()).slice(0, 1000)); } catch { return ok; }
  const tipo = String(b.t || "");
  if (!TIPOS.has(tipo)) return ok;
  const ruta = String(b.p || "/").replace(/[?#].*$/, "").slice(0, 120);
  let origen = "";
  try { if (b.r) { const h = new URL(b.r).hostname.replace(/^www\./, ""); if (h && !h.endsWith("aldero.es")) origen = h.slice(0, 80); } } catch {}
  const disp = b.d === "m" ? "móvil" : "ordenador";
  const pais = (request.cf && request.cf.country) || "";
  const extra = String(b.x || "").slice(0, 60);
  ctx.waitUntil((async () => {
    const v = await visitante(request, env, ua);
    await env.DB.prepare("INSERT INTO eventos (ts, tipo, ruta, origen, disp, pais, extra, v) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(Date.now(), tipo, ruta, origen, disp, pais, extra, v).run();
  })().catch(() => {}));
  return ok;
}

// Identificador anónimo de dispositivo que cambia cada día: resumen cifrado de
// (sal secreta + día + IP + navegador). La IP no se guarda y el resumen no se
// puede revertir; al día siguiente el mismo dispositivo da otro valor.
let SAL = null;
async function visitante(request, env, ua) {
  if (SAL === null) { const r = await env.DB.prepare("SELECT v FROM ajustes WHERE k = 'sal'").first(); SAL = (r && r.v) || ""; }
  const ip = request.headers.get("cf-connecting-ip") || "";
  const dia = new Date().toISOString().slice(0, 10);
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(SAL + "|" + dia + "|" + ip + "|" + ua));
  return [...new Uint8Array(buf).slice(0, 8)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

const esc = (v) => String(v == null ? "" : v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
async function estadisticas(request, env, url) {
  const no = new Response("No encontrado", { status: 404, headers: { "Cache-Control": "no-store" } });
  if (!env.DB) return no;
  const k = url.searchParams.get("k") || "";
  const row = await env.DB.prepare("SELECT v FROM ajustes WHERE k = 'clave_stats'").first();
  if (!row || !k || k !== row.v) return no;
  const dias = Math.min(365, Math.max(1, parseInt(url.searchParams.get("dias") || "30", 10) || 30));
  const desde = Date.now() - dias * 864e5;
  const q = (sql, ...a) => env.DB.prepare(sql).bind(...a).all().then((r) => r.results || []);
  const U = "COUNT(DISTINCT COALESCE(v, 'e' || id) || strftime('%Y-%m-%d', ts/1000, 'unixepoch'))";
  const [tot, porDia, rutas, origenes, paises, disp, elecciones] = await Promise.all([
    q(`SELECT tipo, ${U} n, COUNT(*) total FROM eventos WHERE ts >= ? GROUP BY tipo`, desde),
    q(`SELECT strftime('%Y-%m-%d', ts/1000, 'unixepoch', 'localtime') dia, COUNT(DISTINCT CASE WHEN tipo='vista' THEN COALESCE(v, 'e' || id) END) vistas, COUNT(DISTINCT CASE WHEN tipo IN ('whatsapp','llamada','formulario') THEN COALESCE(v, 'e' || id) END) contactos FROM eventos WHERE ts >= ? GROUP BY dia ORDER BY dia DESC LIMIT 31`, desde),
    q(`SELECT ruta, ${U} n FROM eventos WHERE tipo='vista' AND ts >= ? GROUP BY ruta ORDER BY n DESC LIMIT 12`, desde),
    q(`SELECT origen, ${U} n FROM eventos WHERE tipo='vista' AND origen != '' AND ts >= ? GROUP BY origen ORDER BY n DESC LIMIT 12`, desde),
    q(`SELECT pais, ${U} n FROM eventos WHERE tipo='vista' AND ts >= ? GROUP BY pais ORDER BY n DESC LIMIT 8`, desde),
    q(`SELECT disp, ${U} n FROM eventos WHERE tipo='vista' AND ts >= ? GROUP BY disp ORDER BY n DESC`, desde),
    q(`SELECT extra, ${U} n FROM eventos WHERE tipo='eleccion' AND ts >= ? GROUP BY extra ORDER BY n DESC`, desde),
  ]);
  const T = Object.fromEntries(tot.map((r) => [r.tipo, r.n]));
  const PV = (tot.find((r) => r.tipo === "vista") || {}).total || 0;
  const n = (t) => T[t] || 0;
  const vistas = n("vista"), contactos = n("whatsapp") + n("llamada") + n("formulario");
  const conv = vistas ? ((contactos / vistas) * 100).toFixed(1).replace(".", ",") + " %" : "—";
  const max = Math.max(1, ...porDia.map((d) => d.vistas));
  const tabla = (rows, a, b) => rows.length ? "<table>" + rows.map((r) => `<tr><td>${esc(r[a] || "—")}</td><td>${r[b]}</td></tr>`).join("") + "</table>" : "<p class=m>Aún sin datos.</p>";
  const card = (t, v, s) => `<div class=c><span>${t}</span><b>${v}</b>${s ? `<small>${s}</small>` : ""}</div>`;
  const html = `<!doctype html><html lang=es><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><meta name=robots content="noindex,nofollow"><title>Estadísticas · Aldero</title>
<style>body{margin:0;background:#07080B;color:#F2F2EE;font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;padding:24px 18px 60px}main{max-width:980px;margin:0 auto}h1{font-size:26px;margin:0 0 4px}h2{font-size:15px;text-transform:uppercase;letter-spacing:.12em;color:#7E9BFF;margin:34px 0 12px}.m{color:#8F929C}.f a{color:#F2F2EE;margin-right:12px;padding:6px 12px;border:1px solid #2a2d38;border-radius:999px;text-decoration:none}.f a.on{background:#2D5BFF;border-color:#2D5BFF}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:20px}.c{background:#0E1015;border:1px solid #1d2029;border-radius:14px;padding:14px}.c span{color:#8F929C;font-size:13px;display:block}.c b{font-size:28px}.c small{display:block;color:#8F929C;font-size:12px}table{width:100%;border-collapse:collapse;background:#0E1015;border-radius:12px;overflow:hidden}td{padding:9px 12px;border-bottom:1px solid #1d2029}td:last-child{text-align:right;font-variant-numeric:tabular-nums}.cols{display:grid;grid-template-columns:1fr 1fr;gap:18px}@media(max-width:700px){.cols{grid-template-columns:1fr}}.bar{display:grid;grid-template-columns:92px 1fr 70px;gap:10px;align-items:center;font-size:13px;margin:5px 0}.bar i{display:block;height:12px;border-radius:6px;background:#2D5BFF}.bar em{font-style:normal;color:#8F929C;text-align:right}</style></head><body><main>
<h1>Estadísticas de aldero.es</h1><p class=m>Últimos ${dias} días · cada dispositivo cuenta una vez al día · sin cookies ni datos personales</p>
<p class=f>${[7, 30, 90].map((d) => `<a class="${d === dias ? "on" : ""}" href="?k=${esc(k)}&dias=${d}">${d} días</a>`).join("")}</p>
<div class=g>${card("Visitantes", vistas, `${PV} páginas vistas en total`)}${card("Contactos", contactos, `${n("whatsapp")} WhatsApp · ${n("llamada")} llamadas · ${n("formulario")} formulario`)}${card("Conversión", conv, "visitantes que te contactan")}${card("Códigos creados", n("codigo"), `${n("recomendacion")} recomendaciones directas`)}${card("Pegatina 29 €", n("pegatina"), "clics")}${card("Ventana promo", n("promo"), "veces mostrada")}</div>
<h2>Día a día <span class=m style="text-transform:none;letter-spacing:0">(visitantes · contactos)</span></h2>${porDia.length ? porDia.map((d) => `<div class=bar><span>${esc(d.dia)}</span><i style="width:${Math.max(2, (d.vistas / max) * 100)}%"></i><em>${d.vistas} · ${d.contactos} ✆</em></div>`).join("") : "<p class=m>Aún sin datos.</p>"}
<div class=cols><div><h2>Páginas más vistas</h2>${tabla(rutas, "ruta", "n")}</div><div><h2>De dónde vienen</h2>${tabla(origenes, "origen", "n")}<p class=m>Las visitas directas (escribiendo la dirección o desde WhatsApp) no aparecen aquí.</p></div></div>
<div class=cols><div><h2>Dispositivo</h2>${tabla(disp, "disp", "n")}</div><div><h2>País</h2>${tabla(paises, "pais", "n")}</div></div>
<h2>«¿Qué necesitas?» en la portada</h2>${tabla(elecciones, "extra", "n")}
</main></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" } });
}

// Worker de aldero.es: sirve la web estática (carpeta public/) y recibe el
// formulario de contacto en POST /api/contacto, que se reenvía por email a
// la dirección verificada en Cloudflare Email Routing (binding CONTACTO).
import { EmailMessage } from "cloudflare:email";

const FROM = "web@aldero.es";
const LIMITS = { nombre: 80, contacto: 120, mensaje: 3000 };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contacto") {
      if (request.method !== "POST") return new Response("Método no permitido", { status: 405, headers: { Allow: "POST" } });
      return contacto(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

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
    `Subject: ${encodeWord(`Nuevo contacto web: ${nombre}`)}`,
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

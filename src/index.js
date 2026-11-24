// Worker de aldero.es: sirve la web estática (carpeta public/) y además:
//  - POST /api/contacto        formulario de contacto → email (binding CONTACTO)
//  - POST /api/boceto          "tu web de ejemplo": genera un boceto con IA (Workers AI)
//  - GET  /api/boceto/ver/:id  muestra un boceto guardado (con marca de agua)
import { sendMail } from "./mail.js";
import { crearBoceto, verBoceto } from "./boceto.js";

const LIMITS = { nombre: 80, contacto: 120, mensaje: 3000 };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname;
    if (p === "/api/contacto") {
      if (request.method !== "POST") return metodo();
      return contacto(request, env);
    }
    if (p === "/api/boceto") {
      if (request.method !== "POST") return metodo();
      return crearBoceto(request, env, ctx);
    }
    const ver = p.match(/^\/api\/boceto\/ver\/([a-z0-9]{12,32})\/?$/);
    if (ver) return verBoceto(ver[1], env);
    if (p.startsWith("/api/")) return new Response("No encontrado", { status: 404 });
    return env.ASSETS.fetch(request);
  },
};

function metodo() {
  return new Response("Método no permitido", { status: 405, headers: { Allow: "POST" } });
}

export function mismoOrigen(request) {
  const origin = request.headers.get("origin");
  return !origin || new URL(origin).host === new URL(request.url).host;
}

async function contacto(request, env) {
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");
  const reply = (ok, msg, status = 200) =>
    wantsJson
      ? Response.json({ ok, msg }, { status, headers: { "Cache-Control": "no-store" } })
      : Response.redirect(new URL(ok ? "/?enviado=1#contacto" : "/?error=1#contacto", request.url).toString(), 303);

  if (!mismoOrigen(request)) return reply(false, "Origen no válido.", 403);

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
  const contactoV = get("contacto").slice(0, LIMITS.contacto);
  const mensaje = get("mensaje").slice(0, LIMITS.mensaje);
  if (!nombre || !contactoV || !mensaje) return reply(false, "Rellena tu nombre, cómo contactarte y el mensaje.", 400);
  if (!get("acepto")) return reply(false, "Tienes que aceptar la política de privacidad.", 400);
  if (/https?:\/\//i.test(nombre)) return reply(true, "Mensaje enviado.");

  const esEmail = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(contactoV);
  const pagina = get("pagina").slice(0, 200);
  const text = [
    "Nuevo mensaje desde el formulario de aldero.es",
    "",
    `Nombre: ${nombre}`,
    `Contacto: ${contactoV}`,
    pagina ? `Página: ${pagina}` : null,
    "",
    "Mensaje:",
    mensaje,
    "",
    "—",
    esEmail ? "Puedes responder a este correo y le llegará directamente." : "Te ha dejado un teléfono: escríbele o llámale.",
  ].filter((l) => l !== null).join("\n");

  try {
    await sendMail(env, { subject: `Nuevo contacto web: ${nombre}`, text, replyTo: esEmail ? contactoV : null });
  } catch (err) {
    console.error("Error enviando el formulario", err);
    return reply(false, "No se ha podido enviar. Escríbenos por WhatsApp o a hola@aldero.es.", 502);
  }
  return reply(true, "Mensaje enviado.");
}

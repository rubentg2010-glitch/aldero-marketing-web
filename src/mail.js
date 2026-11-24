// Envío de emails con el binding send_email de Cloudflare (Email Routing).
import { EmailMessage } from "cloudflare:email";

export const FROM = "web@aldero.es";

export async function sendMail(env, { subject, text, replyTo }) {
  const headers = [
    `From: "Web Aldero" <${FROM}>`,
    `To: ${env.CONTACTO_DESTINO}`,
    replyTo ? `Reply-To: ${clean(replyTo)}` : null,
    `Subject: ${encodeWord(subject)}`,
    `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`,
    `Message-ID: <${crypto.randomUUID()}@aldero.es>`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
  ].filter(Boolean);
  const raw = headers.join("\r\n") + "\r\n\r\n" + wrap(b64(text.replace(/\r?\n/g, "\r\n"))) + "\r\n";
  await env.CONTACTO.send(new EmailMessage(FROM, env.CONTACTO_DESTINO, raw));
}

export function clean(s) {
  return String(s).replace(/[\r\n]/g, " ");
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

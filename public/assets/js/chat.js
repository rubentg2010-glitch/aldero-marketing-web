/* Chat en directo (tawk.to). No se carga nada de tawk.to hasta que el visitante
   pulsa el botón de chat; a partir de ahí se recuerda para mantener la conversación. */
(function () {
  "use strict";
  var SRC = "https://embed.tawk.to/6b083b056ab4c63d01bafb4f/1k8c2d38k";
  var KEY = "aldero-chat";
  var loaded = false, wantOpen = false;

  function remembered() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function remember() { try { localStorage.setItem(KEY, "1"); } catch (e) {} }

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "chat-btn";
  btn.setAttribute("aria-label", "Abrir el chat");
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5v-8Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 8.5h8M8 12h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>Chat</span>';

  function load() {
    if (loaded) return;
    loaded = true;
    btn.classList.add("is-loading");
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    window.Tawk_API.customStyle = { visibility: {
      desktop: { position: "br", xOffset: 28, yOffset: 100 },
      mobile: { position: "br", xOffset: 14, yOffset: 84 }
    } };
    window.Tawk_API.onLoad = function () {
      btn.remove();
      document.documentElement.classList.add("chat-on");
      if (wantOpen && window.Tawk_API.maximize) window.Tawk_API.maximize();
    };
    window.Tawk_API.onChatStarted = function () { if (window.alderoStat) window.alderoStat("chat"); };
    var s = document.createElement("script");
    s.async = true; s.src = SRC; s.charset = "UTF-8"; s.setAttribute("crossorigin", "*");
    s.onerror = function () { loaded = false; btn.classList.remove("is-loading"); };
    document.head.appendChild(s);
  }

  btn.addEventListener("click", function () {
    wantOpen = true; remember();
    if (loaded && window.Tawk_API && window.Tawk_API.maximize) { window.Tawk_API.maximize(); return; }
    load();
  });

  function init() {
    document.body.appendChild(btn);
    if (remembered()) load();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

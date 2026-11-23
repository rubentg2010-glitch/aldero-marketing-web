"""Genera las páginas interiores de aldero.es (servicios, casos y guías) a partir de index.html.

Uso (desde la raíz del repositorio):  python3 tools/paginas.py
El pie, los iconos y la versión de CSS/JS se copian de public/index.html, así que
basta con regenerar después de tocar la portada.
"""
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

sys.path.insert(0, str(Path(__file__).resolve().parent))
from contenido_servicios import PAGES as SERVICIOS_BASE, STEPS  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent / "public"
SITE = "https://aldero.es"
WA = "https://wa.me/34711553395?text="
TODAY = "2026-11-23"
index = (ROOT / "index.html").read_text(encoding="utf-8")
WA_ICON = re.search(r'<svg class="btn__wa".*?</svg>', index, re.S).group(0)
VERSION = re.search(r'styles\.css\?v=(\d+)', index).group(1)
ARROW = '<svg class="btn__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
AUDIT_MSG = "Hola, he visto la web de ALDERO MARKETING y quiero la auditoría gratis para mi negocio."
OSCAR_QUOTE = "Me parece un tío cercano y que entiende los problemas de visibilidad en Google. Te los mejora de forma profesional y rápido."
PETRATO_QUOTE = "Conseguí muchas ventas gracias a la visibilidad que te da Aldero en Google y la profesionalidad que tiene el equipo."
ORG = {"@id": f"{SITE}/#empresa"}


def wa(msg):
    return WA + quote(msg)


def footer():
    f = index[index.index('  <!-- ================= FOOTER ================= -->'):index.index('  <a class="wa-float"')]
    return f.replace('href="#', 'href="./#')


def shell(*, slug, title, description, ld, body, wa_msg, back=("./#servicios", "Todos los servicios"), og_image="assets/img/og-image.png", og_type="website"):
    url = f"{SITE}/{slug}"
    return f'''<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{url}">
  <meta name="theme-color" content="#07080B">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="{og_type}">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="ALDERO MARKETING">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE}/{og_image}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/img/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
  <link rel="preload" href="assets/fonts/bricolage.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="assets/css/styles.css?v={VERSION}">
  <script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
  </script>
</head>
<body class="svc-page">
  <a class="sr-only" href="#contenido">Saltar al contenido</a>
  <header class="nav nav--simple">
    <div class="nav__inner">
      <a class="logo" href="./" aria-label="ALDERO MARKETING, ir al inicio">
        <img class="logo__img" src="assets/img/aldero-wordmark-sm.webp" width="525" height="81" alt="ALDERO MARKETING">
      </a>
      <a class="nav__back" href="{back[0]}">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        {back[1]}
      </a>
    </div>
  </header>

  <main id="contenido">
{body}
  </main>

{footer()}  <a class="wa-float" href="{wa(wa_msg)}" target="_blank" rel="noopener" aria-label="Escríbeme por WhatsApp">{WA_ICON}<span class="wa-float__label">WhatsApp</span></a>
  <script src="assets/js/faq.js?v={VERSION}" defer></script>
  <script src="assets/js/cookies.js?v={VERSION}" defer></script>
</body>
</html>
'''


def crumbs(label, middle=None):
    mid = f'<a href="{middle[0]}">{middle[1]}</a><span aria-hidden="true">/</span>' if middle else ""
    return f'<nav class="crumbs" aria-label="Ruta"><a href="./">Inicio</a><span aria-hidden="true">/</span>{mid}<span aria-current="page">{label}</span></nav>'


def breadcrumb_ld(slug, label, middle=None):
    items = [{"@type": "ListItem", "position": 1, "name": "Inicio", "item": f"{SITE}/"}]
    if middle:
        items.append({"@type": "ListItem", "position": 2, "name": middle[1], "item": f"{SITE}/{middle[0].lstrip('./').split('#')[0]}"})
    items.append({"@type": "ListItem", "position": len(items) + 1, "name": label, "item": f"{SITE}/{slug}"})
    return {"@type": "BreadcrumbList", "itemListElement": items}


def faq_html(faq):
    return "".join(f'<details class="faq__item"><summary>{q}</summary><p>{a}</p></details>' for q, a in faq)


def faq_ld(url, faq):
    return {"@type": "FAQPage", "@id": f"{url}#faq", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub("<[^>]+>", "", a)}} for q, a in faq]}


OSCAR_CASE_BLOCK = '''    <section class="svc-sec" aria-labelledby="ejemplo">
      <div class="container svc-case">
        <a class="svc-case__img" href="caso-oscar-posada" aria-label="Ver el caso de Oscar Posada">
          <picture><source srcset="assets/img/proyecto-oscar.webp" type="image/webp"><img src="assets/img/proyecto-oscar.jpg" width="1200" height="750" alt="Web de Oscar Posada, mecánico a domicilio en Málaga" loading="lazy" decoding="async"></picture>
        </a>
        <div>
          <p class="kicker svc-case__k">Un ejemplo real</p>
          <h2 class="svc-h2" id="ejemplo">Oscar Posada, mecánico a domicilio en Málaga</h2>
          <p class="svc-p">{text}</p>
          <blockquote class="svc-quote">"{quote}"<cite>Oscar Posada</cite></blockquote>
          <a class="svc-link" href="caso-oscar-posada">Ver el caso completo {arrow}</a>
        </div>
      </div>
    </section>
'''


# ---------------------------------------------------------------- servicios
def service_page(p):
    url = f"{SITE}/{p['slug']}"
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Service", "@id": f"{url}#servicio", "name": p["service"], "serviceType": p["service"], "description": p["description"],
         "provider": ORG, "areaServed": [{"@type": "City", "name": "Málaga"}, {"@type": "Country", "name": "España"}], "url": url},
        breadcrumb_ld(p["slug"], p["h1"]),
        faq_ld(url, p["faq"]),
    ]}
    cards = "".join(f'<li class="svc-card"><h3>{t}</h3><p>{d}</p></li>' for t, d in p["includes"])
    who = "".join(f"<li>{w}</li>" for w in p["who"])
    steps = "".join(f'<li><span class="svc-steps__n">{i}</span><div><h3>{t}</h3><p>{d}</p></div></li>' for i, (t, d) in enumerate(STEPS, 1))
    case = OSCAR_CASE_BLOCK.format(text=p["case_text"], quote=OSCAR_QUOTE, arrow=ARROW) if p.get("case_text") else ""
    other = p["other"]
    body = f'''    <section class="svc-hero">
      <div class="container">
        {crumbs(p["h1"])}
        <h1 class="svc-hero__title">{p["h1_html"]}</h1>
        <p class="svc-hero__lead">{p["lead"]}</p>
        <div class="svc-hero__actions">
          <a class="btn btn--blue btn--xl" href="{wa(p["wa"])}" target="_blank" rel="noopener">{WA_ICON} {p["cta"]}</a>
          <a class="btn btn--ghost btn--xl" href="{wa(AUDIT_MSG)}" target="_blank" rel="noopener">Auditoría gratis {ARROW}</a>
        </div>
      </div>
    </section>

    <section class="svc-sec" aria-labelledby="incluye">
      <div class="container">
        <h2 class="svc-h2" id="incluye">{p["includes_title"]}</h2>
        <ul class="svc-cards">{cards}</ul>
      </div>
    </section>

    <section class="svc-sec svc-sec--split" aria-labelledby="para-quien">
      <div class="container svc-split">
        <div>
          <h2 class="svc-h2" id="para-quien">{p["who_title"]}</h2>
          <p class="svc-p">{p["who_text"]}</p>
        </div>
        <ul class="svc-ticks">{who}</ul>
      </div>
    </section>

{case}    <section class="svc-sec" aria-labelledby="como">
      <div class="container">
        <h2 class="svc-h2" id="como">Cómo trabajo</h2>
        <ol class="svc-steps">{steps}</ol>
      </div>
    </section>

    <section class="svc-sec" aria-labelledby="faq">
      <div class="container faq">
        <h2 class="svc-h2" id="faq">Preguntas frecuentes</h2>
        <div class="faq__list">{faq_html(p["faq"])}</div>
      </div>
    </section>

    <section class="svc-cta">
      <div class="container">
        <h2 class="svc-cta__title">{p["cta_title"]}</h2>
        <p class="svc-p">Cuéntame qué necesitas por WhatsApp. Te digo qué haría y cuánto costaría, sin compromiso.</p>
        <a class="btn btn--blue btn--xl" href="{wa(p["wa"])}" target="_blank" rel="noopener">{WA_ICON} Hablar con Rubén</a>
        <p class="svc-other">También te puede interesar: <a href="{other[0]}">{other[1]}</a></p>
      </div>
    </section>'''
    return shell(slug=p["slug"], title=p["title"], description=p["description"], ld=ld, body=body, wa_msg=p["wa"])


SERVICIOS_NUEVOS = [
    {
        "slug": "estudios-de-mercado",
        "service": "Estudios de mercado",
        "title": "Estudios de mercado para negocios en Málaga | ALDERO",
        "description": "Estudios de mercado para negocios de Málaga: qué hace tu competencia, qué busca la gente y dónde hay hueco para ti. Un resumen claro y por prioridades.",
        "h1": "Estudios de mercado",
        "h1_html": 'Estudios <span class="hl">de mercado</span>',
        "lead": "Antes de gastar en una web o en anuncios, conviene saber dónde estás. Miro qué hace tu competencia, qué busca la gente y dónde hay hueco para ti.",
        "cta": "Quiero mi estudio",
        "wa": "Hola, he visto la página de estudios de mercado de ALDERO MARKETING y quiero información para mi negocio.",
        "includes_title": "Qué miro",
        "includes": [
            ("Tu competencia", "Quién sale en Google por lo que haces, cómo se presenta y qué ofrece."),
            ("Lo que busca la gente", "Cómo te buscan de verdad y qué búsquedas tienen más interés en tu zona."),
            ("Cómo se venden los demás", "Mensajes, ofertas y puntos fuertes de los negocios que ya están."),
            ("Dónde hay hueco", "Lo que nadie está haciendo bien y tú puedes aprovechar."),
            ("Cómo estás tú", "Tu web, tu ficha de Google y tus redes, comparadas con las de tu competencia."),
            ("Un resumen claro", "Qué haría yo en tu lugar, por prioridades. Sin informes de 80 páginas."),
        ],
        "who_title": "Para quién es",
        "who_text": "Para negocios que van a empezar, a cambiar o a invertir en marketing y quieren hacerlo sabiendo dónde pisan, no a ciegas.",
        "who": [
            "Vas a abrir un negocio o a lanzar un servicio nuevo",
            "Quieres saber por qué tu competencia sale antes que tú en Google",
            "Vas a invertir en web o en anuncios y no sabes por dónde empezar",
            "Buscas un hueco que nadie esté cubriendo en tu zona",
        ],
        "faq": [
            ("¿Qué es un estudio de mercado?", "Es mirar con calma tu sector antes de tomar decisiones: quién es tu competencia, qué busca la gente y qué oportunidades hay. Para un negocio local no hace falta nada complicado, sino algo claro y útil."),
            ("¿Cuánto cuesta?", "Depende de lo que quieras analizar y de tu sector. Escríbeme por WhatsApp, cuéntame tu caso y te paso un presupuesto cerrado y sin compromiso."),
            ("¿Cuánto tarda?", "Depende del sector y de lo que haya que mirar. Te doy una fecha junto con el presupuesto."),
            ("¿Qué recibo al final?", "Un resumen claro con lo que he visto y lo que haría yo, ordenado por prioridades. Te lo explico por WhatsApp y te resuelvo las dudas."),
            ("¿Sirve si mi negocio es pequeño?", "Sí, y es cuando más sentido tiene: con poco presupuesto conviene acertar a la primera."),
        ],
        "cta_title": "¿Vemos dónde está tu hueco?",
        "other": ("estrategia-digital", "Estrategia digital"),
    },
    {
        "slug": "estrategia-digital",
        "service": "Estrategia digital",
        "title": "Estrategia digital para negocios en Málaga | ALDERO",
        "description": "Estrategia digital para negocios de Málaga: un plan sencillo para que tu negocio se vea en internet y te lleguen más clientes. Qué hacer y en qué orden.",
        "h1": "Estrategia digital",
        "h1_html": 'Estrategia <span class="hl">digital</span>',
        "lead": "Un plan sencillo para que tu negocio se vea en internet y te lleguen más clientes. Qué hacer, en qué orden y qué dejar para después.",
        "cta": "Quiero un plan",
        "wa": "Hola, he visto la página de estrategia digital de ALDERO MARKETING y quiero información para mi negocio.",
        "includes_title": "Qué incluye el plan",
        "includes": [
            ("Dónde estás ahora", "Tu web, tu ficha de Google y tus redes, vistas con lupa."),
            ("A quién quieres llegar", "Qué cliente te interesa y dónde te busca."),
            ("Qué canales usar", "Web, Google, redes o anuncios: solo los que tengan sentido para ti."),
            ("En qué orden", "Primero lo que antes da resultados; lo demás, después."),
            ("Cómo saber si funciona", "Qué mirar para comprobar que el plan va bien, sin complicaciones."),
            ("Ponerlo en marcha", "Si quieres, lo hacemos juntos: web, SEO y lo que haga falta."),
        ],
        "who_title": "Para quién es",
        "who_text": "Para negocios que saben que tienen que estar en internet pero no saben por dónde empezar, o que ya hacen cosas sueltas sin un plan detrás.",
        "who": [
            "Publicas o pones anuncios pero no ves clientes",
            "No sabes si invertir en web, en redes o en Google",
            "Quieres crecer con un plan y no a base de pruebas",
            "Prefieres hablar con una persona y no con una agencia grande",
        ],
        "faq": [
            ("¿Qué es una estrategia digital?", "Es decidir qué hacer en internet para conseguir clientes, en qué orden y cómo comprobar que funciona. Así no gastas tiempo ni dinero en cosas que no te traen nada."),
            ("¿Necesito tener ya una web?", "No. Precisamente el plan te dice si la necesitas, qué tiene que tener y qué hacer antes o después."),
            ("¿Cuánto cuesta?", "Depende de tu negocio y de hasta dónde quieras llegar. Escríbeme por WhatsApp y te paso un presupuesto cerrado y sin compromiso."),
            ("¿Me lo haces tú o solo me das el plan?", "Como prefieras: te puedo dar el plan para que lo hagas tú o ponerlo en marcha contigo."),
            ("¿Trabajas solo en Málaga?", "Trabajo desde Málaga, para negocios de Málaga y del resto de España. Todo se puede hacer por WhatsApp."),
        ],
        "cta_title": "¿Hacemos tu plan?",
        "other": ("diseno-web-malaga", "Diseño web en Málaga"),
    },
]


# ---------------------------------------------------------------- casos
CASOS = [
    {
        "slug": "caso-oscar-posada",
        "name": "Oscar Posada Mecánico",
        "title": "Caso Oscar Posada: web y SEO local en Málaga | ALDERO",
        "description": "Cómo le hice la web y la ficha de Google a Oscar Posada, mecánico a domicilio en Málaga: de tener solo un flyer a salir en Google con presupuesto por WhatsApp.",
        "kicker": "Caso real · Mecánico a domicilio",
        "lead": "Oscar trabaja a domicilio por toda la zona de Málaga, sin local. No tenía web: solo un flyer.",
        "img": ("proyecto-oscar", 1200, 750),
        "url": "https://oscarposadamecanico.netlify.app/",
        "antes": "No tenía web, solo un flyer, así que en Google prácticamente no existía. Quien buscaba un mecánico a domicilio en Málaga no podía encontrarle.",
        "despues": "Tiene una web propia con sus colores, presupuesto por WhatsApp en un toque, la web verificada en Google Search Console, su ficha de Google Business como negocio a domicilio y un apartado para que sus clientes dejen su opinión.",
        "hice": [
            "Una web hecha a partir de su flyer, con sus colores naranja y negro.",
            "Botón de WhatsApp para pedir presupuesto en un toque.",
            "Textos y estructura pensados para salir en Google en Málaga.",
            "Alta y verificación en Google Search Console.",
            "Su ficha de Google Business como mecánico a domicilio.",
            "Un apartado de reseñas para que sus clientes opinen en la web.",
        ],
        "quote": OSCAR_QUOTE,
        "who": "Oscar Posada · Mecánico a domicilio en Málaga",
        "wa": "Hola, he visto el caso de Oscar Posada en la web de ALDERO MARKETING y quiero algo así para mi negocio.",
        "next": ("caso-petrato", "Petrato"),
    },
    {
        "slug": "caso-petrato",
        "name": "Petrato",
        "title": "Caso Petrato: tienda online de retratos de mascotas | ALDERO",
        "description": "Cómo lancé Petrato, tienda online de retratos personalizados de mascotas: nombre, tienda propia, pagos con tarjeta, dominio, Search Console y campañas en redes.",
        "kicker": "Caso real · Tienda online",
        "lead": "Una tienda de retratos personalizados de mascotas que empezaba de cero.",
        "img": ("proyecto-petrato", 1440, 900),
        "url": "https://petrato.net",
        "antes": "Empezaba de cero: sin nombre definitivo, sin web y sin forma de cobrar online.",
        "despues": "Tiene marca propia, tienda online en petrato.net pensada para comprar desde el móvil, pagos con tarjeta, alta en Google Search Console y perfiles en Facebook e Instagram con campañas en Meta Ads.",
        "hice": [
            "Nombre y marca: Petrato.",
            "Tienda online propia, pensada para comprar desde el móvil.",
            "Pagos con tarjeta y envío de la foto de la mascota por WhatsApp.",
            "Dominio propio, petrato.net, y alta en Google Search Console.",
            "Perfiles en Facebook e Instagram y campañas en Meta Ads.",
        ],
        "quote": PETRATO_QUOTE,
        "who": "Petrato · Tienda online de retratos de mascotas",
        "wa": "Hola, he visto el caso de Petrato en la web de ALDERO MARKETING y quiero algo así para mi negocio.",
        "next": ("caso-oscar-posada", "Oscar Posada Mecánico"),
    },
]


def case_page(c):
    url = f"{SITE}/{c['slug']}"
    img, w, h = c["img"]
    middle = ("./#proyectos", "Trabajos")
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "CreativeWork", "@id": f"{url}#caso", "name": f"Caso: {c['name']}", "description": c["description"], "url": url,
         "image": f"{SITE}/assets/img/{img}.jpg", "creator": ORG, "inLanguage": "es-ES",
         "review": {"@type": "Review", "reviewBody": c["quote"], "author": {"@type": "Organization", "name": c["name"]}}},
        breadcrumb_ld(c["slug"], c["name"], middle),
    ]}
    hice = "".join(f"<li>{x}</li>" for x in c["hice"])
    body = f'''    <section class="svc-hero case-hero">
      <div class="container">
        {crumbs(c["name"], middle)}
        <p class="kicker case-hero__k">{c["kicker"]}</p>
        <h1 class="svc-hero__title">{c["name"]}</h1>
        <p class="svc-hero__lead">{c["lead"]}</p>
        <div class="svc-hero__actions">
          <a class="btn btn--ghost btn--xl" href="{c["url"]}" target="_blank" rel="noopener">Ver la web {ARROW}</a>
          <a class="btn btn--blue btn--xl" href="{wa(c["wa"])}" target="_blank" rel="noopener">{WA_ICON} Quiero algo así</a>
        </div>
      </div>
    </section>

    <section class="case-shot" aria-label="Captura de la web">
      <div class="container">
        <a class="case-shot__frame" href="{c["url"]}" target="_blank" rel="noopener" aria-label="Abrir la web de {c["name"]}">
          <span class="case-shot__bar" aria-hidden="true"><i></i><i></i><i></i><span>{c["url"].replace("https://", "").rstrip("/")}</span></span>
          <picture><source srcset="assets/img/{img}.webp" type="image/webp"><img src="assets/img/{img}.jpg" width="{w}" height="{h}" alt="Portada de la web de {c["name"]}" decoding="async"></picture>
        </a>
      </div>
    </section>

    <section class="svc-sec" aria-labelledby="antes-despues">
      <div class="container">
        <h2 class="svc-h2" id="antes-despues">Antes y después</h2>
        <div class="ba">
          <div class="ba__col"><p class="ba__k">Antes</p><p class="ba__t">{c["antes"]}</p></div>
          <div class="ba__col ba__col--after"><p class="ba__k">Después</p><p class="ba__t">{c["despues"]}</p></div>
        </div>
      </div>
    </section>

    <section class="svc-sec" aria-labelledby="que-hice">
      <div class="container svc-split">
        <h2 class="svc-h2" id="que-hice">Lo que hice</h2>
        <ol class="case-steps">{hice}</ol>
      </div>
    </section>

    <section class="svc-sec" aria-label="Opinión">
      <div class="container">
        <blockquote class="case-quote">
          <p>"{c["quote"]}"</p>
          <cite>{c["who"]}</cite>
        </blockquote>
      </div>
    </section>

    <section class="svc-cta">
      <div class="container">
        <h2 class="svc-cta__title">¿Quieres algo así?</h2>
        <p class="svc-p">Cuéntame qué necesitas por WhatsApp. Te digo qué haría y cuánto costaría, sin compromiso.</p>
        <a class="btn btn--blue btn--xl" href="{wa(c["wa"])}" target="_blank" rel="noopener">{WA_ICON} Hablar con Rubén</a>
        <p class="svc-other">Otro trabajo: <a href="{c["next"][0]}">{c["next"][1]}</a></p>
      </div>
    </section>'''
    return shell(slug=c["slug"], title=c["title"], description=c["description"], ld=ld, body=body, wa_msg=c["wa"],
                 back=("./#proyectos", "Todos los trabajos"), og_image=f"assets/img/{img}.jpg")


# ---------------------------------------------------------------- guía
GUIA = {
    "slug": "guia-google-maps-malaga",
    "title": "Cómo salir en Google Maps con tu negocio en Málaga | ALDERO",
    "description": "Guía paso a paso para que tu negocio de Málaga salga en Google Maps: perfil de empresa, verificación, categoría, fotos, reseñas y errores que evitar.",
    "h1": "Cómo salir en Google Maps con tu negocio en Málaga",
    "wa": "Hola, he leído la guía de Google Maps de ALDERO MARKETING y quiero ayuda con la ficha de mi negocio.",
}
GUIA_PASOS = [
    ("Crea o reclama tu perfil", "Entra en <strong>business.google.com</strong> con una cuenta de Google y busca tu negocio. A veces Google ya ha creado una ficha por su cuenta: si existe, reclámala en vez de crear otra. Si no, créala desde cero con el nombre real de tu negocio."),
    ("Verifícalo", "Google te pedirá demostrar que el negocio es tuyo. El método lo elige Google: muchas veces es grabar un vídeo corto del negocio o de tus herramientas, y otras veces por teléfono, correo o carta. Hasta que no está verificado, la ficha no se muestra bien."),
    ("Elige bien la categoría principal", "Es de lo que más cuenta. Elige la más concreta posible (por ejemplo, \"Taller mecánico\" y no \"Empresa\"). Después puedes añadir categorías secundarias para el resto de servicios."),
    ("Dirección o zona de servicio", "Si tus clientes van a tu local, pon la dirección exacta. Si vas tú a casa del cliente, como un mecánico o un fontanero a domicilio, oculta la dirección y marca las zonas donde trabajas: Málaga, Torremolinos, Alhaurín…"),
    ("Rellénalo entero", "Horario (también festivos), teléfono, web, una descripción clara de lo que haces y la lista de servicios. Cuanto más completa esté la ficha, más fácil es que Google la enseñe."),
    ("Sube fotos reales", "Fachada, interior, trabajos terminados y tú o tu equipo. Las fotos reales dan confianza; las de banco de imágenes no."),
    ("Consigue reseñas y contéstalas", "Pide a los clientes contentos que te dejen una reseña: mándales el enlace directo por WhatsApp justo después del trabajo. Responde a todas, también a las malas, con educación. Nunca compres reseñas: va contra las normas de Google."),
    ("Mismos datos en todas partes", "Usa exactamente el mismo nombre, dirección y teléfono en tu ficha, tu web y tus redes. Si Google ve datos distintos, se fía menos."),
    ("Ten una web que lo respalde", "Enlaza tu web en la ficha y deja claro en ella qué haces y en qué zona. Google cruza la información de la ficha y de la web."),
    ("Mantén la ficha viva", "Sube fotos de vez en cuando, publica novedades y actualiza el horario si cambia. Una ficha abandonada transmite eso: abandono."),
]
GUIA_ERRORES = [
    "Meter palabras clave en el nombre (\"Taller Pérez mecánico barato Málaga\"): va contra las normas de Google y te pueden suspender la ficha.",
    "Tener dos fichas para el mismo negocio.",
    "Poner una dirección donde no atiendes de verdad.",
    "Dejar el horario sin actualizar y que la gente se encuentre la persiana bajada.",
    "No contestar a las reseñas, sobre todo a las malas.",
]


def guide_page():
    g = GUIA
    url = f"{SITE}/{g['slug']}"
    faq = [
        ("¿Cuánto cuesta salir en Google Maps?", "Tener la ficha de empresa en Google es gratis. Lo que lleva trabajo es dejarla bien hecha y mantenerla; si no tienes tiempo, te la puedo montar yo."),
        ("¿Cuánto se tarda en aparecer?", "Depende de la verificación y de lo fuerte que sea tu competencia en tu zona. No hay un plazo fijo: lo importante es tener la ficha completa, verificada y con reseñas."),
        ("¿Puedo salir en Maps sin local?", "Sí. Si trabajas a domicilio, configura la ficha como negocio de zona de servicio y oculta tu dirección."),
    ]
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "@id": f"{url}#guia", "headline": g["h1"], "description": g["description"], "url": url,
         "datePublished": TODAY, "dateModified": TODAY, "inLanguage": "es-ES",
         "author": {"@type": "Person", "name": "Rubén Torres"}, "publisher": ORG, "image": f"{SITE}/assets/img/og-image.png"},
        {"@type": "HowTo", "name": g["h1"], "step": [{"@type": "HowToStep", "position": i, "name": t, "text": re.sub("<[^>]+>", "", d)} for i, (t, d) in enumerate(GUIA_PASOS, 1)]},
        breadcrumb_ld(g["slug"], "Guía: salir en Google Maps"),
        faq_ld(url, faq),
    ]}
    toc = "".join(f'<li><a href="#paso-{i}">{t}</a></li>' for i, (t, _) in enumerate(GUIA_PASOS, 1))
    pasos = "".join(f'<section class="guide__step" id="paso-{i}"><span class="guide__n">{i:02d}</span><div><h2>{t}</h2><p>{d}</p></div></section>' for i, (t, d) in enumerate(GUIA_PASOS, 1))
    errores = "".join(f"<li>{e}</li>" for e in GUIA_ERRORES)
    body = f'''    <article class="guide">
      <header class="svc-hero guide__head">
        <div class="container">
          {crumbs("Guía: salir en Google Maps")}
          <p class="kicker case-hero__k">Guía · SEO local</p>
          <h1 class="svc-hero__title guide__title">{g["h1"]}</h1>
          <p class="svc-hero__lead">Cuando alguien busca "fontanero en Málaga" o "peluquería cerca de mí", Google enseña un mapa con unos pocos negocios antes que cualquier web. Para salir ahí necesitas un <strong>Perfil de Empresa en Google</strong> (lo que antes se llamaba Google My Business) bien hecho. Te explico cómo, paso a paso.</p>
          <p class="guide__meta">Por Rubén Torres · Aldero Marketing, Málaga · <time datetime="{TODAY}">noviembre de 2026</time></p>
        </div>
      </header>

      <div class="container guide__grid">
        <nav class="guide__toc" aria-label="Pasos de la guía">
          <p class="guide__toc-k">En esta guía</p>
          <ol>{toc}</ol>
        </nav>
        <div class="guide__body">
          {pasos}
          <section class="guide__box" aria-labelledby="errores">
            <h2 id="errores">Errores que te pueden hundir la ficha</h2>
            <ul>{errores}</ul>
          </section>
          <section class="guide__faq faq" aria-labelledby="faq">
            <h2 class="svc-h2" id="faq">Preguntas frecuentes</h2>
            <div class="faq__list">{faq_html(faq)}</div>
          </section>
        </div>
      </div>

      <section class="svc-cta">
        <div class="container">
          <h2 class="svc-cta__title">¿Te la monto yo?</h2>
          <p class="svc-p">Si no tienes tiempo, te dejo la ficha hecha y la web preparada para Google. Y si ya la tienes, te digo gratis qué mejoraría.</p>
          <a class="btn btn--blue btn--xl" href="{wa(g["wa"])}" target="_blank" rel="noopener">{WA_ICON} Hablar con Rubén</a>
          <p class="svc-other">Más sobre esto: <a href="seo-local-malaga">SEO local en Málaga</a></p>
        </div>
      </section>
    </article>'''
    return shell(slug=g["slug"], title=g["title"], description=g["description"], ld=ld, body=body, wa_msg=g["wa"],
                 back=("./", "Volver al inicio"), og_type="article")


if __name__ == "__main__":
    for p in list(SERVICIOS_BASE) + SERVICIOS_NUEVOS:
        (ROOT / f"{p['slug']}.html").write_text(service_page(p), encoding="utf-8")
        print("servicio", p["slug"])
    for c in CASOS:
        (ROOT / f"{c['slug']}.html").write_text(case_page(c), encoding="utf-8")
        print("caso", c["slug"])
    (ROOT / f"{GUIA['slug']}.html").write_text(guide_page(), encoding="utf-8")
    print("guía", GUIA["slug"])

"""Genera las páginas de servicio (SEO) de aldero.es a partir de index.html.

Uso: python3 tools/servicios.py   (desde la raíz del repositorio)
"""
import json
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent / "public"
SITE = "https://aldero.es"
WA = "https://wa.me/34711553395?text="
index = (ROOT / "index.html").read_text(encoding="utf-8")
WA_ICON = re.search(r'<svg class="btn__wa".*?</svg>', index, re.S).group(0)
ARROW = '<svg class="btn__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def wa(msg):
    return WA + quote(msg)


def footer():
    f = index[index.index('  <!-- ================= FOOTER ================= -->'):index.index('  <a class="wa-float"')]
    f = f.replace('href="#', 'href="./#')
    return f


def wa_float(msg):
    return f'''  <a class="wa-float" href="{wa(msg)}" target="_blank" rel="noopener" aria-label="Escríbeme por WhatsApp">{WA_ICON}<span class="wa-float__label">WhatsApp</span></a>
  <div class="wa-bar">
    <a class="btn btn--blue btn--lg btn--block" href="{wa(msg)}" target="_blank" rel="noopener">{WA_ICON} Pide tu presupuesto por WhatsApp</a>
  </div>
'''


def page(p):
    url = f"{SITE}/{p['slug']}"
    faq_ld = {
        "@type": "FAQPage",
        "@id": f"{url}#faq",
        "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub('<[^>]+>', '', a)}} for q, a in p["faq"]],
    }
    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "@id": f"{url}#servicio",
                "name": p["service"],
                "serviceType": p["service"],
                "description": p["description"],
                "provider": {"@id": f"{SITE}/#empresa"},
                "areaServed": [{"@type": "City", "name": "Málaga"}, {"@type": "Country", "name": "España"}],
                "url": url,
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Inicio", "item": f"{SITE}/"},
                    {"@type": "ListItem", "position": 2, "name": p["h1"], "item": url},
                ],
            },
            faq_ld,
        ],
    }
    cards = "".join(f'<li class="svc-card"><h3>{t}</h3><p>{d}</p></li>' for t, d in p["includes"])
    who = "".join(f"<li>{w}</li>" for w in p["who"])
    steps = "".join(f'<li><span class="svc-steps__n">{i}</span><div><h3>{t}</h3><p>{d}</p></div></li>' for i, (t, d) in enumerate(p["steps"], 1))
    faq = "".join(f'<details class="faq__item"><summary>{q}</summary><p>{a}</p></details>' for q, a in p["faq"])
    other = p["other"]
    return f'''<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{p["title"]}</title>
  <meta name="description" content="{p["description"]}">
  <link rel="canonical" href="{url}">
  <meta name="theme-color" content="#07080B">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="ALDERO MARKETING">
  <meta property="og:title" content="{p["title"]}">
  <meta property="og:description" content="{p["description"]}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE}/assets/img/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/img/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
  <link rel="preload" href="assets/fonts/bricolage.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="assets/css/styles.css">
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
      <a class="nav__back" href="./#servicios">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Todos los servicios
      </a>
    </div>
  </header>

  <main id="contenido">
    <section class="svc-hero">
      <div class="container">
        <nav class="crumbs" aria-label="Ruta"><a href="./">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">{p["h1"]}</span></nav>
        <h1 class="svc-hero__title">{p["h1_html"]}</h1>
        <p class="svc-hero__lead">{p["lead"]}</p>
        <div class="svc-hero__actions">
          <a class="btn btn--blue btn--xl" href="{wa(p["wa"])}" target="_blank" rel="noopener">{WA_ICON} {p["cta"]}</a>
          <a class="btn btn--ghost btn--xl" href="{wa(p["wa_audit"])}" target="_blank" rel="noopener">Auditoría gratis {ARROW}</a>
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

    <section class="svc-sec" aria-labelledby="ejemplo">
      <div class="container svc-case">
        <a class="svc-case__img" href="https://oscarposadamecanico.netlify.app/" target="_blank" rel="noopener" aria-label="Ver la web de Oscar Posada Mecánico">
          <picture><source srcset="assets/img/proyecto-oscar.webp" type="image/webp"><img src="assets/img/proyecto-oscar.jpg" width="1200" height="750" alt="Web de Oscar Posada, mecánico a domicilio en Málaga" loading="lazy" decoding="async"></picture>
        </a>
        <div>
          <p class="kicker svc-case__k">Un ejemplo real</p>
          <h2 class="svc-h2" id="ejemplo">Oscar Posada, mecánico a domicilio en Málaga</h2>
          <p class="svc-p">{p["case_text"]}</p>
          <blockquote class="svc-quote">"Me parece un tío cercano y que entiende los problemas de visibilidad en Google. Te los mejora de forma profesional y rápido."<cite>Oscar Posada</cite></blockquote>
          <a class="svc-link" href="./#proyectos">Ver más trabajos {ARROW}</a>
        </div>
      </div>
    </section>

    <section class="svc-sec" aria-labelledby="como">
      <div class="container">
        <h2 class="svc-h2" id="como">Cómo trabajo</h2>
        <ol class="svc-steps">{steps}</ol>
      </div>
    </section>

    <section class="svc-sec" aria-labelledby="faq">
      <div class="container faq">
        <h2 class="svc-h2" id="faq">Preguntas frecuentes</h2>
        <div class="faq__list">{faq}</div>
      </div>
    </section>

    <section class="svc-cta">
      <div class="container">
        <h2 class="svc-cta__title">{p["cta_title"]}</h2>
        <p class="svc-p">Cuéntame qué necesitas por WhatsApp. Te digo qué haría y cuánto costaría, sin compromiso.</p>
        <a class="btn btn--blue btn--xl" href="{wa(p["wa"])}" target="_blank" rel="noopener">{WA_ICON} Hablar con Rubén</a>
        <p class="svc-other">También te puede interesar: <a href="{other[0]}">{other[1]}</a></p>
      </div>
    </section>
  </main>

{footer()}{wa_float(p["wa"])}  <script src="assets/js/cookies.js" defer></script>
</body>
</html>
'''


STEPS = [
    ("Me cuentas", "Qué haces, a quién vendes y qué te gustaría conseguir. Por WhatsApp, sin reuniones eternas."),
    ("Te paso propuesta", "Qué haría y cuánto costaría, por escrito. Sin compromiso."),
    ("Lo hago", "Te enseño el trabajo antes de publicarlo y lo ajustamos juntos."),
    ("Lo mejoro", "Una vez publicado, reviso cómo va en Google y lo voy afinando."),
]

PAGES = [
    {
        "slug": "diseno-web-malaga",
        "service": "Diseño web",
        "title": "Diseño web en Málaga para negocios | ALDERO MARKETING",
        "description": "Diseño web en Málaga: webs a medida, rápidas, pensadas para el móvil y preparadas para Google, con contacto por WhatsApp. Presupuesto sin compromiso.",
        "h1": "Diseño web en Málaga",
        "h1_html": 'Diseño web <span class="hl">en Málaga</span>',
        "lead": "Hago webs para negocios de Málaga con un objetivo claro: que la gente que entra te escriba. Rápidas, claras en el móvil, preparadas para Google y con WhatsApp siempre a mano.",
        "cta": "Quiero una web",
        "wa": "Hola, he visto la página de diseño web de ALDERO MARKETING y quiero información para mi negocio.",
        "wa_audit": "Hola, he visto la web de ALDERO MARKETING y quiero la auditoría gratis para mi negocio.",
        "includes_title": "Qué incluye tu web",
        "includes": [
            ("Diseño a medida", "Hecho para tu negocio, no una plantilla igual que la de la competencia."),
            ("Pensada para el móvil", "La mayoría de tus clientes te van a ver desde el teléfono. Primero se diseña para ahí."),
            ("Que cargue rápido", "Imágenes optimizadas y código ligero. Si tarda, la gente se va."),
            ("Preparada para Google", "Títulos, descripciones, estructura y alta en Google Search Console desde el primer día."),
            ("Contacto directo", "Botón de WhatsApp siempre visible y mensajes ya escritos para que escribirte cueste un toque."),
            ("Textos que se entienden", "Te ayudo a contar qué haces de forma clara, sin relleno."),
        ],
        "who_title": "Para quién es",
        "who_text": "Para negocios que quieren que su web les traiga clientes, no solo \"estar en internet\". Sobre todo negocios locales de Málaga y alrededores.",
        "who": [
            "Negocios sin web o con una web antigua que no se ve bien en el móvil",
            "Servicios a domicilio, talleres, clínicas, tiendas y profesionales",
            "Negocios que quieren que les escriban por WhatsApp, sin formularios",
            "Quien quiere una web propia y no depender solo de redes sociales",
        ],
        "case_text": "Oscar trabaja a domicilio y no tenía web, solo un flyer. Le hice una web con sus colores, botón de WhatsApp para pedir presupuesto en un toque y preparada para salir en Google en Málaga.",
        "steps": STEPS,
        "faq": [
            ("¿Cuánto cuesta una página web?", "Depende de lo que necesites: no es lo mismo una web de una página que una tienda online. Escríbeme por WhatsApp, cuéntame tu caso y te paso un presupuesto cerrado y sin compromiso."),
            ("¿Cuánto se tarda en tener la web?", "Depende del tamaño de la web y de lo rápido que tengamos los textos y las fotos. Te doy una fecha junto con el presupuesto."),
            ("¿Podré ver la web antes de que se publique?", "Sí. Te la enseño antes de publicarla y la ajustamos juntos hasta que te guste."),
            ("¿La web saldrá en Google?", "La preparo para Google desde el principio y la doy de alta en Google Search Console. Salir en las primeras posiciones depende también de tu competencia, y para eso está el trabajo de <a href=\"seo-local-malaga\">SEO local</a>."),
            ("¿Trabajas solo en Málaga?", "Trabajo desde Málaga, para negocios de Málaga y del resto de España. Todo se puede hacer por WhatsApp."),
        ],
        "cta_title": "¿Hablamos de tu web?",
        "other": ("seo-local-malaga", "SEO local en Málaga"),
    },
    {
        "slug": "seo-local-malaga",
        "service": "Posicionamiento SEO local",
        "title": "SEO local en Málaga: sal en Google | ALDERO MARKETING",
        "description": "SEO local en Málaga: trabajo tu web y tu ficha de Google Business para que aparezcas cuando buscan lo que haces en tu zona. Auditoría gratis por WhatsApp.",
        "h1": "SEO local en Málaga",
        "h1_html": 'SEO local <span class="hl">en Málaga</span>',
        "lead": "Cuando alguien busca lo que haces en su zona, tienes que salir tú y no tu competencia. Trabajo tu web y tu ficha de Google para que te encuentren y te escriban.",
        "cta": "Quiero salir en Google",
        "wa": "Hola, he visto la página de SEO local de ALDERO MARKETING y quiero información para mi negocio.",
        "wa_audit": "Hola, he visto la web de ALDERO MARKETING y quiero la auditoría gratis para mi negocio.",
        "includes_title": "Qué hago para posicionarte",
        "includes": [
            ("Auditoría de partida", "Miro tu web, tu ficha de Google y a tu competencia para ver dónde estás y qué falta."),
            ("Ficha de Google Business", "La creo o la completo bien: categorías, zona de servicio, horarios, fotos y enlaces."),
            ("Búsquedas de tu zona", "Busco cómo te buscan de verdad en Málaga y las meto donde Google las lee."),
            ("SEO técnico", "Velocidad, estructura, títulos, datos estructurados y Google Search Console."),
            ("Páginas que posicionan", "Páginas para cada servicio o zona, con contenido útil y no relleno."),
            ("Reseñas", "Te ayudo a pedir reseñas a tus clientes, que es de lo que más cuenta en el SEO local."),
        ],
        "who_title": "Para quién es",
        "who_text": "Para negocios que trabajan en una zona concreta y necesitan que los clientes de esa zona los encuentren en Google y en Google Maps.",
        "who": [
            "Negocios que no aparecen cuando buscan su servicio en Málaga",
            "Negocios con ficha de Google a medio hacer o sin reseñas",
            "Servicios a domicilio que trabajan por zonas, sin local",
            "Quien tiene web pero no le llegan clientes desde Google",
        ],
        "case_text": "Oscar trabaja a domicilio por toda Málaga, sin local. Además de su web, le creé la ficha de Google Business como negocio a domicilio y di de alta la web en Google Search Console.",
        "steps": STEPS,
        "faq": [
            ("¿Qué es el SEO local?", "Es el trabajo para que tu negocio salga en Google y en Google Maps cuando alguien busca lo que haces cerca de él, por ejemplo \"fontanero en Málaga\"."),
            ("¿Cuánto tarda en notarse?", "El SEO no es inmediato. Depende de tu sector y de lo fuerte que sea tu competencia en tu zona. En la auditoría te explico qué se puede esperar en tu caso."),
            ("¿Me garantizas salir el primero?", "No, y desconfía de quien te lo garantice: nadie controla Google. Lo que sí hago es trabajar todo lo que depende de ti para que tengas las mejores opciones."),
            ("¿Necesito tener web?", "Con la ficha de Google ya se puede empezar, pero una web propia ayuda mucho a posicionar y a que se fíen de ti. Si no tienes, te la puedo hacer: mira <a href=\"diseno-web-malaga\">diseño web en Málaga</a>."),
            ("¿Qué incluye la auditoría gratis?", "Reviso tu web, tu ficha de Google y a tu competencia, y te digo por WhatsApp qué mejoraría. Sin compromiso."),
        ],
        "cta_title": "¿Vemos cómo estás en Google?",
        "other": ("diseno-web-malaga", "Diseño web en Málaga"),
    },
]

if __name__ == "__main__":
    for p in PAGES:
        (ROOT / f"{p['slug']}.html").write_text(page(p), encoding="utf-8")
        print("ok", p["slug"])

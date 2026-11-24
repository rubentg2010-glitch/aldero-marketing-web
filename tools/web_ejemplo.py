"""Página /web-de-ejemplo: el cliente deja sus datos y ve un ejemplo de su web hecho con IA."""

AVISO = ("Esto es solo un ejemplo hecho automáticamente con IA para que te hagas una idea. "
         "<strong>No es lo que te vamos a entregar:</strong> tu web la diseña a mano nuestro equipo de diseñadores, a medida de tu negocio.")

FAQ = [
    ("¿La web de ejemplo es la que me vais a hacer?", "No. Es un boceto automático hecho con inteligencia artificial para que te hagas una idea rápida. Tu web de verdad la diseña a mano nuestro equipo de diseñadores, con tus fotos, tus textos y un diseño propio para tu negocio."),
    ("¿Cuesta algo?", "No. Ver tu web de ejemplo es gratis y sin compromiso."),
    ("¿Para qué me pedís el teléfono?", "Para poder escribirte y comentar contigo el ejemplo si te interesa. No lo usamos para nada más ni se lo damos a nadie."),
    ("¿Puedo usar la web de ejemplo?", "No: lleva marca de agua y es solo una muestra. Si te gusta la idea, escríbenos y te hacemos la tuya de verdad."),
]

SECTORES = [("taller", "Taller mecánico"), ("clinica", "Clínica o salud"), ("restaurante", "Restaurante o bar"),
            ("peluqueria", "Peluquería o estética"), ("tienda", "Tienda o comercio"), ("profesional", "Servicios profesionales"),
            ("reformas", "Reformas y construcción"), ("otro", "Otro")]
ESTILOS = [("oscuro", "Oscuro y moderno"), ("claro", "Claro y elegante"), ("vivo", "Colorido y alegre")]
COLORES = [("#2D5BFF", "Azul"), ("#E8590C", "Naranja"), ("#0CA678", "Verde"), ("#C2255C", "Frambuesa"), ("#7048E8", "Violeta"), ("#D4A373", "Arena")]


def pagina(*, shell, crumbs, breadcrumb_ld, faq_html, faq_ld, SITE, ORG, ARROW):
    slug = "web-de-ejemplo"
    url = f"{SITE}/{slug}"
    h1 = "Tu web de ejemplo"
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebPage", "@id": f"{url}#pagina", "name": "Ve un ejemplo de tu web en un minuto", "url": url, "publisher": ORG},
        breadcrumb_ld(slug, h1),
        faq_ld(url, FAQ),
    ]}
    sectores = "".join(f'<option value="{v}">{t}</option>' for v, t in SECTORES)
    estilos = "".join(
        f'<label class="wx-opt"><input type="radio" name="estilo" value="{v}"{" checked" if i == 0 else ""}><span class="wx-opt__sw wx-opt__sw--{v}"></span><span>{t}</span></label>'
        for i, (v, t) in enumerate(ESTILOS))
    colores = "".join(
        f'<label class="wx-col" title="{t}"><input type="radio" name="color" value="{v}"{" checked" if i == 0 else ""}><span class="wx-col__sw wx-col__sw--{i}"></span><span class="sr-only">{t}</span></label>'
        for i, (v, t) in enumerate(COLORES))

    body = f'''    <section class="svc-hero wx-hero">
      <div class="container">
        {crumbs(h1)}
        <p class="kicker">Gratis · En un minuto</p>
        <h1 class="svc-hero__title">Ve un ejemplo de <span class="hl">tu web</span> antes de decidir nada</h1>
        <p class="svc-hero__lead">Cuéntanos cómo es tu negocio y en un minuto verás una web de ejemplo con tu nombre, tus servicios y tu ciudad.</p>
        <p class="wx-aviso" role="note"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>{AVISO}</span></p>
      </div>
    </section>

    <section class="svc-sec wx" aria-label="Crear tu web de ejemplo">
      <div class="container">
        <form class="wx-form" action="/api/boceto" method="post" data-wx-form novalidate>
          <ol class="wx-steps" aria-hidden="true"><li class="is-on" data-wx-dot="1"><span>1</span>Tus datos</li><li data-wx-dot="2"><span>2</span>Tu negocio</li><li data-wx-dot="3"><span>3</span>Tu ejemplo</li></ol>

          <fieldset class="wx-step is-on" data-wx-step="1">
            <legend class="wx-legend">¿Con quién hablamos?</legend>
            <p class="wx-help">Te pedimos el teléfono para poder comentar el ejemplo contigo si te interesa. No lo usamos para nada más.</p>
            <div class="wx-grid">
              <label class="cform__f"><span>Tu nombre</span><input name="nombre" required maxlength="80" autocomplete="name"></label>
              <label class="cform__f"><span>Teléfono (WhatsApp)</span><input name="telefono" required maxlength="20" autocomplete="tel" inputmode="tel" placeholder="6XX XXX XXX"></label>
              <label class="cform__f wx-full"><span>Email (opcional)</span><input name="email" type="email" maxlength="120" autocomplete="email"></label>
              <label class="cform__ok wx-full"><input type="checkbox" name="acepto" value="1" required><span>Acepto que Aldero Marketing use mis datos para enviarme el ejemplo y contactarme sobre él, según la <a href="privacidad">política de privacidad</a>.</span></label>
            </div>
            <p class="cform__status" role="status" aria-live="polite" data-wx-error="1"></p>
            <button class="btn btn--blue btn--lg" type="button" data-wx-next>Siguiente {ARROW}</button>
          </fieldset>

          <fieldset class="wx-step" data-wx-step="2" hidden>
            <legend class="wx-legend">Háblanos de tu negocio</legend>
            <p class="wx-help">Cuanto más nos cuentes, mejor saldrá el ejemplo.</p>
            <div class="wx-grid">
              <label class="cform__f"><span>Nombre del negocio</span><input name="negocio" required maxlength="70" placeholder="Ej.: Taller Pérez"></label>
              <label class="cform__f"><span>Ciudad o zona</span><input name="ciudad" required maxlength="60" placeholder="Ej.: Sevilla"></label>
              <label class="cform__f wx-full"><span>Sector</span><select name="sector">{sectores}</select></label>
              <label class="cform__f wx-full"><span>¿Qué servicios o productos ofreces?</span><textarea name="servicios" rows="3" maxlength="600" placeholder="Ej.: revisiones, cambio de aceite, frenos, diagnosis…"></textarea></label>
              <label class="cform__f wx-full"><span>¿Qué te gustaría que tuviera tu web?</span><textarea name="deseos" rows="4" maxlength="1200" placeholder="Ej.: que se vea moderna, que me pidan presupuesto por WhatsApp, que salga en Google en mi barrio…"></textarea></label>
              <div class="cform__f wx-full"><span>Estilo</span><div class="wx-opts">{estilos}</div></div>
              <div class="cform__f wx-full"><span>Color principal</span><div class="wx-cols">{colores}</div></div>
              <label class="cform__hp" aria-hidden="true">No rellenes este campo<input name="web" tabindex="-1" autocomplete="off"></label>
              <input type="hidden" name="t" value="">
            </div>
            <p class="cform__status" role="status" aria-live="polite" data-wx-error="2"></p>
            <div class="wx-actions">
              <button class="btn btn--ghost btn--lg" type="button" data-wx-back>Atrás</button>
              <button class="btn btn--blue btn--lg" type="submit" data-wx-submit>Crear mi web de ejemplo {ARROW}</button>
            </div>
          </fieldset>
        </form>

        <div class="wx-load" data-wx-load hidden>
          <div class="wx-load__orb" aria-hidden="true"></div>
          <p class="wx-load__t" data-wx-load-text>Leyendo lo que nos has contado…</p>
          <p class="wx-load__s">Suele tardar entre 20 y 60 segundos. No cierres esta página.</p>
        </div>

        <div class="wx-res" data-wx-res hidden>
          <p class="wx-aviso wx-aviso--big" role="note"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>{AVISO}</span></p>
          <div class="wx-browser">
            <div class="wx-browser__bar"><span></span><span></span><span></span><em data-wx-url>tunegocio.es</em><a href="#" target="_blank" rel="noopener" data-wx-full>Pantalla completa ↗</a></div>
            <iframe title="Tu web de ejemplo" data-wx-frame loading="lazy" sandbox="allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"></iframe>
          </div>
          <div class="wx-next">
            <div>
              <h2 class="svc-h2">¿Te gusta la idea?</h2>
              <p class="svc-p">Esto lo ha hecho una máquina en un minuto. Imagina lo que hace nuestro equipo de diseñadores con tus fotos, tus textos y tiempo para cuidar cada detalle. Te escribimos nosotros, o escríbenos tú ahora.</p>
            </div>
            <div class="wx-next__btns">
              <a class="btn btn--blue btn--xl" href="#" target="_blank" rel="noopener" data-wx-wa>Quiero la mía de verdad {ARROW}</a>
              <button class="btn btn--ghost btn--lg" type="button" data-wx-again>Probar con otros datos</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="svc-sec" aria-labelledby="faq">
      <div class="container faq">
        <h2 class="svc-h2" id="faq">Preguntas frecuentes</h2>
        <div class="faq__list">{faq_html(FAQ)}</div>
      </div>
    </section>'''
    return shell(slug=slug, title="Ve un ejemplo de tu web gratis | ALDERO MARKETING",
                 description="Cuéntanos cómo es tu negocio y en un minuto verás un ejemplo de tu web hecho con IA. Gratis y sin compromiso. Tu web de verdad la diseña nuestro equipo.",
                 ld=ld, body=body, wa_msg="Hola, he visto la web de ALDERO MARKETING y quiero información para mi negocio.",
                 back=("./", "Volver al inicio"), extra_js=("web-ejemplo.js",))

"""Páginas por sector y por ciudad de aldero.es.

Cada página usa la misma plantilla que los servicios (service_page en paginas.py).
Regla: nada de datos inventados (ni clientes, ni cifras, ni oficinas que no existen).
"""
from contenido_servicios import STEPS

ESP = [{"@type": "Country", "name": "España"}]

SECTORES = [("diseno-web-talleres", "Talleres mecánicos"), ("diseno-web-clinicas", "Clínicas"),
            ("diseno-web-restaurantes", "Restaurantes"), ("diseno-web-peluquerias", "Peluquerías y estética")]
CIUDADES = [("diseno-web-malaga", "Málaga"), ("diseno-web-sevilla", "Sevilla"), ("diseno-web-granada", "Granada"),
            ("diseno-web-cordoba", "Córdoba"), ("diseno-web-cadiz", "Cádiz")]


def otros(lista, slug):
    return [x for x in lista if x[0] != slug]


def wa(texto):
    return f"Hola, he visto la página de {texto} de ALDERO MARKETING y quiero información para mi negocio."


# ---------------------------------------------------------------- sectores
SECTOR_PAGES = [
    {
        "slug": "diseno-web-talleres",
        "service": "Diseño web para talleres mecánicos",
        "title": "Diseño web para talleres mecánicos | ALDERO MARKETING",
        "description": "Webs para talleres mecánicos y mecánicos a domicilio: presupuesto por WhatsApp, servicios claros y preparadas para salir en Google en tu zona.",
        "h1": "Diseño web para talleres mecánicos",
        "h1_html": 'Webs para <span class="hl">talleres mecánicos</span>',
        "lead": "Cuando a alguien se le enciende un piloto o el coche no arranca, busca un taller en Google desde el móvil y llama al primero que le da confianza. Hacemos que ese taller seas tú.",
        "cta": "Quiero la web de mi taller",
        "wa": wa("webs para talleres"),
        "includes_title": "Qué lleva la web de un taller",
        "includes": [
            ("Presupuesto en un toque", "Botón de WhatsApp con el mensaje ya escrito: marca, modelo y qué le pasa al coche."),
            ("Tus servicios, claros", "Revisiones, frenos, embrague, diagnosis, neumáticos… cada uno explicado para que el cliente sepa que lo haces."),
            ("Dónde estás y cuándo abres", "Dirección, mapa y horario a la vista. Si vas a domicilio, las zonas que cubres."),
            ("Fotos reales del taller", "Nada de fotos de banco de imágenes: tu taller, tus herramientas, tu equipo."),
            ("Preparada para Google", "Para salir cuando buscan \"taller\" o \"mecánico\" en tu ciudad o en tu barrio."),
            ("Reseñas a la vista", "Lo que dicen tus clientes, que es lo primero que mira quien no te conoce."),
        ],
        "who_title": "Para qué talleres es",
        "who_text": "Para talleres de barrio, mecánicos a domicilio, talleres de chapa y pintura, electromecánica o neumáticos que quieren que les entren más coches sin depender solo del boca a boca.",
        "who": [
            "Talleres sin web o con una web vieja que no se ve bien en el móvil",
            "Mecánicos a domicilio que trabajan por zonas, sin local",
            "Talleres que no salen en Google aunque llevan años abiertos",
            "Talleres que reciben muchas llamadas para preguntar lo mismo",
        ],
        "case_text": "Oscar es mecánico a domicilio y solo tenía un flyer. Le hicimos una web con sus colores, presupuesto por WhatsApp en un toque, páginas para las zonas donde trabaja y su ficha de Google como negocio a domicilio.",
        "steps": STEPS,
        "faq": [
            ("¿Necesita web un taller si ya tiene ficha en Google?", "La ficha ayuda mucho, pero la web es lo que convence: ahí explicas qué haces, enseñas el taller y el cliente te escribe con un toque. Además, una buena web ayuda a que la ficha salga más arriba."),
            ("¿Puedo poner precios de mis servicios?", "Sí, si quieres. Para servicios como cambios de aceite o revisiones funciona bien poner un precio orientativo. Para averías es mejor el presupuesto por WhatsApp."),
            ("Soy mecánico a domicilio, ¿me sirve?", "Sí. Para mecánicos sin local preparamos la web y la ficha de Google como negocio a domicilio, con las zonas que cubres. Es justo lo que hicimos con Oscar Posada."),
            ("¿Cuánto cuesta la web de un taller?", "Depende de lo que necesites. Escríbenos, cuéntanos cómo es tu taller y te pasamos un presupuesto cerrado y sin compromiso."),
        ],
        "cta_title": "¿Le hacemos la web a tu taller?",
        "other": ("seo-local-malaga", "SEO local"),
        "area": ESP,
    },
    {
        "slug": "diseno-web-clinicas",
        "service": "Diseño web para clínicas",
        "title": "Diseño web para clínicas y centros médicos | ALDERO MARKETING",
        "description": "Webs para clínicas, centros médicos, fisioterapeutas y dentistas: especialidades claras, contacto fácil y preparadas para salir en Google en tu ciudad.",
        "h1": "Diseño web para clínicas",
        "h1_html": 'Webs para <span class="hl">clínicas</span>',
        "lead": "Antes de pedir cita, la gente mira la web de la clínica: qué tratáis, quién atiende y si da confianza. Hacemos webs que lo dejan claro y que facilitan el contacto.",
        "cta": "Quiero la web de mi clínica",
        "wa": wa("webs para clínicas"),
        "includes_title": "Qué lleva la web de una clínica",
        "includes": [
            ("Especialidades bien explicadas", "Una página para cada especialidad o tratamiento, en lenguaje que entiende el paciente."),
            ("El equipo, con cara y nombre", "Quién atiende, su formación y su experiencia. Es lo que más confianza da."),
            ("Contacto sin esperas", "WhatsApp, teléfono o formulario, como prefieras recibir las consultas."),
            ("Cómo llegar", "Dirección, mapa, aparcamiento y horario, a la vista desde el móvil."),
            ("Preparada para Google", "Para salir cuando buscan tu especialidad en tu ciudad, como \"fisioterapeuta en Sevilla\"."),
            ("Textos con cuidado", "Información clara y prudente, sin prometer resultados que no se pueden prometer."),
        ],
        "who_title": "Para qué clínicas es",
        "who_text": "Para policlínicas, centros médicos, clínicas dentales, de fisioterapia, psicología, podología o estética que quieren que los pacientes nuevos los encuentren y se fíen.",
        "who": [
            "Clínicas sin web o con una web que no se ve bien en el móvil",
            "Centros con varias especialidades que no se entienden en la web",
            "Clínicas que no salen en Google por sus especialidades",
            "Profesionales que empiezan por su cuenta y necesitan darse a conocer",
        ],
        "steps": STEPS,
        "faq": [
            ("¿Podéis poner un sistema de citas online?", "Si ya usas un programa de citas, lo enlazamos desde la web. Si no, muchas clínicas prefieren recibir las peticiones por WhatsApp o teléfono y confirmarlas ellas; te ayudamos a elegir lo que mejor te encaje."),
            ("¿Qué hay que tener en cuenta en la web de una clínica?", "Que la información sea clara y prudente, que se vea quién atiende y que el contacto sea fácil. También cuidamos la política de privacidad y el aviso legal."),
            ("¿Saldrá mi clínica en Google?", "La preparamos para Google desde el principio, con una página por especialidad. Salir arriba depende también de tu competencia y de tus reseñas, y para eso está el <a href=\"seo-local-malaga\">SEO local</a>."),
            ("¿Cuánto cuesta la web de una clínica?", "Depende del número de especialidades y de lo que necesites. Escríbenos y te pasamos un presupuesto cerrado y sin compromiso."),
        ],
        "cta_title": "¿Hablamos de la web de tu clínica?",
        "other": ("seo-local-malaga", "SEO local"),
        "area": ESP,
    },
    {
        "slug": "diseno-web-restaurantes",
        "service": "Diseño web para restaurantes",
        "title": "Diseño web para restaurantes y bares | ALDERO MARKETING",
        "description": "Webs para restaurantes, bares y cafeterías: carta siempre actualizada, reservas fáciles, fotos que abren el apetito y preparadas para Google y Google Maps.",
        "h1": "Diseño web para restaurantes",
        "h1_html": 'Webs para <span class="hl">restaurantes</span>',
        "lead": "Quien busca dónde comer mira tres cosas: la carta, las fotos y si puede reservar. Hacemos webs que las enseñan rápido desde el móvil y que llevan la reserva a un toque.",
        "cta": "Quiero la web de mi restaurante",
        "wa": wa("webs para restaurantes"),
        "includes_title": "Qué lleva la web de un restaurante",
        "includes": [
            ("La carta, siempre al día", "Una carta que se lee bien en el móvil y que se puede cambiar fácilmente, no un PDF que no se abre."),
            ("Reservas en un toque", "Por WhatsApp, teléfono o el sistema de reservas que ya uses."),
            ("Fotos que abren el apetito", "Tus platos y tu local, bien presentados. Es lo que decide la visita."),
            ("Horario y ubicación", "Cuándo abres, dónde estás y cómo llegar, sin tener que buscarlo."),
            ("Preparada para Google y Maps", "Para salir cuando buscan \"restaurante\" o tu tipo de cocina cerca de ellos."),
            ("También para turistas", "Si te visitan turistas, la web puede estar también en inglés."),
        ],
        "who_title": "Para quién es",
        "who_text": "Para restaurantes, bares de tapas, cafeterías, chiringuitos y negocios de comida para llevar que quieren llenar mesas sin depender solo de las plataformas.",
        "who": [
            "Restaurantes que solo tienen redes sociales o una carta en PDF",
            "Locales que no salen en Google Maps cuando buscan por la zona",
            "Restaurantes que quieren recibir reservas directas",
            "Negocios con muchos turistas que necesitan la web en inglés",
        ],
        "steps": STEPS,
        "faq": [
            ("¿Me sirve una web si ya estoy en apps de reservas o de delivery?", "Sí. Las plataformas están bien para que te descubran, pero en tu web el cliente te reserva o te pide directamente, sin intermediarios."),
            ("¿Podré cambiar la carta yo mismo?", "Sí, la dejamos preparada para que cambiar un plato o un precio sea sencillo. Si lo prefieres, nos lo mandas y lo cambiamos nosotros."),
            ("¿La web puede estar en inglés?", "Sí. Si tienes clientela extranjera, merece la pena tener la carta y la información básica también en inglés."),
            ("¿Cuánto cuesta la web de un restaurante?", "Depende de lo que necesites. Escríbenos y te pasamos un presupuesto cerrado y sin compromiso."),
        ],
        "cta_title": "¿Llenamos más mesas?",
        "other": ("seo-local-malaga", "SEO local"),
        "area": ESP,
    },
    {
        "slug": "diseno-web-peluquerias",
        "service": "Diseño web para peluquerías y centros de estética",
        "title": "Diseño web para peluquerías y centros de estética | ALDERO",
        "description": "Webs para peluquerías, barberías y centros de estética: servicios y precios claros, fotos de tus trabajos y citas por WhatsApp. Preparadas para Google.",
        "h1": "Diseño web para peluquerías y estética",
        "h1_html": 'Webs para <span class="hl">peluquerías y estética</span>',
        "lead": "En tu sector la gente elige por lo que ve: tus trabajos, tu local y tus precios. Hacemos webs que lo enseñan bien y que convierten la visita en una cita.",
        "cta": "Quiero la web de mi salón",
        "wa": wa("webs para peluquerías y estética"),
        "includes_title": "Qué lleva tu web",
        "includes": [
            ("Servicios y precios claros", "Cortes, color, tratamientos… con precio orientativo y duración, para que nadie tenga que preguntar."),
            ("Galería de trabajos", "Tus mejores resultados, bien presentados. Es tu mejor carta de presentación."),
            ("Citas por WhatsApp", "Un toque y te escriben para pedir cita, o enlace a tu agenda online si ya usas una."),
            ("Tu equipo", "Quién atiende y en qué se especializa cada uno."),
            ("Preparada para Google y Maps", "Para salir cuando buscan \"peluquería\", \"barbería\" o \"centro de estética\" cerca de ellos."),
            ("Conectada con Instagram", "Enlazamos tus redes para que la web y el Instagram se refuercen."),
        ],
        "who_title": "Para quién es",
        "who_text": "Para peluquerías, barberías, centros de estética, uñas, pestañas y cejas que quieren más clientas y clientes nuevos sin depender solo de Instagram.",
        "who": [
            "Salones que solo tienen Instagram y no salen en Google",
            "Negocios que pierden tiempo contestando precios por mensaje",
            "Centros que quieren dar a conocer un servicio nuevo",
            "Profesionales que abren su propio salón",
        ],
        "steps": STEPS,
        "faq": [
            ("¿Si ya tengo Instagram, para qué quiero una web?", "Instagram enseña tu trabajo, pero no sale en Google cuando alguien busca una peluquería en su zona. La web sí, y además es tuya: no depende de un algoritmo."),
            ("¿Puedo enlazar mi agenda de citas?", "Sí. Si usas una aplicación de reservas, la enlazamos desde la web. Si no, las citas pueden llegarte por WhatsApp."),
            ("¿Tengo que poner precios?", "No es obligatorio, pero ayuda mucho: evita preguntas repetidas y da confianza. Puedes poner precios orientativos o \"desde\"."),
            ("¿Cuánto cuesta la web de un salón?", "Depende de lo que necesites. Escríbenos y te pasamos un presupuesto cerrado y sin compromiso."),
        ],
        "cta_title": "¿Hacemos la web de tu salón?",
        "other": ("seo-local-malaga", "SEO local"),
        "area": ESP,
    },
]

# ---------------------------------------------------------------- ciudades
def city(slug, nombre, *, title, description, lead, ejemplos, who_text, who, intro_faq, extra_faq, includes_extra):
    return {
        "slug": slug,
        "service": f"Diseño web y SEO en {nombre}",
        "title": title,
        "description": description,
        "h1": f"Diseño web en {nombre}",
        "h1_html": f'Diseño web <span class="hl">en {nombre}</span>',
        "lead": lead,
        "cta": "Quiero mi web",
        "wa": f"Hola, he visto la página de diseño web en {nombre} de ALDERO MARKETING y quiero información para mi negocio.",
        "includes_title": f"Qué hacemos para negocios de {nombre}",
        "includes": [
            ("Webs a medida", "Rápidas, claras en el móvil y con tu estilo. Nada de plantillas iguales a las de tu competencia."),
            ("SEO local en " + nombre, f"Para que salgas cuando buscan lo que haces en {nombre}: {ejemplos}."),
            ("Ficha de Google Business", "La creamos o la completamos para que aparezcas en Google Maps con fotos, horario y reseñas."),
            includes_extra,
            ("Contacto directo", "WhatsApp, teléfono o formulario: que escribirte cueste un toque."),
            ("Todo en remoto", "Por WhatsApp, email o videollamada. Te enseñamos la web antes de publicarla."),
        ],
        "who_title": f"Para negocios de {nombre}",
        "who_text": who_text,
        "who": who,
        "steps": STEPS,
        "faq": [
            intro_faq,
            ("¿Cómo trabajáis si no estamos en la misma ciudad?", "Todo se hace a distancia: nos cuentas tu negocio por WhatsApp, email o videollamada, te pasamos la propuesta y te enseñamos la web antes de publicarla. Si necesitamos fotos de tu local, te decimos cómo hacerlas o buscamos la mejor opción contigo."),
            extra_faq,
            ("¿Cuánto cuesta?", "Depende de lo que necesites. Escríbenos, cuéntanos tu caso y te pasamos un presupuesto cerrado y sin compromiso."),
        ],
        "cta_title": f"¿Hablamos de tu negocio en {nombre}?",
        "other": ("seo-local-malaga", "SEO local"),
        "area": [{"@type": "City", "name": nombre}],
    }


CIUDAD_PAGES = [
    city(
        "diseno-web-sevilla", "Sevilla",
        title="Diseño web y SEO en Sevilla | ALDERO MARKETING",
        description="Diseño web y SEO local para negocios de Sevilla: webs a medida, ficha de Google Business y posicionamiento para salir cuando te buscan en tu barrio.",
        lead="Sevilla es grande y cada barrio tiene su competencia. Hacemos webs y SEO local para que, cuando alguien busque lo que haces en Triana, Nervión o Dos Hermanas, salgas tú.",
        ejemplos="\"peluquería en Triana\", \"taller en Nervión\" o \"clínica en Los Remedios\"",
        who_text="Para negocios de Sevilla capital y del área metropolitana (Dos Hermanas, Alcalá de Guadaíra, Mairena del Aljarafe…) que quieren dejar de depender del boca a boca.",
        who=["Negocios de barrio que no salen en Google Maps", "Negocios con una web antigua que no funciona en el móvil",
             "Servicios a domicilio que trabajan por toda el área metropolitana", "Negocios que abren y necesitan darse a conocer"],
        intro_faq=("¿Tenéis oficina en Sevilla?", "No. Estamos en Málaga y trabajamos con negocios de Sevilla a distancia, por WhatsApp, email o videollamada. Así no pagas desplazamientos ni pierdes tiempo en reuniones."),
        extra_faq=("¿Se puede posicionar un negocio por barrios?", "Sí. Si trabajas en varias zonas de Sevilla o del área metropolitana, preparamos páginas para cada una y lo reflejamos en tu ficha de Google."),
        includes_extra=("Páginas por zona", "Si trabajas en varios barrios o municipios del área de Sevilla, una página para cada uno."),
    ),
    city(
        "diseno-web-granada", "Granada",
        title="Diseño web y SEO en Granada | ALDERO MARKETING",
        description="Diseño web y SEO local para negocios de Granada: webs a medida, en español e inglés si recibes turistas, y ficha de Google para salir en Maps.",
        lead="En Granada compites por los vecinos, por los estudiantes y por los turistas. Hacemos webs y SEO local para que cada uno de ellos te encuentre cuando te busca.",
        ejemplos="\"restaurante en el Albaicín\", \"academia en el Zaidín\" o \"fisioterapeuta en el centro\"",
        who_text="Para negocios de Granada capital y del área metropolitana (Armilla, Maracena, Las Gabias…), desde la hostelería y el turismo hasta academias, clínicas y comercios.",
        who=["Restaurantes, alojamientos y tiendas con clientela turista", "Academias y servicios para estudiantes",
             "Negocios de barrio que no salen en Google Maps", "Negocios con una web antigua que no funciona en el móvil"],
        intro_faq=("¿Tenéis oficina en Granada?", "No. Estamos en Málaga y trabajamos con negocios de Granada a distancia, por WhatsApp, email o videollamada."),
        extra_faq=("¿Me hacéis la web también en inglés?", "Sí. Si recibes turistas o estudiantes extranjeros, merece la pena tener al menos la información principal en inglés, y también la preparamos para Google."),
        includes_extra=("Web en dos idiomas", "Si recibes turistas o estudiantes de fuera, la web también en inglés."),
    ),
    city(
        "diseno-web-cordoba", "Córdoba",
        title="Diseño web y SEO en Córdoba | ALDERO MARKETING",
        description="Diseño web y SEO local para negocios de Córdoba: webs a medida, rápidas en el móvil y preparadas para salir en Google y Google Maps en tu zona.",
        lead="En Córdoba mucha gente sigue eligiendo por recomendación, pero antes de llamar mira en Google. Hacemos que lo que encuentren de ti sea una web clara y una ficha completa.",
        ejemplos="\"dentista en Ciudad Jardín\", \"taller en el Polígono de la Torrecilla\" o \"tienda en el centro\"",
        who_text="Para negocios de Córdoba capital y de la provincia que quieren que su presencia en internet esté a la altura de su trabajo.",
        who=["Negocios de toda la vida que nunca han tenido web", "Comercios y hostelería del centro y la zona turística",
             "Negocios que no salen en Google Maps", "Profesionales que empiezan por su cuenta"],
        intro_faq=("¿Tenéis oficina en Córdoba?", "No. Estamos en Málaga y trabajamos con negocios de Córdoba a distancia, por WhatsApp, email o videollamada."),
        extra_faq=("Nunca he tenido web, ¿por dónde empiezo?", "Por lo básico: una web sencilla y clara y tu ficha de Google bien hecha. Te explicamos cada paso sin tecnicismos y no tienes que saber nada de internet."),
        includes_extra=("Sin tecnicismos", "Si nunca has tenido web, te explicamos cada paso de forma sencilla."),
    ),
    city(
        "diseno-web-cadiz", "Cádiz",
        title="Diseño web y SEO en Cádiz | ALDERO MARKETING",
        description="Diseño web y SEO local para negocios de Cádiz y provincia: Jerez, El Puerto, Chiclana, Algeciras… Webs a medida y ficha de Google para salir en Maps.",
        lead="La provincia de Cádiz es muy distinta de un pueblo a otro y tiene temporadas muy marcadas. Hacemos webs y SEO local pensados para tu zona y para tu clientela, vecinos o turistas.",
        ejemplos="\"restaurante en Chiclana\", \"taller en Jerez\" o \"clínica en El Puerto de Santa María\"",
        who_text="Para negocios de Cádiz capital y de toda la provincia: Jerez, El Puerto de Santa María, Chiclana, San Fernando, Algeciras y la costa.",
        who=["Negocios de costa que viven del turismo de verano", "Negocios que trabajan en varios pueblos de la provincia",
             "Negocios que no salen en Google Maps", "Negocios con una web antigua que no funciona en el móvil"],
        intro_faq=("¿Tenéis oficina en Cádiz?", "No. Estamos en Málaga y trabajamos con negocios de la provincia de Cádiz a distancia, por WhatsApp, email o videollamada."),
        extra_faq=("Mi negocio es de temporada, ¿merece la pena?", "Sí, y conviene tenerlo listo antes de que empiece la temporada: el posicionamiento en Google tarda en notarse, así que lo ideal es empezar unos meses antes."),
        includes_extra=("Pensada para la temporada", "Web en inglés si tienes turistas y todo listo antes del verano."),
    ),
]

for _p in SECTOR_PAGES:
    _p["links"] = otros(SECTORES, _p["slug"]) + [(h, f"Diseño web en {n}") for h, n in CIUDADES]
for _p in CIUDAD_PAGES:
    _p["links"] = [(h, f"Diseño web en {n}") for h, n in otros(CIUDADES, _p["slug"])] + SECTORES

LANDINGS = SECTOR_PAGES + CIUDAD_PAGES

# La página de diseño web en Málaga también enlaza a sectores y ciudades.
from contenido_servicios import PAGES as _BASE  # noqa: E402
_BASE[0]["links"] = SECTORES + [(h, f"Diseño web en {n}") for h, n in otros(CIUDADES, "diseno-web-malaga")]

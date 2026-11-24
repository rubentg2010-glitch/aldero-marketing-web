/* Catálogo de García Laminados y Vinilos.
   Para añadir la foto de un modelo: pon el archivo en assets/img/productos/ y añade su ruta en PIMG
   con la clave del modelo (la "s" de cada producto). Primera foto = muestra; segunda (opcional) = ambiente al pasar el ratón.
   Ejemplo:  engelberg: ["assets/img/productos/engelberg-1.webp", "assets/img/productos/engelberg-2.webp"]
   Mientras un modelo no tenga foto, la web muestra una imagen provisional marcada como tal. */
window.PIMG = window.PIMG || {
  // engelberg: ["assets/img/productos/engelberg-1.webp", "assets/img/productos/engelberg-2.webp"],
};

/* Precios y modelos tal y como aparecen en la web actual de la empresa. */
window.GL_PRODUCTS = window.GL_PRODUCTS || [
  {n:"Engelberg",c:"helvetic",p:"19 €/m²",s:"engelberg"},
  {n:"Málaga",c:"helvetic",p:"19,50 €/m²",s:"malaga"},
  {n:"Mérida",c:"helvetic",p:"19,50 €/m²",s:"merida"},
  {n:"Soria",c:"helvetic",p:"19,50 €/m²",s:"soria"},
  {n:"Teruel",c:"helvetic",p:"19,50 €/m²",s:"teruel"},
  {n:"Verbier",c:"helvetic",p:"19,50 €/m²",s:"verbier"},
  {n:"Vigo",c:"helvetic",p:"19,50 €/m²",s:"vigo"},
  {n:"Zermatt",c:"helvetic",p:"19,50 €/m²",s:"zermatt"},
  {n:"Clay AC5",c:"pure",p:"15,20 €/m²",s:"clay"},
  {n:"Desert AC5",c:"pure",p:"15,20 €/m²",s:"desert"},
  {n:"Forest AC5",c:"pure",p:"15,20 €/m²",s:"forest"},
  {n:"Hill AC5",c:"pure",p:"15,20 €/m²",s:"hill"},
  {n:"Soil AC5",c:"pure",p:"15,20 €/m²",s:"soil"},
  {n:"Glaciar",c:"rigid",p:"22,40 €/m²",s:"glaciar"},
  {n:"Calizo",c:"rigid",p:"22,40 €/m²",s:"calizo"},
  {n:"Tundra",c:"rigid",p:"22,40 €/m²",s:"tundra"},
  {n:"Sabana",c:"rigid",p:"22,40 €/m²",s:"sabana"},
  {n:"Grafito",c:"rigid",p:"22,40 €/m²",s:"grafito"},
  {n:"Ámbar",c:"rigid",p:"22,40 €/m²",s:"ambar"},
  {n:"Navarra",c:"elemental",p:"23,40 €/m²",s:"navarra"},
  {n:"Alicante",c:"elemental",p:"23,40 €/m²",s:"alicante"},
  {n:"Tarragona",c:"elemental",p:"23,40 €/m²",s:"tarragona"},
  {n:"Granada",c:"elemental",p:"23,40 €/m²",s:"granada"},
  {n:"León",c:"elemental",p:"23,40 €/m²",s:"leon"},
  {n:"Jaén",c:"elemental",p:"23,40 €/m²",s:"jaen"}
];

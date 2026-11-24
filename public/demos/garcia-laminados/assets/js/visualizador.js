/* Visualizador de materiales: coloca un suelo o un revestimiento sobre una foto con su perspectiva,
   conservando las luces y sombras de la foto original (WebGL). Es una simulación orientativa.
   Cada superficie se define en % de la foto:
     poly  zona visible de la superficie; occ  zonas tapadas por muebles (se excluyen)
     quad  4 puntos de un rectángulo real sobre esa superficie, en orden: abajo-izq, abajo-der, arriba-der, arriba-izq
     rep   repeticiones de la textura [ancho, fondo]; rot 1 = las tablas van en horizontal */
(() => {
const TEX = {}; // texturas generadas, por clave
const loadImg = src => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src; });

/* textura de tablas a partir de una muestra real: 6 tablas por ancho, juntas al tresbolillo, biseles */
async function plankTex(key, src) {
  if (TEX[key]) return TEX[key];
  const S = await loadImg(src), N = 1024, cols = 6, pw = N / cols, pl = N / 2;
  const c = document.createElement("canvas"); c.width = c.height = N; const x = c.getContext("2d");
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let k = 0; k < cols; k++) {
    const off = rnd() * pl;
    for (let r = -1; r < 3; r++) {
      const y = r * pl + off;
      const sw = S.width * .32, sh = Math.min(S.height, sw * pl / pw * .9), sx = rnd() * (S.width - sw), sy = rnd() * (S.height - sh);
      x.drawImage(S, sx, sy, sw, sh, k * pw, y, pw, pl);
      x.fillStyle = `rgba(${rnd() > .5 ? "255,255,255" : "0,0,0"},${rnd() * .07})`; x.fillRect(k * pw, y, pw, pl);
      x.fillStyle = "rgba(40,25,10,.45)"; x.fillRect(k * pw, y, pw, 2);          // junta de testa
      x.fillStyle = "rgba(255,255,255,.12)"; x.fillRect(k * pw, y + 2, pw, 1);
    }
    x.fillStyle = "rgba(40,25,10,.5)"; x.fillRect(k * pw, 0, 2, N);                // junta larga
    x.fillStyle = "rgba(255,255,255,.14)"; x.fillRect(k * pw + 2, 0, 1, N);
  }
  return (TEX[key] = c);
}
/* paneles de revestimiento (1220 × 2440 mm): la textura es un panel */
async function panelTex(key, kind, src) {
  if (TEX[key]) return TEX[key];
  const N = 1024, c = document.createElement("canvas"); c.width = c.height = N; const x = c.getContext("2d");
  if (src) {
    const S = await loadImg(src); x.filter = "contrast(1.5) brightness(.9) saturate(.6)"; x.drawImage(S, 0, 0, N, N); x.filter = "none";
    /* vetas de piedra pulida */
    let sd = 3; const rr = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let v = 0; v < 7; v++) {
      x.beginPath(); let px = rr() * N, py = 0; x.moveTo(px, py);
      while (py < N) { px += (rr() - .5) * 120; py += 40 + rr() * 60; x.lineTo(px, py); }
      x.strokeStyle = `rgba(${rr() > .5 ? "90,82,74" : "160,150,140"},${.25 + rr() * .3})`; x.lineWidth = .8 + rr() * 2.2; x.filter = "blur(.6px)"; x.stroke(); x.filter = "none";
    }
  }
  else {
    const base = kind === "ultra" ? [92, 86, 80] : [196, 178, 154];
    x.fillStyle = `rgb(${base})`; x.fillRect(0, 0, N, N);
    const d = x.getImageData(0, 0, N, N), a = d.data, amp = kind === "matte" ? 34 : 6;
    for (let i = 0; i < a.length; i += 4) { const n = (Math.random() - .5) * amp; a[i] += n; a[i + 1] += n; a[i + 2] += n; }
    x.putImageData(d, 0, 0);
    if (kind === "matte") { x.globalAlpha = .25; x.filter = "blur(2px)"; x.drawImage(c, 0, 0); x.filter = "none"; x.globalAlpha = 1; }
  }
  if (kind === "gloss") { const g = x.createLinearGradient(0, 0, N, N); g.addColorStop(0, "rgba(255,255,255,.18)"); g.addColorStop(.5, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(255,255,255,.1)"); x.fillStyle = g; x.fillRect(0, 0, N, N); }
  x.fillStyle = "rgba(0,0,0,.22)"; x.fillRect(0, 0, 3, N); x.fillRect(0, 0, N, 3);   // junta entre paneles
  return (TEX[key] = c);
}

/* homografía: de la foto (0..1) al rectángulo unidad de la superficie */
function homography(q) {
  const dst = [[0, 0], [1, 0], [1, 1], [0, 1]], A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = q[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  for (let i = 0; i < 8; i++) { // Gauss
    let m = i; for (let r = i + 1; r < 8; r++) if (Math.abs(A[r][i]) > Math.abs(A[m][i])) m = r;
    [A[i], A[m]] = [A[m], A[i]]; [b[i], b[m]] = [b[m], b[i]];
    for (let r = 0; r < 8; r++) if (r !== i) { const f = A[r][i] / A[i][i]; for (let c = i; c < 8; c++) A[r][c] -= f * A[i][c]; b[r] -= f * b[i]; }
  }
  const h = b.map((v, i) => v / A[i][i]);
  return [h[0], h[3], h[6], h[1], h[4], h[7], h[2], h[5], 1]; // columna principal para WebGL
}

const VS = `attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`;
const FS = `precision highp float;varying vec2 uv;
uniform sampler2D ph,mt,mk;uniform mat3 H;uniform vec2 rep;uniform float rot,mean,gloss,mode,soft;
void main(){vec3 photo=texture2D(ph,uv).rgb;
 if(mode<.5){gl_FragColor=vec4(photo,1.);return;}
 vec3 s=H*vec3(uv,1.);vec2 t=s.xy/s.z;if(rot>.5)t=t.yx;
 vec3 m=texture2D(mt,t*rep).rgb;float l=dot(photo,vec3(.299,.587,.114));
 float k=mix(1.,clamp(l/mean,.4,1.25),soft);vec3 c=m*k+max(l-mean*1.15,0.)*gloss*.6;
 gl_FragColor=vec4(c,texture2D(mk,uv).r);}`;

class Viz {
  constructor(canvas, photoSrc, surfaces) { this.c = canvas; this.src = photoSrc; this.S = surfaces; this.sel = {}; this.ready = this.init(); }
  async init() {
    const gl = this.c.getContext("webgl", {premultipliedAlpha: false, preserveDrawingBuffer: true});
    if (!gl) throw new Error("sin WebGL");
    this.gl = gl; const im = await loadImg(this.src); this.im = im;
    const W = Math.min(im.naturalWidth, 1600), H = Math.round(W * im.naturalHeight / im.naturalWidth);
    this.c.width = W; this.c.height = H; gl.viewport(0, 0, W, H);
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr); this.pr = pr;
    const bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.U = n => gl.getUniformLocation(pr, n);
    this.tPh = this.tex(im, false);
    /* máscaras y luminancia media de cada superficie */
    const mc = document.createElement("canvas"); mc.width = W; mc.height = H; const mx = mc.getContext("2d");
    const lc = document.createElement("canvas"); lc.width = 200; lc.height = Math.round(200 * H / W); const lx = lc.getContext("2d", {willReadFrequently: true});
    lx.drawImage(im, 0, 0, lc.width, lc.height); const px = lx.getImageData(0, 0, lc.width, lc.height).data;
    const P = (pts, w, h) => { mx.beginPath(); pts.forEach(([a, b], i) => mx[i ? "lineTo" : "moveTo"](a / 100 * w, b / 100 * h)); mx.closePath(); };
    for (const s of this.S) {
      mx.filter = "none"; mx.fillStyle = "#000"; mx.fillRect(0, 0, W, H);
      mx.fillStyle = "#fff"; P(s.poly, W, H); mx.fill();
      mx.fillStyle = "#000"; mx.strokeStyle = "#000"; mx.lineJoin = "round";
      (s.occ || []).forEach(o => { P(o, W, H); mx.fill(); });
      const t = document.createElement("canvas"); t.width = W; t.height = H; const tx = t.getContext("2d"); tx.filter = `blur(${Math.max(1, W / 1500)}px)`; tx.drawImage(mc, 0, 0);
      s.tMask = this.tex(t, false);
      // luminancia media dentro de la máscara
      const sm = document.createElement("canvas"); sm.width = lc.width; sm.height = lc.height; const sx = sm.getContext("2d", {willReadFrequently: true}); sx.drawImage(mc, 0, 0, sm.width, sm.height);
      const md = sx.getImageData(0, 0, sm.width, sm.height).data; let sum = 0, n = 0;
      for (let i = 0; i < md.length; i += 4) if (md[i] > 128) { sum += (px[i] * .299 + px[i + 1] * .587 + px[i + 2] * .114) / 255; n++; }
      s.mean = n ? sum / n : .5;
      s.H = homography(s.quad.map(([a, b]) => [a / 100, b / 100]));
    }
    this.draw();
  }
  tex(src, rep) {
    const gl = this.gl, t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    if (rep) { gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
    else { gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  }
  /* mat = {key, canvas, gloss} o null para volver al original */
  async set(surfaceId, mat) {
    await this.ready; const s = this.S.find(x => x.id === surfaceId); if (!s) return;
    if (!mat) delete this.sel[surfaceId];
    else { if (!s.tex || s.texKey !== mat.key) { s.tex = this.tex(mat.canvas, true); s.texKey = mat.key; } s.gloss = mat.gloss || 0; this.sel[surfaceId] = 1; }
    this.draw();
    return Object.keys(this.sel).length > 0;
  }
  draw() {
    const gl = this.gl, U = this.U;
    gl.disable(gl.BLEND); gl.uniform1f(U("mode"), 0);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tPh); gl.uniform1i(U("ph"), 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.uniform1f(U("mode"), 1);
    for (const s of this.S) {
      if (!this.sel[s.id]) continue;
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, s.tex); gl.uniform1i(U("mt"), 1);
      gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, s.tMask); gl.uniform1i(U("mk"), 2);
      gl.uniformMatrix3fv(U("H"), false, s.H); gl.uniform2f(U("rep"), s.rep[0], s.rep[1]);
      gl.uniform1f(U("rot"), s.rot ? 1 : 0); gl.uniform1f(U("mean"), s.mean); gl.uniform1f(U("gloss"), s.gloss || 0); gl.uniform1f(U("soft"), s.soft == null ? .85 : s.soft);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }
}
window.GLViz = {Viz, plankTex, panelTex, ok: (() => { try { return !!document.createElement("canvas").getContext("webgl"); } catch (e) { return false; } })()};
})();

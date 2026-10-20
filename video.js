/* =========================================================
   VƯỜN LEAP · 20.10 — MÁY QUAY VIDEO THIỆP
   Chỉ nạp ở …/#/quay-video (trang chính không tải file này).
   - Mỗi người một video MP4 1080×1350 (khung 4:5): mở đầu → ảnh + tên → danh hiệu → từng lời chúc → tri ân,
     nhạc nền là giai điệu riêng của người đó (hoặc fileNhac nếu có).
   - Vẽ từng khung hình lên canvas theo thời gian (không phụ thuộc tốc độ máy), nhạc dựng bằng OfflineAudioContext,
     mã hoá H.264 + AAC bằng WebCodecs, đóng gói MP4 bằng mp4-muxer.
   - Kết quả: video/<id>.mp4 + ảnh bìa video/<id>.jpg. Chạy `node cong-cu/may-chu.mjs` thì file được ghi thẳng
     vào thư mục video/; mở bằng máy chủ khác thì trình duyệt tự tải file về.
   ========================================================= */
(() => {
const V = window.VUON, {D, PAL, KINDS} = V;
const W = 1080, H = 1350, FPS = 30, SR = 48000, BITRATE = 1_300_000;
const INK = '#3a1230', INK2 = '#71405f', PINK = '#e8559c';
const DISP = '"Playfair Display"', SCRIPT = '"Great Vibes"', NUM = '"Bodoni Moda"', SANS = '"Be Vietnam Pro"';
const MUXER = 'https://cdn.jsdelivr.net/npm/mp4-muxer@5.2.2/build/mp4-muxer.min.js';

/* ---------------- tiện ích ---------------- */
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = x => 1 - Math.pow(1 - clamp(x), 3);
const easeIO = x => (x = clamp(x), x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const back = x => { x = clamp(x); return 1 + 2.6 * Math.pow(x - 1, 3) + 1.6 * Math.pow(x - 1, 2); };
const rise = (u, at, len = .8, dist = 30) => { const k = ease((u - at) / len); return {alpha: k, dy: (1 - k) * dist}; };
const hash = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const rng = seed => () => {   // số ngẫu nhiên có hạt giống: mỗi người luôn ra cùng một video
  seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const mk = (w, h) => Object.assign(document.createElement('canvas'), {width: w, height: h});
const grad = (gr, stops) => (stops.forEach(([o, c]) => gr.addColorStop(o, c)), gr);
const radial = (g, x, y, r, stops) => grad(g.createRadialGradient(x, y, 0, x, y, r), stops);
const linear = (g, x0, y0, x1, y1, stops) => grad(g.createLinearGradient(x0, y0, x1, y1), stops);
const nextTick = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
const loadImg = src => new Promise((ok, no) => {
  const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('Không tải được ảnh ' + src)); i.src = src;
});
const loadScript = src => new Promise((ok, no) => {
  const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('Không tải được ' + src));
  document.head.appendChild(s);
});

/* ---------------- chữ ---------------- */
function font(g, f, ls = 0) { g.font = f; g.letterSpacing = ls + 'px'; }
function wrapLines(g, text, max) {   // giữ xuống dòng \n, ngắt theo từ
  const out = [];
  for (const para of String(text || '').split('\n')) {
    let line = '';
    for (const w of para.split(/\s+/).filter(Boolean)) {
      const t = line ? line + ' ' + w : w;
      if (line && g.measureText(t).width > max) { out.push(line); line = w; } else line = t;
    }
    out.push(line);
  }
  return out;
}
function balance(g, text, max) {   // ngắt dòng cân đối, tránh một chữ lẻ loi ở dòng cuối
  const n = wrapLines(g, text, max).length;
  if (n < 2 || String(text).includes('\n')) return wrapLines(g, text, max);
  let lo = max / n * .7, hi = max;
  for (let k = 0; k < 14; k++) { const mid = (lo + hi) / 2; if (wrapLines(g, text, mid).length > n) lo = mid; else hi = mid; }
  return wrapLines(g, text, hi);
}
function fitSize(g, tpl, text, max, size, min) {   // cỡ chữ lớn nhất để nằm gọn một dòng
  while (size > min) { g.font = tpl(size); if (g.measureText(text).width <= max) break; size -= 2; }
  g.font = tpl(size); return size;
}
function text(g, s, x, y, {fill = INK, glow = 'rgba(255,255,255,.95)', blur = 12, alpha = 1, dy = 0} = {}) {
  if (alpha <= .002 || !s) return;
  g.save(); g.globalAlpha *= alpha; g.fillStyle = fill;
  if (glow) { g.shadowColor = glow; g.shadowBlur = blur; }
  g.fillText(s, x, y + dy); g.restore();
}
async function fontsFor(p) {
  const all = [D.tieuDe, D.ngay, D.loiMoDau, 'PHỤ NỮ VIỆT NAM Chúc mừng ngày Gửi Vinh danh DANH HIỆU 20.10 Lời chúc Tri ân Cảm ơn vì đã nở hoa cùng Leap Learn to Leap',
    p.ten, p.goiTen, p.vaiTro, String(p.vaiTro).toUpperCase(), p.danhHieu, p.moTaDanhHieu, ...(p.loiChuc || []).flatMap(w => [w.tu, w.noiDung]),
    (D.thuCEO || {}).nguoiKy, (D.thuCEO || {}).chucVu, `${(D.thuCEO || {}).nguoiKy} · ${(D.thuCEO || {}).chucVu}`.toUpperCase()].join(' ');
  const specs = [`700 24px ${SANS}`, `600 26px ${SANS}`, `500 34px ${SANS}`, `400 100px ${SCRIPT}`, `600 90px ${DISP}`,
    `italic 400 40px ${DISP}`, `italic 500 70px ${DISP}`, `400 54px ${NUM}`];
  await Promise.all(specs.map(s => document.fonts.load(s, all)));
  await document.fonts.ready;
}

/* ---------------- hình vẽ (cùng đường nét với hoa trên web) ---------------- */
const STAR4 = 'M0 -16 Q2 -2 16 0 Q2 2 0 16 Q-2 2 -16 0 Q-2 -2 0 -16Z';
const HEART = 'M0 30 C-42 4 -50 -22 -36 -36 C-22 -50 -4 -40 0 -26 C4 -40 22 -50 36 -36 C50 -22 42 4 0 30Z';
const PETAL = {
  tron: [0, 1, 2, 3, 4].map(i => ({d: 'M0 0 C-36 -8 -46 -58 -16 -72 C-6 -77 6 -77 16 -72 C46 -58 36 -8 0 0Z', r: i * 72, o: [0, 0]})),
  tulip: ['M2 34 C-42 34 -66 2 -62 -32 C-44 -42 -22 -30 -8 -10 C-4 10 -2 26 2 34Z',
          'M-2 34 C42 34 66 2 62 -32 C44 -42 22 -30 8 -10 C4 10 2 26 -2 34Z',
          'M0 36 C-26 24 -34 -22 -18 -58 C-8 -44 8 -44 18 -58 C34 -22 26 24 0 36Z'].map(d => ({d, r: 0, o: [0, 0]})),
  sao: [{d: 'M0 -80 C9 -30 26 -12 80 0 C26 12 9 30 0 80 C-9 30 -26 12 -80 0 C-26 -12 -9 -30 0 -80Z', r: 12, o: [0, 80]}]
};
const VEIN = {
  tron: [0, 1, 2, 3, 4].map(i => ({d: 'M0 -20 C-5 -30 -4 -40 3 -48', r: i * 72 + 22})),
  tulip: [{d: 'M-40 -14 C-34 0 -24 12 -12 20', r: 0}, {d: 'M40 -14 C34 0 24 12 12 20', r: 0}],
  sao: []
};
const DEG = Math.PI / 180;
const sprites = new Map();
function flowerSprite(mau, kind, px = 520) {
  const key = `${mau}|${kind}|${px}`; if (sprites.has(key)) return sprites.get(key);
  const c = PAL[mau] || PAL.hong, cv = mk(px, px), g = cv.getContext('2d'), s = px / 220;
  g.translate(px / 2, px / 2); g.scale(s, s);
  g.filter = `blur(${(1.3 * s).toFixed(2)}px)`;   // cánh mềm như filter #fuzz
  g.fillStyle = kind === 'tulip'
    ? radial(g, 0, 40, 95, [[0, c[0]], [.5, c[1]], [1, '#fff6fb']])
    : radial(g, 0, 0, 78, [[0, c[0]], [.42, c[1]], [.8, '#fff5fa'], [1, '#fff']]);
  for (const pt of PETAL[kind]) {
    g.save(); g.translate(pt.o[0], pt.o[1]); g.rotate(pt.r * DEG); g.translate(-pt.o[0], -pt.o[1]);
    g.fill(new Path2D(pt.d)); g.restore();
  }
  g.filter = 'none';
  g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#fff';   // hạt nhiễu trắng trên cánh
  const R = rng(7);
  for (let i = 0; i < 1500; i++) { g.globalAlpha = R() * .6; g.fillRect(R() * 200 - 100, R() * 200 - 100, .8, .8); }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = 2.6; g.lineCap = 'round';
  for (const v of VEIN[kind]) { g.save(); g.rotate(v.r * DEG); g.stroke(new Path2D(v.d)); g.restore(); }
  if (kind !== 'tulip') {
    const st = new Path2D(STAR4);
    g.fillStyle = '#ffe14a'; g.fill(st); g.strokeStyle = '#ffd21f'; g.lineWidth = 1; g.stroke(st);
  }
  sprites.set(key, cv); return cv;
}
function glassSprite(px = 260) {
  const cv = mk(px, px), g = cv.getContext('2d'), s = px / 170, P = new Path2D('M0 0 C-30 -8 -40 -52 -14 -64 C-5 -68 5 -68 14 -64 C40 -52 30 -8 0 0Z');
  g.translate(px / 2, px / 2); g.scale(s, s);
  for (let i = 0; i < 5; i++) {
    g.save(); g.rotate(i * 72 * DEG);
    g.fillStyle = radial(g, 0, -34, 44, [[0, 'rgba(255,255,255,.2)'], [.7, 'rgba(255,235,245,.45)'], [1, 'rgba(255,170,210,.55)']]);
    g.fill(P); g.strokeStyle = 'rgba(255,150,195,.75)'; g.lineWidth = 1.6; g.stroke(P); g.restore();
  }
  g.fillStyle = 'rgba(255,214,74,.9)'; g.beginPath(); g.arc(0, 0, 13, 0, 7); g.fill();
  g.fillStyle = '#ffb81f'; g.beginPath(); g.arc(0, 0, 7, 0, 7); g.fill();
  return cv;
}
function heartSprite(px = 220) {
  const cv = mk(px, px), g = cv.getContext('2d'), s = px / 130;
  g.translate(px / 2, px / 2 + 10 * s); g.scale(s, s);
  g.shadowColor = 'rgba(214,70,140,.35)'; g.shadowBlur = 10 * s; g.shadowOffsetY = 4 * s;
  g.fillStyle = radial(g, -12, -24, 72, [[0, '#fff'], [.55, '#ffeaf3'], [1, '#f6b9d6']]);
  g.fill(new Path2D(HEART));
  g.shadowColor = 'transparent';
  g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.ellipse(-20, -26, 10, 6, -30 * DEG, 0, 7); g.fill();
  return cv;
}
function background() {
  const cv = mk(W, H), g = cv.getContext('2d');
  g.fillStyle = linear(g, 0, 0, W, H, [[0, '#f7a7d0'], [.45, '#ffd6ea'], [.7, '#ffeef6'], [1, '#f8b3d7']]); g.fillRect(0, 0, W, H);
  g.fillStyle = radial(g, 540, 520, 680, [[0, 'rgba(255,255,255,.85)'], [1, 'rgba(255,255,255,0)']]); g.fillRect(0, 0, W, H);
  const R = rng(20); g.fillStyle = '#fff';
  for (let i = 0; i < 30000; i++) { g.globalAlpha = R() * .45; g.fillRect(R() * W, R() * H, 1.5, 1.5); }
  g.globalAlpha = 1; return cv;
}
// dải lụa vàng/hồng (cùng đường cong với ribbon() trên web)
const RIB = {
  pink: new Path2D('M-40 130 C200 50 380 210 620 130 S980 20 1240 70 L1240 94 C980 52 830 240 620 172 S200 92 -40 160 Z'),
  gold: new Path2D('M-40 214 C160 94 330 264 560 174 S930 44 1240 134 L1240 180 C940 100 800 294 560 234 S170 154 -40 264 Z'),
  line: new Path2D('M-40 222 C160 104 330 272 560 182 S930 54 1240 142')
};
function ribbon(g, y, h, t, alpha) {
  if (alpha <= .002) return;
  const a0 = g.globalAlpha * alpha;
  g.save(); g.translate(0, y + Math.sin(t * 1.3) * 6); g.scale(W / 1200, h / 320 * (1 + .05 * Math.sin(t * 1.1)));
  g.globalAlpha = a0 * .75;
  g.fillStyle = linear(g, 0, 0, 1200, 0, [[0, '#ff9fcd'], [.35, '#ffe3f0'], [.65, '#f784bd'], [1, '#ffd1e7']]); g.fill(RIB.pink);
  g.globalAlpha = a0 * .92;
  g.fillStyle = linear(g, 0, 0, 1200, 0, [[0, '#f3c35a'], [.3, '#fff2c2'], [.55, '#f0b443'], [.8, '#ffe8a8'], [1, '#f3c35a']]); g.fill(RIB.gold);
  g.globalAlpha = a0 * .7; g.strokeStyle = '#fff'; g.lineWidth = 3; g.stroke(RIB.line);
  g.restore();
}
function star(g, x, y, r) {
  g.beginPath(); g.moveTo(x, y - r);
  g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r);
  g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill();
}
function heartShape(g, x, y, s) {
  g.beginPath(); g.moveTo(x, y + s * .35);
  g.bezierCurveTo(x - s, y - s * .3, x - s * .45, y - s, x, y - s * .45);
  g.bezierCurveTo(x + s * .45, y - s, x + s, y - s * .3, x, y + s * .35); g.fill();
}
function card(g, x, y, w, h, r) {   // thẻ giấy trắng như .badge / .wish trên web
  g.save();
  g.shadowColor = 'rgba(160,40,110,.22)'; g.shadowBlur = 50; g.shadowOffsetY = 22;
  g.fillStyle = '#fffdfb'; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill();
  g.shadowColor = 'transparent'; g.clip();
  g.fillStyle = radial(g, x + w / 2, y, w * .7, [[0, 'rgba(255,214,234,.9)'], [1, 'rgba(255,214,234,0)']]); g.fillRect(x, y, w, h);
  g.restore();
  g.save(); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 3; g.beginPath(); g.roundRect(x + 1.5, y + 1.5, w - 3, h - 3, r); g.stroke(); g.restore();
}
function cover(g, img, x, y, w, h, sc = 1, dx = 0) {
  const r = Math.max(w / img.width, h / img.height) * sc, iw = img.width * r, ih = img.height * r;
  g.drawImage(img, x + (w - iw) / 2 + dx, y + (h - ih) / 2, iw, ih);
}

/* ---------------- lớp chuyển động nền: cánh hoa rơi, lấp lánh, nổ tim (tính theo thời gian) ---------------- */
function makePetals(R, n = 24) {
  const COL = ['rgba(255,150,200,.6)', 'rgba(255,255,255,.9)', 'rgba(255,190,220,.65)', 'rgba(255,215,235,.8)'];
  return Array.from({length: n}, () => ({x0: R() * (W + 140), y0: R() * (H + 80), vy: 1.1 + R() * 1.7, vx: .35 + R() * .9,
    sw: R() * 6.28, r0: R() * 6.28, vr: (R() - .5) * .06, s: 12 + R() * 13, c: COL[(R() * COL.length) | 0]}));
}
function drawPetals(g, ps, t) {
  const F = t * FPS, WW = W + 140;
  for (const p of ps) {
    const y = (p.y0 + p.vy * F) % (H + 80) - 40;
    const x = (((p.x0 + p.vx * F + Math.sin(p.sw + F * .035) * 32) % WW) + WW) % WW - 70;
    g.save(); g.translate(x, y); g.rotate(p.r0 + p.vr * F); g.fillStyle = p.c;
    g.beginPath(); g.ellipse(0, 0, p.s, p.s * .6, 0, 0, 6.29); g.fill(); g.restore();
  }
}
function makeGlints(R, n = 22) {
  return Array.from({length: n}, () => ({x: R() * W, y: R() * H, r: 6 + R() * 10, p: R() * 6.28, s: .8 + R() * 1.6}));
}
function drawGlints(g, gl, t) {
  g.fillStyle = '#fff';
  for (const s of gl) { const a = Math.max(0, Math.sin(t * s.s + s.p)); if (a > .01) { g.globalAlpha = a; star(g, s.x, s.y, s.r * a); } }
  g.globalAlpha = 1;
}
const SPARKS = [[175, 330, 24, 0], [890, 300, 18, 1.3], [150, 860, 22, 2.1], [940, 990, 16, .7]];
function drawSparks(g, t) {   // sao ✦ đen mảnh như trên web
  g.fillStyle = INK;
  for (const [x, y, r, p] of SPARKS) { const k = .65 + .35 * Math.sin(t * 2.2 + p); g.globalAlpha = .75; star(g, x, y, r * k); }
  g.globalAlpha = 1;
}
const DAMP = .94, KD = DAMP / (1 - DAMP);
function makeBurst(R, t, x, y, n, kind) {
  const heart = kind === 'heart';
  return {t, ps: Array.from({length: n}, () => {
    const a = R() * 6.28, sp = heart ? 2 + R() * 4 : 2 + R() * 9;
    return {x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (heart ? 3 : 0), gy: heart ? -.1 : .12, r: heart ? 12 + R() * 14 : 6 + R() * 10,
      c: heart ? ['#ff6fb0', '#ffb8dc', '#ff3d8f', '#fff'][(R() * 4) | 0] : ['#ffffff', '#ff8cc6', '#ffe14a', '#e8559c', '#ffd3e8'][(R() * 5) | 0],
      life: (30 + R() * 28) | 0, heart};
  })};
}
function drawBursts(g, bursts, t) {
  for (const b of bursts) {
    const k = (t - b.t) * FPS; if (k < 0) continue;
    const geo = KD * (1 - Math.pow(DAMP, k));   // tổng DAMP^j, j = 1..k
    for (const q of b.ps) {
      if (k > q.life) continue;
      const a = 1 - k / q.life, x = q.x + q.vx * geo, y = q.y + q.vy * geo + q.gy / (1 - DAMP) * (k - geo);
      g.globalAlpha = a; g.fillStyle = q.c;
      if (q.heart) heartShape(g, x, y, q.r); else star(g, x, y, q.r * (.5 + a * .5));
    }
  }
  g.globalAlpha = 1;
}
function floatSprite(g, d, t) {
  const k = Math.sin(t * 6.283 / d.T + d.ph);
  g.save(); g.translate(d.x, d.y + k * 14); g.rotate((d.r + k * 4) * DEG); g.globalAlpha = .92;
  g.drawImage(d.sp, -d.w / 2, -d.w / 2, d.w, d.w); g.restore();
}
function bloomSprite(g, sp, x, y, size, k, rot) {
  if (k <= .002) return;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); g.drawImage(sp, -size / 2, -size / 2, size, size); g.restore();
}

/* ---------------- kịch bản: các cảnh và thời lượng ---------------- */
function plan(p) {
  const idx = Math.max(0, D.chiEm.indexOf(p)), photos = V.anhOf(p), wishes = (p.loiChuc || []).filter(w => w && w.noiDung);
  const S = []; let t = 0;
  const add = (kind, d, data = {}) => { S.push({kind, t0: t, t1: t + d, d, ...data}); t += d; };
  add('intro', 4);
  add('name', Math.max(4.6, photos.length * 3.4));
  if (p.danhHieu) add('title', 5.2);
  wishes.forEach((w, i) => add('wish', clamp(Array.from(w.noiDung).length / 26 + 2.2, 4.8, 7.6), {w, i, n: wishes.length}));
  add('outro', 4.6);
  S[0].first = true; S[S.length - 1].last = true;
  return {S, dur: +t.toFixed(3), idx, photos};
}

const SCENES = {
  intro(g, p, P, A, s, u, t) {
    g.textAlign = 'center';
    font(g, `700 24px ${SANS}`, 8); let r = rise(u, .1, .7, 16);
    text(g, `LEARN TO LEAP · ${String(D.tieuDe).toUpperCase()}`, W / 2, 168, {fill: INK2, alpha: r.alpha, dy: r.dy, blur: 8});
    bloomSprite(g, A.main, 540, 365, 340, back((u - .15) / 1.2), (1 - ease((u - .15) / 1.2)) * -1.2 + Math.sin(t * .6) * .05);
    ribbon(g, 575, 290, t, ease((u - .3) / 1));
    font(g, `400 128px ${SCRIPT}`); r = rise(u, .5, .9);
    text(g, 'Chúc mừng ngày', W / 2, 668, {fill: PINK, alpha: r.alpha, dy: r.dy, blur: 16});
    vnTitle(g, u - .9, 818);
    font(g, `400 54px ${NUM}`, 18); r = rise(u, 1.9, .8, 20);
    text(g, D.ngay, W / 2, 918, {fill: PINK, alpha: r.alpha, dy: r.dy});
    font(g, `italic 400 38px ${DISP}`); r = rise(u, 2.3, .9, 20);
    balance(g, D.loiMoDau, 840).forEach((l, i) => text(g, l, W / 2, 1012 + i * 56, {fill: INK2, alpha: r.alpha, dy: r.dy, blur: 10}));
  },

  name(g, p, P, A, s, u, t) {
    const PW = 576, PH = 720, PAD = 22, BOT = 88, FW = PW + PAD * 2, FH = PH + PAD + BOT, top = 92;
    const k = back((u - .05) / 1), e = ease((u - .05) / .8);
    g.save(); g.globalAlpha *= e;
    g.translate(540, top + FH / 2 + (1 - k) * 90); g.rotate((-2 - (1 - k) * 6) * DEG);
    g.save(); g.shadowColor = 'rgba(150,40,100,.3)'; g.shadowBlur = 44; g.shadowOffsetY = 20;
    g.fillStyle = '#fffaf3'; g.beginPath(); g.roundRect(-FW / 2, -FH / 2, FW, FH, 10); g.fill(); g.restore();
    const x0 = -PW / 2, y0 = -FH / 2 + PAD;
    g.save(); g.beginPath(); g.rect(x0, y0, PW, PH); g.clip();
    if (A.photos.length) {
      const seg = s.d / A.photos.length;   // 1 ảnh đứng yên cả cảnh, nhiều ảnh thì chuyển lần lượt
      A.photos.forEach((img, i) => {
        const v = u - i * seg; if (v < 0) return;
        const span = clamp(v / (seg + .7));
        g.save(); g.globalAlpha *= i === 0 ? 1 : ease(v / .7);
        cover(g, img, x0, y0, PW, PH, 1.03 + .08 * span, (i % 2 ? -1 : 1) * 14 * span); g.restore();
      });
    } else {
      const c = PAL[p.mau] || PAL.hong;
      g.fillStyle = radial(g, x0 + PW * .22, y0 + PH * .12, PH, [[0, '#fff'], [.26, c[2]], [.66, c[1]], [1, c[0]]]); g.fillRect(x0, y0, PW, PH);
      g.drawImage(A.own, -230, y0 + PH / 2 - 230, 460, 460);
    }
    font(g, `400 112px ${NUM}`);
    g.textAlign = 'right'; text(g, '20', x0 + PW - 26, y0 + 112, {fill: '#fff', glow: 'rgba(232,85,156,.75)', blur: 18});
    g.textAlign = 'left'; text(g, '10', x0 + 26, y0 + PH - 30, {fill: '#fff', glow: 'rgba(232,85,156,.75)', blur: 18});
    g.restore();
    g.textAlign = 'center'; font(g, `400 34px ${NUM}`, 10); text(g, '20 · 10', 0, FH / 2 - 32, {fill: PINK, glow: null});
    g.restore();

    g.textAlign = 'center';
    const by = top + FH + 18;
    font(g, `400 80px ${SCRIPT}`); let r = rise(u, .5, .8, 24);
    text(g, 'Gửi', W / 2, by + 78, {fill: PINK, alpha: r.alpha, dy: r.dy, blur: 14});
    fitSize(g, z => `600 ${z}px ${DISP}`, V.nm(p), 940, 92, 48); r = rise(u, .7, .8, 24);
    let y = by + 170; text(g, V.nm(p), W / 2, y, {fill: INK, alpha: r.alpha, dy: r.dy});
    if (p.goiTen) { font(g, `italic 400 38px ${DISP}`); r = rise(u, .9, .8, 18); y += 54; text(g, p.ten, W / 2, y, {fill: INK2, alpha: r.alpha, dy: r.dy, blur: 8}); }
    fitSize(g, z => `700 ${z}px ${SANS}`, String(p.vaiTro).toUpperCase(), 900, 25, 18); g.letterSpacing = '6px';
    r = rise(u, 1.1, .8, 18); y += 52; text(g, String(p.vaiTro).toUpperCase(), W / 2, y, {fill: PINK, alpha: r.alpha, dy: r.dy, blur: 8});
    g.letterSpacing = '0px';
  },

  title(g, p, P, A, s, u, t) {
    g.textAlign = 'center';
    const k = back((u - .05) / 1.1);
    bloomSprite(g, A.own, 540, 262, 330, k, Math.sin(t * .5) * .06 + (1 - ease((u - .05) / 1.1)) * -.8);
    font(g, `400 96px ${SCRIPT}`); let r = rise(u, .3, .8, 20);
    text(g, 'Vinh danh', W / 2, 512, {fill: PINK, alpha: r.alpha, dy: r.dy, blur: 14});
    font(g, `italic 500 72px ${DISP}`); const tl = balance(g, p.danhHieu, 780);
    font(g, `500 34px ${SANS}`); const dl = p.moTaDanhHieu ? balance(g, p.moTaDanhHieu, 740) : [];
    const CW = 880, top = 560, ch = 64 + 28 + 18 + tl.length * 88 + (dl.length ? 22 + dl.length * 50 : 0) + 84 + 56;
    r = rise(u, .25, .9, 50);
    g.save(); g.globalAlpha *= r.alpha; g.translate(0, r.dy);
    card(g, 540 - CW / 2, top, CW, ch, 44);
    g.save(); g.translate(540, top); g.scale(2.4, 2.4); g.fillStyle = '#ffe14a'; g.strokeStyle = '#fff'; g.lineWidth = 1.6;
    const st = new Path2D(STAR4); g.fill(st); g.stroke(st); g.restore();
    let y = top + 64 + 28;
    font(g, `700 28px ${SANS}`, 10); text(g, 'DANH HIỆU 20.10', 540, y, {fill: PINK, glow: null});
    y += 18; font(g, `italic 500 72px ${DISP}`);
    tl.forEach((l, i) => { const q = rise(u, .6 + i * .12, .8, 20); y += 88; text(g, l, 540, y - 14, {fill: INK, glow: null, alpha: q.alpha, dy: q.dy}); });
    if (dl.length) {
      y += 22; font(g, `500 34px ${SANS}`);
      dl.forEach((l, i) => { const q = rise(u, .9 + i * .1, .8, 16); y += 50; text(g, l, 540, y, {fill: INK2, glow: null, alpha: q.alpha, dy: q.dy}); });
    }
    y += 84; const q = rise(u, 1.3, .8, 14);
    fitSize(g, z => `600 ${z}px ${DISP}`, V.nm(p), 760, 42, 30); text(g, V.nm(p), 540, y, {fill: INK, glow: null, alpha: q.alpha, dy: q.dy});
    g.restore();
  },

  wish(g, p, P, A, s, u, t) {
    g.textAlign = 'center';
    font(g, `400 96px ${SCRIPT}`); let r = rise(u, .05, .7, 20);
    text(g, 'Lời chúc', W / 2, 205, {fill: PINK, alpha: r.alpha, dy: r.dy, blur: 14});
    for (let i = 0; i < s.n; i++) {
      g.save(); g.globalAlpha *= r.alpha; g.fillStyle = i === s.i ? PINK : '#f2c2da';
      g.beginPath(); g.arc(540 + (i - (s.n - 1) / 2) * 30, 256, i === s.i ? 8 : 6, 0, 7); g.fill(); g.restore();
    }
    const doc = s.w.noiDung.includes('\n');   // lời chúc dạng văn bản (phiếu, giáo án…) canh trái, mỗi mục một dòng
    const paras = s.w.noiDung.split('\n').length;
    const CW = doc ? 940 : 880, TW = doc ? 820 : 740;
    let size = 50, ls;
    for (;; size -= 2) {   // chữ to nhất vừa thẻ; văn bản thì ưu tiên mỗi mục một dòng
      font(g, `italic 400 ${size}px ${DISP}`);
      ls = doc ? s.w.noiDung.split('\n').flatMap(par => balance(g, par, TW)) : balance(g, s.w.noiDung, TW);
      if (size <= 34) break;
      if (ls.length * size * 1.5 > 640) continue;
      if (!doc || ls.length === paras || size <= 40) break;
    }
    const lh = Math.round(size * 1.5), padT = 118, ch = padT + ls.length * lh + 30 + 40 + 44;
    const top = Math.max(300, 700 - ch / 2), rot = (s.i % 2 ? 1 : -1) * 1.1 * DEG;
    r = rise(u, .15, .9, 46);
    g.save(); g.globalAlpha *= r.alpha; g.translate(540, top + ch / 2 + r.dy); g.rotate(rot);
    card(g, -CW / 2, -ch / 2, CW, ch, 40);
    g.textAlign = 'left'; font(g, `italic 400 230px ${DISP}`); text(g, '“', -CW / 2 + 44, -ch / 2 + 190, {fill: 'rgba(232,85,156,.2)', glow: null});
    font(g, `italic 400 ${size}px ${DISP}`); g.textAlign = doc ? 'left' : 'center';
    const lx = doc ? -Math.max(...ls.map(l => g.measureText(l).width)) / 2 : 0;   // khối văn bản canh trái, đặt giữa thẻ
    let y = -ch / 2 + padT + lh * .62;
    ls.forEach((l, i) => { const q = rise(u, .45 + i * .1, .7, 14); text(g, l, lx, y + i * lh, {fill: INK, glow: null, alpha: q.alpha, dy: q.dy}); });
    y += (ls.length - 1) * lh + 30 + 40;
    g.textAlign = 'center'; const q = rise(u, .6 + ls.length * .1, .7, 12);
    fitSize(g, z => `600 ${z}px ${SANS}`, '— ' + s.w.tu, 760, 30, 22);
    text(g, '— ' + s.w.tu, 0, y, {fill: PINK, glow: null, alpha: q.alpha, dy: q.dy});
    g.restore();
    footer(g, p, A, u, 1218);
  },

  outro(g, p, P, A, s, u, t) {
    g.textAlign = 'center';
    const n = A.minis.length, gap = 8, size = Math.min(100, (960 - (n - 1) * gap) / n), total = n * size + (n - 1) * gap;
    A.minis.forEach((m, i) => bloomSprite(g, m, 540 - total / 2 + size / 2 + i * (size + gap), 290 + Math.sin(t * 1.4 + i) * 6,
      size * 1.25, back((u - .1 - i * .08) / .9), Math.sin(t * .8 + i) * .12));
    font(g, `400 104px ${SCRIPT}`); let r = rise(u, .4, .8, 22);
    text(g, 'Tri ân', W / 2, 482, {fill: PINK, alpha: r.alpha, dy: r.dy, blur: 14});
    font(g, `600 64px ${DISP}`); r = rise(u, .7, .9, 22);
    balance(g, 'Cảm ơn vì đã nở hoa cùng Leap', 900).forEach((l, i) => text(g, l, W / 2, 590 + i * 80, {fill: INK, alpha: r.alpha, dy: r.dy}));
    ribbon(g, 790, 250, t, ease((u - .8) / 1));
    font(g, `400 124px ${SCRIPT}`); r = rise(u, 1.2, .9, 22);
    text(g, 'Learn to Leap', W / 2, 962, {fill: PINK, alpha: r.alpha, dy: r.dy, blur: 16});
    const ceo = D.thuCEO || {};
    if (ceo.nguoiKy) {
      const sig = [ceo.nguoiKy, ceo.chucVu].filter(Boolean).join(' · ').toUpperCase();
      fitSize(g, z => `600 ${z}px ${SANS}`, sig, 900, 26, 18); g.letterSpacing = '4px'; r = rise(u, 1.5, .8, 14);
      text(g, sig, W / 2, 1034, {fill: INK2, alpha: r.alpha, dy: r.dy, blur: 8}); g.letterSpacing = '0px';
    }
    font(g, `700 22px ${SANS}`, 8); r = rise(u, 1.8, .8, 10);
    text(g, `${D.tieuDe} · ${D.ngay}`.toUpperCase(), W / 2, 1236, {fill: INK2, alpha: r.alpha, dy: r.dy, blur: 8});
  }
};

function vnTitle(g, u, y) {   // "PHỤ NỮ VIỆT NAM" tím gradient, hiện từng chữ
  const str = 'PHỤ NỮ VIỆT NAM', chars = Array.from(str);
  const size = fitSize(g, z => `600 ${z}px ${DISP}`, str, 960, 112, 60);
  g.letterSpacing = Math.round(size * .02) + 'px';
  const ws = chars.map(ch => g.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0);
  const fill = linear(g, 0, y - size * .82, 0, y + size * .06, [[0, '#c9a2ff'], [.48, '#8a4ee6'], [1, '#5b23b8']]);
  let x = W / 2 - total / 2;
  g.textAlign = 'left';
  chars.forEach((ch, i) => {
    const k = ease((u - i * .05) / .7);
    if (k > .002 && ch !== ' ') {
      g.save(); g.globalAlpha *= k; g.translate(0, (1 - k) * 46); g.fillStyle = fill;
      g.shadowColor = 'rgba(255,255,255,.95)'; g.shadowBlur = 10; g.shadowOffsetY = 2; g.fillText(ch, x, y);
      g.shadowColor = 'rgba(190,140,255,.6)'; g.shadowBlur = 26; g.shadowOffsetY = 0; g.fillText(ch, x, y);
      g.restore();
    }
    x += ws[i];
  });
  g.textAlign = 'center'; g.letterSpacing = '0px';
}

function footer(g, p, A, u, y) {   // ảnh tròn nhỏ + tên ở chân cảnh lời chúc
  const r = rise(u, .3, .8, 12), name = V.nm(p), role = String(p.vaiTro).toUpperCase();
  font(g, `600 40px ${DISP}`); const nw = g.measureText(name).width;
  font(g, `700 20px ${SANS}`, 4); const rw = g.measureText(role).width;
  const AV = 92, bw = AV + 24 + Math.max(nw, rw), x = 540 - bw / 2;
  g.save(); g.globalAlpha *= r.alpha; g.translate(0, r.dy);
  g.save(); g.shadowColor = 'rgba(214,70,140,.35)'; g.shadowBlur = 16; g.fillStyle = '#fff';
  g.beginPath(); g.arc(x + AV / 2, y, AV / 2 + 5, 0, 7); g.fill(); g.restore();
  g.save(); g.beginPath(); g.arc(x + AV / 2, y, AV / 2, 0, 7); g.clip();
  if (A.photos.length) cover(g, A.photos[0], x, y - AV / 2, AV, AV);
  else { g.fillStyle = '#ffe3f0'; g.fillRect(x, y - AV / 2, AV, AV); g.drawImage(A.own, x - 6, y - AV / 2 - 6, AV + 12, AV + 12); }
  g.restore();
  g.strokeStyle = PINK; g.lineWidth = 3; g.beginPath(); g.arc(x + AV / 2, y, AV / 2 + 5, 0, 7); g.stroke();
  g.textAlign = 'left';
  font(g, `600 40px ${DISP}`); text(g, name, x + AV + 24, y - 2, {fill: INK, blur: 8});
  font(g, `700 20px ${SANS}`, 4); text(g, role, x + AV + 24, y + 32, {fill: PINK, blur: 6});
  g.letterSpacing = '0px'; g.textAlign = 'center';
  g.restore();
}

/* ---------------- chuẩn bị tài nguyên + vẽ một khung hình ---------------- */
async function prepare(p) {
  const P = plan(p), R = rng(hash(p.id)), kind = KINDS[P.idx % 3];
  await fontsFor(p);
  const A = {
    bg: background(), main: flowerSprite(p.mau, 'tron'), own: flowerSprite(p.mau, kind),
    deco: [
      {sp: flowerSprite('hong', 'tron', 400), x: 60, y: 60, w: 300, T: 10, r: -8, ph: 0},
      {sp: flowerSprite('dao', 'tulip', 300), x: 1050, y: 600, w: 200, T: 9, r: 14, ph: 1},
      {sp: flowerSprite('hong', 'sao', 300), x: 70, y: 1250, w: 180, T: 11, r: -10, ph: 2},
      {sp: glassSprite(), x: 985, y: 115, w: 150, T: 8, r: 8, ph: 3},
      {sp: heartSprite(), x: 990, y: 1262, w: 120, T: 7, r: 12, ph: 4}
    ],
    minis: D.chiEm.map((q, i) => flowerSprite(q.mau, KINDS[i % 3], 220)),
    photos: await Promise.all(P.photos.map(loadImg)),
    petals: makePetals(R), glints: makeGlints(R), bursts: []
  };
  const at = k => P.S.find(s => s.kind === k);
  A.bursts.push(makeBurst(R, 1.1, 540, 365, 40, 'glint'));
  A.bursts.push(makeBurst(R, at('name').t0 + 1, 236, 110, 18, 'heart'), makeBurst(R, at('name').t0 + 1.15, 846, 96, 18, 'heart'));   // hai góc trên khung ảnh, tim bay lên — không che mặt
  if (at('title')) A.bursts.push(makeBurst(R, at('title').t0 + .9, 540, 262, 50, 'glint'));
  A.bursts.push(makeBurst(R, at('outro').t0 + .6, 540, 620, 64, 'heart'));
  return {P, A};
}
function frame(g, p, P, A, t) {
  g.globalAlpha = 1; g.drawImage(A.bg, 0, 0);
  for (const d of A.deco) floatSprite(g, d, t);
  drawGlints(g, A.glints, t); drawSparks(g, t);
  drawPetals(g, A.petals, t);   // cánh hoa rơi phía sau nội dung: không che mặt, không che chữ
  for (const s of P.S) {
    if (t < s.t0 || (t >= s.t1 && !s.last)) continue;
    const u = t - s.t0;
    const a = Math.min(s.first ? 1 : ease(u / .55), s.last ? 1 : 1 - easeIO((u - (s.d - .5)) / .5));
    if (a <= .002) continue;
    g.save(); g.globalAlpha = a; SCENES[s.kind](g, p, P, A, s, u, t); g.restore();
  }
  drawBursts(g, A.bursts, t);
}

/* ---------------- nhạc: dựng offline giống hệt bộ phát trên web ---------------- */
async function renderAudio(p, dur) {
  const len = Math.ceil(dur * SR), ctx = new OfflineAudioContext(2, len, SR);
  const master = ctx.createGain(); master.connect(ctx.destination);
  master.gain.setValueAtTime(0, 0); master.gain.linearRampToValueAtTime(1, .3);
  master.gain.setValueAtTime(1, Math.max(.4, dur - 2.6)); master.gain.linearRampToValueAtTime(0, dur);
  const tn = V.tuneOf(p);
  let done = false;
  if (tn.file) {   // bài hát thật: lặp lại cho đủ thời lượng
    try {
      const buf = await ctx.decodeAudioData(await (await fetch(tn.file)).arrayBuffer());
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.connect(master); src.start(0); done = true;
    } catch (e) { /* thiếu file → dùng giai điệu */ }
  }
  if (!done) {
    const out = ctx.createGain(); out.gain.value = .15;
    const d = ctx.createDelay(); d.delayTime.value = .42;
    const fb = ctx.createGain(); fb.gain.value = .38;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    out.connect(master); out.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(master);
    const S = V.parseSong(V.SONGS[tn.key]), T = S.tim, R = rng(hash(p.id) ^ 0x5eed);
    const hz = m => 440 * Math.pow(2, (m - 69) / 12);
    const note = (m, t, v, mel) => {
      const f = hz(m), g = ctx.createGain(), o = ctx.createOscillator(), o2 = ctx.createOscillator(), g2 = ctx.createGain();
      o.type = T.w; o2.type = T.hw; g2.gain.value = T.hv;
      if (mel && T.bend && R() < T.bend) {
        o.frequency.setValueAtTime(f * .944, t); o.frequency.linearRampToValueAtTime(f, t + .14);
        o2.frequency.setValueAtTime(f * T.h * .944, t); o2.frequency.linearRampToValueAtTime(f * T.h, t + .14);
      } else { o.frequency.value = f; o2.frequency.value = f * T.h; }
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.5 * v, t + T.a); g.gain.exponentialRampToValueAtTime(.0008, t + T.d);
      o.connect(g); o2.connect(g2); g2.connect(g); g.connect(out);
      o.start(t); o2.start(t); o.stop(t + T.d + .1); o2.stop(t + T.d + .1);
    };
    for (let n = 0, t = .1; t < dur; n++, t += S.sp) {
      const c = S.chords[Math.floor(n / S.len) % S.chords.length];
      for (const x of S.pat[n % S.len]) x === 'b' ? note(c[0] - 12, t, .5) : note(c[x % 4] + 12 * (x >> 2) + S.oct, t, S.mel ? .3 : .78);
      const m = S.mel && S.mel[n % S.mel.length];
      if (m) note(m, t, .62, true);
      if (R() < S.spark) note(c[(R() * 4) | 0] + 24 + S.oct, t + S.sp / 2, .22);
    }
  }
  const buf = await ctx.startRendering();
  let peak = 0;   // chuẩn hoá âm lượng: đỉnh ≈ -1 dBFS
  for (let ch = 0; ch < 2; ch++) { const a = buf.getChannelData(ch); for (let i = 0; i < a.length; i++) { const v = Math.abs(a[i]); if (v > peak) peak = v; } }
  if (peak > 0) { const k = .89 / peak; for (let ch = 0; ch < 2; ch++) { const a = buf.getChannelData(ch); for (let i = 0; i < a.length; i++) a[i] *= k; } }
  return buf;
}

/* ---------------- mã hoá MP4 ---------------- */
async function encode(p, onProgress = () => {}) {
  if (!window.Mp4Muxer) await loadScript(MUXER);
  const {P, A} = await prepare(p);
  onProgress(0, 'đang dựng nhạc');
  const audio = await renderAudio(p, P.dur);
  const {Muxer, ArrayBufferTarget} = window.Mp4Muxer;
  const muxer = new Muxer({target: new ArrayBufferTarget(), fastStart: 'in-memory', firstTimestampBehavior: 'offset',
    video: {codec: 'avc', width: W, height: H, frameRate: FPS}, audio: {codec: 'aac', numberOfChannels: 2, sampleRate: SR}});
  let fail = null;
  const ve = new VideoEncoder({output: (c, m) => muxer.addVideoChunk(c, m), error: e => { fail = e; }});
  ve.configure({codec: 'avc1.640028', width: W, height: H, bitrate: BITRATE, framerate: FPS, latencyMode: 'quality', avc: {format: 'avc'}});
  const ae = new AudioEncoder({output: (c, m) => muxer.addAudioChunk(c, m), error: e => { fail = e; }});
  ae.configure({codec: 'mp4a.40.2', sampleRate: SR, numberOfChannels: 2, bitrate: 128000});
  const L = audio.getChannelData(0), Rr = audio.getChannelData(1), N = audio.length, CH = 4800;
  for (let i = 0; i < N; i += CH) {
    const n = Math.min(CH, N - i), data = new Float32Array(n * 2);
    data.set(L.subarray(i, i + n), 0); data.set(Rr.subarray(i, i + n), n);
    const ad = new AudioData({format: 'f32-planar', sampleRate: SR, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round(i / SR * 1e6), data});
    ae.encode(ad); ad.close();
  }
  const cv = mk(W, H), g = cv.getContext('2d', {alpha: false}), frames = Math.round(P.dur * FPS);
  let poster = null; const posterAt = Math.round((P.S[1].t0 + 2.6) * FPS);
  for (let f = 0; f < frames; f++) {
    frame(g, p, P, A, f / FPS);
    if (f === posterAt) poster = await new Promise(r => cv.toBlob(r, 'image/jpeg', .86));
    const vf = new VideoFrame(cv, {timestamp: Math.round(f * 1e6 / FPS), duration: Math.round(1e6 / FPS)});
    ve.encode(vf, {keyFrame: f % (FPS * 2) === 0}); vf.close();
    while (ve.encodeQueueSize > 6) await new Promise(r => ve.addEventListener('dequeue', r, {once: true}));
    if (fail) throw fail;
    if (f % 15 === 0) { onProgress(f / frames, 'đang quay'); await nextTick(); }
  }
  await ve.flush(); await ae.flush(); ve.close(); ae.close();
  if (fail) throw fail;
  muxer.finalize();
  return {mp4: new Blob([muxer.target.buffer], {type: 'video/mp4'}), poster, dur: P.dur};
}

async function save(name, blob) {
  try { const r = await fetch('video/' + name, {method: 'PUT', body: blob}); if (r.ok) return 'đã lưu vào video/'; } catch (e) { /* không có máy chủ nhận file */ }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 60000);
  return 'đã tải về máy';
}

/* ---------------- trang #/quay-video ---------------- */
const cache = new Map();
async function still(id, t, cv) {   // xem nhanh một khung hình (không mã hoá)
  const p = D.chiEm.find(x => x.id === id); if (!p) throw new Error('Không có ' + id);
  if (!cache.has(id)) cache.set(id, await prepare(p));
  const {P, A} = cache.get(id), g = cv.getContext('2d');
  frame(g, p, P, A, clamp(t, 0, P.dur - .001)); return P;
}
async function renderOne(p, log) {
  const t0 = performance.now(), row = log(`${V.nm(p)}: chuẩn bị…`);
  const {mp4, poster, dur} = await encode(p, (k, what) => { row.textContent = `${V.nm(p)}: ${what} ${Math.round(k * 100)}%`; });
  const where = await save(`${p.id}.mp4`, mp4);
  if (poster) await save(`${p.id}.jpg`, poster);
  row.textContent = `✓ ${p.id}.mp4 — ${dur.toFixed(1)} giây, ${(mp4.size / 1048576).toFixed(1)} MB, quay trong ${((performance.now() - t0) / 1000).toFixed(0)} giây (${where})`;
  return {id: p.id, dur, size: mp4.size, where};
}
function studio(root) {
  root.innerHTML = `
    <section style="max-width:1100px;margin:0 auto;padding:90px 20px 60px;position:relative;z-index:5">
      <h1 style="font-family:var(--display);font-size:clamp(30px,5vw,44px);text-align:center">Máy quay video thiệp</h1>
      <p style="text-align:center;color:var(--ink2);margin:8px 0 22px">Mỗi người một video MP4 1080×1350 có nhạc riêng → thư mục <b>video/</b>. Sửa data.js xong thì quay lại.</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:center;margin-bottom:18px">
        <select id="stWho" style="padding:10px 14px;border-radius:999px;border:1px solid #f2c2da;font:inherit">
          ${D.chiEm.map(p => `<option value="${esc(p.id)}">${esc(V.nm(p))} – ${esc(p.vaiTro)}</option>`).join('')}</select>
        <label>giây <input id="stT" type="number" min="0" step="0.5" value="7" style="width:76px;padding:9px;border-radius:12px;border:1px solid #f2c2da;font:inherit"></label>
        <button class="btn" id="stStill" type="button">Xem khung</button>
        <button class="btn" id="stOne" type="button">Quay người này</button>
        <button class="btn primary" id="stAll" type="button">Quay tất cả</button>
      </div>
      <div style="display:grid;grid-template-columns:minmax(0,360px) 1fr;gap:22px;align-items:start">
        <canvas id="stPv" width="${W}" height="${H}" style="width:100%;border-radius:16px;box-shadow:0 10px 30px rgba(214,70,140,.25);background:#fff"></canvas>
        <div><p id="stInfo" style="color:var(--ink2);margin-bottom:8px"></p><ol id="stLog" style="display:grid;gap:6px;padding-left:20px"></ol></div>
      </div>
    </section>`;
  const $ = id => root.querySelector('#' + id), pv = $('stPv');
  const log = msg => { const li = document.createElement('li'); li.textContent = msg; $('stLog').appendChild(li); return li; };
  const busy = on => ['stStill', 'stOne', 'stAll'].forEach(id => { $(id).disabled = on; });
  const who = () => D.chiEm.find(x => x.id === $('stWho').value);
  const show = async () => {
    const P = await still($('stWho').value, +$('stT').value || 0, pv);
    $('stInfo').textContent = `${V.nm(who())}: ${P.dur.toFixed(1)} giây · ` + P.S.map(s => `${s.kind} ${s.t0.toFixed(1)}s`).join(' · ');
  };
  const run = async list => {
    busy(true);
    try { for (const p of list) { $('stWho').value = p.id; await renderOne(p, log); } }
    catch (e) { log('✗ Lỗi: ' + (e && e.message || e)); console.error(e); }
    busy(false);
  };
  $('stStill').onclick = show;
  $('stWho').onchange = show;
  $('stOne').onclick = () => run([who()]);
  $('stAll').onclick = () => run(D.chiEm);
  show();
}

window.VuonVideo = {studio, still, encode, renderOne, plan, save};
})();

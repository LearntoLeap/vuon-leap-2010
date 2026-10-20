// Máy chủ chạy thử Vườn Leap trên máy + nhận video từ trang #/quay-video (chỉ dùng trên máy, không deploy).
// Chạy: node cong-cu/may-chu.mjs   → mở http://127.0.0.1:5210  (quay video: http://127.0.0.1:5210/#/quay-video)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {pipeline} from 'node:stream';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = +process.env.PORT || 5210;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.mp3': 'audio/mpeg', '.zip': 'application/zip'
};

http.createServer((req, res) => {
  let url;
  try { url = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400).end(); return; }

  // Nhận file từ máy quay: PUT /video/<id>.mp4 | /video/<id>.jpg
  if (req.method === 'PUT') {
    const m = /^\/video\/([a-z0-9-]+\.(?:mp4|jpg))$/.exec(url);
    if (!m) { res.writeHead(403).end('Chỉ nhận video/<id>.mp4 hoặc .jpg'); return; }
    const dir = path.join(ROOT, 'video'), tmp = path.join(dir, m[1] + '.tmp'), dst = path.join(dir, m[1]);
    fs.mkdirSync(dir, {recursive: true});
    pipeline(req, fs.createWriteStream(tmp), err => {
      try {
        if (err) throw err;
        fs.renameSync(tmp, dst);
        console.log(`Đã lưu video/${m[1]} (${(fs.statSync(dst).size / 1048576).toFixed(1)} MB)`);
        res.writeHead(200).end('ok');
      } catch (e) {   // ví dụ file đang mở ở chỗ khác: báo lỗi, không làm sập máy chủ
        console.error(`Không lưu được video/${m[1]}: ${e.message}`);
        res.writeHead(500).end(String(e));
      }
    });
    return;
  }

  const file = path.join(ROOT, url.endsWith('/') ? url + 'index.html' : url);
  if (!file.startsWith(ROOT + path.sep)) { res.writeHead(403).end(); return; }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'}).end('Không tìm thấy'); return; }
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const head = {'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store'};
    const r = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (r && (r[1] || r[2])) {   // video cần tua: trả từng đoạn
      const start = r[1] ? +r[1] : Math.max(0, st.size - +r[2]);
      const end = r[1] && r[2] ? Math.min(+r[2], st.size - 1) : st.size - 1;
      if (start > end) { res.writeHead(416, {'Content-Range': `bytes */${st.size}`}).end(); return; }
      res.writeHead(206, {...head, 'Content-Range': `bytes ${start}-${end}/${st.size}`, 'Content-Length': end - start + 1});
      if (req.method === 'HEAD') { res.end(); return; }
      pipeline(fs.createReadStream(file, {start, end}), res, () => {});   // pipeline đóng file cả khi trình duyệt ngắt giữa chừng
      return;
    }
    res.writeHead(200, {...head, 'Content-Length': st.size});
    if (req.method === 'HEAD') { res.end(); return; }
    pipeline(fs.createReadStream(file), res, () => {});
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Vườn Leap chạy ở http://127.0.0.1:${PORT}  ·  máy quay video: http://127.0.0.1:${PORT}/#/quay-video`);
});

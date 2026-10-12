import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.env.SERVE_DIR || 'dist');
const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.pdf':'application/pdf', '.woff2':'font/woff2', '.txt':'text/plain', '.xml':'application/xml'};
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, '.' + pathname);
    let status = 200;
    if (!file.startsWith(root + sep) && file !== root) {res.writeHead(403).end();return;}
    try { if ((await stat(file)).isDirectory()) file=resolve(file,'index.html'); if (!(await stat(file)).isFile()) throw new Error(); }
    catch { if (extname(pathname)) {res.writeHead(404).end();return;} const known=['/','/projects','/resume','/contact','/testimonials','/login','/403','/admin','/admin/create'].includes(pathname.replace(/\/$/,'') || '/'); status=known?200:404; file = resolve(root, known?'index.html':'404.html'); }
    res.writeHead(status, {'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    res.end(await readFile(file));
  } catch {res.writeHead(500).end();}
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log('Production fixture server ready'));

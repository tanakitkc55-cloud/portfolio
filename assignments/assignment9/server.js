'use strict';

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const stock = [12, 13, 50, 22, 55, 87, 12, 29, 10];
const inputFile = path.join(__dirname, 'cloth1.json');
const outputFile = path.join(__dirname, 'new_cloth.json');

// Serialize requests so overlapping browser requests cannot overlap file writes.
let pending = Promise.resolve();
function updateClothes() {
  const task = pending.then(async () => {
    const contents = await fs.readFile(inputFile, 'utf8');
    const clothes = JSON.parse(contents.replace(/^\uFEFF/, ''));
    if (!Array.isArray(clothes) || clothes.length !== stock.length) {
      throw new Error('cloth1.json must contain exactly 9 items.');
    }
    const updated = clothes.map((item, index) => ({
      ...item,
      stock: stock[index]
    }));
    const json = JSON.stringify(updated, null, 2);
    await fs.writeFile(outputFile, json + '\n', 'utf8');
    return json;
  });
  pending = task.catch(() => {});
  return task;
}

const server = http.createServer(async (req, res) => {
  const requested = new URL(req.url, 'http://localhost').pathname;
  const views = { '/view': ['view.html', 'text/html'], '/theme.css': ['theme.css', 'text/css'], '/view.js': ['view.js', 'text/javascript'] };
  if (views[requested]) {
    const [file, type] = views[requested];
    try { const data = await fs.readFile(path.join(__dirname, file)); res.writeHead(200, { 'Content-Type': type + '; charset=utf-8' }); res.end(data); }
    catch { res.writeHead(404); res.end('Not Found'); }
    return;
  }
  if (requested.startsWith('/portfolio/')) {
    const root = path.resolve(__dirname, '../..');
    const file = path.resolve(root, decodeURIComponent(requested.slice('/portfolio/'.length)));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    try { const data = await fs.readFile(file); const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpeg': 'image/jpeg', '.png': 'image/png' }; res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(data); }
    catch { res.writeHead(404); res.end('Not Found'); }
    return;
  }
  if (req.url !== '/') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Allow': 'GET' });
    res.end('Method Not Allowed');
    return;
  }
  try {
    // fs/promises returns Promises; await completes each step in order.
    const json = await updateClothes();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    });
    res.end(json);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Unable to read or update cloth1.json.' }));
  }
});

server.on('error', (error) => {
  console.error('Server error:', error.message);
  process.exitCode = 1;
});
server.listen(3000, () => {
  console.log('Open http://localhost:3000 in your browser.');
});

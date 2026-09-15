import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.IONSPIRE_QA_PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const path = resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
    if (!path.startsWith(root + sep) || path.includes('/.git')) { response.writeHead(403).end(); return; }
    let content = await readFile(path);
    // Local-only QA controls. These never modify or ship in product pages.
    if (extname(path) === '.html' && url.searchParams.has('qa-scale')) {
      content = Buffer.from(content.toString().replace('</head>', '<style>html{font-size:200% !important}</style></head>'));
    }
    response.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream', 'cache-control': 'no-store' });
    response.end(content);
  } catch { response.writeHead(404).end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log('Local visual checks: http://localhost:' + port + '/tests/visual.html'));

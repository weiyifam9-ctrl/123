import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const port = Number(process.env.PORT || 4173);

const dashboard = {
  user: { name: 'Alex Morgan', tier: 'Private Client' },
  balance: 248650.82,
  change: 4.8,
  currencies: [
    { code: 'USD', symbol: '$', balance: 142840.42, flag: '🇺🇸' },
    { code: 'CNY', symbol: '¥', balance: 529420.0, flag: '🇨🇳' },
    { code: 'EUR', symbol: '€', balance: 32260.18, flag: '🇪🇺' }
  ],
  transactions: [
    { name: 'Aman New York', category: 'Travel · Hotel', amount: -2850, icon: 'building', date: 'Today, 10:42' },
    { name: 'USD Yield Account', category: 'Wealth · Return', amount: 428.62, icon: 'trending', date: 'Today, 08:10' },
    { name: 'Transfer from Lin Wei', category: 'Transfer · Received', amount: 12000, icon: 'arrow', date: 'Sep 15, 18:22' },
    { name: 'The Row', category: 'Shopping · Fashion', amount: -1840, icon: 'bag', date: 'Sep 15, 12:06' }
  ]
};

export function app(req, res) {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/dashboard') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    return res.end(JSON.stringify(dashboard));
  }
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', region: 'global', timestamp: new Date().toISOString() }));
  }
  const requested = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const safePath = normalize(requested).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = join(root, safePath);
  readFile(filePath).then((content) => {
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
    res.writeHead(200, { 'content-type': `${types[extname(filePath)] || 'application/octet-stream'}; charset=utf-8` });
    res.end(content);
  }).catch(() => {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createServer(app).listen(port, () => console.log(`Aurum running at http://localhost:${port}`));
}

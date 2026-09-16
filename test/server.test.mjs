import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { app } from '../server.mjs';

test('health and dashboard endpoints return valid data', async (t) => {
  const server = createServer(app).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => server.close());
  const origin = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(`${origin}/api/health`).then((r) => r.json());
  assert.equal(health.status, 'ok');
  const dashboard = await fetch(`${origin}/api/dashboard`).then((r) => r.json());
  assert.equal(dashboard.currencies.length, 3);
  assert.equal(dashboard.transactions.length, 4);
});

test('serves the dashboard and returns 404 for missing assets', async (t) => {
  const server = createServer(app).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => server.close());
  const origin = `http://127.0.0.1:${server.address().port}`;
  const page = await fetch(origin);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Global Private Finance/);
  assert.equal((await fetch(`${origin}/missing.css`)).status, 404);
});

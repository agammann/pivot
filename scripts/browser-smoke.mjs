import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const server = spawn(process.execPath, ['serve.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;
try {
  const url = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(Error('Server startup timed out')), 10000);
    server.stdout.on('data', data => {
      output += data;
      const match = output.match(/http:\/\/127\.0\.0\.1:\d+\//);
      if (match) { clearTimeout(timer); resolve(match[0]); }
    });
    server.on('error', error => { clearTimeout(timer); reject(error); });
    server.on('exit', code => { clearTimeout(timer); reject(Error(`Server exited ${code}`)); });
  });
  browser = await chromium.launch(process.env.PIVOT_BROWSER_CHANNEL ? { channel: process.env.PIVOT_BROWSER_CHANNEL } : {});
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  assert.match(await page.title(), /Pivot/);
  assert.equal(await page.locator('[name=length]').inputValue(), '200');
  assert.equal(await page.locator('[name=width]').inputValue(), '80');
  assert(await page.locator('#diagram path').count() > 0);
  assert.equal(await page.locator('#error').innerText(), '');
  await page.locator('[name=door]').fill('1');
  assert.equal(await page.locator('#result').innerText(), 'Ruled out in this model');

  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save project', exact: true }).click();
  const download = await downloadEvent;
  const chunks = [];
  for await (const chunk of await download.createReadStream()) chunks.push(chunk);
  const saved = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  assert.equal(saved.length, 200);
  assert.equal(saved.door, 1);
  const imported = { ...saved, length: 100, width: 40, door: 90 };
  await page.locator('#file').setInputFiles({ name: 'project.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) });
  await page.waitForFunction(() => document.querySelector('[name=length]').value === '100');
  assert.equal(await page.locator('#result').innerText(), 'Unknown');
  assert.equal(await page.locator('#error').innerText(), '');
  assert.deepEqual(errors, []);
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    await page.setViewportSize({ width, height });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (process.env.PIVOT_SCREENSHOT_DIR) {
      await mkdir(process.env.PIVOT_SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({ path: path.join(process.env.PIVOT_SCREENSHOT_DIR, `pivot-${width}.png`) });
    }
  }
  console.log('PASS: initialized defaults and diagram, door check, save/import, desktop/mobile layout, no page errors');
} finally {
  if (browser) await browser.close();
  server.kill();
}


import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'artifacts/tokens-acceptance');
const MAIN_CSS = path.join(ROOT, 'artifacts/css-baselines/bcx.main.css');
const BRANCH_CSS = path.join(ROOT, 'assets/css/bcx.css');
const BRANCH_TOKENS = path.join(ROOT, 'assets/css/bcx.tokens.css');

const PAGES = [
  { id: 'home', url: '/' },
  { id: 'services', url: '/services/' },
  { id: 'industry-banking', url: '/industries/banking/' },
  { id: 'insights-shadow-ai', url: '/insights/shadow-ai-what-to-do-when-employees-use-chatgpt/' },
];
const WIDTHS = [375, 1440];

function startServer(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      if (urlPath.endsWith('/')) urlPath += 'index.html';
      if (urlPath === '') urlPath = '/index.html';
      const filePath = path.join(ROOT, urlPath);
      if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('404'); return; }
        const ext = path.extname(filePath).toLowerCase();
        const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
        res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

async function shoot(label) {
  const server = await startServer(8765);
  const browser = await chromium.launch({ headless: true });
  try {
    for (const w of WIDTHS) {
      for (const pageDef of PAGES) {
        const context = await browser.newContext({
          viewport: { width: w, height: w === 375 ? 812 : 900 },
          deviceScaleFactor: 1,
          reducedMotion: 'reduce',
        });
        const page = await context.newPage();
        await page.addInitScript(() => {
          try { document.documentElement.classList.add('no-intro'); } catch (e) {}
          try { localStorage.setItem('bcx-intro-seen', '1'); } catch (e) {}
        });
        await page.goto('http://127.0.0.1:8765' + pageDef.url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.evaluate(() => {
          document.documentElement.classList.add('no-intro');
          const intro = document.getElementById('intro');
          if (intro) intro.style.display = 'none';
          document.querySelectorAll('video,canvas').forEach((el) => { try { el.style.visibility = 'hidden'; } catch (e) {} });
        });
        await page.waitForTimeout(400);
        const out = path.join(OUT, label, `${pageDef.id}-${w}.png`);
        ensureDir(path.dirname(out));
        await page.screenshot({ path: out, fullPage: true });
        await context.close();
        console.log('shot', label, pageDef.id, w);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
}

function swapToMain() {
  fs.copyFileSync(BRANCH_CSS, BRANCH_CSS + '.branchbak');
  fs.copyFileSync(BRANCH_TOKENS, BRANCH_TOKENS + '.branchbak');
  fs.copyFileSync(MAIN_CSS, BRANCH_CSS);
  fs.writeFileSync(BRANCH_TOKENS, '/* empty for main baseline */\n:root{}\n');
}

function restoreBranch() {
  fs.copyFileSync(BRANCH_CSS + '.branchbak', BRANCH_CSS);
  fs.copyFileSync(BRANCH_TOKENS + '.branchbak', BRANCH_TOKENS);
  fs.unlinkSync(BRANCH_CSS + '.branchbak');
  fs.unlinkSync(BRANCH_TOKENS + '.branchbak');
}

function compareAll() {
  const report = [];
  let fail = 0;
  for (const w of WIDTHS) {
    for (const pageDef of PAGES) {
      const a = path.join(OUT, 'before', `${pageDef.id}-${w}.png`);
      const b = path.join(OUT, 'after', `${pageDef.id}-${w}.png`);
      const img1 = PNG.sync.read(fs.readFileSync(a));
      const img2 = PNG.sync.read(fs.readFileSync(b));
      const width = Math.min(img1.width, img2.width);
      const height = Math.min(img1.height, img2.height);
      // If dimensions differ, mark fail but still compare overlap
      const diff = new PNG({ width, height });
      const mismatchedDims = img1.width !== img2.width || img1.height !== img2.height;
      // Crop both to min box if needed by copying
      const crop = (img) => {
        if (img.width === width && img.height === height) return img;
        const out = new PNG({ width, height });
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const i = (width * y + x) << 2;
            const j = (img.width * y + x) << 2;
            out.data[i] = img.data[j];
            out.data[i+1] = img.data[j+1];
            out.data[i+2] = img.data[j+2];
            out.data[i+3] = img.data[j+3];
          }
        }
        return out;
      };
      const c1 = crop(img1);
      const c2 = crop(img2);
      const num = pixelmatch(c1.data, c2.data, diff.data, width, height, { threshold: 0.1 });
      const diffPath = path.join(OUT, 'diff', `${pageDef.id}-${w}.png`);
      ensureDir(path.dirname(diffPath));
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
      const total = width * height;
      const pct = (100 * num / total).toFixed(4);
      const ok = num === 0 && !mismatchedDims;
      if (!ok) fail++;
      report.push({ id: pageDef.id, w, num, pct, mismatchedDims, before: `${img1.width}x${img1.height}`, after: `${img2.width}x${img2.height}`, ok });
      console.log(pageDef.id, w, 'diffPixels', num, pct + '%', ok ? 'PASS' : 'FAIL');
    }
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  return fail === 0;
}

swapToMain();
await shoot('before');
restoreBranch();
await shoot('after');
const pass = compareAll();
console.log(pass ? 'ACCEPTANCE PASS' : 'ACCEPTANCE FAIL');
process.exit(pass ? 0 : 1);

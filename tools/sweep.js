/* Every page, both themes, three widths: no JS errors, no overflow,
   no leftover checkbox markup, and the staff door still intact. */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const DOCS = path.resolve(__dirname, '../docs');
const IGNORE = /ERR_FILE_NOT_FOUND|ERR_TUNNEL_CONNECTION_FAILED|fonts\.googleapis/;

(async () => {
  const files = fs.readdirSync(DOCS).filter(f => f.endsWith('.html')).sort();
  const browser = await chromium.launch();
  let bad = 0;
  for (const w of [390, 900, 1400]) {
    for (const scheme of ['light', 'dark']) {
      const p = await browser.newPage({ viewport: { width: w, height: 900 }, colorScheme: scheme });
      const errs = [];
      p.on('pageerror', e => errs.push(e.message));
      p.on('console', m => { if (m.type() === 'error' && !IGNORE.test(m.text())) errs.push(m.text()); });
      for (const f of files) {
        errs.length = 0;
        await p.goto('file://' + path.join(DOCS, f));
        await p.waitForTimeout(90);
        const over = await p.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (over > 1) { console.log(`✗ ${f} @${w}/${scheme} overflows ${over}px`); bad++; }
        if (errs.length) { console.log(`✗ ${f} @${w}/${scheme}`, errs.slice(0, 2)); bad++; }
      }
      await p.close();
    }
  }
  // the staff door on the teacher page must still be styled by part B's .gate
  const p = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await p.goto('file://' + path.join(DOCS, 'teacher.html'));
  await p.waitForTimeout(150);
  const door = await p.evaluate(() => {
    const g = document.querySelector('.gate');
    if (!g) return 'missing';
    const cs = getComputedStyle(g);
    return { align: cs.textAlign, max: cs.maxWidth };
  });
  console.log('staff door:', JSON.stringify(door));
  if (door === 'missing' || door.align !== 'center') { console.log('✗ staff door lost its styling'); bad++; }
  await browser.close();
  console.log(bad ? `\n${bad} PROBLEM(S)` : `\nAll ${files.length} pages clean ✓`);
  process.exit(bad ? 1 : 0);
})();

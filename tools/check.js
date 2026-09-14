/* Drive the new gate system in a real browser: click every gate on every
   activity page, answer every question and every quiz, and check that the
   robot part actually gets earned and survives a reload. */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const DOCS = 'file://' + path.resolve(__dirname, '../docs');
const PARTSJSON = path.resolve(__dirname, '../docs/img/parts/parts.json');

/* robot.js carries its own copy of the fourteen boxes, because the site is
   opened from file:// as often as from Pages and fetch() of a local JSON is
   blocked there. A copy can drift from tools/parts.py's output, and the drift
   would show as parts landing a few pixels out of place — so diff them here. */
function partTableDrift() {
  const src = fs.readFileSync(path.resolve(__dirname, '../docs/robot.js'), 'utf8');
  const m = /var PARTS = (\[[\s\S]*?\n\]);/.exec(src);
  if (!m) return ['robot.js: could not find the PARTS table'];
  const table = eval(m[1]);
  const json = JSON.parse(fs.readFileSync(PARTSJSON, 'utf8'));
  const out = [];
  if (table.length !== Object.keys(json).length) {
    out.push(`robot.js has ${table.length} parts, parts.json has ${Object.keys(json).length}`);
  }
  for (const p of table) {
    const j = json[String(p.n)];
    if (!j) { out.push(`robot.js part ${p.n} is not in parts.json`); continue; }
    for (const f of ['key', 'label', 'verb', 'x', 'y', 'w', 'h']) {
      if (j[f] !== p[f]) out.push(`part ${p.n} ${f}: robot.js ${p[f]} vs parts.json ${j[f]}`);
    }
  }
  return out;
}

(async () => {
  const browser = await chromium.launch();
  let bad = 0;

  const drift = partTableDrift();
  if (drift.length) {
    drift.forEach(d => console.log('  ✗ ' + d));
    console.log('  (re-run tools/parts.py, then paste parts.json into robot.js)');
    bad += drift.length;
  } else {
    console.log("robot.js's part table matches parts.json ✓");
  }
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = [];
  const IGNORE = /ERR_FILE_NOT_FOUND|ERR_TUNNEL_CONNECTION_FAILED|fonts\.googleapis/;
  page.on('console', m => { if (m.type() === 'error' && !IGNORE.test(m.text())) errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));

  // --- the zero state: a brand-new student should meet Pip switched off ---
  {
    const fresh = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    await fresh.goto(`${DOCS}/index.html`);
    await fresh.evaluate(() => localStorage.clear());
    await fresh.reload();
    await fresh.waitForTimeout(250);
    const z = await fresh.$eval('.robothall .pipfig', el => ({
      off: el.classList.contains('off'),
      f: el.style.getPropertyValue('--f'),
      src: el.querySelector('.pipghost').getAttribute('src'),
      w: el.querySelector('.pipghost').naturalWidth,
      h: el.querySelector('.pipghost').naturalHeight,
      wash: getComputedStyle(el.querySelector('.pipghost')).filter,
      parts: el.querySelectorAll('.pippart').length,
      lit: [].slice.call(el.querySelectorAll('.pippart'))
             .filter(i => +getComputedStyle(i).opacity > 0.01).length }));
    console.log('\nzero state:', JSON.stringify(z));
    if (!z.off || z.f !== '0%') { console.log('  ✗ Pip is not in the off state at zero'); bad++; }
    if (!/pip-off\.png$/.test(z.src)) { console.log('  ✗ zero state is not using pip-off.png'); bad++; }
    if (z.w !== 420 || z.h !== 557) { console.log(`  ✗ pip-off is ${z.w}x${z.h}, must match pip-master 420x557`); bad++; }
    if (z.wash !== 'none') { console.log(`  ✗ the off pose is being washed out (filter: ${z.wash})`); bad++; }
    if (z.parts !== 14) { console.log(`  ✗ ${z.parts} part layers drawn, expected 14`); bad++; }
    if (z.lit !== 0) { console.log(`  ✗ ${z.lit} parts visible at zero, expected none`); bad++; }
    await fresh.close();
  }

  for (let n = 0; n < 14; n++) {
    errs.length = 0;
    await page.goto(`${DOCS}/activity-${n}.html`);
    await page.waitForTimeout(120);

    const gates = await page.$$eval('.ckpt', gs => gs.map(g => ({
      id: g.dataset.gate, ask: g.classList.contains('ask'),
      typed: g.classList.contains('typed'), quiz: g.classList.contains('quizgate') })));
    const pips = await page.$$eval('.pip', p => p.length);
    if (pips !== gates.length) { console.log(`  ✗ a${n}: ${pips} pips for ${gates.length} gates`); bad++; }

    // every ask gate must have a question rendered into it
    for (const g of gates.filter(g => g.ask)) {
      const opts = await page.$$eval(`.ckpt[data-gate="${g.id}"] .opt`, o => o.length);
      if (opts < 2) { console.log(`  ✗ a${n}: ask gate "${g.id}" rendered no options`); bad++; }
    }

    // --- clear everything the way a student would ---
    let gi = 0;
    for (const g of gates) {
      const sel = `.ckpt[data-gate="${g.id}"]`;
      if (g.ask) {
        const right = await page.evaluate(id => window.ACTIVITY.checks[id].right, g.id);
        await page.click(`${sel} .opt >> nth=${right}`);
      } else if (g.typed) {
        const lines = await page.evaluate(() => window.ACTIVITY.typer);
        for (let i = 0; i < lines.length; i++) {
          await page.fill(`#typer input >> nth=${i}`, lines[i]);
        }
      } else if (g.quiz) {
        const qs = await page.evaluate(() => window.ACTIVITY.quiz.map(q => q.right));
        for (let i = 0; i < qs.length; i++) {
          await page.click(`#quizbox .q >> nth=${i} >> .opt >> nth=${qs[i]}`);
        }
      } else {
        await page.click(`${sel} .gtick`);
      }
      await page.waitForTimeout(30);

      /* Kamil's call, 14 Sep 2026: an activity under way shows its part faintly
         materialising, so a single checkpoint visibly moves something. It has
         to stay well under half solid, or a half-done part reads as a fitted
         one. Checked once, on activity 0. */
      if (n === 0 && gi === 0 && gates.length > 1) {
        await page.waitForTimeout(700);          // let the fade finish
        const mid = await page.$eval('#partart .pippart[data-part="0"]',
          el => ({ on: el.classList.contains('on'), op: +getComputedStyle(el).opacity }));
        console.log(`  part 0 after 1 of ${gates.length}: opacity ${mid.op}, fitted=${mid.on}`);
        if (mid.on) { console.log('  ✗ a0: part marked fitted before the activity is done'); bad++; }
        if (!(mid.op > 0 && mid.op < 0.5)) {
          console.log('  ✗ a0: an in-progress part must materialise faintly (0 < opacity < 0.5)'); bad++;
        }
      }
      gi++;
    }
    await page.waitForTimeout(250);

    const open = await page.$$eval('.ckpt.open', g => g.length);
    if (open !== gates.length) { console.log(`  ✗ a${n}: ${open}/${gates.length} gates opened`); bad++; }
    const bayDone = await page.$eval('#partbay', b => b.classList.contains('done'));
    if (!bayDone) { console.log(`  ✗ a${n}: part bay never completed`); bad++; }

    // survives a reload
    await page.reload();
    await page.waitForTimeout(200);
    const open2 = await page.$$eval('.ckpt.open', g => g.length);
    if (open2 !== gates.length) {
      console.log(`  ✗ a${n}: after reload ${open2} open, expected ${gates.length}`); bad++;
    }
    const bay2 = await page.$eval('#partbay', b => b.classList.contains('done'));
    if (!bay2) { console.log(`  ✗ a${n}: part not kept after reload`); bad++; }

    // the activity's own part is fitted, loaded, and boxed where parts.json says
    const pj = JSON.parse(fs.readFileSync(PARTSJSON, 'utf8'))[String(n)];
    const part = await page.$eval(`#partart .pippart[data-part="${n}"]`, el => ({
      on: el.classList.contains('on'), op: +getComputedStyle(el).opacity,
      nw: el.naturalWidth, src: el.getAttribute('src'),
      left: el.style.left, top: el.style.top, width: el.style.width }));
    if (!part.on || part.op < 0.99) {
      console.log(`  ✗ a${n}: part not fitted after reload (on=${part.on}, opacity=${part.op})`); bad++;
    }
    if (!part.nw) { console.log(`  ✗ a${n}: ${part.src} never loaded`); bad++; }
    const box = `${pj.x}% ${pj.y}% ${pj.w}%`;
    const got = `${part.left} ${part.top} ${part.width}`;
    if (box !== got) { console.log(`  ✗ a${n}: part boxed at ${got}, parts.json says ${box}`); bad++; }

    // and a part that has not been earned yet is still invisible
    if (n < 13) {
      const next = await page.$eval(`#partart .pippart[data-part="${n + 1}"]`,
        el => +getComputedStyle(el).opacity);
      if (next > 0.01) { console.log(`  ✗ a${n}: part ${n + 1} showing at ${next} before it is earned`); bad++; }
    }
    if (errs.length) { console.log(`  ✗ a${n} console:`, errs.slice(0, 3)); bad++; }
    console.log(`activity-${n}: ${gates.length} gates, all cleared${bad ? '' : ' ✓'}`);
  }

  // --- the robot itself ---
  await page.goto(`${DOCS}/index.html`);
  await page.waitForTimeout(250);
  const t = await page.evaluate(() => window.LILEX.tally());
  console.log('\nrobot tally on the landing page:', JSON.stringify(t));
  if (t.built !== 14) { console.log('  ✗ expected 14 parts built'); bad++; }
  const fill = await page.$eval('.robothall .pipfig', el =>
    ({ f: el.style.getPropertyValue('--f'), done: el.classList.contains('done'),
       img: el.querySelector('.pipfull').naturalWidth,
       imgh: el.querySelector('.pipfull').naturalHeight,
       src: el.querySelector('.pipfull').getAttribute('src'),
       on: el.querySelectorAll('.pippart.on').length }));
  const done = await page.$$eval('.act.done', a => a.length);
  console.log(`Pip fill: ${fill.f} (done=${fill.done}, artwork ${fill.img}px wide), ` +
              `landing cards marked done: ${done}`);
  if (fill.f !== '100%' || !fill.done || !fill.img || done !== 14) bad++;
  if (fill.on !== 14) { console.log(`  ✗ ${fill.on} of 14 parts marked fitted`); bad++; }
  if (!/pip-glowing\.png$/.test(fill.src)) { console.log('  ✗ 14 of 14 is not using pip-glowing.png'); bad++; }
  /* the finished pose has to share pip-master's box or the last swap jumps the
     page under the student — tools/padpose.py is what pads it */
  if (fill.img !== 420 || fill.imgh !== 557) {
    console.log(`  ✗ pip-glowing is ${fill.img}x${fill.imgh}, must match pip-master 420x557`); bad++;
  }

  // --- layout: no horizontal overflow, both themes, three widths ---
  for (const w of [390, 900, 1400]) {
    for (const scheme of ['light', 'dark']) {
      const p2 = await browser.newPage({ viewport: { width: w, height: 900 }, colorScheme: scheme });
      for (const f of ['index.html', 'activity-4.html', 'activity-9.html', 'activity-13.html']) {
        await p2.goto(`${DOCS}/${f}`);
        await p2.waitForTimeout(120);
        const over = await p2.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (over > 1) { console.log(`  ✗ ${f} @${w} ${scheme}: overflows by ${over}px`); bad++; }
      }
      await p2.close();
    }
  }
  console.log(over(bad));
  function over(b) { return b ? `\n${b} PROBLEM(S)` : '\nAll checks passed ✓'; }
  await browser.close();
  process.exit(bad ? 1 : 0);
})();

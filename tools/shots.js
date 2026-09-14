/* Render the robot at several stages so it can be looked at, not just tested. */
const { chromium } = require('playwright');
const path = require('path');
const DOCS = 'file://' + path.resolve(__dirname, '../docs');
const OUT = path.resolve(__dirname, '../shots');
require('fs').mkdirSync(OUT, { recursive: true });

const GATES = { 0:6,1:6,2:7,3:7,4:7,5:7,6:7,7:7,8:7,9:8,10:7,11:7,12:7,13:8 };

/* write progress straight into localStorage: n -> how many gates are cleared */
function seed() {
  return ({ done, GATES }) => {
    localStorage.clear();
    Object.keys(done).forEach(n => {
      const g = {}, k = done[n];
      for (let i = 0; i < k; i++) g['g' + i] = 1;
      localStorage.setItem('lilex5v2:activity-' + n + '.html',
        JSON.stringify({ g, gt: GATES[n] }));
    });
  };
}

(async () => {
  const browser = await chromium.launch();

  const stages = {
    'robot-1-blueprint': {},
    'robot-2-early':     { 0:6, 1:6, 2:3 },
    'robot-3-half':      { 0:6, 1:6, 2:7, 3:7, 4:7, 5:7, 6:4 },
    'robot-4-most':      { 0:6,1:6,2:7,3:7,4:7,5:7,6:7,7:7,8:7,9:8,10:7,11:3 },
    'robot-5-complete':  Object.fromEntries(Object.entries(GATES)),
  };

  for (const [name, done] of Object.entries(stages)) {
    for (const scheme of ['light', 'dark']) {
      const p = await browser.newPage({ viewport: { width: 1000, height: 760 }, colorScheme: scheme });
      await p.goto(`${DOCS}/index.html`);
      await p.evaluate(seed(), { done, GATES });
      await p.reload();
      await p.waitForTimeout(400);
      const el = await p.$('.robothall');
      await el.screenshot({ path: `${OUT}/${name}-${scheme}.png` });
      await p.close();
    }
  }

  /* a single part being printed, on its own activity page */
  for (const [n, k, tag] of [[3, 3, 'arm-part'], [7, 5, 'screen-part'], [9, 8, 'legs-done']]) {
    const p = await browser.newPage({ viewport: { width: 1000, height: 900 } });
    await p.goto(`${DOCS}/activity-${n}.html`);
    await p.evaluate(({ n, k }) => {
      const ids = [...document.querySelectorAll('.ckpt')].map(e => e.dataset.gate);
      const g = {}; ids.slice(0, k).forEach(id => g[id] = 1);
      localStorage.setItem('lilex5v2:activity-' + n + '.html',
        JSON.stringify({ g, gt: ids.length }));
    }, { n, k });
    await p.reload();
    await p.waitForTimeout(400);
    await (await p.$('#partbay')).screenshot({ path: `${OUT}/part-${tag}.png` });
    await p.close();
  }

  /* the rail, and a gate in both states */
  const p = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await p.goto(`${DOCS}/activity-4.html`);
  await p.evaluate(([G]) => {
    localStorage.clear();
    for (let n = 0; n <= 7; n++) {
      const g = {}; for (let i = 0; i < (n === 7 ? 3 : G[n]); i++) g['g' + i] = 1;
      localStorage.setItem('lilex5v2:activity-' + n + '.html', JSON.stringify({ g, gt: G[n] }));
    }
  }, [GATES]);
  await p.reload();
  await p.waitForTimeout(400);
  await (await p.$('.railbox')).screenshot({ path: `${OUT}/rail.png` });
  await p.screenshot({ path: `${OUT}/page-top.png`, clip: { x: 0, y: 0, width: 1400, height: 420 } });
  const gate = await p.$('.ckpt[data-gate="idea"]');
  await gate.scrollIntoViewIfNeeded();
  await gate.screenshot({ path: `${OUT}/gate-question.png` });
  const tick = await p.$('.ckpt[data-gate="build"]');
  await tick.scrollIntoViewIfNeeded();
  await tick.screenshot({ path: `${OUT}/gate-tick.png` });
  const ty = await p.$('.ckpt.typed');
  await ty.scrollIntoViewIfNeeded();
  await ty.screenshot({ path: `${OUT}/gate-typer.png` });
  await p.close();

  await browser.close();
  console.log('shots written to', OUT);
})();

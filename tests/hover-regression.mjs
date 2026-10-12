import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chromium } from 'playwright';

// Run against a local server: HOVER_BASE_URL=http://127.0.0.1:5182 node --test tests/hover-regression.mjs
// All API calls are intercepted; no screenshots, traces, or report files are generated.
for (const mode of ['chrome', 'touch']) {
  test(`${mode}: buttons retain visibility and click targets through hover cycles`, async () => {
    const browser = await chromium.launch({ channel: 'chrome' });
    try {
      const page = await browser.newPage({ viewport: mode === 'touch' ? { width: 390, height: 844 } : { width: 1440, height: 900 }, isMobile: mode === 'touch', hasTouch: mode === 'touch' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await page.route('**/api/**', r => r.fulfill({ json: [] }));
      await page.addInitScript(() => sessionStorage.setItem('portfolio_jwt_token', `e30.${btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))}.signature`));
      for (const route of ['/', '/resume', '/projects', '/contact', '/testimonials', '/admin']) {
        await page.goto((process.env.HOVER_BASE_URL || 'http://127.0.0.1:5182') + route);
        await page.waitForTimeout(1800);
        const controls = page.locator('button:not(:disabled), a.button-like');
        for (const control of await controls.all()) {
          if (!await control.isVisible()) continue;
          await control.scrollIntoViewIfNeeded();
          await page.waitForTimeout(700);
          const original = await control.elementHandle();
          const inspect = async () => {
            assert.equal(await control.evaluate((e, old) => e === old, original), true, `${route}: remounted`);
            const result = await control.evaluate(e => {
              const rect = e.getBoundingClientRect();
              const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
              let opacity = 1;
              for (let n = e; n; n = n.parentElement) {
                const s = getComputedStyle(n);
                opacity *= Number(s.opacity);
                if (s.visibility !== 'visible' || s.display === 'none') return false;
              }
              return opacity > 0.99 && rect.width > 0 && rect.height > 0 && (hit === e || e.contains(hit));
            });
            assert.ok(result, `${route}: ${await control.textContent()} hidden or obstructed`);
          };
          for (let cycle = 0; cycle < 3; cycle++) {
            await control.hover();
            await page.waitForTimeout(80);
            await inspect();
            await page.waitForTimeout(250);
            await inspect();
            await page.mouse.move(1, 1);
            await page.waitForTimeout(250);
            await inspect();
          }
          await control.focus();
          await inspect();
          await control.click({ trial: true });
        }
        const menu = page.getByRole('button', { name: 'Open menu', exact: true });
        if (await menu.count()) {
          if (mode === 'touch') await menu.tap(); else { await menu.focus(); await page.keyboard.press('Enter'); }
          await page.getByRole('button', { name: 'Close menu', exact: true }).waitFor();
          await page.keyboard.press('Escape');
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `${route}: overflow`);
        console.log(`${mode} ${route}: hover, leave, focus, hit targets passed`);
      }
      assert.deepEqual(errors, []);
    } finally { await browser.close(); }
  });
}

import { expect, type Page, test } from '@playwright/test';

/**
 * The markdown toolbar edits the textarea through the real selection API, and its buttons
 * are reached by both pointer and keyboard — neither survives a jsdom-only test. Everything
 * here is asserted on the resulting value, caret and computed style.
 */

const EDITOR = '[data-slot="markdown-editor"]';
const PREVIEW = '[data-slot="markdown-preview"]';

/** Opens the page and returns the first (empty) editor example, seeded with `markdown`. */
async function open(page: Page, markdown: string) {
  await page.goto('/components/markdown-editor');
  const editor = page.locator(EDITOR).first();
  const textarea = editor.locator('textarea');
  await expect(textarea).toBeVisible();
  await textarea.fill(markdown);
  return { editor, textarea };
}

const select = (page: Page, start: number, end: number) =>
  page
    .locator(`${EDITOR} textarea`)
    .first()
    .evaluate(
      (element: HTMLTextAreaElement, range) => {
        element.focus();
        element.setSelectionRange(range.start, range.end);
      },
      { start, end },
    );

const caret = (page: Page) =>
  page
    .locator(`${EDITOR} textarea`)
    .first()
    .evaluate((element: HTMLTextAreaElement) => [element.selectionStart, element.selectionEnd]);

test.describe('markdown editor toolbar', () => {
  test('bold wraps the live selection and leaves the caret inside the markers', async ({
    page,
  }) => {
    const { editor, textarea } = await open(page, 'hello world');
    await select(page, 0, 5);
    await editor.getByRole('button', { name: 'Bold' }).click();

    await expect(textarea).toHaveValue('**hello** world');
    // The click blurs the textarea before the handler runs — the selection has to survive it.
    expect(await caret(page)).toEqual([2, 7]);
    // Focus returns to the textarea so the user can keep typing without reaching for the mouse.
    await expect(textarea).toBeFocused();
  });

  test('a keyboard user can reach and fire a tool', async ({ page }) => {
    const { editor, textarea } = await open(page, 'hello world');
    await select(page, 0, 5);

    const bold = editor.getByRole('button', { name: 'Bold' });
    await bold.focus();
    await expect(bold).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(textarea).toHaveValue('**hello** world');

    // …and Space, the other activation key for a button.
    await select(page, 2, 7);
    await editor.getByRole('button', { name: 'Italic' }).focus();
    await page.keyboard.press(' ');
    await expect(textarea).toHaveValue('***hello*** world');
  });

  test('typing after a tool continues inside the markers', async ({ page }) => {
    const { editor, textarea } = await open(page, '');
    await select(page, 0, 0);
    await editor.getByRole('button', { name: 'Code' }).click();
    await page.keyboard.type('npm i');
    await expect(textarea).toHaveValue('`npm i`');

    await editor.getByRole('button', { name: 'Preview' }).click();
    await expect(editor.locator(`${PREVIEW} code`)).toHaveText('npm i');
  });

  test('the list tool prefixes every selected line and previews as a real list', async ({
    page,
  }) => {
    const { editor, textarea } = await open(page, 'one\ntwo');
    await select(page, 0, 7);
    await editor.getByRole('button', { name: 'Bullet list' }).click();
    await expect(textarea).toHaveValue('- one\n- two');

    // Pressing the other list tool converts rather than clearing.
    await editor.getByRole('button', { name: 'Numbered list' }).click();
    await expect(textarea).toHaveValue('1. one\n2. two');

    await editor.getByRole('button', { name: 'Preview' }).click();
    const items = editor.locator(`${PREVIEW} ol li`);
    await expect(items).toHaveCount(2);
    // A real <ol>, not two <br>-joined lines: it carries a marker and an inline-start indent.
    await expect(items.first()).toHaveCSS('display', 'list-item');
    await expect(editor.locator(`${PREVIEW} ol`)).toHaveCSS('list-style-type', 'decimal');
    expect((await items.first().boundingBox())!.x).toBeGreaterThan(
      (await editor.locator(PREVIEW).boundingBox())!.x,
    );
  });

  test('the rendered preview actually styles the marks it emits', async ({ page }) => {
    const { editor } = await open(page, '# Title\n**b** *i* ~~s~~');
    await editor.getByRole('button', { name: 'Preview' }).click();
    const preview = editor.locator(PREVIEW);

    await expect(preview.locator('h1')).toHaveText('Title');
    const heading = await preview.locator('h1').evaluate((element) => {
      const style = getComputedStyle(element);
      return { weight: style.fontWeight, size: Number.parseFloat(style.fontSize) };
    });
    expect(heading.weight).toBe('700');
    const body = await preview.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
    expect(heading.size).toBeGreaterThan(body);

    await expect(preview.locator('strong')).toHaveCSS('font-weight', '700');
    await expect(preview.locator('em')).toHaveCSS('font-style', 'italic');
    await expect(preview.locator('del')).toHaveCSS('text-decoration-line', 'line-through');
  });

  test('markup in the source is shown, never executed', async ({ page }) => {
    const { editor } = await open(page, '<img src=x onerror="window.__pwned=1">\n**safe**');
    await editor.getByRole('button', { name: 'Preview' }).click();
    const preview = editor.locator(PREVIEW);

    await expect(preview.locator('strong')).toHaveText('safe');
    await expect(preview.locator('img')).toHaveCount(0);
    await expect(preview).toContainText('<img src=x onerror="window.__pwned=1">');
    expect(await page.evaluate(() => '__pwned' in window)).toBe(false);
  });

  test('the toolbar is hidden over the preview and the draft survives the round trip', async ({
    page,
  }) => {
    const { editor, textarea } = await open(page, '- draft');
    await expect(editor.getByRole('toolbar')).toBeVisible();

    await editor.getByRole('button', { name: 'Preview' }).click();
    await expect(editor.getByRole('toolbar')).toHaveCount(0);
    await expect(editor.locator(`${PREVIEW} li`)).toHaveText('draft');

    await editor.getByRole('button', { name: 'Write' }).click();
    await expect(textarea).toHaveValue('- draft');
    await expect(editor.getByRole('toolbar')).toBeVisible();
  });

  test('the toolbar names every tool for assistive tech and stays inside the editor', async ({
    page,
  }) => {
    const { editor } = await open(page, '');
    const toolbar = editor.getByRole('toolbar');
    await expect(toolbar).toHaveAttribute('aria-label', 'Formatting');

    const tools = toolbar.getByRole('button');
    await expect(tools).toHaveCount(6);
    for (const name of [
      'Bold',
      'Italic',
      'Strikethrough',
      'Code',
      'Bullet list',
      'Numbered list',
    ]) {
      await expect(toolbar.getByRole('button', { name, exact: true })).toHaveCount(1);
    }

    // The row wraps rather than spilling out of the bordered card.
    const box = (await toolbar.boundingBox())!;
    const card = (await editor.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(card.x - 1);
    expect(box.x + box.width).toBeLessThanOrEqual(card.x + card.width + 1);
  });

  test('preview list indentation mirrors under dir="rtl"', async ({ page }) => {
    const { editor } = await open(page, '- one\n- two');
    await editor.getByRole('button', { name: 'Preview' }).click();
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl';
    });

    const list = editor.locator(`${PREVIEW} ul`);
    const padding = await list.evaluate((element) => {
      const style = getComputedStyle(element);
      return { left: style.paddingLeft, right: style.paddingRight };
    });
    expect(padding.right).not.toBe('0px');
    expect(padding.left).toBe('0px');
  });
});

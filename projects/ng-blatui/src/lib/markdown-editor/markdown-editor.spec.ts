import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { provideBuiLabels } from '../i18n/labels';

import { BuiMarkdownEditor } from './markdown-editor';

@Component({
  imports: [BuiMarkdownEditor],
  template: `<bui-markdown-editor
    [(value)]="md"
    [rows]="rows()"
    [name]="name()"
    [placeholder]="placeholder()"
  />`,
})
class TestHost {
  readonly md = signal('');
  readonly rows = signal(8);
  readonly name = signal('');
  readonly placeholder = signal('Write markdown…');
}

function host(markdown = ''): ComponentFixture<TestHost> {
  const fixture = TestBed.createComponent(TestHost);
  fixture.componentInstance.md.set(markdown);
  fixture.detectChanges();
  return fixture;
}

const root = (fixture: ComponentFixture<TestHost>) => fixture.nativeElement as HTMLElement;
const textareaOf = (fixture: ComponentFixture<TestHost>) =>
  root(fixture).querySelector('textarea')!;
const toolsOf = (fixture: ComponentFixture<TestHost>) =>
  root(fixture).querySelectorAll<HTMLButtonElement>('[role="toolbar"] button');
const toolNamed = (fixture: ComponentFixture<TestHost>, label: string) =>
  [...toolsOf(fixture)].find((button) => button.getAttribute('aria-label') === label)!;

/** Selects `[start, end)` in the textarea, presses a toolbar tool, and returns the new markdown. */
function useTool(
  fixture: ComponentFixture<TestHost>,
  label: string,
  start: number,
  end = start,
): string {
  textareaOf(fixture).setSelectionRange(start, end);
  toolNamed(fixture, label).click();
  fixture.detectChanges();
  return fixture.componentInstance.md();
}

function preview(fixture: ComponentFixture<TestHost>): HTMLElement {
  const tabs = [...root(fixture).querySelectorAll<HTMLButtonElement>('button')].filter(
    (button) => !button.closest('[role="toolbar"]'),
  );
  tabs[1].click();
  fixture.detectChanges();
  return root(fixture).querySelector<HTMLElement>('[data-slot="markdown-preview"]')!;
}

describe('BuiMarkdownEditor', () => {
  describe('preview rendering', () => {
    it('renders headings, inline marks and code', () => {
      const fixture = host('# One\n## Two\n### Three\n**b** *i* ~~s~~ `c`');
      const html = preview(fixture).innerHTML;
      expect(html).toContain('<h1>One</h1>');
      expect(html).toContain('<h2>Two</h2>');
      expect(html).toContain('<h3>Three</h3>');
      expect(html).toContain('<strong>b</strong>');
      expect(html).toContain('<em>i</em>');
      expect(html).toContain('<del>s</del>');
      expect(html).toContain('<code>c</code>');
    });

    it('leaves a fourth-level hash and a space-less hash as plain text', () => {
      const html = preview(host('#### Four\n#NoSpace')).innerHTML;
      expect(html).not.toContain('<h');
      expect(html).toContain('#### Four');
      expect(html).toContain('#NoSpace');
    });

    it('groups consecutive bullets into one list, for either bullet character', () => {
      const rendered = preview(host('- one\n* two'));
      expect(rendered.querySelectorAll('ul')).toHaveLength(1);
      expect(rendered.querySelectorAll('ul li')).toHaveLength(2);
      // List items are their own blocks — no <br> smuggled in between them.
      expect(rendered.querySelector('ul')!.innerHTML).toBe('<li>one</li><li>two</li>');
    });

    it('starts a new list when the marker kind changes', () => {
      const rendered = preview(host('- bullet\n1. first\n2. second'));
      expect(rendered.querySelectorAll('ul li')).toHaveLength(1);
      expect(rendered.querySelectorAll('ol li')).toHaveLength(2);
    });

    it('renders inline marks inside list items and headings', () => {
      const rendered = preview(host('# A **bold** title\n- an *italic* item'));
      expect(rendered.querySelector('h1')!.innerHTML).toBe('A <strong>bold</strong> title');
      expect(rendered.querySelector('li')!.innerHTML).toBe('an <em>italic</em> item');
    });

    it('keeps plain lines separated by <br> and closes a list before following text', () => {
      const html = preview(host('a\nb\n- item\ntail')).innerHTML;
      expect(html).toBe('a<br>b<ul><li>item</li></ul>tail');
    });

    it('escapes HTML so markup in the source cannot execute', () => {
      const rendered = preview(
        host('<script>alert(1)</script>\n<img src=x onerror=alert(1)>\nA & B'),
      );
      expect(rendered.querySelector('script')).toBeNull();
      expect(rendered.querySelector('img')).toBeNull();
      expect(rendered.textContent).toContain('<script>alert(1)</script>');
      expect(rendered.textContent).toContain('A & B');
    });

    it('escapes HTML that is nested inside markdown syntax', () => {
      const rendered = preview(host('- **<img src=x onerror=alert(1)>**'));
      expect(rendered.querySelector('img')).toBeNull();
      expect(rendered.querySelector('li strong')!.textContent).toBe('<img src=x onerror=alert(1)>');
    });

    it('renders an empty document as nothing', () => {
      expect(preview(host('')).innerHTML).toBe('');
    });
  });

  describe('toolbar', () => {
    it('exposes six labelled tools in a toolbar, mirroring the rich-text editor', () => {
      const fixture = host();
      const labels = [...toolsOf(fixture)].map((button) => button.getAttribute('aria-label'));
      expect(labels).toEqual([
        'Bold',
        'Italic',
        'Strikethrough',
        'Code',
        'Bullet list',
        'Numbered list',
      ]);
      for (const button of toolsOf(fixture)) {
        expect(button.type).toBe('button');
        expect(button.title).toBe(button.getAttribute('aria-label'));
      }
    });

    it('is shown only while writing, never over the preview', () => {
      const fixture = host('hi');
      expect(root(fixture).querySelector('[role="toolbar"]')).not.toBeNull();
      preview(fixture);
      expect(root(fixture).querySelector('[role="toolbar"]')).toBeNull();
    });

    it('wraps and unwraps the selection', () => {
      const fixture = host('hello world');
      expect(useTool(fixture, 'Bold', 0, 5)).toBe('**hello** world');
      // The caret lands inside the markers so typing continues in bold.
      expect(textareaOf(fixture).selectionStart).toBe(2);
      expect(textareaOf(fixture).selectionEnd).toBe(7);
      // The selection now sits between the markers — pressing again removes them.
      expect(useTool(fixture, 'Bold', 2, 7)).toBe('hello world');
    });

    it('unwraps when the selection includes the markers themselves', () => {
      const fixture = host('**hello** world');
      expect(useTool(fixture, 'Bold', 0, 9)).toBe('hello world');
    });

    it('does not strip bold when italic is applied to an already-bold selection', () => {
      const fixture = host('**hello** world');
      expect(useTool(fixture, 'Italic', 2, 7)).toBe('***hello*** world');
      expect(preview(fixture).querySelector('em strong')).not.toBeNull();
    });

    it('inserts an empty marker pair and parks the caret inside on a collapsed selection', () => {
      const fixture = host('ab');
      expect(useTool(fixture, 'Code', 1)).toBe('a``b');
      expect(textareaOf(fixture).selectionStart).toBe(2);
      expect(textareaOf(fixture).selectionEnd).toBe(2);
    });

    it('applies strikethrough and code markers', () => {
      expect(useTool(host('gone'), 'Strikethrough', 0, 4)).toBe('~~gone~~');
      expect(useTool(host('x()'), 'Code', 0, 3)).toBe('`x()`');
    });

    it('prefixes every selected line, and strips them on a second press', () => {
      const fixture = host('one\ntwo');
      expect(useTool(fixture, 'Numbered list', 0, 7)).toBe('1. one\n2. two');
      expect(useTool(fixture, 'Numbered list', 0, 13)).toBe('one\ntwo');
    });

    it('converts between list kinds instead of clearing', () => {
      const fixture = host('- one\n- two');
      expect(useTool(fixture, 'Numbered list', 0, 11)).toBe('1. one\n2. two');
      expect(useTool(fixture, 'Bullet list', 0, 13)).toBe('- one\n- two');
    });

    it('expands a partial selection to whole lines', () => {
      // Selection starts mid-word on line 1 and ends mid-word on line 2.
      expect(useTool(host('alpha\nbeta'), 'Bullet list', 2, 8)).toBe('- alpha\n- beta');
    });

    it('leaves blank lines unmarked but still numbers the content sequentially', () => {
      expect(useTool(host('one\n\ntwo'), 'Numbered list', 0, 8)).toBe('1. one\n\n2. two');
    });

    it('starts a list in an empty document', () => {
      expect(useTool(host(''), 'Bullet list', 0)).toBe('- ');
    });

    it('marks only the line holding a collapsed caret', () => {
      expect(useTool(host('one\ntwo\nthree'), 'Bullet list', 5)).toBe('one\n- two\nthree');
    });

    it('round-trips a toolbar-built list through the preview', () => {
      const fixture = host('milk\neggs');
      expect(useTool(fixture, 'Bullet list', 0, 9)).toBe('- milk\n- eggs');
      expect(preview(fixture).querySelectorAll('ul li')).toHaveLength(2);
    });
  });

  describe('inputs', () => {
    it('forwards rows, placeholder and name to the textarea', () => {
      const fixture = host('x');
      fixture.componentInstance.rows.set(3);
      fixture.componentInstance.name.set('body');
      fixture.componentInstance.placeholder.set('Notes…');
      fixture.detectChanges();
      const textarea = textareaOf(fixture);
      expect(textarea.rows).toBe(3);
      expect(textarea.name).toBe('body');
      expect(textarea.placeholder).toBe('Notes…');
    });

    it('omits the name attribute when none is given', () => {
      expect(textareaOf(host()).hasAttribute('name')).toBe(false);
    });

    it('writes typed text back through the two-way binding', () => {
      const fixture = host();
      const textarea = textareaOf(fixture);
      textarea.value = 'typed';
      textarea.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(fixture.componentInstance.md()).toBe('typed');
    });
  });

  describe('i18n', () => {
    it('falls back to the built-in English labels', () => {
      const fixture = host();
      expect(root(fixture).textContent).toContain('Write');
      expect(root(fixture).textContent).toContain('Preview');
      expect(root(fixture).querySelector('[role="toolbar"]')!.getAttribute('aria-label')).toBe(
        'Formatting',
      );
    });

    it('translates the tabs and the toolbar via provideBuiLabels', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideBuiLabels({
            markdownEditorWrite: 'Écrire',
            markdownEditorPreview: 'Aperçu',
            markdownEditorFormatting: 'Mise en forme',
          }),
        ],
      });
      const fixture = host();
      const text = root(fixture).textContent;
      expect(text).toContain('Écrire');
      expect(text).toContain('Aperçu');
      expect(text).not.toContain('Write');
      expect(root(fixture).querySelector('[role="toolbar"]')!.getAttribute('aria-label')).toBe(
        'Mise en forme',
      );
    });
  });
});

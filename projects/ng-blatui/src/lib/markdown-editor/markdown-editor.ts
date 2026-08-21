import {
  Component,
  computed,
  type ElementRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/** A toolbar button: either wraps the selection in markers or prefixes whole lines. */
type Tool = { label: string; text: string; cls: string } & (
  | { kind: 'wrap'; marker: string }
  | { kind: 'list'; tag: 'ul' | 'ol' }
);

// Mirrors the rich-text-editor toolbar. Underline is omitted: markdown has no
// syntax for it, and the preview escapes raw HTML so `<u>` could not render.
const TOOLS: Tool[] = [
  { kind: 'wrap', marker: '**', label: 'Bold', text: 'B', cls: 'font-bold' },
  { kind: 'wrap', marker: '*', label: 'Italic', text: 'I', cls: 'italic' },
  { kind: 'wrap', marker: '~~', label: 'Strikethrough', text: 'S', cls: 'line-through' },
  { kind: 'wrap', marker: '`', label: 'Code', text: '<>', cls: 'font-mono text-xs' },
  { kind: 'list', tag: 'ul', label: 'Bullet list', text: '•', cls: '' },
  { kind: 'list', tag: 'ol', label: 'Numbered list', text: '1.', cls: '' },
];

function renderInline(text: string): string {
  return text
    .replaceAll(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replaceAll(/\*([^*]+)\*/g, '<em>$1</em>')
    .replaceAll(/~~([^~]+)~~/g, '<del>$1</del>')
    .replaceAll(/`([^`]+)`/g, '<code>$1</code>');
}

// HTML is escaped first, then a safe subset of markdown is applied, so user input can't inject markup.
function renderMarkdown(markdown: string): string {
  const escaped = markdown.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const html: string[] = [];
  let lines: string[] = [];
  let items: string[] = [];
  let listTag: 'ul' | 'ol' | null = null;

  const flushLines = (): void => {
    if (lines.length === 0) {
      return;
    }
    html.push(lines.join('<br>'));
    lines = [];
  };
  const flushList = (): void => {
    if (!listTag) {
      return;
    }
    const body = items.map((item) => `<li>${item}</li>`).join('');
    html.push(`<${listTag}>${body}</${listTag}>`);
    listTag = null;
    items = [];
  };

  for (const line of escaped.split('\n')) {
    const bullet = /^[*-] (.*)$/.exec(line)?.[1];
    const ordered = /^\d+\. (.*)$/.exec(line)?.[1];
    const item = bullet ?? ordered;
    if (item !== undefined) {
      const tag = bullet === undefined ? 'ol' : 'ul';
      flushLines();
      if (listTag !== tag) {
        flushList();
      }
      listTag = tag;
      items.push(renderInline(item));
      continue;
    }
    flushList();
    const heading = /^(#{1,3}) (.*)$/.exec(line);
    if (heading) {
      flushLines();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }
    lines.push(renderInline(line));
  }
  flushList();
  flushLines();
  return html.join('');
}

/** A markdown textarea with a formatting toolbar and a live, sanitized HTML preview. */
@Component({
  selector: 'bui-markdown-editor',
  host: { 'data-slot': 'markdown-editor', '[class]': 'computedClass()' },
  template: `
    <div class="flex border-b bg-muted/40">
      <button type="button" [class]="tabClass('write')" (click)="tab.set('write')">
        {{ writeText() }}
      </button>
      <button type="button" [class]="tabClass('preview')" (click)="tab.set('preview')">
        {{ previewText() }}
      </button>
    </div>
    @if (tab() === 'write') {
      <div
        role="toolbar"
        [attr.aria-label]="formattingText()"
        class="flex flex-wrap gap-0.5 border-b bg-muted/40 p-1"
      >
        @for (tool of tools; track tool.label) {
          <button
            type="button"
            class="size-8 rounded text-sm hover:bg-accent"
            [class]="tool.cls"
            [attr.aria-label]="tool.label"
            [title]="tool.label"
            (click)="apply(tool)"
          >
            {{ tool.text }}
          </button>
        }
      </div>
      <textarea
        #textarea
        [value]="value()"
        [placeholder]="placeholder()"
        [rows]="rows()"
        [attr.name]="name() || null"
        class="w-full resize-y bg-transparent p-3 font-mono text-sm outline-none"
        (input)="onInput($event)"
      ></textarea>
    } @else {
      <div
        data-slot="markdown-preview"
        class="min-h-32 p-3 text-sm leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-medium [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:ps-6 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:ps-6"
        [innerHTML]="rendered()"
      ></div>
    }
  `,
})
export class BuiMarkdownEditor {
  /** Markdown source text. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Name attribute applied to the textarea for form submission. */
  readonly name = input('');
  /** Placeholder text shown while the textarea is empty. */
  readonly placeholder = input('Write markdown…');
  /** Number of visible rows in the write textarea. */
  readonly rows = input(8);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Text of the write tab. Falls back to `provideBuiLabels`. */
  readonly writeLabel = input<string>();
  /** Text of the preview tab. Falls back to `provideBuiLabels`. */
  readonly previewLabel = input<string>();
  /** Accessible label override for the formatting toolbar. */
  readonly formattingLabel = input<string>();

  protected readonly writeText = buiLabel('markdownEditorWrite', this.writeLabel);
  protected readonly previewText = buiLabel('markdownEditorPreview', this.previewLabel);
  protected readonly formattingText = buiLabel('markdownEditorFormatting', this.formattingLabel);
  protected readonly tools = TOOLS;
  protected readonly tab = signal<'write' | 'preview'>('write');
  protected readonly rendered = computed(() => renderMarkdown(this.value()));
  protected readonly computedClass = computed(() =>
    cn('block overflow-hidden rounded-lg border', this.userClass()),
  );

  private readonly textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  protected tabClass(name: 'write' | 'preview'): string {
    return cn(
      'px-4 py-2 text-sm font-medium',
      this.tab() === name ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground',
    );
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
  }

  /**
   * Applies a tool to the current selection. Bound to `click` rather than `mousedown` so
   * keyboard users reach it too: a blurred textarea still reports its selection range,
   * so the pointer path loses nothing by waiting for the click.
   */
  protected apply(tool: Tool): void {
    const element = this.textarea()?.nativeElement;
    if (!element) {
      return;
    }
    const edit =
      tool.kind === 'wrap'
        ? wrapSelection(element.value, element.selectionStart, element.selectionEnd, tool.marker)
        : toggleList(element.value, element.selectionStart, element.selectionEnd, tool.tag);

    // Write through to the DOM as well: the `[value]` binding only lands on the
    // next change detection, and the caret has to be restored on today's text.
    element.value = edit.value;
    element.setSelectionRange(edit.start, edit.end);
    element.focus();
    this.value.set(edit.value);
  }
}

interface Edit {
  value: string;
  start: number;
  end: number;
}

/**
 * True when `marker` sits immediately outside the selection *and* is not part of a longer
 * run of the same character — otherwise italic on `**bold**` would strip one star from each
 * side and silently demote the bold.
 */
function isWrappedBy(value: string, start: number, end: number, marker: string): boolean {
  const width = marker.length;
  if (start < width || value.slice(start - width, start) !== marker) {
    return false;
  }
  if (value.slice(end, end + width) !== marker) {
    return false;
  }
  const char = marker.charAt(0);
  return value.charAt(start - width - 1) !== char && value.charAt(end + width) !== char;
}

/** Wraps (or, when already wrapped, unwraps) the selection in a markdown marker. */
function wrapSelection(value: string, start: number, end: number, marker: string): Edit {
  const width = marker.length;
  const selected = value.slice(start, end);
  const char = marker.charAt(0);
  const isEnclosed =
    selected.length >= width * 2 &&
    selected.startsWith(marker) &&
    selected.endsWith(marker) &&
    value.charAt(start - 1) !== char &&
    value.charAt(end) !== char;
  if (isEnclosed) {
    const inner = selected.slice(width, -width);
    return {
      value: value.slice(0, start) + inner + value.slice(end),
      start,
      end: start + inner.length,
    };
  }
  if (isWrappedBy(value, start, end, marker)) {
    return {
      value: value.slice(0, start - width) + selected + value.slice(end + width),
      start: start - width,
      end: end - width,
    };
  }
  return {
    value: value.slice(0, start) + marker + selected + marker + value.slice(end),
    start: start + width,
    end: end + width,
  };
}

const BULLET_MARKER = /^[*-] /;
const ORDERED_MARKER = /^\d+\. /;
const ANY_MARKER = /^(?:[*-] |\d+\. )/;

/**
 * Prefixes the selected lines with list markers. Pressing the tool a second time on a list
 * of the same kind strips it; pressing the *other* list tool converts between the two rather
 * than clearing. Blank lines are left alone whenever the selection has any content.
 */
function toggleList(value: string, start: number, end: number, tag: 'ul' | 'ol'): Edit {
  const from = start === 0 ? 0 : value.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = value.indexOf('\n', end);
  const to = lineEnd === -1 ? value.length : lineEnd;
  const lines = value.slice(from, to).split('\n');

  const wanted = tag === 'ol' ? ORDERED_MARKER : BULLET_MARKER;
  const content = lines.filter((line) => line.trim() !== '');
  const shouldSkipBlank = content.length > 0;
  const considered = shouldSkipBlank ? content : lines;
  const isSameKind = considered.every((line) => wanted.test(line));

  let index = 0;
  const next = lines
    .map((line) => {
      if (shouldSkipBlank && line.trim() === '') {
        return line;
      }
      const bare = line.replace(ANY_MARKER, '');
      if (isSameKind) {
        return bare;
      }
      index += 1;
      return (tag === 'ol' ? `${index}. ` : '- ') + bare;
    })
    .join('\n');

  return {
    value: value.slice(0, from) + next + value.slice(to),
    start: from,
    end: from + next.length,
  };
}

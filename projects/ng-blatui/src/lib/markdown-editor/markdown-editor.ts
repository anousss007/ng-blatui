import { Component, computed, input, model, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

// HTML is escaped first, then a safe subset of markdown is applied, so user input can't inject markup.
function renderMarkdown(markdown: string): string {
  const escaped = markdown.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return escaped
    .replaceAll(/^### (.+)$/gm, '<h3>$1</h3>')
    .replaceAll(/^## (.+)$/gm, '<h2>$1</h2>')
    .replaceAll(/^# (.+)$/gm, '<h1>$1</h1>')
    .replaceAll(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replaceAll(/\*([^*]+)\*/g, '<em>$1</em>')
    .replaceAll(/`([^`]+)`/g, '<code>$1</code>')
    .replaceAll('\n', '<br>');
}

/** A markdown textarea with a live, sanitized HTML preview. */
@Component({
  selector: 'bui-markdown-editor',
  host: { 'data-slot': 'markdown-editor', '[class]': 'computedClass()' },
  template: `
    <div class="flex border-b bg-muted/40">
      <button type="button" [class]="tabClass('write')" (click)="tab.set('write')">Write</button>
      <button type="button" [class]="tabClass('preview')" (click)="tab.set('preview')">
        Preview
      </button>
    </div>
    @if (tab() === 'write') {
      <textarea
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
        class="min-h-32 p-3 text-sm leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-medium"
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

  protected readonly tab = signal<'write' | 'preview'>('write');
  protected readonly rendered = computed(() => renderMarkdown(this.value()));
  protected readonly computedClass = computed(() =>
    cn('block overflow-hidden rounded-lg border', this.userClass()),
  );

  protected tabClass(name: 'write' | 'preview'): string {
    return cn(
      'px-4 py-2 text-sm font-medium',
      this.tab() === name ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground',
    );
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
  }
}

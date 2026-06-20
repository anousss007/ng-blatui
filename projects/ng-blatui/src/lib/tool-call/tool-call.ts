import { Component, computed, input, model } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const STATUS: Record<string, string> = {
  pending: 'bg-gray-400',
  running: 'bg-amber-500 animate-pulse',
  success: 'bg-emerald-500',
  error: 'bg-red-500',
};

/** An AI tool-call card with a status indicator and collapsible arguments / result. */
@Component({
  selector: 'bui-tool-call',
  host: { 'data-slot': 'tool-call', '[class]': 'computedClass()' },
  template: `
    <button
      type="button"
      class="flex w-full items-center gap-2 px-3 py-2 text-left"
      [attr.aria-expanded]="open()"
      (click)="open.set(!open())"
    >
      <span class="size-2 shrink-0 rounded-full" [class]="statusClass()"></span>
      <code class="text-sm font-medium">{{ name() }}</code>
      <span class="ml-auto text-xs text-muted-foreground capitalize">{{ status() }}</span>
      <svg
        class="size-4 text-muted-foreground transition-transform"
        [class.rotate-90]="open()"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
    @if (open()) {
      <div class="space-y-2 border-t border-border px-3 py-2">
        @if (args()) {
          <div>
            <p class="text-xs font-medium text-muted-foreground">Arguments</p>
            <pre class="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs">{{ args() }}</pre>
          </div>
        }
        @if (result()) {
          <div>
            <p class="text-xs font-medium text-muted-foreground">Result</p>
            <pre class="mt-1 overflow-x-auto rounded bg-muted p-2 text-xs">{{ result() }}</pre>
          </div>
        }
      </div>
    }
  `,
})
export class BuiToolCall {
  readonly name = input('tool');
  readonly status = input<'pending' | 'running' | 'success' | 'error'>('success');
  readonly args = input('');
  readonly result = input('');
  readonly open = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly statusClass = computed(() => STATUS[this.status()]);
  protected readonly computedClass = computed(() =>
    cn('block overflow-hidden rounded-lg border bg-card', this.userClass()),
  );
}

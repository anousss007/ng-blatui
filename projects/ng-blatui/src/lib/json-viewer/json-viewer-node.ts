import { Component, computed, input, linkedSignal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

interface Entry {
  key: string | number;
  value: unknown;
}

/** A single JSON node; renders nested objects/arrays recursively. */
@Component({
  selector: 'bui-json-viewer-node',

  imports: [BuiJsonViewerNode],
  host: { 'data-slot': 'json-viewer-node', '[class]': 'computedClass()' },
  template: `
    @if (isContainer()) {
      <div>
        <button
          type="button"
          class="-mx-1 inline-flex items-baseline gap-1 rounded px-1 text-start outline-none hover:bg-accent/60"
          [attr.aria-expanded]="open()"
          (click)="open.set(!open())"
        >
          <svg
            class="size-3 shrink-0 self-center transition-transform"
            [class.rotate-90]="open()"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          @if (hasKey()) {
            <span [class]="keyClass()">{{ keyLabel() }}</span
            ><span class="text-muted-foreground">:</span>
          }
          <span class="text-muted-foreground">{{ brace() }}</span>
          @if (!open()) {
            <span class="text-muted-foreground"
              >…{{ closeBrace() }} <span class="italic">{{ count() }}</span></span
            >
          }
        </button>
        @if (open()) {
          <div class="ps-4">
            @for (entry of entries(); track entry.key) {
              <bui-json-viewer-node [value]="entry.value" [keyName]="entry.key" />
            }
          </div>
          <span class="ps-1 text-muted-foreground">{{ closeBrace() }}</span>
        }
      </div>
    } @else {
      <div>
        @if (hasKey()) {
          <span [class]="keyClass()">{{ keyLabel() }}</span
          ><span class="text-muted-foreground">: </span>
        }
        <span [class]="valueClass()">{{ valueLabel() }}</span>
      </div>
    }
  `,
})
export class BuiJsonViewerNode {
  /** Arbitrary JSON value rendered by this node. */
  readonly value = input<unknown>(null);
  /** Object key or array index labeling this node, or null at the root. */
  readonly keyName = input<string | number | null>(null);
  /** Whether this node starts expanded. */
  readonly expanded = input(true);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly open = linkedSignal(() => this.expanded());
  protected readonly isArr = computed(() => Array.isArray(this.value()));
  protected readonly isContainer = computed(() => {
    const value = this.value();
    return typeof value === 'object' && value !== null;
  });
  protected readonly entries = computed<Entry[]>(() => {
    const value = this.value();
    if (Array.isArray(value)) {
      return (value as unknown[]).map((item, index) => ({ key: index, value: item }));
    }
    if (value && typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>).map(([key, item]) => ({
        key,
        value: item,
      }));
    }
    return [];
  });
  protected readonly count = computed(() => this.entries().length);
  protected readonly hasKey = computed(() => this.keyName() !== null);
  protected readonly keyLabel = computed(() =>
    typeof this.keyName() === 'number' ? String(this.keyName()) : `"${this.keyName()}"`,
  );
  protected readonly keyClass = computed(() =>
    typeof this.keyName() === 'number' ? 'text-muted-foreground' : 'text-sky-600 dark:text-sky-400',
  );
  protected readonly brace = computed(() => (this.isArr() ? '[' : '{'));
  protected readonly closeBrace = computed(() => (this.isArr() ? ']' : '}'));
  protected readonly valueLabel = computed(() => {
    const value = this.value();
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    if (value === null) {
      return 'null';
    }
    return JSON.stringify(value);
  });
  protected readonly valueClass = computed(() => {
    const value = this.value();
    if (typeof value === 'string') {
      return 'text-emerald-600 dark:text-emerald-400';
    }
    if (typeof value === 'number') {
      return 'text-amber-600 dark:text-amber-400';
    }
    if (typeof value === 'boolean' || value === null) {
      return 'text-purple-600 dark:text-purple-400';
    }
    return 'text-foreground';
  });
  protected readonly computedClass = computed(() => cn('block', this.userClass()));
}

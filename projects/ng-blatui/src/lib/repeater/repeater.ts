import { Component, computed, input, model } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

export interface RepeaterField {
  key: string;
  label: string;
  placeholder?: string;
  type?: string;
}

/** A dynamic list of repeatable form rows with add/remove and min/max bounds. */
@Component({
  selector: 'bui-repeater',
  host: { 'data-slot': 'repeater', '[class]': 'computedClass()' },
  template: `
    @for (row of rows(); track $index; let i = $index) {
      <div class="flex items-end gap-2">
        @for (field of fields(); track field.key) {
          <div class="flex-1">
            @if (i === 0) {
              <span class="mb-1 block text-xs text-muted-foreground">{{ field.label }}</span>
            }
            <input
              [type]="field.type || 'text'"
              [value]="row[field.key] || ''"
              [placeholder]="field.placeholder || ''"
              class="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              (input)="update(i, field.key, $event)"
            />
          </div>
        }
        <button
          type="button"
          class="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-input text-muted-foreground hover:bg-accent disabled:opacity-50"
          [disabled]="rows().length <= min()"
          [attr.aria-label]="removeText()"
          (click)="removeRow(i)"
        >
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            />
          </svg>
        </button>
      </div>
    }
    <button
      type="button"
      class="inline-flex h-9 items-center gap-1.5 self-start rounded-md border border-dashed border-input px-3 text-sm font-medium hover:bg-accent disabled:opacity-50"
      [disabled]="atMax()"
      (click)="addRow()"
    >
      <svg
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
      {{ addLabel() }}
    </button>
  `,
})
export class BuiRepeater {
  readonly fields = input<readonly RepeaterField[]>([]);
  readonly rows = model<Record<string, string>[]>([]);
  readonly min = input(1);
  readonly max = input<number | null>(null);
  readonly addLabel = input('Add row');
  readonly removeLabel = input<string>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly removeText = buiLabel('repeaterRemove', this.removeLabel);

  protected readonly atMax = computed(() => {
    const max = this.max();
    return max !== null && this.rows().length >= max;
  });
  protected readonly computedClass = computed(() => cn('flex flex-col gap-2', this.userClass()));

  protected addRow(): void {
    if (this.atMax()) {
      return;
    }
    const blank: Record<string, string> = {};
    for (const field of this.fields()) {
      blank[field.key] = '';
    }
    this.rows.set([...this.rows(), blank]);
  }

  protected removeRow(index: number): void {
    if (this.rows().length <= this.min()) {
      return;
    }
    const next = [...this.rows()];
    next.splice(index, 1);
    this.rows.set(next);
  }

  protected update(index: number, key: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.rows.set(
      this.rows().map((row, index_) => (index_ === index ? { ...row, [key]: value } : row)),
    );
  }
}

import {
  Component,
  computed,
  effect,
  type ElementRef,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** Click-to-edit inline text: shows a value, swaps to an input on click. Enter commits, Escape cancels. */
@Component({
  selector: 'bui-editable',
  host: { 'data-slot': 'editable', '[class]': 'computedClass()' },
  template: `
    @if (editing()) {
      @if (multiline()) {
        <textarea
          #field
          [value]="draft()"
          [placeholder]="placeholder()"
          [attr.aria-label]="'Edit ' + label()"
          rows="3"
          class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          (input)="onInput($event)"
          (blur)="commit()"
          (keydown.escape)="cancel()"
        ></textarea>
      } @else {
        <input
          #field
          [value]="draft()"
          [placeholder]="placeholder()"
          [attr.aria-label]="'Edit ' + label()"
          class="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          (input)="onInput($event)"
          (blur)="commit()"
          (keydown.enter)="commit()"
          (keydown.escape)="cancel()"
        />
      }
    } @else {
      <button
        type="button"
        class="w-full rounded-md px-3 py-1 text-start text-sm hover:bg-muted/60"
        [class.text-muted-foreground]="!value()"
        (click)="start()"
      >
        {{ value() || placeholder() }}
      </button>
    }
  `,
})
export class BuiEditable {
  /** Current text. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Text shown when the value is empty. */
  readonly placeholder = input('Empty');
  /** Noun used in the field's accessible label. */
  readonly label = input('value');
  /** Edit in a multi-line textarea instead of a single-line input. */
  readonly multiline = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly editing = signal(false);
  protected readonly draft = signal('');
  private readonly field = viewChild<ElementRef<HTMLInputElement | HTMLTextAreaElement>>('field');
  protected readonly computedClass = computed(() => cn('inline-block', this.userClass()));

  constructor() {
    effect(() => {
      if (this.editing()) {
        this.field()?.nativeElement.focus();
      }
    });
  }

  protected start(): void {
    this.draft.set(this.value());
    this.editing.set(true);
  }

  protected commit(): void {
    if (!this.editing()) {
      return;
    }
    this.value.set(this.draft());
    this.editing.set(false);
  }

  protected cancel(): void {
    this.editing.set(false);
  }

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }
}

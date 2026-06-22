import { Component, computed, input, model, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface Mention {
  /** Identifier for the mention. */
  value: string;
  /** Text shown in the suggestion list and inserted into the textarea. */
  label: string;
}

/** A textarea that suggests mentions when you type the trigger character. */
@Component({
  selector: 'bui-mention-input',
  host: { 'data-slot': 'mention-input', '[class]': 'computedClass()' },
  template: `
    <textarea
      [value]="value()"
      [placeholder]="placeholder()"
      [rows]="rows()"
      [attr.name]="name() || null"
      class="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      (input)="onInput($event)"
      (keydown)="onKeydown($event)"
    ></textarea>
    @if (open() && filtered().length > 0) {
      <ul
        role="listbox"
        class="absolute z-50 mt-1 max-h-48 w-56 overflow-auto rounded-md border bg-popover p-1 shadow-md"
      >
        @for (mention of filtered(); track mention.value; let i = $index) {
          <li
            role="option"
            [attr.aria-selected]="i === active()"
            class="cursor-default rounded-sm px-2 py-1.5 text-sm"
            [class]="i === active() ? 'bg-accent text-accent-foreground' : ''"
            (click)="insert(mention)"
            (mouseenter)="active.set(i)"
          >
            {{ mention.label }}
          </li>
        }
      </ul>
    }
  `,
})
export class BuiMentionInput {
  /** Textarea contents. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Mentions offered when the trigger character is typed. */
  readonly mentions = input<readonly Mention[]>([]);
  /** Character that opens the mention suggestion list. */
  readonly trigger = input('@');
  /** Placeholder text for the textarea. */
  readonly placeholder = input('Type @ to mention…');
  /** Number of visible textarea rows. */
  readonly rows = input(3);
  /** Native `name` attribute for the textarea. */
  readonly name = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly open = signal(false);
  protected readonly active = signal(0);
  protected readonly query = signal('');
  protected readonly filtered = computed(() => {
    const query = this.query().toLowerCase();
    return this.mentions().filter((mention) => mention.label.toLowerCase().includes(query));
  });
  protected readonly computedClass = computed(() => cn('relative block', this.userClass()));

  protected onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value.set(value);
    this.detect(value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }
    const options = this.filtered();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.active.set(Math.min(options.length - 1, this.active() + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.active.set(Math.max(0, this.active() - 1));
    } else if (event.key === 'Enter' && options.length > 0) {
      event.preventDefault();
      this.insert(options[this.active()]);
    } else if (event.key === 'Escape') {
      this.open.set(false);
    }
  }

  protected insert(mention: Mention): void {
    const value = this.value();
    const index = value.lastIndexOf(this.trigger());
    const head = index === -1 ? value : value.slice(0, index);
    this.value.set(`${head}${this.trigger()}${mention.label} `);
    this.open.set(false);
  }

  private detect(value: string): void {
    const index = value.lastIndexOf(this.trigger());
    if (index === -1) {
      this.open.set(false);
      return;
    }
    const after = value.slice(index + this.trigger().length);
    if (/\s/.test(after)) {
      this.open.set(false);
      return;
    }
    this.query.set(after);
    this.active.set(0);
    this.open.set(true);
  }
}

import {
  afterNextRender,
  Component,
  computed,
  type ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A chat composer: an autosizing textarea with a send button. Emits `submitted` on send. */
@Component({
  selector: 'bui-prompt-input',
  host: { 'data-slot': 'prompt-input', '[class]': 'computedClass()' },
  template: `
    <textarea
      #ta
      rows="1"
      [value]="value()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      class="max-h-40 w-full resize-none bg-transparent px-3 py-2 text-sm outline-none"
      (input)="onInput($event)"
      (keydown.enter)="onEnter($event)"
    ></textarea>
    <div class="flex items-center gap-2 px-2 pb-2">
      @if (attachable()) {
        <button
          type="button"
          aria-label="Attach file"
          class="inline-flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
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
              d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
            />
          </svg>
        </button>
      }
      <button
        type="button"
        class="ml-auto inline-flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
        [disabled]="disabled() || value().trim() === ''"
        aria-label="Send"
        (click)="send()"
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
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </svg>
      </button>
    </div>
  `,
})
export class BuiPromptInput {
  readonly value = model('');
  readonly placeholder = input('Send a message…');
  readonly attachable = input(false);
  readonly disabled = input(false);
  readonly ariaLabel = input('Message');
  readonly submitted = output<string>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly ta = viewChild<ElementRef<HTMLTextAreaElement>>('ta');
  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col rounded-xl border border-input bg-transparent focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
      this.userClass(),
    ),
  );

  constructor() {
    afterNextRender(() => {
      this.resize();
    });
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
    this.resize();
  }

  protected onEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.send();
    }
  }

  protected send(): void {
    const text = this.value().trim();
    if (text === '' || this.disabled()) {
      return;
    }
    this.submitted.emit(text);
    this.value.set('');
    this.resize();
  }

  private resize(): void {
    const element = this.ta()?.nativeElement;
    if (!element) {
      return;
    }
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }
}

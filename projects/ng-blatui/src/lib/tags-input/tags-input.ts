import { _IdGenerator } from '@angular/cdk/a11y';
import { type ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/** Suggestion panel placement relative to the field, in CDK preference order. */
const PANEL_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
];

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

/**
 * A free-text tags input: type and press Enter (or comma) to add chips; Backspace removes.
 *
 * Pass `suggestions` and the field becomes a combobox over the tags that already exist, while
 * still accepting anything typed: whatever is committed that no suggestion matches is emitted on
 * `created`, which is where a backend creates the tag on the fly. Set `allowCreate` to false to
 * restrict entry to the suggestions.
 */
@Component({
  selector: 'bui-tags-input',
  host: { 'data-slot': 'tags-input', '[class]': 'computedClass()', '(focusout)': 'onTouched()' },
  imports: [OverlayModule],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BuiTagsInput), multi: true },
  ],
  template: `
    @for (tag of tags(); track tag; let i = $index) {
      <span
        class="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-sm text-secondary-foreground"
      >
        {{ tag }}
        <button
          type="button"
          class="leading-none opacity-70 hover:text-foreground"
          [attr.aria-label]="removeText() + ' ' + tag"
          [disabled]="disabled()"
          (click)="removeAt(i)"
        >
          ×
        </button>
      </span>
    }
    <input
      [value]="draft()"
      [placeholder]="placeholder()"
      [disabled]="disabled() || atMax()"
      [attr.role]="hasSuggestions() ? 'combobox' : null"
      [attr.aria-autocomplete]="hasSuggestions() ? 'list' : null"
      [attr.aria-expanded]="hasSuggestions() ? panelOpen() : null"
      [attr.aria-controls]="hasSuggestions() ? listId : null"
      [attr.aria-activedescendant]="panelOpen() ? listId + '-' + active() : null"
      class="min-w-24 flex-1 bg-transparent text-sm outline-none"
      (input)="onInput($event)"
      (focus)="open.set(true)"
      (keydown)="onKeydown($event)"
    />
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="host"
      [cdkConnectedOverlayOpen]="panelOpen()"
      [cdkConnectedOverlayPositions]="panelPositions"
      [cdkConnectedOverlayWidth]="host.nativeElement.offsetWidth"
      [cdkConnectedOverlayViewportMargin]="8"
      (overlayOutsideClick)="onOutsideClick($event)"
    >
      <!-- Keeping the default on mousedown stops the field losing focus, so several tags can be
           picked in a row without the panel closing between them. -->
      <ul
        [id]="listId"
        role="listbox"
        class="z-50 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        (mousedown)="$event.preventDefault()"
      >
        @for (option of filtered(); track option; let i = $index) {
          <li
            [id]="listId + '-' + i"
            role="option"
            [attr.aria-selected]="i === active()"
            class="cursor-default rounded-sm px-2 py-1.5 text-sm outline-none select-none"
            [class]="i === active() ? 'bg-accent text-accent-foreground' : ''"
            (click)="add(option)"
            (mouseenter)="active.set(i)"
          >
            {{ option }}
          </li>
        }
        @if (canCreate()) {
          <li
            [id]="listId + '-' + filtered().length"
            role="option"
            [attr.aria-selected]="active() === filtered().length"
            class="mt-1 flex cursor-default items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm outline-none select-none"
            [class]="
              (active() === filtered().length ? 'bg-accent text-accent-foreground ' : '') +
              (filtered().length > 0 ? 'border-t border-border pt-2' : '')
            "
            (click)="add(draft())"
            (mouseenter)="active.set(filtered().length)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="size-4 shrink-0"
            >
              <path d="M5 12h14M12 5v14" />
            </svg>
            {{ createText() }} “{{ draft().trim() }}”
          </li>
        }
      </ul>
    </ng-template>
  `,
})
export class BuiTagsInput implements ControlValueAccessor {
  /** Current tags. Two-way bindable with `[(tags)]`. */
  readonly tags = model<string[]>([]);
  /** Existing tags offered as a filtered suggestion list; leave empty for a plain free-text field. */
  readonly suggestions = input<readonly string[]>([]);
  /** Whether a tag no suggestion matches can be added — the entry that `created` reports. */
  readonly allowCreate = input(true);
  /** Placeholder text shown in the entry field. */
  readonly placeholder = input('Add tag…');
  /** Maximum number of tags allowed, or `null` for no limit. */
  readonly max = input<number | null>(null);
  /** Whether the input is disabled. Two-way bindable with `[(disabled)]`. */
  readonly disabled = model(false);
  /** Prefix of the create row, before the typed text. Defaults to the `tagsInputCreate` label. */
  readonly createLabel = input<string>();
  /** Prefix of a chip's remove `aria-label`. Defaults to the `tagsInputRemove` label. */
  readonly removeLabel = input<string>();
  /** Emits a tag that was added without matching a suggestion — create it on the backend here. */
  readonly created = output<string>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private onChange: (value: readonly string[]) => void = noop;
  protected onTouched: () => void = noop;
  // Protected (not private) so the template can anchor the suggestion overlay to the host element.
  protected readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly listId = inject(_IdGenerator).getId('bui-tags-input-');
  protected readonly panelPositions = PANEL_POSITIONS;
  protected readonly createText = buiLabel('tagsInputCreate', this.createLabel);
  protected readonly removeText = buiLabel('tagsInputRemove', this.removeLabel);
  protected readonly draft = signal('');
  protected readonly open = signal(false);
  protected readonly active = signal(0);
  protected readonly atMax = computed(() => {
    const max = this.max();
    return max !== null && this.tags().length >= max;
  });
  protected readonly hasSuggestions = computed(() => this.suggestions().length > 0);
  protected readonly filtered = computed(() => {
    const query = this.draft().trim().toLowerCase();
    const picked = new Set(this.tags().map((tag) => tag.toLowerCase()));
    const pool = this.suggestions().filter((option) => !picked.has(option.toLowerCase()));
    return query === '' ? pool : pool.filter((option) => option.toLowerCase().includes(query));
  });
  protected readonly canCreate = computed(() => {
    const value = this.draft().trim().toLowerCase();
    if (value === '' || !this.allowCreate()) {
      return false;
    }
    return !(
      this.suggestions().some((option) => option.toLowerCase() === value) ||
      this.tags().some((tag) => tag.toLowerCase() === value)
    );
  });
  // The panel is a suggestions feature: without any, the field stays the plain free-text input.
  protected readonly panelOpen = computed(
    () =>
      this.open() &&
      this.hasSuggestions() &&
      !this.disabled() &&
      !this.atMax() &&
      this.rowCount() > 0,
  );
  private readonly rowCount = computed(() => this.filtered().length + (this.canCreate() ? 1 : 0));
  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
      this.userClass(),
    ),
  );

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
    this.open.set(true);
    this.active.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape': {
        this.open.set(false);
        return;
      }
      case 'ArrowDown': {
        if (!this.hasSuggestions()) {
          return;
        }
        event.preventDefault();
        this.open.set(true);
        this.active.set(Math.min(this.rowCount() - 1, this.active() + 1));
        return;
      }
      case 'ArrowUp': {
        if (!this.hasSuggestions()) {
          return;
        }
        event.preventDefault();
        this.active.set(Math.max(0, this.active() - 1));
        return;
      }
      case 'Enter': {
        event.preventDefault();
        this.commitActive();
        return;
      }
      case ',': {
        event.preventDefault();
        if (this.allowCreate() || this.panelOpen()) {
          this.commitActive();
        }
        return;
      }
      case 'Backspace': {
        if (this.draft() === '' && this.tags().length > 0) {
          this.removeAt(this.tags().length - 1);
        }
        return;
      }
      default: {
        return;
      }
    }
  }

  protected removeAt(index: number): void {
    const next = [...this.tags()];
    next.splice(index, 1);
    this.tags.set(next);
    this.onChange(next);
  }

  /** Add the highlighted row when the panel is open, otherwise whatever has been typed. */
  private commitActive(): void {
    if (!this.panelOpen()) {
      if (this.allowCreate()) {
        this.add(this.draft());
      }
      return;
    }
    const options = this.filtered();
    const index = Math.min(this.active(), this.rowCount() - 1);
    this.add(index < options.length ? options[index] : this.draft());
  }

  protected add(raw: string): void {
    const value = raw.trim();
    this.draft.set('');
    this.active.set(0);
    if (value === '' || this.atMax()) {
      return;
    }
    // Fold onto a suggestion that differs only by case, so typing "Frontend" reuses the existing
    // "frontend" instead of asking the backend to create a near-duplicate.
    const match = this.suggestions().find((option) => option.toLowerCase() === value.toLowerCase());
    const tag = match ?? value;
    if (this.tags().includes(tag)) {
      return;
    }
    const next = [...this.tags(), tag];
    this.tags.set(next);
    this.onChange(next);
    if (match === undefined) {
      this.created.emit(tag);
    }
  }

  // The suggestions are portalled into a CDK overlay (outside the host); rely on the overlay's own
  // outside-click signal. Clicks on the field itself stay inside the host and are ignored here.
  protected onOutsideClick(event: MouseEvent): void {
    if (!(this.open() && !this.host.nativeElement.contains(event.target as Node))) {
      return;
    }

    this.open.set(false);
    this.onTouched();
  }

  writeValue(value: readonly string[] | null): void {
    this.tags.set(Array.isArray(value) ? [...(value as readonly string[])] : []);
  }

  registerOnChange(callback: (value: readonly string[]) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}

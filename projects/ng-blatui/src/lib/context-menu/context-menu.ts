import {
  afterNextRender,
  Component,
  computed,
  type ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface ContextMenuItem {
  /** Text shown for the menu entry. */
  label?: string;
  /** Identifying value emitted when the item is selected. */
  value?: string;
  /** Keyboard shortcut hint shown trailing the label. */
  shortcut?: string;
  /** Whether to render the item in the destructive (danger) style. */
  danger?: boolean;
  /** Whether this entry is a divider rather than a selectable item. */
  separator?: boolean;
  /** Optional leading icon, given as an SVG path `d` string. */
  icon?: string;
  /** Nested items — rendered as a submenu flyout on hover. */
  children?: ContextMenuItem[];
}

/** A right-click context menu. Project the target; pass menu `items`. */
@Component({
  selector: 'bui-context-menu',
  host: {
    'data-slot': 'context-menu',
    '[class]': 'computedClass()',
    '(contextmenu)': 'onContext($event)',
    '(document:click)': 'open.set(false)',
    '(document:keydown.escape)': 'open.set(false)',
    // The menu is fixed to viewport coordinates captured at open time; close it on scroll
    // instead of letting it hang at a now-wrong position.
    '(window:scroll)': 'open.set(false)',
  },
  template: `
    <ng-content />
    @if (open()) {
      <div
        #menuEl
        role="menu"
        class="fixed z-50 min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        [style.left.px]="x()"
        [style.top.px]="y()"
      >
        @for (item of items(); track $index) {
          @if (item.separator) {
            <div role="separator" class="-mx-1 my-1 h-px bg-border"></div>
          } @else if (item.children && item.children.length > 0) {
            <div class="group/sub relative">
              <button
                type="button"
                role="menuitem"
                aria-haspopup="menu"
                class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:bg-accent"
              >
                @if (item.icon) {
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
                    <path [attr.d]="item.icon" />
                  </svg>
                }
                <span>{{ item.label }}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  class="ms-auto size-4 opacity-60"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <div
                role="menu"
                class="absolute top-0 left-full z-50 ml-1 hidden min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md group-hover/sub:block"
              >
                @for (child of item.children; track $index) {
                  <button
                    type="button"
                    role="menuitem"
                    class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:bg-accent"
                    [class.text-destructive]="child.danger"
                    (click)="select(child)"
                  >
                    <span>{{ child.label }}</span>
                    @if (child.shortcut) {
                      <span class="ms-auto text-xs text-muted-foreground">{{
                        child.shortcut
                      }}</span>
                    }
                  </button>
                }
              </div>
            </div>
          } @else {
            <button
              type="button"
              role="menuitem"
              class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:bg-accent"
              [class.text-destructive]="item.danger"
              (click)="select(item)"
            >
              @if (item.icon) {
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
                  <path [attr.d]="item.icon" />
                </svg>
              }
              <span>{{ item.label }}</span>
              @if (item.shortcut) {
                <span class="ms-auto text-xs text-muted-foreground">{{ item.shortcut }}</span>
              }
            </button>
          }
        }
      </div>
    }
  `,
})
export class BuiContextMenu {
  /** Items shown in the menu, in display order. */
  readonly items = input<readonly ContextMenuItem[]>([]);
  /** Emits the chosen item when a (non-separator) entry is activated. */
  readonly selected = output<ContextMenuItem>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly open = signal(false);
  protected readonly x = signal(0);
  protected readonly y = signal(0);
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  private readonly menuEl = viewChild<ElementRef<HTMLElement>>('menuEl');
  private readonly injector = inject(Injector);

  protected onContext(event: MouseEvent): void {
    event.preventDefault();
    this.x.set(event.clientX);
    this.y.set(event.clientY);
    this.open.set(true);
    // Once the menu has rendered we know its size, so nudge it back inside the viewport when the
    // click was near a right/bottom edge — otherwise it would overflow off-screen (no flip).
    afterNextRender(
      () => {
        this.clampToViewport();
      },
      { injector: this.injector },
    );
  }

  private clampToViewport(): void {
    const element = this.menuEl()?.nativeElement;
    if (!element) {
      return;
    }
    const pad = 8;
    const { width, height } = element.getBoundingClientRect();
    if (this.x() + width > window.innerWidth - pad) {
      this.x.set(Math.max(pad, window.innerWidth - width - pad));
    }
    if (this.y() + height > window.innerHeight - pad) {
      this.y.set(Math.max(pad, window.innerHeight - height - pad));
    }
  }

  protected select(item: ContextMenuItem): void {
    this.selected.emit(item);
    this.open.set(false);
  }
}

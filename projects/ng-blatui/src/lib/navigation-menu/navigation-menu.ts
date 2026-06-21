import { Component, computed, input, signal } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface NavMenuLink {
  label: string;
  href?: string;
  description?: string;
}
export interface NavMenuItem {
  label: string;
  href?: string;
  links?: NavMenuLink[];
}

/** A horizontal navigation menu with hover/click dropdown panels. */
@Component({
  selector: 'bui-navigation-menu',
  host: {
    'data-slot': 'navigation-menu',
    '[class]': 'computedClass()',
    '(mouseleave)': 'active.set(-1)',
  },
  template: `
    <ul class="flex items-center gap-1">
      @for (item of items(); track item.label; let i = $index) {
        <li class="relative" (mouseenter)="onEnter(i, item)">
          @if (item.links && item.links.length > 0) {
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              [attr.aria-expanded]="active() === i"
              (click)="toggle(i)"
            >
              {{ item.label }}
              <svg
                class="size-3.5 transition-transform"
                [class.rotate-180]="active() === i"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            @if (active() === i) {
              <div
                class="absolute start-0 top-full z-50 mt-1.5 w-64 rounded-lg border bg-popover p-2 shadow-md"
              >
                <ul class="space-y-1">
                  @for (link of item.links; track link.label) {
                    <li>
                      <a [href]="href(link.href)" class="block rounded-md p-2 hover:bg-accent">
                        <span class="text-sm font-medium">{{ link.label }}</span>
                        @if (link.description) {
                          <span class="block text-xs text-muted-foreground">{{
                            link.description
                          }}</span>
                        }
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }
          } @else {
            <a
              [href]="href(item.href)"
              class="inline-flex rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >{{ item.label }}</a
            >
          }
        </li>
      }
    </ul>
  `,
})
export class BuiNavigationMenu {
  readonly items = input<readonly NavMenuItem[]>([]);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly active = signal(-1);
  protected readonly computedClass = computed(() =>
    cn('relative block max-w-max', this.userClass()),
  );

  protected href(value: string | undefined): string {
    return value && value !== '' ? value : '#';
  }

  protected onEnter(index: number, item: NavMenuItem): void {
    if (item.links && item.links.length > 0) {
      this.active.set(index);
    }
  }

  protected toggle(index: number): void {
    this.active.set(this.active() === index ? -1 : index);
  }
}

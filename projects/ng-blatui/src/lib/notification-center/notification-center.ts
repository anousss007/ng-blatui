import { Component, computed, input, model, signal } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

export interface NotificationItem {
  /** Primary heading text of the notification. */
  title: string;
  /** Optional secondary detail line shown beneath the title. */
  body?: string;
  /** Optional timestamp label displayed under the body. */
  time?: string;
  /** Whether the notification is already read (suppresses the unread dot). */
  read?: boolean;
}

/** A bell trigger with a dropdown feed of notifications and an unread badge. */
@Component({
  selector: 'bui-notification-center',
  host: { 'data-slot': 'notification-center', '[class]': 'computedClass()' },
  template: `
    <button
      type="button"
      class="relative inline-flex size-9 items-center justify-center rounded-md border border-input hover:bg-accent"
      [attr.aria-expanded]="open()"
      [attr.aria-label]="ariaText()"
      (click)="open.set(!open())"
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
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      @if (unread() > 0) {
        <span
          class="absolute -end-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
        >
          {{ unread() }}
        </span>
      }
    </button>
    @if (open()) {
      <div
        class="absolute end-0 z-50 mt-2 w-80 rounded-lg border bg-popover text-popover-foreground shadow-md"
        role="region"
        [attr.aria-label]="ariaText()"
      >
        <div class="flex items-center justify-between border-b p-3">
          <span class="text-sm font-medium">{{ ariaText() }}</span>
          <button type="button" class="text-xs font-medium text-primary" (click)="markAllRead()">
            {{ markAllReadText() }}
          </button>
        </div>
        <ul class="max-h-80 overflow-auto">
          @for (item of notifications(); track $index; let i = $index) {
            <li
              class="flex gap-3 border-b p-3 last:border-0"
              [class]="isRead(i) ? '' : 'bg-muted/30'"
            >
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium">{{ item.title }}</div>
                @if (item.body) {
                  <div class="truncate text-xs text-muted-foreground">{{ item.body }}</div>
                }
                @if (item.time) {
                  <div class="mt-0.5 text-[10px] text-muted-foreground">{{ item.time }}</div>
                }
              </div>
              @if (!isRead(i)) {
                <span
                  class="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                  [attr.aria-label]="unreadText()"
                ></span>
              }
            </li>
          } @empty {
            <li class="p-6 text-center text-sm text-muted-foreground">{{ emptyText() }}</li>
          }
        </ul>
      </div>
    }
  `,
})
export class BuiNotificationCenter {
  /** Notification items rendered in the dropdown feed. */
  readonly notifications = input<readonly NotificationItem[]>([]);
  /** Whether the dropdown is open. Two-way bindable with `[(open)]`. */
  readonly open = model(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible label for the trigger and dropdown region. */
  readonly ariaLabel = input<string>();
  /** Accessible label announced for the per-item unread dot. */
  readonly unreadLabel = input<string>();
  /** Label for the "mark all as read" action button. */
  readonly markAllReadLabel = input<string>();
  /** Text shown when there are no notifications. */
  readonly emptyLabel = input<string>();

  protected readonly ariaText = buiLabel('notificationCenter', this.ariaLabel);
  protected readonly unreadText = buiLabel('notificationCenterUnread', this.unreadLabel);
  protected readonly markAllReadText = buiLabel(
    'notificationCenterMarkAllRead',
    this.markAllReadLabel,
  );
  protected readonly emptyText = buiLabel('notificationCenterEmpty', this.emptyLabel);

  private readonly markedRead = signal<ReadonlySet<number>>(new Set());
  protected readonly unread = computed(
    () => this.notifications().filter((_, index) => !this.isRead(index)).length,
  );
  protected readonly computedClass = computed(() => cn('relative inline-block', this.userClass()));

  protected isRead(index: number): boolean {
    return this.markedRead().has(index) || (this.notifications()[index]?.read ?? false);
  }

  protected markAllRead(): void {
    this.markedRead.set(new Set(this.notifications().map((_, index) => index)));
  }
}

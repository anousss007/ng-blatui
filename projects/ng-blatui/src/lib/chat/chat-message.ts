import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A chat bubble. `role="user"` aligns end with a primary bubble; otherwise assistant-styled. */
@Component({
  selector: 'bui-chat-message',
  host: { 'data-slot': 'chat-message', '[class]': 'computedClass()' },
  template: `
    <div
      class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-medium"
      [class.order-2]="isUser()"
    >
      @if (avatar()) {
        <img [src]="avatar()" alt="" class="size-full object-cover" />
      } @else {
        {{ initials() }}
      }
    </div>
    <div class="flex min-w-0 flex-col gap-1" [class.items-end]="isUser()">
      @if (name() || time()) {
        <div class="text-xs text-muted-foreground">
          @if (name()) {
            <span class="font-medium text-foreground">{{ name() }}</span>
          }
          @if (time()) {
            <span> · {{ time() }}</span>
          }
        </div>
      }
      <div class="rounded-2xl px-3 py-2 text-sm" [class]="bubbleClass()">
        @if (typing()) {
          <span class="flex gap-1 py-1">
            <span class="size-1.5 animate-bounce rounded-full bg-current"></span>
            <span
              class="size-1.5 animate-bounce rounded-full bg-current [animation-delay:150ms]"
            ></span>
            <span
              class="size-1.5 animate-bounce rounded-full bg-current [animation-delay:300ms]"
            ></span>
          </span>
        } @else {
          <ng-content />
        }
      </div>
    </div>
  `,
})
export class BuiChatMessage {
  readonly role = input('assistant');
  readonly name = input('');
  readonly time = input('');
  readonly avatar = input('');
  readonly typing = input(false);
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly isUser = computed(() => this.role() === 'user');
  protected readonly initials = computed(() => {
    const name = this.name().trim();
    if (name === '') {
      return '🙂';
    }
    const parts = name.split(/\s+/);
    const first = parts.at(0) ?? '';
    const last = parts.at(-1) ?? '';
    const initials = parts.length >= 2 ? first.charAt(0) + last.charAt(0) : name.slice(0, 2);
    return initials.toUpperCase();
  });
  protected readonly bubbleClass = computed(() =>
    this.isUser() ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
  );
  protected readonly computedClass = computed(() =>
    cn(
      'flex max-w-[80%] gap-2',
      this.isUser() ? 'flex-row-reverse self-end' : 'self-start',
      this.userClass(),
    ),
  );
}

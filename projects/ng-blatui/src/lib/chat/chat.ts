import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/** A scrollable conversation log (`role="log"`). Use `bui-chat-message` for bubbles. */
@Directive({
  selector: '[buiChat]',
  host: {
    'data-slot': 'chat',
    role: 'log',
    'aria-live': 'polite',
    tabindex: '0',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'computedClass()',
  },
})
export class BuiChat {
  /** Accessible label announced for the conversation log region. */
  readonly ariaLabel = input('Conversation');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col gap-4 overflow-y-auto p-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
      this.userClass(),
    ),
  );
}

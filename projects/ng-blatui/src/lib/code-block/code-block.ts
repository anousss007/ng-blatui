import { Component, computed, input, signal } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/** A dark code panel with an optional filename header and a copy button. */
@Component({
  selector: 'bui-code-block',
  host: { 'data-slot': 'code-block', '[class]': 'computedClass()' },
  template: `
    @if (filename()) {
      <div class="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span class="font-mono text-xs text-zinc-400">{{ filename() }}</span>
        <button
          type="button"
          [attr.aria-label]="copyText()"
          class="text-xs text-zinc-400 transition-colors hover:text-zinc-100"
          (click)="copy()"
        >
          {{ copied() ? copiedText() : copyShortText() }}
        </button>
      </div>
    } @else {
      <button
        type="button"
        [attr.aria-label]="copyText()"
        class="absolute end-2 top-2 z-10 rounded-md px-1.5 py-1 text-xs text-zinc-400 opacity-0 transition-all group-hover/code-block:opacity-100 hover:bg-white/10 hover:text-zinc-100 focus-visible:opacity-100"
        (click)="copy()"
      >
        {{ copied() ? copiedText() : copyShortText() }}
      </button>
    }
    <pre
      class="overflow-x-auto p-4 text-[13px] leading-relaxed"
    ><code class="font-mono">{{ code() }}</code></pre>
  `,
})
export class BuiCodeBlock {
  /** Source code shown in the panel and copied to the clipboard. */
  readonly code = input('');
  /** Optional filename shown in the header; omit for the floating copy button. */
  readonly filename = input<string | null>(null);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Accessible label for the copy button. */
  readonly copyLabel = input<string>();
  /** Short visible text for the copy button. */
  readonly copyShortLabel = input<string>();
  /** Text shown briefly after the code is copied. */
  readonly copiedLabel = input<string>();
  protected readonly copyText = buiLabel('codeBlockCopy', this.copyLabel);
  protected readonly copyShortText = buiLabel('codeBlockCopyShort', this.copyShortLabel);
  protected readonly copiedText = buiLabel('codeBlockCopied', this.copiedLabel);
  protected readonly copied = signal(false);
  protected readonly computedClass = computed(() =>
    cn(
      'group/code-block relative block overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100',
      this.userClass(),
    ),
  );

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 1600);
    } catch {
      // Clipboard unavailable — ignore.
    }
  }
}

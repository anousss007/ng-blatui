import { Component, input, signal } from '@angular/core';

import { BuiButton } from 'ng-blatui';

/** A code snippet block with a copy-to-clipboard button. */
@Component({
  selector: 'app-code',
  imports: [BuiButton],
  host: { class: 'block' },
  template: `
    <div class="relative">
      <pre
        class="overflow-x-auto rounded-lg border bg-muted p-4 text-sm leading-relaxed text-foreground"
      ><code>{{ code() }}</code></pre>
      <button buiButton variant="ghost" size="sm" class="absolute top-2 right-2" (click)="copy()">
        {{ copied() ? 'Copied' : 'Copy' }}
      </button>
    </div>
  `,
})
export class CodeBlock {
  readonly code = input.required<string>();
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 1500);
    } catch {
      // Clipboard unavailable — ignore.
    }
  }
}

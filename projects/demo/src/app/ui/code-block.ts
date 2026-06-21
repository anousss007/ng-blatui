import { Component, input, signal } from '@angular/core';

/** A dark code snippet block with a copy-to-clipboard button (matches BlatUI's code panes). */
@Component({
  selector: 'app-code',
  host: { class: 'block' },
  template: `
    <div class="group relative">
      <pre
        class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-[13px] leading-relaxed"
      ><code class="font-mono text-zinc-100">{{ code() }}</code></pre>
      <button
        type="button"
        class="absolute top-2 right-2 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100"
        (click)="copy()"
      >
        <span [class.text-emerald-400]="copied()">{{ copied() ? '✓ Copied' : '⧉ Copy' }}</span>
      </button>
    </div>
  `,
})
export class CodeBlock {
  readonly code = input.required<string>();
  protected readonly copied = signal(false);

  protected copy(): void {
    if (typeof navigator !== 'undefined') {
      void navigator.clipboard.writeText(this.code());
    }
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 1500);
  }
}

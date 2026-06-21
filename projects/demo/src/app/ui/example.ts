import { Component, input, signal } from '@angular/core';

/** A documented example: a Preview / Code tabbed card (mirrors BlatUI's preview component). */
@Component({
  selector: 'app-example',
  template: `
    <div class="not-prose my-6 rounded-xl border">
      <div class="flex items-center justify-between rounded-t-xl border-b bg-muted/40 px-2 py-1.5">
        <div class="inline-flex items-center gap-1 rounded-md bg-muted p-0.5 text-muted-foreground">
          <button
            type="button"
            class="rounded px-2.5 py-1 text-xs font-medium transition-colors"
            [class]="
              tab() === 'preview'
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:text-foreground'
            "
            (click)="tab.set('preview')"
          >
            Preview
          </button>
          <button
            type="button"
            class="rounded px-2.5 py-1 text-xs font-medium transition-colors"
            [class]="
              tab() === 'code' ? 'bg-background text-foreground shadow-sm' : 'hover:text-foreground'
            "
            (click)="tab.set('code')"
          >
            Code
          </button>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          (click)="copy()"
        >
          <span [class.text-emerald-500]="copied()">{{ copied() ? '✓ Copied' : '⧉ Copy' }}</span>
        </button>
      </div>

      <div
        class="flex min-h-[280px] flex-wrap items-center justify-center gap-4 rounded-b-xl bg-background p-10"
        [class.hidden]="tab() !== 'preview'"
      >
        <ng-content />
      </div>

      <div
        class="max-h-[600px] overflow-auto rounded-b-xl bg-zinc-950"
        [class.hidden]="tab() !== 'code'"
      >
        <pre
          class="p-4 text-[13px] leading-relaxed"
        ><code class="font-mono text-zinc-100">{{ code() }}</code></pre>
      </div>
    </div>
  `,
})
export class Example {
  readonly code = input.required<string>();
  protected readonly tab = signal<'preview' | 'code'>('preview');
  protected readonly copied = signal(false);

  protected copy(): void {
    if (typeof navigator !== 'undefined') {
      void navigator.clipboard.writeText(this.code());
    }
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 1600);
  }
}

import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * A terminal / console window (always dark). Put prompt + output lines in the content;
 * helper classes `.prompt .ok .dim .path .warn` colour them.
 */
@Component({
  selector: 'bui-terminal',
  host: { 'data-slot': 'terminal', '[class]': 'computedClass()' },
  template: `
    <div
      data-slot="terminal-bar"
      class="flex items-center gap-2 border-b border-white/10 bg-zinc-900 px-3.5 py-2.5"
    >
      @if (buttons()) {
        <span class="size-3 rounded-full" style="background:#ff5f57"></span>
        <span class="size-3 rounded-full" style="background:#febc2e"></span>
        <span class="size-3 rounded-full" style="background:#28c840"></span>
      }
      @if (title()) {
        <span
          data-slot="terminal-title"
          class="truncate font-mono text-xs text-zinc-400"
          [class.ml-2]="buttons()"
          >{{ title() }}</span
        >
      }
    </div>
    <div
      data-slot="terminal-body"
      class="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed [&_.dim]:text-zinc-400 [&_.ok]:text-emerald-400 [&_.path]:text-cyan-400 [&_.prompt]:text-emerald-400 [&_.warn]:text-amber-400"
    >
      <ng-content />
    </div>
  `,
})
export class BuiTerminal {
  /** Optional title shown in the terminal title bar. */
  readonly title = input<string | null>(null);
  /** Whether to show the macOS-style traffic-light buttons in the title bar. */
  readonly buttons = input(true);
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn(
      'block overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-md',
      this.userClass(),
    ),
  );
}

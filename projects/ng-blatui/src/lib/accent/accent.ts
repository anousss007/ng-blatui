import { computed, Directive, input } from '@angular/core';

/**
 * Re-themes everything inside it to a custom accent colour by overriding the primary
 * design tokens locally. Renders as `display: contents` so it adds no box.
 */
@Directive({
  selector: '[buiAccent]',
  host: { 'data-slot': 'accent', class: 'contents', '[style]': 'styleVars()' },
})
export class BuiAccent {
  readonly color = input<string | null>(null);
  readonly foreground = input('#ffffff');
  protected readonly styleVars = computed(() => {
    const color = this.color();
    if (!color) {
      return null;
    }
    const fg = this.foreground();
    return `--primary:${color};--secondary:${color};--ring:${color};--sidebar-primary:${color};--primary-foreground:${fg};`;
  });
}

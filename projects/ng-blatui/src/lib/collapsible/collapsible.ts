import { _IdGenerator } from '@angular/cdk/a11y';
import { Directive, inject, model } from '@angular/core';

/** Accessible disclosure: a trigger toggles the visibility of its content. */
@Directive({
  selector: '[buiCollapsible]',
  exportAs: 'buiCollapsible',
  host: { 'data-slot': 'collapsible' },
})
export class BuiCollapsible {
  readonly open = model(false);
  readonly contentId = inject(_IdGenerator).getId('bui-collapsible-');

  toggle(): void {
    this.open.update((value) => !value);
  }
}

@Directive({
  selector: 'button[buiCollapsibleTrigger]',
  host: {
    type: 'button',
    'data-slot': 'collapsible-trigger',
    '[attr.aria-expanded]': 'collapsible.open()',
    '[attr.aria-controls]': 'collapsible.contentId',
    '[attr.data-state]': "collapsible.open() ? 'open' : 'closed'",
    '(click)': 'collapsible.toggle()',
  },
})
export class BuiCollapsibleTrigger {
  protected readonly collapsible = inject(BuiCollapsible);
}

@Directive({
  selector: '[buiCollapsibleContent]',
  host: {
    'data-slot': 'collapsible-content',
    '[id]': 'collapsible.contentId',
    '[hidden]': '!collapsible.open()',
    '[attr.data-state]': "collapsible.open() ? 'open' : 'closed'",
  },
})
export class BuiCollapsibleContent {
  protected readonly collapsible = inject(BuiCollapsible);
}

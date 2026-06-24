import { Directive } from '@angular/core';

import { BuiTextarea } from '../textarea/textarea';

/**
 * @deprecated Use `<textarea buiTextarea [maxRows]="…">` instead — `buiTextarea` already auto-grows
 * (CSS `field-sizing-content`) and now supports `maxRows`. Kept as a thin alias so existing
 * `buiAutosizeTextarea` markup keeps working; it inherits every input from {@link BuiTextarea}.
 *
 * A textarea that grows with its content, capped at `maxRows`.
 */
@Directive({
  selector: 'textarea[buiAutosizeTextarea]',
  host: { 'data-slot': 'autosize-textarea' },
})
export class BuiAutosizeTextarea extends BuiTextarea {}

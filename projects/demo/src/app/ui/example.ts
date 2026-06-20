import { Component, input } from '@angular/core';

import { CodeBlock } from './code-block';

/** A documented example: a live preview of projected content + its source code. */
@Component({
  selector: 'app-example',
  imports: [CodeBlock],
  template: `
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-6">
        <ng-content />
      </div>
      <app-code [code]="code()" />
    </div>
  `,
})
export class Example {
  readonly code = input.required<string>();
}

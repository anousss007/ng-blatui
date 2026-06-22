import { Component, computed, input } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

export interface ComparisonRow {
  feature: string;
  values: readonly (string | boolean | null)[];
}

/** A data-driven feature-comparison / pricing table. */
@Component({
  selector: 'bui-comparison-table',
  host: { 'data-slot': 'comparison-table', '[class]': 'computedClass()' },
  template: `
    <table class="w-full text-sm">
      <caption class="sr-only">
        {{
          featureLabel()
        }}
        comparison
      </caption>
      <thead>
        <tr class="border-b bg-muted/40">
          <th scope="col" class="px-4 py-3 text-left font-medium text-muted-foreground">
            {{ featureLabel() }}
          </th>
          @for (tier of tiers(); track tier) {
            <th
              scope="col"
              class="px-4 py-3 text-center font-semibold"
              [class]="$index === highlightIndex() ? 'text-primary' : ''"
            >
              {{ tier }}
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.feature) {
          <tr class="border-b last:border-0">
            <th scope="row" class="px-4 py-3 text-left font-medium">{{ row.feature }}</th>
            @for (value of row.values; track $index) {
              <td
                class="px-4 py-3 text-center"
                [class]="$index === highlightIndex() ? 'bg-muted/30' : ''"
              >
                @if (value === true) {
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    [attr.aria-label]="includedText()"
                    class="mx-auto size-4 text-primary"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                } @else if (value === false || value === null) {
                  <span class="text-muted-foreground" [attr.aria-label]="notIncludedText()">—</span>
                } @else {
                  {{ value }}
                }
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class BuiComparisonTable {
  readonly tiers = input<readonly string[]>([]);
  readonly rows = input<readonly ComparisonRow[]>([]);
  readonly highlight = input<number | string | null>(null);
  readonly featureLabel = input('Feature');
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  readonly includedLabel = input<string>();
  readonly notIncludedLabel = input<string>();

  protected readonly includedText = buiLabel('comparisonTableIncluded', this.includedLabel);
  protected readonly notIncludedText = buiLabel(
    'comparisonTableNotIncluded',
    this.notIncludedLabel,
  );

  protected readonly highlightIndex = computed(() => {
    const highlight = this.highlight();
    if (typeof highlight === 'number') {
      return highlight;
    }
    return highlight === null ? -1 : this.tiers().indexOf(highlight);
  });
  protected readonly computedClass = computed(() =>
    cn('w-full overflow-x-auto rounded-xl border', this.userClass()),
  );
}

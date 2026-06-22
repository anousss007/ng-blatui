import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

type DiffType = 'same' | 'add' | 'del';
interface DiffLine {
  type: DiffType;
  text: string;
}

function splitLines(value: string): string[] {
  return value === '' ? [] : value.replaceAll('\r\n', '\n').split('\n');
}

function diffLines(before: string[], after: string[]): DiffLine[] {
  const n = before.length;
  const m = after.length;
  const lcs: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: m + 1 }, () => 0),
  );
  for (let index = n - 1; index >= 0; index -= 1) {
    for (let index_ = m - 1; index_ >= 0; index_ -= 1) {
      lcs[index][index_] =
        before[index] === after[index_]
          ? lcs[index + 1][index_ + 1] + 1
          : Math.max(lcs[index + 1][index_], lcs[index][index_ + 1]);
    }
  }
  const out: DiffLine[] = [];
  let index = 0;
  let index_ = 0;
  while (index < n && index_ < m) {
    if (before[index] === after[index_]) {
      out.push({ type: 'same', text: before[index] });
      index += 1;
      index_ += 1;
    } else if (lcs[index + 1][index_] >= lcs[index][index_ + 1]) {
      out.push({ type: 'del', text: before[index] });
      index += 1;
    } else {
      out.push({ type: 'add', text: after[index_] });
      index_ += 1;
    }
  }
  while (index < n) {
    out.push({ type: 'del', text: before[index] });
    index += 1;
  }
  while (index_ < m) {
    out.push({ type: 'add', text: after[index_] });
    index_ += 1;
  }
  return out;
}

const ROW_CLASS: Record<DiffType, string> = {
  same: '',
  add: 'bg-emerald-500/10',
  del: 'bg-red-500/10',
};
const SIGN: Record<DiffType, string> = { same: ' ', add: '+', del: '-' };

/** A line-by-line text diff (LCS) rendered with +/- gutters. */
@Component({
  selector: 'bui-diff-viewer',
  host: { 'data-slot': 'diff-viewer', '[class]': 'computedClass()' },
  template: `
    @if (filename()) {
      <div class="border-b bg-muted/50 px-3 py-2 font-mono text-xs font-medium">
        {{ filename() }}
      </div>
    }
    <table class="w-full border-collapse font-mono text-xs">
      <tbody>
        @for (line of lines(); track $index) {
          <tr [class]="rowClass(line.type)">
            <td class="w-6 px-2 text-center text-muted-foreground select-none">
              {{ sign(line.type) }}
            </td>
            <td class="px-2 py-0.5 whitespace-pre-wrap">{{ line.text }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class BuiDiffViewer {
  /** Original text; lines removed relative to `after` are marked deleted. */
  readonly before = input('');
  /** Updated text; lines added relative to `before` are marked added. */
  readonly after = input('');
  /** Optional filename shown in the header above the diff. */
  readonly filename = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly lines = computed(() =>
    diffLines(splitLines(this.before()), splitLines(this.after())),
  );
  protected readonly computedClass = computed(() =>
    cn('block overflow-hidden rounded-lg border', this.userClass()),
  );

  protected rowClass(type: DiffType): string {
    return ROW_CLASS[type];
  }

  protected sign(type: DiffType): string {
    return SIGN[type];
  }
}

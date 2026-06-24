import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTextarea, type TextareaSize } from './textarea';

@Component({
  imports: [BuiTextarea],
  template: `<textarea buiTextarea [size]="size()" [maxRows]="maxRows()"></textarea>`,
})
class TestHost {
  readonly size = signal<TextareaSize>('default');
  readonly maxRows = signal<number | null>(null);
}

describe('BuiTextarea', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLTextAreaElement>('textarea')!;
    return { fixture, el: element };
  }

  it('applies slot and default size classes', () => {
    const { el } = setup();
    expect(el.dataset['slot']).toBe('textarea');
    expect(el.classList.contains('field-sizing-content')).toBe(true);
    expect(el.classList.contains('min-h-16')).toBe(true);
  });

  it('reflects the size input', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();
    expect(el.classList.contains('min-h-20')).toBe(true);
  });

  it('caps the height at maxRows and scrolls past it', () => {
    const { fixture, el } = setup();
    expect(el.style.maxHeight).toBe('');
    fixture.componentInstance.maxRows.set(4);
    fixture.detectChanges();
    // 4 rows via the `lh` unit, plus the default vertical padding (1rem) and borders (2px).
    // (Asserted by parts — the CSS serializer normalizes `4 * 1lh` → `4lh` and reorders terms.)
    const max = el.style.maxHeight;
    expect(max).toContain('4lh');
    expect(max).toContain('1rem');
    expect(max).toContain('2px');
    expect(el.style.overflowY).toBe('auto');
  });
});

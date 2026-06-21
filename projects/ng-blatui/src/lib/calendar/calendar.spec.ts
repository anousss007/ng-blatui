import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCalendar } from './calendar';

@Component({
  imports: [BuiCalendar],
  template: `<bui-calendar [(value)]="date" />`,
})
class TestHost {
  readonly date = signal('');
}

describe('BuiCalendar', () => {
  it('renders a 6-week grid and navigates months', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('thead th')).toHaveLength(7);
    expect(root.querySelectorAll('tbody button')).toHaveLength(42);

    const label = root.querySelector('[aria-live="polite"]')!.textContent;
    root.querySelector<HTMLButtonElement>('button[aria-label="Previous month"]')!.click();
    fixture.detectChanges();
    expect(root.querySelector('[aria-live="polite"]')!.textContent).not.toBe(label);
  });

  it('selects a day on click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelectorAll<HTMLButtonElement>('tbody button')[20].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.date()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

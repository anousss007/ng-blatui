import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { type CalendarRange } from '../calendar/calendar';

import { BuiDateRangePicker, type DateRangePreset } from './date-range-picker';

@Component({
  imports: [BuiDateRangePicker],
  template: `<bui-date-range-picker [(value)]="range" [presets]="presets" />`,
})
class TestHost {
  readonly range = signal<CalendarRange>({ start: '', end: '' });
  readonly presets: DateRangePreset[] = [
    { label: 'Q1', range: { start: '2026-01-01', end: '2026-03-31' } },
    { label: 'Q2', range: { start: '2026-04-01', end: '2026-06-30' } },
  ];
}

describe('BuiDateRangePicker', () => {
  it('shows the placeholder until a range is chosen', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(trigger.textContent).toContain('Pick a date range');
  });

  it('opens a dialog with the provided presets and applies one', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector('button')!;

    trigger.click();
    fixture.detectChanges();
    // The popover is portalled into the CDK overlay (attached to the document).
    const presetButtons = [
      ...document.querySelectorAll<HTMLElement>('.cdk-overlay-container button'),
    ];
    const q1 = presetButtons.find((b) => b.textContent.trim() === 'Q1');
    expect(q1).toBeTruthy();

    q1!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.range()).toEqual({ start: '2026-01-01', end: '2026-03-31' });
    // Applying a preset closes the popover.
    expect(document.querySelector('.cdk-overlay-container [role="dialog"]')).toBeNull();
  });

  it('formats the selected range on the trigger', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.range.set({ start: '2026-01-01', end: '2026-03-31' });
    fixture.detectChanges();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    expect(trigger.textContent).toContain('–');
    expect(trigger.textContent).toContain('2026');
  });
});

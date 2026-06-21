import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDatePicker } from './date-picker';

@Component({
  imports: [BuiDatePicker],
  template: `<bui-date-picker [(value)]="date" placeholder="Pick a date" />`,
})
class TestHost {
  readonly date = signal('');
}

describe('BuiDatePicker', () => {
  it('opens the calendar and selects a date', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector<HTMLButtonElement>('button[aria-expanded]')!;
    expect(trigger.textContent).toContain('Pick a date');

    trigger.click();
    fixture.detectChanges();
    expect(root.querySelector('bui-calendar')).not.toBeNull();

    root.querySelectorAll<HTMLButtonElement>('tbody button')[15].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.date()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(root.querySelector('bui-calendar')).toBeNull(); // closed after pick
  });
});

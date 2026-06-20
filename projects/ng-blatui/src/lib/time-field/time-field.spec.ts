import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTimeField } from './time-field';

@Component({
  imports: [BuiTimeField],
  template: `<bui-time-field [(value)]="time" ariaLabel="Start time" />`,
})
class TestHost {
  readonly time = signal('09:30');
}

describe('BuiTimeField', () => {
  it('renders a time input bound to the value', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>(
      'input[type="time"]',
    )!;
    expect(input.value).toBe('09:30');
    expect(input.getAttribute('aria-label')).toBe('Start time');
  });
});

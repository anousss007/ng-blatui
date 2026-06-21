import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDatetimePicker } from './datetime-picker';

@Component({
  imports: [BuiDatetimePicker],
  template: `<bui-datetime-picker [(value)]="value" />`,
})
class TestHost {
  readonly value = signal('');
}

describe('BuiDatetimePicker', () => {
  it('opens a calendar + time field and builds a datetime value', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('button[aria-expanded]')!.click();
    fixture.detectChanges();
    expect(root.querySelector('bui-calendar')).not.toBeNull();
    expect(root.querySelector('bui-time-field')).not.toBeNull();

    root.querySelectorAll<HTMLButtonElement>('tbody button')[15].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toContain('T');
  });
});

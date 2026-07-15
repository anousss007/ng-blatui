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
    // The popover is portalled into the CDK overlay (attached to the document), not the host.
    expect(document.querySelector('bui-calendar')).not.toBeNull();
    expect(document.querySelector('bui-time-field')).not.toBeNull();

    document.querySelectorAll<HTMLButtonElement>('.cdk-overlay-container tbody button')[15].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toContain('T');
  });
});

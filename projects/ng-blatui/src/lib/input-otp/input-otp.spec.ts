import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiInputOtp } from './input-otp';

@Component({
  imports: [BuiInputOtp],
  template: `<bui-input-otp [(value)]="otp" [maxlength]="4" />`,
})
class TestHost {
  readonly otp = signal('');
}

describe('BuiInputOtp', () => {
  it('renders one box per slot and captures typed digits', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const boxes = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>(
      'input',
    );
    expect(boxes).toHaveLength(4);

    boxes[0].value = '7';
    boxes[0].dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.otp()).toBe('7');
  });
});

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiPhoneInput } from './phone-input';

@Component({
  imports: [BuiPhoneInput],
  template: `<bui-phone-input [(value)]="phone" [(country)]="cc" />`,
})
class TestHost {
  readonly phone = signal('');
  readonly cc = signal('US');
}

describe('BuiPhoneInput', () => {
  it('binds the number and country selector', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('select[aria-label="Country code"]')).not.toBeNull();

    const input = root.querySelector<HTMLInputElement>('input[type="tel"]')!;
    input.value = '555 0100';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.phone()).toBe('555 0100');
  });
});

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiInputMask } from './input-mask';

@Component({
  imports: [BuiInputMask],
  template: `<bui-input-mask mask="99/99" [(value)]="value" />`,
})
class TestHost {
  readonly value = signal('');
}

describe('BuiInputMask', () => {
  it('formats input against the mask', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector('input')!;
    input.value = '1234';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('12/34');
    expect(input.value).toBe('12/34');
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiPasswordStrength } from './password-strength';

@Component({
  imports: [BuiPasswordStrength],
  template: `<bui-password-strength [minLength]="8" />`,
})
class TestHost {}

describe('BuiPasswordStrength', () => {
  it('scores a strong password and fills all bars', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector<HTMLInputElement>('input')!;

    input.value = 'Abcd1234!';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(root.textContent).toContain('Strong');
    const filled = root.querySelectorAll('.bg-emerald-500');
    expect(filled).toHaveLength(4);
  });
});

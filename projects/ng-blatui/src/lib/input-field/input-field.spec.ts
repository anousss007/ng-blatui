import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiInputField } from './input-field';

@Component({
  imports: [BuiInputField],
  template: `
    <bui-input-field label="Email" [hint]="hint()" [error]="error()" [(value)]="email" />
  `,
})
class TestHost {
  readonly email = signal('');
  readonly hint = signal('We never share it.');
  readonly error = signal('');
}

describe('BuiInputField', () => {
  it('associates the label with the control and describes it by the hint', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const label = root.querySelector('label')!;
    const input = root.querySelector<HTMLInputElement>('input')!;
    const hint = root.querySelector('[data-slot="field-description"]')!;

    expect(label.getAttribute('for')).toBe(input.id);
    expect(input.getAttribute('aria-describedby')).toBe(hint.id);
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('marks invalid and swaps hint for error when error is set', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    fixture.componentInstance.error.set('Required');
    fixture.detectChanges();

    const input = root.querySelector<HTMLInputElement>('input')!;
    const error = root.querySelector('[data-slot="field-error"]')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(error.getAttribute('role')).toBe('alert');
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
    expect(root.querySelector('[data-slot="field-description"]')).toBeNull();
  });

  it('writes typed input back to the model', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    input.value = 'a@b.co';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.email()).toBe('a@b.co');
  });
});

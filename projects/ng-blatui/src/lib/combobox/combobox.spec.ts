import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCombobox, type ComboboxOption } from './combobox';

@Component({
  imports: [BuiCombobox],
  template: `<bui-combobox [(value)]="framework" [options]="options" />`,
})
class TestHost {
  readonly framework = signal('');
  readonly options: ComboboxOption[] = [
    { value: 'ng', label: 'Angular' },
    { value: 're', label: 'React' },
    { value: 'vu', label: 'Vue' },
  ];
}

describe('BuiCombobox', () => {
  it('filters options as you type and selects one', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector<HTMLInputElement>('[role="combobox"]')!;

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelectorAll('[role="option"]')).toHaveLength(3);

    input.value = 'an';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const filtered = root.querySelectorAll<HTMLElement>('[role="option"]');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].textContent).toContain('Angular');

    filtered[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.framework()).toBe('ng');
  });
});

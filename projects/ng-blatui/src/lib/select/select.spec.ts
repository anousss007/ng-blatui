import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSelect, type SelectOption } from './select';

@Component({
  imports: [BuiSelect],
  template: `<bui-select [(value)]="fruit" [options]="options" placeholder="Pick a fruit" />`,
})
class TestHost {
  readonly fruit = signal('');
  readonly options: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
  ];
}

describe('BuiSelect', () => {
  it('opens a listbox and selects an option', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const trigger = root.querySelector<HTMLButtonElement>('[role="combobox"]')!;

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');

    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const options = root.querySelectorAll<HTMLElement>('[role="option"]');
    expect(options).toHaveLength(2);

    options[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.fruit()).toBe('banana');
    expect(root.querySelector('[role="listbox"]')).toBeNull();
  });
});

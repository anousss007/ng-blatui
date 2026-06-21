import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAutocomplete } from './autocomplete';

@Component({
  imports: [BuiAutocomplete],
  template: `<bui-autocomplete [(value)]="value" [options]="options" />`,
})
class TestHost {
  readonly value = signal('');
  readonly options = ['Apple', 'Banana', 'Cherry'];
}

describe('BuiAutocomplete', () => {
  it('filters options and selects one', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector<HTMLInputElement>('input')!;
    input.value = 'an';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const options = root.querySelectorAll<HTMLElement>('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('Banana');

    options[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('Banana');
  });
});

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiVariantSelector } from './variant-selector';

@Component({
  imports: [BuiVariantSelector],
  template: `<bui-variant-selector [(value)]="size" [options]="options" />`,
})
class TestHost {
  readonly size = signal('');
  readonly options = ['S', 'M', 'L'];
}

describe('BuiVariantSelector', () => {
  it('is a radiogroup that selects on click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="radiogroup"]')).not.toBeNull();
    const radios = root.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    expect(radios).toHaveLength(3);

    radios[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.size()).toBe('M');
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
  });
});

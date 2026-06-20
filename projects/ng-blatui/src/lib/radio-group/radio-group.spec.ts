import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiRadioGroup, BuiRadioGroupItem } from './radio-group';

@Component({
  imports: [BuiRadioGroup, BuiRadioGroupItem],
  template: `
    <div buiRadioGroup [(value)]="value">
      <button buiRadioItem value="a" aria-label="A"></button>
      <button buiRadioItem value="b" aria-label="B"></button>
    </div>
  `,
})
class TestHost {
  readonly value = signal<string | null>(null);
}

describe('BuiRadioGroup', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const radios = root.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    return { fixture, root, radios };
  }

  it('exposes radiogroup/radio roles', () => {
    const { root, radios } = setup();
    expect(root.querySelector('[role="radiogroup"]')).not.toBeNull();
    expect(radios).toHaveLength(2);
    expect(radios[0].getAttribute('aria-checked')).toBe('false');
  });

  it('selects on click and reflects aria-checked + value', () => {
    const { fixture, radios } = setup();
    radios[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('b');
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
    expect(radios[0].getAttribute('aria-checked')).toBe('false');
  });

  it('roves tabindex to the selected item', () => {
    const { fixture, radios } = setup();
    radios[0].click();
    fixture.detectChanges();
    expect(radios[0].getAttribute('tabindex')).toBe('0');
    expect(radios[1].getAttribute('tabindex')).toBe('-1');
  });
});

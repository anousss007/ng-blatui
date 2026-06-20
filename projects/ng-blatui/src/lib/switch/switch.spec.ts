import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSwitch } from './switch';

@Component({
  imports: [BuiSwitch],
  template: `<button buiSwitch aria-label="Airplane mode" [(checked)]="checked"></button>`,
})
class TestHost {
  readonly checked = signal(false);
}

describe('BuiSwitch', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLButtonElement>('button')!;
    return { fixture, el: element };
  }

  it('exposes the switch role and unchecked state initially', () => {
    const { el } = setup();
    expect(el.getAttribute('role')).toBe('switch');
    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(el.dataset['state']).toBe('unchecked');
  });

  it('toggles checked on click and moves the thumb state', () => {
    const { fixture, el } = setup();
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(el.getAttribute('aria-checked')).toBe('true');
    const thumb = el.querySelector<HTMLElement>('[data-slot="switch-thumb"]')!;
    expect(thumb.dataset['state']).toBe('checked');
  });
});

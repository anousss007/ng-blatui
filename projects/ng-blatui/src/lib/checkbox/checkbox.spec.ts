import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCheckbox } from './checkbox';

@Component({
  imports: [BuiCheckbox],
  template: `<button
    buiCheckbox
    aria-label="Accept terms"
    [(checked)]="checked"
    [(indeterminate)]="indeterminate"
  ></button>`,
})
class TestHost {
  readonly checked = signal(false);
  readonly indeterminate = signal(false);
}

describe('BuiCheckbox', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLButtonElement>('button')!;
    return { fixture, el: element };
  }

  it('exposes the checkbox role and unchecked state initially', () => {
    const { el } = setup();
    expect(el.getAttribute('role')).toBe('checkbox');
    expect(el.getAttribute('aria-checked')).toBe('false');
    expect(el.dataset['state']).toBe('unchecked');
  });

  it('toggles checked on click', () => {
    const { fixture, el } = setup();
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(el.dataset['state']).toBe('checked');
  });

  it('reports aria mixed when indeterminate and resolves to checked on click', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();
    expect(el.getAttribute('aria-checked')).toBe('mixed');
    el.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.indeterminate()).toBe(false);
    expect(fixture.componentInstance.checked()).toBe(true);
  });
});

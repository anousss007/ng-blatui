import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiToggleGroup } from './toggle-group';
import { BuiToggleGroupItem } from './toggle-group-item';

@Component({
  imports: [BuiToggleGroup, BuiToggleGroupItem],
  template: `
    <bui-toggle-group [(value)]="align">
      <button buiToggleGroupItem value="left">L</button>
      <button buiToggleGroupItem value="center">C</button>
    </bui-toggle-group>
  `,
})
class TestHost {
  readonly align = signal<string | string[] | null>(null);
}

describe('BuiToggleGroup', () => {
  it('selects a single item on click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const items = root.querySelectorAll<HTMLButtonElement>('[data-slot="toggle-group-item"]');

    items[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.align()).toBe('left');
    expect(items[0].getAttribute('data-state')).toBe('on');
    expect(items[0].getAttribute('aria-pressed')).toBe('true');
  });
});

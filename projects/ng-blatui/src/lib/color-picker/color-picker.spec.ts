import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiColorPicker } from './color-picker';

@Component({
  imports: [BuiColorPicker],
  template: `<bui-color-picker [(value)]="color" />`,
})
class TestHost {
  readonly color = signal('#6366f1');
}

describe('BuiColorPicker', () => {
  it('selects a colour from a swatch', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector<HTMLInputElement>('input[type="color"]')?.value).toBe('#6366f1');

    const swatches = root.querySelectorAll<HTMLButtonElement>('button[aria-label^="#"]');
    expect(swatches.length).toBeGreaterThan(0);
    swatches[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.color()).toBe(swatches[0].getAttribute('aria-label'));
  });
});

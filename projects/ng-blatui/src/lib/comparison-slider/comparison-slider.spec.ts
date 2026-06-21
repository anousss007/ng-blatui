import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiComparisonSlider } from './comparison-slider';

@Component({
  imports: [BuiComparisonSlider],
  template: `<bui-comparison-slider before="/b.jpg" after="/a.jpg" [(value)]="pos" />`,
})
class TestHost {
  readonly pos = signal(50);
}

describe('BuiComparisonSlider', () => {
  it('drives the clip from the range input', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('img')).toHaveLength(2);

    const range = root.querySelector<HTMLInputElement>('input[type="range"]')!;
    range.value = '30';
    range.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.pos()).toBe(30);
    const clipped = root.querySelector<HTMLElement>('[style*="clip-path"]')!;
    expect(clipped.style.clipPath).toContain('70%');
  });
});

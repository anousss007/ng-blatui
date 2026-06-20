import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSkeleton } from './skeleton';

@Component({
  imports: [BuiSkeleton],
  template: `<div buiSkeleton class="h-4 w-32"></div>`,
})
class TestHost {}

describe('BuiSkeleton', () => {
  it('is aria-hidden and animated', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLDivElement>('div')!;
    expect(element.dataset['slot']).toBe('skeleton');
    expect(element.getAttribute('aria-hidden')).toBe('true');
    expect(element.className).toContain('animate-pulse');
    expect(element.className).toContain('h-4');
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiStack } from './stack';

@Component({
  imports: [BuiStack],
  template: `<div buiStack direction="row" gap="2" justify="between">Content</div>`,
})
class TestHost {}

describe('BuiStack', () => {
  it('applies flex layout classes', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector('[data-slot="stack"]')!;
    expect(element.className).toContain('flex');
    expect(element.className).toContain('flex-row');
    expect(element.className).toContain('gap-2');
    expect(element.className).toContain('justify-between');
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiBentoGrid } from './bento-grid';
import { BuiBentoItem } from './bento-item';

@Component({
  imports: [BuiBentoGrid, BuiBentoItem],
  template: `
    <div buiBentoGrid [columns]="3">
      <bui-bento-item title="Storage" description="2 TB" [colSpan]="2">Body</bui-bento-item>
    </div>
  `,
})
class TestHost {}

describe('BuiBentoGrid', () => {
  it('lays out items with title, description and span', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-slot="bento-grid"]')?.className).toContain('grid');
    const item = element.querySelector('[data-slot="bento-item"]')!;
    expect(item.className).toContain('lg:col-span-2');
    expect(item.textContent).toContain('Storage');
    expect(item.textContent).toContain('2 TB');
  });
});

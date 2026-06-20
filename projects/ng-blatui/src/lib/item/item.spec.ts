import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiItem,
  BuiItemActions,
  BuiItemContent,
  BuiItemDescription,
  BuiItemMedia,
  BuiItemTitle,
} from './item';

@Component({
  imports: [
    BuiItem,
    BuiItemMedia,
    BuiItemContent,
    BuiItemTitle,
    BuiItemDescription,
    BuiItemActions,
  ],
  template: `
    <div buiItem variant="outline" size="sm">
      <div buiItemMedia variant="icon">i</div>
      <div buiItemContent>
        <div buiItemTitle>Title</div>
        <p buiItemDescription>Description</p>
      </div>
      <div buiItemActions><button type="button">x</button></div>
    </div>
  `,
})
class TestHost {}

describe('Item', () => {
  it('reflects variant/size and renders its parts', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const item = element.querySelector('[data-slot="item"]')!;
    expect(item.getAttribute('data-variant')).toBe('outline');
    expect(item.getAttribute('data-size')).toBe('sm');
    expect(element.querySelector('[data-slot="item-media"]')?.getAttribute('data-variant')).toBe(
      'icon',
    );
    expect(element.querySelector('[data-slot="item-title"]')?.textContent).toContain('Title');
    expect(element.querySelector('[data-slot="item-actions"]')).not.toBeNull();
  });
});

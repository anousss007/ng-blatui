import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiInfiniteScroll } from './infinite-scroll';

@Component({
  imports: [BuiInfiniteScroll],
  template: `<bui-infinite-scroll (more)="loads = loads + 1">Items</bui-infinite-scroll>`,
})
class TestHost {
  loads = 0;
}

describe('BuiInfiniteScroll', () => {
  it('emits more when the fallback button is pressed', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      'button',
    )!;
    expect(button.textContent).toContain('Load more');

    button.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.loads).toBe(1);
    fixture.destroy();
  });
});

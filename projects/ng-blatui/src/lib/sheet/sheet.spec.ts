import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSheet } from './sheet';

@Component({
  imports: [BuiSheet],
  template: `<bui-sheet [(open)]="open" side="right"><p>Sheet body</p></bui-sheet>`,
})
class TestHost {
  readonly open = signal(false);
}

describe('BuiSheet', () => {
  it('shows the panel when open and closes on overlay click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="dialog"]')).toBeNull();

    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    expect(root.querySelector('[role="dialog"]')).not.toBeNull();
    expect(root.textContent).toContain('Sheet body');

    root.querySelector<HTMLElement>('.fixed.inset-0')!.click();
    fixture.detectChanges();
    expect(root.querySelector('[role="dialog"]')).toBeNull();
  });
});

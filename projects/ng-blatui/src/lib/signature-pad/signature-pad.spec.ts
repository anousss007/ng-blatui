import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSignaturePad } from './signature-pad';

@Component({
  imports: [BuiSignaturePad],
  template: `<bui-signature-pad [height]="160" />`,
})
class TestHost {}

describe('BuiSignaturePad', () => {
  it('renders a canvas with disabled undo/clear when empty', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('canvas')).not.toBeNull();
    const buttons = root.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(true);
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSpeedDial, type SpeedDialAction } from './speed-dial';

@Component({
  imports: [BuiSpeedDial],
  template: `<bui-speed-dial [actions]="actions" />`,
})
class TestHost {
  readonly actions: SpeedDialAction[] = [
    { label: 'Share', href: '#share' },
    { label: 'Edit', href: '#edit' },
  ];
}

describe('BuiSpeedDial', () => {
  it('toggles the action stack open', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const fab = root.querySelector<HTMLButtonElement>('button[aria-expanded]')!;

    expect(fab.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelectorAll('a')).toHaveLength(2);

    fab.click();
    fixture.detectChanges();
    expect(fab.getAttribute('aria-expanded')).toBe('true');
  });
});

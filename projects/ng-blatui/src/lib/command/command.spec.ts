import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiCommand, type CommandGroup, type CommandItem } from './command';

@Component({
  imports: [BuiCommand],
  template: `<bui-command [groups]="groups" (selected)="picked = $event" />`,
})
class TestHost {
  picked: CommandItem | null = null;
  readonly groups: CommandGroup[] = [
    { label: 'Suggestions', items: [{ label: 'New file' }, { label: 'Open folder' }] },
  ];
}

describe('BuiCommand', () => {
  it('filters items and selects on click', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('[role="option"]')).toHaveLength(2);

    const input = root.querySelector<HTMLInputElement>('input')!;
    input.value = 'new';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const options = root.querySelectorAll<HTMLElement>('[role="option"]');
    expect(options).toHaveLength(1);

    options[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.picked?.label).toBe('New file');
  });
});

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiRepeater, type RepeaterField } from './repeater';

@Component({
  imports: [BuiRepeater],
  template: `<bui-repeater [fields]="fields" [(rows)]="rows" [min]="1" />`,
})
class TestHost {
  readonly fields: RepeaterField[] = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
  ];
  readonly rows = signal<Record<string, string>[]>([{ name: 'Ada', role: 'Engineer' }]);
}

describe('BuiRepeater', () => {
  it('adds a new row', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('input')).toHaveLength(2);

    const buttons = [...root.querySelectorAll<HTMLButtonElement>('button')];
    buttons.at(-1)?.click(); // Add row
    fixture.detectChanges();
    expect(fixture.componentInstance.rows()).toHaveLength(2);
    expect(root.querySelectorAll('input')).toHaveLength(4);
  });
});

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiEditable } from './editable';

@Component({
  imports: [BuiEditable],
  template: `<bui-editable [(value)]="name" />`,
})
class TestHost {
  readonly name = signal('Ada');
}

describe('BuiEditable', () => {
  it('edits and commits the value', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('button')?.textContent).toContain('Ada');

    root.querySelector('button')!.click();
    fixture.detectChanges();
    const input = root.querySelector<HTMLInputElement>('input')!;
    input.value = 'Grace';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.name()).toBe('Grace');
  });
});

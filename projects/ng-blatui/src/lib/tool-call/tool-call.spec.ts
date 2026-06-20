import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiToolCall } from './tool-call';

@Component({
  imports: [BuiToolCall],
  template: `<bui-tool-call name="search_web" status="success" args="{ q: 'angular' }" />`,
})
class TestHost {}

describe('BuiToolCall', () => {
  it('reveals arguments when expanded', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('code')?.textContent).toContain('search_web');

    root.querySelector('button')!.click();
    fixture.detectChanges();
    expect(root.querySelector('pre')?.textContent).toContain('angular');
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDiffViewer } from './diff-viewer';

@Component({
  imports: [BuiDiffViewer],
  template: `<bui-diff-viewer [before]="before" [after]="after" />`,
})
class TestHost {
  readonly before = 'line one\nold line\nline three';
  readonly after = 'line one\nnew line\nline three';
}

describe('BuiDiffViewer', () => {
  it('marks removed and added lines', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('old line');
    expect(element.textContent).toContain('new line');
    expect(element.querySelector('[class*="bg-red"]')).not.toBeNull();
    expect(element.querySelector('[class*="bg-emerald"]')).not.toBeNull();
  });
});

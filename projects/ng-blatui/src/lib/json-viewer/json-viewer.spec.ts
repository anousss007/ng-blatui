import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiJsonViewer } from './json-viewer';

@Component({
  imports: [BuiJsonViewer],
  template: `<bui-json-viewer [data]="data" />`,
})
class TestHost {
  readonly data = { name: 'Ada', age: 36, tags: ['math', 'code'] };
}

describe('BuiJsonViewer', () => {
  it('renders keys and values from the data', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="json-viewer"]',
    )!;
    expect(element.textContent).toContain('"name"');
    expect(element.textContent).toContain('"Ada"');
    expect(element.textContent).toContain('36');
  });
});

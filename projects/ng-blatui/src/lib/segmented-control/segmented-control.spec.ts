import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSegmentedControl } from './segmented-control';

@Component({
  imports: [BuiSegmentedControl],
  template: `<bui-segmented-control [(value)]="view" [options]="['list', 'grid', 'board']" />`,
})
class TestHost {
  readonly view = signal('list');
}

describe('BuiSegmentedControl', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const segments = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '[role="radio"]',
    );
    return { fixture, segments };
  }

  it('renders a radiogroup of segments and selects on click', () => {
    const { fixture, segments } = setup();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="radiogroup"]'),
    ).not.toBeNull();
    expect(segments).toHaveLength(3);
    expect(segments[0].getAttribute('aria-checked')).toBe('true');

    segments[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.view()).toBe('grid');
    expect(segments[1].getAttribute('aria-checked')).toBe('true');
  });
});

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiRating } from './rating';

@Component({
  imports: [BuiRating],
  template: `<bui-rating [(value)]="rating" [max]="5" ariaLabel="Rate this" />`,
})
class TestHost {
  readonly rating = signal(3);
}

describe('BuiRating', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const stars = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '[role="radio"]',
    );
    return { fixture, stars };
  }

  it('renders a radiogroup of stars and reflects the value', () => {
    const { fixture, stars } = setup();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[role="radiogroup"]'),
    ).not.toBeNull();
    expect(stars).toHaveLength(5);
    expect(stars[2].getAttribute('aria-checked')).toBe('true');
  });

  it('sets the value on click', () => {
    const { fixture, stars } = setup();
    stars[4].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.rating()).toBe(5);
    expect(stars[4].getAttribute('aria-checked')).toBe('true');
  });
});

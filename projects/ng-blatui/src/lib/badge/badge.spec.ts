import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { type BadgeTone, type BadgeVariant, BuiBadge } from './badge';

@Component({
  imports: [BuiBadge],
  template: `<span buiBadge [variant]="variant()" [tone]="tone()">New</span>`,
})
class TestHost {
  readonly variant = signal<BadgeVariant>('default');
  readonly tone = signal<BadgeTone | null>(null);
}

describe('BuiBadge', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLSpanElement>('span')!;
    return { fixture, el: element };
  }

  it('renders the default brand variant', () => {
    const { el } = setup();
    expect(el.dataset['slot']).toBe('badge');
    expect(el.className).toContain('bg-primary');
  });

  it('applies a semantic tone with soft intensity by default', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.tone.set('success');
    fixture.detectChanges();
    expect(el.className).toContain('text-success');
    expect(el.className).toContain('bg-success/10');
  });

  it('uses solid intensity when variant=solid and a tone is set', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.tone.set('danger');
    fixture.componentInstance.variant.set('solid');
    fixture.detectChanges();
    expect(el.className).toContain('bg-destructive');
    expect(el.className).toContain('text-destructive-foreground');
  });
});

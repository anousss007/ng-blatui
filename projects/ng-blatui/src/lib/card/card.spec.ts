import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiCard,
  BuiCardContent,
  BuiCardDescription,
  BuiCardHeader,
  BuiCardTitle,
  type CardVariant,
} from './card';

@Component({
  imports: [BuiCard, BuiCardHeader, BuiCardTitle, BuiCardDescription, BuiCardContent],
  template: `
    <div buiCard [variant]="variant()">
      <div buiCardHeader>
        <h3 buiCardTitle>Title</h3>
        <p buiCardDescription>Description</p>
      </div>
      <div buiCardContent>Content</div>
    </div>
  `,
})
class TestHost {
  readonly variant = signal<CardVariant>('default');
}

describe('BuiCard', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return { fixture, root };
  }

  it('renders the default padded variant and wires sub-part data-slots', () => {
    const { root } = setup();
    const card = root.querySelector<HTMLDivElement>('[data-slot="card"]')!;
    expect(card.classList.contains('p-6')).toBe(true);
    expect(root.querySelector('[data-slot="card-title"]')?.textContent).toContain('Title');
    expect(root.querySelector('[data-slot="card-description"]')).not.toBeNull();
  });

  it('switches to the sectioned variant', () => {
    const { fixture, root } = setup();
    fixture.componentInstance.variant.set('sectioned');
    fixture.detectChanges();
    const card = root.querySelector<HTMLDivElement>('[data-slot="card"]')!;
    expect(card.classList.contains('py-6')).toBe(true);
    expect(card.classList.contains('p-6')).toBe(false);
  });
});

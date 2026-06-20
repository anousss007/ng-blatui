import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { type AlertTone, BuiAlert, BuiAlertDescription, BuiAlertTitle } from './alert';

@Component({
  imports: [BuiAlert, BuiAlertTitle, BuiAlertDescription],
  template: `
    <div buiAlert [tone]="tone()">
      <h5 buiAlertTitle>Heads up</h5>
      <div buiAlertDescription>Something happened.</div>
    </div>
  `,
})
class TestHost {
  readonly tone = signal<AlertTone | null>(null);
}

describe('BuiAlert', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLDivElement>('[data-slot="alert"]')!;
    return { fixture, root, el: element };
  }

  it('exposes role=alert and the default brand variant', () => {
    const { el, root } = setup();
    expect(el.getAttribute('role')).toBe('alert');
    expect(el.className).toContain('bg-card');
    expect(root.querySelector('[data-slot="alert-title"]')).not.toBeNull();
    expect(root.querySelector('[data-slot="alert-description"]')).not.toBeNull();
  });

  it('applies a semantic tone', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.tone.set('success');
    fixture.detectChanges();
    expect(el.className).toContain('text-success');
    expect(el.className).toContain('bg-success/10');
  });
});

import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAvatar } from './avatar';

@Component({
  imports: [BuiAvatar],
  template: `<bui-avatar [src]="src()" alt="User">AB</bui-avatar>`,
})
class TestHost {
  readonly src = signal<string | null>(null);
}

describe('BuiAvatar', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const element = root.querySelector<HTMLElement>('bui-avatar')!;
    return { fixture, el: element };
  }

  it('shows the fallback when there is no src', () => {
    const { el } = setup();
    expect(el.querySelector('[data-slot="avatar-fallback"]')?.textContent).toContain('AB');
    expect(el.querySelector('[data-slot="avatar-image"]')).toBeNull();
  });

  it('shows the image for a src and falls back on load error', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.src.set('https://example.com/a.png');
    fixture.detectChanges();
    const img = el.querySelector<HTMLImageElement>('[data-slot="avatar-image"]')!;
    expect(img).not.toBeNull();
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(el.querySelector('[data-slot="avatar-image"]')).toBeNull();
    expect(el.querySelector('[data-slot="avatar-fallback"]')).not.toBeNull();
  });
});

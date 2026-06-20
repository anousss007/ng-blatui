import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiVideo } from './video';

@Component({
  imports: [BuiVideo],
  template: `<bui-video src="/clip.mp4" poster="/poster.jpg" />`,
})
class TestHost {}

describe('BuiVideo', () => {
  it('shows a play facade until started', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('video')?.getAttribute('src')).toBe('/clip.mp4');
    const play = root.querySelector<HTMLButtonElement>('button[aria-label="Play video"]')!;
    expect(play).not.toBeNull();

    play.click();
    fixture.detectChanges();
    expect(root.querySelector('button[aria-label="Play video"]')).toBeNull();
  });
});

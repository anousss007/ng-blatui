import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiAudioPlayer } from './audio-player';

@Component({
  imports: [BuiAudioPlayer],
  template: `<bui-audio-player src="/song.mp3" title="Nightfall" artist="The Band" />`,
})
class TestHost {}

describe('BuiAudioPlayer', () => {
  it('renders the audio element and play control', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('audio')?.getAttribute('src')).toBe('/song.mp3');
    expect(root.querySelector('button[aria-label="Play"]')).not.toBeNull();
    expect(root.textContent).toContain('Nightfall');
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiMap } from './map';

@Component({
  imports: [BuiMap],
  template: `<bui-map [lat]="48.8584" [lon]="2.2945" label="Eiffel Tower" />`,
})
class TestHost {}

describe('BuiMap', () => {
  it('renders an OSM iframe and a larger-map link', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const iframe = root.querySelector('iframe')!;
    expect(iframe.getAttribute('title')).toBe('Eiffel Tower');
    const link = root.querySelector('a')!;
    expect(link.getAttribute('href')).toContain('openstreetmap.org/?mlat=48.8584');
  });
});

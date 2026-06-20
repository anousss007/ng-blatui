import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiFlipCard } from './flip-card';

@Component({
  imports: [BuiFlipCard],
  template: `
    <bui-flip-card>
      <span>Front face</span>
      <div buiFlipBack>Back face</div>
    </bui-flip-card>
  `,
})
class TestHost {}

describe('BuiFlipCard', () => {
  it('projects front and back faces', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-slot="flip-card-front"]')?.textContent).toContain(
      'Front face',
    );
    expect(element.querySelector('[data-slot="flip-card-back"]')?.textContent).toContain(
      'Back face',
    );
  });
});

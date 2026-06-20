import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiTypewriter } from './typewriter';

@Component({
  imports: [BuiTypewriter],
  template: `<bui-typewriter [words]="['Design', 'Build', 'Ship']" />`,
})
class TestHost {}

describe('BuiTypewriter', () => {
  it('exposes the full word list to assistive tech', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const srOnly = (fixture.nativeElement as HTMLElement).querySelector('.sr-only');
    expect(srOnly?.textContent).toContain('Design');
    expect(srOnly?.textContent).toContain('Ship');
    fixture.destroy();
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiBottomNavigation } from './bottom-navigation';
import { BuiBottomNavigationItem } from './bottom-navigation-item';

@Component({
  imports: [BuiBottomNavigation, BuiBottomNavigationItem],
  template: `
    <nav buiBottomNavigation>
      <a buiBottomNavItem href="#home" label="Home" [active]="true">H</a>
      <a buiBottomNavItem href="#alerts" label="Alerts" [badge]="3">A</a>
    </nav>
  `,
})
class TestHost {}

describe('BuiBottomNavigation', () => {
  it('marks the active item and renders a badge', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[data-slot="bottom-navigation"]')).not.toBeNull();
    const items = root.querySelectorAll('[data-slot="bottom-navigation-item"]');
    expect(items[0].getAttribute('aria-current')).toBe('page');
    expect(items[0].textContent).toContain('Home');
    expect(items[1].textContent).toContain('3');
  });
});

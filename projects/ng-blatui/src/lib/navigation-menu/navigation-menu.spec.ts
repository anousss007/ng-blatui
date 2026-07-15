import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiNavigationMenu, type NavMenuItem } from './navigation-menu';

@Component({
  imports: [BuiNavigationMenu],
  template: `<bui-navigation-menu [items]="items" />`,
})
class TestHost {
  readonly items: NavMenuItem[] = [
    { label: 'Products', links: [{ label: 'Web' }, { label: 'Mobile' }] },
    { label: 'Pricing', href: '/pricing' },
  ];
}

describe('BuiNavigationMenu', () => {
  it('opens a dropdown panel on hover', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('a')).toHaveLength(1); // only the plain "Pricing" link

    const trigger = root.querySelector('li')!;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    // The dropdown panel opens in a CDK overlay (attached to the document), not inside the host.
    const panelLinks = document.querySelectorAll('.cdk-overlay-container a');
    expect(panelLinks.length).toBeGreaterThanOrEqual(2); // Web + Mobile
  });
});

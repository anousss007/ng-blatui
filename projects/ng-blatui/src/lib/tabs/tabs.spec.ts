import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiTabList,
  BuiTabPanel,
  BuiTabs,
  BuiTabTrigger,
  Tab,
  TabContent,
  TabList,
  TabPanel,
  Tabs,
} from './tabs';

@Component({
  imports: [
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabContent,
    BuiTabs,
    BuiTabList,
    BuiTabTrigger,
    BuiTabPanel,
  ],
  template: `
    <div ngTabs buiTabs>
      <div ngTabList buiTabList selectedTab="a">
        <div ngTab value="a" buiTabTrigger>Tab A</div>
        <div ngTab value="b" buiTabTrigger>Tab B</div>
      </div>
      <div ngTabPanel value="a" buiTabPanel>
        <ng-template ngTabContent>Panel A content</ng-template>
      </div>
      <div ngTabPanel value="b" buiTabPanel>
        <ng-template ngTabContent>Panel B content</ng-template>
      </div>
    </div>
  `,
})
class TestHost {}

describe('BuiTabs (on Angular Aria)', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const tabs = root.querySelectorAll<HTMLElement>('[role="tab"]');
    return { fixture, root, tabs };
  }

  it('wires roles, selection and the first panel content', () => {
    const { root, tabs } = setup();
    expect(root.querySelector('[role="tablist"]')).not.toBeNull();
    expect(tabs).toHaveLength(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(root.textContent).toContain('Panel A content');
  });

  it('selects another tab on click and swaps the panel', () => {
    const { fixture, root, tabs } = setup();
    tabs[1].click();
    fixture.detectChanges();
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(root.textContent).toContain('Panel B content');
  });
});

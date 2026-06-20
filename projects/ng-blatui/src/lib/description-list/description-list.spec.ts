import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDescriptionItem } from './description-item';
import { BuiDescriptionList } from './description-list';

@Component({
  imports: [BuiDescriptionList, BuiDescriptionItem],
  template: `
    <dl buiDescriptionList>
      <bui-description-item term="Name">Ada Lovelace</bui-description-item>
    </dl>
  `,
})
class TestHost {}

describe('BuiDescriptionList', () => {
  it('renders term/description rows', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('dt')?.textContent).toContain('Name');
    expect(element.querySelector('dd')?.textContent).toContain('Ada Lovelace');
  });
});

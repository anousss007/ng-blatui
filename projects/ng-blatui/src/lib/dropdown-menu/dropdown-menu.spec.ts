import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiDropdownMenu, BuiDropdownMenuItem, Menu, MenuItem, MenuTrigger } from './dropdown-menu';

@Component({
  imports: [Menu, MenuItem, MenuTrigger, BuiDropdownMenu, BuiDropdownMenuItem],
  template: `
    <div class="relative inline-block">
      <button ngMenuTrigger [menu]="m">Open</button>
      <div ngMenu #m="ngMenu" buiDropdownMenu>
        <div ngMenuItem value="edit" buiDropdownMenuItem>Edit</div>
        <div ngMenuItem value="delete" buiDropdownMenuItem>Delete</div>
      </div>
    </div>
  `,
})
class TestHost {}

describe('DropdownMenu (on Angular Aria)', () => {
  it('wires menu/menuitem roles and a popup trigger', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[role="menu"]')).not.toBeNull();
    expect(element.querySelectorAll('[role="menuitem"]')).toHaveLength(2);
    expect(element.querySelector('button')?.getAttribute('aria-haspopup')).toBeTruthy();
  });
});

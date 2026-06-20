import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiDropdownMenu,
  BuiDropdownMenuItem,
  Menu,
  MenuBar,
  MenuItem,
  MenuTrigger,
} from '../dropdown-menu/dropdown-menu';

import { BuiMenubar, BuiMenubarTrigger } from './menubar';

@Component({
  imports: [
    MenuBar,
    Menu,
    MenuItem,
    MenuTrigger,
    BuiMenubar,
    BuiMenubarTrigger,
    BuiDropdownMenu,
    BuiDropdownMenuItem,
  ],
  template: `
    <div ngMenuBar buiMenubar>
      <button ngMenuTrigger [menu]="file" buiMenubarTrigger>File</button>
      <div ngMenu #file="ngMenu" buiDropdownMenu>
        <div ngMenuItem value="new" buiDropdownMenuItem>New</div>
      </div>
    </div>
  `,
})
class TestHost {}

describe('Menubar (on Angular Aria)', () => {
  it('exposes role=menubar with a popup trigger', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[role="menubar"]')).not.toBeNull();
    expect(element.querySelector('button')?.getAttribute('aria-haspopup')).toBeTruthy();
  });
});

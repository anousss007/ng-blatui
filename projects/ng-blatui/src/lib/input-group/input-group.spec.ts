import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiInputGroup,
  BuiInputGroupAddon,
  BuiInputGroupButton,
  BuiInputGroupInput,
  BuiInputGroupText,
} from './input-group';

@Component({
  imports: [
    BuiInputGroup,
    BuiInputGroupAddon,
    BuiInputGroupInput,
    BuiInputGroupButton,
    BuiInputGroupText,
  ],
  template: `
    <div buiInputGroup>
      <div buiInputGroupAddon align="inline-start"><span buiInputGroupText>&#64;</span></div>
      <input buiInputGroupInput placeholder="username" />
      <div buiInputGroupAddon align="inline-end">
        <button buiInputGroupButton size="xs">Go</button>
      </div>
    </div>
  `,
})
class TestHost {}

describe('InputGroup', () => {
  it('composes a group with aligned addons, control and button', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-slot="input-group"]')?.getAttribute('role')).toBe('group');
    const addons = element.querySelectorAll('[data-slot="input-group-addon"]');
    expect(addons[0].getAttribute('data-align')).toBe('inline-start');
    expect(addons[1].getAttribute('data-align')).toBe('inline-end');
    expect(element.querySelector('[data-slot="input-group-control"]')).not.toBeNull();
    expect(element.querySelector('[data-slot="input-group-button"]')?.getAttribute('type')).toBe(
      'button',
    );
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiField, BuiFieldError, BuiFieldLabel } from './field';

@Component({
  imports: [BuiField, BuiFieldLabel, BuiFieldError],
  template: `
    <div buiField orientation="horizontal">
      <label buiFieldLabel for="n">Name</label>
      <div buiFieldError>Required</div>
    </div>
  `,
})
class TestHost {}

describe('Field', () => {
  it('is a group with orientation and an alert error', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const field = element.querySelector('[data-slot="field"]')!;
    expect(field.getAttribute('role')).toBe('group');
    expect(field.getAttribute('data-orientation')).toBe('horizontal');
    expect(element.querySelector('[data-slot="field-label"]')?.getAttribute('for')).toBe('n');
    expect(element.querySelector('[data-slot="field-error"]')?.getAttribute('role')).toBe('alert');
  });
});

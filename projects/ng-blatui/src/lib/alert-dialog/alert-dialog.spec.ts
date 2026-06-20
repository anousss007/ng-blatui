import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiAlertDialogAction,
  BuiAlertDialogCancel,
  BuiAlertDialogContent,
  BuiAlertDialogDescription,
  BuiAlertDialogFooter,
  BuiAlertDialogTitle,
} from './alert-dialog';

@Component({
  imports: [
    BuiAlertDialogContent,
    BuiAlertDialogTitle,
    BuiAlertDialogDescription,
    BuiAlertDialogFooter,
    BuiAlertDialogAction,
    BuiAlertDialogCancel,
  ],
  template: `
    <div buiAlertDialogContent>
      <h2 buiAlertDialogTitle>Delete project?</h2>
      <p buiAlertDialogDescription>This cannot be undone.</p>
      <div buiAlertDialogFooter>
        <button buiAlertDialogCancel>Cancel</button>
        <button buiAlertDialogAction>Delete</button>
      </div>
    </div>
  `,
})
class TestHost {}

describe('AlertDialog', () => {
  it('uses role=alertdialog and styled action/cancel buttons', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-slot="alert-dialog-content"]')?.getAttribute('role')).toBe(
      'alertdialog',
    );
    expect(element.querySelector('[data-slot="alert-dialog-action"]')?.className).toContain(
      'bg-primary',
    );
    expect(element.querySelector('[data-slot="alert-dialog-cancel"]')?.className).toContain(
      'border',
    );
  });
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiSonner, BuiToaster } from './sonner';

@Component({
  imports: [BuiSonner],
  template: `<bui-sonner />`,
})
class TestHost {}

describe('BuiSonner', () => {
  it('renders toasts from the toaster store and dismisses them', () => {
    const fixture = TestBed.createComponent(TestHost);
    const toaster = TestBed.inject(BuiToaster);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('[role="status"]')).toHaveLength(0);

    const id = toaster.show({ title: 'Saved', description: 'All good', duration: 0 });
    fixture.detectChanges();
    expect(root.querySelectorAll('[role="status"]')).toHaveLength(1);
    expect(root.textContent).toContain('Saved');

    toaster.dismiss(id);
    fixture.detectChanges();
    expect(root.querySelectorAll('[role="status"]')).toHaveLength(0);
  });
});

import { Component, inject, type TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  BuiDialogContent,
  BuiDialogTitle,
  Dialog,
  type DialogRef as DialogReference,
} from './dialog';

@Component({
  imports: [BuiDialogContent, BuiDialogTitle],
  template: `
    <ng-template #tpl>
      <div buiDialogContent>
        <h2 buiDialogTitle>Dialog title</h2>
        <p>Dialog body</p>
      </div>
    </ng-template>
  `,
})
class TestHost {
  private readonly dialog = inject(Dialog);
  readonly tpl = viewChild.required<TemplateRef<unknown>>('tpl');
  ref?: DialogReference;

  open(): void {
    this.ref = this.dialog.open(this.tpl(), { ariaModal: true });
  }
}

describe('BuiDialog (on Angular CDK)', () => {
  it('opens an accessible CDK overlay and renders styled content', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();

    fixture.componentInstance.open();
    fixture.detectChanges();

    const container = document.querySelector('cdk-dialog-container');
    expect(container?.getAttribute('role')).toBe('dialog');
    expect(container?.getAttribute('aria-modal')).toBe('true');

    const content = document.querySelector('[data-slot="dialog-content"]');
    expect(content).not.toBeNull();
    expect(content?.textContent).toContain('Dialog title');
    expect(content?.classList.contains('rounded-lg')).toBe(true);

    fixture.componentInstance.ref?.close();
    fixture.detectChanges();
    expect(document.querySelector('cdk-dialog-container')).toBeNull();
  });
});

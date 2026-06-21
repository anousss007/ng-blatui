import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiFileUpload } from './file-upload';

@Component({
  imports: [BuiFileUpload],
  template: `<bui-file-upload hint="PNG up to 2MB" (filesChange)="count = $event.length" />`,
})
class TestHost {
  count = 0;
}

describe('BuiFileUpload', () => {
  it('lists a selected file and emits the change', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('PNG up to 2MB');

    const input = root.querySelector<HTMLInputElement>('input[type="file"]')!;
    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.count).toBe(1);
    expect(root.textContent).toContain('notes.txt');
  });
});

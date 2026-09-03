import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiFileUpload, type BuiFileUploadRemoval, type BuiFileUploadSource } from './file-upload';

@Component({
  imports: [BuiFileUpload],
  template: `<bui-file-upload hint="PNG up to 2MB" (filesChange)="count = $event.length" />`,
})
class TestHost {
  count = 0;
}

@Component({
  imports: [BuiFileUpload],
  template: `<bui-file-upload [value]="value()" (fileRemove)="removed = $event" />`,
})
class StoredHost {
  readonly value = signal<BuiFileUploadSource>([
    { url: '/uploads/avatar.png', name: 'avatar.png', size: 2048 },
    '/uploads/contract.pdf',
  ]);
  removed: BuiFileUploadRemoval | null = null;
}

/** A drop carrying `files`; jsdom has no `DataTransfer` to build a real one with. */
function dropEvent(files: readonly File[]): DragEvent {
  const event = new Event('drop', { bubbles: true }) as DragEvent;
  Object.defineProperty(event, 'dataTransfer', { value: { files }, configurable: true });
  return event;
}

describe('BuiFileUpload', () => {
  function pick(root: HTMLElement, files: readonly File[]): void {
    const input = root.querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(input, 'files', { value: files, configurable: true });
    input.dispatchEvent(new Event('change'));
  }

  it('lists a selected file and emits the change', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('PNG up to 2MB');

    pick(root, [new File(['hello'], 'notes.txt', { type: 'text/plain' })]);
    fixture.detectChanges();

    expect(fixture.componentInstance.count).toBe(1);
    expect(root.textContent).toContain('notes.txt');
  });

  it('takes a file dropped on the zone', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const zone = root.querySelector<HTMLElement>('label')!;

    // Without a prevented default on dragover the drop never fires at all and the browser
    // navigates to the file: the zone said "drag & drop" and did nothing of the kind.
    const dragover = new Event('dragover', { bubbles: true, cancelable: true });
    zone.dispatchEvent(dragover);
    expect(dragover.defaultPrevented).toBe(true);

    zone.dispatchEvent(dropEvent([new File(['x'], 'dropped.pdf', { type: 'application/pdf' })]));
    fixture.detectChanges();

    expect(fixture.componentInstance.count).toBe(1);
    expect(root.textContent).toContain('dropped.pdf');
  });

  it('replaces the selection in a single-file field', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    pick(root, [new File(['a'], 'first.txt')]);
    fixture.detectChanges();
    pick(root, [new File(['b'], 'second.txt')]);
    fixture.detectChanges();

    expect(root.querySelectorAll('li')).toHaveLength(1);
    expect(root.textContent).toContain('second.txt');
    expect(root.textContent).not.toContain('first.txt');
  });

  it('drops a removed file from the list', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    pick(root, [new File(['a'], 'notes.txt')]);
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('li button')!.click();
    fixture.detectChanges();

    expect(root.querySelectorAll('li')).toHaveLength(0);
    expect(fixture.componentInstance.count).toBe(0);
  });

  it('renders the files the record already holds', () => {
    const fixture = TestBed.createComponent(StoredHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    const rows = root.querySelectorAll('li');
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('avatar.png');
    expect(rows[0].textContent).toContain('2.0 KB');
    // An image is a thumbnail; the name of a URL with no name of its own is its last segment.
    expect(rows[0].querySelector('img')?.getAttribute('src')).toBe('/uploads/avatar.png');
    expect(rows[1].textContent).toContain('contract.pdf');
    expect(rows[1].querySelector('img')).toBeNull();
  });

  it('reports a stored file being removed instead of withdrawing it', () => {
    const fixture = TestBed.createComponent(StoredHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;

    root.querySelector<HTMLButtonElement>('li button')!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.removed).toEqual({
      url: '/uploads/avatar.png',
      name: 'avatar.png',
    });
    expect(root.querySelectorAll('li')).toHaveLength(1);

    // A new answer from the record supersedes the dismissal made against the old one.
    fixture.componentInstance.value.set(['/uploads/avatar.png']);
    fixture.detectChanges();
    expect(root.querySelectorAll('li')).toHaveLength(1);
    expect(root.textContent).toContain('avatar.png');
  });
});

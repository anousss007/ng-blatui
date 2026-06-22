import { Component, computed, input, output, signal } from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** A drag-and-drop file upload zone with a selected-files list. */
@Component({
  selector: 'bui-file-upload',
  host: { 'data-slot': 'file-upload', '[class]': 'computedClass()' },
  template: `
    <label [class]="zoneClass()">
      <input
        type="file"
        class="sr-only"
        [multiple]="multiple()"
        [attr.accept]="accept() || null"
        [attr.name]="name() || null"
        [disabled]="disabled()"
        (change)="onChange($event)"
      />
      <svg
        class="size-7 text-muted-foreground"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
      <span class="text-sm font-medium">{{ dropzoneText() }}</span>
      @if (hint()) {
        <span class="text-xs text-muted-foreground">{{ hint() }}</span>
      }
    </label>
    @if (files().length > 0) {
      <ul class="mt-3 space-y-2">
        @for (file of files(); track file.name) {
          <li class="flex items-center gap-2 rounded-md border p-2 text-sm">
            <svg
              class="size-4 shrink-0 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            <span class="truncate">{{ file.name }}</span>
            <span class="ms-auto shrink-0 text-xs text-muted-foreground">{{
              size(file.size)
            }}</span>
            <button
              type="button"
              class="rounded-sm p-1 hover:bg-accent"
              [attr.aria-label]="removeText()"
              (click)="remove(file)"
            >
              <svg
                class="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </li>
        }
      </ul>
    }
  `,
})
export class BuiFileUpload {
  readonly multiple = input(false);
  readonly accept = input('');
  readonly name = input('');
  readonly hint = input('');
  readonly disabled = input(false);
  readonly filesChange = output<readonly File[]>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  readonly dropzoneLabel = input<string>();
  readonly removeLabel = input<string>();

  protected readonly dropzoneText = buiLabel('fileUploadDropzone', this.dropzoneLabel);
  protected readonly removeText = buiLabel('fileUploadRemove', this.removeLabel);

  protected readonly dragging = signal(false);
  protected readonly files = signal<readonly File[]>([]);
  protected readonly computedClass = computed(() => cn('block', this.userClass()));
  protected readonly zoneClass = computed(() =>
    cn(
      'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center transition-colors',
      this.dragging() ? 'border-ring bg-accent/40' : 'border-input hover:bg-accent/40',
    ),
  );

  protected size(bytes: number): string {
    return formatSize(bytes);
  }

  protected onChange(event: Event): void {
    const list = (event.target as HTMLInputElement).files;
    if (list) {
      this.add([...list]);
    }
  }

  protected remove(file: File): void {
    this.files.set(this.files().filter((existing) => existing !== file));
    this.filesChange.emit(this.files());
  }

  private add(incoming: File[]): void {
    const next = this.multiple() ? [...this.files(), ...incoming] : incoming;
    this.files.set(next);
    this.filesChange.emit(next);
  }
}

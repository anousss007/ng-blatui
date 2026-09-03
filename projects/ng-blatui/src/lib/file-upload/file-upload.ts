import {
  Component,
  computed,
  type ElementRef,
  input,
  linkedSignal,
  type OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

/**
 * A file the consumer's record already holds — an avatar, a logo, an attachment saved last week.
 * It is the field's *current value*, which is the one thing a file input cannot express: the
 * native control carries what is being picked now, never what was picked before.
 */
export interface BuiFileUploadValue {
  /** Where the stored file lives. Doubles as the thumbnail source for an image. */
  url: string;
  /** Row label. Defaults to the last path segment of `url`. */
  name?: string;
  /** Size in bytes, when the record knows it. A row without one shows no size. */
  size?: number;
  /** Render `url` as a thumbnail. Inferred from the extension when left unset. */
  image?: boolean;
}

/** Everything `value` accepts: one URL, one descriptor, or a list of either. */
export type BuiFileUploadSource =
  | string
  | BuiFileUploadValue
  | readonly (string | BuiFileUploadValue)[]
  | null;

/** What {@link BuiFileUpload.fileRemove} reports when a stored file's row is removed. */
export interface BuiFileUploadRemoval {
  /** The `url` of the row that was removed. */
  url: string;
  /** The name that row was showing. */
  name: string;
}

/** One line in the list, whether it came from `value` or from the picker. */
type UploadRow = {
  key: string;
  name: string;
  /** Bytes, or null when the row is a stored file whose size the record did not carry. */
  size: number | null;
  /** Image source for the preview, or null to draw the generic file icon. */
  thumbnail: string | null;
} & (
  | { /** The picked file this row stands for. */ file: File; url: null }
  | { file: null; /** Where the stored file lives. */ url: string }
);

const IMAGE_URL = /\.(?:png|jpe?g|gif|webp|avif|svg|bmp|ico)(?:[#?]|$)/i;

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** The last path segment of a URL, which is the best guess at a file's name. */
function nameFromUrl(url: string): string {
  const path = url.split(/[#?]/, 1)[0];
  const segment = path.split('/').pop() ?? path;
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function isDescriptor(value: BuiFileUploadValue | readonly unknown[]): value is BuiFileUploadValue {
  return 'url' in value;
}

/** Flatten everything `value` accepts into descriptors, dropping the empties. */
function toValues(source: BuiFileUploadSource): BuiFileUploadValue[] {
  if (source === null) {
    return [];
  }
  if (typeof source === 'string') {
    return source === '' ? [] : [{ url: source }];
  }
  if (isDescriptor(source)) {
    return source.url === '' ? [] : [source];
  }
  return source
    .map((item) => (typeof item === 'string' ? { url: item } : item))
    .filter((item) => item.url !== '');
}

/**
 * A drag-and-drop file upload zone with a selected-files list.
 *
 * Files reach it three ways and all three behave the same: the picker, a drop onto the zone, and
 * `value` — the file the record already holds, which becomes an ordinary row so an edit form does
 * not have to rebuild that preview by hand. The native `<input type="file">` is kept in step with
 * the list, so what a plain `<form>` submits is what is on screen, and a file that was removed can
 * be picked again.
 */
@Component({
  selector: 'bui-file-upload',
  host: { 'data-slot': 'file-upload', '[class]': 'computedClass()' },
  template: `
    <label
      [class]="zoneClass()"
      (dragenter)="onDragOver($event)"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <input
        #fileInput
        type="file"
        class="sr-only"
        [multiple]="multiple()"
        [attr.accept]="accept() || null"
        [attr.name]="name() || null"
        [disabled]="disabled()"
        (change)="onPicked()"
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
    @if (rows().length > 0) {
      <ul class="mt-3 space-y-2">
        @for (row of rows(); track row.key) {
          <li class="flex items-center gap-2 rounded-md border p-2 text-sm">
            @if (row.thumbnail) {
              <img
                [src]="row.thumbnail"
                alt=""
                class="size-8 shrink-0 rounded object-cover"
                loading="lazy"
              />
            } @else {
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
            }
            <span class="truncate">{{ row.name }}</span>
            <span class="ms-auto shrink-0 text-xs text-muted-foreground">{{
              row.size === null ? '' : size(row.size)
            }}</span>
            <button
              type="button"
              class="rounded-sm p-1 hover:bg-accent"
              [attr.aria-label]="removeText()"
              (click)="remove(row)"
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
export class BuiFileUpload implements OnDestroy {
  /** Whether multiple files can be selected and accumulated. */
  readonly multiple = input(false);
  /** Comma-separated list of accepted file types (the `accept` attribute). */
  readonly accept = input('');
  /** Native `name` attribute for the file input. */
  readonly name = input('');
  /** Optional helper text shown under the dropzone label. */
  readonly hint = input('');
  /** Whether the upload zone is disabled. */
  readonly disabled = input(false);
  /**
   * The file(s) the record already holds — a URL, a list of URLs, or
   * {@link BuiFileUploadValue} descriptors. Each becomes an ordinary row: same thumbnail, same
   * name and size, same remove button. Removing one reports {@link fileRemove} rather than
   * withdrawing anything; the file belongs to your record, so dropping it from `value` is yours
   * to do.
   */
  readonly value = input<BuiFileUploadSource>(null);
  /** Emitted with the picked files whenever the selection changes. Stored files are not in it. */
  readonly filesChange = output<readonly File[]>();
  /** Emitted when the remove button on a row that came from `value` is pressed. */
  readonly fileRemove = output<BuiFileUploadRemoval>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  /** Custom dropzone prompt text. */
  readonly dropzoneLabel = input<string>();
  /** Custom accessible label for each remove button. */
  readonly removeLabel = input<string>();

  protected readonly dropzoneText = buiLabel('fileUploadDropzone', this.dropzoneLabel);
  protected readonly removeText = buiLabel('fileUploadRemove', this.removeLabel);

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  protected readonly dragging = signal(false);
  private readonly files = signal<readonly File[]>([]);
  /**
   * Rows from `value` the user has dismissed, so the list answers the click immediately while the
   * consumer decides what to do with `fileRemove`. A new `value` is a new answer from the record,
   * which supersedes every dismissal made against the old one.
   */
  private readonly dismissed = linkedSignal<BuiFileUploadSource, ReadonlySet<string>>({
    source: () => this.value(),
    computation: () => new Set<string>(),
  });
  /**
   * Object URLs backing the thumbnails of picked images. A plain `Map` rather than a signal: it
   * is rewritten inside `commit()` *before* the `files` signal that `rows` actually depends on,
   * so the recompute always reads it settled.
   */
  private readonly previews = new Map<File, string>();

  protected readonly rows = computed<readonly UploadRow[]>(() => {
    const dismissed = this.dismissed();
    const stored = toValues(this.value())
      .filter((item) => !dismissed.has(item.url))
      .map((item, index) => ({
        key: `stored:${index}:${item.url}`,
        name: item.name ?? nameFromUrl(item.url),
        size: item.size ?? null,
        thumbnail: (item.image ?? IMAGE_URL.test(item.url)) ? item.url : null,
        file: null,
        url: item.url,
      }));
    const picked = this.files().map((file, index) => ({
      key: `file:${index}:${file.name}:${file.size}`,
      name: file.name,
      size: file.size,
      thumbnail: this.previews.get(file) ?? null,
      file,
      url: null,
    }));
    return [...stored, ...picked];
  });
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

  protected onPicked(): void {
    const list = this.fileInput()?.nativeElement.files;
    this.receive([...(list ?? [])]);
  }

  protected onDragOver(event: DragEvent): void {
    if (this.disabled()) {
      return;
    }
    // Without preventing the default on dragover, the drop never fires and the browser navigates
    // to the file instead — which is what this zone did for its whole life before now.
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    // `dragleave` also fires on the way into a child (the icon, the prompt), so only a departure
    // that leaves the zone entirely counts.
    const zone = event.currentTarget as HTMLElement;
    const entering = event.relatedTarget as Node | null;
    if (entering === null || !zone.contains(entering)) {
      this.dragging.set(false);
    }
  }

  protected onDrop(event: DragEvent): void {
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    this.dragging.set(false);
    this.receive([...(event.dataTransfer?.files ?? [])]);
  }

  protected remove(row: UploadRow): void {
    if (row.file === null) {
      // A stored file belongs to the consumer's record; saying it went is the most we can do.
      this.dismissed.update((dismissed) => new Set(dismissed).add(row.url));
      this.fileRemove.emit({ url: row.url, name: row.name });
      return;
    }
    this.commit(this.files().filter((existing) => existing !== row.file));
  }

  /** Take a batch of incoming files, honouring what a single-file field can actually hold. */
  private receive(incoming: readonly File[]): void {
    if (incoming.length === 0) {
      return;
    }
    this.commit(this.multiple() ? [...this.files(), ...incoming] : incoming.slice(0, 1));
  }

  private commit(next: readonly File[]): void {
    for (const [file, url] of this.previews) {
      if (next.includes(file)) {
        continue;
      }
      URL.revokeObjectURL(url);
      this.previews.delete(file);
    }
    for (const file of next) {
      if (this.previews.has(file) || !file.type.startsWith('image/')) {
        continue;
      }
      this.previews.set(file, URL.createObjectURL(file));
    }
    this.syncInput(next);
    this.files.set(next);
    this.filesChange.emit(next);
  }

  /**
   * Keep the native input holding exactly the listed files. It is what a plain `<form>` submits,
   * and what the browser diffs the next pick against — leave a removed file in it and the form
   * still sends it, while re-picking that same file fires no `change` at all, so it can never
   * come back.
   */
  private syncInput(files: readonly File[]): void {
    const input = this.fileInput()?.nativeElement;
    // `DataTransfer` is the only way to write a `FileList`, and it exists only in a browser.
    if (!input || typeof DataTransfer === 'undefined') {
      return;
    }
    const transfer = new DataTransfer();
    for (const file of files) {
      transfer.items.add(file);
    }
    input.files = transfer.files;
  }

  ngOnDestroy(): void {
    for (const url of this.previews.values()) {
      URL.revokeObjectURL(url);
    }
    this.previews.clear();
  }
}

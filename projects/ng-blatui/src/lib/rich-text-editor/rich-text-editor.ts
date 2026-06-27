import {
  afterNextRender,
  Component,
  computed,
  type ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';

import { buiLabel } from '../i18n/labels';
import { type ClassValue, cn } from '../utils/cn';

interface Tool {
  cmd: string;
  label: string;
  text: string;
  cls: string;
}
const TOOLS: Tool[] = [
  { cmd: 'bold', label: 'Bold', text: 'B', cls: 'font-bold' },
  { cmd: 'italic', label: 'Italic', text: 'I', cls: 'italic' },
  { cmd: 'underline', label: 'Underline', text: 'U', cls: 'underline' },
  { cmd: 'strikeThrough', label: 'Strikethrough', text: 'S', cls: 'line-through' },
  { cmd: 'insertUnorderedList', label: 'Bullet list', text: '•', cls: '' },
  { cmd: 'insertOrderedList', label: 'Numbered list', text: '1.', cls: '' },
];

/** A contenteditable rich-text editor with a basic formatting toolbar. */
@Component({
  selector: 'bui-rich-text-editor',
  host: { 'data-slot': 'rich-text-editor', '[class]': 'computedClass()' },
  template: `
    <div
      role="toolbar"
      [attr.aria-label]="formattingText()"
      class="flex flex-wrap gap-0.5 border-b bg-muted/40 p-1"
    >
      @for (tool of tools; track tool.cmd) {
        <button
          type="button"
          class="size-8 rounded text-sm hover:bg-accent"
          [class]="tool.cls"
          [attr.aria-label]="tool.label"
          [title]="tool.label"
          (mousedown)="exec($event, tool.cmd)"
        >
          {{ tool.text }}
        </button>
      }
    </div>
    <div
      #editor
      role="textbox"
      aria-multiline="true"
      [attr.aria-label]="ariaLabel()"
      [attr.data-placeholder]="placeholder()"
      contenteditable="true"
      class="min-h-32 p-3 text-sm text-foreground outline-none empty:before:text-muted-foreground/60 empty:before:content-[attr(data-placeholder)] [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6"
      (input)="sync()"
    ></div>
  `,
})
export class BuiRichTextEditor {
  /** Editor contents as HTML. Two-way bindable with `[(value)]`. */
  readonly value = model('');
  /** Placeholder text shown while the editor is empty. */
  readonly placeholder = input('Write something…');
  /** Accessible label for the editable region. */
  readonly ariaLabel = input('Rich text editor');
  /** Accessible label override for the formatting toolbar. */
  readonly formattingLabel = input<string>();
  /** Name attribute associated with the editor for form submission. */
  readonly name = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly formattingText = buiLabel('richTextEditorFormatting', this.formattingLabel);

  protected readonly tools = TOOLS;
  private readonly editor = viewChild<ElementRef<HTMLElement>>('editor');
  protected readonly computedClass = computed(() =>
    cn('block overflow-hidden rounded-lg border', this.userClass()),
  );

  constructor() {
    afterNextRender(() => {
      const element = this.editor()?.nativeElement;
      if (element && this.value() !== '') {
        element.innerHTML = this.value();
      }
    });
  }

  protected exec(event: Event, command: string): void {
    event.preventDefault();
    /* eslint-disable @typescript-eslint/no-deprecated, sonarjs/deprecation -- execCommand is the pragmatic contenteditable formatting API */
    if (typeof document.execCommand === 'function') {
      document.execCommand(command, false);
      this.sync();
    }
    /* eslint-enable @typescript-eslint/no-deprecated, sonarjs/deprecation */
  }

  protected sync(): void {
    const element = this.editor()?.nativeElement;
    if (!element) {
      return;
    }
    // Browsers leave residual markup (e.g. `<p><br></p>`) after the user clears
    // all text, which keeps `:empty` from matching so the placeholder never
    // reappears. Normalise truly-empty content so the placeholder can show again.
    if (element.textContent === '' && !element.querySelector('img, hr')) {
      element.innerHTML = '';
    }
    this.value.set(element.innerHTML);
  }
}

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
      class="min-h-32 p-3 text-sm text-foreground text-muted-foreground/60 outline-none empty:before:content-[attr(data-placeholder)]"
      (input)="sync()"
    ></div>
  `,
})
export class BuiRichTextEditor {
  readonly value = model('');
  readonly placeholder = input('Write something…');
  readonly ariaLabel = input('Rich text editor');
  readonly formattingLabel = input<string>();
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
    if (element) {
      this.value.set(element.innerHTML);
    }
  }
}

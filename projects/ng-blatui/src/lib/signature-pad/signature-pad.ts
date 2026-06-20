import {
  afterNextRender,
  Component,
  computed,
  type ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

interface Point {
  x: number;
  y: number;
}

/** A canvas signature pad with draw, undo and clear. SSR-safe (canvas set up in the browser). */
@Component({
  selector: 'bui-signature-pad',
  host: { 'data-slot': 'signature-pad', '[class]': 'computedClass()' },
  template: `
    <canvas
      #cv
      [height]="height()"
      class="w-full touch-none rounded-md border bg-background"
      (pointerdown)="start($event)"
      (pointermove)="move($event)"
      (pointerup)="end()"
      (pointerleave)="end()"
    ></canvas>
    <div class="mt-2 flex gap-2">
      <button
        type="button"
        class="inline-flex h-8 items-center rounded-md border border-input px-3 text-sm hover:bg-accent disabled:opacity-50"
        [disabled]="empty()"
        (click)="undo()"
      >
        Undo
      </button>
      <button
        type="button"
        class="inline-flex h-8 items-center rounded-md border border-input px-3 text-sm hover:bg-accent disabled:opacity-50"
        [disabled]="empty()"
        (click)="clear()"
      >
        Clear
      </button>
    </div>
  `,
})
export class BuiSignaturePad {
  readonly height = input(200);
  readonly penColor = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly cv = viewChild<ElementRef<HTMLCanvasElement>>('cv');
  private context: CanvasRenderingContext2D | null = null;
  private readonly strokes: Point[][] = [];
  private currentStroke: Point[] = [];
  private drawing = false;
  protected readonly empty = signal(true);
  protected readonly computedClass = computed(() => cn('block w-full', this.userClass()));

  constructor() {
    afterNextRender(() => {
      const canvas = this.cv()?.nativeElement;
      if (!canvas) {
        return;
      }
      canvas.width = canvas.offsetWidth || 400;
      this.context = canvas.getContext('2d');
      this.redraw();
    });
  }

  protected start(event: PointerEvent): void {
    this.drawing = true;
    this.currentStroke = [this.pointFrom(event)];
  }

  protected move(event: PointerEvent): void {
    if (!this.drawing) {
      return;
    }
    this.currentStroke.push(this.pointFrom(event));
    this.redraw();
  }

  protected end(): void {
    if (!this.drawing) {
      return;
    }
    this.drawing = false;
    if (this.currentStroke.length > 1) {
      this.strokes.push(this.currentStroke);
      this.empty.set(false);
    }
    this.currentStroke = [];
  }

  protected undo(): void {
    this.strokes.pop();
    this.empty.set(this.strokes.length === 0);
    this.redraw();
  }

  protected clear(): void {
    this.strokes.length = 0;
    this.currentStroke = [];
    this.empty.set(true);
    this.redraw();
  }

  private pointFrom(event: PointerEvent): Point {
    const canvas = this.cv()?.nativeElement;
    const rect = canvas?.getBoundingClientRect();
    return { x: event.clientX - (rect?.left ?? 0), y: event.clientY - (rect?.top ?? 0) };
  }

  private redraw(): void {
    const canvas = this.cv()?.nativeElement;
    const context = this.context;
    if (!canvas || !context) {
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = this.penColor() || 'currentColor';
    for (const stroke of [...this.strokes, this.currentStroke]) {
      if (stroke.length < 2) {
        continue;
      }
      context.beginPath();
      const [first, ...rest] = stroke;
      context.moveTo(first.x, first.y);
      for (const point of rest) {
        context.lineTo(point.x, point.y);
      }
      context.stroke();
    }
  }
}

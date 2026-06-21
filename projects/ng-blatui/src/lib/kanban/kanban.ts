import {
  CdkDrag,
  type CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, computed, input, linkedSignal, output } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface KanbanCard {
  id: string;
  title: string;
  tags?: string[];
  meta?: string;
}
export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

/** A drag-and-drop kanban board (Angular CDK drag-drop). */
@Component({
  selector: 'bui-kanban',
  imports: [CdkDropList, CdkDrag],
  host: { 'data-slot': 'kanban', '[class]': 'computedClass()' },
  template: `
    <div class="flex gap-4 overflow-x-auto pb-2">
      @for (column of board(); track column.id) {
        <div class="flex w-64 shrink-0 flex-col rounded-lg border bg-muted/50 p-2">
          <div class="flex items-center justify-between px-1 pb-2">
            <span class="text-sm font-medium">{{ column.title }}</span>
            <span class="text-xs text-muted-foreground">{{ column.cards.length }}</span>
          </div>
          <div
            cdkDropList
            [id]="column.id"
            [cdkDropListData]="column.cards"
            [cdkDropListConnectedTo]="columnIds()"
            class="flex min-h-12 flex-col gap-2"
            (cdkDropListDropped)="onDrop($event)"
          >
            @for (card of column.cards; track card.id) {
              <div
                cdkDrag
                class="cursor-grab rounded-md border bg-card p-3 shadow-sm active:cursor-grabbing"
              >
                <p class="text-sm font-medium">{{ card.title }}</p>
                @if (card.tags && card.tags.length > 0) {
                  <div class="mt-2 flex flex-wrap gap-1">
                    @for (tag of card.tags; track tag) {
                      <span class="rounded bg-secondary px-1.5 py-0.5 text-[10px]">{{ tag }}</span>
                    }
                  </div>
                }
                @if (card.meta) {
                  <p class="mt-1 text-xs text-muted-foreground">{{ card.meta }}</p>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class BuiKanban {
  readonly columns = input<readonly KanbanColumn[]>([]);
  readonly changed = output<KanbanColumn[]>();
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly board = linkedSignal(() =>
    this.columns().map((column) => ({ ...column, cards: [...column.cards] })),
  );
  protected readonly columnIds = computed(() => this.board().map((column) => column.id));
  protected readonly computedClass = computed(() => cn('block', this.userClass()));

  protected onDrop(event: CdkDragDrop<KanbanCard[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.board.set([...this.board()]);
    this.changed.emit(this.board());
  }
}

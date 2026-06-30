import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import {
  BuiAvatar,
  BuiBadge,
  BuiButton,
  BuiCard,
  BuiDropdownMenu,
  BuiDropdownMenuItem,
  BuiInputGroup,
  BuiInputGroupAddon,
  BuiInputGroupInput,
  Menu,
  MenuItem,
  MenuTrigger,
} from 'ng-blatui';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

type Priority = 'high' | 'medium' | 'low';

interface Assignee {
  name: string;
  avatar: string;
}
interface Card {
  id: number;
  priority: Priority;
  title: string;
  cover?: string;
  assignees: Assignee[];
  due: string;
}
interface Column {
  title: string;
  cards: Card[];
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Kanban" app page.
 * Horizontal flex row of columns (Backlog / In Progress / Review / Done), each
 * a muted lane with a header (title + count badge + actions) over a vertical
 * stack of cards (priority chip, optional cover, title, overlapping assignee
 * avatars, due date) ending in an "Add New Item" action. Scrolls horizontally
 * on tablet/mobile. Light mode, Geist font.
 */
@Component({
  selector: 'app-tpl-admincn-kanban',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    Lucide,
    AdmincnShell,
    BuiAvatar,
    BuiBadge,
    BuiButton,
    BuiCard,
    BuiDropdownMenu,
    BuiDropdownMenuItem,
    BuiInputGroup,
    BuiInputGroupAddon,
    BuiInputGroupInput,
    Menu,
    MenuItem,
    MenuTrigger,
  ],
  templateUrl: './admincn-kanban.html',
})
export class AdmincnKanban {
  protected readonly avatars = '/admincn/avatars';
  // Only avatar-1..6 + avatar-16 exist locally; map the reference's 1..10 onto them.
  private readonly a1 = '/admincn/avatars/avatar-1.webp';
  private readonly a2 = '/admincn/avatars/avatar-2.webp';
  private readonly a3 = '/admincn/avatars/avatar-3.webp';
  private readonly a4 = '/admincn/avatars/avatar-4.webp';
  private readonly a5 = '/admincn/avatars/avatar-5.webp';
  private readonly a6 = '/admincn/avatars/avatar-6.webp';
  private readonly a16 = '/admincn/avatars/avatar-16.webp';
  // No flower cover art ships locally; reuse the only available cover-ish image.
  private readonly cover = '/admincn/widgets/image-6.webp';

  private nextId = 100;

  protected readonly columns = signal<Column[]>([
    {
      title: 'Backlog',
      cards: [
        {
          id: 1,
          priority: 'high',
          title: 'AI Dashboard Research',
          cover: this.cover,
          assignees: [
            { name: 'Alex Johnson', avatar: this.a1 },
            { name: 'Michael Rodriguez', avatar: this.a3 },
          ],
          due: 'Jul 05, 2026',
        },
        {
          id: 2,
          priority: 'medium',
          title: 'Create Landing Page Wireframes',
          assignees: [{ name: 'Sarah Chen', avatar: this.a2 }],
          due: 'Jul 08, 2026',
        },
        {
          id: 3,
          priority: 'low',
          title: 'User Interview Analysis',
          assignees: [{ name: 'Olivia Sparks', avatar: this.a16 }],
          due: 'Jul 12, 2026',
        },
      ],
    },
    {
      title: 'In Progress',
      cards: [
        {
          id: 4,
          priority: 'high',
          title: 'Build Authentication Flow',
          assignees: [
            { name: 'Emma Wilson', avatar: this.a4 },
            { name: 'David Kim', avatar: this.a5 },
          ],
          due: 'Jul 15, 2026',
        },
        {
          id: 5,
          priority: 'medium',
          title: 'Dark Mode Implementation',
          cover: this.cover,
          assignees: [{ name: 'Aron Thompson', avatar: this.a6 }],
          due: 'Jul 18, 2026',
        },
        {
          id: 6,
          priority: 'high',
          title: 'Mobile Responsive Layout',
          assignees: [{ name: 'James Brown', avatar: this.a16 }],
          due: 'Jul 20, 2026',
        },
      ],
    },
    {
      title: 'Review',
      cards: [
        {
          id: 7,
          priority: 'medium',
          title: 'Analytics Charts',
          cover: this.cover,
          assignees: [
            { name: 'Howard Lloyd', avatar: this.a3 },
            { name: 'Hallie Richards', avatar: this.a4 },
          ],
          due: 'Jul 22, 2026',
        },
        {
          id: 8,
          priority: 'high',
          title: 'Notification System',
          assignees: [
            { name: 'Alex Johnson', avatar: this.a1 },
            { name: 'David Kim', avatar: this.a5 },
          ],
          due: 'Jul 23, 2026',
        },
      ],
    },
    {
      title: 'Done',
      cards: [
        {
          id: 9,
          priority: 'high',
          title: 'Project Setup',
          assignees: [
            { name: 'Aron Thompson', avatar: this.a6 },
            { name: 'James Brown', avatar: this.a16 },
          ],
          due: 'Jun 28, 2026',
        },
        {
          id: 10,
          priority: 'medium',
          title: 'Design System Foundation',
          assignees: [
            { name: 'Michael Rodriguez', avatar: this.a3 },
            { name: 'Emma Wilson', avatar: this.a4 },
          ],
          due: 'Jun 30, 2026',
        },
        {
          id: 11,
          priority: 'high',
          title: 'Database Architecture',
          cover: this.cover,
          assignees: [{ name: 'Sarah Chen', avatar: this.a2 }],
          due: 'Jul 01, 2026',
        },
      ],
    },
  ]);

  /** Index of the column whose inline "add item" input is currently open, or -1. */
  protected readonly addingColumn = signal(-1);
  /** Draft title for the inline add input. */
  protected readonly draftTitle = signal('');

  protected cardCount(column: Column): number {
    return column.cards.length;
  }

  // ----- Add new item -----
  protected startAdding(columnIndex: number): void {
    this.draftTitle.set('');
    this.addingColumn.set(columnIndex);
  }

  protected cancelAdding(): void {
    this.addingColumn.set(-1);
    this.draftTitle.set('');
  }

  protected confirmAdding(columnIndex: number): void {
    const title = this.draftTitle().trim();
    if (title === '') {
      this.cancelAdding();
      return;
    }
    const newCard: Card = {
      id: this.nextId++,
      priority: 'medium',
      title,
      assignees: [{ name: 'Unassigned', avatar: this.a1 }],
      due: 'No due date',
    };
    this.columns.update((columns) =>
      columns.map((column, index) =>
        index === columnIndex ? { ...column, cards: [...column.cards, newCard] } : column,
      ),
    );
    this.cancelAdding();
  }

  // ----- Move card between columns -----
  protected moveCard(columnIndex: number, cardId: number, direction: -1 | 1): void {
    const target = columnIndex + direction;
    this.columns.update((columns) => {
      if (target < 0 || target >= columns.length) {
        return columns;
      }
      const moving = columns[columnIndex].cards.find((card) => card.id === cardId);
      if (!moving) {
        return columns;
      }
      return columns.map((column, index) => {
        if (index === columnIndex) {
          return { ...column, cards: column.cards.filter((card) => card.id !== cardId) };
        }
        if (index === target) {
          return { ...column, cards: [...column.cards, moving] };
        }
        return column;
      });
    });
  }

  protected canMove(columnIndex: number, direction: -1 | 1): boolean {
    const target = columnIndex + direction;
    return target >= 0 && target < this.columns().length;
  }

  // ----- Delete -----
  protected deleteCard(columnIndex: number, cardId: number): void {
    this.columns.update((columns) =>
      columns.map((column, index) =>
        index === columnIndex
          ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
          : column,
      ),
    );
  }
}

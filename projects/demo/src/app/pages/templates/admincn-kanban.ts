import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

type Priority = 'high' | 'medium' | 'low';

interface Assignee {
  name: string;
  avatar: string;
}
interface Card {
  priority: Priority;
  title: string;
  cover?: string;
  assignees: Assignee[];
  due: string;
}
interface Column {
  title: string;
  count: number;
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
  imports: [Lucide, AdmincnShell],
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

  protected readonly columns: Column[] = [
    {
      title: 'Backlog',
      count: 3,
      cards: [
        {
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
          priority: 'medium',
          title: 'Create Landing Page Wireframes',
          assignees: [{ name: 'Sarah Chen', avatar: this.a2 }],
          due: 'Jul 08, 2026',
        },
        {
          priority: 'low',
          title: 'User Interview Analysis',
          assignees: [{ name: 'Olivia Sparks', avatar: this.a16 }],
          due: 'Jul 12, 2026',
        },
      ],
    },
    {
      title: 'In Progress',
      count: 3,
      cards: [
        {
          priority: 'high',
          title: 'Build Authentication Flow',
          assignees: [
            { name: 'Emma Wilson', avatar: this.a4 },
            { name: 'David Kim', avatar: this.a5 },
          ],
          due: 'Jul 15, 2026',
        },
        {
          priority: 'medium',
          title: 'Dark Mode Implementation',
          cover: this.cover,
          assignees: [{ name: 'Aron Thompson', avatar: this.a6 }],
          due: 'Jul 18, 2026',
        },
        {
          priority: 'high',
          title: 'Mobile Responsive Layout',
          assignees: [{ name: 'James Brown', avatar: this.a16 }],
          due: 'Jul 20, 2026',
        },
      ],
    },
    {
      title: 'Review',
      count: 2,
      cards: [
        {
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
      count: 3,
      cards: [
        {
          priority: 'high',
          title: 'Project Setup',
          assignees: [
            { name: 'Aron Thompson', avatar: this.a6 },
            { name: 'James Brown', avatar: this.a16 },
          ],
          due: 'Jun 28, 2026',
        },
        {
          priority: 'medium',
          title: 'Design System Foundation',
          assignees: [
            { name: 'Michael Rodriguez', avatar: this.a3 },
            { name: 'Emma Wilson', avatar: this.a4 },
          ],
          due: 'Jun 30, 2026',
        },
        {
          priority: 'high',
          title: 'Database Architecture',
          cover: this.cover,
          assignees: [{ name: 'Sarah Chen', avatar: this.a2 }],
          due: 'Jul 01, 2026',
        },
      ],
    },
  ];
}

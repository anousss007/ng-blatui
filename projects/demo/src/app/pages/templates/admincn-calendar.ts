import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

/** A colored event pill rendered inside a day cell. */
interface CalEvent {
  /** Optional leading time label (e.g. "1pm", "2:30pm"). */
  time?: string;
  title: string;
  /** Category colour family — drives the acn-evt-* tint classes. */
  color: 'sky' | 'amber' | 'emerald' | 'violet' | 'rose';
  /** Past events render struck-through + dimmed. */
  past?: boolean;
  /** Multi-day span position: start | mid | end | undefined (single). */
  span?: 'start' | 'mid' | 'end';
}

/** One day cell of the month grid. */
interface Day {
  /** Day-of-month number shown top-left. */
  num: number;
  /** Days outside the current month render dimmed. */
  outside?: boolean;
  /** The single highlighted "today" cell. */
  today?: boolean;
  events?: CalEvent[];
  /** Count appended as "+ N more" under the visible events. */
  more?: number;
}

/** A mini-calendar cell in the left panel. */
interface MiniDay {
  num: number;
  outside?: boolean;
  today?: boolean;
  /** Coloured dots beneath the number, one per event category. */
  dots?: ('sky' | 'amber' | 'emerald' | 'violet' | 'rose')[];
}

interface Filter {
  id: string;
  label: string;
  color: 'primary' | 'amber' | 'violet' | 'rose' | 'emerald' | 'sky';
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Calendar" app page.
 * Left panel (New event + mini June 2026 calendar + event-category filters)
 * beside a full month grid whose day cells host colour-coded event pills.
 * June 2026, today = the 29th. Light mode, Geist font, responsive to mobile.
 */
@Component({
  selector: 'app-tpl-admincn-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-calendar.html',
})
export class AdmincnCalendar {
  protected readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  protected readonly miniWeekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  protected readonly filters: Filter[] = [
    { id: 'filter-all', label: 'All', color: 'primary' },
    { id: 'filter-family', label: 'Family', color: 'amber' },
    { id: 'filter-business', label: 'Business', color: 'violet' },
    { id: 'filter-personal', label: 'Personal', color: 'rose' },
    { id: 'filter-holiday', label: 'Holiday', color: 'emerald' },
    { id: 'filter-etc', label: 'Etc', color: 'sky' },
  ];

  /* Month grid — 6 weeks of 7 days, June 2026 (Jun 1 = Monday). ---------- */
  protected readonly weeks: Day[][] = [
    [
      { num: 31, outside: true },
      { num: 1 },
      { num: 2 },
      { num: 3 },
      { num: 4 },
      {
        num: 5,
        events: [{ title: 'Annual Planning', color: 'sky', past: true, span: 'start' }],
      },
      {
        num: 6,
        events: [{ title: 'Annual Planning', color: 'sky', past: true, span: 'end' }],
      },
    ],
    [{ num: 7 }, { num: 8 }, { num: 9 }, { num: 10 }, { num: 11 }, { num: 12 }, { num: 13 }],
    [
      { num: 14 },
      { num: 15 },
      {
        num: 16,
        events: [{ title: 'Quarterly Budget Review', color: 'amber', past: true }],
      },
      { num: 17 },
      { num: 18 },
      { num: 19 },
      {
        num: 20,
        events: [{ time: '1pm', title: 'Project Deadline', color: 'amber', past: true }],
      },
    ],
    [{ num: 21 }, { num: 22 }, { num: 23 }, { num: 24 }, { num: 25 }, { num: 26 }, { num: 27 }],
    [
      { num: 28 },
      {
        num: 29,
        today: true,
        events: [{ time: '10am', title: 'Team Meeting', color: 'sky', past: true }],
      },
      {
        num: 30,
        events: [{ time: '12pm', title: 'Lunch with Client', color: 'emerald' }],
      },
      { num: 1, outside: true },
      {
        num: 2,
        outside: true,
        events: [{ title: 'Product Launch', color: 'violet', span: 'start' }],
      },
      {
        num: 3,
        outside: true,
        events: [
          { title: 'Product Launch', color: 'violet', span: 'mid' },
          { time: '2:30pm', title: 'Sales Conference', color: 'rose' },
        ],
      },
      {
        num: 4,
        outside: true,
        events: [
          { title: 'Product Launch', color: 'violet', span: 'end' },
          { time: '9am', title: 'Team Meeting', color: 'sky' },
          { time: '9:45am', title: 'Team Meeting', color: 'sky' },
          { time: '2pm', title: 'Review contracts', color: 'amber' },
        ],
        more: 2,
      },
    ],
  ];

  /* Mini calendar — same June 2026 layout, dots flag days with events. --- */
  protected readonly miniWeeks: MiniDay[][] = [
    [
      { num: 31, outside: true },
      { num: 1 },
      { num: 2 },
      { num: 3 },
      { num: 4 },
      { num: 5, dots: ['sky'] },
      { num: 6 },
    ],
    [{ num: 7 }, { num: 8 }, { num: 9 }, { num: 10 }, { num: 11 }, { num: 12 }, { num: 13 }],
    [
      { num: 14 },
      { num: 15 },
      { num: 16, dots: ['amber'] },
      { num: 17 },
      { num: 18 },
      { num: 19 },
      { num: 20, dots: ['amber'] },
    ],
    [{ num: 21 }, { num: 22 }, { num: 23 }, { num: 24 }, { num: 25 }, { num: 26 }, { num: 27 }],
    [
      { num: 28 },
      { num: 29, today: true, dots: ['sky'] },
      { num: 30, dots: ['emerald'] },
      { num: 1, outside: true },
      { num: 2, outside: true, dots: ['violet'] },
      { num: 3, outside: true, dots: ['violet', 'rose'] },
      { num: 4, outside: true, dots: ['violet', 'sky', 'amber'] },
    ],
  ];
}

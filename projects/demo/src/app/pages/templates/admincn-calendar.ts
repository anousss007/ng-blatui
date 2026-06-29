import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

type Cat = 'sky' | 'amber' | 'emerald' | 'violet' | 'rose';

/** A colored event pill rendered inside a day cell. */
interface CalEvent {
  /** Optional leading time label (e.g. "1pm", "2:30pm"). */
  time?: string;
  title: string;
  /** Category colour family — drives the acn-evt-* tint classes. */
  color: Cat;
  /** Past events render struck-through + dimmed. */
  past?: boolean;
  /** Multi-day span position: start | mid | end | undefined (single). */
  span?: 'start' | 'mid' | 'end';
}

/** A seed event anchored to an absolute calendar date. */
interface SeedEvent extends CalEvent {
  /** Filter category this event belongs to (matches a Filter.id). */
  cat: string;
  /** 0-based month, 1-based day, full year. */
  year: number;
  month: number;
  day: number;
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
  /** Absolute year/month for selection + navigation. */
  year: number;
  month: number;
  /** Coloured dots beneath the number, one per event category. */
  dots?: Cat[];
}

interface Filter {
  id: string;
  label: string;
  color: 'primary' | 'amber' | 'violet' | 'rose' | 'emerald' | 'sky';
}

/** A deterministic "today" reference — June 29 2026 (SSR-safe, no Date.now). */
const TODAY = { year: 2026, month: 5, day: 29 } as const;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

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

  /* Active month/year + optional selected day. ------------------------- */
  protected readonly year = signal<number>(TODAY.year);
  protected readonly month = signal<number>(TODAY.month); // 0-based
  protected readonly selected = signal<{ year: number; month: number; day: number } | null>(null);

  /** Set of enabled category filter ids (excludes the "all" pseudo-filter). */
  private readonly catIds = this.filters.filter((f) => f.id !== 'filter-all').map((f) => f.id);
  protected readonly enabled = signal<Set<string>>(new Set(this.catIds));

  /* Seed events — anchored to absolute dates (June/July 2026). ---------- */
  private readonly seed: SeedEvent[] = [
    {
      cat: 'filter-etc',
      color: 'sky',
      title: 'Annual Planning',
      past: true,
      span: 'start',
      year: 2026,
      month: 5,
      day: 5,
    },
    {
      cat: 'filter-etc',
      color: 'sky',
      title: 'Annual Planning',
      past: true,
      span: 'end',
      year: 2026,
      month: 5,
      day: 6,
    },
    {
      cat: 'filter-family',
      color: 'amber',
      title: 'Quarterly Budget Review',
      past: true,
      year: 2026,
      month: 5,
      day: 16,
    },
    {
      cat: 'filter-family',
      color: 'amber',
      time: '1pm',
      title: 'Project Deadline',
      past: true,
      year: 2026,
      month: 5,
      day: 20,
    },
    {
      cat: 'filter-etc',
      color: 'sky',
      time: '10am',
      title: 'Team Meeting',
      past: true,
      year: 2026,
      month: 5,
      day: 29,
    },
    {
      cat: 'filter-holiday',
      color: 'emerald',
      time: '12pm',
      title: 'Lunch with Client',
      year: 2026,
      month: 5,
      day: 30,
    },
    {
      cat: 'filter-business',
      color: 'violet',
      title: 'Product Launch',
      span: 'start',
      year: 2026,
      month: 6,
      day: 2,
    },
    {
      cat: 'filter-business',
      color: 'violet',
      title: 'Product Launch',
      span: 'mid',
      year: 2026,
      month: 6,
      day: 3,
    },
    {
      cat: 'filter-personal',
      color: 'rose',
      time: '2:30pm',
      title: 'Sales Conference',
      year: 2026,
      month: 6,
      day: 3,
    },
    {
      cat: 'filter-business',
      color: 'violet',
      title: 'Product Launch',
      span: 'end',
      year: 2026,
      month: 6,
      day: 4,
    },
    {
      cat: 'filter-etc',
      color: 'sky',
      time: '9am',
      title: 'Team Meeting',
      year: 2026,
      month: 6,
      day: 4,
    },
    {
      cat: 'filter-etc',
      color: 'sky',
      time: '9:45am',
      title: 'Team Meeting',
      year: 2026,
      month: 6,
      day: 4,
    },
    {
      cat: 'filter-family',
      color: 'amber',
      time: '2pm',
      title: 'Review contracts',
      year: 2026,
      month: 6,
      day: 4,
    },
    // Two more hidden behind the "+ N more" count on Jul 4.
    {
      cat: 'filter-personal',
      color: 'rose',
      time: '4pm',
      title: 'Design Sync',
      year: 2026,
      month: 6,
      day: 4,
    },
    {
      cat: 'filter-holiday',
      color: 'emerald',
      time: '6pm',
      title: 'Dinner',
      year: 2026,
      month: 6,
      day: 4,
    },
  ];

  /** Visible events after applying the category filters. */
  private readonly visibleSeed = computed(() => {
    const on = this.enabled();
    return this.seed.filter((event) => on.has(event.cat));
  });

  /** Header label, e.g. "June 2026". */
  protected readonly label = computed(() => `${MONTH_NAMES[this.month()]} ${this.year()}`);

  /* Month grid — 6 weeks of 7 days for the active month. --------------- */
  protected readonly weeks = computed<Day[][]>(() => {
    const y = this.year();
    const m = this.month();
    const events = this.visibleSeed();

    const firstDow = new Date(y, m, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const start = new Date(y, m, 1 - firstDow); // first cell (may spill into prev month)

    const weeks: Day[][] = [];
    for (let w = 0; w < 6; w++) {
      const week: Day[] = [];
      for (let dow = 0; dow < 7; dow++) {
        const cellDate = new Date(start);
        cellDate.setDate(start.getDate() + w * 7 + dow);
        const cy = cellDate.getFullYear();
        const cm = cellDate.getMonth();
        const cd = cellDate.getDate();
        const isOutside = cm !== m || cy !== y;

        const dayEvents = events.filter(
          (event) => event.year === cy && event.month === cm && event.day === cd,
        );
        const MAX = 4;
        const shown = dayEvents.slice(0, MAX);
        const more = dayEvents.length - shown.length;

        week.push({
          num: cd,
          outside: isOutside || undefined,
          today: (cy === TODAY.year && cm === TODAY.month && cd === TODAY.day) || undefined,
          events: shown.length > 0 ? shown.map((event) => this.toPill(event)) : undefined,
          more: more > 0 ? more : undefined,
        });
      }
      weeks.push(week);
    }
    // Drop a trailing all-spill week (keeps a tidy 5/6-row grid like the source).
    if (daysInMonth + firstDow <= 35 && weeks[5].every((d) => d.outside)) {
      weeks.pop();
    }
    return weeks;
  });

  /* Mini calendar — same active month, dots flag days with events. ----- */
  protected readonly miniWeeks = computed<MiniDay[][]>(() => {
    const y = this.year();
    const m = this.month();
    const events = this.visibleSeed();
    const sel = this.selected();

    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const start = new Date(y, m, 1 - firstDow);

    const weeks: MiniDay[][] = [];
    for (let w = 0; w < 6; w++) {
      const week: MiniDay[] = [];
      for (let dow = 0; dow < 7; dow++) {
        const cellDate = new Date(start);
        cellDate.setDate(start.getDate() + w * 7 + dow);
        const cy = cellDate.getFullYear();
        const cm = cellDate.getMonth();
        const cd = cellDate.getDate();
        const isOutside = cm !== m || cy !== y;

        const dots = [
          ...new Set(
            events
              .filter((event) => event.year === cy && event.month === cm && event.day === cd)
              .map((event) => event.color),
          ),
        ];

        const isToday = cy === TODAY.year && cm === TODAY.month && cd === TODAY.day;
        const isSel = !!sel && sel.year === cy && sel.month === cm && sel.day === cd;

        week.push({
          num: cd,
          year: cy,
          month: cm,
          outside: isOutside || undefined,
          today: isToday || isSel || undefined,
          dots: dots.length > 0 ? dots : undefined,
        });
      }
      weeks.push(week);
    }
    if (daysInMonth + firstDow <= 35 && weeks[5].every((d) => d.outside)) {
      weeks.pop();
    }
    return weeks;
  });

  /** Map a seed event to its display pill (strip the extra anchor fields). */
  private toPill(event: SeedEvent): CalEvent {
    return {
      time: event.time,
      title: event.title,
      color: event.color,
      past: event.past,
      span: event.span,
    };
  }

  /* ---- Navigation handlers ------------------------------------------- */
  protected prevMonth(): void {
    const m = this.month();
    if (m === 0) {
      this.month.set(11);
      this.year.update((y) => y - 1);
    } else {
      this.month.set(m - 1);
    }
  }

  protected nextMonth(): void {
    const m = this.month();
    if (m === 11) {
      this.month.set(0);
      this.year.update((y) => y + 1);
    } else {
      this.month.set(m + 1);
    }
  }

  protected goToday(): void {
    this.year.set(TODAY.year);
    this.month.set(TODAY.month);
    this.selected.set(null);
  }

  /** Mini-calendar day click: navigate to its month + mark it selected. */
  protected pickDay(d: MiniDay): void {
    this.year.set(d.year);
    this.month.set(d.month);
    this.selected.set({ year: d.year, month: d.month, day: d.num });
  }

  /* ---- Filter handlers ----------------------------------------------- */
  protected isOn(f: Filter): boolean {
    if (f.id === 'filter-all') return this.enabled().size === this.catIds.length;
    return this.enabled().has(f.id);
  }

  protected toggleFilter(f: Filter): void {
    if (f.id === 'filter-all') {
      const isAllOn = this.enabled().size === this.catIds.length;
      this.enabled.set(new Set(isAllOn ? [] : this.catIds));
      return;
    }
    const next = new Set(this.enabled());
    if (next.has(f.id)) next.delete(f.id);
    else next.add(f.id);
    this.enabled.set(next);
  }
}

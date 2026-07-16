import { Component, LOCALE_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideBuiLabels } from '../i18n/labels';

import { BuiGantt, type GanttTask } from './gantt';

const TASKS: GanttTask[] = [
  { name: 'Design', start: '2026-01-01', end: '2026-01-05', progress: 50 },
  { name: 'Build', start: '2026-01-05', end: '2026-01-12' },
];

@Component({
  imports: [BuiGantt],
  template: `<bui-gantt [tasks]="tasks" />`,
})
class TestHost {
  readonly tasks = TASKS;
}

@Component({
  imports: [BuiGantt],
  template: `<bui-gantt [tasks]="tasks" [locale]="locale()" />`,
})
class LocaleHost {
  readonly tasks = TASKS;
  readonly locale = signal<string | undefined>(undefined);
}

/** The two axis bound labels rendered under the bars. */
function bounds(fixture: { nativeElement: unknown }): string[] {
  const axis = (fixture.nativeElement as HTMLElement).querySelector('.flex.justify-between')!;
  return [...axis.querySelectorAll('span')].map((span) => span.textContent.trim());
}

describe('BuiGantt', () => {
  it('renders a positioned bar per task', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const bars = root.querySelectorAll<HTMLElement>('[style*="width"]');
    expect(bars.length).toBeGreaterThanOrEqual(2);
    expect(root.textContent).toContain('Design');
    expect(bars[0].style.left).toBe('0%');
  });

  it('renders the pre-locale en-US bound labels when nothing is configured', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    // The end bound is the latest task end (Jan 12), not the day before it: day indexes are
    // counted from local midnight, so they must not be turned back into a Date to be labelled.
    expect(bounds(fixture)).toEqual(['Jan 1', 'Jan 12']);
  });

  it('localizes the bound labels', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    expect(bounds(fixture)).toEqual(['1 janv.', '12 janv.']);
  });

  it('localizes the bound labels in Arabic (RTL)', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.componentInstance.locale.set('ar');
    fixture.detectChanges();
    expect(bounds(fixture).at(0)).toContain('يناير');
  });

  it('reformats when the locale changes at runtime', () => {
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    expect(bounds(fixture).at(0)).toBe('Jan 1');

    fixture.componentInstance.locale.set('fr');
    fixture.detectChanges();
    expect(bounds(fixture).at(0)).toBe('1 janv.');
  });

  it('follows the app LOCALE_ID when no locale input is set', () => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'fr' }] });
    const fixture = TestBed.createComponent(LocaleHost);
    fixture.detectChanges();
    expect(bounds(fixture).at(0)).toBe('1 janv.');
  });

  it('honours a dateFormat override', () => {
    @Component({
      imports: [BuiGantt],
      template: `<bui-gantt [tasks]="tasks" locale="fr" [dateFormat]="{ dateStyle: 'short' }" />`,
    })
    class FormatHost {
      readonly tasks = TASKS;
    }

    const fixture = TestBed.createComponent(FormatHost);
    fixture.detectChanges();
    expect(bounds(fixture).at(0)).toBe('01/01/2026');
  });

  it('translates the empty state, which used to be hardcoded in the template', () => {
    @Component({
      imports: [BuiGantt],
      template: `<bui-gantt [tasks]="[]" />`,
    })
    class EmptyHost {}

    const bare = TestBed.createComponent(EmptyHost);
    bare.detectChanges();
    expect((bare.nativeElement as HTMLElement).textContent).toContain('No tasks.');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideBuiLabels({ ganttEmpty: 'Aucune tâche.' })],
    });
    const translated = TestBed.createComponent(EmptyHost);
    translated.detectChanges();
    expect((translated.nativeElement as HTMLElement).textContent).toContain('Aucune tâche.');
  });

  it('renders an empty bound instead of throwing when a task has no start date', () => {
    @Component({
      imports: [BuiGantt],
      template: `<bui-gantt [tasks]="tasks" />`,
    })
    class PartialHost {
      readonly tasks: GanttTask[] = [
        { name: 'Undated', start: '', end: '' },
        { name: 'Build', start: '2026-01-05', end: '2026-01-12' },
      ];
    }

    const fixture = TestBed.createComponent(PartialHost);
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
    expect(bounds(fixture).at(0)).toBe('');
  });
});

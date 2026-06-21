import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiKanban, type KanbanColumn } from './kanban';

@Component({
  imports: [BuiKanban],
  template: `<bui-kanban [columns]="columns" />`,
})
class TestHost {
  readonly columns: KanbanColumn[] = [
    { id: 'todo', title: 'To do', cards: [{ id: '1', title: 'Task A', tags: ['bug'] }] },
    { id: 'doing', title: 'In progress', cards: [{ id: '2', title: 'Task B' }] },
    { id: 'done', title: 'Done', cards: [] },
  ];
}

describe('BuiKanban', () => {
  it('renders columns and their cards', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('[cdkDropList]')).toHaveLength(3);
    expect(root.textContent).toContain('Task A');
    expect(root.textContent).toContain('Task B');
    expect(root.textContent).toContain('bug');
  });
});

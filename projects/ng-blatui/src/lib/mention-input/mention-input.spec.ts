import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiMentionInput, type Mention } from './mention-input';

@Component({
  imports: [BuiMentionInput],
  template: `<bui-mention-input [(value)]="value" [mentions]="mentions" />`,
})
class TestHost {
  readonly value = signal('');
  readonly mentions: Mention[] = [
    { value: 'ada', label: 'Ada' },
    { value: 'grace', label: 'Grace' },
  ];
}

describe('BuiMentionInput', () => {
  it('suggests and inserts a mention', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const textarea = root.querySelector('textarea')!;
    textarea.value = 'hi @ad';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const options = root.querySelectorAll<HTMLElement>('[role="option"]');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('Ada');

    options[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('hi @Ada ');
  });
});

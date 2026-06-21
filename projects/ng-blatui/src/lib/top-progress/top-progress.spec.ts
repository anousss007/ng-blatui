import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BuiTopProgress } from './top-progress';

@Component({
  imports: [BuiTopProgress],
  template: `<bui-top-progress [demo]="true" />`,
})
class TestHost {}

describe('BuiTopProgress', () => {
  it('shows progress on start/set and completes on done', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const instance = fixture.debugElement.query(By.directive(BuiTopProgress))
      .componentInstance as BuiTopProgress;

    instance.start();
    fixture.detectChanges();
    const bar = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('div')!;
    expect(bar.style.opacity).toBe('1');

    instance.set(0.5);
    fixture.detectChanges();
    expect(bar.style.width).toBe('50%');

    instance.done();
    fixture.detectChanges();
    expect(bar.style.width).toBe('100%');
  });
});

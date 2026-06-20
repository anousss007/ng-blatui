import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiMeter } from './meter';

@Component({
  imports: [BuiMeter],
  template: `<bui-meter [value]="72" label="CPU" />`,
})
class TestHost {}

describe('BuiMeter', () => {
  it('exposes role=meter with aria range and value text', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const meter = element.querySelector('[role="meter"]')!;
    expect(meter.getAttribute('aria-label')).toBe('CPU');
    expect(meter.getAttribute('aria-valuenow')).toBe('72');
    expect(meter.getAttribute('aria-valuemax')).toBe('100');
    expect(meter.getAttribute('aria-valuetext')).toBe('72%');
    expect(element.textContent).toContain('CPU');
  });
});

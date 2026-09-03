/* eslint-disable sonarjs/no-floating-point-equality -- exactness is the assertion here:
   the rounding exists so a stepped value is the one the caller described, not one near it. */
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { BuiSlider, type SliderRange } from './slider';

@Component({
  imports: [BuiSlider],
  template: `<bui-slider [(value)]="value" ariaLabel="Volume" />`,
})
class TestHost {
  readonly value = signal(40);
}

@Component({
  imports: [BuiSlider, ReactiveFormsModule],
  template: `<bui-slider [range]="true" [formControl]="control" ariaLabel="Price" />`,
})
class RangeHost {
  readonly control = new FormControl<SliderRange>([20, 60]);
}

@Component({
  imports: [BuiSlider],
  template: `<bui-slider [(value)]="ratio" [min]="0" [max]="2" [step]="0.1" />`,
})
class FractionalHost {
  readonly ratio = signal(1.1);
}

describe('BuiSlider', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const thumb = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[role="slider"]',
    )!;
    return { fixture, thumb };
  }

  it('exposes role=slider with aria range and value', () => {
    const { thumb } = setup();
    expect(thumb.getAttribute('aria-label')).toBe('Volume');
    expect(thumb.getAttribute('aria-valuenow')).toBe('40');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
  });

  it('increments the value on ArrowRight', () => {
    const { fixture, thumb } = setup();
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe(41);
    expect(thumb.getAttribute('aria-valuenow')).toBe('41');
  });

  it('stays on the values a fractional step describes', () => {
    const fixture = TestBed.createComponent(FractionalHost);
    fixture.detectChanges();
    const thumb = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[role="slider"]',
    )!;

    for (let index = 0; index < 8; index++) {
      thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    }
    fixture.detectChanges();
    expect(fixture.componentInstance.ratio()).toBe(1.9);
  });

  it('reads and writes both ends of a range through a form control', () => {
    const fixture = TestBed.createComponent(RangeHost);
    fixture.detectChanges();
    const thumbs = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '[role="slider"]',
    );
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0].getAttribute('aria-valuenow')).toBe('20');
    expect(thumbs[1].getAttribute('aria-valuenow')).toBe('60');

    // The upper thumb used to move on screen while the control heard nothing at all.
    thumbs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toEqual([20, 61]);

    thumbs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toEqual([19, 61]);
  });
});

/* eslint-disable sonarjs/no-floating-point-equality -- exactness is the assertion here:
   the rounding exists so a stepped value is the one the caller described, not one near it. */
import { buiSnap, buiStep } from './number';

describe('buiStep', () => {
  it('keeps a fractional step on the grid the caller described', () => {
    let value = 1.1;
    for (let index = 0; index < 8; index++) {
      value = buiStep(value, 0.1);
    }
    expect(value).toBe(1.9);
  });

  it('takes its precision from the value as well as the step', () => {
    expect(buiStep(1.32, 1)).toBe(2.32);
    expect(buiStep(0.1, 0.2)).toBe(0.3);
    expect(buiStep(2, -0.5)).toBe(1.5);
  });

  it('handles a step written in exponent notation', () => {
    expect(buiStep(0.001, 1e-3)).toBe(0.002);
  });
});

describe('buiSnap', () => {
  it('snaps onto min + n * step without the float dust', () => {
    expect(buiSnap(0.68, 0, 0.1)).toBe(0.7);
    expect(buiSnap(7.3, 1, 0.5)).toBe(7.5);
  });

  it('leaves the value alone when there is no step to snap to', () => {
    expect(buiSnap(3.25, 0, 0)).toBe(3.25);
  });
});

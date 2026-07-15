import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiMoneyInput } from './money-input';

@Component({
  imports: [BuiMoneyInput],
  template: `<bui-money-input [(value)]="amount" currency="USD" locale="en-US" />`,
})
class TestHost {
  readonly amount = signal<number | null>(1234.5);
}

@Component({
  imports: [BuiMoneyInput],
  template: `<bui-money-input [value]="2500" currency="MAD" locale="fr-MA" symbol="DH" />`,
})
class SymbolHost {}

describe('BuiMoneyInput', () => {
  it('formats the amount as currency while blurred', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    expect(input.value).toBe('$1,234.50');
  });

  it('parses typed text (grouping + decimal) into a number', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    input.value = '2,500.75';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.amount()).toBeCloseTo(2500.75);
  });

  it('treats a lone comma as the decimal separator', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    input.dispatchEvent(new Event('focus'));
    input.value = '19,99';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.amount()).toBeCloseTo(19.99);
  });

  it('overrides the currency token with a custom symbol in the locale position', () => {
    const fixture = TestBed.createComponent(SymbolHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    // fr-MA places the symbol as a suffix; the ISO "MAD" must be replaced by "DH".
    expect(input.value).toContain('DH');
    expect(input.value).not.toContain('MAD');
  });

  it('clears to null on empty input', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input')!;
    input.dispatchEvent(new Event('focus'));
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.amount()).toBeNull();
  });
});

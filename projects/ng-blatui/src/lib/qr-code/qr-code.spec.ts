import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiQrCode } from './qr-code';
import { encodeQr } from './qr-encode';

@Component({
  imports: [BuiQrCode],
  template: `<bui-qr-code value="https://ngblatui.remix-it.com" label="Docs site" />`,
})
class TestHost {}

describe('encodeQr', () => {
  it('produces a square matrix with valid finder patterns', () => {
    const matrix = encodeQr('HELLO WORLD');
    expect(matrix.length).toBeGreaterThanOrEqual(21);
    expect(matrix.length % 4).toBe(1); // size = 17 + 4 * version
    expect(matrix).toHaveLength(matrix[0].length);
    // top-left finder: dark border ring, light gap, dark core
    expect(matrix[0][0]).toBe(true);
    expect(matrix[0][6]).toBe(true);
    expect(matrix[1][1]).toBe(false);
    expect(matrix[2][2]).toBe(true);
  });

  it('grows the version with the payload size', () => {
    const small = encodeQr('hi');
    const large = encodeQr('x'.repeat(60));
    expect(large.length).toBeGreaterThan(small.length);
  });
});

describe('BuiQrCode', () => {
  it('renders an accessible SVG with module rects', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Docs site');
    expect(svg.querySelector('path')!.getAttribute('d')!.length).toBeGreaterThan(0);
  });
});

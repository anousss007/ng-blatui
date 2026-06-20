import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BuiQuote } from './quote';

@Component({
  imports: [BuiQuote],
  template: `<bui-quote author="Ada Lovelace" role="Mathematician">A great quote.</bui-quote>`,
})
class TestHost {}

describe('BuiQuote', () => {
  it('renders the quote and attribution', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('blockquote')?.textContent).toContain('A great quote.');
    expect(element.querySelector('figcaption')?.textContent).toContain('Ada Lovelace');
    expect(element.querySelector('figcaption')?.textContent).toContain('Mathematician');
  });
});

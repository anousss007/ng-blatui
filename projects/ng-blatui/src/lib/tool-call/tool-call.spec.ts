import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideBuiLabels } from '../i18n/labels';

import { BuiToolCall } from './tool-call';

@Component({
  imports: [BuiToolCall],
  template: `<bui-tool-call name="search_web" status="success" args="{ q: 'angular' }" />`,
})
class TestHost {}

describe('BuiToolCall', () => {
  it('reveals arguments when expanded', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('code')?.textContent).toContain('search_web');

    root.querySelector('button')!.click();
    fixture.detectChanges();
    expect(root.querySelector('pre')?.textContent).toContain('angular');
  });

  /** The headings live behind the expander, so the panel has to be opened to read them. */
  function expandedText(): string {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    return root.textContent;
  }

  it('translates the panel headings via provideBuiLabels', () => {
    expect(expandedText()).toContain('Arguments');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideBuiLabels({ toolCallArguments: 'Paramètres', toolCallResult: 'Résultat' }),
      ],
    });
    const text = expandedText();
    expect(text).toContain('Paramètres');
    expect(text).not.toContain('Arguments');
  });
});

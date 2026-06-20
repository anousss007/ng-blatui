import { TestBed } from '@angular/core/testing';

import { ThemeStore } from './theme';
import { BuiThemeCustomizer } from './theme-customizer';

describe('BuiThemeCustomizer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function setup() {
    const fixture = TestBed.createComponent(BuiThemeCustomizer);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return { fixture, root };
  }

  it('opens the panel from the trigger', () => {
    const { fixture, root } = setup();
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    root.querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    expect(root.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('wires a control to the ThemeStore', () => {
    const { fixture, root } = setup();
    root.querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')];
    const darkButton = buttons.find((button) => button.textContent.trim() === 'Dark')!;
    darkButton.click();
    fixture.detectChanges();
    expect(TestBed.inject(ThemeStore).mode()).toBe('dark');
  });
});

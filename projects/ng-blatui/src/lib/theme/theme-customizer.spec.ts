import { TestBed } from '@angular/core/testing';

import { provideBuiLabels } from '../i18n/labels';

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

  it('translates the panel chrome via provideBuiLabels', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideBuiLabels({ themeCustomizerOpen: 'Personnaliser', themeCustomizerMode: 'Thème' }),
      ],
    });
    const { fixture, root } = setup();
    const trigger = root.querySelector<HTMLButtonElement>('button')!;
    expect(trigger.textContent.trim()).toBe('Personnaliser');

    trigger.click();
    fixture.detectChanges();
    const panel = root.querySelector('[role="dialog"]')!;
    expect(panel.textContent).toContain('Thème');
    expect(panel.textContent).not.toContain('Mode');
  });

  it('keeps the English panel chrome by default', () => {
    const { fixture, root } = setup();
    expect(root.querySelector('button')!.textContent.trim()).toBe('Customize');
    root.querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    expect(root.querySelector('[role="dialog"]')!.textContent).toContain('Mode');
  });
});

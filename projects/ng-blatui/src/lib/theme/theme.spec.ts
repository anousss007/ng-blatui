import { TestBed } from '@angular/core/testing';

import { ThemeStore } from './theme';

describe('ThemeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    const element = document.documentElement;
    element.className = '';
    for (const name of element.getAttributeNames()) {
      if (name.startsWith('data-')) {
        element.removeAttribute(name);
      }
    }
  });

  it('reflects dark mode in isDark and on the <html> element', () => {
    const store = TestBed.inject(ThemeStore);
    store.setMode('dark');
    expect(store.isDark()).toBe(true);
    TestBed.tick();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('applies base and radius as data-attributes on <html>', () => {
    const store = TestBed.inject(ThemeStore);
    store.setBase('stone');
    store.setRadius('1');
    TestBed.tick();
    expect(document.documentElement.getAttribute('data-base')).toBe('stone');
    expect(document.documentElement.getAttribute('data-radius')).toBe('1');
  });

  it('omits the default base attribute (keeps :root defaults)', () => {
    const store = TestBed.inject(ThemeStore);
    store.setBase('stone');
    store.setBase('neutral');
    TestBed.tick();
    expect(document.documentElement.getAttribute('data-base')).toBeNull();
  });

  it('exports a complete, paste-ready stylesheet', () => {
    const store = TestBed.inject(ThemeStore);
    const css = store.exportCss();
    expect(css).toContain('@theme inline');
    expect(css).toContain(':root {');
    expect(css).toContain('.dark {');
  });

  it('reset restores the defaults', () => {
    const store = TestBed.inject(ThemeStore);
    store.setBase('zinc');
    store.setMode('dark');
    store.reset();
    expect(store.base()).toBe('neutral');
    expect(store.isDark()).toBe(false);
  });
});

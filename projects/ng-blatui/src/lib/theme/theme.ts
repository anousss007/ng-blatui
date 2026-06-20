import { isPlatformBrowser } from '@angular/common';
import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

/** Every token the `@theme inline` mapping references — emitted into `:root` on export. */
export const THEME_TOKENS = [
  '--radius',
  '--spacing',
  '--tracking-normal',
  '--font-sans',
  '--font-serif',
  '--font-mono',
  '--shadow-2xs',
  '--shadow-xs',
  '--shadow-sm',
  '--shadow',
  '--shadow-md',
  '--shadow-lg',
  '--shadow-xl',
  '--shadow-2xl',
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--input',
  '--ring',
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
  '--sidebar',
  '--sidebar-foreground',
  '--sidebar-primary',
  '--sidebar-primary-foreground',
  '--sidebar-accent',
  '--sidebar-accent-foreground',
  '--sidebar-border',
  '--sidebar-ring',
] as const;

const THEME_SCAFFOLD = `@import 'tailwindcss';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono: var(--font-mono);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --spacing: var(--spacing);

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}`;

interface ThemeState {
  mode: ThemeMode;
  base: string;
  preset: string;
  radius: string;
  font: string;
  fontHeading: string;
  shadow: string;
  spacing: string;
  tracking: string;
  inputStyle: string;
}

const DEFAULTS: ThemeState = {
  mode: 'light',
  base: 'neutral',
  preset: 'default',
  radius: '0.625',
  font: 'sans',
  fontHeading: 'sans',
  shadow: 'default',
  spacing: 'default',
  tracking: 'normal',
  inputStyle: 'outline',
};

/**
 * Live theme engine (the brain behind `<bui-theme-customizer>`). Mirrors BlatUI:
 * every dimension just toggles a `data-*` attribute / the `.dark` class on `<html>`,
 * and `blatui.css` holds all the token values. `exportCss()` serialises the active
 * theme to a paste-ready stylesheet. SSR-safe and persisted to localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly mode = signal<ThemeMode>(DEFAULTS.mode);
  readonly base = signal(DEFAULTS.base);
  readonly preset = signal(DEFAULTS.preset);
  readonly radius = signal(DEFAULTS.radius);
  readonly font = signal(DEFAULTS.font);
  readonly fontHeading = signal(DEFAULTS.fontHeading);
  readonly shadow = signal(DEFAULTS.shadow);
  readonly spacing = signal(DEFAULTS.spacing);
  readonly tracking = signal(DEFAULTS.tracking);
  readonly inputStyle = signal(DEFAULTS.inputStyle);

  private readonly systemDark = signal(false);
  readonly isDark = computed(
    () => this.mode() === 'dark' || (this.mode() === 'system' && this.systemDark()),
  );

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    this.load();
    const mql =
      typeof globalThis.matchMedia === 'function'
        ? globalThis.matchMedia('(prefers-color-scheme: dark)')
        : null;
    if (mql) {
      this.systemDark.set(mql.matches);
      mql.addEventListener('change', (event) => {
        this.systemDark.set(event.matches);
      });
    }
    effect(() => {
      this.apply();
    });
  }

  setMode(value: ThemeMode): void {
    this.mode.set(value);
  }
  setBase(value: string): void {
    this.base.set(value);
  }
  setPreset(value: string): void {
    this.preset.set(value);
  }
  setRadius(value: string): void {
    this.radius.set(value);
  }
  setFont(value: string): void {
    this.font.set(value);
  }
  setFontHeading(value: string): void {
    this.fontHeading.set(value);
  }
  setShadow(value: string): void {
    this.shadow.set(value);
  }
  setSpacing(value: string): void {
    this.spacing.set(value);
  }
  setTracking(value: string): void {
    this.tracking.set(value);
  }
  setInputStyle(value: string): void {
    this.inputStyle.set(value);
  }

  toggle(): void {
    this.setMode(this.isDark() ? 'light' : 'dark');
  }

  reset(): void {
    this.mode.set(DEFAULTS.mode);
    this.base.set(DEFAULTS.base);
    this.preset.set(DEFAULTS.preset);
    this.radius.set(DEFAULTS.radius);
    this.font.set(DEFAULTS.font);
    this.fontHeading.set(DEFAULTS.fontHeading);
    this.shadow.set(DEFAULTS.shadow);
    this.spacing.set(DEFAULTS.spacing);
    this.tracking.set(DEFAULTS.tracking);
    this.inputStyle.set(DEFAULTS.inputStyle);
  }

  /** Serialise the active theme to a complete, paste-ready stylesheet. */
  exportCss(): string {
    if (!this.isBrowser) {
      return '';
    }
    const root = document.documentElement;
    const wasDark = root.classList.contains('dark');
    root.classList.remove('dark');
    const light = this.readTokens();
    root.classList.add('dark');
    const dark = this.readTokens();
    root.classList.toggle('dark', wasDark);

    const block = (source: Record<string, string>, keys: readonly string[]): string =>
      keys
        .filter((token) => source[token])
        .map((token) => `  ${token}: ${source[token] ?? ''};`)
        .join('\n');
    const darkKeys = THEME_TOKENS.filter((token) => dark[token] && dark[token] !== light[token]);
    return `${THEME_SCAFFOLD}\n\n:root {\n${block(light, THEME_TOKENS)}\n}\n\n.dark {\n${block(dark, darkKeys)}\n}\n`;
  }

  private readTokens(): Record<string, string> {
    const cs = getComputedStyle(document.documentElement);
    const out: Record<string, string> = {};
    for (const token of THEME_TOKENS) {
      out[token] = cs.getPropertyValue(token).trim();
    }
    return out;
  }

  private load(): void {
    const read = (key: string, fallback: string): string =>
      localStorage.getItem(`theme:${key}`) ?? fallback;
    this.mode.set(read('mode', DEFAULTS.mode) as ThemeMode);
    this.base.set(read('base', DEFAULTS.base));
    this.preset.set(read('preset', DEFAULTS.preset));
    this.radius.set(read('radius', DEFAULTS.radius));
    this.font.set(read('font', DEFAULTS.font));
    this.fontHeading.set(read('fontHeading', DEFAULTS.fontHeading));
    this.shadow.set(read('shadow', DEFAULTS.shadow));
    this.spacing.set(read('spacing', DEFAULTS.spacing));
    this.tracking.set(read('tracking', DEFAULTS.tracking));
    this.inputStyle.set(read('inputStyle', DEFAULTS.inputStyle));
  }

  private apply(): void {
    const root = document.documentElement;
    const state: ThemeState = {
      mode: this.mode(),
      base: this.base(),
      preset: this.preset(),
      radius: this.radius(),
      font: this.font(),
      fontHeading: this.fontHeading(),
      shadow: this.shadow(),
      spacing: this.spacing(),
      tracking: this.tracking(),
      inputStyle: this.inputStyle(),
    };
    root.classList.toggle('dark', this.isDark());
    this.attr(root, 'data-base', state.base, DEFAULTS.base);
    this.attr(root, 'data-theme', state.preset, DEFAULTS.preset);
    this.attr(root, 'data-font', state.font, DEFAULTS.font);
    this.attr(root, 'data-font-heading', state.fontHeading, DEFAULTS.fontHeading);
    this.attr(root, 'data-shadow', state.shadow, DEFAULTS.shadow);
    this.attr(root, 'data-spacing', state.spacing, DEFAULTS.spacing);
    this.attr(root, 'data-tracking', state.tracking, DEFAULTS.tracking);
    this.attr(root, 'data-input-style', state.inputStyle, DEFAULTS.inputStyle);
    root.setAttribute('data-radius', state.radius);

    for (const [key, value] of Object.entries(state) as [string, string][]) {
      localStorage.setItem(`theme:${key}`, value);
    }
  }

  private attr(root: HTMLElement, name: string, value: string, fallback: string): void {
    if (value && value !== fallback) {
      root.setAttribute(name, value);
    } else {
      root.removeAttribute(name);
    }
  }
}

import { Component, computed, inject, signal } from '@angular/core';

import { BuiButton } from '../button/button';

import { type ThemeMode, ThemeStore } from './theme';

interface Option<T extends string = string> {
  readonly value: T;
  readonly label: string;
}
interface Swatch {
  readonly value: string;
  readonly color: string;
}
interface FontOption {
  readonly value: string;
  readonly label: string;
  readonly family: string;
}

const FONTS: readonly FontOption[] = [
  { value: 'sans', label: 'Default', family: "'Instrument Sans', sans-serif" },
  { value: 'inter', label: 'Inter', family: "'Inter', sans-serif" },
  { value: 'geist', label: 'Geist', family: "'Geist', sans-serif" },
  { value: 'manrope', label: 'Manrope', family: "'Manrope', sans-serif" },
  { value: 'jakarta', label: 'Jakarta', family: "'Plus Jakarta Sans', sans-serif" },
  { value: 'space-grotesk', label: 'Grotesk', family: "'Space Grotesk', sans-serif" },
  { value: 'dm-sans', label: 'DM Sans', family: "'DM Sans', sans-serif" },
  { value: 'outfit', label: 'Outfit', family: "'Outfit', sans-serif" },
  { value: 'sora', label: 'Sora', family: "'Sora', sans-serif" },
  { value: 'system', label: 'System', family: 'system-ui, sans-serif' },
  { value: 'serif', label: 'Serif', family: 'ui-serif, Georgia, serif' },
  { value: 'mono', label: 'Mono', family: 'ui-monospace, monospace' },
];

/**
 * BlatUI's "Customize" toolbar, ported to Angular. Tunes every theme dimension
 * live (mode, base, accent, radius, input style, fonts, shadow, spacing, tracking)
 * through {@link ThemeStore}, then exports a paste-ready stylesheet via "Copy CSS".
 */
@Component({
  selector: 'bui-theme-customizer',
  imports: [BuiButton],
  host: { 'data-slot': 'theme-customizer' },
  template: `
    <button
      buiButton
      variant="outline"
      size="sm"
      class="fixed right-4 bottom-4 z-50 shadow-md"
      [attr.aria-expanded]="open()"
      (click)="open.set(!open())"
    >
      {{ open() ? 'Close' : 'Customize' }}
    </button>

    @if (open()) {
      <div
        role="dialog"
        aria-label="Theme customizer"
        class="fixed right-4 bottom-16 z-50 max-h-[80vh] w-[340px] space-y-5 overflow-y-auto rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-semibold">Customize</h4>
            <p class="text-xs text-muted-foreground">
              Tune it live. Every preset is pure CSS variables.
            </p>
          </div>
          <button buiButton variant="ghost" size="sm" (click)="theme.reset()">Reset</button>
        </div>

        <!-- Mode -->
        <div class="space-y-1.5">
          <span class="text-xs font-medium">Mode</span>
          <div class="grid grid-cols-3 gap-2">
            @for (m of modes; track m.value) {
              <button
                type="button"
                class="inline-flex h-8 items-center justify-center rounded-md border border-input text-xs font-medium transition-colors hover:bg-accent data-[active=true]:border-primary data-[active=true]:bg-accent"
                [attr.data-active]="theme.mode() === m.value"
                (click)="theme.setMode(m.value)"
              >
                {{ m.label }}
              </button>
            }
          </div>
        </div>

        <!-- Base color -->
        <div class="space-y-1.5">
          <span class="text-xs font-medium">Base color</span>
          <div class="grid grid-cols-9 gap-2">
            @for (b of bases; track b.value) {
              <button
                type="button"
                class="flex h-8 items-center justify-center rounded-md border border-input ring-offset-2 ring-offset-background transition-all data-[active=true]:ring-2 data-[active=true]:ring-ring"
                [style.background]="b.color"
                [attr.data-active]="theme.base() === b.value"
                (click)="theme.setBase(b.value)"
              >
                <span class="sr-only">{{ b.value }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Accent -->
        <div class="space-y-1.5">
          <span class="text-xs font-medium">Accent</span>
          <div class="grid grid-cols-6 gap-2">
            @for (a of accents; track a.value) {
              <button
                type="button"
                class="flex h-8 items-center justify-center rounded-md border border-input ring-offset-2 ring-offset-background transition-all data-[active=true]:ring-2 data-[active=true]:ring-ring"
                [style.background]="a.color"
                [attr.data-active]="theme.preset() === a.value"
                (click)="theme.setPreset(a.value)"
              >
                <span class="sr-only">{{ a.value }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Radius -->
        <div class="space-y-1.5">
          <span class="text-xs font-medium">Radius</span>
          <div class="grid grid-cols-6 gap-2">
            @for (r of radii; track r) {
              <button
                type="button"
                class="inline-flex h-8 items-center justify-center rounded-md border border-input text-xs font-medium transition-colors hover:bg-accent data-[active=true]:border-primary data-[active=true]:bg-accent"
                [attr.data-active]="theme.radius() === r"
                (click)="theme.setRadius(r)"
              >
                {{ r }}
              </button>
            }
          </div>
        </div>

        <!-- Input style -->
        <div class="space-y-1.5">
          <span class="text-xs font-medium">Input style</span>
          <div class="grid grid-cols-3 gap-2">
            @for (i of inputStyles; track i.value) {
              <button
                type="button"
                class="inline-flex h-8 items-center justify-center rounded-md border border-input text-xs font-medium transition-colors hover:bg-accent data-[active=true]:border-primary data-[active=true]:bg-accent"
                [attr.data-active]="theme.inputStyle() === i.value"
                (click)="theme.setInputStyle(i.value)"
              >
                {{ i.label }}
              </button>
            }
          </div>
        </div>

        <!-- Body font -->
        <div class="space-y-1.5">
          <span class="text-xs font-medium">Body font</span>
          <div class="grid grid-cols-3 gap-2">
            @for (f of fonts; track f.value) {
              <button
                type="button"
                class="inline-flex h-8 items-center justify-center rounded-md border border-input text-xs font-medium transition-colors hover:bg-accent data-[active=true]:border-primary data-[active=true]:bg-accent"
                [style.fontFamily]="f.family"
                [attr.data-active]="theme.font() === f.value"
                (click)="theme.setFont(f.value)"
              >
                {{ f.label }}
              </button>
            }
          </div>
        </div>

        <!-- Heading font -->
        <div class="space-y-1.5">
          <span class="text-xs font-medium">Heading font</span>
          <div class="grid grid-cols-3 gap-2">
            @for (f of fonts; track f.value) {
              <button
                type="button"
                class="inline-flex h-8 items-center justify-center rounded-md border border-input text-xs font-medium transition-colors hover:bg-accent data-[active=true]:border-primary data-[active=true]:bg-accent"
                [style.fontFamily]="f.family"
                [attr.data-active]="theme.fontHeading() === f.value"
                (click)="theme.setFontHeading(f.value)"
              >
                {{ f.label }}
              </button>
            }
          </div>
        </div>

        <!-- Shadow -->
        <div class="space-y-1.5">
          <span class="text-xs font-medium">Shadow</span>
          <div class="grid grid-cols-5 gap-2">
            @for (s of shadows; track s.value) {
              <button
                type="button"
                class="inline-flex h-8 items-center justify-center rounded-md border border-input text-xs font-medium transition-colors hover:bg-accent data-[active=true]:border-primary data-[active=true]:bg-accent"
                [attr.data-active]="theme.shadow() === s.value"
                (click)="theme.setShadow(s.value)"
              >
                {{ s.label }}
              </button>
            }
          </div>
        </div>

        <!-- Spacing + Tracking -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <span class="text-xs font-medium">Spacing</span>
            <div class="grid grid-cols-3 gap-1.5">
              @for (s of spacings; track s.value) {
                <button
                  type="button"
                  class="inline-flex h-8 items-center justify-center rounded-md border border-input text-xs font-medium transition-colors hover:bg-accent data-[active=true]:border-primary data-[active=true]:bg-accent"
                  [attr.data-active]="theme.spacing() === s.value"
                  (click)="theme.setSpacing(s.value)"
                >
                  {{ s.label }}
                </button>
              }
            </div>
          </div>
          <div class="space-y-1.5">
            <span class="text-xs font-medium">Tracking</span>
            <div class="grid grid-cols-3 gap-1.5">
              @for (t of trackings; track t.value) {
                <button
                  type="button"
                  class="inline-flex h-8 items-center justify-center rounded-md border border-input text-xs font-medium transition-colors hover:bg-accent data-[active=true]:border-primary data-[active=true]:bg-accent"
                  [attr.data-active]="theme.tracking() === t.value"
                  (click)="theme.setTracking(t.value)"
                >
                  {{ t.label }}
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Export -->
        <div class="border-t pt-4">
          <p class="mb-2.5 text-xs leading-relaxed text-muted-foreground">
            Copy your complete theme and paste it as your app stylesheet — the Tailwind import,
            every token and the
            <code class="rounded bg-muted px-1 py-0.5 text-[11px]">&#64;theme</code>
            mapping are included.
          </p>
          <button buiButton size="sm" class="w-full" (click)="copyCss()">
            {{ copied() ? 'Copied to clipboard' : 'Copy theme CSS' }}
          </button>
        </div>
      </div>
    }
  `,
})
export class BuiThemeCustomizer {
  protected readonly theme = inject(ThemeStore);
  protected readonly open = signal(false);
  protected readonly copied = signal(false);

  protected readonly modes: readonly Option<ThemeMode>[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];
  protected readonly bases: readonly Swatch[] = [
    { value: 'neutral', color: 'oklch(0.205 0 0)' },
    { value: 'stone', color: 'oklch(0.216 0.006 56.043)' },
    { value: 'zinc', color: 'oklch(0.21 0.006 285.885)' },
    { value: 'slate', color: 'oklch(0.208 0.042 265.755)' },
    { value: 'gray', color: 'oklch(0.21 0.034 264.665)' },
    { value: 'mauve', color: 'oklch(0.212 0.019 322.12)' },
    { value: 'olive', color: 'oklch(0.228 0.013 107.4)' },
    { value: 'mist', color: 'oklch(0.218 0.008 223.9)' },
    { value: 'taupe', color: 'oklch(0.214 0.009 43.1)' },
  ];
  protected readonly accents: readonly Swatch[] = [
    { value: 'default', color: 'var(--primary)' },
    { value: 'blue', color: 'oklch(0.488 0.243 264.376)' },
    { value: 'indigo', color: 'oklch(0.457 0.24 277.023)' },
    { value: 'violet', color: 'oklch(0.491 0.27 292.581)' },
    { value: 'purple', color: 'oklch(0.496 0.265 301.924)' },
    { value: 'fuchsia', color: 'oklch(0.518 0.253 323.949)' },
    { value: 'pink', color: 'oklch(0.525 0.223 3.958)' },
    { value: 'rose', color: 'oklch(0.514 0.222 16.935)' },
    { value: 'red', color: 'oklch(0.505 0.213 27.518)' },
    { value: 'orange', color: 'oklch(0.553 0.195 38.402)' },
    { value: 'amber', color: 'oklch(0.555 0.163 48.998)' },
    { value: 'green', color: 'oklch(0.527 0.154 150.069)' },
    { value: 'emerald', color: 'oklch(0.508 0.118 165.612)' },
    { value: 'teal', color: 'oklch(0.511 0.096 186.391)' },
    { value: 'cyan', color: 'oklch(0.52 0.105 223.128)' },
    { value: 'sky', color: 'oklch(0.5 0.134 242.749)' },
  ];
  protected readonly radii: readonly string[] = ['0', '0.3', '0.5', '0.625', '0.75', '1'];
  protected readonly inputStyles: readonly Option[] = [
    { value: 'outline', label: 'Outline' },
    { value: 'fill', label: 'Fill' },
    { value: 'inset', label: 'Inset' },
  ];
  protected readonly fonts = FONTS;
  protected readonly shadows: readonly Option[] = [
    { value: 'none', label: 'None' },
    { value: 'sm', label: 'SM' },
    { value: 'default', label: 'Base' },
    { value: 'lg', label: 'LG' },
    { value: 'xl', label: 'XL' },
  ];
  protected readonly spacings: readonly Option[] = [
    { value: 'compact', label: 'S' },
    { value: 'default', label: 'M' },
    { value: 'comfortable', label: 'L' },
  ];
  protected readonly trackings: readonly Option[] = [
    { value: 'tight', label: 'S' },
    { value: 'normal', label: 'M' },
    { value: 'wide', label: 'L' },
  ];

  protected readonly _hasClipboard = computed(
    () => typeof navigator !== 'undefined' && !!navigator.clipboard,
  );

  protected async copyCss(): Promise<void> {
    if (!this._hasClipboard()) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.theme.exportCss());
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    } catch {
      // Clipboard unavailable / permission denied — silently ignore.
    }
  }
}

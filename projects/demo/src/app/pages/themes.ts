import { Component, computed, inject, signal } from '@angular/core';

import {
  BuiAlert,
  BuiAvatar,
  BuiBadge,
  BuiButton,
  BuiCard,
  BuiCardContent,
  BuiCardDescription,
  BuiCardHeader,
  BuiCardTitle,
  BuiField,
  BuiFieldLabel,
  BuiInput,
  BuiSeparator,
  BuiSwitch,
  type ThemeMode,
  ThemeStore,
} from 'ng-blatui';

interface Option<T extends string = string> {
  readonly value: T;
  readonly label: string;
}
interface Swatch {
  readonly value: string;
  readonly color: string;
}

/** A full theme-editor page — mirrors BlatUI's /themes. Tunes every theme dimension live. */
@Component({
  selector: 'app-themes',
  imports: [
    BuiButton,
    BuiBadge,
    BuiCard,
    BuiCardHeader,
    BuiCardTitle,
    BuiCardDescription,
    BuiCardContent,
    BuiInput,
    BuiField,
    BuiFieldLabel,
    BuiSwitch,
    BuiAvatar,
    BuiAlert,
    BuiSeparator,
  ],
  templateUrl: './themes.html',
})
export class Themes {
  protected readonly theme = inject(ThemeStore);
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
  protected readonly fonts: readonly Option[] = [
    { value: 'sans', label: 'Default' },
    { value: 'inter', label: 'Inter' },
    { value: 'geist', label: 'Geist' },
    { value: 'manrope', label: 'Manrope' },
    { value: 'space-grotesk', label: 'Grotesk' },
    { value: 'serif', label: 'Serif' },
    { value: 'mono', label: 'Mono' },
  ];
  protected readonly shadows: readonly Option[] = [
    { value: 'none', label: 'None' },
    { value: 'sm', label: 'SM' },
    { value: 'default', label: 'Base' },
    { value: 'lg', label: 'LG' },
    { value: 'xl', label: 'XL' },
  ];
  protected readonly spacings: readonly Option[] = [
    { value: 'compact', label: 'Compact' },
    { value: 'default', label: 'Default' },
    { value: 'comfortable', label: 'Comfortable' },
  ];
  protected readonly trackings: readonly Option[] = [
    { value: 'tight', label: 'Tight' },
    { value: 'normal', label: 'Normal' },
    { value: 'wide', label: 'Wide' },
  ];

  private readonly hasClipboard = computed(
    () => typeof navigator !== 'undefined' && !!navigator.clipboard,
  );

  protected async copyCss(): Promise<void> {
    if (!this.hasClipboard()) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.theme.exportCss());
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    } catch {
      // Clipboard unavailable — ignore.
    }
  }
}

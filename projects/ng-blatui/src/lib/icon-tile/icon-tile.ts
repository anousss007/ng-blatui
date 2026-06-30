import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

const ICON_TILE_TONES = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success dark:bg-success/15',
  warning: 'bg-warning/10 text-warning dark:bg-warning/15',
  info: 'bg-info/10 text-info dark:bg-info/15',
  destructive: 'bg-destructive/10 text-destructive dark:bg-destructive/15',
  muted: 'bg-muted text-foreground',
  'chart-1': 'bg-chart-1/10 text-chart-1',
  'chart-2': 'bg-chart-2/10 text-chart-2',
  'chart-3': 'bg-chart-3/10 text-chart-3',
  'chart-4': 'bg-chart-4/10 text-chart-4',
  'chart-5': 'bg-chart-5/10 text-chart-5',
} as const;

const ICON_TILE_SIZES = {
  sm: 'size-8 [&_svg]:size-4',
  default: 'size-10 [&_svg]:size-5',
  lg: 'size-12 [&_svg]:size-6',
} as const;

const ICON_TILE_SHAPES = {
  sm: 'rounded-md',
  default: 'rounded-lg',
  lg: 'rounded-xl',
} as const;

/** Tone of the icon tile's tinted background + foreground. */
export type IconTileTone = keyof typeof ICON_TILE_TONES;
/** Preset square size of the icon tile. */
export type IconTileSize = keyof typeof ICON_TILE_SIZES;
/** Tile shape: a rounded square (default) or a full circle. */
export type IconTileShape = 'square' | 'circle';

/**
 * A tinted rounded square that frames a projected icon — the small "tile" used
 * across dashboards for stat-card leading icons, list-row markers, feature
 * bullets, etc. Project an icon (e.g. an inline `<svg>`) as its content; the
 * tile sizes it automatically.
 */
@Component({
  selector: 'bui-icon-tile',
  host: { 'data-slot': 'icon-tile', '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class BuiIconTile {
  /** Colour tone (semantic or chart palette). */
  readonly tone = input<IconTileTone>('primary');
  /** Square size preset. */
  readonly size = input<IconTileSize>('default');
  /** Tile shape — a rounded square (default) or a full circle. */
  readonly shape = input<IconTileShape>('square');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly computedClass = computed(() =>
    cn(
      'inline-flex shrink-0 items-center justify-center',
      ICON_TILE_SIZES[this.size()],
      this.shape() === 'circle' ? 'rounded-full' : ICON_TILE_SHAPES[this.size()],
      ICON_TILE_TONES[this.tone()],
      this.userClass(),
    ),
  );
}

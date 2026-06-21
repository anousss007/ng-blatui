import { Component, computed, input } from '@angular/core';

export interface Slice {
  readonly label: string;
  readonly value: number;
  readonly color: string;
}
export interface RadarSeries {
  readonly name: string;
  readonly data: number[];
  readonly color: string;
}

export const PALETTE = [
  'oklch(0.62 0.19 259)',
  'oklch(0.65 0.18 145)',
  'oklch(0.7 0.17 70)',
  'oklch(0.63 0.22 17)',
  'oklch(0.6 0.2 300)',
  'oklch(0.68 0.15 195)',
  'oklch(0.6 0.21 35)',
  'oklch(0.66 0.16 110)',
];

function polar(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** A pie / donut chart drawn as SVG wedges — bui-chart has no pie type. */
@Component({
  selector: 'app-pie-chart',
  template: `
    <div class="flex flex-wrap items-center justify-center gap-6">
      <svg
        [attr.viewBox]="'0 0 100 100'"
        class="h-48 w-48 shrink-0"
        role="img"
        [attr.aria-label]="label()"
      >
        @for (seg of segments(); track seg.label) {
          <path [attr.d]="seg.d" [attr.fill]="seg.color" stroke="var(--card)" stroke-width="0.5" />
        }
        @if (donut()) {
          <circle cx="50" cy="50" r="24" fill="var(--card)" />
          @if (centerLabel()) {
            <text
              x="50"
              y="49"
              text-anchor="middle"
              class="fill-foreground"
              style="font-size:9px;font-weight:600"
            >
              {{ centerLabel() }}
            </text>
            <text
              x="50"
              y="58"
              text-anchor="middle"
              class="fill-muted-foreground"
              style="font-size:4.5px"
            >
              {{ centerSub() }}
            </text>
          }
        }
      </svg>
      @if (showLegend()) {
        <ul class="space-y-1.5 text-sm">
          @for (s of slices(); track s.label) {
            <li class="flex items-center gap-2">
              <span class="size-3 shrink-0 rounded-sm" [style.background]="s.color"></span>
              <span class="text-muted-foreground">{{ s.label }}</span>
              <span class="ml-auto font-medium tabular-nums">{{ s.value }}</span>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class PieChart {
  readonly slices = input<readonly Slice[]>([]);
  readonly donut = input(false);
  readonly showLegend = input(true);
  readonly centerLabel = input('');
  readonly centerSub = input('');
  readonly label = input('Pie chart');

  protected readonly segments = computed(() => {
    const data = this.slices();
    const total = data.reduce((sum, s) => sum + s.value, 0) || 1;
    let angle = 0;
    return data.map((s) => {
      const start = angle;
      const sweep = Math.min(359.99, (s.value / total) * 360);
      angle += (s.value / total) * 360;
      const p0 = polar(50, 50, 45, start);
      const p1 = polar(50, 50, 45, start + sweep);
      const large = sweep > 180 ? 1 : 0;
      const d = `M 50 50 L ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A 45 45 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} Z`;
      return { d, color: s.color, label: s.label };
    });
  });
}

/** A radial-bar chart (concentric value arcs) drawn as SVG — bui-chart has no radial type. */
@Component({
  selector: 'app-radial-chart',
  template: `
    <div class="flex flex-wrap items-center justify-center gap-6">
      <svg viewBox="0 0 100 100" class="h-48 w-48 shrink-0" role="img" [attr.aria-label]="label()">
        <g transform="rotate(-90 50 50)">
          @for (ring of rings(); track ring.label) {
            <circle
              cx="50"
              cy="50"
              [attr.r]="ring.r"
              fill="none"
              stroke="var(--muted)"
              [attr.stroke-width]="ring.width"
            />
            <circle
              cx="50"
              cy="50"
              [attr.r]="ring.r"
              fill="none"
              [attr.stroke]="ring.color"
              [attr.stroke-width]="ring.width"
              stroke-linecap="round"
              [attr.stroke-dasharray]="ring.dash"
            />
          }
        </g>
        @if (centerLabel()) {
          <text
            x="50"
            y="49"
            text-anchor="middle"
            class="fill-foreground"
            style="font-size:9px;font-weight:600"
          >
            {{ centerLabel() }}
          </text>
          <text
            x="50"
            y="58"
            text-anchor="middle"
            class="fill-muted-foreground"
            style="font-size:4.5px"
          >
            {{ centerSub() }}
          </text>
        }
      </svg>
      @if (showLegend()) {
        <ul class="space-y-1.5 text-sm">
          @for (s of slices(); track s.label) {
            <li class="flex items-center gap-2">
              <span class="size-3 shrink-0 rounded-sm" [style.background]="s.color"></span>
              <span class="text-muted-foreground">{{ s.label }}</span>
              <span class="ml-auto font-medium tabular-nums">{{ s.value }}</span>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class RadialChart {
  readonly slices = input<readonly Slice[]>([]);
  readonly showLegend = input(true);
  readonly centerLabel = input('');
  readonly centerSub = input('');
  readonly label = input('Radial chart');

  protected readonly rings = computed(() => {
    const data = this.slices();
    const width = 7;
    const gap = 2;
    return data.map((s, index) => {
      const r = 42 - index * (width + gap);
      const circ = 2 * Math.PI * r;
      const frac = Math.max(0, Math.min(100, s.value)) / 100;
      return {
        label: s.label,
        r,
        width,
        color: s.color,
        dash: `${(circ * frac).toFixed(2)} ${(circ * (1 - frac)).toFixed(2)}`,
      };
    });
  });
}

/** A radar chart (polar grid + filled polygons) drawn as SVG — bui-chart has no radar type. */
@Component({
  selector: 'app-radar-chart',
  template: `
    <div class="flex flex-wrap items-center justify-center gap-6">
      <svg viewBox="0 0 100 100" class="h-56 w-56 shrink-0" role="img" [attr.aria-label]="label()">
        <!-- grid rings -->
        @for (ring of gridRings(); track ring) {
          <polygon [attr.points]="ring" fill="none" stroke="var(--border)" stroke-width="0.4" />
        }
        <!-- spokes -->
        @for (spoke of spokes(); track $index) {
          <line
            x1="50"
            y1="50"
            [attr.x2]="spoke.x"
            [attr.y2]="spoke.y"
            stroke="var(--border)"
            stroke-width="0.4"
          />
        }
        <!-- series -->
        @for (poly of polygons(); track poly.name) {
          <polygon
            [attr.points]="poly.points"
            [attr.fill]="poly.fill"
            [attr.stroke]="poly.color"
            stroke-width="1"
          />
        }
      </svg>
      @if (showLegend()) {
        <ul class="space-y-1.5 text-sm">
          @for (s of series(); track s.name) {
            <li class="flex items-center gap-2">
              <span class="size-3 shrink-0 rounded-sm" [style.background]="s.color"></span>
              <span class="text-muted-foreground">{{ s.name }}</span>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class RadarChart {
  readonly axes = input<readonly string[]>([]);
  readonly series = input<readonly RadarSeries[]>([]);
  readonly showLegend = input(true);
  readonly label = input('Radar chart');

  private readonly maxR = 42;

  protected readonly spokes = computed(() =>
    this.axes().map((_, index) => polar(50, 50, this.maxR, (index * 360) / this.axes().length)),
  );

  protected readonly gridRings = computed(() => {
    const n = this.axes().length || 1;
    return [0.25, 0.5, 0.75, 1].map((f) =>
      Array.from({ length: n }, (_, index) => {
        const p = polar(50, 50, this.maxR * f, (index * 360) / n);
        return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
      }).join(' '),
    );
  });

  protected readonly polygons = computed(() => {
    const n = this.axes().length || 1;
    return this.series().map((s) => {
      const points = s.data
        .map((v, index) => {
          const p = polar(
            50,
            50,
            (Math.max(0, Math.min(100, v)) / 100) * this.maxR,
            (index * 360) / n,
          );
          return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
        })
        .join(' ');
      return {
        name: s.name,
        points,
        color: s.color,
        fill: s.color.replace(')', ' / 0.2)').replace('oklch(', 'oklch('),
      };
    });
  });
}

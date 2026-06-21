import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';

import { type ClassValue, cn } from '../utils/cn';

/** A keyless OpenStreetMap embed centred on a coordinate. SSR-safe. */
@Component({
  selector: 'bui-map',
  host: { 'data-slot': 'map', '[class]': 'computedClass()' },
  template: `
    <div
      class="relative overflow-hidden rounded-lg border"
      [style.aspect-ratio]="ratio() || null"
      [style.height.px]="ratio() ? null : height()"
    >
      <iframe
        [src]="embedUrl()"
        [title]="label()"
        class="size-full border-0"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
    <a
      [href]="largeUrl()"
      target="_blank"
      rel="noopener"
      class="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"
    >
      <svg
        class="size-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
      View larger map
    </a>
  `,
})
export class BuiMap {
  readonly lat = input(50.8503);
  readonly lon = input(4.3517);
  readonly zoom = input(14);
  readonly label = input('Location');
  readonly marker = input(true);
  readonly height = input(320);
  readonly ratio = input('');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  private readonly sanitizer = inject(DomSanitizer);
  protected readonly computedClass = computed(() => cn('block', this.userClass()));
  protected readonly embedUrl = computed<SafeResourceUrl>(() => {
    const delta = 0.01 * 2 ** (14 - this.zoom());
    const lat = this.lat();
    const lon = this.lon();
    const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
    const pin = this.marker() ? `&marker=${lat},${lon}` : '';
    // eslint-disable-next-line sonarjs/no-angular-bypass-sanitization -- fixed OSM origin; only numeric coords are interpolated
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${pin}`,
    );
  });
  protected readonly largeUrl = computed(
    () =>
      `https://www.openstreetmap.org/?mlat=${this.lat()}&mlon=${this.lon()}#map=${this.zoom()}/${this.lat()}/${this.lon()}`,
  );
}

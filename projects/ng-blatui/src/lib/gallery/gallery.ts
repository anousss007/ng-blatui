import { Component, computed, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

export interface GalleryImage {
  src: string;
  alt?: string;
}

const COLUMNS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

/** A responsive thumbnail grid. */
@Component({
  selector: 'bui-gallery',
  host: { 'data-slot': 'gallery', '[class]': 'computedClass()' },
  template: `
    @for (image of normalized(); track $index) {
      <img [src]="image.src" [alt]="image.alt" loading="lazy" [class]="imageClass()" />
    }
  `,
})
export class BuiGallery {
  readonly images = input<readonly (string | GalleryImage)[]>([]);
  readonly columns = input(3);
  readonly rounded = input('rounded-lg');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly normalized = computed(() =>
    this.images().map((image) =>
      typeof image === 'string'
        ? { src: image, alt: '' }
        : { src: image.src, alt: image.alt ?? '' },
    ),
  );
  protected readonly imageClass = computed(() =>
    cn('aspect-square w-full object-cover', this.rounded()),
  );
  protected readonly computedClass = computed(() =>
    cn('grid gap-2', COLUMNS[this.columns()], this.userClass()),
  );
}

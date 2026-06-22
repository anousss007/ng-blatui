import { Component, computed, input } from '@angular/core';

import { BuiAvatar } from '../avatar/avatar';
import { type ClassValue, cn } from '../utils/cn';

export interface GroupAvatar {
  /** Image URL for the avatar; omit to render initials from `name`. */
  src?: string;
  /** Display name used for initials and the image alt text. */
  name?: string;
}

const SIZES = {
  sm: { box: 'size-6', overlap: '-ms-2', ring: 'ring-1', text: 'text-xs' },
  default: { box: 'size-8', overlap: '-ms-2.5', ring: 'ring-2', text: 'text-sm' },
  lg: { box: 'size-12', overlap: '-ms-3', ring: 'ring-2', text: 'text-base' },
} as const;

function initials(name: string | undefined): string {
  const trimmed = (name ?? '').trim();
  if (trimmed === '') {
    return '?';
  }
  const parts = trimmed.split(/\s+/);
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

/** Overlapping stack of avatars with an optional "+N" overflow counter. */
@Component({
  selector: 'bui-avatar-group',
  imports: [BuiAvatar],
  host: { 'data-slot': 'avatar-group', role: 'list', '[class]': 'computedClass()' },
  template: `
    @for (avatar of shown(); track $index) {
      <bui-avatar
        role="listitem"
        [src]="avatar.src ?? null"
        [alt]="avatar.name ?? 'User avatar'"
        [class]="itemClass($index)"
        >{{ toInitials(avatar.name) }}</bui-avatar
      >
    }
    @if (remaining() > 0) {
      <span
        role="listitem"
        [attr.aria-label]="'and ' + remaining() + ' more'"
        [class]="moreClass()"
      >
        <span aria-hidden="true">+{{ remaining() }}</span>
      </span>
    }
  `,
})
export class BuiAvatarGroup {
  /** Avatars to display, in order. */
  readonly avatars = input<readonly GroupAvatar[]>([]);
  /** Maximum avatars shown before the rest collapse into a "+N" counter. */
  readonly max = input(4);
  /** Avatar size preset, which also controls overlap and ring width. */
  readonly size = input<keyof typeof SIZES>('default');
  readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly shown = computed(() => this.avatars().slice(0, Math.max(0, this.max())));
  protected readonly remaining = computed(() =>
    Math.max(0, this.avatars().length - this.shown().length),
  );
  protected readonly computedClass = computed(() => cn('flex items-center', this.userClass()));

  protected readonly toInitials = initials;

  protected itemClass(index: number): string {
    const size = SIZES[this.size()];
    return cn(size.box, size.ring, 'ring-background', index > 0 && size.overlap);
  }

  protected moreClass(): string {
    const size = SIZES[this.size()];
    return cn(
      'relative z-10 flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-foreground',
      size.box,
      size.ring,
      'ring-background',
      size.text,
      this.shown().length > 0 && size.overlap,
    );
  }
}

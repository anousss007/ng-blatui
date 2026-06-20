import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with `clsx` semantics and resolve Tailwind conflicts with
 * `tailwind-merge`. The single utility every ng-blatui component uses to combine
 * its variant classes with consumer-provided ones.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export { type ClassValue } from 'clsx';

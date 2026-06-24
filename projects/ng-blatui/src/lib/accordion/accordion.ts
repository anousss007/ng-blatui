import { computed, Directive, input } from '@angular/core';

import { type ClassValue, cn } from '../utils/cn';

/**
 * Behaviour + accessibility come from Angular Aria's accordion directives
 * (`ngAccordionGroup` / `ngAccordionTrigger` / `ngAccordionPanel` / `ngAccordionContent`):
 * they own `aria-expanded`, `aria-controls`, roving focus and keyboard navigation.
 * The `bui*` directives below only add BlatUI styling, so you compose both:
 *
 * ```html
 * <div ngAccordionGroup buiAccordion [multiExpandable]="false">
 *   <div buiAccordionItem>
 *     <h3 class="flex">
 *       <button ngAccordionTrigger buiAccordionTrigger [panel]="p1">Title <svg>…</svg></button>
 *     </h3>
 *     <div ngAccordionPanel #p1="ngAccordionPanel" buiAccordionContent>
 *       <ng-template ngAccordionContent><div class="pb-4">Content</div></ng-template>
 *     </div>
 *   </div>
 * </div>
 * ```
 */
export {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
  // Re-exported so consumers importing the accordion from `ng-blatui` can resolve the
  // deferred-content symbols the Aria directives reference internally.
  ɵɵDeferredContent,
  ɵɵDeferredContentAware,
} from '@angular/aria/accordion';

const TRIGGER =
  'flex flex-1 cursor-pointer items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5 [&>svg]:text-muted-foreground [&>svg]:transition-transform [&>svg]:duration-200 [&[aria-expanded=true]>svg]:rotate-180';

@Directive({
  selector: '[buiAccordion]',
  host: { 'data-slot': 'accordion', '[class]': 'computedClass()' },
})
export class BuiAccordion {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn('w-full', this.userClass()));
}

@Directive({
  selector: '[buiAccordionItem]',
  host: { 'data-slot': 'accordion-item', '[class]': 'computedClass()' },
})
export class BuiAccordionItem {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('border-b last:border-b-0', this.userClass()),
  );
}

@Directive({
  selector: 'button[buiAccordionTrigger]',
  host: { 'data-slot': 'accordion-trigger', '[class]': 'computedClass()' },
})
export class BuiAccordionTrigger {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() => cn(TRIGGER, this.userClass()));
}

@Directive({
  selector: '[buiAccordionContent]',
  host: { 'data-slot': 'accordion-content', '[class]': 'computedClass()' },
})
export class BuiAccordionContent {
  readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly computedClass = computed(() =>
    cn('overflow-hidden text-sm', this.userClass()),
  );
}

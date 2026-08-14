import type { ConnectedPosition } from '@angular/cdk/overlay';

/**
 * Placement for a page-level panel hanging off a small trigger (a cart, a bell), in CDK
 * preference order — first that fits wins. Anchored to the trigger's end edge, because
 * these triggers sit in a header's trailing corner.
 *
 * A panel this wide rarely fits *any* of them on a phone, which is why its overlay also
 * turns on `push`: the last resort is nudging it back on screen rather than letting it hang
 * off the start edge, where nothing scrolls it into view.
 */
export const PANEL_POSITIONS: ConnectedPosition[] = [
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -8 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 },
];

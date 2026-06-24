import {
  computed,
  type EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  type Signal,
} from '@angular/core';

/**
 * Every built-in user-facing string ng-blatui renders that is *not* already a
 * component `input()` — mostly `aria-label`s on icon-only controls plus a few
 * visible micro-copy bits. Keys are namespaced by component so the same English
 * word can translate differently per context.
 *
 * Override globally with {@link provideBuiLabels} (e.g. to translate the whole
 * library once at bootstrap), or per instance via the matching component input.
 */
export interface BuiLabels {
  // back-to-top
  backToTop: string;
  // banner
  bannerDismiss: string;
  bannerAnnouncement: string;
  // cookie-consent
  cookieConsent: string;
  // pagination
  pagination: string;
  paginationMore: string;
  // resizable
  resizableHandle: string;
  // spinner
  spinnerLoading: string;
  // top-progress
  topProgressLoading: string;
  // audio-player
  audioPlayerSeek: string;
  audioPlayerPlay: string;
  audioPlayerPause: string;
  audioPlayerMute: string;
  audioPlayerUnmute: string;
  // breadcrumb
  breadcrumb: string;
  breadcrumbMore: string;
  // calendar
  calendarPreviousMonth: string;
  calendarMonth: string;
  calendarYear: string;
  calendarNextMonth: string;
  // carousel
  carouselPrevious: string;
  carouselNext: string;
  carouselGoToSlide: string;
  // code-block
  codeBlockCopy: string;
  codeBlockCopyShort: string;
  codeBlockCopied: string;
  // color-picker
  colorPickerPick: string;
  colorPickerHex: string;
  // comparison-slider
  comparisonSliderPosition: string;
  // comparison-table
  comparisonTableIncluded: string;
  comparisonTableNotIncluded: string;
  // data-table
  dataTableSearch: string;
  dataTableSelectAll: string;
  dataTableSelectRow: string;
  // dock
  dock: string;
  // file-upload
  fileUploadDropzone: string;
  fileUploadRemove: string;
  // mini-cart
  miniCartTrigger: string;
  miniCart: string;
  // notification-center
  notificationCenter: string;
  notificationCenterUnread: string;
  notificationCenterMarkAllRead: string;
  notificationCenterEmpty: string;
  // number-input
  numberInputDecrease: string;
  numberInputIncrease: string;
  // phone-input
  phoneInputCountry: string;
  phoneInputNumber: string;
  // product-card
  productCardWishlist: string;
  // prompt-input
  promptInputAttach: string;
  promptInputSend: string;
  // quantity-selector
  quantitySelectorDecrease: string;
  quantitySelectorIncrease: string;
  // repeater
  repeaterRemove: string;
  // rich-text-editor
  richTextEditorFormatting: string;
  // scrollspy
  scrollspy: string;
  // sonner
  sonner: string;
  sonnerDismiss: string;
  // theme-customizer
  themeCustomizer: string;
  // tree-table
  treeTableToggle: string;
  treeTableCopy: string;
  treeTableCopied: string;
  // video
  videoPlay: string;
}

/** Built-in English defaults — used whenever no input or provider overrides a key. */
export const BUI_DEFAULT_LABELS: BuiLabels = {
  backToTop: 'Back to top',
  bannerDismiss: 'Dismiss',
  bannerAnnouncement: 'Announcement',
  cookieConsent: 'Cookie consent',
  pagination: 'pagination',
  paginationMore: 'More pages',
  resizableHandle: 'Resize panel',
  spinnerLoading: 'Loading',
  topProgressLoading: 'Page loading',
  audioPlayerSeek: 'Seek',
  audioPlayerPlay: 'Play',
  audioPlayerPause: 'Pause',
  audioPlayerMute: 'Mute',
  audioPlayerUnmute: 'Unmute',
  breadcrumb: 'breadcrumb',
  breadcrumbMore: 'More',
  calendarPreviousMonth: 'Previous month',
  calendarMonth: 'Month',
  calendarYear: 'Year',
  calendarNextMonth: 'Next month',
  carouselPrevious: 'Previous slide',
  carouselNext: 'Next slide',
  carouselGoToSlide: 'Go to slide',
  codeBlockCopy: 'Copy code',
  codeBlockCopyShort: 'Copy',
  codeBlockCopied: 'Copied',
  colorPickerPick: 'Pick a color',
  colorPickerHex: 'Color hex value',
  comparisonSliderPosition: 'Comparison position',
  comparisonTableIncluded: 'Included',
  comparisonTableNotIncluded: 'Not included',
  dataTableSearch: 'Search',
  dataTableSelectAll: 'Select all rows',
  dataTableSelectRow: 'Select row',
  dock: 'Dock',
  fileUploadDropzone: 'Click to upload or drag & drop',
  fileUploadRemove: 'Remove file',
  miniCartTrigger: 'Cart',
  miniCart: 'Shopping cart',
  notificationCenter: 'Notifications',
  notificationCenterUnread: 'Unread',
  notificationCenterMarkAllRead: 'Mark all read',
  notificationCenterEmpty: 'No notifications',
  numberInputDecrease: 'Decrease',
  numberInputIncrease: 'Increase',
  phoneInputCountry: 'Country code',
  phoneInputNumber: 'Phone number',
  productCardWishlist: 'Add to wishlist',
  promptInputAttach: 'Attach file',
  promptInputSend: 'Send',
  quantitySelectorDecrease: 'Decrease quantity',
  quantitySelectorIncrease: 'Increase quantity',
  repeaterRemove: 'Remove row',
  richTextEditorFormatting: 'Formatting',
  scrollspy: 'On this page',
  sonner: 'Notifications',
  sonnerDismiss: 'Dismiss notification',
  themeCustomizer: 'Theme customizer',
  treeTableToggle: 'Toggle row',
  treeTableCopy: 'Copy as tree',
  treeTableCopied: 'Copied',
  videoPlay: 'Play video',
};

/**
 * App-wide overrides for {@link BuiLabels}. Set it with {@link provideBuiLabels}.
 * Components read it through {@link buiLabel}; anything left unset falls back to
 * {@link BUI_DEFAULT_LABELS}.
 */
export const BUI_LABELS = new InjectionToken<Partial<BuiLabels>>('BUI_LABELS');

/**
 * Provide global overrides (typically translations) for ng-blatui's built-in
 * labels. Add to your app config:
 *
 * ```ts
 * providers: [provideBuiLabels({ bannerDismiss: 'Fermer', fileUploadRemove: 'Supprimer le fichier' })]
 * ```
 *
 * Pass only the keys you want to change; the rest keep their English defaults.
 */
export function provideBuiLabels(labels: Partial<BuiLabels>): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: BUI_LABELS, useValue: labels }]);
}

/**
 * Resolve a label, most-specific wins:
 * per-instance input → global {@link provideBuiLabels} override → built-in English.
 *
 * Call from an injection context (a component field initializer):
 *
 * ```ts
 * readonly dismissLabel = input<string>();
 * protected readonly dismissText = buiLabel('bannerDismiss', this.dismissLabel);
 * ```
 */
export function buiLabel(
  key: keyof BuiLabels,
  override: Signal<string | undefined>,
): Signal<string> {
  const overrides = inject(BUI_LABELS, { optional: true });
  return computed(() => override() ?? overrides?.[key] ?? BUI_DEFAULT_LABELS[key]);
}

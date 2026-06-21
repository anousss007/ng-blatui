import {
  Component,
  computed,
  inject,
  input,
  signal,
  type TemplateRef,
  viewChild,
} from '@angular/core';

import {
  AccordionContent,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
  BuiAccent,
  BuiAccordion,
  BuiAccordionContent,
  BuiAccordionItem,
  BuiAccordionTrigger,
  BuiAddToCart,
  BuiAlert,
  BuiAlertDescription,
  BuiAlertDialogAction,
  BuiAlertDialogCancel,
  BuiAlertDialogContent,
  BuiAlertDialogDescription,
  BuiAlertDialogFooter,
  BuiAlertDialogHeader,
  BuiAlertDialogTitle,
  BuiAlertTitle,
  BuiAnimatedBeam,
  BuiAspectRatio,
  BuiAudioPlayer,
  BuiAurora,
  BuiAutosizeTextarea,
  BuiAvatar,
  BuiAvatarGroup,
  BuiBackToTop,
  BuiBadge,
  BuiBanner,
  BuiBentoGrid,
  BuiBentoItem,
  BuiBorderBeam,
  BuiBottomNavigation,
  BuiBottomNavigationItem,
  BuiBreadcrumb,
  BuiBreadcrumbEllipsis,
  BuiBreadcrumbItem,
  BuiBreadcrumbLink,
  BuiBreadcrumbList,
  BuiBreadcrumbPage,
  BuiBreadcrumbSeparator,
  BuiButton,
  BuiButtonGroup,
  BuiButtonGroupText,
  BuiCard,
  BuiCardContent,
  BuiCardDescription,
  BuiCardFooter,
  BuiCardHeader,
  BuiCardTitle,
  BuiChat,
  BuiChatMessage,
  BuiCheckbox,
  BuiCitation,
  BuiCodeBlock,
  BuiCollapsible,
  BuiCollapsibleContent,
  BuiCollapsibleTrigger,
  BuiColorPicker,
  BuiCombobox,
  BuiComparisonTable,
  BuiConfetti,
  BuiContainer,
  BuiCookieConsent,
  BuiCopyButton,
  BuiCountdown,
  BuiDescriptionItem,
  BuiDescriptionList,
  BuiDialogContent,
  BuiDialogDescription,
  BuiDialogFooter,
  BuiDialogHeader,
  BuiDialogTitle,
  BuiDock,
  BuiDockItem,
  BuiDotPattern,
  BuiDropdownMenu,
  BuiDropdownMenuItem,
  BuiDropdownMenuLabel,
  BuiDropdownMenuSeparator,
  BuiEditable,
  BuiEmpty,
  BuiEmptyDescription,
  BuiEmptyHeader,
  BuiEmptyMedia,
  BuiEmptyTitle,
  BuiField,
  BuiFieldDescription,
  BuiFieldLabel,
  BuiFlipCard,
  BuiGallery,
  BuiGradientText,
  BuiGridPattern,
  BuiHeatmap,
  BuiHoverCard,
  BuiHoverCardContent,
  BuiImage,
  BuiInfiniteScroll,
  BuiInput,
  BuiInputGroup,
  BuiInputGroupAddon,
  BuiInputGroupButton,
  BuiInputGroupInput,
  BuiInputGroupText,
  BuiInputOtp,
  BuiItem,
  BuiItemActions,
  BuiItemContent,
  BuiItemDescription,
  BuiItemMedia,
  BuiItemTitle,
  BuiJsonViewer,
  BuiKbd,
  BuiKbdGroup,
  BuiKnob,
  BuiLabel,
  BuiLink,
  BuiLoadingOverlay,
  BuiMarquee,
  BuiMasonry,
  BuiMenubar,
  BuiMenubarTrigger,
  BuiMeteors,
  BuiMeter,
  BuiMiniCart,
  BuiNotificationCenter,
  BuiNumberInput,
  BuiNumberTicker,
  BuiOrgChart,
  BuiPageHeader,
  BuiPagination,
  BuiPaginationContent,
  BuiPaginationEllipsis,
  BuiPaginationItem,
  BuiPaginationLink,
  BuiParallax,
  BuiPasswordStrength,
  BuiPhoneInput,
  BuiPopover,
  BuiPopoverContent,
  BuiPresence,
  BuiPrice,
  BuiProductCard,
  BuiProgress,
  BuiPromptInput,
  BuiQuantitySelector,
  BuiQuote,
  BuiRadioGroup,
  BuiRadioGroupItem,
  BuiRating,
  BuiReasoning,
  BuiRepeater,
  BuiResizableHandle,
  BuiResizablePanel,
  BuiResizablePanelGroup,
  BuiScrollArea,
  BuiScrollspy,
  BuiSegmentedControl,
  BuiSelect,
  BuiSeparator,
  BuiSignaturePad,
  BuiSkeleton,
  BuiSlider,
  BuiSparkline,
  BuiSpeedDial,
  BuiSpinner,
  BuiSpotlightCard,
  BuiStack,
  BuiStat,
  BuiStepper,
  BuiStepperItem,
  BuiStreamingText,
  BuiSwitch,
  BuiTable,
  BuiTableBody,
  BuiTableCell,
  BuiTableContainer,
  BuiTableHead,
  BuiTableHeader,
  BuiTableRow,
  BuiTabList,
  BuiTabPanel,
  BuiTabs,
  BuiTabTrigger,
  BuiTagsInput,
  BuiTerminal,
  BuiTextarea,
  BuiTextReveal,
  BuiTiltCard,
  BuiTimeField,
  BuiTimeline,
  BuiTimelineItem,
  BuiToggle,
  BuiToggleGroup,
  BuiToggleGroupItem,
  BuiToolCall,
  BuiTooltip,
  BuiTree,
  BuiTypewriter,
  BuiTypography,
  BuiVariantSelector,
  BuiVideo,
  BuiVisuallyHidden,
  Dialog,
  Menu,
  MenuBar,
  MenuItem,
  MenuTrigger,
  Tab,
  TabContent,
  TabList,
  TabPanel,
  Tabs,
} from 'ng-blatui';

import { Example } from '../ui/example';

const META: Record<string, { title: string; description: string }> = {
  button: {
    title: 'Button',
    description: 'Trigger an action or event, in multiple variants and sizes.',
  },
  badge: { title: 'Badge', description: 'A small status descriptor for labels and counts.' },
  card: {
    title: 'Card',
    description: 'A flexible content container with header, body and footer.',
  },
  alert: { title: 'Alert', description: 'A callout for user attention, with tone variants.' },
  input: { title: 'Input', description: 'A styled single-line text input.' },
  textarea: { title: 'Textarea', description: 'A styled multi-line text input.' },
  label: { title: 'Label', description: 'An accessible label for a form control.' },
  separator: { title: 'Separator', description: 'A visual or semantic divider.' },
  skeleton: { title: 'Skeleton', description: 'A placeholder shown while content loads.' },
  avatar: { title: 'Avatar', description: 'A user image with a text fallback.' },
  progress: { title: 'Progress', description: 'Shows the completion progress of a task.' },
  checkbox: { title: 'Checkbox', description: 'A checkbox with indeterminate support.' },
  switch: { title: 'Switch', description: 'A toggle for an on/off setting.' },
  'radio-group': { title: 'Radio group', description: 'A set of mutually exclusive options.' },
  accordion: { title: 'Accordion', description: 'Expandable stacked sections (Angular Aria).' },
  tabs: { title: 'Tabs', description: 'Switch between related panels (Angular Aria).' },
  dialog: { title: 'Dialog', description: 'A modal dialog on the Angular CDK overlay.' },
  tooltip: { title: 'Tooltip', description: 'A floating hint shown on hover or focus.' },
  breadcrumb: { title: 'Breadcrumb', description: 'Shows the path to the current page.' },
  'button-group': { title: 'Button group', description: 'Group related buttons into one control.' },
  kbd: { title: 'Kbd', description: 'Styles a keyboard key.' },
  'aspect-ratio': { title: 'Aspect ratio', description: 'Constrain content to a fixed ratio.' },
  collapsible: { title: 'Collapsible', description: 'An accessible show/hide disclosure.' },
  empty: { title: 'Empty', description: 'An empty-state placeholder.' },
  field: { title: 'Field', description: 'Compose labels, controls, descriptions and errors.' },
  container: { title: 'Container', description: 'A centered, padded page-width container.' },
  toggle: { title: 'Toggle', description: 'A two-state button (aria-pressed).' },
  spinner: { title: 'Spinner', description: 'A spinning loading indicator.' },
  'copy-button': { title: 'Copy button', description: 'Copy text to the clipboard with feedback.' },
  banner: { title: 'Banner', description: 'A full-width, dismissible announcement bar.' },
  table: { title: 'Table', description: 'A semantic, styled data table.' },
  'avatar-group': {
    title: 'Avatar group',
    description: 'An overlapping stack of avatars with overflow.',
  },
  pagination: { title: 'Pagination', description: 'Navigate between pages of content.' },
  popover: {
    title: 'Popover',
    description: 'Floating content anchored to a trigger (Angular CDK).',
  },
  item: { title: 'Item', description: 'A flexible list/row item with media, content and actions.' },
  'scroll-area': {
    title: 'Scroll area',
    description: 'A scrollable region with a themed scrollbar.',
  },
  'input-group': {
    title: 'Input group',
    description: 'Compose inputs with addons, text and buttons.',
  },
  meter: { title: 'Meter', description: 'A measurement within a known range (role=meter).' },
  stat: { title: 'Stat', description: 'A KPI card with a trend-coloured change.' },
  'visually-hidden': {
    title: 'Visually hidden',
    description: 'Hide content but keep it for screen readers.',
  },
  'hover-card': { title: 'Hover card', description: 'Preview content on hover (Angular CDK).' },
  'code-block': { title: 'Code block', description: 'A dark code panel with copy-to-clipboard.' },
  slider: {
    title: 'Slider',
    description: 'Pick a value from a range, with full keyboard support.',
  },
  rating: { title: 'Rating', description: 'A star rating with hover preview and keyboard.' },
  'quantity-selector': { title: 'Quantity selector', description: 'A compact − [n] + stepper.' },
  'alert-dialog': {
    title: 'Alert dialog',
    description: 'A confirm modal (role=alertdialog) on the CDK.',
  },
  'autosize-textarea': {
    title: 'Autosize textarea',
    description: 'A textarea that grows with content.',
  },
  'dropdown-menu': { title: 'Dropdown menu', description: 'A menu of actions (Angular Aria).' },
  menubar: { title: 'Menubar', description: 'A persistent application menu bar (Angular Aria).' },
  typography: { title: 'Typography', description: 'Headings, prose and inline text styles.' },
  'segmented-control': {
    title: 'Segmented control',
    description: 'A single-select group of segments.',
  },
  'dot-pattern': { title: 'Dot pattern', description: 'A decorative dotted background layer.' },
  'grid-pattern': { title: 'Grid pattern', description: 'A decorative grid background layer.' },
  terminal: { title: 'Terminal', description: 'A console window for command output.' },
  'comparison-table': {
    title: 'Comparison table',
    description: 'A feature/pricing comparison grid.',
  },
  'flip-card': { title: 'Flip card', description: 'A card that flips to reveal its back.' },
  'spotlight-card': {
    title: 'Spotlight card',
    description: 'A card with a cursor-following glow.',
  },
  'tilt-card': { title: 'Tilt card', description: 'A card that tilts in 3D toward the cursor.' },
  select: { title: 'Select', description: 'An accessible select (combobox + listbox).' },
  combobox: { title: 'Combobox', description: 'A filterable select with typeahead.' },
  'back-to-top': { title: 'Back to top', description: 'A floating scroll-to-top button.' },
  countdown: { title: 'Countdown', description: 'A live countdown timer to a target time.' },
  'number-ticker': { title: 'Number ticker', description: 'Animates a number counting up.' },
  link: { title: 'Link', description: 'A styled, accessible anchor with variants.' },
  'gradient-text': { title: 'Gradient text', description: 'Text painted with a CSS gradient.' },
  'page-header': { title: 'Page header', description: 'A page title block with actions slot.' },
  quote: { title: 'Quote', description: 'A blockquote / testimonial with attribution.' },
  price: { title: 'Price', description: 'A price with compare-at and discount badge.' },
  stack: { title: 'Stack', description: 'A flexbox stack layout helper.' },
  accent: { title: 'Accent', description: 'Re-theme a subtree with a custom accent colour.' },
  'kbd-group': { title: 'Kbd group', description: 'Group several keyboard keys.' },
  presence: { title: 'Presence', description: 'A status dot (online/away/busy/offline).' },
  timeline: { title: 'Timeline', description: 'A vertical timeline of events.' },
  'description-list': { title: 'Description list', description: 'Term/description pairs.' },
  masonry: { title: 'Masonry', description: 'A CSS multi-column masonry grid.' },
  'bento-grid': { title: 'Bento grid', description: 'A bento-style feature grid.' },
  gallery: { title: 'Gallery', description: 'A responsive thumbnail grid.' },
  'loading-overlay': { title: 'Loading overlay', description: 'A spinner veil over content.' },
  'number-input': { title: 'Number input', description: 'A numeric stepper with bounds.' },
  'variant-selector': {
    title: 'Variant selector',
    description: 'Pick a variant (pills or colours).',
  },
  sparkline: { title: 'Sparkline', description: 'A tiny inline trend chart.' },
  'add-to-cart': { title: 'Add to cart', description: 'A stateful add-to-cart button.' },
  'password-strength': {
    title: 'Password strength',
    description: 'A password field with a strength meter.',
  },
  'product-card': { title: 'Product card', description: 'An e-commerce product card.' },
  typewriter: { title: 'Typewriter', description: 'Types and deletes cycling words.' },
  'streaming-text': { title: 'Streaming text', description: 'Reveals a passage token-by-token.' },
  'border-beam': { title: 'Border beam', description: 'A card with a travelling border beam.' },
  meteors: { title: 'Meteors', description: 'Animated falling meteor streaks.' },
  aurora: { title: 'Aurora', description: 'An animated aurora gradient background.' },
  marquee: { title: 'Marquee', description: 'A seamless infinite scroll of items.' },
  'bottom-navigation': { title: 'Bottom navigation', description: 'A mobile bottom tab bar.' },
  'text-reveal': { title: 'Text reveal', description: 'Words brighten as you scroll.' },
  parallax: { title: 'Parallax', description: 'Shifts content relative to scroll.' },
  scrollspy: { title: 'Scrollspy', description: 'Highlights the section in view.' },
  'time-field': { title: 'Time field', description: 'A styled native time input.' },
  'toggle-group': { title: 'Toggle group', description: 'A group of toggle buttons.' },
  'tags-input': { title: 'Tags input', description: 'Type to add removable tag chips.' },
  editable: { title: 'Editable', description: 'Click-to-edit inline text.' },
  'speed-dial': { title: 'Speed dial', description: 'A FAB that expands to actions.' },
  knob: { title: 'Knob', description: 'A rotary dial input (role=slider).' },
  image: { title: 'Image', description: 'A lazy image with placeholder and error state.' },
  reasoning: { title: 'Reasoning', description: 'A collapsible chain-of-thought disclosure.' },
  'tool-call': { title: 'Tool call', description: 'An AI tool-call card with args/result.' },
  chat: { title: 'Chat', description: 'A conversation log with message bubbles.' },
  confetti: { title: 'Confetti', description: 'A celebratory particle burst.' },
  stepper: { title: 'Stepper', description: 'A multi-step progress indicator.' },
  'input-otp': { title: 'Input OTP', description: 'A one-time-password box input.' },
  'phone-input': { title: 'Phone input', description: 'A phone field with country code.' },
  'prompt-input': { title: 'Prompt input', description: 'An autosizing chat composer.' },
  heatmap: { title: 'Heatmap', description: 'A contribution-style activity grid.' },
  citation: { title: 'Citation', description: 'An inline source citation marker.' },
  resizable: { title: 'Resizable', description: 'Drag-to-resize panel groups.' },
  video: { title: 'Video', description: 'An HTML5 video with a play facade.' },
  'color-picker': { title: 'Color picker', description: 'A colour well, hex field and swatches.' },
  'cookie-consent': { title: 'Cookie consent', description: 'A GDPR cookie banner.' },
  'infinite-scroll': { title: 'Infinite scroll', description: 'Loads more content on scroll.' },
  'audio-player': { title: 'Audio player', description: 'A compact audio player bar.' },
  'signature-pad': { title: 'Signature pad', description: 'A canvas to draw a signature.' },
  dock: { title: 'Dock', description: 'A macOS-style magnifying dock.' },
  tree: { title: 'Tree', description: 'A collapsible hierarchical tree.' },
  repeater: { title: 'Repeater', description: 'A dynamic list of form rows.' },
  'notification-center': { title: 'Notification center', description: 'A bell + dropdown feed.' },
  'json-viewer': { title: 'JSON viewer', description: 'A collapsible JSON tree.' },
};

@Component({
  selector: 'app-components',
  imports: [
    Example,
    BuiButton,
    BuiBadge,
    BuiCard,
    BuiCardHeader,
    BuiCardTitle,
    BuiCardDescription,
    BuiCardContent,
    BuiCardFooter,
    BuiAlert,
    BuiAlertTitle,
    BuiAlertDescription,
    BuiInput,
    BuiTextarea,
    BuiLabel,
    BuiSeparator,
    BuiSkeleton,
    BuiAvatar,
    BuiProgress,
    BuiCheckbox,
    BuiSwitch,
    AccordionGroup,
    AccordionTrigger,
    AccordionPanel,
    AccordionContent,
    BuiAccordion,
    BuiAccordionItem,
    BuiAccordionTrigger,
    BuiAccordionContent,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabContent,
    BuiTabs,
    BuiTabList,
    BuiTabTrigger,
    BuiTabPanel,
    BuiDialogContent,
    BuiDialogHeader,
    BuiDialogTitle,
    BuiDialogDescription,
    BuiDialogFooter,
    BuiRadioGroup,
    BuiRadioGroupItem,
    BuiTooltip,
    BuiAspectRatio,
    BuiBreadcrumb,
    BuiBreadcrumbEllipsis,
    BuiBreadcrumbItem,
    BuiBreadcrumbLink,
    BuiBreadcrumbList,
    BuiBreadcrumbPage,
    BuiBreadcrumbSeparator,
    BuiButtonGroup,
    BuiButtonGroupText,
    BuiKbd,
    BuiCollapsible,
    BuiCollapsibleContent,
    BuiCollapsibleTrigger,
    BuiContainer,
    BuiEmpty,
    BuiEmptyDescription,
    BuiEmptyHeader,
    BuiEmptyMedia,
    BuiEmptyTitle,
    BuiField,
    BuiFieldDescription,
    BuiFieldLabel,
    BuiBanner,
    BuiCopyButton,
    BuiSpinner,
    BuiToggle,
    BuiAvatarGroup,
    BuiTable,
    BuiTableBody,
    BuiTableCell,
    BuiTableContainer,
    BuiTableHead,
    BuiTableHeader,
    BuiTableRow,
    BuiPagination,
    BuiPaginationContent,
    BuiPaginationEllipsis,
    BuiPaginationItem,
    BuiPaginationLink,
    BuiPopover,
    BuiPopoverContent,
    BuiItem,
    BuiItemActions,
    BuiItemContent,
    BuiItemDescription,
    BuiItemMedia,
    BuiItemTitle,
    BuiScrollArea,
    BuiInputGroup,
    BuiInputGroupAddon,
    BuiInputGroupButton,
    BuiInputGroupInput,
    BuiInputGroupText,
    BuiMeter,
    BuiStat,
    BuiVisuallyHidden,
    BuiCodeBlock,
    BuiHoverCard,
    BuiHoverCardContent,
    BuiSlider,
    BuiQuantitySelector,
    BuiRating,
    BuiAlertDialogAction,
    BuiAlertDialogCancel,
    BuiAlertDialogContent,
    BuiAlertDialogDescription,
    BuiAlertDialogFooter,
    BuiAlertDialogHeader,
    BuiAlertDialogTitle,
    BuiAutosizeTextarea,
    BuiDropdownMenu,
    BuiDropdownMenuItem,
    BuiDropdownMenuLabel,
    BuiDropdownMenuSeparator,
    Menu,
    MenuItem,
    MenuTrigger,
    MenuBar,
    BuiMenubar,
    BuiMenubarTrigger,
    BuiTypography,
    BuiDotPattern,
    BuiGridPattern,
    BuiSegmentedControl,
    BuiComparisonTable,
    BuiTerminal,
    BuiFlipCard,
    BuiSpotlightCard,
    BuiTiltCard,
    BuiSelect,
    BuiBackToTop,
    BuiCombobox,
    BuiCountdown,
    BuiNumberTicker,
    BuiGradientText,
    BuiLink,
    BuiPageHeader,
    BuiPrice,
    BuiQuote,
    BuiStack,
    BuiAccent,
    BuiKbdGroup,
    BuiPresence,
    BuiTimeline,
    BuiTimelineItem,
    BuiDescriptionList,
    BuiDescriptionItem,
    BuiMasonry,
    BuiBentoGrid,
    BuiBentoItem,
    BuiGallery,
    BuiLoadingOverlay,
    BuiNumberInput,
    BuiVariantSelector,
    BuiSparkline,
    BuiAddToCart,
    BuiPasswordStrength,
    BuiProductCard,
    BuiTypewriter,
    BuiStreamingText,
    BuiBorderBeam,
    BuiMeteors,
    BuiAurora,
    BuiMarquee,
    BuiBottomNavigation,
    BuiBottomNavigationItem,
    BuiTextReveal,
    BuiParallax,
    BuiScrollspy,
    BuiTimeField,
    BuiToggleGroup,
    BuiToggleGroupItem,
    BuiTagsInput,
    BuiEditable,
    BuiSpeedDial,
    BuiKnob,
    BuiImage,
    BuiReasoning,
    BuiToolCall,
    BuiChat,
    BuiChatMessage,
    BuiConfetti,
    BuiStepper,
    BuiStepperItem,
    BuiInputOtp,
    BuiPhoneInput,
    BuiPromptInput,
    BuiHeatmap,
    BuiCitation,
    BuiResizablePanelGroup,
    BuiResizablePanel,
    BuiResizableHandle,
    BuiVideo,
    BuiColorPicker,
    BuiCookieConsent,
    BuiInfiniteScroll,
    BuiAudioPlayer,
    BuiSignaturePad,
    BuiDock,
    BuiDockItem,
    BuiTree,
    BuiRepeater,
    BuiNotificationCenter,
    BuiJsonViewer,
    BuiOrgChart,
    BuiMiniCart,
    BuiAnimatedBeam,
  ],
  templateUrl: './components.html',
})
export class ComponentPage {
  readonly slug = input('');

  protected readonly title = computed(() => {
    const slug = this.slug();
    return Object.hasOwn(META, slug) ? META[slug].title : slug;
  });
  protected readonly description = computed(() => {
    const slug = this.slug();
    return Object.hasOwn(META, slug) ? META[slug].description : '';
  });

  private readonly dialog = inject(Dialog);
  protected readonly dialogTpl = viewChild.required<TemplateRef<unknown>>('dialogTpl');
  protected readonly alertTpl = viewChild.required<TemplateRef<unknown>>('alertTpl');

  protected readonly terms = signal(true);
  protected readonly notifications = signal(true);
  protected readonly volume = signal(60);
  protected readonly score = signal(4);
  protected readonly qty = signal(2);
  protected readonly view = signal('list');
  protected readonly orgRoot = {
    name: 'Ada Lovelace',
    title: 'CEO',
    children: [
      {
        name: 'Grace Hopper',
        title: 'CTO',
        children: [{ name: 'Alan Turing', title: 'Engineer' }],
      },
      { name: 'Edsger Dijkstra', title: 'CFO' },
    ],
  };
  protected readonly cartItems = [
    { name: 'Wireless headphones', variant: 'Black', price: 199, qty: 1 },
    { name: 'USB-C cable', price: 12, qty: 2 },
  ];
  protected readonly repeaterFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
  ];
  protected readonly repeaterRows = signal<Record<string, string>[]>([
    { name: 'Ada Lovelace', email: 'ada@example.com' },
  ]);
  protected readonly notifItems = [
    {
      title: 'New comment on your post',
      body: 'Grace replied to you.',
      time: '2m ago',
      read: false,
    },
    { title: 'Build succeeded', time: '1h ago', read: false },
    { title: 'Weekly digest is ready', time: 'Yesterday', read: true },
  ];
  protected readonly jsonData = {
    name: 'ng-blatui',
    ssr: true,
    components: ['button', 'select', 'tree'],
    meta: { stars: 0, license: 'MIT' },
  };
  protected readonly treeItems = [
    {
      label: 'src',
      expanded: true,
      children: [
        { label: 'app', children: [{ label: 'app.ts' }, { label: 'app.html' }] },
        { label: 'main.ts' },
      ],
    },
    { label: 'package.json' },
  ];
  protected readonly colorValue = signal('#22c55e');
  protected readonly resizeSize = signal(40);
  protected readonly otpValue = signal('');
  protected readonly phoneNumber = signal('');
  protected readonly phoneCountry = signal('US');
  protected readonly toggleAlign = signal<string | string[] | null>('center');
  protected readonly tagList = signal(['angular', 'signals']);
  protected readonly editName = signal('Ada Lovelace');
  protected readonly knobValue = signal(40);
  protected readonly timeValue = signal('09:30');
  protected readonly speedActions = [{ label: 'Share' }, { label: 'Edit' }, { label: 'Delete' }];
  protected readonly sizeChoice = signal('M');
  protected readonly galleryImages = [
    'https://picsum.photos/seed/a/300',
    'https://picsum.photos/seed/b/300',
    'https://picsum.photos/seed/c/300',
  ];
  protected readonly fruit = signal('');
  protected readonly fruits = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];
  protected readonly framework = signal('');
  protected readonly frameworks = [
    { value: 'ng', label: 'Angular' },
    { value: 're', label: 'React' },
    { value: 'vu', label: 'Vue' },
    { value: 'sv', label: 'Svelte' },
  ];
  protected readonly pricingRows = [
    { feature: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
    { feature: 'Analytics', values: [false, true, true] },
    { feature: 'SSO', values: [false, false, true] },
  ];
  protected readonly plan = signal('free');
  protected readonly team = [
    { name: 'Ada Lovelace' },
    { name: 'Alan Turing' },
    { name: 'Grace Hopper' },
    { name: 'Linus Torvalds' },
  ];

  protected openDialog(): void {
    this.dialog.open(this.dialogTpl(), { ariaModal: true });
  }

  protected openAlertDialog(): void {
    this.dialog.open(this.alertTpl(), { ariaModal: true });
  }

  protected readonly code = {
    button: `import { BuiButton } from 'ng-blatui';

<button buiButton>Default</button>
<button buiButton variant="secondary">Secondary</button>
<button buiButton variant="destructive">Delete</button>
<button buiButton variant="outline" size="sm">Small</button>`,
    badge: `import { BuiBadge } from 'ng-blatui';

<span buiBadge>Default</span>
<span buiBadge tone="success">Success</span>
<span buiBadge tone="danger" variant="solid">Solid</span>`,
    card: `import { BuiCard, BuiCardHeader, BuiCardTitle, BuiCardContent } from 'ng-blatui';

<div buiCard variant="sectioned">
  <div buiCardHeader>
    <h3 buiCardTitle>Sign in</h3>
    <p buiCardDescription>Enter your credentials.</p>
  </div>
  <div buiCardContent>…</div>
</div>`,
    alert: `import { BuiAlert, BuiAlertTitle, BuiAlertDescription } from 'ng-blatui';

<div buiAlert tone="success">
  <h5 buiAlertTitle>Saved</h5>
  <div buiAlertDescription>Your changes were saved.</div>
</div>`,
    input: `import { BuiInput } from 'ng-blatui';

<input buiInput type="email" placeholder="m@example.com" />`,
    textarea: `import { BuiTextarea } from 'ng-blatui';

<textarea buiTextarea placeholder="Your message"></textarea>`,
    label: `import { BuiLabel } from 'ng-blatui';

<label buiLabel for="email">Email</label>
<input id="email" buiInput />`,
    separator: `import { BuiSeparator } from 'ng-blatui';

<div buiSeparator></div>
<span buiSeparator orientation="vertical" [decorative]="false" class="h-4"></span>`,
    skeleton: `import { BuiSkeleton } from 'ng-blatui';

<div buiSkeleton class="h-4 w-48"></div>`,
    avatar: `import { BuiAvatar } from 'ng-blatui';

<bui-avatar [src]="url" alt="Jane">JD</bui-avatar>`,
    progress: `import { BuiProgress } from 'ng-blatui';

<bui-progress [value]="60" ariaLabel="Upload" />`,
    checkbox: `import { BuiCheckbox } from 'ng-blatui';

<button buiCheckbox [(checked)]="accepted" aria-labelledby="t"></button>
<span id="t">Accept terms</span>`,
    switch: `import { BuiSwitch } from 'ng-blatui';

<button buiSwitch [(checked)]="enabled" aria-label="Notifications"></button>`,
    accordion: `import {
  AccordionGroup, AccordionTrigger, AccordionPanel, AccordionContent,
  BuiAccordion, BuiAccordionItem, BuiAccordionTrigger, BuiAccordionContent,
} from 'ng-blatui';

<div ngAccordionGroup buiAccordion [multiExpandable]="false">
  <div buiAccordionItem>
    <h3 class="flex">
      <button ngAccordionTrigger buiAccordionTrigger [panel]="p1">Is it accessible?</button>
    </h3>
    <div ngAccordionPanel #p1="ngAccordionPanel" buiAccordionContent>
      <ng-template ngAccordionContent><div class="pb-4">Yes — via Angular Aria.</div></ng-template>
    </div>
  </div>
</div>`,
    tabs: `import {
  Tabs, TabList, Tab, TabPanel, TabContent,
  BuiTabs, BuiTabList, BuiTabTrigger, BuiTabPanel,
} from 'ng-blatui';

<div ngTabs buiTabs>
  <div ngTabList buiTabList selectedTab="a">
    <div ngTab value="a" buiTabTrigger>Account</div>
    <div ngTab value="b" buiTabTrigger>Password</div>
  </div>
  <div ngTabPanel value="a" buiTabPanel><ng-template ngTabContent>…</ng-template></div>
  <div ngTabPanel value="b" buiTabPanel><ng-template ngTabContent>…</ng-template></div>
</div>`,
    dialog: `import { inject, viewChild, TemplateRef } from '@angular/core';
import { Dialog, BuiDialogContent, BuiDialogTitle } from 'ng-blatui';

private dialog = inject(Dialog);
tpl = viewChild.required<TemplateRef<unknown>>('tpl');
open() { this.dialog.open(this.tpl(), { ariaModal: true }); }

<button buiButton (click)="open()">Open dialog</button>
<ng-template #tpl>
  <div buiDialogContent>
    <h2 buiDialogTitle>Title</h2>
    <p>Body…</p>
  </div>
</ng-template>`,
    radioGroup: `import { BuiRadioGroup, BuiRadioGroupItem } from 'ng-blatui';

<div buiRadioGroup [(value)]="plan">
  <label class="flex items-center gap-2">
    <button buiRadioItem value="free" aria-label="Free"></button> Free
  </label>
  <label class="flex items-center gap-2">
    <button buiRadioItem value="pro" aria-label="Pro"></button> Pro
  </label>
</div>`,
    tooltip: `import { BuiTooltip } from 'ng-blatui';

<button buiButton variant="outline" buiTooltip="Add to library">Hover me</button>`,
    breadcrumb: `import {
  BuiBreadcrumb, BuiBreadcrumbList, BuiBreadcrumbItem,
  BuiBreadcrumbLink, BuiBreadcrumbPage, BuiBreadcrumbSeparator,
} from 'ng-blatui';

<nav buiBreadcrumb>
  <ol buiBreadcrumbList>
    <li buiBreadcrumbItem><a buiBreadcrumbLink href="/">Home</a></li>
    <li buiBreadcrumbSeparator></li>
    <li buiBreadcrumbItem><span buiBreadcrumbPage>Settings</span></li>
  </ol>
</nav>`,
    kbd: `import { BuiKbd } from 'ng-blatui';

<kbd buiKbd>Ctrl</kbd> <kbd buiKbd>K</kbd>`,
    aspectRatio: `import { BuiAspectRatio } from 'ng-blatui';

<bui-aspect-ratio ratio="16 / 9">
  <img src="/cover.jpg" alt="" class="h-full w-full rounded-lg object-cover" />
</bui-aspect-ratio>`,
    buttonGroup: `import { BuiButtonGroup, BuiButton } from 'ng-blatui';

<div buiButtonGroup>
  <button buiButton variant="outline">Prev</button>
  <button buiButton variant="outline">Next</button>
</div>`,
    collapsible: `import { BuiCollapsible, BuiCollapsibleTrigger, BuiCollapsibleContent } from 'ng-blatui';

<div buiCollapsible>
  <button buiCollapsibleTrigger buiButton variant="outline">Toggle</button>
  <div buiCollapsibleContent class="pt-2">Hidden content</div>
</div>`,
    empty: `import {
  BuiEmpty, BuiEmptyHeader, BuiEmptyMedia, BuiEmptyTitle, BuiEmptyDescription,
} from 'ng-blatui';

<div buiEmpty>
  <div buiEmptyHeader>
    <div buiEmptyMedia variant="icon">📭</div>
    <div buiEmptyTitle>No projects</div>
    <div buiEmptyDescription>Create your first project to get started.</div>
  </div>
</div>`,
    field: `import { BuiField, BuiFieldLabel, BuiFieldDescription } from 'ng-blatui';

<div buiField>
  <label buiFieldLabel for="email">Email</label>
  <input id="email" buiInput type="email" />
  <p buiFieldDescription>We'll never share it.</p>
</div>`,
    container: `import { BuiContainer } from 'ng-blatui';

<div buiContainer size="md"><!-- page content --></div>`,
    toggle: `import { BuiToggle } from 'ng-blatui';

<button buiToggle aria-label="Bold">B</button>
<button buiToggle variant="outline" aria-label="Italic">I</button>`,
    spinner: `import { BuiSpinner } from 'ng-blatui';

<bui-spinner />
<bui-spinner class="size-6" />`,
    copyButton: `import { BuiCopyButton } from 'ng-blatui';

<button buiCopyButton value="npm i ng-blatui" label="Copy command">Copy</button>`,
    banner: `import { BuiBanner } from 'ng-blatui';

<bui-banner tone="info">New version available — refresh to update.</bui-banner>`,
    table: `import {
  BuiTableContainer, BuiTable, BuiTableHeader, BuiTableBody, BuiTableRow, BuiTableHead, BuiTableCell,
} from 'ng-blatui';

<div buiTableContainer variant="card">
  <table buiTable>
    <thead buiTableHeader>
      <tr buiTableRow><th buiTableHead>Name</th><th buiTableHead>Role</th></tr>
    </thead>
    <tbody buiTableBody>
      <tr buiTableRow><td buiTableCell>Ada</td><td buiTableCell>Admin</td></tr>
    </tbody>
  </table>
</div>`,
    avatarGroup: `import { BuiAvatarGroup } from 'ng-blatui';

<bui-avatar-group [avatars]="team" [max]="3" />
// team = [{ name: 'Ada Lovelace' }, { name: 'Alan Turing' }, ...]`,
    pagination: `import {
  BuiPagination, BuiPaginationContent, BuiPaginationItem, BuiPaginationLink, BuiPaginationEllipsis,
} from 'ng-blatui';

<nav buiPagination>
  <ul buiPaginationContent>
    <li buiPaginationItem><a buiPaginationLink href="#">1</a></li>
    <li buiPaginationItem><a buiPaginationLink [active]="true" href="#">2</a></li>
    <li buiPaginationItem><a buiPaginationLink href="#">3</a></li>
    <li buiPaginationItem><bui-pagination-ellipsis /></li>
  </ul>
</nav>`,
    popover: `import { BuiPopover, BuiPopoverContent } from 'ng-blatui';

<button buiButton variant="outline" [buiPopover]="tpl">Open</button>
<ng-template #tpl>
  <div buiPopoverContent>
    <p class="text-sm">Popover content goes here.</p>
  </div>
</ng-template>`,
    item: `import {
  BuiItem, BuiItemMedia, BuiItemContent, BuiItemTitle, BuiItemDescription, BuiItemActions,
} from 'ng-blatui';

<div buiItem variant="outline">
  <div buiItemMedia variant="icon">★</div>
  <div buiItemContent>
    <div buiItemTitle>Notifications</div>
    <p buiItemDescription>Configure how you receive alerts.</p>
  </div>
  <div buiItemActions><button buiButton variant="ghost" size="sm">Edit</button></div>
</div>`,
    scrollArea: `import { BuiScrollArea } from 'ng-blatui';

<bui-scroll-area class="h-40 rounded-md border p-4">
  <!-- long content -->
</bui-scroll-area>`,
    inputGroup: `import {
  BuiInputGroup, BuiInputGroupAddon, BuiInputGroupInput, BuiInputGroupButton,
} from 'ng-blatui';

<div buiInputGroup>
  <div buiInputGroupAddon>$</div>
  <input buiInputGroupInput placeholder="0.00" />
  <div buiInputGroupAddon align="inline-end">
    <button buiInputGroupButton>Send</button>
  </div>
</div>`,
    meter: `import { BuiMeter } from 'ng-blatui';

<bui-meter [value]="72" label="CPU usage" />`,
    stat: `import { BuiStat } from 'ng-blatui';

<bui-stat label="Revenue" value="$12,000" change="+12%" caption="vs last month" />`,
    visuallyHidden: `import { BuiVisuallyHidden } from 'ng-blatui';

<span buiVisuallyHidden>Screen-reader only text</span>`,
    hoverCard: `import { BuiHoverCard, BuiHoverCardContent } from 'ng-blatui';

<span [buiHoverCard]="tpl">@username</span>
<ng-template #tpl>
  <div buiHoverCardContent>Profile preview content…</div>
</ng-template>`,
    codeBlock: `import { BuiCodeBlock } from 'ng-blatui';

<bui-code-block filename="app.ts" code="const x = 1;" />`,
    slider: `import { BuiSlider } from 'ng-blatui';

<bui-slider [(value)]="volume" [min]="0" [max]="100" ariaLabel="Volume" />`,
    rating: `import { BuiRating } from 'ng-blatui';

<bui-rating [(value)]="score" [max]="5" ariaLabel="Rate" />`,
    quantitySelector: `import { BuiQuantitySelector } from 'ng-blatui';

<bui-quantity-selector [(value)]="qty" [min]="1" [max]="10" />`,
    alertDialog: `import { Dialog } from 'ng-blatui';

open(tpl) { this.dialog.open(tpl, { ariaModal: true }); }

<button buiButton variant="destructive" (click)="open(tpl)">Delete…</button>
<ng-template #tpl>
  <div buiAlertDialogContent>
    <div buiAlertDialogHeader>
      <h2 buiAlertDialogTitle>Delete project?</h2>
      <p buiAlertDialogDescription>This cannot be undone.</p>
    </div>
    <div buiAlertDialogFooter>
      <button buiAlertDialogCancel>Cancel</button>
      <button buiAlertDialogAction>Delete</button>
    </div>
  </div>
</ng-template>`,
    autosizeTextarea: `import { BuiAutosizeTextarea } from 'ng-blatui';

<textarea buiAutosizeTextarea placeholder="Write a message…"></textarea>`,
    dropdownMenu: `import {
  Menu, MenuItem, MenuTrigger,
  BuiDropdownMenu, BuiDropdownMenuItem, BuiDropdownMenuLabel, BuiDropdownMenuSeparator,
} from 'ng-blatui';

<div class="relative inline-block">
  <button buiButton variant="outline" ngMenuTrigger [menu]="m">Open menu</button>
  <div ngMenu #m="ngMenu" buiDropdownMenu>
    <div buiDropdownMenuLabel>My account</div>
    <div buiDropdownMenuSeparator></div>
    <div ngMenuItem value="profile" buiDropdownMenuItem>Profile</div>
    <div ngMenuItem value="settings" buiDropdownMenuItem>Settings</div>
  </div>
</div>`,
    typography: `import { BuiTypography } from 'ng-blatui';

<h1 buiTypography variant="h1">The quick brown fox</h1>
<p buiTypography variant="lead">A modern Angular UI library.</p>`,
    menubar: `import {
  MenuBar, Menu, MenuItem, MenuTrigger,
  BuiMenubar, BuiMenubarTrigger, BuiDropdownMenu, BuiDropdownMenuItem,
} from 'ng-blatui';

<div ngMenuBar buiMenubar>
  <button ngMenuTrigger [menu]="file" buiMenubarTrigger>File</button>
  <div ngMenu #file="ngMenu" buiDropdownMenu>
    <div ngMenuItem value="new" buiDropdownMenuItem>New tab</div>
  </div>
</div>`,
    segmentedControl: `import { BuiSegmentedControl } from 'ng-blatui';

<bui-segmented-control [(value)]="view" [options]="['list', 'grid', 'board']" />`,
    dotPattern: `import { BuiDotPattern } from 'ng-blatui';

<div class="relative h-32 rounded-lg border">
  <bui-dot-pattern [mask]="true" />
</div>`,
    gridPattern: `import { BuiGridPattern } from 'ng-blatui';

<div class="relative h-32 rounded-lg border">
  <bui-grid-pattern [mask]="true" />
</div>`,
    terminal: `import { BuiTerminal } from 'ng-blatui';

<bui-terminal title="~/app — zsh">
  <div><span class="prompt">$</span> npm i ng-blatui</div>
  <div class="ok">✓ installed 1 package</div>
</bui-terminal>`,
    comparisonTable: `import { BuiComparisonTable } from 'ng-blatui';

<bui-comparison-table [tiers]="['Free', 'Pro', 'Team']" [rows]="rows" [highlight]="1" />`,
    flipCard: `import { BuiFlipCard } from 'ng-blatui';

<bui-flip-card>
  <div>Front content</div>
  <div buiFlipBack>Back content</div>
</bui-flip-card>`,
    spotlightCard: `import { BuiSpotlightCard } from 'ng-blatui';

<bui-spotlight-card>Hover for a spotlight glow.</bui-spotlight-card>`,
    tiltCard: `import { BuiTiltCard } from 'ng-blatui';

<bui-tilt-card><div class="p-6">Tilt me</div></bui-tilt-card>`,
    select: `import { BuiSelect } from 'ng-blatui';

<bui-select [(value)]="fruit" [options]="fruits" placeholder="Pick a fruit" />
// fruits = [{ value: 'apple', label: 'Apple' }, ...]`,
    combobox: `import { BuiCombobox } from 'ng-blatui';

<bui-combobox [(value)]="framework" [options]="frameworks" />
// frameworks = [{ value: 'ng', label: 'Angular' }, ...]`,
    backToTop: `import { BuiBackToTop } from 'ng-blatui';

<bui-back-to-top [threshold]="300" />`,
    countdown: `import { BuiCountdown } from 'ng-blatui';

<bui-countdown to="2026-12-31 23:59" />`,
    numberTicker: `import { BuiNumberTicker } from 'ng-blatui';

<bui-number-ticker [value]="12500" prefix="$" />`,
    link: `import { BuiLink } from 'ng-blatui';

<a buiLink href="/docs">Documentation</a>
<a buiLink variant="muted" [external]="true" href="https://angular.dev">Angular</a>`,
    gradientText: `import { BuiGradientText } from 'ng-blatui';

<bui-gradient-text preset="brand" class="text-3xl">Gradient text</bui-gradient-text>`,
    pageHeader: `import { BuiPageHeader } from 'ng-blatui';

<bui-page-header heading="Settings" description="Manage your account.">
  <button buiButton buiPageHeaderActions>Save</button>
</bui-page-header>`,
    quote: `import { BuiQuote } from 'ng-blatui';

<bui-quote author="Ada Lovelace" role="Mathematician">
  That brain of mine is something more than merely mortal.
</bui-quote>`,
    price: `import { BuiPrice } from 'ng-blatui';

<bui-price [amount]="19.99" [compareAt]="29.99" size="lg" />`,
    stack: `import { BuiStack } from 'ng-blatui';

<div buiStack direction="row" gap="3">…</div>`,
    accent: `import { BuiAccent, BuiButton } from 'ng-blatui';

<div buiAccent color="#e11d48">
  <button buiButton>Themed button</button>
</div>`,
    kbdGroup: `import { BuiKbdGroup, BuiKbd } from 'ng-blatui';

<kbd buiKbdGroup><kbd buiKbd>⌘</kbd><kbd buiKbd>K</kbd></kbd>`,
    presence: `import { BuiPresence } from 'ng-blatui';

<bui-presence status="online" [pulse]="true" [showLabel]="true" />`,
    timeline: `import { BuiTimeline, BuiTimelineItem } from 'ng-blatui';

<ol buiTimeline>
  <li buiTimelineItem time="09:00" title="Created" [active]="true">Order placed</li>
  <li buiTimelineItem time="10:30" title="Shipped">On its way</li>
</ol>`,
    descriptionList: `import { BuiDescriptionList, BuiDescriptionItem } from 'ng-blatui';

<dl buiDescriptionList [bordered]="true">
  <bui-description-item term="Plan">Pro</bui-description-item>
  <bui-description-item term="Seats">5</bui-description-item>
</dl>`,
    masonry: `import { BuiMasonry } from 'ng-blatui';

<div buiMasonry [columns]="3">…tiles…</div>`,
    bentoGrid: `import { BuiBentoGrid, BuiBentoItem } from 'ng-blatui';

<div buiBentoGrid [columns]="3">
  <bui-bento-item title="Fast" description="Blazing speed" [colSpan]="2" />
</div>`,
    gallery: `import { BuiGallery } from 'ng-blatui';

<bui-gallery [images]="images" [columns]="3" />`,
    loadingOverlay: `import { BuiLoadingOverlay } from 'ng-blatui';

<bui-loading-overlay [show]="loading()">…content…</bui-loading-overlay>`,
    numberInput: `import { BuiNumberInput } from 'ng-blatui';

<bui-number-input [(value)]="qty" [min]="0" [max]="10" />`,
    variantSelector: `import { BuiVariantSelector } from 'ng-blatui';

<bui-variant-selector [(value)]="size" [options]="['S','M','L']" />`,
    sparkline: `import { BuiSparkline } from 'ng-blatui';

<bui-sparkline [data]="[4, 8, 5, 12, 7, 14, 9]" />`,
    addToCart: `import { BuiAddToCart } from 'ng-blatui';

<bui-add-to-cart (triggered)="addItem()" />`,
    passwordStrength: `import { BuiPasswordStrength } from 'ng-blatui';

<bui-password-strength [minLength]="8" />`,
    productCard: `import { BuiProductCard } from 'ng-blatui';

<bui-product-card
  title="Trail Runner"
  image="/shoe.jpg"
  [price]="49.99"
  [compareAt]="69.99"
  badge="Sale"
  [rating]="4.5"
  [reviews]="128"
  [wishlist]="true"
/>`,
    typewriter: `import { BuiTypewriter } from 'ng-blatui';

<bui-typewriter [words]="['design', 'build', 'ship']" />`,
    streamingText: `import { BuiStreamingText } from 'ng-blatui';

<bui-streaming-text text="Streaming responses, one token at a time." />`,
    borderBeam: `import { BuiBorderBeam } from 'ng-blatui';

<bui-border-beam class="max-w-xs">Travelling border beam.</bui-border-beam>`,
    meteors: `import { BuiMeteors } from 'ng-blatui';

<bui-meteors [count]="20" class="rounded-xl border p-10">Content above the meteors.</bui-meteors>`,
    aurora: `import { BuiAurora } from 'ng-blatui';

<bui-aurora class="p-12 text-white">Aurora background</bui-aurora>`,
    marquee: `import { BuiMarquee } from 'ng-blatui';

<bui-marquee [items]="['Acme', 'Globex', 'Initech', 'Umbrella']" />`,
    bottomNavigation: `import { BuiBottomNavigation, BuiBottomNavigationItem } from 'ng-blatui';

<nav buiBottomNavigation>
  <a buiBottomNavItem href="#" label="Home" [active]="true">🏠</a>
  <a buiBottomNavItem href="#" label="Search">🔍</a>
  <a buiBottomNavItem href="#" label="Alerts" [badge]="3">🔔</a>
</nav>`,
    textReveal: `import { BuiTextReveal } from 'ng-blatui';

<bui-text-reveal text="Scroll to reveal this text word by word." />`,
    parallax: `import { BuiParallax } from 'ng-blatui';

<bui-parallax [speed]="0.3">Floating layer</bui-parallax>`,
    scrollspy: `import { BuiScrollspy } from 'ng-blatui';

<bui-scrollspy [items]="[{ href: '#intro', label: 'Intro' }]" />`,
    timeField: `import { BuiTimeField } from 'ng-blatui';

<bui-time-field [(value)]="time" />`,
    toggleGroup: `import { BuiToggleGroup, BuiToggleGroupItem } from 'ng-blatui';

<bui-toggle-group [(value)]="align">
  <button buiToggleGroupItem value="left">Left</button>
  <button buiToggleGroupItem value="center">Center</button>
  <button buiToggleGroupItem value="right">Right</button>
</bui-toggle-group>`,
    tagsInput: `import { BuiTagsInput } from 'ng-blatui';

<bui-tags-input [(tags)]="tags" />`,
    editable: `import { BuiEditable } from 'ng-blatui';

<bui-editable [(value)]="name" />`,
    speedDial: `import { BuiSpeedDial } from 'ng-blatui';

<bui-speed-dial [actions]="[{ label: 'Share' }, { label: 'Edit' }]" />`,
    knob: `import { BuiKnob } from 'ng-blatui';

<bui-knob [(value)]="level" [min]="0" [max]="100" />`,
    image: `import { BuiImage } from 'ng-blatui';

<bui-image src="/photo.jpg" alt="A scenic view" ratio="16/9" />`,
    reasoning: `import { BuiReasoning } from 'ng-blatui';

<bui-reasoning duration="2.4s">
  First, I considered the constraints, then weighed the trade-offs…
</bui-reasoning>`,
    toolCall: `import { BuiToolCall } from 'ng-blatui';

<bui-tool-call name="search_web" status="success" args="{ q: 'angular' }" result="3 results" />`,
    chat: `import { BuiChat, BuiChatMessage } from 'ng-blatui';

<div buiChat>
  <bui-chat-message role="assistant" name="Bot">Hi! How can I help?</bui-chat-message>
  <bui-chat-message role="user" name="You">Build me a UI library.</bui-chat-message>
</div>`,
    confetti: `import { BuiConfetti } from 'ng-blatui';

<bui-confetti><button buiButton>Launch 🎉</button></bui-confetti>`,
    stepper: `import { BuiStepper, BuiStepperItem } from 'ng-blatui';

<bui-stepper [value]="2">
  <li buiStepperItem [step]="1">Account</li>
  <li buiStepperItem [step]="2">Profile</li>
  <li buiStepperItem [step]="3">Done</li>
</bui-stepper>`,
    inputOtp: `import { BuiInputOtp } from 'ng-blatui';

<bui-input-otp [(value)]="code" [maxlength]="6" />`,
    phoneInput: `import { BuiPhoneInput } from 'ng-blatui';

<bui-phone-input [(value)]="phone" [(country)]="country" />`,
    promptInput: `import { BuiPromptInput } from 'ng-blatui';

<bui-prompt-input [attachable]="true" (submitted)="send($event)" />`,
    heatmap: `import { BuiHeatmap } from 'ng-blatui';

<bui-heatmap [data]="activity" />`,
    citation: `import { BuiCitation } from 'ng-blatui';

The sky is blue<bui-citation [index]="1" title="Rayleigh scattering" url="https://en.wikipedia.org" />.`,
    resizable: `import { BuiResizablePanelGroup, BuiResizablePanel, BuiResizableHandle } from 'ng-blatui';

<bui-resizable-panel-group class="h-40">
  <div buiResizablePanel [primary]="true">Sidebar</div>
  <bui-resizable-handle [withHandle]="true" />
  <div buiResizablePanel>Content</div>
</bui-resizable-panel-group>`,
    video: `import { BuiVideo } from 'ng-blatui';

<bui-video src="/demo.mp4" poster="/poster.jpg" />`,
    colorPicker: `import { BuiColorPicker } from 'ng-blatui';

<bui-color-picker [(value)]="color" />`,
    cookieConsent: `import { BuiCookieConsent } from 'ng-blatui';

<bui-cookie-consent (decided)="onConsent($event)" />`,
    infiniteScroll: `import { BuiInfiniteScroll } from 'ng-blatui';

<bui-infinite-scroll [loading]="loading()" [finished]="done()" (more)="loadMore()">
  …items…
</bui-infinite-scroll>`,
    audioPlayer: `import { BuiAudioPlayer } from 'ng-blatui';

<bui-audio-player src="/track.mp3" title="Nightfall" artist="The Band" />`,
    signaturePad: `import { BuiSignaturePad } from 'ng-blatui';

<bui-signature-pad [height]="180" />`,
    dock: `import { BuiDock, BuiDockItem } from 'ng-blatui';

<bui-dock>
  <bui-dock-item [active]="true">🏠</bui-dock-item>
  <bui-dock-item>📁</bui-dock-item>
  <bui-dock-item>✉️</bui-dock-item>
</bui-dock>`,
    tree: `import { BuiTree } from 'ng-blatui';

<bui-tree [items]="files" />
// files = [{ label: 'src', expanded: true, children: [...] }]`,
    repeater: `import { BuiRepeater } from 'ng-blatui';

<bui-repeater [fields]="fields" [(rows)]="rows" />
// fields = [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }]`,
    notificationCenter: `import { BuiNotificationCenter } from 'ng-blatui';

<bui-notification-center [notifications]="feed" />`,
    jsonViewer: `import { BuiJsonViewer } from 'ng-blatui';

<bui-json-viewer [data]="response" />`,
    orgChart: `import { BuiOrgChart } from 'ng-blatui';

<bui-org-chart [node]="org" />
// org = { name: 'CEO', children: [{ name: 'CTO' }, ...] }`,
    miniCart: `import { BuiMiniCart } from 'ng-blatui';

<bui-mini-cart [items]="cart" />`,
    animatedBeam: `import { BuiAnimatedBeam } from 'ng-blatui';

<bui-animated-beam from="#a" to="#b">
  <div id="a">…</div>
  <div id="b">…</div>
</bui-animated-beam>`,
  };
}

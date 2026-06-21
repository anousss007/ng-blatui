import { Overlay } from '@angular/cdk/overlay';
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
  BuiAutocomplete,
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
  BuiCalendar,
  BuiCard,
  BuiCardContent,
  BuiCardDescription,
  BuiCardFooter,
  BuiCardHeader,
  BuiCardTitle,
  BuiCarousel,
  BuiChart,
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
  BuiCommand,
  BuiComparisonSlider,
  BuiComparisonTable,
  BuiConfetti,
  BuiContainer,
  BuiContextMenu,
  BuiCookieConsent,
  BuiCopyButton,
  BuiCountdown,
  BuiDataTable,
  BuiDatePicker,
  BuiDatetimePicker,
  BuiDescriptionItem,
  BuiDescriptionList,
  BuiDialogContent,
  BuiDialogDescription,
  BuiDialogFooter,
  BuiDialogHeader,
  BuiDialogTitle,
  BuiDiffViewer,
  BuiDock,
  BuiDockItem,
  BuiDotPattern,
  BuiDrawer,
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
  BuiFieldContent,
  BuiFieldDescription,
  BuiFieldError,
  BuiFieldGroup,
  BuiFieldLabel,
  BuiFieldLegend,
  BuiFieldSet,
  BuiFileUpload,
  BuiFlipCard,
  BuiGallery,
  BuiGantt,
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
  BuiInputMask,
  BuiInputOtp,
  BuiItem,
  BuiItemActions,
  BuiItemContent,
  BuiItemDescription,
  BuiItemGroup,
  BuiItemMedia,
  BuiItemTitle,
  BuiJsonViewer,
  BuiKanban,
  BuiKbd,
  BuiKbdGroup,
  BuiKnob,
  BuiLabel,
  BuiLink,
  BuiLoadingOverlay,
  BuiMap,
  BuiMarkdownEditor,
  BuiMarquee,
  BuiMasonry,
  BuiMentionInput,
  BuiMenubar,
  BuiMenubarTrigger,
  BuiMeteors,
  BuiMeter,
  BuiMiniCart,
  BuiNavigationMenu,
  BuiNotificationCenter,
  BuiNumberInput,
  BuiNumberTicker,
  BuiOnboardingTour,
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
  BuiQrCode,
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
  BuiRichTextEditor,
  BuiScheduler,
  BuiScrollArea,
  BuiScrollspy,
  BuiSegmentedControl,
  BuiSelect,
  BuiSeparator,
  BuiSheet,
  BuiSidebar,
  BuiSidebarMenuButton,
  BuiSignaturePad,
  BuiSkeleton,
  BuiSlider,
  BuiSonner,
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
  BuiToaster,
  BuiToggle,
  BuiToggleGroup,
  BuiToggleGroupItem,
  BuiToolCall,
  BuiTooltip,
  BuiTopProgress,
  BuiTree,
  BuiTreeTable,
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
  'org-chart': { title: 'Org chart', description: 'A top-down organizational chart.' },
  'mini-cart': { title: 'Mini cart', description: 'A cart dropdown with line items.' },
  'animated-beam': { title: 'Animated beam', description: 'An SVG beam linking two nodes.' },
  'diff-viewer': { title: 'Diff viewer', description: 'A line-by-line text diff.' },
  'tree-table': { title: 'Tree table', description: 'A table with expandable nested rows.' },
  'markdown-editor': { title: 'Markdown editor', description: 'A textarea with live preview.' },
  calendar: { title: 'Calendar', description: 'A single-month date calendar.' },
  'date-picker': { title: 'Date picker', description: 'A date input with a calendar popover.' },
  carousel: { title: 'Carousel', description: 'A slide carousel with arrows and dots.' },
  command: { title: 'Command', description: 'A command palette (filterable actions).' },
  'context-menu': { title: 'Context menu', description: 'A right-click menu at the cursor.' },
  'data-table': { title: 'Data table', description: 'Search, sort, select and paginate rows.' },
  chart: { title: 'Chart', description: 'A lightweight SVG line/area/bar chart.' },
  'datetime-picker': { title: 'Datetime picker', description: 'Pick a date and time together.' },
  autocomplete: { title: 'Autocomplete', description: 'A free-text input with suggestions.' },
  'comparison-slider': {
    title: 'Comparison slider',
    description: 'A before/after image comparison.',
  },
  'file-upload': { title: 'File upload', description: 'A drag-and-drop file upload zone.' },
  'top-progress': { title: 'Top progress', description: 'An NProgress-style page loading bar.' },
  drawer: { title: 'Drawer', description: 'A slide-in panel anchored to an edge.' },
  'input-mask': { title: 'Input mask', description: 'A text input formatted against a mask.' },
  sheet: { title: 'Sheet', description: 'An overlay panel sliding from an edge.' },
  sonner: { title: 'Sonner', description: 'Stacked toast notifications.' },
  'navigation-menu': { title: 'Navigation menu', description: 'A horizontal menu with dropdowns.' },
  'mention-input': {
    title: 'Mention input',
    description: 'A textarea with @-mention suggestions.',
  },
  map: { title: 'Map', description: 'A keyless OpenStreetMap embed.' },
  gantt: { title: 'Gantt', description: 'A timeline of task bars over a date range.' },
  scheduler: { title: 'Scheduler', description: 'A week/day calendar of events.' },
  kanban: { title: 'Kanban', description: 'A drag-and-drop board of cards.' },
  'rich-text-editor': {
    title: 'Rich text editor',
    description: 'A contenteditable editor with a toolbar.',
  },
  sidebar: { title: 'Sidebar', description: 'A collapsible navigation sidebar.' },
  'onboarding-tour': { title: 'Onboarding tour', description: 'A guided spotlight product tour.' },
  'qr-code': { title: 'QR code', description: 'A scannable QR code rendered as SVG.' },
};

/** Value type for single/multi toggle groups (matches the bui-toggle-group model). */
type ToggleValue = string | string[] | null;

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
    BuiFieldContent,
    BuiFieldDescription,
    BuiFieldError,
    BuiFieldGroup,
    BuiFieldLabel,
    BuiFieldLegend,
    BuiFieldSet,
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
    BuiItemGroup,
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
    BuiDiffViewer,
    BuiTreeTable,
    BuiMarkdownEditor,
    BuiCalendar,
    BuiDatePicker,
    BuiCarousel,
    BuiCommand,
    BuiContextMenu,
    BuiDataTable,
    BuiChart,
    BuiDatetimePicker,
    BuiAutocomplete,
    BuiComparisonSlider,
    BuiFileUpload,
    BuiTopProgress,
    BuiDrawer,
    BuiInputMask,
    BuiSheet,
    BuiSonner,
    BuiNavigationMenu,
    BuiMentionInput,
    BuiMap,
    BuiGantt,
    BuiScheduler,
    BuiKanban,
    BuiRichTextEditor,
    BuiSidebar,
    BuiSidebarMenuButton,
    BuiOnboardingTour,
    BuiQrCode,
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
  private readonly overlay = inject(Overlay);
  protected readonly dialogTpl = viewChild.required<TemplateRef<unknown>>('dialogTpl');
  protected readonly alertTpl = viewChild.required<TemplateRef<unknown>>('alertTpl');
  protected readonly alertConfirmTpl = viewChild.required<TemplateRef<unknown>>('alertConfirmTpl');
  protected readonly dialogFormTpl = viewChild.required<TemplateRef<unknown>>('dialogFormTpl');
  protected readonly dialogConfirmTpl =
    viewChild.required<TemplateRef<unknown>>('dialogConfirmTpl');
  protected readonly dialogScrollTpl = viewChild.required<TemplateRef<unknown>>('dialogScrollTpl');
  protected readonly dialogFullscreenTpl =
    viewChild.required<TemplateRef<unknown>>('dialogFullscreenTpl');
  protected readonly dialogPositionedTpl =
    viewChild.required<TemplateRef<unknown>>('dialogPositionedTpl');
  protected readonly dialogDispatchTpl =
    viewChild.required<TemplateRef<unknown>>('dialogDispatchTpl');

  protected readonly terms = signal(true);
  protected readonly notifications = signal(true);
  protected readonly dmStatusBar = signal(true);
  protected readonly dmActivityBar = signal(false);
  protected readonly dmPanel = signal('bottom');
  protected readonly volume = signal(60);
  protected readonly score = signal(4);
  protected readonly qty = signal(2);
  protected readonly view = signal('list');
  protected readonly badgeTags = signal(['Design', 'Engineering', 'Marketing']);
  protected removeBadgeTag(tag: string): void {
    this.badgeTags.set(this.badgeTags().filter((t) => t !== tag));
  }
  protected readonly alertShow = signal(true);
  protected readonly taLen = signal(0);
  protected readonly rteValue = signal('<p>Edit <strong>me</strong> — try the toolbar.</p>');
  protected readonly sidebarOpen = signal(true);
  protected readonly sidebarIconOpen = signal(true);
  protected readonly sidebarRightOpen = signal(true);
  protected readonly tourOpen = signal(false);
  protected readonly tourSteps = [
    { target: '#tour-1', title: 'Search', body: 'Find anything fast from here.' },
    { target: '#tour-2', title: 'Create', body: 'Add a new item with one click.' },
  ];
  protected readonly ganttTasks = [
    { name: 'Research', start: '2026-01-01', end: '2026-01-06', progress: 100 },
    {
      name: 'Design',
      start: '2026-01-05',
      end: '2026-01-12',
      progress: 60,
      color: 'bg-violet-500',
    },
    { name: 'Build', start: '2026-01-10', end: '2026-01-24', progress: 25, color: 'bg-sky-500' },
    {
      name: 'Launch',
      start: '2026-01-24',
      end: '2026-01-28',
      progress: 0,
      color: 'bg-emerald-500',
    },
  ];
  protected readonly schedulerEvents = [
    { title: 'Standup', day: 0, start: '09:00', end: '09:30' },
    { title: 'Design review', day: 1, start: '11:00', end: '12:30', color: 'bg-violet-500' },
    { title: 'Lunch', day: 2, start: '12:00', end: '13:00', color: 'bg-emerald-600' },
    { title: '1:1', day: 4, start: '15:00', end: '16:00', color: 'bg-sky-600' },
  ];
  protected readonly kanbanColumns = [
    {
      id: 'todo',
      title: 'To do',
      cards: [
        { id: 'k1', title: 'Set up CI', tags: ['infra'] },
        { id: 'k2', title: 'Write docs', tags: ['docs'], meta: 'Due Fri' },
      ],
    },
    {
      id: 'doing',
      title: 'In progress',
      cards: [{ id: 'k3', title: 'Port components', tags: ['feature'] }],
    },
    { id: 'done', title: 'Done', cards: [{ id: 'k4', title: 'Theme tokens' }] },
  ];
  private readonly toaster = inject(BuiToaster);
  protected readonly maskValue = signal('');
  protected readonly sheetOpen = signal(false);
  protected readonly sheetLeftOpen = signal(false);
  protected readonly sheetBottomOpen = signal(false);
  protected readonly drawerBottomOpen = signal(false);
  protected readonly drawerLeftOpen = signal(false);
  protected readonly mentionValue = signal('');
  protected readonly mentionItems = [
    { value: 'ada', label: 'Ada Lovelace' },
    { value: 'grace', label: 'Grace Hopper' },
    { value: 'alan', label: 'Alan Turing' },
  ];
  protected readonly navItems = [
    {
      label: 'Products',
      links: [
        { label: 'Analytics', description: 'Understand your traffic' },
        { label: 'Automation', description: 'Build powerful workflows' },
      ],
    },
    { label: 'Docs', href: '/docs' },
    { label: 'Pricing', href: '/pricing' },
  ];
  protected readonly navItemsSimple = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '/docs' },
  ];
  protected readonly navItemsFeatured = [
    {
      label: 'Products',
      featured: {
        label: 'ng-blatui',
        description: 'Signal-first Angular UI components',
        href: '/',
      },
      links: [
        { label: 'Analytics', description: 'Understand your traffic' },
        { label: 'Automation', description: 'Build powerful workflows' },
      ],
    },
    { label: 'Docs', href: '/docs' },
  ];
  protected readonly editableMultiline = signal('Click to edit this\nmulti-line note.');
  protected readonly cmdGroupsSimple = [
    {
      label: 'Actions',
      items: [{ label: 'New file' }, { label: 'Search' }, { label: 'Settings' }],
    },
  ];
  protected readonly orgRootAvatars = {
    name: 'Ada Lovelace',
    title: 'CEO',
    avatar: 'https://i.pravatar.cc/64?img=1',
    children: [
      { name: 'Grace Hopper', title: 'CTO', avatar: 'https://i.pravatar.cc/64?img=5' },
      { name: 'Edsger Dijkstra', title: 'CFO', avatar: 'https://i.pravatar.cc/64?img=12' },
    ],
  };

  protected showToast(): void {
    this.toaster.show({
      title: 'Event created',
      description: 'Sat, Jun 21 at 9:00 AM',
      tone: 'success',
    });
  }
  protected showToastError(): void {
    this.toaster.show({
      title: 'Something went wrong',
      description: 'Please try again.',
      tone: 'error',
    });
  }
  protected showToastInfo(): void {
    this.toaster.show({
      title: 'New update available',
      description: 'Refresh to get version 2.0.',
      tone: 'info',
    });
  }
  protected showToastWarning(): void {
    this.toaster.show({
      title: 'Storage almost full',
      description: '92% of your quota used.',
      tone: 'warning',
    });
  }
  protected showToastStack(): void {
    this.toaster.show({ title: 'File uploaded' });
    this.toaster.show({ title: 'Comment posted', tone: 'success' });
    this.toaster.show({ title: 'Sync complete', tone: 'info' });
  }
  protected showToastPromise(): void {
    const id = this.toaster.show({ title: 'Saving changes…', duration: 0 });
    setTimeout(() => {
      this.toaster.dismiss(id);
      this.toaster.show({ title: 'Changes saved', tone: 'success' });
    }, 1500);
  }
  protected showToastAction(): void {
    this.toaster.show({
      title: 'Message archived',
      tone: 'default',
      action: { label: 'Undo' },
    });
  }
  protected showToastRich(): void {
    this.toaster.show({
      title: 'Deployment ready',
      description: 'ngblatui.remix-it.com is live with your latest changes.',
    });
  }
  protected readonly acValue = signal('');
  protected readonly acOptions = ['Angular', 'React', 'Svelte', 'Vue', 'Solid', 'Qwik'];
  protected readonly compareValue = signal(50);
  protected readonly drawerOpen = signal(false);
  protected readonly drawerScrollOpen = signal(false);
  protected readonly repeaterRowsMax = signal<Record<string, string>[]>([{ name: '', email: '' }]);
  protected readonly loadingShow = signal(true);
  protected readonly dtColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', align: 'right' as const },
  ];
  protected readonly dtRows = [
    { name: 'Ada Lovelace', email: 'ada@example.com', role: 'Owner' },
    { name: 'Grace Hopper', email: 'grace@example.com', role: 'Admin' },
    { name: 'Alan Turing', email: 'alan@example.com', role: 'Member' },
    { name: 'Edsger Dijkstra', email: 'edsger@example.com', role: 'Member' },
    { name: 'Linus Torvalds', email: 'linus@example.com', role: 'Admin' },
    { name: 'Margaret Hamilton', email: 'margaret@example.com', role: 'Owner' },
    { name: 'Donald Knuth', email: 'don@example.com', role: 'Member' },
  ];
  protected readonly chartSeries = [{ data: [12, 19, 9, 22, 16, 28, 24] }];
  protected readonly chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  protected readonly dtmValue = signal('');
  protected readonly cmdGroups = [
    {
      label: 'Suggestions',
      items: [
        { label: 'New file', shortcut: '⌘N' },
        { label: 'Open folder', shortcut: '⌘O' },
      ],
    },
    {
      label: 'Settings',
      items: [{ label: 'Toggle theme' }, { label: 'Keyboard shortcuts', shortcut: '⌘K' }],
    },
  ];
  protected readonly ctxItems = [
    { label: 'Back' },
    { label: 'Reload', shortcut: '⌘R' },
    { separator: true },
    { label: 'Copy', shortcut: '⌘C' },
    { label: 'Delete', danger: true },
  ];
  protected readonly calDate = signal('');
  protected readonly calDisabledDates = ['2026-06-10', '2026-06-16', '2026-06-24'];
  protected readonly dpDate = signal('');
  protected readonly diffBefore = 'const x = 1;\nconst y = 2;\nconsole.log(x);';
  protected readonly diffAfter = 'const x = 1;\nconst y = 3;\nconsole.log(x + y);';
  protected readonly ttColumns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type', align: 'right' as const },
  ];
  protected readonly ttRows = [
    {
      name: 'src',
      type: 'folder',
      expanded: true,
      children: [
        { name: 'app.ts', type: 'file' },
        { name: 'main.ts', type: 'file' },
      ],
    },
    { name: 'package.json', type: 'file' },
  ];
  protected readonly mdValue = signal(
    '# Hello\n\nThis is **markdown** with `code` and *emphasis*.',
  );
  protected readonly mdPrefilled = signal(
    '## Release notes\n\n- New **calendar** inputs\n- `bui-carousel` vertical mode\n\n> Ship it.',
  );
  protected readonly rtePrefilled = signal(
    '<h3>Welcome</h3><p>This editor starts <strong>prefilled</strong> with <em>rich</em> content.</p>',
  );
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
  protected readonly jsonArray = [
    { id: 1, name: 'Ada Lovelace', role: 'Admin' },
    { id: 2, name: 'Grace Hopper', role: 'Editor' },
    { id: 3, name: 'Alan Turing', role: 'Viewer' },
  ];
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
  protected readonly treeFiles = [
    {
      label: 'src',
      expanded: true,
      children: [
        {
          label: 'components',
          children: [
            { label: 'button.ts', icon: 'file-code' },
            { label: 'card.ts', icon: 'file-code' },
          ],
        },
        { label: 'index.ts', icon: 'file-code' },
        { label: 'styles.css', icon: 'file' },
      ],
    },
    { label: 'README.md', icon: 'file-text' },
  ];
  protected readonly repeaterFields2 = [
    { key: 'name', label: 'Name', placeholder: 'Ada Lovelace' },
    { key: 'email', label: 'Email', placeholder: 'ada@example.com', type: 'email' },
  ];
  protected readonly repeaterRows2 = signal<Record<string, string>[]>([{ name: '', email: '' }]);
  protected readonly colorValue = signal('#22c55e');
  protected readonly resizeSize = signal(40);
  protected readonly otpValue = signal('');
  protected readonly phoneNumber = signal('');
  protected readonly phoneCountry = signal('US');
  protected readonly toggleAlign = signal<ToggleValue>('center');
  protected readonly toggleStyles = signal<ToggleValue>(['bold']);
  protected readonly tagList = signal(['angular', 'signals']);
  protected readonly tagListPrefilled = signal(['design', 'frontend', 'accessibility', 'ssr']);
  protected readonly sheetScrollOpen = signal(false);
  protected readonly editName = signal('Ada Lovelace');
  protected readonly knobValue = signal(40);
  protected readonly timeValue = signal('09:30');
  protected readonly speedActions = [{ label: 'Share' }, { label: 'Edit' }, { label: 'Delete' }];
  protected readonly sizeChoice = signal('M');
  protected readonly toggleView = signal<ToggleValue>('grid');
  protected readonly toggleSizeVal = signal<ToggleValue>('center');
  protected readonly colorChoice = signal('black');
  protected readonly meterThresholds = [
    { at: 0, tone: 'good' as const },
    { at: 60, tone: 'warning' as const },
    { at: 85, tone: 'danger' as const },
  ];
  protected readonly statSpark = [8, 11, 9, 14, 12, 18, 16, 22, 20, 26];
  protected readonly variantColors = [
    { value: 'black', label: 'Black', color: '#18181b' },
    { value: 'blue', label: 'Blue', color: '#2563eb' },
    { value: 'green', label: 'Green', color: '#16a34a' },
    { value: 'red', label: 'Red', color: '#dc2626' },
  ];
  protected readonly treeExpanded = [
    {
      label: 'src',
      expanded: true,
      children: [
        {
          label: 'app',
          expanded: true,
          children: [{ label: 'app.ts' }, { label: 'app.html' }],
        },
        { label: 'main.ts' },
      ],
    },
    { label: 'package.json' },
  ];
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
  protected readonly selectIconOptions = [
    {
      value: 'profile',
      label: 'Profile',
      icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
    },
    { value: 'billing', label: 'Billing', icon: 'M2 5h20v14H2zM2 10h20' },
    { value: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' },
  ];
  protected readonly selectGroupedOptions = [
    { value: 'apple', label: 'Apple', group: 'Fruits' },
    { value: 'banana', label: 'Banana', group: 'Fruits' },
    { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
    { value: 'potato', label: 'Potato', group: 'Vegetables' },
    { value: 'basil', label: 'Basil', group: 'Herbs' },
  ];
  protected readonly timezone = signal('');
  protected readonly timezones = [
    { value: 'utc', label: 'UTC' },
    { value: 'est', label: 'Eastern (EST)' },
    { value: 'cst', label: 'Central (CST)' },
    { value: 'mst', label: 'Mountain (MST)' },
    { value: 'pst', label: 'Pacific (PST)' },
    { value: 'gmt', label: 'London (GMT)' },
    { value: 'cet', label: 'Paris (CET)' },
    { value: 'eet', label: 'Athens (EET)' },
    { value: 'msk', label: 'Moscow (MSK)' },
    { value: 'ist', label: 'India (IST)' },
    { value: 'cst-a', label: 'Beijing (CST)' },
    { value: 'jst', label: 'Tokyo (JST)' },
    { value: 'aest', label: 'Sydney (AEST)' },
  ];
  protected readonly framework = signal('');
  protected readonly frameworks = [
    { value: 'ng', label: 'Angular' },
    { value: 're', label: 'React' },
    { value: 'vu', label: 'Vue' },
    { value: 'sv', label: 'Svelte' },
  ];
  protected readonly comboboxStatuses = [
    {
      value: 'backlog',
      label: 'Backlog',
      icon: 'M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4',
    },
    { value: 'todo', label: 'Todo', icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z' },
    {
      value: 'in-progress',
      label: 'In progress',
      icon: 'M12 2a10 10 0 0 1 10 10M12 22a10 10 0 0 1 0-20',
    },
    { value: 'done', label: 'Done', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3' },
  ];
  protected readonly pricingRows = [
    { feature: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
    { feature: 'Analytics', values: [false, true, true] },
    { feature: 'SSO', values: [false, false, true] },
  ];
  protected readonly plan = signal('free');
  protected readonly radioNotify = signal('all');
  protected readonly radioPay = signal('card');
  protected readonly radioColor = signal('success');
  protected readonly radioCards = signal('pro');
  protected readonly team = [
    { name: 'Ada Lovelace' },
    { name: 'Alan Turing' },
    { name: 'Grace Hopper' },
    { name: 'Linus Torvalds' },
  ];
  protected readonly teamImg = [
    { name: 'Ada Lovelace', src: 'https://i.pravatar.cc/64?img=1' },
    { name: 'Alan Turing', src: 'https://i.pravatar.cc/64?img=2' },
    { name: 'Grace Hopper', src: 'https://i.pravatar.cc/64?img=3' },
    { name: 'Linus Torvalds', src: 'https://i.pravatar.cc/64?img=4' },
  ];

  protected openDialog(): void {
    this.dialog.open(this.dialogTpl(), { ariaModal: true });
  }

  protected openFormDialog(): void {
    this.dialog.open(this.dialogFormTpl(), { ariaModal: true });
  }

  protected openDialogConfirm(): void {
    this.dialog.open(this.dialogConfirmTpl(), { ariaModal: true });
  }

  protected openDialogScroll(): void {
    this.dialog.open(this.dialogScrollTpl(), { ariaModal: true });
  }

  protected openDialogFullscreen(): void {
    this.dialog.open(this.dialogFullscreenTpl(), {
      ariaModal: true,
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
    });
  }

  protected openDialogPositioned(): void {
    this.dialog.open(this.dialogPositionedTpl(), {
      ariaModal: true,
      positionStrategy: this.overlay.position().global().top('1.5rem').centerHorizontally(),
    });
  }

  protected openDialogDispatch(): void {
    this.dialog.open(this.dialogDispatchTpl(), { ariaModal: true });
  }

  protected openAlertDialog(): void {
    this.dialog.open(this.alertTpl(), { ariaModal: true });
  }

  protected openConfirmDialog(): void {
    this.dialog.open(this.alertConfirmTpl(), { ariaModal: true });
  }

  protected readonly code = {
    button: `import { BuiButton } from 'ng-blatui';

<button buiButton>Button</button>`,
    buttonVariants: `<button buiButton>Default</button>
<button buiButton variant="secondary">Secondary</button>
<button buiButton variant="destructive">Destructive</button>
<button buiButton variant="outline">Outline</button>
<button buiButton variant="ghost">Ghost</button>
<button buiButton variant="link">Link</button>`,
    buttonSizes: `<button buiButton size="xs">Extra small</button>
<button buiButton size="sm">Small</button>
<button buiButton>Default</button>
<button buiButton size="lg">Large</button>`,
    buttonIcon: `<button buiButton variant="outline"><svg><!-- mail --></svg> Login with Email</button>
<button buiButton><svg><!-- download --></svg> Download</button>`,
    buttonBeforeAfter: `<button buiButton variant="outline">
  <svg><!-- leading --></svg> Dashboard <svg><!-- trailing --></svg>
</button>`,
    avatarHoverGroup: `<!-- overlap, then spread on hover -->
<div class="flex -space-x-3 transition-all hover:space-x-1">
  <bui-avatar class="ring-2 ring-background transition-all">JD</bui-avatar>
</div>`,
    kbdSizes: `<kbd buiKbd class="text-[10px]">Esc</kbd>
<kbd buiKbd>Esc</kbd>
<kbd buiKbd class="px-2 py-1 text-sm">Esc</kbd>`,
    spinnerCustomIcon: `<!-- any svg + animate-spin -->
<svg class="size-6 animate-spin text-primary"><!-- custom icon --></svg>`,
    buttonLoading: `<button buiButton disabled>
  <svg class="animate-spin"><!-- spinner --></svg> Please wait
</button>`,
    buttonPill: `<button buiButton class="rounded-full">Get started</button>
<button buiButton variant="outline" class="rounded-full">Learn more</button>
<button buiButton size="icon" variant="outline" class="rounded-full" aria-label="Like">…</button>`,
    buttonGradient: `<button
  buiButton
  class="border-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:opacity-90"
>
  <svg><!-- sparkles --></svg> Gradient
</button>`,
    buttonSocial: `<button buiButton variant="outline"><svg><!-- github --></svg> Continue with GitHub</button>
<button buiButton variant="outline"><svg><!-- google --></svg> Continue with Google</button>`,
    buttonColor: `<!-- recolor a region by overriding the tokens -->
<div style="--primary: #be185d; --primary-foreground: #fff; --ring: #be185d">
  <button buiButton>Primary</button>
  <button buiButton variant="outline">Outline</button>
</div>`,
    buttonAsLink: `<a buiButton href="/docs" variant="link">Link button</a>
<a buiButton href="/docs" variant="outline"><svg><!-- external --></svg> Visit docs</a>`,
    buttonIconSizes: `<button buiButton size="icon-xs" variant="outline" aria-label="Favourite">…</button>
<button buiButton size="icon-sm" variant="outline" aria-label="Add">…</button>
<button buiButton size="icon" variant="outline" aria-label="Settings">…</button>
<button buiButton size="icon-lg" variant="outline" aria-label="Star">…</button>`,
    badge: `import { BuiBadge } from 'ng-blatui';

<span buiBadge>Badge</span>`,
    badgeVariants: `<span buiBadge>Default</span>
<span buiBadge variant="secondary">Secondary</span>
<span buiBadge variant="destructive">Destructive</span>
<span buiBadge variant="outline">Outline</span>`,
    badgeTones: `<!-- tone="success | warning | danger | info | neutral", variant="soft | solid | outline" -->
<span buiBadge tone="success">Confirmed</span>
<span buiBadge tone="warning" variant="solid">Pending</span>
<span buiBadge tone="danger" variant="outline">Declined</span>`,
    badgeSizes: `<span buiBadge size="sm">Small</span>
<span buiBadge>Default</span>
<span buiBadge size="lg">Large</span>`,
    badgeStatus: `<span buiBadge variant="outline" class="gap-1.5">
  <span class="size-1.5 rounded-full bg-emerald-500"></span> Online
</span>`,
    badgeNumbers: `<span buiBadge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</span>
<span buiBadge variant="destructive" class="h-5 min-w-5 rounded-full px-1 tabular-nums">99</span>`,
    badgeIcon: `<span buiBadge><svg><!-- check --></svg> Verified</span>
<span buiBadge variant="destructive"><svg><!-- alert --></svg> Error</span>`,
    badgeDismissible: `<span buiBadge variant="secondary" class="gap-1 pr-1">
  {{ tag }}
  <button (click)="remove(tag)" aria-label="Remove"><svg><!-- x --></svg></button>
</span>`,
    badgeRich: `<span buiBadge variant="outline" class="h-auto gap-1.5 rounded-full py-1 pl-1">
  <bui-avatar class="size-4" src="/avatar.png" alt="shadcn" /> shadcn
</span>`,
    badgeAsLink: `<a buiBadge href="/docs">Docs</a>
<a buiBadge href="#" variant="secondary">v1.1.0</a>`,
    badgeGradient: `<span buiBadge class="border-transparent bg-gradient-to-r from-indigo-500 to-pink-500 text-white">Pro</span>`,
    card: `import {
  BuiCard, BuiCardHeader, BuiCardTitle, BuiCardDescription, BuiCardContent, BuiCardFooter,
} from 'ng-blatui';

<div buiCard variant="sectioned">
  <div buiCardHeader>
    <h3 buiCardTitle>Create project</h3>
    <p buiCardDescription>Deploy your new project in one click.</p>
  </div>
  <div buiCardContent>…form…</div>
  <div buiCardFooter class="flex-col gap-2">
    <button buiButton class="w-full">Deploy</button>
  </div>
</div>`,
    cardSimple: `<!-- the base card is just p-6 + a rounded border -->
<div buiCard class="max-w-sm"><p class="text-sm">Compose freely inside it.</p></div>`,
    cardStats: `<div buiCard variant="sectioned">
  <div buiCardHeader>
    <div class="flex items-start justify-between">
      <p buiCardDescription>Total Revenue</p>
      <span buiBadge variant="secondary">↑ +20.1%</span>
    </div>
    <h3 buiCardTitle class="text-2xl tabular-nums">$15,231.89</h3>
  </div>
  <div buiCardFooter class="text-muted-foreground text-sm">Trending up this month</div>
</div>`,
    cardLogin: `<div buiCard variant="sectioned">
  <div buiCardHeader>…title + "Sign up" link…</div>
  <div buiCardContent><form>…email + password fields…</form></div>
  <div buiCardFooter class="flex-col gap-2">
    <button buiButton class="w-full">Login</button>
    <button buiButton variant="outline" class="w-full">Login with Google</button>
  </div>
</div>`,
    cardPricing: `<div buiCard variant="sectioned">
  <div buiCardHeader>… "Premium" + <span buiBadge>Popular</span> …</div>
  <div buiCardContent>
    <p><span class="text-4xl font-bold">$29</span> /month</p>
    <ul>… feature list …</ul>
  </div>
  <div buiCardFooter><button buiButton class="w-full">Get started</button></div>
</div>`,
    cardProduct: `<div buiCard variant="sectioned" class="overflow-hidden pt-0">
  <img src="/table.jpg" class="aspect-[4/3] w-full object-cover" alt="" />
  <div buiCardHeader>… title + "In stock" badge + description …</div>
  <div buiCardFooter class="justify-between">
    <span class="text-2xl font-semibold">$249</span>
    <button buiButton>Add to cart</button>
  </div>
</div>`,
    cardNotifications: `<div buiCard variant="sectioned">
  <div buiCardHeader>… title + description …</div>
  <div buiCardContent>
    <div class="flex items-center justify-between rounded-lg border p-3">
      <div>Push notifications…</div>
      <button buiSwitch [checked]="true"></button>
    </div>
    <ul>… activity items …</ul>
  </div>
</div>`,
    cardTestimonial: `<div buiCard variant="sectioned">
  <div buiCardContent class="flex flex-col gap-4 pt-6">
    <span class="text-amber-500">★★★★★</span>
    <p class="text-sm">"…quote…"</p>
    <div class="flex items-center gap-3"><bui-avatar>AB</bui-avatar> Amelia Bell</div>
  </div>
</div>`,
    cardWithAction: `<div buiCard variant="sectioned">
  <div buiCardHeader>
    <div class="flex items-start justify-between gap-2">
      <div>… title + description …</div>
      <button buiButton variant="ghost" size="icon" aria-label="Options">⋯</button>
    </div>
  </div>
  <div buiCardContent>… member row …</div>
</div>`,
    cardBlog: `<div buiCard variant="sectioned" class="overflow-hidden pt-0">
  <div class="bg-muted aspect-[16/9]">…cover…</div>
  <div buiCardHeader>
    <span buiBadge variant="outline" class="w-fit">Engineering</span>
    <h3 buiCardTitle>Shipping a design system</h3>
    <p buiCardDescription>How we built our library.</p>
  </div>
</div>`,
    cardCta: `<div buiCard variant="sectioned" class="text-center">
  <div buiCardHeader>
    <h3 buiCardTitle>Ready to get started?</h3>
    <p buiCardDescription>Create your account in under a minute.</p>
  </div>
  <div buiCardContent class="flex justify-center gap-3">
    <button buiButton>Get started</button>
    <button buiButton variant="outline">Contact sales</button>
  </div>
</div>`,
    cardHoverGlow: `<!-- soft glow on hover -->
<div buiCard variant="sectioned" class="transition-shadow hover:shadow-lg hover:shadow-primary/20">
  …
</div>`,
    cardImageOverlay: `<div buiCard class="relative overflow-hidden p-0">
  <div class="aspect-[4/3] bg-gradient-to-br from-zinc-600 to-zinc-900"></div>
  <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
    <h3 class="text-lg font-semibold">Mountain escape</h3>
  </div>
</div>`,
    cardPayment: `<div buiCard variant="sectioned">
  <div buiCardHeader><h3 buiCardTitle>Payment</h3></div>
  <div buiCardContent class="space-y-4">
    <div buiField><label buiFieldLabel for="n">Card number</label><input id="n" buiInput /></div>
    <div class="grid grid-cols-2 gap-3">… expiry / cvc …</div>
  </div>
  <div buiCardFooter><button buiButton class="w-full">Pay</button></div>
</div>`,
    cardProfile: `<div buiCard variant="sectioned" class="text-center">
  <div buiCardContent class="flex flex-col items-center gap-3 pt-6">
    <span class="grid size-16 place-items-center rounded-full bg-primary text-primary-foreground">JD</span>
    <div><p class="font-medium">Jane Doe</p><p class="text-muted-foreground text-sm">Designer</p></div>
    <button buiButton class="w-full">Follow</button>
  </div>
</div>`,
    cardShare: `<div buiCard variant="sectioned">
  <div buiCardHeader><h3 buiCardTitle>Share this document</h3></div>
  <div buiCardContent class="flex gap-2">
    <input buiInput readonly value="https://…" />
    <button buiButton variant="secondary">Copy</button>
  </div>
</div>`,
    cardWithImage: `<div buiCard variant="sectioned" class="overflow-hidden pt-0">
  <div class="bg-muted aspect-video">…image…</div>
  <div buiCardHeader><h3 buiCardTitle>With image</h3></div>
  <div buiCardContent>Content below the image.</div>
</div>`,
    alert: `import { BuiAlert, BuiAlertTitle, BuiAlertDescription } from 'ng-blatui';

<div buiAlert>
  <svg><!-- circle-check --></svg>
  <h5 buiAlertTitle>Success! Your changes have been saved</h5>
  <div buiAlertDescription>This is an alert with icon, title and description.</div>
</div>`,
    alertDestructive: `<div buiAlert variant="destructive">
  <svg><!-- circle-alert --></svg>
  <h5 buiAlertTitle>Unable to process your payment.</h5>
  <div buiAlertDescription>Please verify your billing information and try again.</div>
</div>`,
    alertDismissible: `<div buiAlert class="relative pe-10">
  <svg><!-- info --></svg>
  <h5 buiAlertTitle>Verify your email</h5>
  <button class="absolute top-3 right-3" aria-label="Dismiss" (click)="show.set(false)">✕</button>
</div>`,
    alertInfo: `<div buiAlert class="border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600">
  <svg><!-- info --></svg>
  <h5 buiAlertTitle>Heads up!</h5>
  <div buiAlertDescription>A new software update is available.</div>
</div>`,
    alertWarning: `<div buiAlert class="border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
  <svg><!-- triangle-alert --></svg>
  <h5 buiAlertTitle>Your subscription is expiring soon</h5>
</div>`,
    alertTones: `<!-- tone="success | warning | danger | info | neutral" -->
<div buiAlert tone="success">…</div>
<div buiAlert tone="warning">…</div>
<div buiAlert tone="info">…</div>`,
    alertLeftAccent: `<div buiAlert class="bg-success/10 text-success border-success rounded-md border-0 border-l-4">
  <svg><!-- icon --></svg>
  <h5 buiAlertTitle>Your request to join the team is approved.</h5>
</div>`,
    alertSolid: `<div buiAlert class="bg-primary text-primary-foreground border-none">
  <svg><!-- info --></svg>
  <h5 buiAlertTitle>Editing your profile</h5>
</div>`,
    alertSimple: `<div buiAlert>
  <svg><!-- terminal --></svg>
  <h5 buiAlertTitle>You can add components using the CLI.</h5>
</div>`,
    alertWithAction: `<div buiAlert class="flex items-center justify-between gap-3">
  <div class="flex items-center gap-3">
    <bui-avatar class="size-9 rounded-md">SR</bui-avatar>
    <div><h5 buiAlertTitle>Sara replied to your photo</h5></div>
  </div>
  <button buiButton variant="outline" size="sm">View</button>
</div>`,
    alertOutline: `<div buiAlert class="border-2 bg-transparent"><svg><!-- icon --></svg>
  <p buiAlertTitle>Outline alert</p><p buiAlertDescription>Border-only.</p></div>`,
    alertGradient: `<div buiAlert class="border-0 bg-gradient-to-r from-primary/10 to-transparent">…</div>`,
    alertIconBox: `<!-- force flex to override the default grid, icon in a filled box -->
<div buiAlert class="flex items-center gap-3">
  <span class="grid size-9 place-items-center rounded-md bg-primary/10 text-primary"><svg><!-- icon --></svg></span>
  <span><p buiAlertTitle>New message</p><p buiAlertDescription>…</p></span>
</div>`,
    input: `import { BuiInput } from 'ng-blatui';

<input buiInput type="email" placeholder="Email" />`,
    inputSizes: `<input buiInput size="sm" placeholder="Small" />
<input buiInput placeholder="Default" />
<input buiInput size="lg" placeholder="Large" />`,
    inputWithLabel: `<label buiLabel for="email">Email</label>
<input id="email" buiInput type="email" placeholder="Email" />`,
    inputWithIcon: `<div class="relative">
  <svg class="absolute top-1/2 left-3 size-4 -translate-y-1/2"><!-- mail --></svg>
  <input buiInput type="email" class="pl-9" placeholder="you@example.com" />
</div>`,
    inputPassword: `<div class="relative">
  <svg class="absolute top-1/2 left-3 size-4 -translate-y-1/2"><!-- lock --></svg>
  <input buiInput type="password" class="pl-9" placeholder="••••••••" />
</div>`,
    inputWithButton: `<div class="flex items-center gap-2">
  <input buiInput type="email" placeholder="Email" />
  <button buiButton variant="outline">Subscribe</button>
</div>`,
    inputFile: `<label buiLabel for="pic">Picture</label>
<input id="pic" buiInput type="file" />`,
    inputTypes: `<input buiInput type="number" placeholder="Quantity" min="0" />
<input buiInput type="date" aria-label="Date" />
<input buiInput type="search" placeholder="Search…" />`,
    inputDisabled: `<input buiInput type="email" placeholder="Email" disabled />`,
    inputReadonly: `<input buiInput value="you@example.com" readonly aria-label="Email" />`,
    inputInvalid: `<input buiInput value="not-an-email" aria-invalid="true" />
<p class="text-destructive text-sm" role="alert">Please enter a valid email.</p>`,
    inputBranded: `<!-- override the focus ring locally -->
<input buiInput style="--ring: #16a34a" placeholder="Emerald focus" />`,
    inputUtility: `<!-- a native input styled entirely with utility classes -->
<input type="email" class="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50" />`,
    textarea: `import { BuiTextarea } from 'ng-blatui';

<textarea buiTextarea placeholder="Type your message here."></textarea>`,
    textareaWithLabel: `<label buiLabel for="msg">Your message</label>
<textarea id="msg" buiTextarea placeholder="Type your message here."></textarea>`,
    textareaWithText: `<label buiLabel for="msg">Your message</label>
<textarea id="msg" buiTextarea placeholder="…"></textarea>
<p class="text-muted-foreground text-sm">Your message will be shared with support.</p>`,
    textareaWithButton: `<label buiLabel for="msg">Your message</label>
<textarea id="msg" buiTextarea placeholder="…"></textarea>
<button buiButton class="w-fit">Send message</button>`,
    textareaCount: `<textarea
  buiTextarea maxlength="200"
  (input)="len.set($any($event.target).value.length)"
></textarea>
<p class="text-right text-xs tabular-nums">{{ len() }}/200</p>`,
    textareaInvalid: `<textarea buiTextarea aria-invalid="true" placeholder="…"></textarea>
<p class="text-destructive text-sm" role="alert">Bio must be at least 10 characters.</p>`,
    textareaNoResize: `<textarea buiTextarea class="resize-none" placeholder="Can't be resized."></textarea>`,
    textareaReadonly: `<textarea buiTextarea readonly class="bg-muted" aria-label="Read-only">…</textarea>`,
    textareaDisabled: `<textarea buiTextarea placeholder="…" disabled></textarea>`,
    textareaUtility: `<!-- a native textarea styled with utility classes -->
<textarea rows="3" class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"></textarea>`,
    fieldGroup: `<!-- lay out related fields in a grid -->
<div class="grid grid-cols-2 gap-4">
  <div buiField><label buiFieldLabel for="f">First name</label><input id="f" buiInput /></div>
  <div buiField><label buiFieldLabel for="l">Last name</label><input id="l" buiInput /></div>
</div>`,
    label: `import { BuiLabel } from 'ng-blatui';

<label buiLabel for="username">Username</label>
<input id="username" buiInput placeholder="shadcn" />`,
    labelRequired: `<label buiLabel for="email">Email <span class="text-destructive">*</span></label>
<input id="email" buiInput required />`,
    labelCheckbox: `<button id="terms" buiCheckbox aria-label="Accept terms"></button>
<label buiLabel for="terms">Accept terms and conditions</label>`,
    labelDisabled: `<div class="opacity-60">
  <button id="t" buiCheckbox [disabled]="true" aria-label="Accept"></button>
  <label buiLabel for="t">Accept terms and conditions</label>
</div>`,
    labelBadge: `<label buiLabel for="f" class="justify-between">
  Recovery email <span buiBadge variant="secondary">Optional</span>
</label>`,
    separator: `import { BuiSeparator } from 'ng-blatui';

<div buiSeparator class="my-4"></div>
<span buiSeparator orientation="vertical" [decorative]="false" class="h-4"></span>`,
    separatorList: `<div class="rounded-lg border">
  <div class="px-4 py-3">Profile</div>
  <div buiSeparator></div>
  <div class="px-4 py-3">Billing</div>
</div>`,
    separatorWithLabel: `<div class="relative">
  <div buiSeparator></div>
  <span class="bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs uppercase">Or</span>
</div>`,
    skeleton: `import { BuiSkeleton } from 'ng-blatui';

<div buiSkeleton class="size-12 rounded-full"></div>
<div buiSkeleton class="h-4 w-[250px]"></div>`,
    skeletonCard: `<div buiSkeleton class="h-40 w-full rounded-xl"></div>
<div buiSkeleton class="h-4 w-full"></div>
<div buiSkeleton class="h-4 w-3/4"></div>`,
    skeletonList: `@for (i of [1, 2, 3]; track i) {
  <div class="flex items-center gap-4">
    <div buiSkeleton class="size-10 rounded-full"></div>
    <div buiSkeleton class="h-4 w-1/2"></div>
  </div>
}`,
    skeletonTable: `<div class="rounded-md border">
  <div class="flex gap-4 border-b px-4 py-3">
    <div buiSkeleton class="h-4 w-24"></div>
    <div buiSkeleton class="h-4 w-32"></div>
  </div>
</div>`,
    avatar: `import { BuiAvatar } from 'ng-blatui';

<bui-avatar src="/shadcn.png" alt="@shadcn">CN</bui-avatar>`,
    avatarFallback: `<bui-avatar>JD</bui-avatar>`,
    avatarSizes: `<bui-avatar class="size-6" src="/u.png" alt="">CN</bui-avatar>
<bui-avatar class="size-8" src="/u.png" alt="">CN</bui-avatar>
<bui-avatar src="/u.png" alt="">CN</bui-avatar>
<bui-avatar class="size-12" src="/u.png" alt="">CN</bui-avatar>`,
    avatarRounded: `<bui-avatar class="rounded-lg" src="/u.png" alt="">CN</bui-avatar>`,
    avatarRing: `<bui-avatar class="ring-ring ring-offset-background size-10 ring-2 ring-offset-2" src="/u.png" alt="">CN</bui-avatar>`,
    avatarStack: `<div class="flex -space-x-2 *:ring-2 *:ring-background">
  <bui-avatar src="/a.png" alt="">CN</bui-avatar>
  <bui-avatar src="/b.png" alt="">LR</bui-avatar>
  <bui-avatar>+3</bui-avatar>
</div>`,
    avatarStatus: `<div class="relative inline-flex">
  <bui-avatar class="size-10" src="/u.png" alt="">CN</bui-avatar>
  <span class="border-background absolute end-0 bottom-0 size-3 rounded-full border-2 bg-green-600" aria-label="Online"></span>
</div>`,
    avatarBadge: `<div class="relative inline-flex">
  <bui-avatar class="size-10" src="/u.png" alt="">CN</bui-avatar>
  <span class="bg-primary text-primary-foreground absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs">3</span>
</div>`,
    progress: `import { BuiProgress } from 'ng-blatui';

<bui-progress [value]="60" ariaLabel="60 percent" />`,
    progressValues: `<bui-progress [value]="25" ariaLabel="25%" />
<bui-progress [value]="50" ariaLabel="50%" />
<bui-progress [value]="100" ariaLabel="100%" />`,
    progressSizes: `<bui-progress class="h-1" [value]="60" ariaLabel="Thin" />
<bui-progress class="h-3" [value]="60" ariaLabel="Thick" />`,
    progressColors: `<!-- recolor track + indicator via classes -->
<bui-progress class="bg-success/20 *:data-[slot=progress-indicator]:bg-success" [value]="72" ariaLabel="Success" />`,
    progressIndeterminate: `<bui-progress [indeterminate]="true" ariaLabel="Loading" />`,
    progressCircular: `<!-- circular ring; tune size + thickness -->
<bui-progress [value]="66" [circular]="true" [size]="56" [thickness]="6" />`,
    progressWithLabel: `<div class="flex justify-between text-sm">
  <span class="font-medium">Uploading…</span><span class="tabular-nums">60%</span>
</div>
<bui-progress [value]="60" ariaLabel="Upload progress" />`,
    checkbox: `import { BuiCheckbox } from 'ng-blatui';

<button buiCheckbox [(checked)]="accepted" aria-labelledby="t"></button>
<span id="t">Accept terms and conditions</span>`,
    checkboxWithText: `<button buiCheckbox [checked]="true" aria-labelledby="t"></button>
<div>
  <span id="t" class="font-medium">Accept terms and conditions</span>
  <p class="text-muted-foreground text-sm">You agree to our Terms of Service.</p>
</div>`,
    checkboxList: `<button buiCheckbox [checked]="true" aria-label="Recents"></button>
<button buiCheckbox [checked]="true" aria-label="Home"></button>
<button buiCheckbox aria-label="Applications"></button>`,
    checkboxColors: `<!-- override the checked colour via data-state -->
<button buiCheckbox [checked]="true" class="data-[state=checked]:bg-success data-[state=checked]:border-success"></button>`,
    checkboxCircular: `<button buiCheckbox class="rounded-full"></button>
<button buiCheckbox [checked]="true" class="rounded-full"></button>`,
    checkboxIndeterminate: `<button buiCheckbox [indeterminate]="true" aria-label="Select all"></button>`,
    checkboxDisabled: `<button buiCheckbox [disabled]="true" aria-label="Off"></button>
<button buiCheckbox [checked]="true" [disabled]="true" aria-label="On"></button>`,
    checkboxNative: `<label class="flex items-center gap-2 text-sm">
  <input type="checkbox" class="size-4" /> Native checkbox
</label>`,
    checkboxUtility: `<!-- a native input tinted with the theme primary -->
<input type="checkbox" class="size-4 rounded border border-input" style="accent-color: var(--primary)" />`,
    switch: `import { BuiSwitch } from 'ng-blatui';

<button buiSwitch [(checked)]="enabled" aria-labelledby="l"></button>
<span id="l">Airplane mode</span>`,
    switchSizes: `<button buiSwitch size="sm" [checked]="true" aria-label="Small"></button>
<button buiSwitch [checked]="true" aria-label="Default"></button>
<button buiSwitch size="lg" [checked]="true" aria-label="Large"></button>`,
    switchColors: `<!-- override the checked colour via data-state -->
<button buiSwitch [checked]="true" class="data-[state=checked]:bg-green-600"></button>`,
    switchWithText: `<div class="flex items-center justify-between rounded-lg border p-4">
  <div>
    <p id="m" class="font-medium">Marketing emails</p>
    <p class="text-muted-foreground text-sm">Receive product news.</p>
  </div>
  <button buiSwitch [checked]="true" aria-labelledby="m"></button>
</div>`,
    switchSettings: `<div class="flex items-center justify-between gap-4">
  <span id="s">Two-factor authentication</span>
  <button buiSwitch [checked]="true" aria-labelledby="s"></button>
</div>`,
    switchDisabled: `<button buiSwitch [disabled]="true" aria-label="Off"></button>
<button buiSwitch [checked]="true" [disabled]="true" aria-label="On"></button>`,
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
    accordionMultiple: `<!-- allow several panels open at once -->
<div ngAccordionGroup buiAccordion [multiExpandable]="true">…items…</div>`,
    accordionSeparated: `<!-- gap + a border per item -->
<div ngAccordionGroup buiAccordion class="flex flex-col gap-2">
  <div buiAccordionItem class="rounded-lg border px-4">…</div>
</div>`,
    accordionBordered: `<div ngAccordionGroup buiAccordion class="divide-y rounded-lg border [&>*]:px-4">
  …items…
</div>`,
    accordionLeadingIcon: `<button ngAccordionTrigger buiAccordionTrigger [panel]="p1">
  <span class="flex items-center gap-2"><span class="inline-flex"><svg><!-- icon --></svg></span> Billing</span>
  <svg><!-- chevron (the trigger rotates the first >svg) --></svg>
</button>`,
    accordionOutline: `<!-- gap + a full border per item -->
<div ngAccordionGroup buiAccordion class="flex flex-col gap-2">
  <div buiAccordionItem class="bg-card rounded-lg border px-4">…</div>
</div>`,
    accordionFilled: `<!-- filled header: style the trigger -->
<button ngAccordionTrigger buiAccordionTrigger class="bg-muted rounded-md px-3 hover:no-underline" [panel]="p1">
  General <svg><!-- chevron --></svg>
</button>`,
    accordionAvatar: `<button ngAccordionTrigger buiAccordionTrigger [panel]="p1">
  <span class="flex items-center gap-3"><span class="grid size-7 place-items-center rounded-full bg-primary text-xs">JD</span> Jane Doe</span>
  <svg><!-- chevron --></svg>
</button>`,
    accordionSubtitle: `<button ngAccordionTrigger buiAccordionTrigger [panel]="p1">
  <span class="flex flex-col items-start">
    <span>Notifications</span>
    <span class="text-muted-foreground text-xs font-normal">Email & push</span>
  </span>
  <svg><!-- chevron --></svg>
</button>`,
    accordionHighlight: `<!-- highlight the open item with a has-[] variant -->
<div buiAccordionItem class="rounded-lg px-4 has-[button[aria-expanded=true]]:bg-accent">…</div>`,
    accordionBorderedIcon: `<!-- bordered group + a leading icon per trigger -->
<div ngAccordionGroup buiAccordion class="divide-y rounded-lg border [&>*]:px-4">
  <button ngAccordionTrigger buiAccordionTrigger [panel]="p1">
    <span class="flex items-center gap-2"><svg><!-- icon --></svg> Help</span><svg><!-- chevron --></svg>
  </button>
</div>`,
    accordionDefaultOpen: `<!-- open one panel initially with [expanded] (Aria model) -->
<button ngAccordionTrigger buiAccordionTrigger [panel]="p1" [expanded]="true">Title <svg><!-- chevron --></svg></button>`,
    accordionChevronUpdown: `<!-- swap the chevron-down for an up/down chevrons icon -->
<button ngAccordionTrigger buiAccordionTrigger [panel]="p1">
  Title <svg><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
</button>`,
    accordionIconLeft: `<!-- chevron on the left: place it first + justify-start -->
<button ngAccordionTrigger buiAccordionTrigger class="justify-start gap-2" [panel]="p1">
  <svg><path d="m9 18 6-6-6-6" /></svg> Title
</button>`,
    accordionActiveCard: `<!-- the open item lifts into a card via has-[] -->
<div buiAccordionItem class="rounded-lg border-b-0 px-4 has-[button[aria-expanded=true]]:bg-card has-[button[aria-expanded=true]]:border has-[button[aria-expanded=true]]:shadow-sm">…</div>`,
    accordionActiveFill: `<!-- subtle fill on the open item -->
<div buiAccordionItem class="rounded-lg border-b-0 px-4 has-[button[aria-expanded=true]]:bg-primary/5">…</div>`,
    accordionPlusMinus: `<!-- wrap the icons in a span (not a direct >svg child, so the base 180° rotate is skipped) -->
<button ngAccordionTrigger buiAccordionTrigger class="[&[aria-expanded=true]_.acc-plus]:hidden [&[aria-expanded=true]_.acc-minus]:inline" [panel]="p1">
  Title
  <span class="inline-flex">
    <svg class="acc-plus"><path d="M5 12h14M12 5v14" /></svg>
    <svg class="acc-minus hidden"><path d="M5 12h14" /></svg>
  </span>
</button>`,
    accordionPlusRotate: `<!-- a plus that rotates 45° into an × on expand -->
<button ngAccordionTrigger buiAccordionTrigger class="[&[aria-expanded=true]_.acc-rot]:rotate-45" [panel]="p1">
  Title <span class="inline-flex"><svg class="acc-rot transition-transform"><path d="M5 12h14M12 5v14" /></svg></span>
</button>`,
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
    tabsWithIcons: `<div ngTab value="account" buiTabTrigger>
  <svg><!-- user --></svg> Account
</div>`,
    tabsDisabled: `<div ngTab value="team" buiTabTrigger [disabled]="true">Team</div>`,
    tabsLine: `<!-- underlined tabs: clear the list bg, border-b the triggers -->
<div ngTabList buiTabList class="rounded-none border-b bg-transparent p-0">
  <div ngTab buiTabTrigger class="rounded-none border-0 border-b-2 border-transparent aria-selected:border-b-primary aria-selected:bg-transparent aria-selected:shadow-none">Overview</div>
</div>`,
    tabsPills: `<div ngTab buiTabTrigger class="rounded-full border aria-selected:bg-primary aria-selected:text-primary-foreground">All</div>`,
    tabsSimple: `<div ngTab buiTabTrigger class="aria-selected:bg-transparent aria-selected:text-primary aria-selected:shadow-none">Tab one</div>`,
    tabsVertical: `<!-- flip the layout: flex-row tabs + a column tab list -->
<div ngTabs buiTabs class="flex-row gap-4">
  <div ngTabList buiTabList class="h-auto flex-col">…</div>
  <div ngTabPanel buiTabPanel class="flex-1">…</div>
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
    dialogForm: `<ng-template #tpl>
  <div buiDialogContent class="sm:max-w-md">
    <div buiDialogHeader><h2 buiDialogTitle>Edit profile</h2></div>
    <div class="grid gap-4 py-2"><!-- form fields --></div>
    <div buiDialogFooter><button buiButton>Save changes</button></div>
  </div>
</ng-template>`,
    dialogConfirm: `<!-- a confirm dialog: title + description + cancel/destructive -->
<div buiDialogContent>
  <div buiDialogHeader><h2 buiDialogTitle>Are you sure?</h2></div>
  <div buiDialogFooter>
    <button buiButton variant="outline">Cancel</button>
    <button buiButton variant="destructive">Delete</button>
  </div>
</div>`,
    dialogScroll: `<!-- long body: cap height + overflow-y-auto -->
<div class="max-h-[50vh] overflow-y-auto py-2">…long content…</div>`,
    dialogFullscreen: `<!-- pass width/height to open(); make the content fill -->
this.dialog.open(tpl, { ariaModal: true, width: '100vw', height: '100vh', maxWidth: '100vw' });
// <div buiDialogContent class="h-full !max-w-none !rounded-none flex flex-col">…</div>`,
    dialogPositioned: `<!-- anchor it with a global position strategy -->
import { Overlay } from '@angular/cdk/overlay';
overlay = inject(Overlay);
this.dialog.open(tpl, { ariaModal: true,
  positionStrategy: this.overlay.position().global().top('1.5rem').centerHorizontally() });`,
    dialogDispatch: `<!-- open from anywhere via the Dialog service -->
this.dialog.open(tpl, { ariaModal: true });`,
    radioGroup: `import { BuiRadioGroup, BuiRadioGroupItem } from 'ng-blatui';

<div buiRadioGroup [(value)]="plan">
  <div class="flex items-center gap-3">
    <button buiRadioItem value="free" aria-label="Default"></button><span>Default</span>
  </div>
  <div class="flex items-center gap-3">
    <button buiRadioItem value="pro" aria-label="Comfortable"></button><span>Comfortable</span>
  </div>
</div>`,
    radioHorizontal: `<div buiRadioGroup [(value)]="pay" class="flex items-center gap-5">
  <div class="flex items-center gap-2"><button buiRadioItem value="card" aria-label="Card"></button><span>Card</span></div>
  <div class="flex items-center gap-2"><button buiRadioItem value="paypal" aria-label="PayPal"></button><span>PayPal</span></div>
</div>`,
    radioDescription: `<div class="flex items-start gap-3">
  <button buiRadioItem value="all" aria-label="All new messages" class="mt-0.5"></button>
  <div><span class="font-medium">All new messages</span><p class="text-muted-foreground text-sm">Notify for every message.</p></div>
</div>`,
    radioColors: `<!-- override the dot/border via data-state -->
<button buiRadioItem value="success" class="text-success data-[state=checked]:border-success" aria-label="Success"></button>`,
    radioCards: `<div buiRadioGroup [(value)]="plan" class="grid gap-3 sm:grid-cols-3">
  <label class="has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-ring/40 flex flex-col gap-1 rounded-lg border p-4 has-[[data-state=checked]]:ring-[3px]">
    <div class="flex items-center justify-between"><span class="font-medium">Pro</span><button buiRadioItem value="pro" aria-label="Pro"></button></div>
    <span class="text-muted-foreground text-xs">$29 / month</span>
  </label>
</div>`,
    radioDisabled: `<button buiRadioItem value="free" [disabled]="true" aria-label="Default"></button>`,
    tooltip: `import { BuiTooltip } from 'ng-blatui';

<button buiButton variant="outline" buiTooltip="Add to library">Hover me</button>`,
    tooltipIcon: `<button buiButton variant="outline" size="icon" buiTooltip="Add to library" aria-label="Add to library">
  <svg><!-- plus --></svg>
</button>`,
    tooltipTriggers: `<button buiButton variant="outline" buiTooltip="Save your changes">Save</button>
<button buiButton variant="outline" buiTooltip="Share with your team">Share</button>`,
    tooltipSides: `<!-- side = top | right | bottom | left -->
<button buiButton buiTooltip="Right" side="right">Right</button>`,
    tooltipDelayed: `<!-- delay the show by N ms -->
<button buiButton buiTooltip="Appears after 600ms" [delay]="600">Hover and wait</button>`,
    tooltipColors: `<!-- recolour the bubble via tooltipClass -->
<button buiButton buiTooltip="Saved" tooltipClass="bg-emerald-600 text-white">Success</button>`,
    tooltipNoArrow: `<button buiButton buiTooltip="A clean, arrowless tooltip">Hover me</button>`,
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
    breadcrumbIcon: `<li buiBreadcrumbItem>
  <a buiBreadcrumbLink href="/" class="inline-flex items-center gap-1.5"><svg><!-- home --></svg> Home</a>
</li>`,
    breadcrumbCustomSep: `<!-- the separator projects its content -->
<li buiBreadcrumbSeparator><svg><!-- slash --></svg></li>`,
    breadcrumbDotSep: `<li buiBreadcrumbSeparator><span class="bg-muted-foreground block size-1 rounded-full"></span></li>`,
    breadcrumbContained: `<ol buiBreadcrumbList class="bg-background min-h-9 w-fit rounded-md border px-3 py-1">…</ol>`,
    breadcrumbBadge: `<li buiBreadcrumbItem class="flex items-center gap-2">
  <span buiBreadcrumbPage>Settings</span><span buiBadge variant="secondary">Beta</span>
</li>`,
    kbd: `import { BuiKbd, BuiKbdGroup } from 'ng-blatui';

<kbd buiKbdGroup><kbd buiKbd>⌘</kbd><kbd buiKbd>K</kbd></kbd>`,
    kbdIcons: `<kbd buiKbd aria-label="Command"><svg><!-- command --></svg></kbd>
<kbd buiKbd aria-label="Enter"><svg><!-- enter --></svg></kbd>`,
    kbdInButton: `<button buiButton variant="outline" size="sm">Accept <kbd buiKbd>⏎</kbd></button>`,
    kbdShortcuts: `<div class="flex items-center justify-between">
  <span>Open command menu</span>
  <kbd buiKbdGroup><kbd buiKbd>⌘</kbd><kbd buiKbd>K</kbd></kbd>
</div>`,
    aspectRatio: `import { BuiAspectRatio } from 'ng-blatui';

<bui-aspect-ratio ratio="16 / 9" class="bg-muted rounded-lg">
  <div class="flex h-full w-full items-center justify-center">16 / 9</div>
</bui-aspect-ratio>`,
    aspectRatioImage: `<bui-aspect-ratio ratio="16 / 9">
  <img src="/cover.jpg" alt="" class="size-full rounded-lg object-cover" />
</bui-aspect-ratio>`,
    aspectRatioRatios: `@for (r of ['1 / 1', '4 / 3', '16 / 9', '3 / 4']; track r) {
  <bui-aspect-ratio [ratio]="r" class="bg-muted rounded-lg">{{ r }}</bui-aspect-ratio>
}`,
    buttonGroup: `import { BuiButtonGroup, BuiButtonGroupText, BuiButton } from 'ng-blatui';

<div buiButtonGroup>
  <button buiButton variant="outline">Previous</button>
  <button buiButton variant="outline">Next</button>
</div>`,
    buttonGroupIcon: `<div buiButtonGroup>
  <button buiButton variant="outline" size="icon" aria-label="Align left">…</button>
  <button buiButton variant="outline" size="icon" aria-label="Align center">…</button>
</div>`,
    buttonGroupVertical: `<div buiButtonGroup orientation="vertical">
  <button buiButton variant="outline">Archive</button>
  <button buiButton variant="outline">Delete</button>
</div>`,
    buttonGroupSplit: `<div buiButtonGroup>
  <button buiButton variant="outline"><svg><!-- save --></svg> Save</button>
  <button buiButton variant="outline" size="icon" aria-label="More">…</button>
</div>`,
    buttonGroupSolid: `<div buiButtonGroup class="*:not-last:border-primary-foreground/25 *:not-last:border-r">
  <button buiButton>Day</button><button buiButton>Week</button><button buiButton>Month</button>
</div>`,
    buttonGroupText: `<div buiButtonGroup>
  <span buiButtonGroupText>https://</span>
  <input buiInput placeholder="example.com" class="rounded-l-none" />
</div>`,
    buttonGroupNested: `<div buiButtonGroup>
  <div buiButtonGroup>…undo / redo…</div>
  <div buiButtonGroup>…bold / italic…</div>
</div>`,
    collapsible: `import { BuiCollapsible, BuiCollapsibleTrigger, BuiCollapsibleContent } from 'ng-blatui';

<div buiCollapsible>
  <button buiCollapsibleTrigger buiButton variant="outline">Toggle</button>
  <div buiCollapsibleContent class="pt-2">Hidden content</div>
</div>`,
    collapsibleOpen: `<div buiCollapsible [open]="true">…starts expanded…</div>`,
    collapsibleCard: `<div buiCollapsible class="rounded-lg border">
  <button buiCollapsibleTrigger class="flex w-full justify-between px-4 py-3">Title <svg><!-- chevron --></svg></button>
  <div buiCollapsibleContent class="border-t px-4 py-3">…</div>
</div>`,
    collapsibleAvatarList: `<div buiCollapsible class="space-y-2">
  <button buiCollapsibleTrigger buiButton variant="outline" class="w-full justify-between">Team members (4) <svg><!-- chevron --></svg></button>
  <div buiCollapsibleContent class="space-y-2">… avatar rows …</div>
</div>`,
    collapsibleFileTree: `<!-- nest a buiCollapsible inside the content for sub-folders -->
<div buiCollapsible [open]="true">
  <button buiCollapsibleTrigger buiButton variant="ghost" class="w-full justify-start gap-2"><svg><!-- folder --></svg> src</button>
  <div buiCollapsibleContent class="ml-3 border-l pl-3">
    <p>main.ts</p>
    <div buiCollapsible>…nested folder…</div>
  </div>
</div>`,
    empty: `import {
  BuiEmpty, BuiEmptyHeader, BuiEmptyMedia, BuiEmptyTitle, BuiEmptyDescription,
} from 'ng-blatui';

<div buiEmpty>
  <div buiEmptyHeader>
    <div buiEmptyMedia variant="icon"><svg><!-- icon --></svg></div>
    <div buiEmptyTitle>No projects yet</div>
    <div buiEmptyDescription>Get started by creating your first project.</div>
  </div>
  <div buiEmptyContent><button buiButton>Create project</button></div>
</div>`,
    emptySearch: `<div buiEmptyContent>
  <div class="flex items-center gap-2">
    <input buiInput placeholder="Search again…" />
    <button buiButton variant="outline">Search</button>
  </div>
</div>`,
    emptyLink: `<div buiEmptyContent>
  <button buiButton>Connect storage</button>
  <a href="#" class="text-sm hover:underline">Learn more</a>
</div>`,
    field: `import { BuiField, BuiFieldLabel, BuiFieldDescription } from 'ng-blatui';

<div buiField>
  <label buiFieldLabel for="username">Username</label>
  <input id="username" buiInput type="text" placeholder="shadcn" />
  <p buiFieldDescription>This is your public display name.</p>
</div>`,
    fieldHorizontal: `<div buiField orientation="horizontal">
  <div buiFieldContent>
    <label buiFieldLabel>Email notifications</label>
    <p buiFieldDescription>Receive emails about your account activity.</p>
  </div>
  <button buiSwitch aria-label="Email notifications"></button>
</div>`,
    fieldCheckbox: `<div buiField orientation="horizontal">
  <button buiCheckbox aria-label="Accept terms"></button>
  <div buiFieldContent>
    <label buiFieldLabel>Accept terms and conditions</label>
    <p buiFieldDescription>You agree to our Terms of Service.</p>
  </div>
</div>`,
    fieldForm: `<div buiFieldGroup>
  <div buiField>
    <label buiFieldLabel for="name">Name</label>
    <input id="name" buiInput />
  </div>
  <button buiButton type="submit">Submit</button>
</div>`,
    fieldError: `<div buiField>
  <label buiFieldLabel for="email">Email</label>
  <input id="email" buiInput value="not-an-email" aria-invalid="true" />
  <p buiFieldError>Please enter a valid email address.</p>
</div>`,
    fieldSet: `<fieldset buiFieldSet>
  <legend buiFieldLegend>Profile</legend>
  <div buiFieldGroup>… fields …</div>
</fieldset>`,
    container: `import { BuiContainer } from 'ng-blatui';

<div buiContainer size="md"><!-- page content --></div>`,
    containerSizes: `<div buiContainer size="sm">sm</div>
<div buiContainer size="md">md</div>
<div buiContainer size="lg">lg</div>`,
    containerProse: `<div buiContainer size="sm" class="prose dark:prose-invert">
  <h3>Readable measure</h3>
  <p>Caps line length for comfortable reading.</p>
</div>`,
    toggle: `import { BuiToggle } from 'ng-blatui';

<button buiToggle aria-label="Toggle bold"><svg><!-- bold --></svg></button>`,
    toggleOutline: `<button buiToggle variant="outline" aria-label="Toggle italic"><svg><!-- italic --></svg></button>`,
    toggleSizes: `<button buiToggle size="sm" aria-label="Small">S</button>
<button buiToggle aria-label="Default">M</button>
<button buiToggle size="lg" aria-label="Large">L</button>`,
    toggleRounded: `<button buiToggle class="rounded-full" aria-label="Like"><svg><!-- heart --></svg></button>`,
    toggleWithText: `<button buiToggle aria-label="Toggle italic"><svg><!-- italic --></svg> Italic</button>`,
    toggleWithCount: `<button buiToggle variant="outline" aria-label="Upvote">
  <svg><!-- arrow-up --></svg> Upvote <span class="tabular-nums">27</span>
</button>`,
    toggleDisabled: `<button buiToggle [disabled]="true" aria-label="Bold">B</button>
<button buiToggle variant="outline" [disabled]="true" aria-label="Italic">I</button>`,
    spinner: `import { BuiSpinner } from 'ng-blatui';

<bui-spinner />`,
    spinnerSizes: `<bui-spinner class="size-4" />
<bui-spinner class="size-6" />
<bui-spinner class="size-8" />`,
    spinnerColors: `<bui-spinner class="text-primary" />
<bui-spinner class="text-destructive" />`,
    spinnerLabel: `<div class="text-muted-foreground flex items-center gap-2 text-sm">
  <bui-spinner class="size-4" /> <span>Loading…</span>
</div>`,
    spinnerButton: `<button buiButton disabled>
  <bui-spinner class="size-4" /> Please wait
</button>`,
    copyButton: `import { BuiCopyButton } from 'ng-blatui';

<code class="bg-muted rounded px-2 py-1 font-mono text-sm">npm i ng-blatui</code>
<button buiCopyButton value="npm i ng-blatui" label="Copy command"></button>`,
    copyButtonLabel: `<button buiCopyButton value="https://…" class="border" label="Copy link">Copy link</button>`,
    banner: `import { BuiBanner } from 'ng-blatui';

<bui-banner tone="primary" class="rounded-lg">🎉 ng-blatui — accessible Angular components.</bui-banner>`,
    bannerTones: `<!-- tone="primary | info | success | warning | danger | default" -->
<bui-banner tone="success">Your plan was upgraded to Pro.</bui-banner>
<bui-banner tone="warning">Your trial ends in 3 days.</bui-banner>`,
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
    tableStriped: `<table buiTable class="[&_tbody_tr:nth-child(odd)]:bg-muted/50">
  …rows…
</table>`,
    tableSelection: `<tr buiTableRow data-state="selected" class="data-[state=selected]:bg-muted">
  <td buiTableCell><button buiCheckbox [checked]="true" aria-label="Select"></button></td>
  <td buiTableCell>Sofia Carter</td>
</tr>`,
    tableActions: `<td buiTableCell>
  <button buiButton variant="ghost" size="icon" aria-label="Row actions"><svg><!-- ⋯ --></svg></button>
</td>`,
    tablePlain: `<!-- omit variant="card" for a borderless table -->
<div buiTableContainer class="w-full">
  <table buiTable>… name / role / status …</table>
</div>`,
    tableComparison: `<!-- tiers × features with checks and dashes -->
<table buiTable>
  <tr buiTableRow><td buiTableCell>Audit logs</td>
    <td buiTableCell class="text-center text-muted-foreground">—</td>
    <td buiTableCell class="text-center"><svg><path d="M20 6 9 17l-5-5" /></svg></td>
  </tr>
</table>`,
    avatarGroup: `import { BuiAvatarGroup } from 'ng-blatui';

<bui-avatar-group [avatars]="team" [max]="3" />
// team = [{ name: 'Ada Lovelace' }, { name: 'Alan Turing' }, ...]`,
    avatarGroupImages: `<bui-avatar-group [avatars]="team" [max]="3" />
// team = [{ name: 'Ada', src: '/a.png' }, ...]`,
    avatarGroupSizes: `<bui-avatar-group [avatars]="team" [max]="4" size="sm" />
<bui-avatar-group [avatars]="team" [max]="4" size="lg" />`,
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
    paginationSimple: `<nav buiPagination>
  <ul buiPaginationContent>
    <li buiPaginationItem><a buiPaginationLink href="#">Previous</a></li>
    <li buiPaginationItem><a buiPaginationLink href="#">Next</a></li>
  </ul>
</nav>`,
    paginationRounded: `<a buiPaginationLink href="#" class="rounded-full">1</a>`,
    paginationContained: `<nav buiPagination class="rounded-lg border bg-card p-1">…</nav>`,
    paginationFirstLast: `<!-- first « / prev ‹ / pages / next › / last » -->
<a buiPaginationLink href="#" aria-label="First"><svg><path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" /></svg></a>`,
    paginationPageInfo: `<div class="flex items-center justify-between">
  <p class="text-sm">Page 1 of 10</p>
  <nav buiPagination class="mx-0 w-auto">…</nav>
</div>`,
    popover: `import { BuiPopover, BuiPopoverContent } from 'ng-blatui';

<button buiButton variant="outline" [buiPopover]="tpl">Open</button>
<ng-template #tpl>
  <div buiPopoverContent>
    <p class="text-sm">Popover content goes here.</p>
  </div>
</ng-template>`,
    popoverSettings: `<ng-template #tpl>
  <div buiPopoverContent class="w-80">
    <h4 class="font-medium">Dimensions</h4>
    <div class="grid grid-cols-3 items-center gap-4">
      <label buiLabel for="w">Width</label>
      <input id="w" buiInput value="100%" class="col-span-2 h-8" />
    </div>
  </div>
</ng-template>`,
    popoverShare: `<ng-template #tpl>
  <div buiPopoverContent class="w-80">
    <h4 class="font-medium">Share link</h4>
    <div class="flex gap-2">
      <input buiInput value="https://…" class="h-8" readonly />
      <button buiButton size="sm">Copy</button>
    </div>
  </div>
</ng-template>`,
    popoverPositions: `<!-- side = top | right | bottom | left (defaults to bottom) -->
<button buiButton [buiPopover]="tpl" side="right">Right</button>`,
    popoverFeedback: `<button buiButton [buiPopover]="tpl">Send feedback</button>
<ng-template #tpl>
  <div buiPopoverContent class="w-80">
    <h4 class="font-medium">Send feedback</h4>
    <textarea class="min-h-20 w-full rounded-md border p-2 text-sm"></textarea>
    <button buiButton size="sm" class="w-full">Submit</button>
  </div>
</ng-template>`,
    item: `import {
  BuiItem, BuiItemMedia, BuiItemContent, BuiItemTitle, BuiItemDescription, BuiItemActions, BuiItemGroup,
} from 'ng-blatui';

<div buiItem variant="outline">
  <div buiItemMedia variant="icon"><svg><!-- bell --></svg></div>
  <div buiItemContent>
    <div buiItemTitle>Notifications</div>
    <p buiItemDescription>You have 3 unread messages.</p>
  </div>
  <div buiItemActions><button buiButton variant="outline" size="sm">View</button></div>
</div>`,
    itemVariants: `<div buiItem variant="default">…</div>
<div buiItem variant="outline">…</div>
<div buiItem variant="muted">…</div>`,
    itemGroup: `<div buiItemGroup class="divide-y rounded-lg border">
  <div buiItem>… member row …</div>
  <div buiItem>… member row …</div>
</div>`,
    itemSwitch: `<div buiItem variant="outline">
  <div buiItemContent><div buiItemTitle>Push notifications</div></div>
  <div buiItemActions><button buiSwitch [checked]="true" aria-label="Push"></button></div>
</div>`,
    itemLink: `<div buiItemGroup class="divide-y rounded-lg border">
  <a buiItem href="/account" class="hover:bg-accent">
    <div buiItemContent><div buiItemTitle>Account</div></div>
    <div buiItemActions><svg><!-- chevron --></svg></div>
  </a>
</div>`,
    scrollArea: `import { BuiScrollArea } from 'ng-blatui';

<bui-scroll-area class="h-40 rounded-md border p-4">
  <!-- long content -->
</bui-scroll-area>`,
    scrollAreaHorizontal: `<bui-scroll-area class="w-80 rounded-md border whitespace-nowrap">
  <div class="flex gap-3 p-4">… tiles …</div>
</bui-scroll-area>`,
    inputGroup: `import {
  BuiInputGroup, BuiInputGroupAddon, BuiInputGroupInput, BuiInputGroupButton,
} from 'ng-blatui';

<div buiInputGroup>
  <input buiInputGroupInput placeholder="Search…" />
  <div buiInputGroupAddon><svg><!-- search --></svg></div>
</div>`,
    inputGroupIconEnd: `<div buiInputGroup>
  <input buiInputGroupInput placeholder="you@example.com" />
  <div buiInputGroupAddon align="inline-end"><svg><!-- mail --></svg></div>
</div>`,
    inputGroupText: `<div buiInputGroup>
  <div buiInputGroupAddon><span buiInputGroupText>https://</span></div>
  <input buiInputGroupInput placeholder="example.com" />
</div>`,
    inputGroupButton: `<div buiInputGroup>
  <input buiInputGroupInput placeholder="Enter your email" />
  <div buiInputGroupAddon align="inline-end"><button buiInputGroupButton size="xs">Subscribe</button></div>
</div>`,
    inputGroupTextarea: `<div buiInputGroup>
  <textarea buiInputGroupInput class="min-h-20 resize-none border-0 shadow-none"></textarea>
  <div buiInputGroupAddon align="block-end"><button buiInputGroupButton size="xs">Send</button></div>
</div>`,
    inputGroupPassword: `<div buiInputGroup>
  <input buiInputGroupInput type="password" placeholder="Password" />
  <div buiInputGroupAddon align="inline-end">
    <button buiInputGroupButton aria-label="Show password"><svg><!-- eye --></svg></button>
  </div>
</div>`,
    inputGroupSpinner: `<div buiInputGroup>
  <input buiInputGroupInput placeholder="Checking…" />
  <div buiInputGroupAddon align="inline-end"><svg class="animate-spin"><!-- spinner --></svg></div>
</div>`,
    meter: `import { BuiMeter } from 'ng-blatui';

<bui-meter [value]="72" label="Storage" />`,
    meterNoLabel: `<bui-meter [value]="58" [showValue]="false" ariaLabel="Battery level" />`,
    meterTones: `<!-- tone="good | warning | danger" -->
<bui-meter [value]="32" label="Disk usage" tone="good" />
<bui-meter [value]="78" label="Memory" tone="warning" />
<bui-meter [value]="94" label="Quota" tone="danger" />`,
    meterThresholdsEx: `<!-- auto-colour by value: highest threshold whose 'at' <= value wins -->
<bui-meter [value]="91" label="Disk" [thresholds]="thresholds" />
// thresholds = [{ at: 0, tone: 'good' }, { at: 60, tone: 'warning' }, { at: 85, tone: 'danger' }]`,
    stat: `import { BuiStat } from 'ng-blatui';

<bui-stat label="Total Revenue" value="$45,231.89" />`,
    statTrend: `<bui-stat label="New Customers" value="1,204" change="+12.5%" trend="up" caption="vs last month" />
<bui-stat label="Churn rate" value="2.4%" change="-0.5%" trend="down" />`,
    statSparkline: `<!-- [sparkline] draws an inline trend line -->
<bui-stat label="Active users" value="2,318" change="+12.4%" trend="up" [sparkline]="series" />
// series = [8, 11, 9, 14, 12, 18, 16, 22]`,
    statGrid: `<div class="grid gap-4 sm:grid-cols-4">
  <bui-stat label="Revenue" value="$45.2k" change="+12.5%" trend="up" />
  <bui-stat label="Users" value="2,340" change="+4.1%" trend="up" />
</div>`,
    visuallyHidden: `import { BuiVisuallyHidden } from 'ng-blatui';

<span buiVisuallyHidden>Screen-reader only text</span>`,
    visuallyHiddenSkip: `<!-- visible only on keyboard focus -->
<a href="#main" buiVisuallyHidden class="focus:not-sr-only focus:rounded-md focus:border focus:px-3 focus:py-1.5">
  Skip to content
</a>`,
    hoverCard: `import { BuiHoverCard, BuiHoverCardContent } from 'ng-blatui';

<span [buiHoverCard]="tpl">@username</span>
<ng-template #tpl>
  <div buiHoverCardContent>Profile preview content…</div>
</ng-template>`,
    hoverCardUser: `<a buiButton variant="link" [buiHoverCard]="tpl">@sofia</a>
<ng-template #tpl>
  <div buiHoverCardContent class="w-72">
    <div class="flex gap-3"><bui-avatar>SC</bui-avatar> Sofia Carter — Product designer.</div>
  </div>
</ng-template>`,
    hoverCardInstant: `<!-- [openDelay]="0" opens immediately -->
<span [buiHoverCard]="tpl" [openDelay]="0">hover me</span>`,
    codeBlock: `import { BuiCodeBlock } from 'ng-blatui';

<bui-code-block [code]="'npm install ng-blatui'" />`,
    codeBlockFilename: `<bui-code-block filename="hello.ts" [code]="'const x = 1;'" />`,
    codeBlockTabs: `<!-- compose tabs with a code block per panel -->
<div ngTabs buiTabs>
  <div ngTabList buiTabList selectedTab="npm">
    <div ngTab value="npm" buiTabTrigger>npm</div>
    <div ngTab value="pnpm" buiTabTrigger>pnpm</div>
  </div>
  <div ngTabPanel value="npm" buiTabPanel>
    <ng-template ngTabContent><bui-code-block [code]="'npm install ng-blatui'" /></ng-template>
  </div>
</div>`,
    slider: `import { BuiSlider } from 'ng-blatui';

<bui-slider [(value)]="volume" [min]="0" [max]="100" ariaLabel="Volume" />`,
    sliderWithLabel: `<div class="flex items-center justify-between">
  <span class="font-medium">Volume</span>
  <span class="text-muted-foreground tabular-nums">{{ volume() }}%</span>
</div>
<bui-slider [(value)]="volume" [max]="100" ariaLabel="Volume" />`,
    sliderSteps: `<bui-slider [value]="40" [min]="0" [max]="100" [step]="10" ariaLabel="Stepped" />`,
    sliderDisabled: `<bui-slider [value]="60" [disabled]="true" ariaLabel="Disabled" />`,
    sliderVertical: `<bui-slider class="h-40" orientation="vertical" [value]="40" ariaLabel="Volume" />`,
    rating: `import { BuiRating } from 'ng-blatui';

<bui-rating [(value)]="score" [max]="5" ariaLabel="Rate" />`,
    ratingReadonly: `<bui-rating [value]="4" [readonly]="true" ariaLabel="4 of 5" />`,
    ratingSizes: `<bui-rating [value]="3" size="sm" ariaLabel="Small" />
<bui-rating [value]="3" ariaLabel="Default" />
<bui-rating [value]="3" size="lg" ariaLabel="Large" />`,
    ratingColors: `<bui-rating [value]="4" color="text-rose-500" ariaLabel="Rose" />
<bui-rating [value]="4" color="text-amber-500" ariaLabel="Amber" />`,
    quantitySelector: `import { BuiQuantitySelector } from 'ng-blatui';

<bui-quantity-selector [(value)]="qty" />`,
    quantityMax: `<bui-quantity-selector [value]="2" [min]="1" [max]="10" ariaLabel="Quantity" />`,
    quantitySizes: `<bui-quantity-selector [value]="1" size="sm" ariaLabel="Small" />
<bui-quantity-selector [value]="1" size="lg" ariaLabel="Large" />`,
    quantityDisabled: `<bui-quantity-selector [value]="3" [disabled]="true" ariaLabel="Disabled" />`,
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
    alertDialogConfirm: `<ng-template #tpl>
  <div buiAlertDialogContent>
    <div buiAlertDialogHeader>
      <h2 buiAlertDialogTitle>Leave this page?</h2>
      <p buiAlertDialogDescription>You have unsaved changes.</p>
    </div>
    <div buiAlertDialogFooter>
      <button buiAlertDialogCancel>Stay</button>
      <button buiAlertDialogAction>Leave</button>
    </div>
  </div>
</ng-template>`,
    autosizeTextarea: `import { BuiAutosizeTextarea } from 'ng-blatui';

<textarea buiAutosizeTextarea placeholder="Write a message…"></textarea>`,
    autosizeTextareaMax: `<textarea buiAutosizeTextarea [maxRows]="4" placeholder="Grows to 4 rows…"></textarea>`,
    autosizeTextareaSmall: `<textarea buiAutosizeTextarea size="sm" placeholder="Compact…"></textarea>`,
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
    dropdownIcons: `<div ngMenuItem value="profile" buiDropdownMenuItem>
  <svg><!-- user --></svg> Profile
</div>
<div buiDropdownMenuSeparator></div>
<div ngMenuItem value="logout" buiDropdownMenuItem><svg><!-- logout --></svg> Log out</div>`,
    dropdownAccount: `<div buiDropdownMenuLabel>
  <div class="flex flex-col"><span class="font-medium">Sofia Carter</span><span class="text-muted-foreground text-xs">sofia@example.com</span></div>
</div>
<div buiDropdownMenuSeparator></div>
<div ngMenuItem value="profile" buiDropdownMenuItem>Profile</div>`,
    dropdownCheckboxes: `<!-- compose a checkbox item: a signal + a conditional check indicator -->
<div ngMenuItem buiDropdownMenuItem (click)="statusBar.set(!statusBar())">
  <span class="inline-flex w-4 justify-center">
    @if (statusBar()) { <svg><path d="M20 6 9 17l-5-5" /></svg> }
  </span>
  Status bar
</div>`,
    dropdownRadio: `<!-- radio: one signal holds the selected value -->
<div ngMenuItem [value]="pos" buiDropdownMenuItem (click)="panel.set(pos)">
  <span class="inline-flex w-4 justify-center">
    @if (panel() === pos) { <svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" /></svg> }
  </span>
  {{ pos }}
</div>`,
    typography: `import { BuiTypography } from 'ng-blatui';

<h1 buiTypography variant="h1">The quick brown fox</h1>
<p buiTypography variant="lead">A modern Angular UI library.</p>`,
    typographyHeadings: `<h1 buiTypography variant="h1">Heading 1</h1>
<h2 buiTypography variant="h2">Heading 2</h2>
<h3 buiTypography variant="h3">Heading 3</h3>`,
    typographyText: `<p buiTypography variant="lead">Lead paragraph.</p>
<p buiTypography variant="large">Large</p>
<p buiTypography variant="small">Small</p>
<p buiTypography variant="muted">Muted</p>`,
    typographyBlockquote: `<blockquote buiTypography variant="blockquote">"…quote…"</blockquote>`,
    typographyList: `<ul buiTypography variant="list"><li>Item one</li><li>Item two</li></ul>`,
    typographyGradient: `<h1 buiTypography variant="gradient">Dawn light in a single line</h1>`,
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
    menubarSimple: `<div ngMenuBar buiMenubar>
  <button ngMenuTrigger [menu]="view" buiMenubarTrigger>View</button>
  <div ngMenu #view="ngMenu" buiDropdownMenu>
    <div ngMenuItem value="zoom-in" buiDropdownMenuItem>Zoom in</div>
  </div>
</div>`,
    segmentedControl: `import { BuiSegmentedControl } from 'ng-blatui';

<bui-segmented-control [(value)]="view" [options]="['list', 'grid', 'board']" />`,
    segmentedDisabled: `<bui-segmented-control [value]="'grid'" [options]="['list', 'grid', 'board']" [disabled]="true" />`,
    segmentedSizes: `<!-- size via an arbitrary child selector -->
<bui-segmented-control class="text-xs [&_button]:px-2 [&_button]:py-1" [options]="['list','grid']" />`,
    dotPattern: `import { BuiDotPattern } from 'ng-blatui';

<div class="relative overflow-hidden rounded-xl border">
  <bui-dot-pattern />
</div>`,
    dotPatternDense: `<bui-dot-pattern [gap]="10" />`,
    dotPatternMasked: `<bui-dot-pattern [mask]="true" />`,
    gridPattern: `import { BuiGridPattern } from 'ng-blatui';

<div class="relative overflow-hidden rounded-xl border">
  <bui-grid-pattern />
</div>`,
    gridPatternLarge: `<bui-grid-pattern [gap]="48" />`,
    gridPatternMasked: `<bui-grid-pattern [mask]="true" />`,
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
    flipCardClick: `<bui-flip-card trigger="click">
  <div>Tap to reveal</div>
  <div buiFlipBack>Tap again to flip back</div>
</bui-flip-card>`,
    spotlightCard: `import { BuiSpotlightCard } from 'ng-blatui';

<bui-spotlight-card>Hover for a spotlight glow.</bui-spotlight-card>`,
    spotlightCardColored: `<bui-spotlight-card color="#22c55e">…</bui-spotlight-card>`,
    tiltCard: `import { BuiTiltCard } from 'ng-blatui';

<bui-tilt-card><div class="p-6">Tilt me</div></bui-tilt-card>`,
    tiltCardStrong: `<bui-tilt-card [max]="20" [scaleTo]="1.05"><div class="p-6">Dramatic</div></bui-tilt-card>`,
    select: `import { BuiSelect } from 'ng-blatui';

<bui-select [(value)]="fruit" [options]="fruits" placeholder="Pick a fruit" />
// fruits = [{ value: 'apple', label: 'Apple' }, ...]`,
    selectDisabled: `<bui-select [options]="fruits" [disabled]="true" placeholder="Disabled" />`,
    selectScrollable: `<!-- long lists scroll inside the popover -->
<bui-select [(value)]="timezone" [options]="timezones" placeholder="Select a timezone" />`,
    selectSizes: `<!-- size the trigger via an arbitrary child selector -->
<bui-select class="[&>button]:h-8 [&>button]:text-xs" [options]="opts" placeholder="Small" />
<bui-select class="[&>button]:h-11" [options]="opts" placeholder="Large" />`,
    selectOptionsArray: `<bui-select [(value)]="tz" [options]="timezones" placeholder="Timezone" />
// timezones = [{ value: 'utc', label: 'UTC' }, …]`,
    selectBranded: `<bui-select class="[&>button]:border-primary [&>button]:text-primary" [options]="opts" />`,
    selectNative: `<select aria-label="Fruit" class="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
  <option>Apple</option><option>Banana</option>
</select>`,
    selectWithIcons: `<!-- SelectOption now takes an optional icon (SVG path d) -->
<bui-select [options]="opts" placeholder="Account" />
// opts = [{ value: 'profile', label: 'Profile', icon: 'M19 21v-2a4 4…' }, …]`,
    selectGrouped: `<!-- consecutive options sharing a group get a header -->
<bui-select [options]="opts" />
// opts = [{ value: 'apple', label: 'Apple', group: 'Fruits' }, { value: 'carrot', label: 'Carrot', group: 'Vegetables' }]`,
    selectUtility: `<!-- a native select styled entirely with utility classes -->
<select aria-label="Plan" class="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">…</select>`,
    combobox: `import { BuiCombobox } from 'ng-blatui';

<bui-combobox [(value)]="framework" [options]="frameworks" />
// frameworks = [{ value: 'ng', label: 'Angular' }, ...]`,
    comboboxPreselected: `<bui-combobox [value]="'ng'" [options]="frameworks" />`,
    comboboxDisabled: `<bui-combobox [options]="frameworks" [disabled]="true" placeholder="Disabled" />`,
    comboboxStatuses: `<!-- ComboboxOption now takes an optional icon (SVG path d) -->
<bui-combobox [options]="statuses" placeholder="Set status…" />
// statuses = [{ value: 'todo', label: 'Todo', icon: 'M12 22a10…' }, …]`,
    comboboxNonSearchable: `<!-- [searchable]="false" makes it open the full list like a select -->
<bui-combobox [options]="opts" [searchable]="false" placeholder="Pick one" />`,
    backToTop: `import { BuiBackToTop } from 'ng-blatui';

<bui-back-to-top [threshold]="300" />`,
    backToTopSubtle: `<!-- variant="subtle" for a muted, bordered button -->
<bui-back-to-top [threshold]="300" variant="subtle" />`,
    countdown: `import { BuiCountdown } from 'ng-blatui';

<bui-countdown to="2026-12-31 23:59" />`,
    countdownExpired: `<bui-countdown to="2020-01-01 00:00" expired="This sale has ended." />`,
    numberTicker: `import { BuiNumberTicker } from 'ng-blatui';

<bui-number-ticker [value]="1284" />`,
    numberTickerPrefix: `<bui-number-ticker [value]="1284930" prefix="$" />`,
    numberTickerDecimals: `<bui-number-ticker [value]="99.9" [decimals]="1" suffix="%" />`,
    numberTickerGrid: `<bui-number-ticker [value]="48291" />
<bui-number-ticker [value]="92450" prefix="$" />`,
    link: `import { BuiLink } from 'ng-blatui';

<a buiLink href="/docs">Documentation</a>
<a buiLink variant="muted" [external]="true" href="https://angular.dev">Angular</a>`,
    linkVariants: `<a buiLink href="#">Default</a>
<a buiLink href="#" variant="muted">Muted</a>
<a buiLink href="#" variant="subtle">Subtle</a>
<a buiLink href="#" [external]="true">External</a>`,
    gradientText: `import { BuiGradientText } from 'ng-blatui';

<bui-gradient-text>Build delightful interfaces</bui-gradient-text>`,
    gradientTextPresets: `<bui-gradient-text preset="sunset">Sunset</bui-gradient-text>
<bui-gradient-text preset="ocean">Ocean</bui-gradient-text>`,
    gradientTextAnimated: `<bui-gradient-text [animate]="true" from="#06b6d4" via="#8b5cf6" to="#ec4899">Shimmering text</bui-gradient-text>`,
    gradientTextInline: `Ship with <bui-gradient-text preset="aurora">ng-blatui</bui-gradient-text> today.`,
    pageHeader: `import { BuiPageHeader } from 'ng-blatui';

<bui-page-header heading="Dashboard" description="An overview of your account." />`,
    pageHeaderActions: `<bui-page-header heading="Projects" description="Manage your team's work.">
  <div buiPageHeaderActions class="flex gap-2">
    <button buiButton variant="outline">Export</button>
    <button buiButton>New project</button>
  </div>
</bui-page-header>`,
    pageHeaderSeparator: `<bui-page-header heading="Billing" description="…" [separator]="true" />`,
    quote: `import { BuiQuote } from 'ng-blatui';

<bui-quote author="Ada Lovelace" role="Mathematician">
  That brain of mine is something more than merely mortal.
</bui-quote>`,
    quotePlain: `<bui-quote class="text-center">
  Design is how it works.
</bui-quote>`,
    price: `import { BuiPrice } from 'ng-blatui';

<bui-price [amount]="29" />`,
    priceSale: `<bui-price [amount]="29" [compareAt]="39" />`,
    priceSizes: `<bui-price [amount]="29" [compareAt]="39" size="sm" />
<bui-price [amount]="29" [compareAt]="39" size="lg" />`,
    stack: `import { BuiStack } from 'ng-blatui';

<div buiStack gap="3">…</div>`,
    stackHorizontal: `<div buiStack direction="row" gap="3">…</div>`,
    stackAligned: `<div buiStack direction="row" justify="between" align="center">…</div>`,
    accent: `import { BuiAccent, BuiButton } from 'ng-blatui';

<div buiAccent color="#e11d48">
  <button buiButton>Themed button</button>
</div>`,
    kbdGroup: `import { BuiKbdGroup, BuiKbd } from 'ng-blatui';

<kbd buiKbdGroup><kbd buiKbd>⌘</kbd><kbd buiKbd>K</kbd></kbd>`,
    presence: `import { BuiPresence } from 'ng-blatui';

<bui-presence status="online" [showLabel]="true" />
<bui-presence status="away" [showLabel]="true" />
<bui-presence status="busy" [showLabel]="true" />`,
    presencePulse: `<bui-presence status="online" [pulse]="true" [showLabel]="true" />`,
    presenceAvatar: `<div class="relative inline-flex">
  <bui-avatar class="size-12" src="/u.png" alt="">CN</bui-avatar>
  <span class="absolute end-0 bottom-0"><bui-presence status="online" [pulse]="true" /></span>
</div>`,
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
    descriptionListBordered: `<dl buiDescriptionList [bordered]="true">
  <bui-description-item term="Invoice">#INV-2048</bui-description-item>
</dl>`,
    descriptionListVertical: `<dl buiDescriptionList layout="vertical">
  <bui-description-item term="Shipping address">128 Maple Street…</bui-description-item>
</dl>`,
    masonry: `import { BuiMasonry } from 'ng-blatui';

<div buiMasonry [columns]="3">…tiles…</div>`,
    masonryTwo: `<div buiMasonry [columns]="2" gap="6">…tiles…</div>`,
    bentoGrid: `import { BuiBentoGrid, BuiBentoItem } from 'ng-blatui';

<div buiBentoGrid [columns]="3">
  <bui-bento-item title="Fast" description="Blazing speed" [colSpan]="2" />
</div>`,
    bentoGridFeatures: `<div buiBentoGrid [columns]="3">
  <bui-bento-item title="Analytics" [colSpan]="2" [rowSpan]="2" />
  <bui-bento-item title="Automation" />
  <bui-bento-item title="Security" [colSpan]="2" />
</div>`,
    gallery: `import { BuiGallery } from 'ng-blatui';

<bui-gallery [images]="images" [columns]="3" />`,
    loadingOverlay: `import { BuiLoadingOverlay } from 'ng-blatui';

<bui-loading-overlay [show]="loading()">…content…</bui-loading-overlay>`,
    loadingOverlayToggle: `<button buiButton (click)="show.set(!show())">Toggle</button>
<bui-loading-overlay [show]="show()" message="Saving…">…content…</bui-loading-overlay>`,
    numberInput: `import { BuiNumberInput } from 'ng-blatui';

<bui-number-input [(value)]="qty" ariaLabel="Quantity" />`,
    numberInputMinMax: `<bui-number-input [value]="2" [min]="1" [max]="10" ariaLabel="Guests" />`,
    numberInputStep: `<bui-number-input [value]="50" [step]="5" ariaLabel="Step of 5" />`,
    numberInputDisabled: `<bui-number-input [value]="3" [disabled]="true" ariaLabel="Disabled" />`,
    numberInputSizes: `<!-- size = sm | default | lg -->
<bui-number-input [value]="2" size="sm" />
<bui-number-input [value]="2" size="lg" />`,
    variantSelector: `import { BuiVariantSelector } from 'ng-blatui';

<bui-variant-selector [(value)]="size" [options]="['S','M','L']" />`,
    variantSelectorDisabled: `<bui-variant-selector [value]="'M'" [options]="['XS','S','M','L']" [disabled]="true" />`,
    variantSelectorColors: `<!-- type="color" renders swatches from option.color -->
<bui-variant-selector [(value)]="colour" type="color" label="Colour"
  [options]="[{ value: 'black', label: 'Black', color: '#18181b' }, { value: 'blue', label: 'Blue', color: '#2563eb' }]" />`,
    sparkline: `import { BuiSparkline } from 'ng-blatui';

<bui-sparkline [data]="[4, 8, 5, 12, 7, 14, 9]" />`,
    addToCart: `import { BuiAddToCart } from 'ng-blatui';

<bui-add-to-cart (triggered)="addItem()" />`,
    addToCartLabels: `<bui-add-to-cart label="Add to bag" addedLabel="Added ✓" />`,
    addToCartSizes: `<bui-add-to-cart size="sm" />
<bui-add-to-cart size="lg" />`,
    passwordStrength: `import { BuiPasswordStrength } from 'ng-blatui';

<bui-password-strength label="Password" [minLength]="8" />`,
    passwordStrengthChecklist: `<bui-password-strength label="New password" [minLength]="10" [showChecklist]="true" />`,
    passwordStrengthNoChecklist: `<bui-password-strength label="Password" [showChecklist]="false" />`,
    productCard: `import { BuiProductCard } from 'ng-blatui';

<bui-product-card
  title="Trail Runner"
  image="/shoe.jpg"
  [price]="49.99"
  [compareAt]="69.99"
  badge="Sale"
/>`,
    productCardSale: `<bui-product-card title="Headphones" image="/cans.jpg" [price]="249" [compareAt]="349" badge="Sale" />`,
    productCardRating: `<bui-product-card title="Backpack" image="/bag.jpg" [price]="129" [rating]="4.5" [reviews]="128" [wishlist]="true" />`,
    typewriter: `import { BuiTypewriter } from 'ng-blatui';

<bui-typewriter [words]="['design', 'build', 'ship']" />`,
    typewriterNoCursor: `<bui-typewriter [cursor]="false" [words]="['Fast', 'Accessible', 'Yours']" />`,
    typewriterOnce: `<bui-typewriter [loop]="false" [words]="['Type once, then stop.']" />`,
    streamingText: `import { BuiStreamingText } from 'ng-blatui';

<bui-streaming-text text="Streaming responses, one token at a time." />`,
    streamingTextWord: `<bui-streaming-text by="word" text="One whole word at a time." />`,
    streamingTextFast: `<bui-streaming-text [speed]="15" text="A faster stream." />`,
    streamingTextNoCaret: `<bui-streaming-text [caret]="false" text="No blinking cursor." />`,
    borderBeam: `import { BuiBorderBeam } from 'ng-blatui';

<bui-border-beam class="max-w-xs">Travelling border beam.</bui-border-beam>`,
    borderBeamColored: `<bui-border-beam color="#ec4899">…</bui-border-beam>`,
    borderBeamFast: `<bui-border-beam [duration]="4">…</bui-border-beam>`,
    meteors: `import { BuiMeteors } from 'ng-blatui';

<bui-meteors [count]="20" class="rounded-xl border p-10">Content above the meteors.</bui-meteors>`,
    meteorsColored: `<bui-meteors [count]="40" color="#38bdf8">…</bui-meteors>`,
    aurora: `import { BuiAurora } from 'ng-blatui';

<bui-aurora class="p-12 text-white">Aurora background</bui-aurora>`,
    auroraCustom: `<bui-aurora [blur]="40" [speed]="8">…</bui-aurora>`,
    marquee: `import { BuiMarquee } from 'ng-blatui';

<bui-marquee [items]="['Acme', 'Globex', 'Initech', 'Umbrella']" />`,
    marqueeReverse: `<bui-marquee direction="right" [items]="[…]" />`,
    marqueePause: `<bui-marquee [pauseOnHover]="true" [items]="[…]" />`,
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
    parallaxHorizontal: `<bui-parallax axis="x" [speed]="0.4">Moves on the X axis</bui-parallax>`,
    scrollspy: `import { BuiScrollspy } from 'ng-blatui';

<bui-scrollspy [items]="[{ href: '#intro', label: 'Intro' }]" />`,
    timeField: `import { BuiTimeField } from 'ng-blatui';

<bui-time-field [(value)]="time" />`,
    timeFieldSeconds: `<bui-time-field [value]="'14:30:15'" [seconds]="true" />`,
    timeFieldDisabled: `<bui-time-field [value]="'09:00'" [disabled]="true" />`,
    toggleGroup: `import { BuiToggleGroup, BuiToggleGroupItem } from 'ng-blatui';

<bui-toggle-group [(value)]="align">
  <button buiToggleGroupItem value="left">Left</button>
  <button buiToggleGroupItem value="center">Center</button>
  <button buiToggleGroupItem value="right">Right</button>
</bui-toggle-group>`,
    toggleGroupMultiple: `<!-- type="multiple" → value is an array -->
<bui-toggle-group type="multiple" [(value)]="styles">
  <button buiToggleGroupItem value="bold">B</button>
  <button buiToggleGroupItem value="italic">I</button>
</bui-toggle-group>`,
    toggleGroupVertical: `<bui-toggle-group orientation="vertical" [(value)]="align">…</bui-toggle-group>`,
    toggleGroupDisabled: `<bui-toggle-group [value]="'center'">
  <button buiToggleGroupItem value="left" [disabled]="true">Left</button>
</bui-toggle-group>`,
    toggleGroupSizes: `<!-- size each item via classes (h-8/text-xs … h-11/px-4) -->
<bui-toggle-group [(value)]="v">
  <button buiToggleGroupItem value="a" class="h-8 min-w-8 px-2 text-xs">S</button>
</bui-toggle-group>`,
    toggleGroupSegmented: `<!-- pill/segmented look: muted container + rounded items -->
<bui-toggle-group [(value)]="v" class="rounded-lg bg-muted p-1">
  <button buiToggleGroupItem value="list" class="rounded-md border-0 data-[state=on]:bg-background data-[state=on]:shadow-sm">List</button>
</bui-toggle-group>`,
    tagsInput: `import { BuiTagsInput } from 'ng-blatui';

<bui-tags-input [(tags)]="tags" />`,
    tagsInputMax: `<bui-tags-input [tags]="['Design']" [max]="3" placeholder="Up to 3 tags…" />`,
    tagsInputDisabled: `<bui-tags-input [tags]="['Read-only', 'Tags']" [disabled]="true" />`,
    tagsInputPrefilled: `<bui-tags-input [(tags)]="tags" />
// tags = signal(['design', 'frontend', 'accessibility'])`,
    editable: `import { BuiEditable } from 'ng-blatui';

<bui-editable [(value)]="name" label="title" />`,
    editablePlaceholder: `<bui-editable [value]="''" label="nickname" placeholder="Add a nickname…" />`,
    editableTextarea: `<!-- [multiline]="true" edits in a textarea (Escape cancels, blur commits) -->
<bui-editable [(value)]="note" [multiline]="true" label="note" />`,
    speedDial: `import { BuiSpeedDial } from 'ng-blatui';

<bui-speed-dial [actions]="[{ label: 'Share' }, { label: 'Edit' }]" />`,
    speedDialDown: `<bui-speed-dial [actions]="actions" direction="down" />`,
    knob: `import { BuiKnob } from 'ng-blatui';

<bui-knob [(value)]="level" [min]="0" [max]="100" label="Volume" />`,
    knobSizes: `<!-- size="sm | default | lg" -->
<bui-knob [value]="30" size="sm" label="Bass" />
<bui-knob [value]="80" size="lg" label="Treble" />`,
    knobRange: `<bui-knob [value]="6" [min]="0" [max]="11" [step]="1" label="Gain" />`,
    image: `import { BuiImage } from 'ng-blatui';

<bui-image src="/photo.jpg" alt="A scenic view" />`,
    imageRatio: `<bui-image src="/photo.jpg" alt="" ratio="16/9" />`,
    imagePlaceholder: `<!-- blur-up from a tiny placeholder -->
<bui-image src="/full.jpg" placeholder="/tiny.jpg" alt="" ratio="16/9" />`,
    imageFallback: `<!-- shows a fallback when the src fails to load -->
<bui-image src="/missing.jpg" alt="" ratio="16/9" />`,
    reasoning: `import { BuiReasoning } from 'ng-blatui';

<bui-reasoning>
  The capital of Australia is Canberra, not Sydney.
</bui-reasoning>`,
    reasoningOpen: `<bui-reasoning [open]="true">First, break the problem into steps…</bui-reasoning>`,
    reasoningDuration: `<bui-reasoning duration="4s" [open]="true">Weighing tone and brevity…</bui-reasoning>`,
    toolCall: `import { BuiToolCall } from 'ng-blatui';

<bui-tool-call name="get_weather" status="success" args="{ location: 'SF' }" result="18°C, sunny" />`,
    toolCallRunning: `<bui-tool-call name="run_query" status="running" args="{ query: 'SELECT …' }" />`,
    toolCallError: `<bui-tool-call name="read_file" status="error" args="{ path: '/x' }" result="ENOENT" />`,
    chat: `import { BuiChat, BuiChatMessage } from 'ng-blatui';

<div buiChat>
  <bui-chat-message role="assistant" name="Bot">Hi! How can I help?</bui-chat-message>
  <bui-chat-message role="user" name="You">Build me a UI library.</bui-chat-message>
</div>`,
    chatTyping: `<bui-chat-message role="assistant" name="Assistant" [typing]="true" />`,
    chatAvatars: `<bui-chat-message role="assistant" name="Bot" avatar="/bot.png" time="14:01">Welcome back!</bui-chat-message>`,
    confetti: `import { BuiConfetti } from 'ng-blatui';

<bui-confetti><button buiButton>Launch 🎉</button></bui-confetti>`,
    confettiColors: `<bui-confetti [colors]="['#f43f5e', '#8b5cf6', '#0ea5e9']" [count]="120">
  <button buiButton variant="outline">Celebrate 🎊</button>
</bui-confetti>`,
    stepper: `import { BuiStepper, BuiStepperItem } from 'ng-blatui';

<bui-stepper [value]="2">
  <li buiStepperItem [step]="1">Account</li>
  <li buiStepperItem [step]="2">Profile</li>
  <li buiStepperItem [step]="3">Done</li>
</bui-stepper>`,
    stepperVertical: `<bui-stepper [value]="2" orientation="vertical">
  <li buiStepperItem [step]="1">Account details</li>
  <li buiStepperItem [step]="2">Company info</li>
</bui-stepper>`,
    stepperLabels: `<bui-stepper [value]="3">
  <li buiStepperItem [step]="1">Cart</li>
  <li buiStepperItem [step]="2">Shipping</li>
  <li buiStepperItem [step]="3">Payment</li>
  <li buiStepperItem [step]="4">Confirm</li>
</bui-stepper>`,
    stepperDescription: `<li buiStepperItem [step]="1">
  <span class="font-medium">Account</span>
  <span class="block text-xs font-normal text-muted-foreground">Your login details</span>
</li>`,
    inputOtp: `import { BuiInputOtp } from 'ng-blatui';

<bui-input-otp [(value)]="code" [maxlength]="6" />`,
    inputOtpFour: `<bui-input-otp [maxlength]="4" ariaLabel="4-digit code" />`,
    inputOtpAlpha: `<bui-input-otp [maxlength]="6" [alphanumeric]="true" />`,
    inputOtpDisabled: `<bui-input-otp [value]="'123'" [maxlength]="6" [disabled]="true" />`,
    inputOtpSeparator: `<!-- groupSize inserts a separator every N boxes -->
<bui-input-otp [(value)]="otp" [maxlength]="6" [groupSize]="3" />`,
    phoneInput: `import { BuiPhoneInput } from 'ng-blatui';

<bui-phone-input [(value)]="phone" [(country)]="country" />`,
    phoneInputLabel: `<label buiLabel for="phone">Phone number</label>
<bui-phone-input id="phone" [(value)]="phone" [(country)]="country" />`,
    promptInput: `import { BuiPromptInput } from 'ng-blatui';

<bui-prompt-input [attachable]="true" (submitted)="send($event)" />`,
    promptInputPlain: `<bui-prompt-input placeholder="Ask anything…" />`,
    promptInputDisabled: `<bui-prompt-input [disabled]="true" placeholder="Sending…" />`,
    heatmap: `import { BuiHeatmap } from 'ng-blatui';

<bui-heatmap [data]="activity" />`,
    heatmapCompact: `<bui-heatmap [compact]="true" />`,
    citation: `import { BuiCitation } from 'ng-blatui';

…next token<bui-citation [index]="1" title="Attention Is All You Need" url="https://arxiv.org/abs/1706.03762" />.`,
    citationSnippet: `…appears blue<bui-citation [index]="1" title="Rayleigh scattering" url="…" snippet="Shorter wavelengths scatter more." />.`,
    citationMultiple: `…retrieved documents<bui-citation [index]="1" title="RAG" url="…" />, reducing hallucination<bui-citation [index]="2" title="Survey" url="…" />.`,
    resizable: `import { BuiResizablePanelGroup, BuiResizablePanel, BuiResizableHandle } from 'ng-blatui';

<bui-resizable-panel-group class="h-40">
  <div buiResizablePanel [primary]="true">Sidebar</div>
  <bui-resizable-handle [withHandle]="true" />
  <div buiResizablePanel>Content</div>
</bui-resizable-panel-group>`,
    resizableVertical: `<bui-resizable-panel-group direction="vertical" class="h-56">
  <div buiResizablePanel [primary]="true">Header</div>
  <bui-resizable-handle [withHandle]="true" />
  <div buiResizablePanel>Body</div>
</bui-resizable-panel-group>`,
    resizableNoHandle: `<!-- omit [withHandle] for a plain divider -->
<bui-resizable-panel-group>
  <div buiResizablePanel [primary]="true">One</div>
  <bui-resizable-handle />
  <div buiResizablePanel>Two</div>
</bui-resizable-panel-group>`,
    resizableNested: `<!-- nest a vertical group inside a panel -->
<bui-resizable-panel-group>
  <div buiResizablePanel [primary]="true">Sidebar</div>
  <bui-resizable-handle [withHandle]="true" />
  <div buiResizablePanel>
    <bui-resizable-panel-group direction="vertical" class="h-full">
      <div buiResizablePanel [primary]="true">Top</div>
      <bui-resizable-handle [withHandle]="true" />
      <div buiResizablePanel>Bottom</div>
    </bui-resizable-panel-group>
  </div>
</bui-resizable-panel-group>`,
    video: `import { BuiVideo } from 'ng-blatui';

<bui-video src="/demo.mp4" poster="/poster.jpg" />`,
    colorPicker: `import { BuiColorPicker } from 'ng-blatui';

<bui-color-picker [(value)]="color" />`,
    colorPickerSwatches: `<bui-color-picker [value]="'#0ea5e9'" [swatches]="['#0ea5e9', '#10b981', '#f43f5e', '#8b5cf6']" />`,
    colorPickerDisabled: `<bui-color-picker [value]="'#6366f1'" [disabled]="true" />`,
    cookieConsent: `import { BuiCookieConsent } from 'ng-blatui';

<bui-cookie-consent (decided)="onConsent($event)" />`,
    cookieConsentCustom: `<bui-cookie-consent message="We use cookies to personalise content and analyse traffic." />`,
    infiniteScroll: `import { BuiInfiniteScroll } from 'ng-blatui';

<bui-infinite-scroll [loading]="loading()" [finished]="done()" (more)="loadMore()">
  …items…
</bui-infinite-scroll>`,
    audioPlayer: `import { BuiAudioPlayer } from 'ng-blatui';

<bui-audio-player src="/track.mp3" title="Nightfall" artist="The Band" />`,
    audioPlayerCompact: `<!-- compact hides the title block + mute button -->
<bui-audio-player src="/track.mp3" [compact]="true" />`,
    signaturePad: `import { BuiSignaturePad } from 'ng-blatui';

<bui-signature-pad [height]="180" />`,
    signaturePadColor: `<bui-signature-pad [height]="180" penColor="#4f46e5" />`,
    dock: `import { BuiDock, BuiDockItem } from 'ng-blatui';

<bui-dock>
  <bui-dock-item [active]="true">🏠</bui-dock-item>
  <bui-dock-item>📁</bui-dock-item>
  <bui-dock-item>✉️</bui-dock-item>
</bui-dock>`,
    tree: `import { BuiTree } from 'ng-blatui';

<bui-tree [items]="files" />
// files = [{ label: 'src', expanded: true, children: [...] }]`,
    treeFiles: `<bui-tree [items]="files" ariaLabel="Project files" />
// leaf items can set icon: 'file-code' etc; parents auto-render folders`,
    treeExpandedEx: `<!-- set expanded: true on nodes to open them initially -->
<bui-tree [items]="items" />
// items = [{ label: 'src', expanded: true, children: [{ label: 'app', expanded: true, children: [...] }] }]`,
    repeater: `import { BuiRepeater } from 'ng-blatui';

<bui-repeater [fields]="fields" [(rows)]="rows" />
// fields = [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }]`,
    repeaterMulti: `<bui-repeater [fields]="fields" [(rows)]="rows" addLabel="Add guest" />
// fields = [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email', type: 'email' }]`,
    repeaterMax: `<!-- [max] caps the rows and disables the add button -->
<bui-repeater [fields]="fields" [(rows)]="rows" [min]="1" [max]="3" />`,
    notificationCenter: `import { BuiNotificationCenter } from 'ng-blatui';

<bui-notification-center [notifications]="feed" />`,
    notificationCenterEmpty: `<bui-notification-center [notifications]="[]" />`,
    jsonViewer: `import { BuiJsonViewer } from 'ng-blatui';

<bui-json-viewer [data]="response" />`,
    jsonViewerCollapsed: `<bui-json-viewer [data]="response" [expanded]="false" />`,
    jsonViewerArray: `<!-- a JSON array at the root -->
<bui-json-viewer [data]="rows" />
// rows = [{ id: 1, name: 'Ada' }, …]`,
    orgChart: `import { BuiOrgChart } from 'ng-blatui';

<bui-org-chart [node]="org" />
// org = { name: 'CEO', children: [{ name: 'CTO' }, ...] }`,
    orgChartAvatars: `<bui-org-chart [node]="org" />
// nodes can include avatar: '/u.png'`,
    miniCart: `import { BuiMiniCart } from 'ng-blatui';

<bui-mini-cart [items]="cart" />`,
    miniCartEmpty: `<bui-mini-cart [items]="[]" />`,
    animatedBeam: `import { BuiAnimatedBeam } from 'ng-blatui';

<bui-animated-beam from="#a" to="#b">
  <div id="a">…</div>
  <div id="b">…</div>
</bui-animated-beam>`,
    animatedBeamCurved: `<bui-animated-beam from="#a" to="#b" [curvature]="60">…</bui-animated-beam>`,
    diffViewer: `import { BuiDiffViewer } from 'ng-blatui';

<bui-diff-viewer [before]="oldText" [after]="newText" filename="config.ts" />`,
    diffViewerNoFilename: `<bui-diff-viewer [before]="oldText" [after]="newText" />`,
    treeTable: `import { BuiTreeTable } from 'ng-blatui';

<bui-tree-table [columns]="columns" [rows]="rows" />`,
    markdownEditor: `import { BuiMarkdownEditor } from 'ng-blatui';

<bui-markdown-editor [(value)]="md" />`,
    markdownEditorPrefilled: String.raw`<!-- seed the model with initial markdown -->
<bui-markdown-editor [(value)]="md" />
// md = signal('## Release notes\n- New calendar inputs')`,
    calendar: `import { BuiCalendar } from 'ng-blatui';

<bui-calendar [(value)]="date" />`,
    calendarMonday: `<bui-calendar [(value)]="date" [weekStart]="1" />`,
    calendarMinMax: `<bui-calendar [(value)]="date" minDate="2026-06-01" maxDate="2026-06-30" />`,
    calendarDisabledDates: `<!-- disable specific ISO dates -->
<bui-calendar [(value)]="date" [disabledDates]="['2026-06-10', '2026-06-16']" />`,
    calendarWeekends: `<bui-calendar [(value)]="date" [disableWeekends]="true" />`,
    calendarWeekNumbers: `<bui-calendar [(value)]="date" [showWeekNumbers]="true" />`,
    calendarOutline: `<!-- outline each day cell via an arbitrary child selector -->
<bui-calendar class="[&_tbody_button]:border [&_tbody_button]:border-border/60" [(value)]="date" />`,
    datePicker: `import { BuiDatePicker } from 'ng-blatui';

<bui-date-picker [(value)]="date" />`,
    datePickerPlaceholder: `<bui-date-picker [(value)]="date" placeholder="Choose a date…" />`,
    datePickerMinMax: `<bui-date-picker [(value)]="date" minDate="2026-01-01" maxDate="2026-12-31" />`,
    datePickerLabel: `<div buiField>
  <label buiFieldLabel for="dob">Date of birth</label>
  <bui-date-picker id="dob" [(value)]="date" />
</div>`,
    datePickerMonday: `<!-- forwards weekStart to the inner calendar -->
<bui-date-picker [(value)]="date" [weekStart]="1" />`,
    datePickerDisabled: `<bui-date-picker [(value)]="date" [disabledDates]="['2026-06-10']" [disableWeekends]="true" />`,
    datePickerWeekNumbers: `<bui-date-picker [(value)]="date" [showWeekNumbers]="true" />`,
    carousel: `import { BuiCarousel } from 'ng-blatui';

<bui-carousel>
  <div>Slide 1</div>
  <div>Slide 2</div>
</bui-carousel>`,
    carouselMultiple: `<!-- [perView] shows N slides at once -->
<bui-carousel [perView]="2">
  <div class="p-1">Slide 1</div>
  <div class="p-1">Slide 2</div>
</bui-carousel>`,
    carouselVertical: `<!-- orientation="vertical" needs a fixed height on the carousel -->
<bui-carousel class="h-40" orientation="vertical">
  <div class="h-full">Slide 1</div>
  <div class="h-full">Slide 2</div>
</bui-carousel>`,
    command: `import { BuiCommand } from 'ng-blatui';

<bui-command [groups]="groups" (selected)="run($event)" />`,
    commandSimple: `<bui-command [groups]="[{ label: 'Actions', items: [...] }]" />`,
    contextMenu: `import { BuiContextMenu } from 'ng-blatui';

<bui-context-menu [items]="items">
  <div>Right-click here</div>
</bui-context-menu>`,
    dataTable: `import { BuiDataTable } from 'ng-blatui';

<bui-data-table [columns]="columns" [rows]="rows" [pageSize]="5" />`,
    chart: `import { BuiChart } from 'ng-blatui';

<bui-chart type="area" [series]="series" [labels]="labels" />`,
    chartBar: `<bui-chart type="bar" [series]="series" [labels]="labels" />`,
    chartLine: `<bui-chart type="line" [series]="series" [labels]="labels" />`,
    datetimePicker: `import { BuiDatetimePicker } from 'ng-blatui';

<bui-datetime-picker [(value)]="when" />`,
    datetimePickerPlaceholder: `<bui-datetime-picker [(value)]="when" placeholder="Pick date & time…" />`,
    autocomplete: `import { BuiAutocomplete } from 'ng-blatui';

<bui-autocomplete [(value)]="value" [options]="frameworks" />`,
    autocompleteDisabled: `<bui-autocomplete [options]="frameworks" [disabled]="true" placeholder="Disabled" />`,
    autocompleteLabel: `<div buiField>
  <label buiFieldLabel for="fw">Framework</label>
  <bui-autocomplete id="fw" [options]="opts" />
</div>`,
    autocompleteSizes: `<!-- size = sm | default | lg -->
<bui-autocomplete [options]="opts" size="sm" />
<bui-autocomplete [options]="opts" size="lg" />`,
    autocompleteIcon: `<!-- icon = an SVG path d string (leading icon) -->
<bui-autocomplete [options]="opts" icon="m21 21-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />`,
    comparisonSlider: `import { BuiComparisonSlider } from 'ng-blatui';

<bui-comparison-slider before="/before.jpg" after="/after.jpg" beforeLabel="Before" afterLabel="After" />`,
    comparisonSliderNoLabels: `<bui-comparison-slider before="/before.jpg" after="/after.jpg" beforeLabel="" afterLabel="" />`,
    fileUpload: `import { BuiFileUpload } from 'ng-blatui';

<bui-file-upload hint="Up to 10MB" />`,
    fileUploadMultiple: `<bui-file-upload [multiple]="true" accept=".pdf,.doc,.docx" hint="Max 5 files" />`,
    fileUploadImages: `<bui-file-upload [multiple]="true" accept="image/*" hint="PNG, JPG or GIF" />`,
    fileUploadProgress: `<!-- pair an upload row with bui-progress for an in-flight upload -->
<div class="flex items-center gap-3">
  <span class="font-medium">report-q2.pdf</span>
  <bui-progress [value]="70" />
</div>`,
    topProgress: `import { BuiTopProgress } from 'ng-blatui';

<bui-top-progress #bar [demo]="true" />
<button (click)="bar.start()">Start</button>`,
    drawer: `import { BuiDrawer } from 'ng-blatui';

<button (click)="open.set(true)">Open</button>
<bui-drawer [(open)]="open" direction="right">Panel content</bui-drawer>`,
    drawerBottom: `<bui-drawer [(open)]="open" direction="bottom">…</bui-drawer>`,
    drawerScroll: `<bui-drawer [(open)]="open" direction="right" class="w-80">
  <h2>Changelog</h2>
  <div class="flex-1 overflow-y-auto">…long content…</div>
  <button buiButton>Close</button>
</bui-drawer>`,
    drawerLeft: `<bui-drawer [(open)]="open" direction="left">…</bui-drawer>`,
    inputMask: `import { BuiInputMask } from 'ng-blatui';

<bui-input-mask mask="(999) 999-9999" inputmode="numeric" [(value)]="phone" />`,
    inputMaskDate: `<bui-input-mask mask="99/99/9999" inputmode="numeric" placeholder="MM/DD/YYYY" />`,
    inputMaskTime: `<bui-input-mask mask="99:99" inputmode="numeric" placeholder="HH:MM" />`,
    inputMaskCard: `<bui-input-mask mask="9999 9999 9999 9999" inputmode="numeric" />`,
    inputMaskPostcode: `<bui-input-mask mask="99999-9999" inputmode="numeric" placeholder="12345-6789" />`,
    sheet: `import { BuiSheet } from 'ng-blatui';

<button (click)="open.set(true)">Open</button>
<bui-sheet [(open)]="open" side="right">…</bui-sheet>`,
    sheetLeft: `<bui-sheet [(open)]="open" side="left">…</bui-sheet>`,
    sheetBottom: `<bui-sheet [(open)]="open" side="bottom">…</bui-sheet>`,
    sheetScroll: `<bui-sheet [(open)]="open" side="right">
  <h2>Terms</h2>
  <div class="flex-1 overflow-y-auto">…long content…</div>
  <button buiButton>Accept</button>
</bui-sheet>`,
    sonner: `import { BuiSonner, BuiToaster } from 'ng-blatui';

// render once: <bui-sonner />
toaster = inject(BuiToaster);
this.toaster.show({ title: 'Saved', tone: 'success' });`,
    sonnerTones: `// tone: 'default' | 'success' | 'error' | 'warning' | 'info'
this.toaster.show({ title: 'Something went wrong', tone: 'error' });
this.toaster.show({ title: 'Storage almost full', tone: 'warning' });`,
    sonnerRich: `this.toaster.show({ title: 'Deployment ready', description: 'Your site is live.' });`,
    sonnerAction: `// ToastOptions.action renders an inline button
this.toaster.show({ title: 'Message archived', action: { label: 'Undo', onClick: () => restore() } });`,
    sonnerStack: `// call show() several times — they stack
this.toaster.show({ title: 'File uploaded' });
this.toaster.show({ title: 'Comment posted', tone: 'success' });`,
    sonnerPromise: `// loading toast (duration: 0) → dismiss → success
const id = this.toaster.show({ title: 'Saving…', duration: 0 });
setTimeout(() => { this.toaster.dismiss(id); this.toaster.show({ title: 'Saved', tone: 'success' }); }, 1500);`,
    navigationMenu: `import { BuiNavigationMenu } from 'ng-blatui';

<bui-navigation-menu [items]="items" />`,
    navigationMenuSimple: `<bui-navigation-menu [items]="items" />
// flat items (no links) render as plain links, no dropdown`,
    navigationMenuFeatured: `<!-- an item.featured promo block sits atop its dropdown -->
<bui-navigation-menu [items]="items" />
// items[0] = { label: 'Products', featured: { label, description, href }, links: [...] }`,
    mentionInput: `import { BuiMentionInput } from 'ng-blatui';

<bui-mention-input [(value)]="text" [mentions]="people" />`,
    mentionInputPrefilled: `<bui-mention-input [value]="'Thanks @ada for the review!'" [mentions]="people" />`,
    map: `import { BuiMap } from 'ng-blatui';

<bui-map [lat]="48.8584" [lon]="2.2945" label="Eiffel Tower" />`,
    mapNoMarker: `<bui-map [lat]="48.8584" [lon]="2.2945" [marker]="false" />`,
    mapTall: `<bui-map [lat]="40.7128" [lon]="-74.006" label="New York" [height]="480" />`,
    gantt: `import { BuiGantt } from 'ng-blatui';

<bui-gantt [tasks]="tasks" />`,
    scheduler: `import { BuiScheduler } from 'ng-blatui';

<bui-scheduler [events]="events" [startHour]="8" [endHour]="18" />`,
    schedulerDay: `<bui-scheduler [events]="events" view="day" [startHour]="8" [endHour]="16" />`,
    kanban: `import { BuiKanban } from 'ng-blatui';

<bui-kanban [columns]="columns" (changed)="save($event)" />`,
    richTextEditor: `import { BuiRichTextEditor } from 'ng-blatui';

<bui-rich-text-editor [(value)]="html" />`,
    richTextEditorPrefilled: `<!-- seed the model with initial HTML -->
<bui-rich-text-editor [(value)]="html" />
// html = signal('<h3>Welcome</h3><p>Starts <strong>prefilled</strong>.</p>')`,
    sidebar: `import { BuiSidebar, BuiSidebarMenuButton } from 'ng-blatui';

<bui-sidebar [(open)]="open">
  <a buiSidebarMenuButton [isActive]="true" href="#">Dashboard</a>
</bui-sidebar>`,
    sidebarIcon: `<bui-sidebar [(open)]="open" collapsible="icon">…menu…</bui-sidebar>`,
    sidebarRight: `<bui-sidebar [(open)]="open" side="right">…menu…</bui-sidebar>`,
    onboardingTour: `import { BuiOnboardingTour } from 'ng-blatui';

<button (click)="open.set(true)">Start tour</button>
<bui-onboarding-tour [(open)]="open" [steps]="steps" />`,
    qrCode: `import { BuiQrCode } from 'ng-blatui';

<bui-qr-code value="https://ngblatui.remix-it.com" [size]="180" />`,
    qrCodeStyled: `<bui-qr-code value="…" [size]="180" foreground="#4f46e5" background="#eef2ff" [margin]="2" />`,
  };
}

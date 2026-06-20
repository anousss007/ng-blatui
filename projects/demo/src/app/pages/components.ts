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
  BuiAccordion,
  BuiAccordionContent,
  BuiAccordionItem,
  BuiAccordionTrigger,
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
  BuiAspectRatio,
  BuiAutosizeTextarea,
  BuiAvatar,
  BuiAvatarGroup,
  BuiBadge,
  BuiBanner,
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
  BuiCheckbox,
  BuiCodeBlock,
  BuiCollapsible,
  BuiCollapsibleContent,
  BuiCollapsibleTrigger,
  BuiContainer,
  BuiCopyButton,
  BuiDialogContent,
  BuiDialogDescription,
  BuiDialogFooter,
  BuiDialogHeader,
  BuiDialogTitle,
  BuiDotPattern,
  BuiDropdownMenu,
  BuiDropdownMenuItem,
  BuiDropdownMenuLabel,
  BuiDropdownMenuSeparator,
  BuiEmpty,
  BuiEmptyDescription,
  BuiEmptyHeader,
  BuiEmptyMedia,
  BuiEmptyTitle,
  BuiField,
  BuiFieldDescription,
  BuiFieldLabel,
  BuiGridPattern,
  BuiHoverCard,
  BuiHoverCardContent,
  BuiInput,
  BuiInputGroup,
  BuiInputGroupAddon,
  BuiInputGroupButton,
  BuiInputGroupInput,
  BuiInputGroupText,
  BuiItem,
  BuiItemActions,
  BuiItemContent,
  BuiItemDescription,
  BuiItemMedia,
  BuiItemTitle,
  BuiKbd,
  BuiLabel,
  BuiMenubar,
  BuiMenubarTrigger,
  BuiMeter,
  BuiPagination,
  BuiPaginationContent,
  BuiPaginationEllipsis,
  BuiPaginationItem,
  BuiPaginationLink,
  BuiPopover,
  BuiPopoverContent,
  BuiProgress,
  BuiQuantitySelector,
  BuiRadioGroup,
  BuiRadioGroupItem,
  BuiRating,
  BuiScrollArea,
  BuiSegmentedControl,
  BuiSeparator,
  BuiSkeleton,
  BuiSlider,
  BuiSpinner,
  BuiStat,
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
  BuiTextarea,
  BuiToggle,
  BuiTooltip,
  BuiTypography,
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
  };
}

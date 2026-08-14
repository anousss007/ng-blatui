---
name: ng-blatui
description: Use the ng-blatui Angular UI library in an app — install, import components (bui-prefixed, signal-based, zoneless, SSR-safe), theme with Tailwind v4 + oklch tokens, localize dates/numbers/labels, and discover the full catalog via the registry, api.json, llms.txt or the ng-blatui-mcp MCP server. Invoke when building Angular UIs with ng-blatui or choosing/wiring its components, blocks, charts or page templates.
---

# Using ng-blatui

`ng-blatui` is an accessible Angular UI library (Angular 21 & 22 — standalone, signals, zoneless, SSR-ready) ported from BlatUI, built on `@angular/aria` + `@angular/cdk`. **157 components, 16 blocks, 70 charts, 35 page templates.**

## Install

```bash
npm i ng-blatui
```

Peer deps: `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/cdk`, `@angular/aria`.

### Tailwind v4 setup — three lines, and the third is the one people miss

```css
/* src/styles.css */
@import 'tailwindcss';
@import 'ng-blatui/foundations/blatui.css'; /* oklch design tokens + dark theme */
@source '../node_modules/ng-blatui'; /* generate the utilities the lib's classes use */
```

Without `@source`, Tailwind never scans ng-blatui's compiled templates and **every component renders unstyled** — that is the first thing to check when a screen looks broken. Adjust the `../` depth to wherever `node_modules` sits relative to the stylesheet. Dark mode is a `dark` class on an ancestor (`<html class="dark">`); re-theme by overriding oklch tokens in `:root` / `.dark`.

Nothing else to import: CDK 22 injects its own overlay styles, so `overlay-prebuilt.css` is **not** needed.

### Icons

The library ships **no icon set**. Wire your own (e.g. `@ng-icons` with `provideIcons(...)`). Components that take an icon accept an SVG path `d` string, so any source works.

## Core conventions

- **Standalone + `imports[]`**: import the class from the `ng-blatui` barrel into a standalone component's `imports`. No NgModule.
- **Selectors prefixed `bui`** — element form `<bui-avatar>`, attribute/directive form `<button buiButton>`, `<input buiInput>`, `<span buiBadge tone="success">`.
- **`class` is an input on element components** (`input<ClassValue>('', { alias: 'class' })`), merged with the internal classes via tailwind-merge — so `<bui-card class="mt-6">` overrides cleanly instead of fighting specificity. Hosts also expose `data-slot="…"` attributes as styling hooks.
- **Signals & zoneless**: inputs are `input()`/`model()`, outputs `output()`. Bind `[checked]` / `(checkedChange)`. Works under zoneless CD and SSR with no extra setup.
- **Forms**: every control is a `ControlValueAccessor` — `formControlName`, `[(ngModel)]`, `[formControl]`, or Signal Forms all work.

```ts
import { Component } from '@angular/core';
import { BuiButton, BuiBadge } from 'ng-blatui';

@Component({
  selector: 'app-demo',
  imports: [BuiButton, BuiBadge],
  template: `<button buiButton>Save <span buiBadge tone="success">New</span></button>`,
})
export class Demo {}
```

## Floating components live in the CDK overlay

Dropdown-menu, context-menu, navigation-menu, select, combobox, autocomplete, popover, hover-card, tooltip, dialog, date-picker, datetime-picker, date-range-picker, mini-cart and notification-center portal their panel into `.cdk-overlay-container` at the document root. Consequences:

- They escape `overflow: hidden` ancestors, flip (and push) to stay on-screen, and close on outside click — don't hand-roll workarounds.
- Panel content is **outside** the component's DOM subtree: component-scoped CSS won't reach it, and tests must query `document.querySelector('.cdk-overlay-container …')`, not the fixture.

`bui-dialog` is CDK's `Dialog` service, so its backdrop behaviour is the `disableClose` config. `bui-sheet` and `bui-drawer` take `[closeOnOverlay]="false"` for a static backdrop instead — it governs the backdrop only, Escape stays wired.

## Form fields: two levels

- **Batteries-included** (label + hint + error + `aria-describedby`/`aria-invalid` wired for you): `BuiInputField`, `BuiMoneyInput` (localized currency; `symbol="DH"` overrides the ISO code), `BuiDateRangePicker` (start→end with presets), plus `BuiSelect`, `BuiCombobox`, `BuiAutocomplete`, `BuiPhoneInput`.
- **Composition primitives** for custom layouts: `buiField` + `buiFieldLabel` / `buiFieldDescription` / `buiFieldError` wrap a bare `buiInput` and manage the a11y relationships. `buiFieldSet` / `buiFieldLegend` group them.

Reach for a bare `buiInput` only if you add the `buiField` scaffolding yourself. Other easy-to-miss primitives: `buiEmpty` (empty states), `bui-stat` (stat cards).

## Sidebar

`bui-sidebar-provider` owns the shared state (`exportAs="buiSidebar"`). Worth knowing:

- `[mobileBreakpoint]="1023"` moves the off-canvas threshold off Tailwind's `md`; a bare number is px, anything else (`'40em'`) is used as written.
- `buiSidebarContent` is the scrolling region between a pinned header and footer. Without it the sidebar scrolls as a whole — either way an overflowing menu stays reachable, and the icon rail hides its scrollbar rather than losing 16px of a 3.5rem rail to it.
- `<a buiSidebarMenuButton tooltip="Inbox">` labels an item while it is shrunk to the icon rail, and only there. It is a visual affordance: the label `<span>` stays in the DOM, so the accessible name never depends on it.

Directional icons take the `blat-rtl-flip` class from the foundations stylesheet to mirror under `dir="rtl"`; the registry itself is written in logical properties (`ps-*`, `me-*`, `border-s`, `text-start`), so RTL needs no overrides.

## Localization

Dates, numbers and week conventions follow the app's `LOCALE_ID` — no config needed, and no hardcoded `en-US`.

- Per-instance override: `locale` input on `bui-calendar`, `bui-date-picker`, `bui-datetime-picker`, `bui-date-range-picker`, `bui-time-field`, `bui-gantt`, `bui-price`, `bui-mini-cart`, `bui-money-input`. Use it for runtime language switching — a statically injected `LOCALE_ID` can't reformat.
- Pattern control: `dateFormat` takes full `Intl.DateTimeFormatOptions` (`{ dateStyle: 'short' }` works), `numberFormat` takes `Intl.NumberFormatOptions`.
- Week start, weekend days and numbering system come from the locale (fr → Monday, ar-EG → Saturday with Friday/Saturday weekend, Arabic-Indic digits).
- Built-in English copy is overridable globally:

```ts
providers: [
  provideBuiLabels({ bannerDismiss: 'Fermer', fileUploadRemove: 'Supprimer le fichier' }),
];
```

`provideBuiLabels` takes a `Partial<BuiLabels>`; unpassed keys keep their English defaults. Resolution order: per-instance input → global override → built-in.

## Discovering components (do this before guessing)

Don't invent component names or props. Resolve them, in order of preference:

1. **MCP server** (best for agents): `npx ng-blatui-mcp` — tools `list_components` (optional `category`), `list_blocks`, `list_charts`, `list_templates`, `search({ query })`, `get_docs({ name })` (docs + install + import + full typed API) and `get_api({ name })` (just the typed API). Also serves prompts `use-component` and `scaffold-page`.
   ```bash
   claude mcp add ng-blatui -- npx -y ng-blatui-mcp
   ```
2. **`https://ngblatui.remix-it.com/api.json`** — every component's summary, class, selector, inputs (with types/defaults/docs), models, outputs and referenced types.
3. **`https://ngblatui.remix-it.com/registry.json`** — catalog index: `name`, `type`, `category`, `url` + an API summary per item.
4. **`https://ngblatui.remix-it.com/llms.txt`** — the curated index.
5. **Docs pages** are prerendered, so `https://ngblatui.remix-it.com/components/<slug>` returns real HTML with the live example, props and copy-paste code. Same for `/blocks/`, `/charts/`, `/templates/`.

Component categories: Forms & Input, Data Display, Layout, Feedback, Disclosure, Navigation, Overlays, Effects, AI, E-commerce, Media.

When unsure about a component, call `get_docs`/`get_api` (or fetch the page) and copy the documented import + usage rather than guessing.

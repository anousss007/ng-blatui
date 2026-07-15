# ng-blatui

A large Angular 21/22 UI library — 157 signal-based, standalone, zoneless- and SSR-safe components
styled with Tailwind CSS v4. Selectors are prefixed **`bui`**.

Full docs & live catalog: **https://ngblatui.remix-it.com**

## Installation

```bash
npm i ng-blatui
```

Peer dependencies: `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/cdk`,
`@angular/aria` (Angular 21 or 22).

### Tailwind CSS setup

Styling is **Tailwind CSS v4**. In your app's global stylesheet (e.g. `src/styles.css`):

```css
@import 'tailwindcss';
@import 'ng-blatui/foundations/blatui.css'; /* design tokens + dark theme */
@source '../node_modules/ng-blatui'; /* ← generate the utilities the lib's classes use */
```

The **`@source`** line is the one to not forget: without it Tailwind never scans ng-blatui's
compiled templates, so components render **unstyled**. Adjust the `../` depth so it points at
`node_modules/ng-blatui` relative to the stylesheet. Dark mode is a `dark` class on a parent;
override any oklch token in `:root` / `.dark` to re-theme.

### Icons

ng-blatui ships no icon set — wire your own (e.g. `@ng-icons`) with `provideIcons(...)`. Components
that take an icon accept an SVG path `d` string, so any source works.

## Usage

Import the component from the `ng-blatui` barrel into a standalone component's `imports[]` — no
NgModule.

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

Signals throughout (`input()` / `model()`); every form control is a `ControlValueAccessor`
(`formControlName`, `[(ngModel)]`, `[formControl]` all work).

### Form fields: two levels

- **Batteries-included** (label + hint + error + ARIA handled for you): `BuiInputField`,
  `BuiMoneyInput` (localized currency; `symbol="DH"` overrides the ISO code), `BuiDateRangePicker`
  (start→end with presets), `BuiSelect`, `BuiCombobox`, `BuiAutocomplete`, `BuiPhoneInput`.
- **Composition primitives** for custom layouts: `buiField` + `buiFieldLabel` /
  `buiFieldDescription` / `buiFieldError` around a bare `buiInput`.

Other easy-to-miss building blocks: `buiEmpty` (empty states), `bui-stat` (stat cards).

## Discover the whole catalog

- Live docs: **https://ngblatui.remix-it.com/components**
- `llms.txt` (for AI tools): **https://ngblatui.remix-it.com/llms.txt**
- MCP server: `npx ng-blatui-mcp`

## License

MIT

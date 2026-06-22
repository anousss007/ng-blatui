---
name: ng-blatui
description: Use the ng-blatui Angular UI library in an app — install, import components (bui-prefixed, signal-based, zoneless, SSR-safe), theme with Tailwind v4 + oklch tokens, and discover the full catalog via the registry, llms.txt or the ng-blatui-mcp MCP server. Invoke when building Angular UIs with ng-blatui or choosing/wiring its components, blocks, charts or page templates.
---

# Using ng-blatui

`ng-blatui` is an accessible Angular UI library (Angular 22 — standalone, signals, zoneless, SSR-ready) ported from BlatUI. **155 components, 16 blocks, 70 charts, 34 page templates.**

## Install

```bash
npm i ng-blatui
```

Tailwind CSS v4 is the styling layer. Follow the theming setup at https://ngblatui.remix-it.com/docs/installation (import the ng-blatui preset/tokens into your Tailwind config and global stylesheet).

## Core conventions

- **Standalone + imports[]**: import the component class from the `ng-blatui` barrel and add it to a standalone component's `imports`. There is no NgModule.
- **Selectors are prefixed `bui`** — element form `<bui-avatar>`, attribute/directive form `<button buiButton>`, `<input buiInput>`, `<span buiBadge tone="success">`.
- **Signals & zoneless**: inputs are `input()`/`model()`, outputs `output()`. Bind with `[checked]` / `(checkedChange)` etc. Works under zoneless change detection and SSR with no extra setup.
- **Forms**: every form control implements `ControlValueAccessor`, so the same component drops into Reactive, Template-driven and Signal forms (`formControlName`, `[(ngModel)]`, or `[formControl]`).
- **Theming**: Tailwind v4 utilities + CSS variables (oklch design tokens — `--background`, `--foreground`, `--primary`, `--border`, `--muted`, `--radius`…). Restyle globally by overriding tokens; supports light/dark.

Example:

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

## Discovering components (do this before guessing)

Don't invent component names or props. Resolve them from one of these, in order of preference:

1. **MCP server** (best for agents): `npx ng-blatui-mcp` exposes tools `list_components`, `list_blocks`, `list_charts`, `list_templates`, `search`, and `get_docs({ name })` which returns the full usage + code for any slug. Config snippets: https://ngblatui.remix-it.com/docs/installation or the repo's `USING-WITH-AI.md`.
2. **Machine registry**: `https://ngblatui.remix-it.com/registry.json` — every item with `name`, `type`, `category`, `url`.
3. **llms.txt**: `https://ngblatui.remix-it.com/llms.txt` — the curated index.
4. **Docs pages** are server-prerendered, so `https://ngblatui.remix-it.com/components/<slug>` returns real HTML with the live example, props and copy-paste code. Same for `/blocks/<slug>`, `/charts/<slug>`, `/templates/<slug>`.

When asked for a component you're unsure about, call `get_docs` (or fetch the `/components/<slug>` page) and copy the documented import + usage rather than guessing.

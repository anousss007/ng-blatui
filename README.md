# ng-blatui

[![npm](https://img.shields.io/npm/v/ng-blatui.svg)](https://www.npmjs.com/package/ng-blatui)
[![license](https://img.shields.io/npm/l/ng-blatui.svg)](./LICENSE)
[![Angular](https://img.shields.io/badge/Angular-22-dd0031.svg)](https://angular.dev)

Accessible **Angular UI library** — a faithful port of [BlatUI](https://ngblatui.remix-it.com)'s visual system to Angular. Built on the official Angular headless stack (Angular Aria + CDK), styled with Tailwind CSS v4 + oklch design tokens.

**155 components · 16 blocks · 70 charts · 34 page templates** — all standalone, signal-based, zoneless and SSR-safe.

🔗 **[Docs & live demo →](https://ngblatui.remix-it.com)** · 📦 **[npm](https://www.npmjs.com/package/ng-blatui)** · 🤖 **[Using with AI →](./USING-WITH-AI.md)**

---

## Highlights

- **Angular 22** — standalone components, **signals** (`input()`/`model()`/`output()`), **zoneless** change detection, `OnPush` by default.
- **SSR-ready** — every component renders correctly under server-side rendering (the docs site prerenders 280+ static routes).
- **Accessible** — behavior built on `@angular/aria` + `@angular/cdk`; passes AXE / WCAG AA.
- **Forms-native** — every form control implements `ControlValueAccessor`, so the same component works with Reactive, Template-driven and Signal forms.
- **Themeable** — Tailwind v4 utilities + CSS variables (oklch tokens); light/dark out of the box.
- **AI-ready** — ships an MCP server, an `llms.txt` index and a machine-readable registry (see below).

## Installation

```bash
npm i ng-blatui
```

Peer dependencies (Angular 22): `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/cdk`, `@angular/aria`. Styling is **Tailwind CSS v4** — import the ng-blatui tokens/preset into your global stylesheet and Tailwind config. Full setup: **https://ngblatui.remix-it.com/docs/installation**.

## Usage

Import the component class from the `ng-blatui` barrel and add it to a standalone component's `imports[]` — no NgModule. Selectors are prefixed **`bui`**.

```ts
import { Component } from '@angular/core';
import { BuiButton, BuiBadge, BuiInput } from 'ng-blatui';

@Component({
  selector: 'app-demo',
  imports: [BuiButton, BuiBadge, BuiInput],
  template: `
    <label>
      Email
      <input buiInput type="email" placeholder="you@example.com" />
    </label>
    <button buiButton>Save <span buiBadge tone="success">New</span></button>
  `,
})
export class Demo {}
```

- **Element selectors**: `<bui-avatar>`, `<bui-rating>`, …
- **Attribute/directive selectors**: `<button buiButton>`, `<input buiInput>`, `<span buiBadge tone="success">`, …
- **Signals**: bind `[checked]` / `(checkedChange)` etc.; works under zoneless CD and SSR with no extra setup.
- **Forms**: `formControlName`, `[(ngModel)]` or `[formControl]` all work — every control is a `ControlValueAccessor`.

## Theming

Styling is Tailwind v4 + CSS variables. Override the oklch design tokens (`--background`, `--foreground`, `--primary`, `--border`, `--muted`, `--radius`, …) to restyle everything globally; toggle a `dark` class for dark mode. See **https://ngblatui.remix-it.com/docs/theming**.

## What's inside

| Category       | Count | Browse                                   |
| -------------- | ----- | ---------------------------------------- |
| **Components** | 155   | https://ngblatui.remix-it.com/components |
| **Blocks**     | 16    | https://ngblatui.remix-it.com/blocks     |
| **Charts**     | 70    | https://ngblatui.remix-it.com/charts     |
| **Templates**  | 34    | https://ngblatui.remix-it.com/templates  |

Templates are full, production-style pages (dashboard, pricing, auth, store, CRM, blog, docs, e-commerce product, plus 20 art-directed landing pages) — faithful 1:1 reproductions of the BlatUI originals.

## Using with AI agents

ng-blatui is built to be consumed by AI coding assistants so they discover and use the catalog correctly instead of guessing — via three layers:

| Layer             | What                                                        | Where                                       |
| ----------------- | ----------------------------------------------------------- | ------------------------------------------- |
| **MCP server**    | Tools to list/search the catalog and fetch full docs + code | `npx ng-blatui-mcp`                         |
| **llms.txt**      | The [llms.txt](https://llmstxt.org) standard index          | https://ngblatui.remix-it.com/llms.txt      |
| **registry.json** | Machine-readable catalog                                    | https://ngblatui.remix-it.com/registry.json |

Quick start (works in Claude, Cursor, Windsurf, Cline, Zed, VS Code…):

```bash
claude mcp add ng-blatui -- npx -y ng-blatui-mcp
# or add to any MCP client:
# { "mcpServers": { "ng-blatui": { "command": "npx", "args": ["-y", "ng-blatui-mcp"] } } }
```

The MCP server exposes `list_components` (optional `category`), `list_blocks`, `list_charts`, `list_templates`, `search({ query })` and `get_docs({ name })`. Full guide with per-client config and copy-paste editor rules: **[USING-WITH-AI.md](./USING-WITH-AI.md)**.

---

## Development

This is an Angular workspace with two projects: the library (`projects/ng-blatui`) and the docs/demo app (`projects/demo`).

```bash
git clone https://github.com/anousss007/ng-blatui.git
cd ng-blatui
npm install
npm start          # serve the docs/demo app at http://localhost:4200
```

### Scripts

| Command                    | What it does                                             |
| -------------------------- | -------------------------------------------------------- |
| `npm start`                | Serve the demo app (`ng serve demo`)                     |
| `npm run build:lib`        | Build the publishable library (`ng build ng-blatui`)     |
| `npm run build`            | Build the demo site                                      |
| `npm test`                 | Unit tests (Vitest)                                      |
| `npm run lint`             | ESLint (type-aware, strict) + template a11y              |
| `npm run format`           | Prettier (with Tailwind class sorting)                   |
| `npm run build:registry`   | Regenerate `registry.json` + `llms.txt` from the catalog |
| `npm run capture:previews` | Capture template preview images (Playwright)             |
| `npm run deploy:site`      | Build + deploy the docs site to the VPS                  |

### Project structure

```
projects/
  ng-blatui/        # the published library (src/lib/* = 157 component dirs, public-api.ts)
  demo/             # docs + live demo site (components/blocks/charts/templates galleries)
    src/app/pages/templates/   # the 34 page templates
    public/         # static assets incl. generated llms.txt + registry.json
scripts/
  build-registry.mjs   # generates registry.json + llms.txt + mcp/registry.json
  capture-previews.mjs # template preview screenshots
  deploy-site.sh       # build + rsync to VPS
mcp/                # the ng-blatui-mcp MCP server package (published separately)
.claude/skills/     # angular-best-practices (contributing) + ng-blatui (consuming)
AGENTS.md           # guide for AI agents working IN this repo
USING-WITH-AI.md    # guide for consuming ng-blatui WITH an AI agent
```

### Conventions

Angular **v22**, zoneless, standalone (defaults — never set explicitly). Signals everywhere; native control flow (`@if`/`@for`/`@switch`); no `*ngIf`/`ngClass`. Library selector prefix `bui`, demo prefix `app`. See **[AGENTS.md](./AGENTS.md)** and **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the full ruleset.

## Releasing

- **Library** (`ng-blatui`) — the **Release** GitHub Actions workflow (manual dispatch) runs `semantic-release`: it analyzes Conventional Commits, bumps the version, tags, creates a GitHub release and publishes to npm with provenance.
- **MCP server** (`ng-blatui-mcp`) — bump `mcp/package.json`, then run the **Release MCP** workflow (manual dispatch) to publish it.

## Credits

Angular port of [**BlatUI**](https://ngblatui.remix-it.com) (Blade/Laravel + Tailwind component system). Behavior on Angular Aria + CDK.

## License

[MIT](./LICENSE)

# Contributing to ng-blatui

Thanks for helping improve ng-blatui! This guide is the short version — the full machine-readable ruleset (used by humans and AI agents alike) lives in **[AGENTS.md](./AGENTS.md)**.

## Getting set up

```bash
git clone https://github.com/anousss007/ng-blatui.git
cd ng-blatui
npm install
npm start          # docs/demo app at http://localhost:4200
```

The workspace has two projects: the library (`projects/ng-blatui`) and the docs/demo site (`projects/demo`). See the project structure section in the [README](./README.md).

## House rules

- **Angular v22**, **zoneless**, **standalone** — these are defaults; never set them explicitly, and do **not** set `changeDetection: OnPush` (it's the v22 default).
- **Signals** everywhere: `input()` / `output()` / `model()` / `computed()`, and `inject()` over constructor DI.
- **Native control flow** (`@if` / `@for` with `track` / `@switch`) — no `*ngIf` / `*ngFor`, no `ngClass` / `ngStyle`.
- **Accessibility is non-negotiable**: build behavior on `@angular/aria` + `@angular/cdk`; must pass AXE / WCAG AA.
- **Selectors**: library prefix `bui`, demo prefix `app`.
- Use the official **`angular-cli` MCP server** (configured in `.mcp.json`) for version-specific questions — `get_best_practices`, `search_documentation`, `find_examples` — rather than guessing.

## Before you push

Everything must be green:

```bash
npm run lint      # ESLint: type-aware strict + template a11y
npm test          # Vitest
npm run format    # Prettier (Tailwind class sorting)
npm run build:lib # library builds clean
```

A husky pre-commit hook runs `eslint --fix` + Prettier on staged files, and a commit-msg hook enforces **[Conventional Commits](https://www.conventionalcommits.org)** (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`, …). The commit type drives the automated semantic-release version bump, so write meaningful messages.

## Catalog data

The AI artifacts (`registry.json`, `llms.txt`) are generated from the demo app's catalog. If you add or rename a component/block/chart/template, run:

```bash
npm run build:registry
```

(It also runs automatically during `npm run deploy:site`.)

## Releasing

Maintainers only, via manual GitHub Actions dispatch:

- **Release** → builds + lints + tests, then `semantic-release` publishes `ng-blatui` to npm and cuts a GitHub release.
- **Release MCP** → publishes the `ng-blatui-mcp` package (bump `mcp/package.json` first).

## License

By contributing, you agree your contributions are licensed under the [MIT License](./LICENSE).

# ng-blatui — agent guide

`ng-blatui` is an Angular UI library: a port of **BlatUI**'s visual system (components,
blocks, templates, oklch design tokens, theming) to Angular. Behavior is built on the
**official** Angular headless stack (Angular Aria + CDK); styling is Tailwind CSS v4 + BlatUI tokens.

## Use the official Angular tooling

- **MCP**: the `angular-cli` MCP server is configured in `.mcp.json`. Prefer its tools for
  anything Angular-version-specific: `get_best_practices`, `search_documentation`,
  `find_examples`, `list_projects`. Don't answer Angular questions from memory — query it.
- **Skill**: see `.claude/skills/angular-best-practices/SKILL.md` (the official v22 guide).

## Hard rules (this repo)

- Angular **v22**, **zoneless**, **standalone** (defaults — don't set them explicitly).
- **Do NOT** set `changeDetection: OnPush` explicitly — it's the v22 default.
- Signals everywhere: `input()` / `output()` / `model()` / `computed()`. Use `inject()`.
- Native control flow (`@if/@for/@switch`); no `*ngIf/*ngFor`, no `ngClass/ngStyle`.
- Accessibility: must pass AXE + WCAG AA. Build behavior on `@angular/aria` + `@angular/cdk`.
- Selectors: library prefix `bui`, demo app prefix `app`.
- Peer support floor: Angular **21**.

## Commands

| Task                      | Command                                |
| ------------------------- | -------------------------------------- |
| Build library             | `npm run build` (`ng build ng-blatui`) |
| Serve demo                | `npm start` (`ng serve demo`)          |
| Unit tests (Vitest)       | `npm test`                             |
| Lint (ESLint, type-aware) | `npm run lint`                         |
| Format (Prettier)         | `npm run format`                       |

## Quality gates

- ESLint flat config (`eslint.config.mjs`): typescript-eslint strict-type-checked +
  stylistic, angular-eslint + template accessibility, import-x, unicorn, sonarjs.
- Prettier (`.prettierrc`) with Tailwind class sorting.
- Pre-commit (husky + lint-staged) runs eslint --fix + prettier; commit-msg runs commitlint
  (Conventional Commits).

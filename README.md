# NgBlatui

Accessible Angular UI library (Angular 22 — standalone, signals, zoneless, SSR-ready) ported from BlatUI: **155 components, 16 blocks, 70 charts, 34 page templates**, themed with Tailwind CSS v4 + oklch tokens. Docs & live demo: **https://ngblatui.remix-it.com** · npm: `npm i ng-blatui`.

## Using with AI agents

ng-blatui is built to be consumed by AI coding assistants — an **MCP server**, an **`llms.txt`** index and a machine-readable **`registry.json`** let any agent discover and correctly use the catalog instead of guessing.

```bash
claude mcp add ng-blatui -- npx -y ng-blatui-mcp   # or add { "ng-blatui": { "command": "npx", "args": ["-y","ng-blatui-mcp"] } } to any MCP client
```

- MCP server: `npx ng-blatui-mcp` (tools: `list_components`, `search`, `get_docs`, …)
- llms.txt: https://ngblatui.remix-it.com/llms.txt
- registry.json: https://ngblatui.remix-it.com/registry.json
- Full guide (Cursor, Windsurf, Cline, Copilot, editor rules): [USING-WITH-AI.md](./USING-WITH-AI.md)

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

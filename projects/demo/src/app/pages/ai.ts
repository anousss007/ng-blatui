import { Component } from '@angular/core';

import { CodeBlock } from '../ui/code-block';

/** /docs/ai — how to use ng-blatui from AI coding assistants (MCP server, llms.txt, registry). */
@Component({
  selector: 'app-ai-docs',
  imports: [CodeBlock],
  template: `
    <article class="max-w-3xl space-y-10">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">AI &amp; MCP</h1>
        <p class="text-muted-foreground">
          ng-blatui is built to be consumed by AI coding assistants — Claude, Cursor, Windsurf,
          Cline, Zed, Copilot and more — so they discover and use the catalog correctly instead of
          guessing component names and props.
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">Three ways to plug in</h2>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong class="text-foreground">MCP server</strong> — <code>npx ng-blatui-mcp</code>:
            tools to list, search and fetch full docs + code for any item. Works in any MCP client.
          </li>
          <li>
            <strong class="text-foreground">llms.txt</strong> — the
            <a class="text-primary underline-offset-4 hover:underline" href="https://llmstxt.org"
              >llms.txt</a
            >
            standard index, auto-discovered by many tools:
            <a class="text-primary underline-offset-4 hover:underline" href="/llms.txt">/llms.txt</a
            >.
          </li>
          <li>
            <strong class="text-foreground">registry.json</strong> — a machine-readable catalog of
            every component, block, chart and template:
            <a class="text-primary underline-offset-4 hover:underline" href="/registry.json"
              >/registry.json</a
            >.
          </li>
        </ul>
        <p class="text-sm text-muted-foreground">
          Every docs page is server-prerendered, so an agent can also fetch
          <code>/components/&lt;slug&gt;</code> directly and read the live example, props and code
          as plain HTML.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">1. Add the MCP server</h2>
        <p class="text-sm text-muted-foreground">Claude Code, in one command:</p>
        <app-code [code]="claudeAdd" />
        <p class="text-sm text-muted-foreground">
          Or add this block to any MCP client config — Claude Desktop
          (<code>claude_desktop_config.json</code>), Cursor (<code>.cursor/mcp.json</code>),
          Windsurf (<code>mcp_config.json</code>), Cline, Zed, VS Code:
        </p>
        <app-code [code]="mcpConfig" />
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">2. Tools the server exposes</h2>
        <ul class="space-y-1.5 text-sm text-muted-foreground">
          <li>
            <code>list_components</code> — all components, optional <code>category</code> filter
          </li>
          <li><code>list_blocks</code> · <code>list_charts</code> · <code>list_templates</code></li>
          <li>
            <code>search({{ '{' }} query {{ '}' }})</code> — keyword search across the catalog
          </li>
          <li>
            <code>get_docs({{ '{' }} name {{ '}' }})</code> — full usage, props and copy-paste code
            for any slug
          </li>
        </ul>
        <p class="text-sm text-muted-foreground">
          It reads the live registry and falls back to a copy bundled in the package when offline.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl font-semibold">3. Editor rules (optional)</h2>
        <p class="text-sm text-muted-foreground">
          For tools that read a rules file, drop this into <code>.cursor/rules/ng-blatui.md</code>,
          <code>.windsurfrules</code>, <code>.github/copilot-instructions.md</code> or your
          <code>AGENTS.md</code>:
        </p>
        <app-code [code]="editorRules" />
      </section>

      <section class="space-y-2">
        <h2 class="text-xl font-semibold">More</h2>
        <p class="text-sm text-muted-foreground">
          Full per-client guide:
          <a
            class="text-primary underline-offset-4 hover:underline"
            href="https://github.com/anousss007/ng-blatui/blob/main/USING-WITH-AI.md"
            >USING-WITH-AI.md</a
          >. The MCP server is published as
          <a
            class="text-primary underline-offset-4 hover:underline"
            href="https://www.npmjs.com/package/ng-blatui-mcp"
            >ng-blatui-mcp</a
          >
          on npm.
        </p>
      </section>
    </article>
  `,
})
export class AiGuide {
  protected readonly claudeAdd = 'claude mcp add ng-blatui -- npx -y ng-blatui-mcp';

  protected readonly mcpConfig = `{
  "mcpServers": {
    "ng-blatui": {
      "command": "npx",
      "args": ["-y", "ng-blatui-mcp"]
    }
  }
}`;

  protected readonly editorRules = `# ng-blatui usage
- UI library: ng-blatui (Angular 22, standalone, signals, zoneless, SSR-safe). Install: npm i ng-blatui.
- Import component classes from the "ng-blatui" barrel into a standalone component's imports[] (no NgModule).
- Selectors are prefixed "bui": <bui-avatar>, <button buiButton>, <input buiInput>, <span buiBadge tone="success">.
- Inputs/outputs are signals; form controls implement ControlValueAccessor (Reactive/Template/Signal forms).
- Theme with Tailwind v4 + oklch CSS tokens (--primary, --background, --border, --radius).
- Don't guess names/props: use the ng-blatui MCP server (get_docs), /registry.json, or /components/<slug>.`;
}

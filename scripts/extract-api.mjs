// Extracts per-component API metadata for ng-blatui from the single source of truth:
// the built type declarations (dist/ng-blatui/types/ng-blatui.d.ts — resolved types + JSDoc +
// the ɵcmp/ɵdir input/output alias maps) plus a light pass over component source for input defaults.
// Uses the TypeScript type-checker so enum-like unions (e.g. button `variant`) are expanded to their
// actual values instead of opaque aliases.
//
// Emits:
//   projects/demo/src/app/generated/api.ts   — `export const API_DOCS = {…} as const` (the demo imports this)
//   projects/demo/public/api.json            — machine-readable copy (registry/MCP path)
//
// Run AFTER `npm run build:lib` so the .d.ts is current.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DTS = join(root, 'dist/ng-blatui/types/ng-blatui.d.ts');
const LIB = join(root, 'projects/ng-blatui/src/lib');

// The universal `class` input (aliased from `userClass`) is on nearly every directive — documented
// once globally in the docs, skipped from per-component tables to avoid noise.
const SKIP_INPUT_ALIASES = new Set(['class']);

const INPUT_WRAPPERS = new Set(['InputSignal', 'InputSignalWithTransform']);
const MODEL_WRAPPERS = new Set(['ModelSignal']);
const OUTPUT_WRAPPERS = new Set(['OutputEmitterRef', 'OutputRef', 'EventEmitter']);

const read = (p) => readFileSync(p, 'utf8');
const unquote = (s) => s.replace(/^["']|["']$/g, '');
const titleToPascal = (slug) =>
  slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

/**
 * Canonicalise a union of string literals into a stable, sorted order. TypeScript's
 * `.d.ts` emit (and the checker's `t.types`) order a union differently for incremental
 * vs clean builds, which made the generated docs flip between local and CI runs. Sorting
 * pure string-literal unions removes that non-determinism. Mixed unions (e.g. `T | null`)
 * are left untouched so their authored order is preserved.
 */
function sortUnion(text) {
  if (!text.includes(' | ')) return text;
  const parts = text.split(' | ');
  const isLiteral = (p) => /^(['"]).*\1$/.test(p.trim());
  const literals = parts.filter((p) => isLiteral(p));
  // Only canonicalise enum-like unions (≥2 string literals, e.g. a tone/size union,
  // possibly with a trailing `| null`). Sort the literals, then append any non-literal
  // members (null, type refs) in a stable order so the result never depends on the
  // .d.ts emit order. Plain `T | null` / `string | number` unions are left untouched.
  if (literals.length < 2) {
    return text;
  }
  const others = parts.filter((p) => !isLiteral(p));
  return [...literals.sort(), ...others.sort()].join(' | ');
}

/** Strip import-namespace prefixes (_angular_core., i0., import("…").) for readable type text. */
function cleanType(text) {
  return sortUnion(
    text
      .replace(/import\([^)]*\)\./g, '')
      .replace(/\b_angular_core\./g, '')
      .replace(/\bi\d+\./g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function wrapperName(typeNode) {
  if (!ts.isTypeReferenceNode(typeNode)) return null;
  return typeNode.typeName.getText().split('.').pop();
}

/** Leading JSDoc description text of a node (last block wins), or ''. */
function jsdoc(node) {
  const docs = node.jsDoc;
  if (!docs || !docs.length) return '';
  const c = docs[docs.length - 1].comment;
  if (!c) return '';
  return (typeof c === 'string' ? c : c.map((p) => p.text).join('')).trim();
}

const isStatic = (m) => (ts.getCombinedModifierFlags(m) & ts.ModifierFlags.Static) !== 0;
const isHidden = (m) =>
  (ts.getCombinedModifierFlags(m) & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected)) !== 0;

// ── TypeScript program + checker over the .d.ts (resolves cva/clsx/Angular types) ────────────────
const program = ts.createProgram([DTS], {
  skipLibCheck: true,
  strict: false,
  noEmit: true,
  target: ts.ScriptTarget.Latest,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  baseUrl: root,
});
const checker = program.getTypeChecker();
const dts = program.getSourceFile(DTS);

/** Render a type node to readable text, expanding enum-like unions to their literal values. */
function renderType(node) {
  if (!node) return '';
  let t;
  try {
    t = checker.getTypeFromTypeNode(node);
  } catch {
    return cleanType(node.getText());
  }
  if (t.isUnion && t.isUnion()) {
    const parts = [
      ...new Set(
        t.types
          .filter((x) => !(x.flags & ts.TypeFlags.Undefined))
          .map((x) => cleanType(checker.typeToString(x))),
      ),
    ];
    if (parts.length) return sortUnion(parts.join(' | '));
  }
  return cleanType(checker.typeToString(t, node, ts.TypeFormatFlags.NoTruncation));
}

/** Resolve a type-alias declaration to readable text (expanded union for enum-like aliases). */
function renderAlias(node) {
  const sym = checker.getSymbolAtLocation(node.name);
  const t = sym ? checker.getDeclaredTypeOfSymbol(sym) : null;
  if (t && t.isUnion && t.isUnion()) {
    const parts = [
      ...new Set(
        t.types
          .filter((x) => !(x.flags & ts.TypeFlags.Undefined))
          .map((x) => cleanType(checker.typeToString(x))),
      ),
    ];
    if (parts.length) return sortUnion(parts.join(' | '));
  }
  return cleanType(node.type.getText());
}

// ── slug list + source-derived defaults / class→slug ─────────────────────────────────────────────
const appSrc = read(join(root, 'projects/demo/src/app/app.ts'));
const compMatch = appSrc.match(/export const COMPONENTS\b[^=]*=\s*\[([\s\S]*?)\]/);
const SLUGS = compMatch ? [...compMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : [];

const slugOfClass = new Map();
const defaultsOfClass = new Map(); // class → { defaults:{prop:text|null}, required:Set }

function looksLikeOptions(obj) {
  const keys = obj.properties.map((p) => (p.name ? p.name.getText() : ''));
  return keys.length > 0 && keys.every((k) => ['alias', 'transform', 'debugName'].includes(k));
}

function collectSourceClass(node, slug) {
  if (!ts.isClassDeclaration(node) || !node.name) return;
  const cls = node.name.text;
  if (!cls.startsWith('Bui')) return;
  slugOfClass.set(cls, slug);
  const defaults = {};
  const required = new Set();
  for (const m of node.members) {
    if (!ts.isPropertyDeclaration(m) || !m.initializer || !ts.isCallExpression(m.initializer))
      continue;
    const prop = m.name.getText();
    const call = m.initializer;
    const callee = call.expression.getText();
    if (/\.required$/.test(callee)) {
      required.add(prop);
      continue;
    }
    if (!/^(input|model)$/.test(callee)) continue;
    const first = call.arguments[0];
    defaults[prop] =
      !first || (ts.isObjectLiteralExpression(first) && looksLikeOptions(first))
        ? null
        : first.getText().replace(/\s+/g, ' ');
  }
  defaultsOfClass.set(cls, { defaults, required });
}

for (const slug of SLUGS) {
  let files;
  try {
    files = readdirSync(join(LIB, slug)).filter(
      (f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'),
    );
  } catch {
    console.warn(`! no source dir for slug "${slug}"`);
    continue;
  }
  for (const f of files) {
    const sf = ts.createSourceFile(f, read(join(LIB, slug, f)), ts.ScriptTarget.Latest, true);
    sf.forEachChild((n) => collectSourceClass(n, slug));
  }
}

// ── parse the .d.ts: classes (members + ɵcmp/ɵdir maps) + interfaces/type-aliases ────────────────
const classes = new Map();
const typeDecls = new Map();

function parseInputMap(node) {
  const out = {};
  if (!node || !ts.isTypeLiteralNode(node)) return out;
  for (const member of node.members) {
    if (!ts.isPropertySignature(member) || !member.type) continue;
    const info = {};
    if (ts.isTypeLiteralNode(member.type)) {
      for (const sub of member.type.members) {
        if (ts.isPropertySignature(sub) && sub.type)
          info[unquote(sub.name.getText())] = unquote(sub.type.getText());
      }
    }
    out[unquote(member.name.getText())] = info;
  }
  return out;
}

function parseOutputMap(node) {
  const out = {};
  if (!node || !ts.isTypeLiteralNode(node)) return out;
  for (const member of node.members) {
    if (ts.isPropertySignature(member) && member.type)
      out[unquote(member.name.getText())] = unquote(member.type.getText());
  }
  return out;
}

dts.forEachChild((node) => {
  if (ts.isInterfaceDeclaration(node)) {
    const fields = node.members.filter(ts.isPropertySignature).map((m) => ({
      name: unquote(m.name.getText()),
      type: renderType(m.type),
      optional: !!m.questionToken,
      description: jsdoc(m),
    }));
    typeDecls.set(node.name.text, { kind: 'interface', description: jsdoc(node), fields });
    return;
  }
  if (ts.isTypeAliasDeclaration(node)) {
    typeDecls.set(node.name.text, {
      kind: 'type',
      description: jsdoc(node),
      definition: renderAlias(node),
    });
    return;
  }
  if (ts.isClassDeclaration(node) && node.name && node.name.text.startsWith('Bui')) {
    const members = [];
    let selector = '';
    let inputMeta = {};
    let outputMap = {};
    for (const m of node.members) {
      if (isStatic(m)) {
        if (ts.isPropertyDeclaration(m) && /^ɵ(cmp|dir)$/.test(m.name.getText()) && m.type) {
          const args = ts.isTypeReferenceNode(m.type) ? (m.type.typeArguments ?? []) : [];
          if (args[1]) selector = unquote(args[1].getText());
          inputMeta = parseInputMap(args[3]);
          outputMap = parseOutputMap(args[4]);
        }
        continue;
      }
      if (!ts.isPropertyDeclaration(m) || isHidden(m) || !m.type) continue;
      const prop = m.name.getText();
      if (prop.startsWith('ɵ')) continue;
      const wrapper = wrapperName(m.type);
      if (!wrapper) continue;
      const innerNode =
        ts.isTypeReferenceNode(m.type) && m.type.typeArguments ? m.type.typeArguments[0] : null;
      // `| undefined` (from `input<T>()` with no default) is noise — the "required" column says it.
      const typeRaw = innerNode
        ? cleanType(innerNode.getText())
            .replace(/\s*\|\s*undefined\b/g, '')
            .replace(/^undefined\s*\|\s*/, '')
            .trim()
        : '';
      members.push({ prop, wrapper, typeRaw, description: jsdoc(m) });
    }
    classes.set(node.name.text, { summary: jsdoc(node), selector, members, inputMeta, outputMap });
    return;
  }
});

// ── assemble per-slug API ────────────────────────────────────────────────────
const ANGULAR_BUILTINS = new Set([
  'TemplateRef',
  'ElementRef',
  'EventEmitter',
  'Signal',
  'WritableSignal',
  'InputSignal',
  'ModelSignal',
  'OutputEmitterRef',
  'Array',
  'Record',
  'Partial',
  'Map',
  'Set',
  'Date',
  'Promise',
  'NonNullable',
  'Readonly',
]);

function referencedTypeNames(typeText) {
  const ids = typeText.match(/[A-Za-z_]\w*/g) ?? [];
  return [...new Set(ids)].filter((id) => typeDecls.has(id) && !ANGULAR_BUILTINS.has(id));
}

const api = {};
let docCount = 0;

for (const slug of SLUGS) {
  const pascal = titleToPascal(slug);
  const clsNames = [...slugOfClass.entries()]
    .filter(([, s]) => s === slug)
    .map(([c]) => c)
    .filter((c) => classes.has(c))
    .sort((a, b) => {
      const score = (c) => {
        const sel = classes.get(c).selector;
        return sel.includes(`bui-${slug}`) || sel.includes(`bui${pascal}`) ? 0 : 1;
      };
      return score(a) - score(b) || a.localeCompare(b);
    });
  if (!clsNames.length) {
    console.warn(`! no exported Bui* class for slug "${slug}"`);
    continue;
  }

  const referenced = new Set();
  const components = [];

  for (const cls of clsNames) {
    const info = classes.get(cls);
    const src = defaultsOfClass.get(cls) ?? { defaults: {}, required: new Set() };
    const inputs = [];
    const models = [];
    const outputs = [];

    for (const mem of info.members) {
      const meta = info.inputMeta[mem.prop] ?? {};
      const alias = meta.alias ?? mem.prop;
      const required = meta.required === 'true' || src.required.has(mem.prop);
      const def = src.defaults[mem.prop] ?? null;
      // reference detection uses the raw (un-expanded) text so interfaces like TourStep are caught
      for (const t of referencedTypeNames(mem.typeRaw)) referenced.add(t);

      if (MODEL_WRAPPERS.has(mem.wrapper)) {
        models.push({ name: alias, type: mem.typeRaw, default: def, description: mem.description });
      } else if (INPUT_WRAPPERS.has(mem.wrapper)) {
        if (SKIP_INPUT_ALIASES.has(alias)) continue;
        inputs.push({
          name: alias,
          type: mem.typeRaw,
          default: def,
          required,
          description: mem.description,
        });
      } else if (OUTPUT_WRAPPERS.has(mem.wrapper)) {
        outputs.push({
          name: info.outputMap[mem.prop] ?? alias,
          type: mem.typeRaw,
          description: mem.description,
        });
      }
    }
    if (inputs.length || models.length || outputs.length) {
      components.push({ class: cls, selector: info.selector, inputs, models, outputs });
    }
  }

  // resolve referenced types one level deeper (interface fields / alias defs may reference more)
  const queue = [...referenced];
  while (queue.length) {
    const decl = typeDecls.get(queue.shift());
    if (!decl) continue;
    const inner =
      decl.kind === 'interface' ? decl.fields.map((f) => f.type).join(' ') : decl.definition;
    for (const r of referencedTypeNames(inner)) {
      if (!referenced.has(r)) {
        referenced.add(r);
        queue.push(r);
      }
    }
  }

  const types = [...referenced].sort().map((name) => ({ name, ...typeDecls.get(name) }));
  api[slug] = { summary: classes.get(clsNames[0]).summary, components, types };
  for (const c of components) docCount += c.inputs.length + c.models.length + c.outputs.length;
}

// ── write outputs ────────────────────────────────────────────────────────────
const json = JSON.stringify(api, null, 2);
mkdirSync(join(root, 'projects/demo/src/app/generated'), { recursive: true });
writeFileSync(
  join(root, 'projects/demo/src/app/generated/api.ts'),
  `// AUTO-GENERATED by scripts/extract-api.mjs — do not edit by hand.\n` +
    `// Run \`npm run extract:api\` after changing component inputs/outputs or their JSDoc.\n` +
    `export const API_DOCS = ${json} as const;\n`,
);
writeFileSync(join(root, 'projects/demo/public/api.json'), json + '\n');

console.log(
  `extract-api: ${Object.keys(api).length} components, ${docCount} documented members → generated/api.ts + public/api.json`,
);

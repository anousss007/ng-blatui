// Doc-completeness gate. Fails (exit 1) if any public input/model/output, or any field of a
// referenced interface/type, lacks a JSDoc description. Run after `extract:api` (the npm script
// chains them). Keeps the component API documentation from silently regressing.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const api = JSON.parse(readFileSync(join(root, 'projects/demo/public/api.json'), 'utf8'));

const missing = []; // { slug, where }
const blank = (s) => !s || !s.trim();

for (const [slug, entry] of Object.entries(api)) {
  for (const c of entry.components) {
    for (const i of c.inputs)
      if (blank(i.description)) missing.push({ slug, where: `input ${i.name}` });
    for (const m of c.models)
      if (blank(m.description)) missing.push({ slug, where: `model ${m.name}` });
    for (const o of c.outputs)
      if (blank(o.description)) missing.push({ slug, where: `output ${o.name}` });
  }
  for (const t of entry.types) {
    if (t.kind === 'interface') {
      for (const f of t.fields)
        if (blank(f.description)) missing.push({ slug, where: `${t.name}.${f.name}` });
    }
    // Type-alias (enum) descriptions are optional — the values are self-documenting.
  }
}

if (!missing.length) {
  const counts = Object.values(api).reduce(
    (n, e) =>
      n +
      e.components.reduce((m, c) => m + c.inputs.length + c.models.length + c.outputs.length, 0),
    0,
  );
  console.log(
    `check-api-docs: OK — every documented member has a description (${counts} members, ${Object.keys(api).length} components).`,
  );
  process.exit(0);
}

const bySlug = new Map();
for (const m of missing) {
  if (!bySlug.has(m.slug)) bySlug.set(m.slug, []);
  bySlug.get(m.slug).push(m.where);
}
console.error(
  `check-api-docs: ${missing.length} undocumented members across ${bySlug.size} components:\n`,
);
for (const [slug, list] of [...bySlug.entries()].sort()) {
  console.error(`  ${slug}:`);
  for (const w of list) console.error(`    - ${w}`);
}
console.error(`\nAdd a one-line JSDoc to each, then re-run \`npm run check:api-docs\`.`);
process.exit(1);

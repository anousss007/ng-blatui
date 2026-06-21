// @ts-check
import eslint from '@eslint/js';
import angular from 'angular-eslint';
import importX from 'eslint-plugin-import-x';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    name: 'ng-blatui/ignores',
    ignores: [
      'dist/**',
      'coverage/**',
      '.angular/**',
      'node_modules/**',
      'e2e/**',
      'playwright.config.ts',
      'playwright-report/**',
      'test-results/**',
    ],
  },

  // ── TypeScript: maximum, type-aware strictness ──────────────────────────────
  {
    name: 'ng-blatui/ts',
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      sonarjs.configs.recommended,
      unicorn.configs.recommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: { alwaysTryTypes: true },
        node: true,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      // Angular: component/directive classes are often empty but decorated
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      // Modern Angular discipline (OnPush is the v22 default — do NOT force it explicitly)
      // We deliberately alias an input to `class` (the variant-merge pattern) — allow renames.
      '@angular-eslint/no-input-rename': 'off',
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
      // Import hygiene
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-default-export': 'off',
      'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }],
      // Unicorn: keep the strong rules, drop the noisy/irrelevant ones
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/filename-case': ['error', { cases: { kebabCase: true } }],
      // These fire on idiomatic Angular (computed/effect arrows, member order) or
      // conflict with `noPropertyAccessFromIndexSignature` — keep the rest of unicorn.
      'unicorn/dom-node-dataset': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/consistent-class-member-order': 'off',
      'unicorn/prefer-scoped-selector': 'off',
      // Idiomatic Angular lazy routes: `async () => (await import('…')).X`.
      'unicorn/no-await-expression-member': 'off',
      // `parseFloat` is intentional for CSS unit strings (e.g. "16px"); Number() would be NaN.
      'unicorn/prefer-number-coercion': 'off',
    },
  },

  // ── Library selectors (prefix: bui) ─────────────────────────────────────────
  {
    name: 'ng-blatui/lib-selectors',
    files: ['projects/ng-blatui/**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'bui', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'bui', style: 'kebab-case' },
      ],
    },
  },

  // ── Native-control components (button[buiCheckbox], button[buiSwitch]) ───────
  {
    name: 'ng-blatui/native-control-selectors',
    files: [
      'projects/ng-blatui/src/lib/checkbox/**/*.ts',
      'projects/ng-blatui/src/lib/switch/**/*.ts',
      'projects/ng-blatui/src/lib/radio-group/**/*.ts',
      'projects/ng-blatui/src/lib/breadcrumb/**/*.ts',
      'projects/ng-blatui/src/lib/toggle/**/*.ts',
      'projects/ng-blatui/src/lib/copy-button/**/*.ts',
      'projects/ng-blatui/src/lib/timeline/timeline-item.ts',
      'projects/ng-blatui/src/lib/bottom-navigation/bottom-navigation-item.ts',
      'projects/ng-blatui/src/lib/toggle-group/toggle-group-item.ts',
      'projects/ng-blatui/src/lib/stepper/stepper-item.ts',
      'projects/ng-blatui/src/lib/org-chart/org-chart-node.ts',
    ],
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'attribute', prefix: 'bui', style: 'camelCase' },
      ],
    },
  },

  // ── Demo app selectors (prefix: app) ────────────────────────────────────────
  {
    name: 'ng-blatui/demo-selectors',
    files: ['projects/demo/**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },
  },

  // ── Tests: relax a few rules ────────────────────────────────────────────────
  {
    name: 'ng-blatui/tests',
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'unicorn/consistent-function-scoping': 'off',
    },
  },

  // ── HTML templates: Angular recommended + accessibility ─────────────────────
  {
    name: 'ng-blatui/templates',
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      // Composite widgets (listbox/menu options) centralise keyboard handling on the
      // container via aria-activedescendant; individual options are not focusable.
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
    },
  },

  // ── JS/MJS config files: disable type-aware rules ───────────────────────────
  {
    name: 'ng-blatui/js-config',
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // ── Prettier compatibility (MUST be last) ───────────────────────────────────
  prettier,
);

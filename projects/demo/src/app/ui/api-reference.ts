import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  BuiTable,
  BuiTableBody,
  BuiTableCell,
  BuiTableContainer,
  BuiTableHead,
  BuiTableHeader,
  BuiTableRow,
} from 'ng-blatui';

import { API_DOCS } from '../generated/api';

interface ApiMember {
  readonly name: string;
  readonly type: string;
  readonly default?: string | null;
  readonly required?: boolean;
  readonly description: string;
}
interface ApiComponent {
  readonly class: string;
  readonly selector: string;
  readonly inputs: readonly ApiMember[];
  readonly models: readonly ApiMember[];
  readonly outputs: readonly ApiMember[];
}
interface ApiTypeField {
  readonly name: string;
  readonly type: string;
  readonly optional: boolean;
  readonly description: string;
}
interface ApiType {
  readonly name: string;
  readonly kind: 'interface' | 'type';
  readonly description: string;
  readonly fields?: readonly ApiTypeField[];
  readonly definition?: string;
}
interface ApiEntry {
  readonly summary: string;
  readonly components: readonly ApiComponent[];
  readonly types: readonly ApiType[];
}

// Bridge the generated `as const` literal to a structural lookup (demo-only cast).
const ALL = API_DOCS as unknown as Record<string, ApiEntry>;

/**
 * Auto-generated API reference for a component slug: Inputs, two-way models, Outputs and the
 * interfaces/types they use. Data comes from `generated/api.ts` (extracted from the library's typed
 * source). Renders nothing when a slug has no documented members.
 */
@Component({
  selector: 'app-api-reference',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BuiTableContainer,
    BuiTable,
    BuiTableHeader,
    BuiTableBody,
    BuiTableRow,
    BuiTableHead,
    BuiTableCell,
  ],
  template: `
    @if (entry(); as e) {
      @for (c of e.components; track c.class) {
        @if (e.components.length > 1) {
          <h3 class="mt-8 mb-2 font-mono text-sm text-muted-foreground">{{ c.selector }}</h3>
        }

        @if (c.inputs.length) {
          <h3 class="mt-6 mb-2 text-base font-semibold">Inputs</h3>
          <div buiTableContainer variant="card">
            <table buiTable>
              <thead buiTableHeader>
                <tr buiTableRow>
                  <th buiTableHead>Prop</th>
                  <th buiTableHead>Type</th>
                  <th buiTableHead>Default</th>
                  <th buiTableHead class="w-2/5">Description</th>
                </tr>
              </thead>
              <tbody buiTableBody>
                @for (m of c.inputs; track m.name) {
                  <tr buiTableRow>
                    <td buiTableCell>
                      <code class="text-xs font-medium">{{ m.name }}</code>
                      @if (m.required) {
                        <span class="text-destructive" title="required">*</span>
                      }
                    </td>
                    <td buiTableCell>
                      <code class="text-xs text-muted-foreground">{{ m.type }}</code>
                    </td>
                    <td buiTableCell>
                      @if (m.default) {
                        <code class="text-xs">{{ m.default }}</code>
                      } @else {
                        <span class="text-muted-foreground">—</span>
                      }
                    </td>
                    <td buiTableCell class="whitespace-normal">{{ m.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (c.models.length) {
          <h3 class="mt-6 mb-2 text-base font-semibold">Two-way models</h3>
          <p class="mb-2 text-sm text-muted-foreground">
            Bind with <code class="text-xs">[(name)]</code>, or one-way as an input.
          </p>
          <div buiTableContainer variant="card">
            <table buiTable>
              <thead buiTableHeader>
                <tr buiTableRow>
                  <th buiTableHead>Prop</th>
                  <th buiTableHead>Type</th>
                  <th buiTableHead>Default</th>
                  <th buiTableHead class="w-2/5">Description</th>
                </tr>
              </thead>
              <tbody buiTableBody>
                @for (m of c.models; track m.name) {
                  <tr buiTableRow>
                    <td buiTableCell>
                      <code class="text-xs font-medium">{{ m.name }}</code>
                    </td>
                    <td buiTableCell>
                      <code class="text-xs text-muted-foreground">{{ m.type }}</code>
                    </td>
                    <td buiTableCell>
                      @if (m.default) {
                        <code class="text-xs">{{ m.default }}</code>
                      } @else {
                        <span class="text-muted-foreground">—</span>
                      }
                    </td>
                    <td buiTableCell class="whitespace-normal">{{ m.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (c.outputs.length) {
          <h3 class="mt-6 mb-2 text-base font-semibold">Outputs</h3>
          <div buiTableContainer variant="card">
            <table buiTable>
              <thead buiTableHeader>
                <tr buiTableRow>
                  <th buiTableHead>Event</th>
                  <th buiTableHead>Payload</th>
                  <th buiTableHead class="w-2/5">Description</th>
                </tr>
              </thead>
              <tbody buiTableBody>
                @for (m of c.outputs; track m.name) {
                  <tr buiTableRow>
                    <td buiTableCell>
                      <code class="text-xs font-medium">{{ m.name }}</code>
                    </td>
                    <td buiTableCell>
                      <code class="text-xs text-muted-foreground">{{ m.type }}</code>
                    </td>
                    <td buiTableCell class="whitespace-normal">{{ m.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }

      @if (e.types.length) {
        <h3 class="mt-8 mb-2 text-base font-semibold">Types</h3>
        @for (t of e.types; track t.name) {
          @if (t.kind === 'interface' && t.fields) {
            <p class="mt-4 mb-2">
              <code class="text-sm font-semibold">{{ t.name }}</code>
              @if (t.description) {
                <span class="text-sm text-muted-foreground"> — {{ t.description }}</span>
              }
            </p>
            <div buiTableContainer variant="card">
              <table buiTable>
                <thead buiTableHeader>
                  <tr buiTableRow>
                    <th buiTableHead>Field</th>
                    <th buiTableHead>Type</th>
                    <th buiTableHead class="w-2/5">Description</th>
                  </tr>
                </thead>
                <tbody buiTableBody>
                  @for (f of t.fields; track f.name) {
                    <tr buiTableRow>
                      <td buiTableCell>
                        <code class="text-xs font-medium">{{ f.name }}</code>
                        @if (f.optional) {
                          <span class="text-muted-foreground">?</span>
                        }
                      </td>
                      <td buiTableCell>
                        <code class="text-xs text-muted-foreground">{{ f.type }}</code>
                      </td>
                      <td buiTableCell class="whitespace-normal">{{ f.description }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="mt-4 mb-1">
              <code class="text-sm font-semibold">{{ t.name }}</code>
              @if (t.description) {
                <span class="text-sm text-muted-foreground"> — {{ t.description }}</span>
              }
            </p>
            <pre
              class="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs"
            ><code>{{ t.definition }}</code></pre>
          }
        }
      }

      <p class="mt-6 text-sm text-muted-foreground">
        Every ng-blatui component also accepts a <code class="text-xs">class</code> input to merge
        extra Tailwind classes onto the host.
      </p>
    }
  `,
})
export class ApiReference {
  readonly slug = input.required<string>();
  protected readonly entry = computed<ApiEntry | null>(() => ALL[this.slug()] ?? null);
}

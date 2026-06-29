import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Form Validation" page.
 * Validation Types card (two-column grid of labelled inputs), Validation Modes
 * Demo cards, a modes reference table, and a multi-section Registration Form
 * (Personal Information, Profile Details, Preferences). Reuses the shared
 * AdminCN app shell. Light mode, Geist font, responsive to mobile.
 */
@Component({
  selector: 'app-tpl-admincn-form-validation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-form-validation.html',
})
export class AdmincnFormValidation {}

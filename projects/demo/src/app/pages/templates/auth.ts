import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { Lucide } from './lucide';

/** Auth — "Nimbus" split-screen sign-in / create-account page. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthTemplate {
  protected readonly stats = [
    { value: '12k+', label: 'Teams' },
    { value: '99.99%', label: 'Uptime' },
    { value: '4.9/5', label: 'Rating' },
  ];
}

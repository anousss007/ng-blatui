import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiSwitch } from 'ng-blatui';

import { Lucide } from './lucide';

interface NoteToggle {
  title: string;
  desc: string;
  on: boolean;
}

/** Account — "Acme" settings page: settings nav + profile / account / notifications / security / danger-zone cards. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiSwitch, Lucide],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class AccountTemplate {
  protected readonly navItems = [
    { label: 'Profile', anchor: 'profile' },
    { label: 'Account', anchor: 'account' },
    { label: 'Notifications', anchor: 'notifications' },
    { label: 'Security', anchor: 'security' },
    { label: 'Danger zone', anchor: 'danger' },
  ];

  protected readonly languages = ['English', 'Français', 'Deutsch', '日本語'];
  protected readonly timezones = ['UTC', 'Europe/London', 'America/New_York', 'Asia/Tokyo'];

  protected readonly notes: NoteToggle[] = [
    { title: 'Product updates', desc: 'News about features and improvements.', on: true },
    { title: 'Security alerts', desc: 'Important notices about your account security.', on: true },
    { title: 'Weekly digest', desc: 'A summary of your workspace activity.', on: false },
    { title: 'Mentions', desc: 'When someone @mentions you in a comment.', on: true },
  ];
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar } from 'ng-blatui';

import { Lucide } from './lucide';

/** Startup — "Orbit" coming-soon launch page: hero + countdown + waitlist + feature teaser. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-startup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, Lucide],
  templateUrl: './startup.html',
  styleUrl: './startup.css',
})
export class StartupTemplate {
  protected readonly socials = ['twitter', 'github'];

  /** Static countdown to the Sept 2026 launch (JS ticker degrades to a fixed first-state). */
  protected readonly countdown = [
    { value: '70', label: 'Days' },
    { value: '18', label: 'Hours' },
    { value: '42', label: 'Mins' },
    { value: '33', label: 'Secs' },
  ];

  protected readonly waitAvatars = ['AK', 'MR', 'JL', 'SD', 'TV'];

  protected readonly features = [
    {
      icon: 'zap',
      title: 'Lightning fast',
      desc: 'Built on the edge so it feels instant, everywhere.',
    },
    {
      icon: 'lock',
      title: 'Private by default',
      desc: 'Your data is encrypted and never sold. Ever.',
    },
    {
      icon: 'sparkles',
      title: 'Delightfully simple',
      desc: "No manual needed. You'll know what to do.",
    },
  ];
}

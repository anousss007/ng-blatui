import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiCalendar, BuiRating, BuiSeparator, BuiSwitch } from 'ng-blatui';

import { Lucide } from './lucide';

interface Plan {
  name: string;
  price: number;
  tag: string;
  cta: string;
  highlight: boolean;
  color: string;
  features: string[];
}

/** Bloom — "Wellness, daily", a friendly claymorphic wellness app landing. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-bloom',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiCalendar, BuiRating, BuiSeparator, BuiSwitch, Lucide],
  templateUrl: './bloom.html',
  styleUrl: './bloom.css',
})
export class BloomTemplate {
  protected readonly yearly = signal(false);

  protected readonly nav = [
    { label: 'Features', href: '#features' },
    { label: 'Workouts', href: '#workouts' },
    { label: 'Habits', href: '#habits' },
    { label: 'Pricing', href: '#pricing' },
  ];

  protected readonly heroAvatars = ['av1', 'av2', 'av3', 'av4', 'av5'];

  protected readonly stats = [
    { v: '12k+', l: 'Active members' },
    { v: '4.9★', l: 'App Store rating' },
    { v: '50+', l: 'Workout types' },
    { v: '87%', l: 'Hit their goal' },
  ];

  protected readonly features = [
    {
      icon: 'flame',
      color: '#ffb4a2',
      bg: '#fff0ec',
      title: 'Smart Workouts',
      desc: 'AI-curated sessions that adapt to your energy, schedule and fitness level every single day.',
    },
    {
      icon: 'droplets',
      color: '#7ee0b0',
      bg: '#edfaf4',
      title: 'Hydration Tracking',
      desc: 'Log water intake with a single tap and let Bloom nudge you when you fall behind your goal.',
    },
    {
      icon: 'moon',
      color: '#a8d8ff',
      bg: '#eaf4ff',
      title: 'Sleep Insights',
      desc: 'Understand your rest patterns and get personalized tips to wake up genuinely refreshed.',
    },
    {
      icon: 'brain',
      color: '#c9b8ff',
      bg: '#f2eeff',
      title: 'Mindfulness & Calm',
      desc: 'Guided meditations, breathing sessions and gentle check-ins to keep stress in check.',
    },
    {
      icon: 'salad',
      color: '#ffd97d',
      bg: '#fffaeb',
      title: 'Nutrition Log',
      desc: 'Scan barcodes or search 1M+ foods. Macros and micros tracked without the spreadsheet chaos.',
    },
    {
      icon: 'heart-pulse',
      color: '#ffb4a2',
      bg: '#fff0ec',
      title: 'Heart-Rate Zones',
      desc: 'See exactly how hard you worked — and recover smarter with zone-based training guides.',
    },
  ];

  protected readonly todayActivity = [
    { label: 'Steps', color: '#7ee0b0', val: 72 },
    { label: 'Water', color: '#a8d8ff', val: 55 },
    { label: 'Sleep', color: '#c9b8ff', val: 88 },
    { label: 'Calories', color: '#ffd97d', val: 63 },
  ];
  protected readonly ringSummary = [
    { lbl: 'Steps', col: '#7ee0b0', pct: 72 },
    { lbl: 'Water', col: '#a8d8ff', pct: 55 },
    { lbl: 'Sleep', col: '#c9b8ff', pct: 88 },
  ];

  protected readonly workouts = [
    {
      label: 'Yoga Flow',
      tone: 'Calm',
      mins: 20,
      color: '#c9b8ff',
      img: 'https://picsum.photos/seed/yoga7/320/200',
    },
    {
      label: 'HIIT Cardio',
      tone: 'Intense',
      mins: 30,
      color: '#ffb4a2',
      img: 'https://picsum.photos/seed/hiit3/320/200',
    },
    {
      label: 'Morning Run',
      tone: 'Steady',
      mins: 40,
      color: '#7ee0b0',
      img: 'https://picsum.photos/seed/run11/320/200',
    },
    {
      label: 'Core Strength',
      tone: 'Power',
      mins: 25,
      color: '#a8d8ff',
      img: 'https://picsum.photos/seed/core5/320/200',
    },
    {
      label: 'Dance Cardio',
      tone: 'Fun',
      mins: 35,
      color: '#ffd97d',
      img: 'https://picsum.photos/seed/dance9/320/200',
    },
    {
      label: 'Pilates',
      tone: 'Balance',
      mins: 45,
      color: '#7ee0b0',
      img: 'https://picsum.photos/seed/pilates2/320/200',
    },
  ];
  protected readonly workoutTabs = ['All', 'Cardio', 'Strength'];

  protected readonly habits = [
    { label: 'Morning Meditation', icon: 'brain', checked: true, color: '#c9b8ff' },
    { label: 'Drink 8 Glasses', icon: 'droplets', checked: true, color: '#7ee0b0' },
    { label: 'Evening Walk', icon: 'footprints', checked: false, color: '#a8d8ff' },
    { label: 'No Screens at 10PM', icon: 'moon', checked: false, color: '#ffb4a2' },
  ];

  protected readonly steps = [
    {
      title: 'Download & sign up',
      desc: 'Create your free account in under 60 seconds — no credit card required.',
      icon: 'smartphone',
    },
    {
      title: 'Set your goals',
      desc: "Tell Bloom what you're working toward and it builds a personalized starting plan.",
      icon: 'target',
    },
    {
      title: 'Build daily habits',
      desc: 'Check in every day, track your streaks and earn badges as you hit milestones.',
      icon: 'calendar-check',
    },
    {
      title: 'Watch yourself bloom',
      desc: "Your weekly review shows exactly how far you've come — and what to focus on next.",
      icon: 'trending-up',
    },
  ];

  protected readonly testimonials = [
    {
      q: 'Bloom turned my chaotic mornings into something I actually look forward to. The habit streaks are weirdly addictive!',
      a: 'Mia Torres',
      r: 'Yoga instructor',
      seed: 'mia22',
      rating: 5,
    },
    {
      q: 'I dropped 8 kg in 3 months without ever feeling like I was on a diet. The nutrition log is genuinely effortless.',
      a: 'James Park',
      r: 'Software dev',
      seed: 'james4',
      rating: 5,
    },
    {
      q: 'The sleep insights alone are worth it. I had no idea my 11 PM screen time was wrecking my deep sleep.',
      a: 'Lena Schmidt',
      r: 'Nurse, Berlin',
      seed: 'lena8',
      rating: 5,
    },
    {
      q: 'My therapist recommended Bloom for the mindfulness section. Two months in and my anxiety scores are actually lower.',
      a: 'Aarav Mehta',
      r: 'Student, Mumbai',
      seed: 'aarav5',
      rating: 5,
    },
  ];

  protected readonly plans: Plan[] = [
    {
      name: 'Free',
      price: 0,
      tag: 'Get started today',
      cta: 'Download free',
      highlight: false,
      color: '#7ee0b0',
      features: [
        'All core habit tracking',
        'Workout library (50+)',
        'Basic sleep report',
        'Community challenges',
      ],
    },
    {
      name: 'Premium',
      price: 9,
      tag: 'Most popular',
      cta: 'Start free trial',
      highlight: true,
      color: '#c9b8ff',
      features: [
        'Everything in Free',
        'AI personal coach',
        'Unlimited custom plans',
        'Advanced analytics',
        'Priority support',
      ],
    },
    {
      name: 'Family',
      price: 15,
      tag: 'Up to 6 members',
      cta: 'Get Family plan',
      highlight: false,
      color: '#a8d8ff',
      features: [
        'Everything in Premium',
        'Shared family dashboard',
        '6 member accounts',
        "Kids' activity mode",
      ],
    },
  ];

  protected readonly faqs = [
    {
      q: 'Is Bloom free to download?',
      a: 'Yes — Bloom is free with all core tracking features. Bloom Premium unlocks AI coaching, advanced insights and unlimited plans.',
    },
    {
      q: 'Does Bloom sync with Apple Watch or Garmin?',
      a: 'Absolutely. We sync with Apple Health, Google Fit, Garmin Connect and Fitbit so all your data lives in one place.',
    },
    {
      q: 'Can I cancel Premium anytime?',
      a: 'Yes, cancel with one tap from your profile. No calls, no emails — and you keep Premium until the end of your billing period.',
    },
    {
      q: 'Is my health data private?',
      a: 'Your data is encrypted at rest and in transit, stored on HIPAA-compliant infrastructure, and never sold to third parties.',
    },
    {
      q: 'How does the AI coach personalize my plan?',
      a: 'It analyzes your past activity, sleep quality, mood logs and goals to build a realistic, progressive plan that adapts each week.',
    },
  ];

  protected readonly footer = [
    { heading: 'Product', links: ['Features', 'Workouts', 'Nutrition', 'Sleep', 'Premium'] },
    { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
    { heading: 'Support', links: ['Help Center', 'Privacy', 'Terms', 'Status', 'API'] },
  ];

  protected readonly social = ['instagram', 'twitter', 'youtube', 'github'];

  protected annual(price: number): number {
    return Math.round(price * 0.75);
  }
  protected ringCirc(r: number): number {
    return Math.round(2 * Math.PI * r * 10) / 10;
  }
  protected ringOffset(r: number, pct: number): number {
    return Math.round(2 * Math.PI * r * (1 - pct / 100) * 10) / 10;
  }
}

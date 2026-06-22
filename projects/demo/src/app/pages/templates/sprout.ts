import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiRating, BuiSwitch } from 'ng-blatui';

import { Lucide } from './lucide';

interface Course {
  title: string;
  img: string;
  subject: string;
  lessons: number;
  color: string;
}
interface CourseGroup {
  key: string;
  label: string;
  range: string;
  items: Course[];
}
interface Plan {
  name: string;
  monthly: number;
  annual: number;
  badge: string | null;
  highlight: boolean;
  cta: string;
  features: string[];
}

/** Sprout — joyful kids' learning platform, playful Fredoka + offset-shadow stickers. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-sprout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiRating, BuiSwitch, Lucide],
  templateUrl: './sprout.html',
  styleUrl: './sprout.css',
})
export class SproutTemplate {
  protected readonly yearly = signal(false);

  protected readonly navLinks = [
    { label: 'Subjects', href: '#subjects' },
    { label: 'Courses', href: '#courses' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  protected readonly subjects = [
    {
      emoji: '🔢',
      label: 'Maths',
      color: '#3ab7ff',
      badge: 'Ages 4–12',
      desc: 'Numbers, shapes, puzzles & logic games that build real skills.',
      lessons: 42,
      shadow: 'sp-card-sky',
    },
    {
      emoji: '🔬',
      label: 'Science',
      color: '#5ec26a',
      badge: 'Ages 6–14',
      desc: 'Experiments, animals, space and the world around us.',
      lessons: 38,
      shadow: 'sp-card-sunny',
    },
    {
      emoji: '📖',
      label: 'Reading',
      color: '#ffd23f',
      badge: 'Ages 3–10',
      desc: 'Phonics, stories and comprehension for young readers.',
      lessons: 55,
      shadow: 'sp-card-grass',
    },
    {
      emoji: '🌍',
      label: 'Geography',
      color: '#ff6b6b',
      badge: 'Ages 7–14',
      desc: 'Countries, maps, cultures and amazing places on Earth.',
      lessons: 29,
      shadow: 'sp-card-coral',
    },
    {
      emoji: '🎨',
      label: 'Art & Music',
      color: '#9b5de5',
      badge: 'Ages 4–16',
      desc: 'Drawing, painting, rhythm and creative expression.',
      lessons: 33,
      shadow: 'sp-card-grape',
    },
    {
      emoji: '💻',
      label: 'Coding',
      color: '#3ab7ff',
      badge: 'Ages 8–16',
      desc: 'Block coding, logic and introductory programming projects.',
      lessons: 24,
      shadow: 'sp-card-sky',
    },
  ];

  protected readonly steps = [
    {
      num: 1,
      title: 'Pick your subjects',
      desc: "Choose from 6 core subjects and let Sprout tailor the learning path for your child's age and level.",
      color: '#3ab7ff',
    },
    {
      num: 2,
      title: 'Learn at your pace',
      desc: 'Short, joyful lessons fit around any schedule — 10 minutes a day is all it takes to keep the streak alive!',
      color: '#5ec26a',
    },
    {
      num: 3,
      title: 'Earn stars & badges',
      desc: 'Every completed lesson earns stars. Collect enough to unlock badges and level up your learner profile.',
      color: '#ffd23f',
    },
    {
      num: 4,
      title: 'Celebrate progress',
      desc: 'Parents get a weekly digest. Kids see confetti. Everyone wins when learning becomes a daily joy.',
      color: '#ff6b6b',
    },
  ];

  protected readonly achievements = [
    { label: 'Maths Wizard', icon: '🏅', progress: 72, color: '#3ab7ff', earned: false },
    { label: 'Bookworm', icon: '📚', progress: 100, color: '#5ec26a', earned: true },
    { label: 'Science Star', icon: '⭐', progress: 45, color: '#ffd23f', earned: false },
    { label: '7-Day Streak', icon: '🔥', progress: 100, color: '#ff6b6b', earned: true },
    { label: 'Code Explorer', icon: '💻', progress: 20, color: '#9b5de5', earned: false },
    { label: 'World Traveller', icon: '🌍', progress: 60, color: '#3ab7ff', earned: false },
  ];

  protected readonly xpRow = [
    { ico: '🔥', val: '14-day streak', sub: "You're on fire!", col: '#ff6b6b' },
    { ico: '⭐', val: '320 stars earned', sub: 'Keep collecting!', col: '#ffd23f' },
    { ico: '🏆', val: '3 badges unlocked', sub: '2 more to discover', col: '#9b5de5' },
  ];

  protected readonly courseShadows = ['sp-card-sky', 'sp-card-sunny', 'sp-card-grape'];
  protected readonly courses: CourseGroup[] = [
    {
      key: 'tiny',
      label: 'Tiny Sprouts',
      range: 'Ages 3–5',
      items: [
        {
          title: 'First Numbers',
          img: 'https://picsum.photos/seed/tiny1/400/240',
          subject: 'Maths',
          lessons: 8,
          color: '#3ab7ff',
        },
        {
          title: 'ABC Adventure',
          img: 'https://picsum.photos/seed/tiny2/400/240',
          subject: 'Reading',
          lessons: 10,
          color: '#ffd23f',
        },
        {
          title: 'Colour Magic',
          img: 'https://picsum.photos/seed/tiny3/400/240',
          subject: 'Art',
          lessons: 6,
          color: '#9b5de5',
        },
      ],
    },
    {
      key: 'junior',
      label: 'Junior Learners',
      range: 'Ages 6–9',
      items: [
        {
          title: 'Times Tables Quest',
          img: 'https://picsum.photos/seed/jr1/400/240',
          subject: 'Maths',
          lessons: 12,
          color: '#3ab7ff',
        },
        {
          title: 'Animal Kingdom',
          img: 'https://picsum.photos/seed/jr2/400/240',
          subject: 'Science',
          lessons: 9,
          color: '#5ec26a',
        },
        {
          title: 'Story Builder',
          img: 'https://picsum.photos/seed/jr3/400/240',
          subject: 'Reading',
          lessons: 11,
          color: '#ffd23f',
        },
      ],
    },
    {
      key: 'explorer',
      label: 'Explorers',
      range: 'Ages 10–14',
      items: [
        {
          title: 'Space Explorers',
          img: 'https://picsum.photos/seed/exp1/400/240',
          subject: 'Science',
          lessons: 14,
          color: '#5ec26a',
        },
        {
          title: 'Geometry Galaxy',
          img: 'https://picsum.photos/seed/exp2/400/240',
          subject: 'Maths',
          lessons: 10,
          color: '#3ab7ff',
        },
        {
          title: 'Scratch Coding',
          img: 'https://picsum.photos/seed/exp3/400/240',
          subject: 'Coding',
          lessons: 12,
          color: '#9b5de5',
        },
      ],
    },
  ];

  protected readonly schedule = [
    { day: 'Mon', subject: 'Maths', time: '4:00 PM', color: '#3ab7ff', emoji: '🔢' },
    { day: 'Tue', subject: 'Reading', time: '4:00 PM', color: '#ffd23f', emoji: '📖' },
    { day: 'Wed', subject: 'Science', time: '3:30 PM', color: '#5ec26a', emoji: '🔬' },
    { day: 'Thu', subject: 'Art', time: '4:00 PM', color: '#9b5de5', emoji: '🎨' },
    { day: 'Fri', subject: 'Coding', time: '3:00 PM', color: '#3ab7ff', emoji: '💻' },
    { day: 'Sat', subject: 'Geography', time: '10:00 AM', color: '#ff6b6b', emoji: '🌍' },
    { day: 'Sun', subject: 'Free Play', time: 'Any time', color: '#ffd23f', emoji: '🎉' },
  ];

  protected readonly testimonials = [
    {
      q: "My 7-year-old asks to do his Sprout lessons before dinner. I never thought I'd say that! The gamification keeps him going every single day.",
      name: 'Emily Johnson',
      role: 'Mum of Theo, 7',
      img: 'https://picsum.photos/seed/parent1/160/160',
      stars: 5,
    },
    {
      q: 'We have three kids at different ages and Sprout handles all of them perfectly. The weekly parent report is worth the subscription alone.',
      name: 'Carlos & Mia Ruiz',
      role: 'Parents of 3',
      img: 'https://picsum.photos/seed/parent2/160/160',
      stars: 5,
    },
    {
      q: 'Finally — an app that my daughter finds genuinely fun AND that actually teaches her something. The reading lessons went from struggle to joy.',
      name: 'Priya Sharma',
      role: 'Mum of Ananya, 9',
      img: 'https://picsum.photos/seed/parent3/160/160',
      stars: 5,
    },
    {
      q: 'As a teacher I recommend Sprout to parents constantly. The curriculum alignment is solid and the UI makes kids feel safe to fail and try again.',
      name: 'Mr. David Osei',
      role: 'Primary School Teacher',
      img: 'https://picsum.photos/seed/parent4/160/160',
      stars: 5,
    },
  ];

  protected readonly planShadows = ['sp-card-sky', 'sp-card-sunny', 'sp-card-grape'];
  protected readonly plans: Plan[] = [
    {
      name: 'Seedling',
      monthly: 0,
      annual: 0,
      badge: null,
      highlight: false,
      cta: 'Start free',
      features: [
        '1 learner profile',
        '3 subjects',
        '20 lessons/month',
        'Progress tracking',
        'Badges & stars',
      ],
    },
    {
      name: 'Sprout',
      monthly: 9,
      annual: 7,
      badge: 'Most popular',
      highlight: true,
      cta: 'Start 14-day trial',
      features: [
        'Up to 3 learner profiles',
        'All 6 subjects',
        'Unlimited lessons',
        'Weekly parent digest',
        'Priority support',
        'Offline mode',
      ],
    },
    {
      name: 'Family Tree',
      monthly: 15,
      annual: 12,
      badge: 'Best value',
      highlight: false,
      cta: 'Get Family Tree',
      features: [
        'Up to 6 learner profiles',
        'All subjects + early access',
        'Unlimited lessons',
        'Advanced analytics',
        'Dedicated family coach',
        'Ad-free forever',
      ],
    },
  ];

  protected readonly faqs = [
    {
      q: 'What age range is Sprout designed for?',
      a: "Sprout is designed for children aged 3 to 14. Lessons are automatically adapted to your child's age and assessed skill level, so siblings at different stages can all use the same account.",
    },
    {
      q: 'Do lessons align with school curriculums?',
      a: 'Yes. Our content team maps every lesson to major English-speaking curricula (UK National Curriculum, US Common Core, Australian AC) and we update the library every term.',
    },
    {
      q: 'Can I try before I subscribe?',
      a: 'Absolutely — the Seedling plan is free forever. The Sprout plan includes a full 14-day trial with no credit card required.',
    },
    {
      q: 'How long are the lessons?',
      a: 'Core lessons are 10–15 minutes. Practice mini-games run 3–5 minutes. Everything is designed to fit school-night schedules.',
    },
    {
      q: 'Is there a mobile app?',
      a: 'Yes! Sprout is available on iOS and Android, fully synced with the web. Offline mode (Sprout & Family Tree plans) lets kids learn on car journeys.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes, cancel any time from your account settings — no phone calls, no friction. Annual subscribers receive a prorated refund for unused months.',
    },
  ];

  protected readonly footerLinks = [
    {
      heading: 'Learn',
      links: ['Subjects', 'Courses', 'Lesson Library', 'Age Guides', 'For Schools'],
    },
    {
      heading: 'Parents',
      links: ['Parent Dashboard', 'Weekly Reports', 'Family Plans', 'Blog', 'Community'],
    },
    { heading: 'Company', links: ['About Us', 'Careers', 'Press Kit', 'Contact'] },
    { heading: 'Legal', links: ['Privacy', 'Terms', 'COPPA & GDPR', 'Cookies'] },
  ];
  protected readonly socials = ['twitter', 'instagram', 'youtube', 'facebook'];

  protected readonly parentAvatars = [
    'https://picsum.photos/seed/av1/80/80',
    'https://picsum.photos/seed/av2/80/80',
    'https://picsum.photos/seed/av3/80/80',
    'https://picsum.photos/seed/av4/80/80',
    'https://picsum.photos/seed/av5/80/80',
  ];

  protected readonly confetti = ['#3ab7ff', '#ffd23f', '#5ec26a', '#ff6b6b', '#9b5de5'];
}

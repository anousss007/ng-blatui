import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar } from 'ng-blatui';

import { Lucide } from './lucide';

type Tone = 'primary' | 'info' | 'warning';

interface Post {
  cat: string;
  tone: Tone;
  title: string;
  author: string;
  init: string;
  date: string;
  read: string;
  id: string;
}

/** Blog — "The Dispatch" editorial blog: featured post + latest grid + newsletter. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-blog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, Lucide],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class BlogTemplate {
  protected readonly nav = ['Latest', 'Design', 'Engineering', 'Culture', 'Newsletter'];

  protected readonly featured = {
    cat: 'Engineering',
    tone: 'primary' as Tone,
    title: 'How we cut our build times by 70% with a smarter cache',
    excerpt:
      'A deep dive into the content-addressable pipeline we built, the dead ends we hit, and the three changes that actually moved the needle.',
    author: 'Marcus Chen',
    init: 'MC',
    date: 'Jun 8, 2026',
    read: '8 min',
    id: '1517180102446-f3ece451e9d8',
  };

  protected readonly posts: Post[] = [
    {
      cat: 'Design',
      tone: 'info',
      title: 'Designing for dark mode without doubling your work',
      author: 'Sofia Davis',
      init: 'SD',
      date: 'Jun 7',
      read: '6 min',
      id: '1498050108023-c5249f4df085',
    },
    {
      cat: 'Engineering',
      tone: 'primary',
      title: 'A pragmatic guide to feature flags at scale',
      author: 'Priya Nair',
      init: 'PN',
      date: 'Jun 6',
      read: '9 min',
      id: '1526374965328-7f61d4dc18c5',
    },
    {
      cat: 'Culture',
      tone: 'warning',
      title: 'What async-first actually looks like day to day',
      author: 'Jackson Lee',
      init: 'JL',
      date: 'Jun 5',
      read: '5 min',
      id: '1517694712202-14dd9538aa97',
    },
    {
      cat: 'Design',
      tone: 'info',
      title: 'The case for boring, predictable components',
      author: 'Ada Lovelace',
      init: 'AL',
      date: 'Jun 4',
      read: '7 min',
      id: '1555066931-4365d14bab8c',
    },
    {
      cat: 'Engineering',
      tone: 'primary',
      title: 'Shipping a design system your team will use',
      author: 'William Kim',
      init: 'WK',
      date: 'Jun 3',
      read: '10 min',
      id: '1518770660439-4636190af475',
    },
    {
      cat: 'Culture',
      tone: 'warning',
      title: 'Writing changelogs people actually read',
      author: 'Olivia Martin',
      init: 'OM',
      date: 'Jun 2',
      read: '4 min',
      id: '1551288049-bebda4e38f71',
    },
  ];

  protected readonly socials = ['twitter', 'github', 'rss'];

  protected img(id: string, w = 800): string {
    return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
  }
}

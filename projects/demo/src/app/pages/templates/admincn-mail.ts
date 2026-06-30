import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import {
  BuiAvatar,
  BuiBadge,
  BuiButton,
  BuiCard,
  BuiInputGroup,
  BuiInputGroupAddon,
  BuiInputGroupInput,
} from 'ng-blatui';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface Mailbox {
  label: string;
  icon: string;
  count?: number;
}
interface MailLabel {
  label: string;
  dot: string; // tailwind bg-*-500 color class
  count?: number;
}
interface Email {
  id: number;
  folder: string;
  sender: string;
  email: string;
  time: string;
  subject: string;
  thread?: number; // number shown in parentheses after subject
  preview: string;
  body: string[]; // reading-pane paragraphs for this email
  avatar?: string; // image src; falls back to initials when absent
  initials?: string;
  dot: string; // unread indicator color (tailwind bg-*-500)
  starred: boolean;
  unread: boolean;
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Mail" app page.
 * Full email client: compose button + mailbox/label sidebar + message list
 * + reading pane. Collapses the reading pane on tablet, then the sidebar on
 * mobile, matching the reference. Reuses the AdminCN shell + acn-* primitives.
 *
 * Wired with signals: folder switching, all/unread tabs, search, star toggle
 * and per-row selection that opens the reading pane and marks the mail read.
 */
@Component({
  selector: 'app-tpl-admincn-mail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    Lucide,
    AdmincnShell,
    BuiButton,
    BuiBadge,
    BuiAvatar,
    BuiCard,
    BuiInputGroup,
    BuiInputGroupAddon,
    BuiInputGroupInput,
  ],
  templateUrl: './admincn-mail.html',
})
export class AdmincnMail {
  protected readonly img = '/admincn';

  protected readonly mailboxes: Mailbox[] = [
    { label: 'Inbox', icon: 'mail', count: 10 },
    { label: 'Drafts', icon: 'file-text', count: 1 },
    { label: 'Sent', icon: 'send', count: 2 },
    { label: 'Spam', icon: 'triangle-alert', count: 2 },
    { label: 'Trash', icon: 'trash-2', count: 1 },
    { label: 'Archive', icon: 'package', count: 2 },
  ];

  protected readonly labels: MailLabel[] = [
    { label: 'Social', dot: 'bg-violet-500', count: 3 },
    { label: 'Updates', dot: 'bg-teal-500', count: 4 },
    { label: 'Forums', dot: 'bg-orange-500', count: 2 },
    { label: 'Shopping', dot: 'bg-lime-500', count: 1 },
    { label: 'Promotions', dot: 'bg-pink-500', count: 1 },
  ];

  /** Reactive mail store — selection/read/star toggles update these signals. */
  protected readonly emails = signal<Email[]>([
    {
      id: 1,
      folder: 'Inbox',
      sender: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      time: '2 hours ago',
      subject: 'Q4 Marketing Campaign Review',
      thread: 4,
      preview: "Thanks for the feedback — I'll incorporate your suggestions into the Q1 plan.",
      body: [
        "Thanks for the feedback — I'll incorporate your suggestions into the Q1 plan.",
        "Let's sync on Monday to finalize the deck.",
        'Best,\nSarah',
      ],
      avatar: '/admincn/avatars/avatar-1.webp',
      dot: 'bg-teal-500',
      starred: false,
      unread: true,
    },
    {
      id: 2,
      folder: 'Inbox',
      sender: 'Michael Chen',
      email: 'michael.chen@example.com',
      time: '5 hours ago',
      subject: 'Project Timeline Update',
      preview: 'Hello, Just a quick update on the timeline for the new dashboard...',
      body: [
        'Hello,',
        'Just a quick update on the timeline for the new dashboard — engineering expects to ship the first milestone by the end of next week.',
        'I will share a revised Gantt chart once the estimates are locked.',
      ],
      avatar: '/admincn/avatars/avatar-2.webp',
      dot: 'bg-teal-500',
      starred: true,
      unread: true,
    },
    {
      id: 3,
      folder: 'Inbox',
      sender: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      time: 'Yesterday',
      subject: 'Re: Team Lunch Tomorrow',
      thread: 3,
      preview: 'Perfect — see you at 12:30 at the usual spot!',
      body: ['Perfect — see you at 12:30 at the usual spot!', 'I already booked the corner table.'],
      avatar: '/admincn/avatars/avatar-3.webp',
      dot: 'bg-violet-500',
      starred: false,
      unread: true,
    },
    {
      id: 4,
      folder: 'Inbox',
      sender: 'David Park',
      email: 'david.park@example.com',
      time: 'Yesterday',
      subject: 'Code Review Request',
      preview: 'Hi, Could you review my PR for the authentication module?',
      body: [
        'Hi,',
        'Could you review my PR for the authentication module when you get a chance? It touches the session refresh flow.',
        'No rush — sometime this week is fine.',
      ],
      initials: 'DP',
      dot: 'bg-orange-500',
      starred: false,
      unread: true,
    },
    {
      id: 5,
      folder: 'Inbox',
      sender: 'Jessica Martinez',
      email: 'jessica.martinez@example.com',
      time: 'Jun 26',
      subject: 'Budget Approval Request',
      preview: 'Hi, I need approval for the additional budget for Q1 marketing...',
      body: [
        'Hi,',
        'I need approval for the additional budget for Q1 marketing. The proposal adds $12k for paid social.',
        'Happy to walk you through the numbers on a quick call.',
      ],
      initials: 'JM',
      dot: 'bg-teal-500',
      starred: true,
      unread: true,
    },
    {
      id: 6,
      folder: 'Inbox',
      sender: 'Rachel Green',
      email: 'rachel.green@example.com',
      time: 'Jun 22',
      subject: 'Team Building Event',
      preview: 'Excited to announce our upcoming team building event!',
      body: [
        'Excited to announce our upcoming team building event!',
        "We're heading to the lake house on the 15th — expect kayaking, a barbecue and a bonfire.",
        'RSVP by Friday so we can finalize numbers.',
      ],
      avatar: '/admincn/avatars/avatar-4.webp',
      dot: 'bg-violet-500',
      starred: false,
      unread: true,
    },
    {
      id: 7,
      folder: 'Inbox',
      sender: 'Amazon Deals',
      email: 'deals@amazon.com',
      time: '6 hours ago',
      subject: 'Your cart is waiting — 15% off today only',
      preview: 'Items in your cart are on sale. Complete your purchase before midnight.',
      body: [
        'Items in your cart are on sale. Complete your purchase before midnight to lock in 15% off.',
        'This offer applies to eligible items only.',
      ],
      avatar: '/admincn/avatars/avatar-5.webp',
      dot: 'bg-lime-500',
      starred: false,
      unread: false,
    },
    {
      id: 8,
      folder: 'Inbox',
      sender: 'LinkedIn',
      email: 'notifications@linkedin.com',
      time: 'Yesterday',
      subject: '3 people viewed your profile this week',
      preview: "See who's been looking at your profile and grow your network.",
      body: [
        "See who's been looking at your profile and grow your network.",
        'Upgrade to Premium to see the full list of viewers.',
      ],
      initials: 'L',
      dot: 'bg-violet-500',
      starred: false,
      unread: false,
    },
    {
      id: 9,
      folder: 'Inbox',
      sender: 'Dev Community',
      email: 'digest@dev.to',
      time: 'Jun 26',
      subject: 'Weekly digest: Top posts in React & Next.js',
      preview: "This week's most popular discussions from the developer community.",
      body: [
        "This week's most popular discussions from the developer community.",
        'Highlights include server components, signals and edge rendering.',
      ],
      avatar: '/admincn/avatars/avatar-6.webp',
      dot: 'bg-orange-500',
      starred: false,
      unread: false,
    },
    {
      id: 10,
      folder: 'Inbox',
      sender: 'Flash Sale',
      email: 'sale@shopnow.com',
      time: 'Jun 27',
      subject: 'Summer sale: Up to 50% off sitewide',
      preview: "Don't miss our biggest sale of the season. Ends Sunday.",
      body: [
        "Don't miss our biggest sale of the season. Ends Sunday.",
        'Use code SUMMER50 at checkout for an extra discount.',
      ],
      initials: 'FS',
      dot: 'bg-pink-500',
      starred: false,
      unread: false,
    },
    {
      id: 11,
      folder: 'Sent',
      sender: 'Me',
      email: 'me@example.com',
      time: '1 hour ago',
      subject: 'Re: Q4 Marketing Campaign Review',
      preview: 'Sounds great — pushing the revised deck to the shared drive now.',
      body: [
        'Sounds great — pushing the revised deck to the shared drive now.',
        "I'll ping you once it's uploaded.",
      ],
      initials: 'ME',
      dot: 'bg-teal-500',
      starred: false,
      unread: false,
    },
    {
      id: 12,
      folder: 'Sent',
      sender: 'Me',
      email: 'me@example.com',
      time: 'Yesterday',
      subject: 'Invoice for May consulting',
      preview: 'Hi, please find the May invoice attached. Net 30 as usual.',
      body: ['Hi,', 'Please find the May invoice attached. Net 30 as usual.', 'Thanks!'],
      initials: 'ME',
      dot: 'bg-teal-500',
      starred: false,
      unread: false,
    },
    {
      id: 13,
      folder: 'Drafts',
      sender: 'Me',
      email: 'me@example.com',
      time: 'Just now',
      subject: 'Notes for next standup',
      preview: 'Blockers: waiting on design tokens. Wins: shipped the search filter...',
      body: [
        'Blockers: waiting on design tokens.',
        'Wins: shipped the search filter and trimmed the bundle by 40kb.',
      ],
      initials: 'ME',
      dot: 'bg-orange-500',
      starred: false,
      unread: false,
    },
  ]);

  protected readonly activeFolder = signal('Inbox');
  protected readonly activeTab = signal<'all' | 'unread'>('all');
  protected readonly searchQuery = signal('');
  protected readonly selectedId = signal<number | null>(1);
  protected readonly composeOpen = signal(false);

  /** Emails in the active folder, after the all/unread tab and search filter. */
  protected readonly visibleEmails = computed(() => {
    const folder = this.activeFolder();
    const isOnlyUnread = this.activeTab() === 'unread';
    const query = this.searchQuery().trim().toLowerCase();
    return this.emails().filter((mail) => {
      if (mail.folder !== folder) {
        return false;
      }
      if (isOnlyUnread && !mail.unread) {
        return false;
      }
      if (query.length > 0) {
        const haystack = `${mail.sender} ${mail.subject}`.toLowerCase();
        return haystack.includes(query);
      }
      return true;
    });
  });

  /** Unread count for the active folder (drives the "Unread (n)" tab label). */
  protected readonly unreadCount = computed(
    () => this.emails().filter((mail) => mail.folder === this.activeFolder() && mail.unread).length,
  );

  /** The mail currently shown in the reading pane, if any is selected & visible. */
  protected readonly selectedEmail = computed(() => {
    const id = this.selectedId();
    if (id === null) {
      return null;
    }
    return this.visibleEmails().find((mail) => mail.id === id) ?? null;
  });

  protected selectFolder(label: string): void {
    this.activeFolder.set(label);
    this.selectedId.set(null);
  }

  protected setTab(tab: 'all' | 'unread'): void {
    this.activeTab.set(tab);
  }

  protected onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  /** Open a mail in the reading pane and mark it read (clears the unread dot). */
  protected openEmail(id: number): void {
    this.selectedId.set(id);
    this.emails.update((list) =>
      list.map((mail) => (mail.id === id ? { ...mail, unread: false } : mail)),
    );
  }

  /** Toggle the row star without opening the mail. */
  protected toggleStar(id: number, event: Event): void {
    event.stopPropagation();
    this.emails.update((list) =>
      list.map((mail) => (mail.id === id ? { ...mail, starred: !mail.starred } : mail)),
    );
  }

  protected toggleCompose(): void {
    this.composeOpen.update((open) => !open);
  }
}

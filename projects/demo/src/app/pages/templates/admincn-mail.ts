import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface Mailbox {
  label: string;
  icon: string;
  count?: number;
  active?: boolean;
}
interface MailLabel {
  label: string;
  dot: string; // tailwind bg-*-500 color class
  count?: number;
}
interface Email {
  sender: string;
  time: string;
  subject: string;
  thread?: number; // number shown in parentheses after subject
  preview: string;
  avatar?: string; // image src; falls back to initials when absent
  initials?: string;
  dot: string; // unread indicator color (tailwind bg-*-500)
  starred?: boolean;
  unread?: boolean;
  active?: boolean;
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Mail" app page.
 * Full email client: compose button + mailbox/label sidebar + message list
 * + reading pane. Collapses the reading pane on tablet, then the sidebar on
 * mobile, matching the reference. Reuses the AdminCN shell + acn-* primitives.
 */
@Component({
  selector: 'app-tpl-admincn-mail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-mail.html',
})
export class AdmincnMail {
  protected readonly img = '/admincn';

  protected readonly mailboxes: Mailbox[] = [
    { label: 'Inbox', icon: 'mail', count: 10, active: true },
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

  protected readonly emails: Email[] = [
    {
      sender: 'Sarah Johnson',
      time: '2 hours ago',
      subject: 'Q4 Marketing Campaign Review',
      thread: 4,
      preview: "Thanks for the feedback — I'll incorporate your suggestions into the Q1 plan.",
      avatar: '/admincn/avatars/avatar-1.webp',
      dot: 'bg-teal-500',
      unread: true,
      active: true,
    },
    {
      sender: 'Michael Chen',
      time: '5 hours ago',
      subject: 'Project Timeline Update',
      preview: 'Hello, Just a quick update on the timeline for the new dashboard...',
      avatar: '/admincn/avatars/avatar-2.webp',
      dot: 'bg-teal-500',
      starred: true,
      unread: true,
    },
    {
      sender: 'Emma Wilson',
      time: 'Yesterday',
      subject: 'Re: Team Lunch Tomorrow',
      thread: 3,
      preview: 'Perfect — see you at 12:30 at the usual spot!',
      avatar: '/admincn/avatars/avatar-3.webp',
      dot: 'bg-violet-500',
      unread: true,
    },
    {
      sender: 'David Park',
      time: 'Yesterday',
      subject: 'Code Review Request',
      preview: 'Hi, Could you review my PR for the authentication module?',
      initials: 'DP',
      dot: 'bg-orange-500',
      unread: true,
    },
    {
      sender: 'Jessica Martinez',
      time: 'Jun 26',
      subject: 'Budget Approval Request',
      preview: 'Hi, I need approval for the additional budget for Q1 marketing...',
      initials: 'JM',
      dot: 'bg-teal-500',
      starred: true,
      unread: true,
    },
    {
      sender: 'Rachel Green',
      time: 'Jun 22',
      subject: 'Team Building Event',
      preview: 'Excited to announce our upcoming team building event!',
      avatar: '/admincn/avatars/avatar-4.webp',
      dot: 'bg-violet-500',
      unread: true,
    },
    {
      sender: 'Amazon Deals',
      time: '6 hours ago',
      subject: 'Your cart is waiting — 15% off today only',
      preview: 'Items in your cart are on sale. Complete your purchase before midnight.',
      avatar: '/admincn/avatars/avatar-5.webp',
      dot: 'bg-lime-500',
    },
    {
      sender: 'LinkedIn',
      time: 'Yesterday',
      subject: '3 people viewed your profile this week',
      preview: "See who's been looking at your profile and grow your network.",
      initials: 'L',
      dot: 'bg-violet-500',
    },
    {
      sender: 'Dev Community',
      time: 'Jun 26',
      subject: 'Weekly digest: Top posts in React & Next.js',
      preview: "This week's most popular discussions from the developer community.",
      avatar: '/admincn/avatars/avatar-6.webp',
      dot: 'bg-orange-500',
    },
    {
      sender: 'Flash Sale',
      time: 'Jun 27',
      subject: 'Summer sale: Up to 50% off sitewide',
      preview: "Don't miss our biggest sale of the season. Ends Sunday.",
      initials: 'FS',
      dot: 'bg-pink-500',
    },
  ];
}

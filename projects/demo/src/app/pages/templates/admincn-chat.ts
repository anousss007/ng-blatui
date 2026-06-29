import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface Conversation {
  name: string;
  avatar: string;
  /** Online presence dot: none for group chats. */
  status?: 'online' | 'away' | 'busy' | 'offline';
  time: string;
  preview: string;
  /** Prefix shown before the preview when the last message is from the current user. */
  outgoing?: boolean;
  pinned?: boolean;
  unread?: number;
  group?: boolean;
}

interface Message {
  /** false = incoming (left, muted), true = outgoing (right, primary). */
  outgoing: boolean;
  text: string;
  time: string;
  /** Sender name shown above incoming group messages. */
  sender?: string;
  avatar?: string;
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Chat" app page.
 * Two-pane messaging UI: a searchable/segmented conversation list (pinned +
 * recent, with avatars, presence dots, previews, timestamps and unread badges)
 * next to an active chat thread (header, scrollable message bubbles, composer).
 */
@Component({
  selector: 'app-tpl-admincn-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-chat.html',
})
export class AdmincnChat {
  protected readonly img = '/admincn';

  /** Conversation-list filter tabs (counts verbatim from the reference). */
  protected readonly tabs = [
    { label: 'All', count: 16, active: true },
    { label: 'Unread', count: 7, active: false },
    { label: 'Groups', count: 5, active: false },
    { label: 'Favourites', count: 6, active: false },
  ];

  protected readonly pinned: Conversation[] = [
    {
      name: 'Product Team',
      avatar: '/admincn/avatars/avatar-5.webp',
      group: true,
      time: 'Jun 11',
      preview: 'Let us lock scope in tomorrow standup.',
      pinned: true,
      unread: 3,
    },
    {
      name: 'Sarah Johnson',
      avatar: '/admincn/avatars/avatar-3.webp',
      status: 'online',
      time: 'Jun 11',
      preview: 'Can we present this to leadership on Friday?',
      pinned: true,
      unread: 2,
    },
    {
      name: 'Leadership',
      avatar: '/admincn/avatars/avatar-6.webp',
      group: true,
      time: 'Jun 6',
      preview: 'Please keep the product section to **10 minutes** max.',
      pinned: true,
    },
  ];

  protected readonly recent: Conversation[] = [
    {
      name: 'Sales & Marketing',
      avatar: '/admincn/avatars/avatar-2.webp',
      group: true,
      time: 'Jun 11',
      preview: 'Prospect confirmed Thursday 2 PM — calendar invite sent.',
      unread: 1,
    },
    {
      name: 'Jessica Martinez',
      avatar: '/admincn/avatars/avatar-4.webp',
      status: 'offline',
      time: 'Jun 11',
      preview: 'Can you confirm the headcount assumptions on slide 8?',
      unread: 1,
    },
    {
      name: 'Lisa Nguyen',
      avatar: '/admincn/avatars/avatar-1.webp',
      status: 'online',
      time: 'Jun 11',
      preview: 'Team offsite survey closes tomorrow — reminder to share with leads.',
      unread: 2,
    },
    {
      name: 'Design Review',
      avatar: '/admincn/avatars/avatar-16.webp',
      group: true,
      time: 'Jun 11',
      preview: 'Thanks Emma — I will link this in the help center draft.',
      unread: 4,
    },
    {
      name: 'Emma Wilson',
      avatar: '/admincn/avatars/avatar-6.webp',
      status: 'busy',
      time: 'Jun 11',
      preview: 'Ready for your final sign-off when you have a moment.',
      unread: 1,
    },
    {
      name: 'Alex Thompson',
      avatar: '/admincn/avatars/avatar-2.webp',
      status: 'away',
      time: 'Jun 10',
      preview: 'production-rollout-runbook.pdf',
    },
    {
      name: 'Marcus Webb',
      avatar: '/admincn/avatars/avatar-4.webp',
      status: 'away',
      time: 'Jun 10',
      preview: 'Forwarded to product — Michael will send an updated version.',
      outgoing: true,
    },
    {
      name: 'Michael Chen',
      avatar: '/admincn/avatars/avatar-5.webp',
      status: 'away',
      time: 'Jun 10',
      preview: 'Will do — I will share the full timeline doc tomorrow.',
    },
    {
      name: 'David Park',
      avatar: '/admincn/avatars/avatar-3.webp',
      status: 'online',
      time: 'Jun 9',
      preview: 'Merged. Deploying to staging now.',
    },
    {
      name: "Ryan O'Brien",
      avatar: '/admincn/avatars/avatar-1.webp',
      status: 'online',
      time: 'Jun 8',
      preview: 'Perfect — thanks for the quick turnaround Ryan.',
      outgoing: true,
    },
    {
      name: 'Tom Bradley',
      avatar: '/admincn/avatars/avatar-16.webp',
      status: 'offline',
      time: 'Jun 8',
      preview: 'Approved — please countersign when ready.',
      outgoing: true,
    },
    {
      name: 'Engineering',
      avatar: '/admincn/avatars/avatar-2.webp',
      group: true,
      time: 'Jun 7',
      preview: 'Thanks Alex — all set on our end.',
      outgoing: true,
    },
    {
      name: 'Priya Patel',
      avatar: '/admincn/avatars/avatar-4.webp',
      status: 'busy',
      time: 'Jun 6',
      preview: '**Exactly what I needed** — thank you Priya.',
      outgoing: true,
    },
  ];

  /** Maps a presence status to its dot colour class. */
  protected readonly statusClass: Record<string, string> = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-muted-foreground',
  };

  /** Active thread (opened on wide viewports — replaces the empty state). */
  protected readonly active = {
    name: 'Sarah Johnson',
    avatar: '/admincn/avatars/avatar-3.webp',
    role: 'Product Marketing',
    status: 'online' as const,
  };

  protected readonly me = '/admincn/avatars/avatar-1.webp';

  protected readonly thread: Message[] = [
    {
      outgoing: false,
      sender: 'Sarah Johnson',
      avatar: '/admincn/avatars/avatar-3.webp',
      text: 'Morning! Did you get a chance to look at the Q3 launch deck?',
      time: '9:02 AM',
    },
    {
      outgoing: true,
      text: 'Yes — skimmed it last night. The narrative is strong, just a couple of slides to tighten.',
      time: '9:05 AM',
    },
    {
      outgoing: false,
      sender: 'Sarah Johnson',
      avatar: '/admincn/avatars/avatar-3.webp',
      text: 'Can we present this to leadership on Friday?',
      time: '9:06 AM',
    },
    {
      outgoing: true,
      text: 'Friday works. Let us keep the product section to 10 minutes max so we leave room for questions.',
      time: '9:08 AM',
    },
    {
      outgoing: false,
      sender: 'Sarah Johnson',
      avatar: '/admincn/avatars/avatar-3.webp',
      text: 'Perfect. I will send the calendar invite and loop in the design review team.',
      time: '9:09 AM',
    },
  ];
}

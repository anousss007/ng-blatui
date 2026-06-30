import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { BuiAvatar, BuiButton, BuiPresence } from 'ng-blatui';

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
  favourite?: boolean;
  /** Role/subtitle shown in the open-thread header. */
  role: string;
  /** Seeded messages for this conversation's thread. */
  messages: Message[];
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
  imports: [Lucide, AdmincnShell, BuiAvatar, BuiButton, BuiPresence],
  templateUrl: './admincn-chat.html',
})
export class AdmincnChat {
  protected readonly img = '/admincn';

  /** Conversation-list filter tabs (counts verbatim from the reference). */
  protected readonly tabs = [
    { label: 'All', count: 16 },
    { label: 'Unread', count: 7 },
    { label: 'Groups', count: 5 },
    { label: 'Favourites', count: 6 },
  ];

  /** Currently selected filter tab. */
  protected readonly activeTab = signal('All');

  /** Current search query for the conversation list. */
  protected readonly query = signal('');

  protected readonly pinned = signal<Conversation[]>([
    {
      name: 'Product Team',
      avatar: '/admincn/avatars/avatar-5.webp',
      group: true,
      time: 'Jun 11',
      preview: 'Let us lock scope in tomorrow standup.',
      pinned: true,
      unread: 3,
      favourite: true,
      role: 'Group · 8 members',
      messages: [
        {
          outgoing: false,
          sender: 'Olivia Reed',
          avatar: '/admincn/avatars/avatar-5.webp',
          text: 'Standup pushed to 9:30 tomorrow — calendar updated.',
          time: '4:12 PM',
        },
        {
          outgoing: false,
          sender: 'Daniel Cruz',
          avatar: '/admincn/avatars/avatar-2.webp',
          text: 'Roadmap doc is ready for review whenever you have time.',
          time: '4:20 PM',
        },
        {
          outgoing: true,
          text: 'Nice work — I will read through it tonight.',
          time: '4:25 PM',
        },
        {
          outgoing: false,
          sender: 'Olivia Reed',
          avatar: '/admincn/avatars/avatar-5.webp',
          text: 'Let us lock scope in tomorrow standup.',
          time: '4:31 PM',
        },
      ],
    },
    {
      name: 'Sarah Johnson',
      avatar: '/admincn/avatars/avatar-3.webp',
      status: 'online',
      time: 'Jun 11',
      preview: 'Can we present this to leadership on Friday?',
      pinned: true,
      unread: 2,
      favourite: true,
      role: 'Product Marketing',
      messages: [
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
      ],
    },
    {
      name: 'Leadership',
      avatar: '/admincn/avatars/avatar-6.webp',
      group: true,
      time: 'Jun 6',
      preview: 'Please keep the product section to **10 minutes** max.',
      pinned: true,
      role: 'Group · 5 members',
      messages: [
        {
          outgoing: false,
          sender: 'Grace Hall',
          avatar: '/admincn/avatars/avatar-6.webp',
          text: 'Friday review is confirmed for 11 AM in the boardroom.',
          time: '2:40 PM',
        },
        {
          outgoing: true,
          text: 'Thanks — we will have the deck finalised by Thursday EOD.',
          time: '2:44 PM',
        },
        {
          outgoing: false,
          sender: 'Grace Hall',
          avatar: '/admincn/avatars/avatar-6.webp',
          text: 'Please keep the product section to 10 minutes max.',
          time: '2:46 PM',
        },
      ],
    },
  ]);

  protected readonly recent = signal<Conversation[]>([
    {
      name: 'Sales & Marketing',
      avatar: '/admincn/avatars/avatar-2.webp',
      group: true,
      time: 'Jun 11',
      preview: 'Prospect confirmed Thursday 2 PM — calendar invite sent.',
      unread: 1,
      role: 'Group · 12 members',
      messages: [
        {
          outgoing: false,
          sender: 'Noah Bennett',
          avatar: '/admincn/avatars/avatar-2.webp',
          text: 'Demo went really well — they want a follow-up this week.',
          time: '11:10 AM',
        },
        {
          outgoing: true,
          text: 'Great news. Let us get a slot on the calendar.',
          time: '11:14 AM',
        },
        {
          outgoing: false,
          sender: 'Noah Bennett',
          avatar: '/admincn/avatars/avatar-2.webp',
          text: 'Prospect confirmed Thursday 2 PM — calendar invite sent.',
          time: '11:20 AM',
        },
      ],
    },
    {
      name: 'Jessica Martinez',
      avatar: '/admincn/avatars/avatar-4.webp',
      status: 'offline',
      time: 'Jun 11',
      preview: 'Can you confirm the headcount assumptions on slide 8?',
      unread: 1,
      favourite: true,
      role: 'Finance Lead',
      messages: [
        {
          outgoing: true,
          text: 'Sent over the updated model — let me know if the numbers line up.',
          time: '10:01 AM',
        },
        {
          outgoing: false,
          sender: 'Jessica Martinez',
          avatar: '/admincn/avatars/avatar-4.webp',
          text: 'Looks close. One question on the assumptions.',
          time: '10:18 AM',
        },
        {
          outgoing: false,
          sender: 'Jessica Martinez',
          avatar: '/admincn/avatars/avatar-4.webp',
          text: 'Can you confirm the headcount assumptions on slide 8?',
          time: '10:19 AM',
        },
      ],
    },
    {
      name: 'Lisa Nguyen',
      avatar: '/admincn/avatars/avatar-1.webp',
      status: 'online',
      time: 'Jun 11',
      preview: 'Team offsite survey closes tomorrow — reminder to share with leads.',
      unread: 2,
      role: 'People Ops',
      messages: [
        {
          outgoing: false,
          sender: 'Lisa Nguyen',
          avatar: '/admincn/avatars/avatar-1.webp',
          text: 'Offsite planning is coming together nicely.',
          time: '3:02 PM',
        },
        {
          outgoing: true,
          text: 'Awesome — anything you need from my side?',
          time: '3:05 PM',
        },
        {
          outgoing: false,
          sender: 'Lisa Nguyen',
          avatar: '/admincn/avatars/avatar-1.webp',
          text: 'Team offsite survey closes tomorrow — reminder to share with leads.',
          time: '3:07 PM',
        },
      ],
    },
    {
      name: 'Design Review',
      avatar: '/admincn/avatars/avatar-16.webp',
      group: true,
      time: 'Jun 11',
      preview: 'Thanks Emma — I will link this in the help center draft.',
      unread: 4,
      favourite: true,
      role: 'Group · 6 members',
      messages: [
        {
          outgoing: false,
          sender: 'Emma Wilson',
          avatar: '/admincn/avatars/avatar-6.webp',
          text: 'Uploaded the revised empty-state illustrations.',
          time: '1:30 PM',
        },
        {
          outgoing: true,
          text: 'These are much cleaner — love the new spacing.',
          time: '1:36 PM',
        },
        {
          outgoing: true,
          text: 'Thanks Emma — I will link this in the help center draft.',
          time: '1:38 PM',
        },
      ],
    },
    {
      name: 'Emma Wilson',
      avatar: '/admincn/avatars/avatar-6.webp',
      status: 'busy',
      time: 'Jun 11',
      preview: 'Ready for your final sign-off when you have a moment.',
      unread: 1,
      role: 'Product Designer',
      messages: [
        {
          outgoing: false,
          sender: 'Emma Wilson',
          avatar: '/admincn/avatars/avatar-6.webp',
          text: 'Final mockups are in Figma, page 3.',
          time: '9:50 AM',
        },
        {
          outgoing: true,
          text: 'Pulling them up now.',
          time: '9:52 AM',
        },
        {
          outgoing: false,
          sender: 'Emma Wilson',
          avatar: '/admincn/avatars/avatar-6.webp',
          text: 'Ready for your final sign-off when you have a moment.',
          time: '9:55 AM',
        },
      ],
    },
    {
      name: 'Alex Thompson',
      avatar: '/admincn/avatars/avatar-2.webp',
      status: 'away',
      time: 'Jun 10',
      preview: 'production-rollout-runbook.pdf',
      role: 'Platform Engineer',
      messages: [
        {
          outgoing: false,
          sender: 'Alex Thompson',
          avatar: '/admincn/avatars/avatar-2.webp',
          text: 'Here is the runbook for tomorrow.',
          time: '6:10 PM',
        },
        {
          outgoing: false,
          sender: 'Alex Thompson',
          avatar: '/admincn/avatars/avatar-2.webp',
          text: 'production-rollout-runbook.pdf',
          time: '6:10 PM',
        },
        {
          outgoing: true,
          text: 'Got it — reviewing now.',
          time: '6:21 PM',
        },
      ],
    },
    {
      name: 'Marcus Webb',
      avatar: '/admincn/avatars/avatar-4.webp',
      status: 'away',
      time: 'Jun 10',
      preview: 'Forwarded to product — Michael will send an updated version.',
      outgoing: true,
      role: 'Account Manager',
      messages: [
        {
          outgoing: false,
          sender: 'Marcus Webb',
          avatar: '/admincn/avatars/avatar-4.webp',
          text: 'Can you check whether this contract is the latest revision?',
          time: '5:02 PM',
        },
        {
          outgoing: true,
          text: 'Forwarded to product — Michael will send an updated version.',
          time: '5:09 PM',
        },
      ],
    },
    {
      name: 'Michael Chen',
      avatar: '/admincn/avatars/avatar-5.webp',
      status: 'away',
      time: 'Jun 10',
      preview: 'Will do — I will share the full timeline doc tomorrow.',
      role: 'Program Manager',
      messages: [
        {
          outgoing: true,
          text: 'Do we have a consolidated timeline anywhere?',
          time: '4:40 PM',
        },
        {
          outgoing: false,
          sender: 'Michael Chen',
          avatar: '/admincn/avatars/avatar-5.webp',
          text: 'Will do — I will share the full timeline doc tomorrow.',
          time: '4:48 PM',
        },
      ],
    },
    {
      name: 'David Park',
      avatar: '/admincn/avatars/avatar-3.webp',
      status: 'online',
      time: 'Jun 9',
      preview: 'Merged. Deploying to staging now.',
      role: 'Backend Engineer',
      messages: [
        {
          outgoing: true,
          text: 'PR looks good — approved.',
          time: '2:11 PM',
        },
        {
          outgoing: false,
          sender: 'David Park',
          avatar: '/admincn/avatars/avatar-3.webp',
          text: 'Merged. Deploying to staging now.',
          time: '2:13 PM',
        },
      ],
    },
    {
      name: "Ryan O'Brien",
      avatar: '/admincn/avatars/avatar-1.webp',
      status: 'online',
      time: 'Jun 8',
      preview: 'Perfect — thanks for the quick turnaround Ryan.',
      outgoing: true,
      role: 'QA Engineer',
      messages: [
        {
          outgoing: false,
          sender: "Ryan O'Brien",
          avatar: '/admincn/avatars/avatar-1.webp',
          text: 'All regression tests are passing on the latest build.',
          time: '11:50 AM',
        },
        {
          outgoing: true,
          text: 'Perfect — thanks for the quick turnaround Ryan.',
          time: '11:55 AM',
        },
      ],
    },
    {
      name: 'Tom Bradley',
      avatar: '/admincn/avatars/avatar-16.webp',
      status: 'offline',
      time: 'Jun 8',
      preview: 'Approved — please countersign when ready.',
      outgoing: true,
      role: 'Legal Counsel',
      messages: [
        {
          outgoing: false,
          sender: 'Tom Bradley',
          avatar: '/admincn/avatars/avatar-16.webp',
          text: 'Reviewed the redlines, just two minor edits.',
          time: '10:30 AM',
        },
        {
          outgoing: true,
          text: 'Approved — please countersign when ready.',
          time: '10:42 AM',
        },
      ],
    },
    {
      name: 'Engineering',
      avatar: '/admincn/avatars/avatar-2.webp',
      group: true,
      time: 'Jun 7',
      preview: 'Thanks Alex — all set on our end.',
      outgoing: true,
      role: 'Group · 14 members',
      messages: [
        {
          outgoing: false,
          sender: 'Alex Thompson',
          avatar: '/admincn/avatars/avatar-2.webp',
          text: 'Staging is green, ready to promote whenever you are.',
          time: '9:15 AM',
        },
        {
          outgoing: true,
          text: 'Thanks Alex — all set on our end.',
          time: '9:18 AM',
        },
      ],
    },
    {
      name: 'Priya Patel',
      avatar: '/admincn/avatars/avatar-4.webp',
      status: 'busy',
      time: 'Jun 6',
      preview: '**Exactly what I needed** — thank you Priya.',
      outgoing: true,
      favourite: true,
      role: 'Data Analyst',
      messages: [
        {
          outgoing: false,
          sender: 'Priya Patel',
          avatar: '/admincn/avatars/avatar-4.webp',
          text: 'Pushed the dashboard with the new cohort breakdown.',
          time: '8:40 AM',
        },
        {
          outgoing: true,
          text: 'Exactly what I needed — thank you Priya.',
          time: '8:47 AM',
        },
      ],
    },
  ]);

  protected readonly me = '/admincn/avatars/avatar-1.webp';

  /** Currently open conversation (defaults to Sarah Johnson). */
  protected readonly active = signal<Conversation>(this.pinned()[1]);

  /** Filters a list of conversations by the active tab + search query. */
  private matchesFilters(conversation: Conversation): boolean {
    const search = this.query().trim().toLowerCase();
    if (search && !conversation.name.toLowerCase().includes(search)) {
      return false;
    }
    switch (this.activeTab()) {
      case 'Unread': {
        return !!conversation.unread;
      }
      case 'Groups': {
        return !!conversation.group;
      }
      case 'Favourites': {
        return !!conversation.favourite;
      }
      default: {
        return true;
      }
    }
  }

  /** Pinned conversations after applying the active tab + search filter. */
  protected readonly visiblePinned = computed(() =>
    this.pinned().filter((conversation) => this.matchesFilters(conversation)),
  );

  /** Recent conversations after applying the active tab + search filter. */
  protected readonly visibleRecent = computed(() =>
    this.recent().filter((conversation) => this.matchesFilters(conversation)),
  );

  /** Opens a conversation as the active thread. */
  protected openConversation(conversation: Conversation): void {
    this.active.set(conversation);
  }

  /** Selects a filter tab. */
  protected selectTab(label: string): void {
    this.activeTab.set(label);
  }

  /** Updates the search query as the user types. */
  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  /** Appends an outgoing message to the active thread, then clears the input. */
  protected send(input: HTMLInputElement): void {
    const text = input.value.trim();
    if (!text) {
      return;
    }
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const conversation = this.active();
    const message: Message = { outgoing: true, text, time };
    // Mutate the shared object so the list row reflects the new preview, then
    // re-set the signal to a fresh reference so the thread @for re-renders.
    conversation.messages = [...conversation.messages, message];
    conversation.preview = text;
    conversation.outgoing = true;
    this.active.set({ ...conversation });
    this.pinned.update((list) => [...list]);
    this.recent.update((list) => [...list]);
    input.value = '';
  }
}

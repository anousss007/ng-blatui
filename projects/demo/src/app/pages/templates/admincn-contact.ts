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
  BuiDropdownMenu,
  BuiDropdownMenuItem,
  BuiInputGroup,
  BuiInputGroupAddon,
  BuiInputGroupInput,
  Menu,
  MenuItem,
  MenuTrigger,
} from 'ng-blatui';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

type TagTone = 'lead' | 'partner' | 'customer' | 'vip' | 'freelancer' | 'supplier';

interface Tag {
  label: TagTone;
  /** Tailwind bg-* class for the leading dot. */
  dot: string;
}
interface Contact {
  name: string;
  email: string;
  /** Avatar webp file under /admincn/avatars, or null to render initials. */
  avatar: string | null;
  initials: string;
  tags: Tag[];
  /** Folder membership flags — every contact belongs to "All Contacts". */
  favourite: boolean;
  spam: boolean;
  blocked: boolean;
}
interface Section {
  letter: string;
  contacts: Contact[];
}
interface Folder {
  label: string;
  icon: string;
  count: number;
  active?: boolean;
}
interface Label {
  label: string;
  dot: string;
  count: number;
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "Contact" app page.
 * Reuses the shared inset-sidebar shell, then projects a two-pane contacts UI:
 * a left rail (New Contact button, folders, labels) and an alphabetised list of
 * contact rows (avatar, name, email, tag badges, row menu) with a search /
 * sort / filter / view toolbar. Light mode, Geist font, responsive to mobile.
 */
@Component({
  selector: 'app-tpl-admincn-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    Lucide,
    AdmincnShell,
    BuiAvatar,
    BuiBadge,
    BuiButton,
    BuiCard,
    BuiDropdownMenu,
    BuiDropdownMenuItem,
    BuiInputGroup,
    BuiInputGroupAddon,
    BuiInputGroupInput,
    Menu,
    MenuItem,
    MenuTrigger,
  ],
  templateUrl: './admincn-contact.html',
})
export class AdmincnContact {
  protected readonly img = '/admincn';

  /* Tag tone → leading-dot colour ----------------------------------------- */
  private static readonly DOT: Record<TagTone, string> = {
    lead: 'bg-blue-500',
    partner: 'bg-purple-500',
    customer: 'bg-emerald-500',
    vip: 'bg-amber-500',
    freelancer: 'bg-orange-500',
    supplier: 'bg-pink-500',
  };
  private static tag(label: TagTone): Tag {
    return { label, dot: this.DOT[label] };
  }

  /* Left rail — folders + labels (verbatim counts from the DOM) ------------ */
  protected readonly folders: Folder[] = [
    { label: 'All Contacts', icon: 'contact-round', count: 25, active: true },
    { label: 'Favourites', icon: 'star', count: 7 },
    { label: 'Spam', icon: 'shield', count: 4 },
    { label: 'Blocked', icon: 'x', count: 4 },
  ];
  protected readonly labels: Label[] = [
    { label: 'Lead', dot: 'bg-blue-500', count: 7 },
    { label: 'Partner', dot: 'bg-purple-500', count: 6 },
    { label: 'Customer', dot: 'bg-emerald-500', count: 10 },
    { label: 'Vip', dot: 'bg-amber-500', count: 7 },
    { label: 'Freelancer', dot: 'bg-orange-500', count: 4 },
    { label: 'Supplier', dot: 'bg-pink-500', count: 5 },
  ];

  /* Contacts, grouped alphabetically (names/emails/tags verbatim) ---------- */
  private static avatar(index: number): string {
    return `/admincn/avatars/avatar-${index}.webp`;
  }
  private static contact(
    name: string,
    email: string,
    avatar: string | null,
    tags: Tag[],
    flags: { favourite?: boolean; spam?: boolean; blocked?: boolean } = {},
  ): Contact {
    const parts = name.split(' ');
    const initials = ((parts[0]?.at(0) ?? '') + (parts[1]?.at(0) ?? '')).toUpperCase();
    return {
      name,
      email,
      avatar,
      initials,
      tags,
      favourite: flags.favourite ?? false,
      spam: flags.spam ?? false,
      blocked: flags.blocked ?? false,
    };
  }

  /**
   * Master contact list (all 25). Folder flags are distributed so the rail
   * counts stay meaningful: 7 Favourites, 4 Spam, 4 Blocked — All Contacts = 25.
   */
  private readonly allContacts: Contact[] = [
    AdmincnContact.contact(
      'Alice Johnson',
      'alice.johnson@example.com',
      AdmincnContact.avatar(1),
      [AdmincnContact.tag('customer')],
      { favourite: true },
    ),
    AdmincnContact.contact(
      'Aron Thompson',
      'aron.thompson@example.com',
      AdmincnContact.avatar(6),
      [AdmincnContact.tag('lead'), AdmincnContact.tag('vip')],
      { favourite: true },
    ),
    AdmincnContact.contact(
      'Benjamin White',
      'benjamin.white@example.com',
      AdmincnContact.avatar(16),
      [AdmincnContact.tag('partner'), AdmincnContact.tag('customer')],
      { spam: true },
    ),
    AdmincnContact.contact(
      'Charlotte Lee',
      'charlotte.lee@example.com',
      AdmincnContact.avatar(3),
      [AdmincnContact.tag('freelancer'), AdmincnContact.tag('supplier')],
      { favourite: true },
    ),
    AdmincnContact.contact(
      'Emma Wilson',
      'emma.wilson@example.com',
      AdmincnContact.avatar(4),
      [AdmincnContact.tag('supplier')],
      { blocked: true },
    ),
    AdmincnContact.contact(
      'Ethan Moore',
      'ethan.moore@example.com',
      AdmincnContact.avatar(5),
      [AdmincnContact.tag('vip')],
      { favourite: true },
    ),
    AdmincnContact.contact('Grace Hall', 'grace.hall@example.com', AdmincnContact.avatar(2), [
      AdmincnContact.tag('customer'),
      AdmincnContact.tag('lead'),
    ]),
    AdmincnContact.contact(
      'Henry Clark',
      'henry.clark@example.com',
      AdmincnContact.avatar(6),
      [AdmincnContact.tag('partner')],
      { spam: true },
    ),
    AdmincnContact.contact(
      'Isabella Young',
      'isabella.young@example.com',
      null,
      [AdmincnContact.tag('vip'), AdmincnContact.tag('customer')],
      { favourite: true },
    ),
    AdmincnContact.contact(
      'James Martinez',
      'james.martinez@example.com',
      AdmincnContact.avatar(3),
      [AdmincnContact.tag('lead')],
    ),
    AdmincnContact.contact(
      'John Doe',
      'john.doe@example.com',
      AdmincnContact.avatar(1),
      [AdmincnContact.tag('lead'), AdmincnContact.tag('customer')],
      { favourite: true },
    ),
    AdmincnContact.contact(
      'Kelly King',
      'kelly.king@example.com',
      AdmincnContact.avatar(2),
      [AdmincnContact.tag('supplier')],
      { blocked: true },
    ),
    AdmincnContact.contact('Liam Anderson', 'liam.anderson@example.com', AdmincnContact.avatar(4), [
      AdmincnContact.tag('lead'),
      AdmincnContact.tag('partner'),
    ]),
    AdmincnContact.contact('Mia Taylor', 'mia.taylor@example.com', AdmincnContact.avatar(5), [
      AdmincnContact.tag('customer'),
    ]),
    AdmincnContact.contact(
      'Noah Davis',
      'noah.davis@example.com',
      AdmincnContact.avatar(6),
      [AdmincnContact.tag('freelancer')],
      { spam: true },
    ),
    AdmincnContact.contact(
      'Nora Adams',
      'nora.adams@example.com',
      AdmincnContact.avatar(4),
      [AdmincnContact.tag('partner'), AdmincnContact.tag('vip')],
      { favourite: true },
    ),
    AdmincnContact.contact('Olivia Brown', 'olivia.brown@example.com', AdmincnContact.avatar(16), [
      AdmincnContact.tag('partner'),
    ]),
    AdmincnContact.contact(
      'Owen Baker',
      'owen.baker@example.com',
      AdmincnContact.avatar(5),
      [AdmincnContact.tag('customer')],
      { blocked: true },
    ),
    AdmincnContact.contact('Paula Reed', 'paula.reed@example.com', AdmincnContact.avatar(6), [
      AdmincnContact.tag('lead'),
      AdmincnContact.tag('freelancer'),
    ]),
    AdmincnContact.contact(
      'Ryan Cooper',
      'ryan.cooper@example.com',
      AdmincnContact.avatar(3),
      [AdmincnContact.tag('lead')],
      { spam: true },
    ),
    AdmincnContact.contact(
      'Samantha Brooks',
      'samantha.brooks@example.com',
      AdmincnContact.avatar(16),
      [AdmincnContact.tag('customer'), AdmincnContact.tag('vip')],
    ),
    AdmincnContact.contact('Sarah Doe', 'sarah.doe@example.com', AdmincnContact.avatar(2), [
      AdmincnContact.tag('customer'),
      AdmincnContact.tag('vip'),
    ]),
    AdmincnContact.contact('Sophia Garcia', 'sophia.garcia@example.com', AdmincnContact.avatar(1), [
      AdmincnContact.tag('supplier'),
      AdmincnContact.tag('vip'),
    ]),
    AdmincnContact.contact(
      'Tyler Foster',
      'tyler.foster@example.com',
      AdmincnContact.avatar(6),
      [AdmincnContact.tag('freelancer')],
      { blocked: true },
    ),
    AdmincnContact.contact('Victor Nguyen', 'victor.nguyen@example.com', AdmincnContact.avatar(5), [
      AdmincnContact.tag('supplier'),
      AdmincnContact.tag('partner'),
    ]),
  ];

  /* Live state ------------------------------------------------------------- */
  protected readonly query = signal('');
  /** Active folder label, or null for "no extra folder filter". */
  protected readonly activeFolder = signal<string>('All Contacts');
  /** Active label filter (capitalised, e.g. "Lead"), or null when cleared. */
  protected readonly activeLabel = signal<string | null>(null);
  /** Emails removed via the row menu's Delete action. */
  private readonly removed = signal<readonly string[]>([]);

  /* Derived list, then grouped into A–Z sections --------------------------- */
  private readonly visibleContacts = computed<Contact[]>(() => {
    const term = this.query().trim().toLowerCase();
    const folder = this.activeFolder();
    const label = this.activeLabel()?.toLowerCase() ?? null;
    const gone = this.removed();
    return this.allContacts.filter((contact) => {
      if (gone.includes(contact.email)) {
        return false;
      }
      if (folder === 'Favourites' && !contact.favourite) {
        return false;
      }
      if (folder === 'Spam' && !contact.spam) {
        return false;
      }
      if (folder === 'Blocked' && !contact.blocked) {
        return false;
      }
      if (label && contact.tags.every((tag) => tag.label !== label)) {
        return false;
      }
      if (term) {
        const haystack = `${contact.name} ${contact.email}`.toLowerCase();
        if (!haystack.includes(term)) {
          return false;
        }
      }
      return true;
    });
  });

  /** A–Z so sections render in alphabetical order without sorting at runtime. */
  private static readonly ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  protected readonly sections = computed<Section[]>(() => {
    const byLetter = new Map<string, Contact[]>();
    for (const contact of this.visibleContacts()) {
      const letter = (contact.name.at(0) ?? '#').toUpperCase();
      const bucket = byLetter.get(letter) ?? [];
      bucket.push(contact);
      byLetter.set(letter, bucket);
    }
    const result: Section[] = [];
    for (const letter of AdmincnContact.ALPHABET) {
      const contacts = byLetter.get(letter);
      if (contacts && contacts.length > 0) {
        result.push({ letter, contacts });
      }
    }
    return result;
  });

  /* Handlers --------------------------------------------------------------- */
  protected onSearch(value: string): void {
    this.query.set(value);
  }

  protected selectFolder(label: string): void {
    this.activeFolder.set(label);
  }

  protected toggleLabel(label: string): void {
    this.activeLabel.update((current) => (current === label ? null : label));
  }

  protected deleteContact(email: string): void {
    this.removed.update((list) => [...list, email]);
  }
}

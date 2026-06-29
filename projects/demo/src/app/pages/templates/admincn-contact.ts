import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

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
  imports: [Lucide, AdmincnShell],
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
  private static avatar(n: number): string {
    return `/admincn/avatars/avatar-${n}.webp`;
  }
  private static contact(name: string, email: string, avatar: string | null, tags: Tag[]): Contact {
    const parts = name.split(' ');
    const initials = ((parts[0]?.at(0) ?? '') + (parts[1]?.at(0) ?? '')).toUpperCase();
    return { name, email, avatar, initials, tags };
  }

  protected readonly sections: Section[] = [
    {
      letter: 'A',
      contacts: [
        AdmincnContact.contact(
          'Alice Johnson',
          'alice.johnson@example.com',
          AdmincnContact.avatar(1),
          [AdmincnContact.tag('customer')],
        ),
        AdmincnContact.contact(
          'Aron Thompson',
          'aron.thompson@example.com',
          AdmincnContact.avatar(6),
          [AdmincnContact.tag('lead'), AdmincnContact.tag('vip')],
        ),
      ],
    },
    {
      letter: 'B',
      contacts: [
        AdmincnContact.contact(
          'Benjamin White',
          'benjamin.white@example.com',
          AdmincnContact.avatar(16),
          [AdmincnContact.tag('partner'), AdmincnContact.tag('customer')],
        ),
      ],
    },
    {
      letter: 'C',
      contacts: [
        AdmincnContact.contact(
          'Charlotte Lee',
          'charlotte.lee@example.com',
          AdmincnContact.avatar(3),
          [AdmincnContact.tag('freelancer'), AdmincnContact.tag('supplier')],
        ),
      ],
    },
    {
      letter: 'E',
      contacts: [
        AdmincnContact.contact('Emma Wilson', 'emma.wilson@example.com', AdmincnContact.avatar(4), [
          AdmincnContact.tag('supplier'),
        ]),
        AdmincnContact.contact('Ethan Moore', 'ethan.moore@example.com', AdmincnContact.avatar(5), [
          AdmincnContact.tag('vip'),
        ]),
      ],
    },
    {
      letter: 'G',
      contacts: [
        AdmincnContact.contact('Grace Hall', 'grace.hall@example.com', AdmincnContact.avatar(2), [
          AdmincnContact.tag('customer'),
          AdmincnContact.tag('lead'),
        ]),
      ],
    },
    {
      letter: 'H',
      contacts: [
        AdmincnContact.contact('Henry Clark', 'henry.clark@example.com', AdmincnContact.avatar(6), [
          AdmincnContact.tag('partner'),
        ]),
      ],
    },
    {
      letter: 'I',
      contacts: [
        AdmincnContact.contact('Isabella Young', 'isabella.young@example.com', null, [
          AdmincnContact.tag('vip'),
          AdmincnContact.tag('customer'),
        ]),
      ],
    },
    {
      letter: 'J',
      contacts: [
        AdmincnContact.contact(
          'James Martinez',
          'james.martinez@example.com',
          AdmincnContact.avatar(3),
          [AdmincnContact.tag('lead')],
        ),
        AdmincnContact.contact('John Doe', 'john.doe@example.com', AdmincnContact.avatar(1), [
          AdmincnContact.tag('lead'),
          AdmincnContact.tag('customer'),
        ]),
      ],
    },
    {
      letter: 'K',
      contacts: [
        AdmincnContact.contact('Kelly King', 'kelly.king@example.com', AdmincnContact.avatar(2), [
          AdmincnContact.tag('supplier'),
        ]),
      ],
    },
    {
      letter: 'L',
      contacts: [
        AdmincnContact.contact(
          'Liam Anderson',
          'liam.anderson@example.com',
          AdmincnContact.avatar(4),
          [AdmincnContact.tag('lead'), AdmincnContact.tag('partner')],
        ),
      ],
    },
    {
      letter: 'M',
      contacts: [
        AdmincnContact.contact('Mia Taylor', 'mia.taylor@example.com', AdmincnContact.avatar(5), [
          AdmincnContact.tag('customer'),
        ]),
      ],
    },
    {
      letter: 'N',
      contacts: [
        AdmincnContact.contact('Noah Davis', 'noah.davis@example.com', AdmincnContact.avatar(6), [
          AdmincnContact.tag('freelancer'),
        ]),
        AdmincnContact.contact('Nora Adams', 'nora.adams@example.com', AdmincnContact.avatar(4), [
          AdmincnContact.tag('partner'),
          AdmincnContact.tag('vip'),
        ]),
      ],
    },
    {
      letter: 'O',
      contacts: [
        AdmincnContact.contact(
          'Olivia Brown',
          'olivia.brown@example.com',
          AdmincnContact.avatar(16),
          [AdmincnContact.tag('partner')],
        ),
        AdmincnContact.contact('Owen Baker', 'owen.baker@example.com', AdmincnContact.avatar(5), [
          AdmincnContact.tag('customer'),
        ]),
      ],
    },
    {
      letter: 'P',
      contacts: [
        AdmincnContact.contact('Paula Reed', 'paula.reed@example.com', AdmincnContact.avatar(6), [
          AdmincnContact.tag('lead'),
          AdmincnContact.tag('freelancer'),
        ]),
      ],
    },
    {
      letter: 'R',
      contacts: [
        AdmincnContact.contact('Ryan Cooper', 'ryan.cooper@example.com', AdmincnContact.avatar(3), [
          AdmincnContact.tag('lead'),
        ]),
      ],
    },
    {
      letter: 'S',
      contacts: [
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
        AdmincnContact.contact(
          'Sophia Garcia',
          'sophia.garcia@example.com',
          AdmincnContact.avatar(1),
          [AdmincnContact.tag('supplier'), AdmincnContact.tag('vip')],
        ),
      ],
    },
    {
      letter: 'T',
      contacts: [
        AdmincnContact.contact(
          'Tyler Foster',
          'tyler.foster@example.com',
          AdmincnContact.avatar(6),
          [AdmincnContact.tag('freelancer')],
        ),
      ],
    },
    {
      letter: 'V',
      contacts: [
        AdmincnContact.contact(
          'Victor Nguyen',
          'victor.nguyen@example.com',
          AdmincnContact.avatar(5),
          [AdmincnContact.tag('supplier'), AdmincnContact.tag('partner')],
        ),
      ],
    },
  ];
}

import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { AdmincnShell } from './admincn-shell';
import { Lucide } from './lucide';

interface FaqQuestion {
  question: string;
  answer: string;
}
interface FaqCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  questions: FaqQuestion[];
}
interface SupportCard {
  title: string;
  icon: string;
  description: string;
  buttonText: string;
}

/**
 * AdminCN — pixel-faithful clone of the shadcn admin "FAQ" page.
 * Hero (eyebrow + heading + subheading + search), a category sidebar of icon
 * tiles, an accordion of questions for the active category, and a 3-up
 * "Need More Admin Help?" support-card row. Reuses the AdminCN app-shell.
 */
@Component({
  selector: 'app-tpl-admincn-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Lucide, AdmincnShell],
  templateUrl: './admincn-faq.html',
})
export class AdmincnFaq {
  /** Which accordion item is open within the active category (-1 = none). */
  protected readonly openItem = signal(0);
  /** Active category index. */
  protected readonly activeCategory = signal(0);

  protected toggle(index: number): void {
    this.openItem.update((current) => (current === index ? -1 : index));
  }

  protected selectCategory(index: number): void {
    this.activeCategory.set(index);
    this.openItem.set(0);
  }

  protected readonly categories: FaqCategory[] = [
    {
      id: 'general',
      title: 'General Usage',
      icon: 'layout-dashboard',
      description: 'Core questions about navigating and managing your admin dashboard workspace.',
      questions: [
        {
          question: 'How do I customize my dashboard widgets?',
          answer:
            'Open the dashboard settings menu and use drag-and-drop to reorder cards. You can also enable or disable modules per role so each team sees the most relevant metrics first.',
        },
        {
          question: 'Can I create multiple dashboards for different teams?',
          answer:
            'Yes. You can create separate dashboards for Sales, Operations, Finance, and other teams. Each dashboard can have its own filters, widgets, and access permissions.',
        },
        {
          question: 'How often is dashboard data refreshed?',
          answer:
            'Data refresh intervals depend on the widget source. Live widgets update every 30 to 60 seconds, while report-based widgets refresh on scheduled syncs or manual reload.',
        },
        {
          question: 'Can I export charts and tables from the dashboard?',
          answer:
            'Yes. Most widgets support CSV and PDF export. Use the widget action menu to download current filtered results or share a snapshot with your team.',
        },
        {
          question: 'Is the dashboard optimized for mobile use?',
          answer:
            'The interface is responsive and supports key management actions on mobile. For advanced analytics workflows, desktop is recommended for better visibility and controls.',
        },
      ],
    },
    {
      id: 'security',
      title: 'Security & Access',
      icon: 'shield-check',
      description:
        'Learn how user roles, audit logs, and authentication protect your admin environment.',
      questions: [
        {
          question: 'How do role-based permissions work?',
          answer:
            'Permissions are managed through role templates such as Admin, Manager, and Analyst. You can edit each role to control access to pages, actions, and sensitive records.',
        },
        {
          question: 'Can I enforce two-factor authentication for all users?',
          answer:
            'Yes. In Security Settings, enable mandatory two-factor authentication to require all active users to verify login with an authenticator app or one-time code.',
        },
        {
          question: 'Where can I review account activity?',
          answer:
            'Use the Audit Log page to track sign-ins, data exports, permission updates, and integration changes. Logs can be filtered by user, event type, and time range.',
        },
        {
          question: 'Does the platform support single sign-on?',
          answer:
            'Yes. SSO is available via SAML and OAuth providers. Once configured, users can authenticate with your identity provider and follow centralized access policies.',
        },
        {
          question: 'How can I revoke access for a departing team member?',
          answer:
            'Deactivate the account from the User Management page. This immediately blocks access while preserving action history for audit and compliance requirements.',
        },
      ],
    },
    {
      id: 'billing',
      title: 'Billing & Plans',
      icon: 'credit-card',
      description: 'Answers related to subscriptions, invoices, usage limits, and plan upgrades.',
      questions: [
        {
          question: 'How do I change my subscription plan?',
          answer:
            'Go to Billing, compare available tiers, and select Upgrade or Downgrade. Plan changes are prorated automatically and reflected on your next invoice.',
        },
        {
          question: 'Where can I download invoices?',
          answer:
            'All invoices are available in Billing History. You can download PDF copies and view payment status for each billing cycle.',
        },
        {
          question: 'What happens if I exceed my user or storage limit?',
          answer:
            'You will receive in-app and email alerts as you approach limits. You can purchase add-ons or upgrade your plan to avoid service interruptions.',
        },
        {
          question: 'Can I use separate billing contacts for accounting?',
          answer:
            'Yes. Add finance contacts in Billing Settings to receive invoices and renewal reminders without granting them full dashboard access.',
        },
        {
          question: 'Do you offer annual billing discounts?',
          answer:
            'Annual subscriptions include discounted pricing compared to monthly plans. The exact savings are displayed on the Pricing page before checkout.',
        },
      ],
    },
    {
      id: 'support',
      title: 'Support & Troubleshooting',
      icon: 'headphones',
      description: 'Get help with technical issues, incidents, and best-practice onboarding.',
      questions: [
        {
          question: 'How can I contact support from inside the dashboard?',
          answer:
            'Open the Help menu in the header and choose Live Chat or Submit Ticket. Include screenshots and steps to reproduce for faster troubleshooting.',
        },
        {
          question: 'What is your response time for support tickets?',
          answer:
            'Standard tickets are typically answered within 4 business hours. Critical incidents on eligible plans are prioritized with near real-time escalation.',
        },
        {
          question: 'Do you provide onboarding sessions for new teams?',
          answer:
            'Yes. We offer guided onboarding sessions that cover user setup, dashboard architecture, and reporting best practices tailored to your workflow.',
        },
        {
          question: 'What details should I include in a bug report?',
          answer:
            'Share the page URL, timestamp, affected user role, browser version, and expected versus actual behavior. This helps our team diagnose issues quickly.',
        },
        {
          question: 'Can I track platform incidents and maintenance windows?',
          answer:
            'Yes. Visit the status page linked in Help Center to monitor service health, subscribe to incident updates, and review scheduled maintenance notices.',
        },
      ],
    },
  ];

  protected readonly supportCards: SupportCard[] = [
    {
      title: 'Contact Technical Support',
      icon: 'message-circle',
      description:
        'Report platform issues, integration errors, or access problems. Our technical team can investigate logs and help you restore operations quickly.',
      buttonText: 'Open Support Ticket',
    },
    {
      title: 'Request Product Guidance',
      icon: 'phone',
      description:
        'Need help configuring dashboards, permissions, or analytics workflows? Schedule a walkthrough with a product specialist & solve your issues efficiently.',
      buttonText: 'Book a Session',
    },
    {
      title: 'Explore Admin Documentation',
      icon: 'book-open',
      description:
        'Browse setup guides, API references, release notes, and troubleshooting playbooks to resolve common admin tasks independently.',
      buttonText: 'View Documentation',
    },
  ];
}

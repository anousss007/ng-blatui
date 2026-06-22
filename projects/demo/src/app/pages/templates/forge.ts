import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { BuiBadge, BuiKbd, BuiMarquee, BuiSwitch } from 'ng-blatui';

import { Lucide } from './lucide';

interface Metric {
  label: string;
  value: number;
  display: string;
  tone: 'success' | 'warning';
}
interface Plan {
  name: string;
  m: number;
  y: number;
  tag: string;
  cta: string;
  highlight: boolean;
  features: string[];
}
interface CompareRow {
  feature: string;
  hobby: boolean | string;
  pro: boolean | string;
  ent: boolean | string;
}

/** Forge — dark developer deploy platform (GitHub-dark palette). Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-forge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiBadge, BuiKbd, BuiMarquee, BuiSwitch, Lucide],
  templateUrl: './forge.html',
  styleUrl: './forge.css',
})
export class ForgeTemplate {
  protected readonly yearly = signal(false);

  protected readonly nav = [
    { label: 'Docs', href: '#docs' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#changelog' },
  ];

  protected readonly logos = [
    'Vercel',
    'Linear',
    'Stripe',
    'Resend',
    'PlanetScale',
    'Clerk',
    'Neon',
    'Turso',
    'Railway',
    'Fly.io',
  ];

  protected readonly heroStats = [
    { v: '24k', l: 'GitHub stars' },
    { v: '300+', l: 'Edge PoPs' },
    { v: '99.99%', l: 'Uptime SLA' },
  ];

  protected readonly wideFeatureTags = [
    'Sub-20ms cold start',
    'Auto geo-routing',
    'HTTP/3 + QUIC',
    'Layer 7 WAF',
  ];

  protected readonly features = [
    {
      icon: 'rotate-ccw',
      title: 'Instant Rollbacks',
      desc: 'Every deploy is immutable. Roll back to any point in your history with a single command.',
    },
    {
      icon: 'git-branch',
      title: 'Preview Deploys',
      desc: 'Every pull request gets its own live URL. Share it with your team before you merge.',
    },
    {
      icon: 'terminal',
      title: 'Real-time Logs',
      desc: 'Stream logs from any deployment or function invocation directly in your terminal.',
    },
    {
      icon: 'shield',
      title: 'DDoS Protection',
      desc: 'Layer 3/4/7 mitigation at the edge. Rate-limiting, bot scoring, and WAF included.',
    },
    {
      icon: 'zap',
      title: 'Zero-config CI',
      desc: 'Push to any branch. Forge detects your framework and builds it — no YAML required.',
    },
  ];

  protected readonly codeTabs = [
    { key: 'js', label: 'JavaScript', filename: 'deploy.js' },
    { key: 'python', label: 'Python', filename: 'deploy.py' },
    { key: 'go', label: 'Go', filename: 'deploy.go' },
    { key: 'curl', label: 'cURL', filename: 'deploy.sh' },
  ];

  protected readonly codeJs = `import { ForgeClient } from '@forge/sdk';

const forge = new ForgeClient({
  token: process.env.FORGE_TOKEN,
});

const deploy = await forge.deployments.create({
  projectId: 'proj_xK9m2pQr',
  ref: 'main',
  env: {
    NODE_ENV: 'production',
    DATABASE_URL: process.env.DATABASE_URL,
  },
});

console.log(\`Deployed: \${deploy.url}\`);
// → https://myapp-a1b2c3.forge.sh`;

  protected readonly apiPoints = [
    'Full TypeScript types',
    'Auto-retry with exponential backoff',
    'Webhook events for every state change',
    'OpenAPI 3.1 spec always in sync',
  ];

  protected readonly cmdActions = [
    'Deploy',
    'Rollback',
    'View logs',
    'Env vars',
    'Team settings',
    'API tokens',
  ];

  protected readonly metrics: Metric[] = [
    { label: 'Global Uptime', value: 99.99, display: '99.99%', tone: 'success' },
    { label: 'P99 Latency (ms)', value: 82, display: '18ms P99', tone: 'success' },
    { label: 'Build Success Rate', value: 98.7, display: '98.7%', tone: 'success' },
    { label: 'CDN Cache Hit Rate', value: 94, display: '94%', tone: 'warning' },
  ];

  protected readonly plans: Plan[] = [
    {
      name: 'Hobby',
      m: 0,
      y: 0,
      tag: 'Personal projects',
      cta: 'Start free',
      highlight: false,
      features: [
        '3 projects',
        '100 GB bandwidth/mo',
        'Preview deploys',
        'Community support',
        'Custom domains',
      ],
    },
    {
      name: 'Pro',
      m: 20,
      y: 16,
      tag: 'Professional teams',
      cta: 'Start trial',
      highlight: true,
      features: [
        'Unlimited projects',
        '1 TB bandwidth/mo',
        'Team access (5 seats)',
        'Priority support',
        'Environment secrets',
        'Analytics',
      ],
    },
    {
      name: 'Enterprise',
      m: 0,
      y: 0,
      tag: 'Scale & compliance',
      cta: 'Contact us',
      highlight: false,
      features: [
        'Unlimited everything',
        'SLA 99.99%',
        'SSO / SAML',
        'Audit logs',
        'Dedicated infra',
        'Custom contracts',
      ],
    },
  ];

  protected readonly compare: CompareRow[] = [
    { feature: 'Custom domains', hobby: true, pro: true, ent: true },
    { feature: 'Preview deploys', hobby: true, pro: true, ent: true },
    { feature: 'Rollbacks', hobby: '3 days', pro: 'Unlimited', ent: 'Unlimited' },
    { feature: 'Team seats', hobby: '1', pro: '5', ent: 'Unlimited' },
    { feature: 'Bandwidth', hobby: '100 GB', pro: '1 TB', ent: 'Custom' },
    { feature: 'SSO / SAML', hobby: false, pro: false, ent: true },
    { feature: 'Audit logs', hobby: false, pro: false, ent: true },
    { feature: 'SLA', hobby: false, pro: '99.9%', ent: '99.99%' },
  ];

  protected readonly faqs = [
    {
      q: 'How does billing work?',
      a: 'Hobby is free forever. Pro is $20/mo (or $16/mo billed annually). You only pay once per workspace — adding more teammates does not increase your bill.',
    },
    {
      q: 'Can I migrate from another platform?',
      a: 'Yes. Run `npx forge migrate` in your project root. Forge detects your existing config (env vars, build commands, domains) and imports it automatically.',
    },
    {
      q: 'How do preview deploys work?',
      a: 'Every pull request and branch push triggers a fresh build on an isolated URL. Once you merge or close the PR, Forge automatically cleans up the environment.',
    },
    {
      q: 'What runtimes are supported?',
      a: 'Node.js (20, 22), Python (3.11, 3.12), Go (1.22+), Bun, Deno, and static sites. Edge Functions run on our V8 isolate runtime for sub-millisecond cold starts.',
    },
    {
      q: 'Is there a CLI?',
      a: 'Yes — `npm i -g @forge/cli`. It covers deploys, logs, env, rollbacks and secrets. It also ships a local dev server that mirrors the edge environment exactly.',
    },
  ];

  protected readonly footer = [
    { heading: 'Product', links: ['Features', 'Integrations', 'Changelog', 'Roadmap', 'Status'] },
    {
      heading: 'Developers',
      links: ['Docs', 'CLI Reference', 'SDK', 'API Reference', 'Templates'],
    },
    { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Customers', 'Contact'] },
    { heading: 'Legal', links: ['Privacy', 'Terms', 'Security', 'DPA', 'Cookies'] },
  ];

  protected readonly social = ['github', 'twitter', 'linkedin', 'youtube'];

  protected isBool(v: boolean | string): v is boolean {
    return typeof v === 'boolean';
  }
}

import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiChart, BuiRating, BuiSwitch, type ChartSeries } from 'ng-blatui';

import { Lucide } from './lucide';

interface Doctor {
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  seed: string;
  bio: string;
  languages: string[];
  available: string;
}
interface Plan {
  name: string;
  monthly: number;
  yearly: number;
  tag: string;
  cta: string;
  highlight: boolean;
  features: string[];
}

/** Pulse — telehealth / telemedicine platform, calm blue-mint light theme. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-pulse',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiChart, BuiRating, BuiSwitch, Lucide],
  templateUrl: './pulse.html',
  styleUrl: './pulse.css',
})
export class PulseTemplate {
  protected readonly yearly = signal(false);

  protected readonly navLinks = [
    { label: 'Specialties', href: '#specialties' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'Plans', href: '#plans' },
    { label: 'FAQ', href: '#faq' },
  ];

  protected readonly trustBadges = [
    { icon: 'shield-check', label: 'HIPAA Compliant' },
    { icon: 'lock', label: 'End-to-end encrypted' },
    { icon: 'award', label: 'Board-certified MDs' },
    { icon: 'clock', label: '24 / 7 care' },
  ];

  protected readonly heroAvatars = [
    { seed: 'doc1', alt: 'Dr. Amara Osei' },
    { seed: 'doc2', alt: 'Dr. Lena Park' },
    { seed: 'doc3', alt: 'Dr. Carlos Rivera' },
    { seed: 'doc4', alt: 'Dr. Sophie Nguyen' },
  ];

  protected readonly heroVitals = [
    { l: 'Heart Rate', v: '72 bpm', i: 'heart-pulse', c: '#ef4444' },
    { l: 'SpO2', v: '98%', i: 'activity', c: '#34d399' },
    { l: 'BP', v: '118/76', i: 'thermometer', c: '#0ea5e9' },
  ];

  protected readonly specialties = [
    {
      icon: 'heart-pulse',
      name: 'Cardiology',
      desc: 'Heart health checks, ECG review and chronic condition management.',
    },
    {
      icon: 'brain',
      name: 'Mental Health',
      desc: 'Therapy, counseling and psychiatric consultations — all remote.',
    },
    {
      icon: 'baby',
      name: 'Pediatrics',
      desc: 'Well-child visits, vaccinations and urgent care for little ones.',
    },
    {
      icon: 'bone',
      name: 'Orthopedics',
      desc: 'Sports injuries, joint pain and rehabilitation guidance.',
    },
    {
      icon: 'stethoscope',
      name: 'Primary Care',
      desc: 'Annual exams, sick visits and ongoing chronic disease management.',
    },
    {
      icon: 'eye',
      name: 'Ophthalmology',
      desc: 'Vision screening, eye-strain consults and referrals.',
    },
    {
      icon: 'pill',
      name: 'Dermatology',
      desc: 'Skin conditions, acne treatment and prescription renewals.',
    },
    {
      icon: 'activity',
      name: 'Nutrition',
      desc: 'Personalised diet plans and metabolic health coaching.',
    },
  ];

  protected readonly steps = [
    {
      title: 'Book in 60 seconds',
      desc: 'Choose a specialty, pick a slot and share your symptoms — no phone calls.',
      icon: 'calendar-check',
    },
    {
      title: 'Meet your doctor',
      desc: 'HD video visit on any device. Secure, private and recorded for your records.',
      icon: 'video',
    },
    {
      title: 'Get your care plan',
      desc: 'Prescriptions, referrals and follow-up notes delivered directly to your app.',
      icon: 'file-text',
    },
    {
      title: 'Stay connected',
      desc: 'Message your care team anytime, track your goals and book the next visit.',
      icon: 'message-circle',
    },
  ];

  protected readonly specialtyOptions = [
    'Cardiology',
    'Mental Health',
    'Pediatrics',
    'Orthopedics',
    'Primary Care',
    'Dermatology',
  ];

  protected readonly doctors: Doctor[] = [
    {
      name: 'Dr. Amara Osei',
      specialty: 'Cardiology',
      rating: 4.9,
      reviews: 214,
      seed: 'doc-amara',
      bio: 'Board-certified cardiologist with 14 years at Johns Hopkins. Sub-specialises in preventive heart health and heart failure management.',
      languages: ['English', 'French'],
      available: 'Today',
    },
    {
      name: 'Dr. Lena Park',
      specialty: 'Mental Health',
      rating: 5,
      reviews: 189,
      seed: 'doc-lena',
      bio: 'Licensed psychiatrist and CBT practitioner. Former faculty at UCSF. Passionate about eliminating stigma and making mental healthcare accessible.',
      languages: ['English', 'Korean'],
      available: 'Tomorrow',
    },
    {
      name: 'Dr. Carlos Rivera',
      specialty: 'Pediatrics',
      rating: 4.8,
      reviews: 302,
      seed: 'doc-carlos',
      bio: 'Pediatrician with 10 years in community health. Fluent in three languages, specialising in developmental milestones and adolescent medicine.',
      languages: ['English', 'Spanish', 'Portuguese'],
      available: 'Today',
    },
    {
      name: 'Dr. Sophie Nguyen',
      specialty: 'Dermatology',
      rating: 4.7,
      reviews: 147,
      seed: 'doc-sophie',
      bio: 'Dermatologist specialising in medical and cosmetic skin conditions. Certified in Mohs surgery and telederm consultations.',
      languages: ['English', 'Vietnamese'],
      available: 'In 2 days',
    },
  ];

  protected readonly healthGoals = [
    { label: 'Daily steps', value: 78, color: '#2563eb' },
    { label: 'Sleep quality', value: 85, color: '#34d399' },
    { label: 'Water intake', value: 62, color: '#0ea5e9' },
    { label: 'Mindfulness', value: 50, color: '#a78bfa' },
  ];

  protected readonly dashStats = [
    { l: 'Visits this month', v: '3', i: 'calendar' },
    { l: 'Prescriptions', v: '2', i: 'pill' },
    { l: 'Messages', v: '8', i: 'message-circle' },
  ];

  protected readonly chartSeries: ChartSeries[] = [
    { name: 'Heart Rate', data: [72, 75, 71, 78, 74, 70, 73, 76, 72, 69, 74, 71] },
  ];
  protected readonly chartLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  protected readonly testimonials = [
    {
      q: 'I saw a cardiologist within four hours of noticing chest tightness. The care was thorough, the prescription was in my pharmacy by evening. Pulse might have saved my life.',
      a: 'Marcus Holloway',
      role: 'Patient — Cardiology',
      img: 'https://picsum.photos/seed/pt-marcus/160/160',
    },
    {
      q: "As a mom of three I have zero time. Pulse means my kids get a pediatrician at 10 pm without a waiting-room nightmare. We've used it six times and it's perfect every time.",
      a: 'Yvonne Beaumont',
      role: 'Patient — Pediatrics',
      img: 'https://picsum.photos/seed/pt-yvonne/160/160',
    },
    {
      q: 'My therapist on Pulse truly listens. The notes she shares after each session are more thorough than anything I got in years of in-person care.',
      a: 'Dae-Jung Kim',
      role: 'Patient — Mental Health',
      img: 'https://picsum.photos/seed/pt-daejung/160/160',
    },
  ];

  protected readonly partners = [
    'BlueCross',
    'Aetna',
    'Cigna',
    'United',
    'Humana',
    'Kaiser',
    'Anthem',
    'Centene',
  ];

  protected readonly plans: Plan[] = [
    {
      name: 'Basic',
      monthly: 0,
      yearly: 0,
      tag: 'Always free',
      cta: 'Get started free',
      highlight: false,
      features: ['1 visit / month', 'Primary care only', 'Secure messaging', 'Visit notes PDF'],
    },
    {
      name: 'Care+',
      monthly: 29,
      yearly: 23,
      tag: 'Most popular',
      cta: 'Start 14-day trial',
      highlight: true,
      features: [
        'Unlimited visits',
        'All specialties',
        'Priority same-day slots',
        'Prescription delivery',
        'Health dashboard + goals',
      ],
    },
    {
      name: 'Family',
      monthly: 59,
      yearly: 47,
      tag: 'Up to 5 members',
      cta: 'Start 14-day trial',
      highlight: false,
      features: [
        'Everything in Care+',
        'Up to 5 profiles',
        'Shared family dashboard',
        'Child developmental tracking',
        'Dedicated care coordinator',
      ],
    },
  ];

  protected readonly faqs = [
    {
      q: 'Is Pulse real medical care?',
      a: 'Yes. Every consultation is conducted by a licensed, board-certified physician or credentialed therapist. Visit summaries and prescriptions are legally valid medical documents.',
    },
    {
      q: 'How quickly can I see a doctor?',
      a: 'Most appointments on Care+ are available same-day. Our median wait time from booking to consultation is under 90 minutes.',
    },
    {
      q: 'What if I need in-person care?',
      a: 'If your doctor determines you need an in-person exam or specialist visit, we provide a warm referral — including a summary note — to a provider near you.',
    },
    {
      q: 'Is my data private?',
      a: 'Pulse is fully HIPAA-compliant. All data is encrypted end-to-end and never shared with third parties for advertising or research without your explicit consent.',
    },
    {
      q: 'Do you accept insurance?',
      a: 'We accept most major US insurance plans including BlueCross, Aetna, Cigna, United and Humana. You can verify coverage during sign-up.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. No long-term commitment. Cancel from your settings with one click; you keep access until the end of your billing period.',
    },
  ];

  protected readonly footerLinks = [
    {
      heading: 'Patients',
      links: ['Find a doctor', 'Book a visit', 'My health records', 'Referrals', 'Insurance'],
    },
    {
      heading: 'Providers',
      links: [
        'Join as a doctor',
        'Credentialing',
        'Provider portal',
        'Billing & payouts',
        'Support',
      ],
    },
    { heading: 'Company', links: ['About Pulse', 'Careers', 'Press', 'Blog', 'Contact'] },
    {
      heading: 'Legal',
      links: [
        'Privacy policy',
        'Terms of service',
        'HIPAA notice',
        'Cookie settings',
        'Accessibility',
      ],
    },
  ];
  protected readonly socials = ['twitter', 'instagram', 'linkedin', 'youtube'];

  protected docInitial(name: string): string {
    return name.charAt(3).toUpperCase();
  }
  protected avatarInitial(alt: string): string {
    return alt.charAt(4).toUpperCase();
  }
}

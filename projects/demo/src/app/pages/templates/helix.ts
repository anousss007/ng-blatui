import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiChart, type ChartSeries } from 'ng-blatui';

import { Lucide } from './lucide';

interface PipelineStep {
  phase: string;
  code: string;
  target: string;
  status: 'active' | 'upcoming';
  pct: number;
  note: string;
}
interface ProcessTab {
  key: string;
  label: string;
  icon: string;
  title: string;
  desc: string;
  points: string[];
  img: string;
}

/** Helix — futuristic biotech / science startup, dark navy + neon. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-helix',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiChart, Lucide],
  templateUrl: './helix.html',
  styleUrl: './helix.css',
})
export class HelixTemplate {
  protected readonly navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Pipeline', href: '#pipeline' },
    { label: 'Data', href: '#data' },
    { label: 'Team', href: '#team' },
    { label: 'Publications', href: '#publications' },
    { label: 'Investors', href: '#investors' },
  ];

  protected readonly heroBadges = [
    'CRISPR-based editing',
    'Cell & gene therapy',
    'AI-driven discovery',
    'Series B — $210M',
  ];
  protected readonly heroStats = [
    { v: '5', l: 'Pipeline assets' },
    { v: '180+', l: 'Publications' },
    { v: '<0.01%', l: 'Off-target rate' },
  ];

  protected readonly platform = [
    {
      icon: 'dna',
      title: 'Genomic Precision',
      desc: 'Base-editing at single-nucleotide resolution with <0.01% off-target events, validated across 2,400 targets.',
      tag: 'Core tech',
      col: 'lg:col-span-2',
    },
    {
      icon: 'flask-conical',
      title: 'Cell Engineering',
      desc: 'Scalable CAR-T and iPSC manufacturing pipelines from concept to GMP batch in under 14 weeks.',
      tag: 'Manufacturing',
      col: '',
    },
    {
      icon: 'brain-circuit',
      title: 'AI Discovery Engine',
      desc: 'Proprietary ML models trained on 38 billion protein-sequence pairs predict therapeutic target druggability.',
      tag: 'AI / ML',
      col: '',
    },
    {
      icon: 'shield-check',
      title: 'Safety-by-Design',
      desc: 'Every candidate passes our 7-layer genotoxicity screen before entering the development queue.',
      tag: 'Safety',
      col: '',
    },
    {
      icon: 'microscope',
      title: 'In-House CRO',
      desc: 'Full-service preclinical suite: in vitro, in vivo, 14 species, bio-analytics, and regulatory documentation.',
      tag: 'Preclinical',
      col: 'lg:col-span-2',
    },
  ];

  protected readonly pipeline: PipelineStep[] = [
    {
      phase: 'Discovery',
      code: 'HLX-001',
      target: 'PCSK9 (Hypercholesterolaemia)',
      status: 'active',
      pct: 100,
      note: 'Lead candidate selected',
    },
    {
      phase: 'Preclinical',
      code: 'HLX-002',
      target: 'ANGPTL3 (Hypertriglyceridaemia)',
      status: 'active',
      pct: 80,
      note: 'NHP tox study Q3 2026',
    },
    {
      phase: 'IND-enabling',
      code: 'HLX-003',
      target: 'TTR (Transthyretin amyloidosis)',
      status: 'active',
      pct: 55,
      note: 'IND filing expected Q1 2027',
    },
    {
      phase: 'Phase I',
      code: 'HLX-004',
      target: 'ATTR-CM (Cardiomyopathy)',
      status: 'upcoming',
      pct: 20,
      note: 'Dose escalation planned',
    },
    {
      phase: 'Phase II/III',
      code: 'HLX-005',
      target: 'SCD-1 (Sickle Cell Disease)',
      status: 'upcoming',
      pct: 0,
      note: 'Partnership discussion',
    },
  ];

  protected readonly trialSeries: ChartSeries[] = [
    { name: 'HLX-002 (treated)', data: [12, 28, 44, 61, 74, 82, 87, 91, 93] },
    { name: 'Placebo', data: [10, 11, 12, 13, 12, 14, 13, 14, 15] },
  ];
  protected readonly trialLabels = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9'];

  protected readonly otSeries: ChartSeries[] = [
    { name: 'Off-target events', data: [0.008, 0.21, 0.54, 0.38] },
  ];
  protected readonly otLabels = ['Helix HLX', 'BE-Classic', 'Prime-Edit', 'Cas9-wt'];

  protected readonly dataMetrics = [
    { v: '93%', l: 'Max LDL-C reduction', c: 'blue' },
    { v: '0.008%', l: 'Off-target rate', c: 'mint' },
    { v: '32', l: 'NHP subjects', c: 'violet' },
    { v: '9 mo', l: 'Durable response', c: 'blue' },
  ];

  protected readonly team = [
    {
      name: 'Dr. Amara Osei',
      role: 'CEO & Co-founder',
      field: 'Molecular biology, Harvard PhD',
      img: 'https://picsum.photos/seed/helix-team1/200/200',
      pubs: 42,
      hindex: 19,
    },
    {
      name: 'Dr. Lena Voss',
      role: 'CSO',
      field: 'CRISPR engineering, MIT post-doc',
      img: 'https://picsum.photos/seed/helix-team2/200/200',
      pubs: 67,
      hindex: 24,
    },
    {
      name: 'Dr. Jin-Ho Park',
      role: 'CTO',
      field: 'Computational biology, Stanford PhD',
      img: 'https://picsum.photos/seed/helix-team3/200/200',
      pubs: 31,
      hindex: 15,
    },
    {
      name: 'Dr. Sofia Reyes',
      role: 'VP Clinical',
      field: 'Gene therapy trials, UCSF',
      img: 'https://picsum.photos/seed/helix-team4/200/200',
      pubs: 28,
      hindex: 12,
    },
    {
      name: 'Dr. Karim Nabil',
      role: 'VP Discovery',
      field: 'Protein engineering, Pasteur',
      img: 'https://picsum.photos/seed/helix-team5/200/200',
      pubs: 53,
      hindex: 21,
    },
    {
      name: 'Dr. Priya Mehta',
      role: 'Chief Science Officer Emeritus',
      field: 'Genomics & bioinformatics',
      img: 'https://picsum.photos/seed/helix-team6/200/200',
      pubs: 89,
      hindex: 33,
    },
  ];

  protected readonly publications = [
    {
      title: 'Single-base editing with sub-0.01% off-target frequency in primary human cells',
      journal: 'Nature Biotechnology',
      year: 2026,
      doi: '10.1038/nbt.xxxxx',
      impact: 46.9,
      type: 'Research article',
    },
    {
      title: 'AI-guided target identification accelerates rare-disease candidate selection',
      journal: 'Cell',
      year: 2025,
      doi: '10.1016/j.cell.xxxxxx',
      impact: 64.5,
      type: 'Research article',
    },
    {
      title: 'GMP-scale iPSC-derived CAR-T manufacturing: a 14-week protocol',
      journal: 'Nature Methods',
      year: 2025,
      doi: '10.1038/nmeth.xxxxx',
      impact: 48,
      type: 'Protocol',
    },
    {
      title: 'In vivo TTR silencing with lipid-nanoparticle-delivered base editors',
      journal: 'NEJM',
      year: 2025,
      doi: '10.1056/NEJMoa.xxxxx',
      impact: 176.1,
      type: 'Clinical brief',
    },
    {
      title: 'Safety-by-design: a 7-layer genotoxicity screening framework',
      journal: 'Nature Medicine',
      year: 2024,
      doi: '10.1038/nm.xxxxx',
      impact: 82.9,
      type: 'Methods',
    },
  ];

  protected readonly partners = [
    'Roche',
    'GSK',
    'Moderna',
    'BioNTech',
    'AstraZeneca',
    'Novartis',
    'Pfizer',
    'Sanofi',
    'Illumina',
    'BROAD Institute',
  ];

  protected readonly process: ProcessTab[] = [
    {
      key: 'identify',
      label: 'Identify',
      icon: 'search',
      title: 'AI-powered target identification',
      desc: 'Our HelixAI engine ingests multi-omics datasets from 180,000+ patient samples, ranks druggable targets by therapeutic index, and de-risks early pipeline decisions.',
      points: [
        'Multi-omics data fusion',
        'Therapeutic index ranking',
        'Competitive landscape mapping',
      ],
      img: 'https://picsum.photos/seed/helix-proc1/800/500',
    },
    {
      key: 'engineer',
      label: 'Engineer',
      icon: 'dna',
      title: 'Precision base editing',
      desc: 'Our proprietary editors achieve single-nucleotide resolution across diverse cell types. Automated delivery optimisation selects the best LNP or viral vector for each candidate.',
      points: ['Single-nucleotide precision', 'LNP + AAV delivery', 'Off-target <0.01%'],
      img: 'https://picsum.photos/seed/helix-proc2/800/500',
    },
    {
      key: 'validate',
      label: 'Validate',
      icon: 'flask-conical',
      title: 'Rapid in vivo validation',
      desc: 'A fully in-house preclinical suite compresses the path from lead candidate to IND-enabling package from 3 years to under 9 months via parallel study execution.',
      points: [
        'In-house GLP toxicology',
        'Parallel multi-species studies',
        'Integrated bioanalytics',
      ],
      img: 'https://picsum.photos/seed/helix-proc3/800/500',
    },
    {
      key: 'develop',
      label: 'Develop',
      icon: 'activity',
      title: 'Clinical development',
      desc: 'Helix operates as its own CRO for Phase I/II. Real-time genomic biomarker monitoring enables adaptive dose decisions and faster regulatory milestones.',
      points: ['Adaptive trial design', 'Genomic biomarker suite', 'FDA/EMA alignment'],
      img: 'https://picsum.photos/seed/helix-proc4/800/500',
    },
  ];

  protected readonly investors = [
    'a16z Bio',
    'Foresite Capital',
    'ARCH Venture',
    'GV',
    'Nextech Invest',
  ];
  protected readonly ctaStats = [
    { v: '5', l: 'Pipeline candidates' },
    { v: '$210M', l: 'Series B raised' },
    { v: '180+', l: 'Peer-reviewed papers' },
    { v: '14wk', l: 'Cell mfg cycle time' },
  ];

  protected readonly faqs = [
    {
      q: "What makes Helix's base editing different from first-generation approaches?",
      a: 'Our HelixEdit platform couples an optimised cytosine/adenine base editor with a proprietary guide-RNA design algorithm. The result is sub-0.01% off-target frequency — over 20× better than published Cas9 benchmarks — validated in primary human hepatocytes, HSCs, and T cells.',
    },
    {
      q: 'How does Helix protect against unintended bystander edits?',
      a: 'Every target undergoes our 7-layer bystander screen: in silico prediction, amplicon-seq, Digenome-seq, CIRCLE-seq, GUIDE-seq, long-read WGS, and blinded third-party validation. Only candidates clearing all seven gates advance.',
    },
    {
      q: "What is Helix's manufacturing strategy?",
      a: 'We run a fully integrated GMP facility in Cambridge, MA capable of producing autologous and allogeneic cell products. Our 14-week iPSC-to-infusion protocol has been validated for CAR-T, CAR-NK, and HSC programs.',
    },
    {
      q: 'Does Helix partner or out-license its technology?',
      a: 'Yes. We offer research licenses, co-development agreements, and full program acquisitions. Our partnership team can typically structure a term sheet within 8 weeks of first contact. Reach out at partnerships@helixbio.example.',
    },
    {
      q: 'When do you expect the first IND filing?',
      a: 'HLX-003 (TTR amyloidosis) is on track for an IND filing in Q1 2027, with HLX-004 (ATTR-CM) entering Phase I dose escalation shortly after, pending FDA feedback.',
    },
  ];

  protected readonly footer = [
    { heading: 'Science', links: ['Platform', 'Pipeline', 'Publications', 'Patents', 'Open data'] },
    { heading: 'Company', links: ['About', 'Careers', 'Press', 'Partners', 'Contact'] },
    { heading: 'Investors', links: ['Investor relations', 'Annual report', 'ESG', 'Governance'] },
    { heading: 'Legal', links: ['Privacy', 'Terms', 'Cookie policy', 'Compliance'] },
  ];
  protected readonly social = ['twitter', 'linkedin', 'github'];

  /** Pre-computed DNA double-helix dots + rungs (mirrors the PHP trig loop). */
  protected readonly helixNodes = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * 2 * Math.PI;
    const y = Math.round((index / 11) * (320 - 14));
    const x1 = Math.round(50 + 38 * Math.cos(angle));
    const x2 = Math.round(50 - 38 * Math.cos(angle));
    const isEven = index % 2 === 0;
    const delay = Math.round(index * 0.18 * 100) / 100;
    return {
      y,
      x1,
      x2,
      colorA: isEven ? '#2dd4ff' : '#7c5cff',
      colorB: isEven ? '#34e7b0' : '#7c5cff',
      rung: `linear-gradient(90deg, ${isEven ? '#2dd4ff' : '#7c5cff'}, ${isEven ? '#34e7b0' : '#2dd4ff'})`,
      animA: `helix-pulse ${2 + index * 0.1}s ${delay}s ease-in-out infinite`,
      animB: `helix-pulse ${2.3 + index * 0.1}s ${delay}s ease-in-out infinite`,
      animR: `helix-pulse ${3 + index * 0.05}s ${delay}s ease-in-out infinite`,
    };
  });

  protected initial(name: string): string {
    return name.charAt(3).toUpperCase();
  }
}

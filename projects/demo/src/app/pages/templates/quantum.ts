import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { BuiAvatar, BuiBadge, BuiChart, BuiKbd, type ChartSeries } from 'ng-blatui';

import { Lucide } from './lucide';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface Kpi {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  color: string;
  spark: string;
  prog: number;
}
interface Market {
  sym: string;
  name: string;
  price: string;
  change: string;
  tone: Tone;
  spark: string;
  init: string;
  color: string;
}
interface Activity {
  label: string;
  type: string;
  amount: string;
  time: string;
  tone: Tone;
  icon: string;
}
interface Step {
  n: number;
  title: string;
  desc: string;
  state: 'done' | 'active' | 'inactive';
}

/** Quantum — cyberpunk Web3 portfolio dashboard, neon-on-dark. Faithful port of the BlatUI original. */
@Component({
  selector: 'app-tpl-quantum',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [BuiAvatar, BuiBadge, BuiChart, BuiKbd, Lucide],
  templateUrl: './quantum.html',
  styleUrl: './quantum.css',
})
export class QuantumTemplate {
  protected readonly navItems = [
    { label: 'Portfolio', icon: 'pie-chart', active: true },
    { label: 'Markets', icon: 'bar-chart-2', active: false },
    { label: 'Swap', icon: 'arrow-left-right', active: false },
    { label: 'Staking', icon: 'layers', active: false },
    { label: 'Activity', icon: 'activity', active: false },
    { label: 'Settings', icon: 'settings', active: false },
  ];

  protected readonly kpis: Kpi[] = [
    {
      label: 'Total Balance',
      value: '$142,840.52',
      delta: '+8.34%',
      up: true,
      color: '#22d3ee',
      spark: '0,22 14,18 28,20 42,12 56,14 70,6 84,10 98,4 112,2',
      prog: 68,
    },
    {
      label: '24h P/L',
      value: '+$4,219.30',
      delta: '+3.04%',
      up: true,
      color: '#34d399',
      spark: '0,20 14,16 28,12 42,18 56,8 70,14 84,6 98,10 112,4',
      prog: 74,
    },
    {
      label: 'Staked',
      value: '$38,200.00',
      delta: '+0.18%',
      up: true,
      color: '#7c3aed',
      spark: '0,24 14,20 28,22 42,18 56,20 70,16 84,18 98,14 112,12',
      prog: 42,
    },
    {
      label: 'Rewards',
      value: '$1,048.77',
      delta: '-0.91%',
      up: false,
      color: '#ff2bd6',
      spark: '0,6 14,10 28,8 42,14 56,12 70,18 84,16 98,22 112,24',
      prog: 29,
    },
  ];

  protected readonly allocation = [
    { sym: 'ETH', name: 'Ethereum', pct: 42, color: '#22d3ee', init: 'E' },
    { sym: 'BTC', name: 'Bitcoin', pct: 28, color: '#f59e0b', init: 'B' },
    { sym: 'SOL', name: 'Solana', pct: 14, color: '#7c3aed', init: 'S' },
    { sym: 'ARB', name: 'Arbitrum', pct: 9, color: '#34d399', init: 'A' },
    { sym: 'MATIC', name: 'Polygon', pct: 7, color: '#ff2bd6', init: 'M' },
  ];

  /** Conic-gradient donut built from allocation (bui-chart has no donut type). */
  protected readonly donutGradient = (() => {
    let accumulator = 0;
    const parts = this.allocation.map((a) => {
      const start = accumulator;
      accumulator += a.pct;
      return `${a.color} ${start}% ${accumulator}%`;
    });
    return `conic-gradient(${parts.join(', ')})`;
  })();

  protected readonly markets: Market[] = [
    {
      sym: 'ETH',
      name: 'Ethereum',
      price: '$3,421.80',
      change: '+4.21',
      tone: 'success',
      spark: '0,28 14,22 28,24 42,16 56,14 70,6 84,8 98,2',
      init: 'E',
      color: '#22d3ee',
    },
    {
      sym: 'BTC',
      name: 'Bitcoin',
      price: '$67,840.00',
      change: '+2.18',
      tone: 'success',
      spark: '0,26 14,20 28,22 42,18 56,12 70,10 84,6 98,4',
      init: 'B',
      color: '#f59e0b',
    },
    {
      sym: 'SOL',
      name: 'Solana',
      price: '$183.44',
      change: '+7.55',
      tone: 'success',
      spark: '0,30 14,18 28,10 42,14 56,8 70,4 84,2 98,0',
      init: 'S',
      color: '#7c3aed',
    },
    {
      sym: 'ARB',
      name: 'Arbitrum',
      price: '$1.24',
      change: '-1.80',
      tone: 'danger',
      spark: '0,4 14,8 28,6 42,12 56,14 70,18 84,20 98,26',
      init: 'A',
      color: '#34d399',
    },
    {
      sym: 'MATIC',
      name: 'Polygon',
      price: '$0.844',
      change: '+0.92',
      tone: 'success',
      spark: '0,22 14,18 28,20 42,16 56,14 70,12 84,10 98,8',
      init: 'M',
      color: '#ff2bd6',
    },
    {
      sym: 'LINK',
      name: 'Chainlink',
      price: '$16.82',
      change: '-2.11',
      tone: 'danger',
      spark: '0,6 14,10 28,8 42,14 56,16 70,20 84,22 98,26',
      init: 'L',
      color: '#64748b',
    },
  ];

  protected readonly activity: Activity[] = [
    {
      label: 'Swapped ETH → USDC',
      type: 'swap',
      amount: '$2,400.00',
      time: '2m ago',
      tone: 'info',
      icon: 'arrow-left-right',
    },
    {
      label: 'Staked 4.2 SOL',
      type: 'stake',
      amount: '$772.45',
      time: '18m ago',
      tone: 'success',
      icon: 'layers',
    },
    {
      label: 'Received ARB Reward',
      type: 'reward',
      amount: '$48.20',
      time: '1h ago',
      tone: 'warning',
      icon: 'gift',
    },
    {
      label: 'Bought 0.05 BTC',
      type: 'buy',
      amount: '$3,392.00',
      time: '3h ago',
      tone: 'success',
      icon: 'trending-up',
    },
    {
      label: 'Withdrew MATIC',
      type: 'withdraw',
      amount: '$214.60',
      time: '5h ago',
      tone: 'danger',
      icon: 'arrow-up-right',
    },
    {
      label: 'LP Fees Claimed',
      type: 'fees',
      amount: '$31.08',
      time: '12h ago',
      tone: 'info',
      icon: 'coins',
    },
  ];

  protected readonly staking = [
    {
      pool: 'Ethereum 2.0',
      sym: 'ETH',
      apy: '4.2%',
      filled: 78,
      color: '#22d3ee',
      staked: '32.0 ETH',
      unlock: '~12 days',
    },
    {
      pool: 'Solana',
      sym: 'SOL',
      apy: '6.8%',
      filled: 55,
      color: '#7c3aed',
      staked: '120.0 SOL',
      unlock: '~2 days',
    },
    {
      pool: 'Polygon',
      sym: 'MATIC',
      apy: '8.4%',
      filled: 33,
      color: '#ff2bd6',
      staked: '5,000 MATIC',
      unlock: '~30 days',
    },
  ];

  protected readonly steps: Step[] = [
    { n: 1, title: 'Connect Wallet', desc: 'MetaMask linked', state: 'done' },
    { n: 2, title: 'Fund Account', desc: 'Deposit assets', state: 'active' },
    { n: 3, title: 'Enable 2FA', desc: 'Secure your account', state: 'inactive' },
    { n: 4, title: 'Set Alerts', desc: 'Price & liquidation', state: 'inactive' },
  ];

  protected readonly chartRanges = ['1D', '1W', '1M', '1Y'];

  protected readonly portfolioSeries: ChartSeries[] = [
    {
      name: 'Portfolio',
      data: [
        98_200, 101_400, 99_800, 104_200, 108_600, 112_000, 109_800, 115_200, 119_400, 123_800,
        118_600, 128_400, 131_200, 135_600, 142_840,
      ],
    },
    {
      name: 'BTC Weight',
      data: [
        38_200, 39_400, 37_800, 40_200, 42_600, 44_000, 42_800, 45_200, 47_400, 50_800, 47_600,
        53_400, 55_200, 58_600, 61_840,
      ],
    },
  ];
  protected readonly portfolioLabels = [
    'Jun 28',
    'Jun 29',
    'Jun 30',
    'Jul 1',
    'Jul 2',
    'Jul 3',
    'Jul 4',
    'Jul 5',
    'Jul 6',
    'Jul 7',
    'Jul 8',
    'Jul 9',
    'Jul 10',
    'Jul 11',
    'Jul 12',
  ];

  protected readonly volumeSeries: ChartSeries[] = [
    { name: 'Buy', data: [12_400, 18_900, 9200, 22_100, 15_800, 28_400, 19_600] },
    { name: 'Sell', data: [8200, 14_100, 7400, 16_800, 12_200, 21_000, 14_800] },
  ];
  protected readonly volumeLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  protected readonly accountStats = [
    { l: 'All-time P/L', v: '+$22,418.40', c: '#34d399' },
    { l: 'Best trade', v: '+$8,102 ETH', c: '#22d3ee' },
    { l: 'Win rate', v: '68.4%', c: '#7c3aed' },
    { l: 'Trades this week', v: '14', c: '#ff2bd6' },
    { l: 'Gas spent (30d)', v: '$214.50', c: '#f59e0b' },
  ];
}

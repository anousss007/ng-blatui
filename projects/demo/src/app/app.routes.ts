import { type Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () => (await import('./pages/introduction')).Introduction,
    title: 'ng-blatui — accessible Angular UI components',
  },
  {
    path: 'docs/installation',
    loadComponent: async () => (await import('./pages/installation')).Installation,
    title: 'Installation · ng-blatui',
  },
  {
    path: 'docs/theming',
    loadComponent: async () => (await import('./pages/theming')).Theming,
    title: 'Theming · ng-blatui',
  },
  {
    path: 'docs/ai',
    loadComponent: async () => (await import('./pages/ai')).AiGuide,
    title: 'AI & MCP · ng-blatui',
  },
  {
    path: 'components',
    loadComponent: async () => (await import('./pages/components-index')).ComponentsIndex,
    title: 'Components · ng-blatui',
  },
  {
    path: 'components/:slug',
    loadComponent: async () => (await import('./pages/components')).ComponentPage,
    title: 'Components · ng-blatui',
  },
  {
    path: 'blocks',
    loadComponent: async () => (await import('./pages/blocks-index')).BlocksIndex,
    title: 'Blocks · ng-blatui',
  },
  {
    path: 'blocks/:slug',
    loadComponent: async () => (await import('./pages/blocks')).BlocksPage,
    title: 'Blocks · ng-blatui',
  },
  {
    path: 'templates',
    loadComponent: async () => (await import('./pages/templates-index')).TemplatesIndex,
    title: 'Templates · ng-blatui',
  },
  {
    path: 'templates/aurora',
    loadComponent: async () => (await import('./pages/templates/aurora')).AuroraTemplate,
    title: 'Aurora · ng-blatui',
  },
  {
    path: 'templates/cosmos',
    loadComponent: async () => (await import('./pages/templates/cosmos')).CosmosTemplate,
    title: 'Cosmos · ng-blatui',
  },
  {
    path: 'templates/prism',
    loadComponent: async () => (await import('./pages/templates/prism')).PrismTemplate,
    title: 'Prism · ng-blatui',
  },
  {
    path: 'templates/lumen',
    loadComponent: async () => (await import('./pages/templates/lumen')).LumenTemplate,
    title: 'Lumen · ng-blatui',
  },
  {
    path: 'templates/atlas',
    loadComponent: async () => (await import('./pages/templates/atlas')).AtlasTemplate,
    title: 'Atlas · ng-blatui',
  },
  {
    path: 'templates/bloom',
    loadComponent: async () => (await import('./pages/templates/bloom')).BloomTemplate,
    title: 'Bloom · ng-blatui',
  },
  {
    path: 'templates/brew',
    loadComponent: async () => (await import('./pages/templates/brew')).BrewTemplate,
    title: 'Brew · ng-blatui',
  },
  {
    path: 'templates/brut',
    loadComponent: async () => (await import('./pages/templates/brut')).BrutTemplate,
    title: 'Brut · ng-blatui',
  },
  {
    path: 'templates/forge',
    loadComponent: async () => (await import('./pages/templates/forge')).ForgeTemplate,
    title: 'Forge · ng-blatui',
  },
  {
    path: 'templates/helix',
    loadComponent: async () => (await import('./pages/templates/helix')).HelixTemplate,
    title: 'Helix · ng-blatui',
  },
  {
    path: 'templates/mono',
    loadComponent: async () => (await import('./pages/templates/mono')).MonoTemplate,
    title: 'Mono · ng-blatui',
  },
  {
    path: 'templates/pulse',
    loadComponent: async () => (await import('./pages/templates/pulse')).PulseTemplate,
    title: 'Pulse · ng-blatui',
  },
  {
    path: 'templates/quantum',
    loadComponent: async () => (await import('./pages/templates/quantum')).QuantumTemplate,
    title: 'Quantum · ng-blatui',
  },
  {
    path: 'templates/sprout',
    loadComponent: async () => (await import('./pages/templates/sprout')).SproutTemplate,
    title: 'Sprout · ng-blatui',
  },
  {
    path: 'templates/terroir',
    loadComponent: async () => (await import('./pages/templates/terroir')).TerroirTemplate,
    title: 'Terroir · ng-blatui',
  },
  {
    path: 'templates/verdure',
    loadComponent: async () => (await import('./pages/templates/verdure')).VerdureTemplate,
    title: 'Verdure · ng-blatui',
  },
  {
    path: 'templates/vinyl',
    loadComponent: async () => (await import('./pages/templates/vinyl')).VinylTemplate,
    title: 'Vinyl · ng-blatui',
  },
  {
    path: 'templates/arcade',
    loadComponent: async () => (await import('./pages/templates/arcade')).ArcadeTemplate,
    title: 'Arcade · ng-blatui',
  },
  {
    path: 'templates/atelier',
    loadComponent: async () => (await import('./pages/templates/atelier')).AtelierTemplate,
    title: 'Atelier · ng-blatui',
  },
  {
    path: 'templates/estate',
    loadComponent: async () => (await import('./pages/templates/estate')).EstateTemplate,
    title: 'Estate · ng-blatui',
  },
  {
    path: 'templates/auth',
    loadComponent: async () => (await import('./pages/templates/auth')).AuthTemplate,
    title: 'Auth · ng-blatui',
  },
  {
    path: 'templates/pricing',
    loadComponent: async () => (await import('./pages/templates/pricing')).PricingTemplate,
    title: 'Pricing · ng-blatui',
  },
  {
    path: 'templates/dashboard',
    loadComponent: async () => (await import('./pages/templates/dashboard')).DashboardTemplate,
    title: 'Dashboard · ng-blatui',
  },
  {
    path: 'templates/blog',
    loadComponent: async () => (await import('./pages/templates/blog')).BlogTemplate,
    title: 'Blog · ng-blatui',
  },
  {
    path: 'templates/store',
    loadComponent: async () => (await import('./pages/templates/store')).StoreTemplate,
    title: 'Store · ng-blatui',
  },
  {
    path: 'templates/saas',
    loadComponent: async () => (await import('./pages/templates/saas')).SaasTemplate,
    title: 'SaaS · ng-blatui',
  },
  {
    path: 'templates/docs-site',
    loadComponent: async () => (await import('./pages/templates/docs-site')).DocsSiteTemplate,
    title: 'Docs Site · ng-blatui',
  },
  {
    path: 'templates/help-center',
    loadComponent: async () => (await import('./pages/templates/help-center')).HelpCenterTemplate,
    title: 'Help Center · ng-blatui',
  },
  {
    path: 'templates/product',
    loadComponent: async () => (await import('./pages/templates/product')).ProductTemplate,
    title: 'Product · ng-blatui',
  },
  {
    path: 'templates/crm',
    loadComponent: async () => (await import('./pages/templates/crm')).CrmTemplate,
    title: 'CRM · ng-blatui',
  },
  {
    path: 'templates/account',
    loadComponent: async () => (await import('./pages/templates/account')).AccountTemplate,
    title: 'Account · ng-blatui',
  },
  {
    path: 'templates/agency',
    loadComponent: async () => (await import('./pages/templates/agency')).AgencyTemplate,
    title: 'Agency · ng-blatui',
  },
  {
    path: 'templates/startup',
    loadComponent: async () => (await import('./pages/templates/startup')).StartupTemplate,
    title: 'Startup · ng-blatui',
  },
  {
    path: 'templates/event',
    loadComponent: async () => (await import('./pages/templates/event')).EventTemplate,
    title: 'Event · ng-blatui',
  },
  {
    path: 'templates/admincn',
    loadComponent: async () => (await import('./pages/templates/admincn')).AdmincnTemplate,
    title: 'AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/finance',
    loadComponent: async () => (await import('./pages/templates/admincn-finance')).AdmincnFinance,
    title: 'Finance · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/analytics',
    loadComponent: async () =>
      (await import('./pages/templates/admincn-analytics')).AdmincnAnalytics,
    title: 'Analytics · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/ecommerce',
    loadComponent: async () =>
      (await import('./pages/templates/admincn-ecommerce')).AdmincnEcommerce,
    title: 'eCommerce · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/logistics',
    loadComponent: async () =>
      (await import('./pages/templates/admincn-logistics')).AdmincnLogistics,
    title: 'Logistics · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/orders',
    loadComponent: async () => (await import('./pages/templates/admincn-orders')).AdmincnOrders,
    title: 'Orders · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/payments',
    loadComponent: async () => (await import('./pages/templates/admincn-payments')).AdmincnPayments,
    title: 'Payments · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/productivity',
    loadComponent: async () =>
      (await import('./pages/templates/admincn-productivity')).AdmincnProductivity,
    title: 'Productivity · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/campaign',
    loadComponent: async () => (await import('./pages/templates/admincn-campaign')).AdmincnCampaign,
    title: 'Campaign · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/mail',
    loadComponent: async () => (await import('./pages/templates/admincn-mail')).AdmincnMail,
    title: 'Mail · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/chat',
    loadComponent: async () => (await import('./pages/templates/admincn-chat')).AdmincnChat,
    title: 'Chat · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/kanban',
    loadComponent: async () => (await import('./pages/templates/admincn-kanban')).AdmincnKanban,
    title: 'Kanban · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/calendar',
    loadComponent: async () => (await import('./pages/templates/admincn-calendar')).AdmincnCalendar,
    title: 'Calendar · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/contact',
    loadComponent: async () => (await import('./pages/templates/admincn-contact')).AdmincnContact,
    title: 'Contact · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/datatable',
    loadComponent: async () =>
      (await import('./pages/templates/admincn-datatable')).AdmincnDatatable,
    title: 'Data Table · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/form-validation',
    loadComponent: async () =>
      (await import('./pages/templates/admincn-form-validation')).AdmincnFormValidation,
    title: 'Form Validation · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/faq',
    loadComponent: async () => (await import('./pages/templates/admincn-faq')).AdmincnFaq,
    title: 'FAQ · AdminCN · ng-blatui',
  },
  {
    path: 'templates/admincn/pricing',
    loadComponent: async () => (await import('./pages/templates/admincn-pricing')).AdmincnPricing,
    title: 'Pricing · AdminCN · ng-blatui',
  },
  {
    path: 'templates/:slug',
    loadComponent: async () => (await import('./pages/templates')).TemplatesPage,
    title: 'Templates · ng-blatui',
  },
  {
    path: 'charts',
    loadComponent: async () => (await import('./pages/charts-index')).ChartsIndex,
    title: 'Charts · ng-blatui',
  },
  {
    path: 'charts/:slug',
    loadComponent: async () => (await import('./pages/charts')).ChartViewer,
    title: 'Charts · ng-blatui',
  },
  {
    path: 'themes',
    loadComponent: async () => (await import('./pages/themes')).Themes,
    title: 'Themes · ng-blatui',
  },
  { path: '**', redirectTo: '' },
];

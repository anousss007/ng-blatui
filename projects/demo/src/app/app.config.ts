import { type ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { provideBuiLocale } from 'ng-blatui';

import { routes } from './app.routes';
import { DemoLocale } from './ui/demo-locale';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // The site formats through the same provider it documents. A factory, because the locale
    // lives in a signal owned by a service — which is exactly how a translation library's own
    // service is reached.
    provideBuiLocale(() => inject(DemoLocale).locale),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
  ],
};

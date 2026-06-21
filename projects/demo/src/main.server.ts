import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';

import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext): Promise<unknown> =>
  bootstrapApplication(App, config, context);

export default bootstrap;

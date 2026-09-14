/**
 * PROTOTYPE ENTRY, REVIEW ONLY. NOT DEPLOYED.
 *
 * Boots the Conveyor shell with a fixture user, organization and program, no
 * API and no login, so the Scheduled Insights work can be reviewed on its own.
 * Insights > Scheduled (and its Settings twin) are real; every other page is a
 * placeholder. Run with:
 *
 *   APP_PACKAGE=app-prototype PORT=8010 make dev
 */
import 'styles/design-tokens.css';
import 'styles/react-components.css';
import 'styles/arrow-ds.css';
import 'styles/index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { MAIN_APP_SELECTOR } from '@comply/context-utils';
import '../app-comply/i18n';
import { PrototypeApp } from './app';
import { startMocks } from './mocks';

const container = document.querySelector(MAIN_APP_SELECTOR);
if (container) {
  // Mocks first, so the dashboard's first requests are answered with fixtures.
  // Chart.js is registered the same way the app does it in root.tsx, so the
  // dashboard charts have their scales and plugins.
  const boot = async () => {
    await startMocks();
    const [
      { Chart: ChartJS },
      ,
      { default: annotationPlugin },
      { default: dataLabelPlugin },
    ] = await Promise.all([
      import('chart.js'),
      import('chart.js/auto'),
      import('chartjs-plugin-annotation'),
      import('chartjs-plugin-datalabels'),
    ]);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore no types for chartjs-adapter-date-fns
    await import('chartjs-adapter-date-fns');
    ChartJS.register([annotationPlugin, dataLabelPlugin]);
    ChartJS.defaults.set('plugins.datalabels', { display: false });
    createRoot(container).render(React.createElement(PrototypeApp));
  };
  void boot();
}

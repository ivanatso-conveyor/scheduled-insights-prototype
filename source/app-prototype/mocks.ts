/**
 * Browser-side network mocks for the prototype (msw). Only the two requests
 * the Insights dashboard makes directly are answered; everything else passes
 * through and fails quietly, which is what a fixture-only shell wants.
 */
import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import {
  buildBillingCredits,
  buildQuestionnaireStats,
} from './dashboard-fixtures';

const handlers = [
  http.get('*/programs/:programId/questionnaires_stats', () =>
    HttpResponse.json(buildQuestionnaireStats()),
  ),
  http.get('*programs/:programId/billing_credits', () =>
    HttpResponse.json(buildBillingCredits()),
  ),
];

/** Resolves once the service worker is ready, or immediately if it cannot start. */
export const startMocks = async (): Promise<void> => {
  try {
    await setupWorker(...handlers).start({
      onUnhandledRequest: 'bypass',
      quiet: true,
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  } catch (e) {
    // The dashboard then shows its empty states; the rest of the prototype is unaffected.
    // eslint-disable-next-line no-console
    console.warn('Prototype mocks did not start', e);
  }
};

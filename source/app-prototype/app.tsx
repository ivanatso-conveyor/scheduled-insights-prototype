/**
 * The prototype shell: real Nav, real Insights > Scheduled, placeholders for
 * the rest. Store is the app's rootReducer seeded with test fixtures and no
 * sagas, so nothing ever reaches an API. See init-app.ts.
 */
import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Helmet } from 'react-helmet';
import { AppShell } from '@conveyorhq/react-components';
import { Toaster } from '@conveyorhq/arrow-ds';
import {
  INSIGHTS_PATH,
  INSIGHTS_SCHEDULED_PATH,
  insightsScheduledUrl,
  SETTINGS_PATH,
  settingsPageUrl,
} from '@comply/routes';
import { State } from '@comply/types';
import { CURRENT_USER_NAME, defaultUser, USERS_NAME } from '@comply/users';
import {
  defaultQuestionnaire,
  QUESTIONNAIRE_SLICE,
} from '@comply/questionnaires';
import {
  defaultDocument,
  EXCHANGE_DOCUMENTS_NAME,
} from '@comply/exchange-documents';
import { defaultVsaQuestion, VSA_QUESTIONS_SLICE } from '@comply/vsa-questions';
import { defaultOrganization, ORGANIZATIONS_NAME } from '@comply/organizations';
import { rootReducer } from '@comply/app-comply';
import { setupBasicState, setupStateWithDataroom } from '@comply/test/state';
import { ModalPortal, TakeoverPortal } from '@comply/ui';
import { Nav } from '../ui/nav/nav';
import { SettingsNav } from '../ui/settings/page-settings/settings-nav';
import { PageWorkflowAutomationScheduledReportsSettings } from '../ui/settings/page-settings/pages/page-workflow-automation-scheduled-reports';
import { ScheduledInsightsPage } from '../ui/scheduled-insights';
import DashboardInsightsPage from '../ui/dashboard/page-insights';
import { PlaceholderPage } from './placeholder-page';

const ME = defaultUser({
  id: 'userId',
  email: 'ivana.tso@conveyor.com',
  name: 'Ivana Tso',
  verified: true,
});

/**
 * Fixture state: a verified owner in an org with a program and a Trust Center,
 * plus a few questionnaires, documents and questions so the Insights dashboard
 * shows its charts instead of its "get started" previews.
 */
const buildState = (): Partial<State> => {
  const { state, program, dataroom } = setupStateWithDataroom(
    setupBasicState(),
  );
  const orgs = state[ORGANIZATIONS_NAME] ?? {};
  const orgId = Object.keys(orgs)[0];
  const questionnaires = [
    ['Northwind security review', 148],
    ['Acme vendor assessment', 212],
    ['Globex SIG Lite', 96],
    ['Initech RFP', 340],
  ].map(([name, questionCount], i) =>
    defaultQuestionnaire({
      id: `qn-${i}`,
      name: String(name),
      customerName: String(name).split(' ')[0],
      programId: program.id,
      questionCount: Number(questionCount),
      questionsCompleted: Number(questionCount),
    }),
  );
  const documents = [
    'SOC 2 Type II Report',
    'Penetration Test Summary 2026',
    'Information Security Policy',
    'Data Processing Addendum',
    'Business Continuity Plan',
    'ISO 27001 Certificate',
  ].map((name, i) =>
    defaultDocument({ id: `doc-${i}`, name, dataroomId: dataroom.id }),
  );
  const questions = Array.from({ length: 24 }, (_, i) =>
    defaultVsaQuestion({
      id: `vsa-${i}`,
      programId: program.id,
      dataroomId: dataroom.id,
    }),
  );
  return {
    ...state,
    [QUESTIONNAIRE_SLICE]: Object.fromEntries(
      questionnaires.map((q) => [q.id, q]),
    ),
    [EXCHANGE_DOCUMENTS_NAME]: Object.fromEntries(
      documents.map((d) => [d.id, d]),
    ),
    [VSA_QUESTIONS_SLICE]: Object.fromEntries(questions.map((q) => [q.id, q])),
    [ORGANIZATIONS_NAME]: orgId
      ? { [orgId]: defaultOrganization({ ...orgs[orgId], name: 'Conveyor' }) }
      : orgs,
    [CURRENT_USER_NAME]: ME,
    // The directory entry for the same id, so recipients and "Only me" show Ivana too.
    [USERS_NAME]: { ...(state[USERS_NAME] ?? {}), [ME.id]: ME },
  };
};

const SCHEDULED_REPORTS_SETTINGS_PATH = settingsPageUrl(
  'workflow-automation',
  'scheduled-reports',
);

export const PrototypeApp = () => {
  const store = useMemo(() => {
    const created = configureStore({
      reducer: rootReducer,
      preloadedState: buildState(),
      middleware: (getDefault) => getDefault({ serializableCheck: false }),
    });
    (window as any).reduxStore = created;
    return created;
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Helmet
          titleTemplate="%s - Conveyor (prototype)"
          defaultTitle="Conveyor (prototype)"
        />
        <TakeoverPortal />
        <ModalPortal />
        <Toaster />
        <AppShell>
          <Nav.Root>
            <Route path={SETTINGS_PATH}>
              <AppShell.Area name="navbar">
                <SettingsNav />
              </AppShell.Area>
            </Route>
            <Route path="/" exact={false}>
              {({ location }) =>
                location.pathname.startsWith(SETTINGS_PATH) ? null : (
                  <AppShell.Area name="navbar">
                    <Nav.Drawer />
                  </AppShell.Area>
                )
              }
            </Route>
            <Switch>
              <Route exact path="/">
                <Redirect to={insightsScheduledUrl()} />
              </Route>
              <Route exact path={INSIGHTS_PATH}>
                <DashboardInsightsPage />
              </Route>
              <Route exact path={INSIGHTS_SCHEDULED_PATH}>
                <ScheduledInsightsPage />
              </Route>
              <Route exact path={SCHEDULED_REPORTS_SETTINGS_PATH}>
                <PageWorkflowAutomationScheduledReportsSettings />
              </Route>
              <Route path="*">
                <PlaceholderPage />
              </Route>
            </Switch>
          </Nav.Root>
        </AppShell>
      </BrowserRouter>
    </Provider>
  );
};

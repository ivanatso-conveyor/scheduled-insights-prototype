/**
 * Fixture data for the Insights dashboard in the prototype. Twelve months of
 * plausible numbers, generated relative to today so the charts always fall
 * inside the default "last 12 months" range. Shapes follow
 * QuestionnaireStatsResponse and the billing credits response exactly.
 */
import { format, subMonths } from 'date-fns';
import { QuestionnaireStatsResponse } from '@comply/types';

/** Deterministic pseudo-random in [0, 1) so the numbers look varied but stable. */
const noise = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const months = (): { key: string; month: string; index: number }[] =>
  Array.from({ length: 12 }, (_, i) => {
    const d = subMonths(new Date(), 11 - i);
    const month = format(d, 'yyyy-MM-01');
    return { key: `${month} 00:00:00 UTC`, month, index: i };
  });

const TEAM = [
  ['u-ivana', 'ivana.tso@conveyor.com'],
  ['u-anner', 'anner@conveyor.com'],
  ['u-brandon', 'brandon@conveyor.com'],
  ['u-joe', 'joe@conveyor.com'],
  ['u-priya', 'priya@conveyor.com'],
];

const DOMAINS = [
  'northwind.io',
  'acme.com',
  'globex.co',
  'initech.com',
  'umbrella.health',
  'stark.industries',
  'wayne.enterprises',
];

export const buildQuestionnaireStats = (): QuestionnaireStatsResponse => {
  const ms = months();
  const stats: QuestionnaireStatsResponse = {
    auto_grader_results: {},
    average_completed_time_large_questionnaires: {},
    average_completed_time_medium_questionnaires: {},
    average_completed_time_small_questionnaires: {},
    average_questions_per_questionnaire: {},
    completed: {},
    created: {},
    team_members_self_served_history: {},
    one_off_searches_history: {},
    trust_center_ai_stats: {},
    trust_center_ai_top_connections: {},
    visitors_to_trust_center: {},
    content_interaction_in_trust_center: {},
    connection_tracking_events: [],
    question_tracking_events: [],
    document_tracking_events: [],
  };

  ms.forEach(({ key, month, index }) => {
    const n = noise(index + 1);
    const created = 6 + Math.round(n * 9);
    const completed = Math.max(
      3,
      created - 1 - Math.round(noise(index + 7) * 3),
    );
    const questions = completed * (110 + Math.round(noise(index + 3) * 60));
    const botAnswered = Math.round(questions * 0.82);
    const perfect = Math.round(botAnswered * (0.58 + noise(index + 5) * 0.12));
    const accurateEdited = Math.round(botAnswered * 0.24);
    const inaccurate = Math.max(0, botAnswered - perfect - accurateEdited);

    stats.auto_grader_results[key] = {
      'questionnaires.completed_month': key,
      'questionnaire_questions.question_count': questions,
      'questionnaire_questions.bot_answered_count': botAnswered,
      'questionnaire_questions.bot_unedited_count': perfect,
      'questionnaire_questions.bot_answered_accurately_count':
        perfect + accurateEdited,
      'questionnaire_questions.bot_unanswered_count': questions - botAnswered,
      'questionnaire_questions.bot_perfect_answer_count': perfect,
      'questionnaire_questions.bot_accurate_edited_count': accurateEdited,
      'questionnaire_questions.bot_inaccurate_count': inaccurate,
    };
    stats.average_completed_time_small_questionnaires[key] = (
      1.2 +
      noise(index + 11) * 1.4
    ).toFixed(1);
    stats.average_completed_time_medium_questionnaires[key] = (
      3.1 +
      noise(index + 13) * 2.2
    ).toFixed(1);
    stats.average_completed_time_large_questionnaires[key] = (
      6.4 +
      noise(index + 17) * 3.5
    ).toFixed(1);
    stats.average_questions_per_questionnaire[key] = String(
      Math.round(questions / completed),
    );
    stats.completed[key] = completed;
    stats.created[key] = created;

    const searches = 40 + Math.round(noise(index + 19) * 70);
    stats.one_off_searches_history[key] = {
      completed_month: month,
      extension_count: Math.round(searches * 0.35),
      slack_count: Math.round(searches * 0.3),
      web_app_count: Math.round(searches * 0.3),
      api_count: Math.round(searches * 0.05),
      user_count: 4 + Math.round(noise(index + 23) * 6),
    };

    const tcQuestions = 30 + Math.round(noise(index + 29) * 60);
    stats.trust_center_ai_stats[key] = {
      bot_answered_question_count: Math.round(tcQuestions * 0.78),
      bot_unanswered_question_count: Math.round(tcQuestions * 0.22),
      connection_count: 9 + Math.round(noise(index + 31) * 14),
      created_month: month,
      user_count: 12 + Math.round(noise(index + 37) * 18),
    };
    stats.visitors_to_trust_center[key] = {
      connection_count: 18 + Math.round(noise(index + 41) * 22),
      month,
      visitor_count: 120 + Math.round(noise(index + 43) * 160),
    };
    stats.content_interaction_in_trust_center[key] = {
      document_count: 60 + Math.round(noise(index + 47) * 90),
      month,
      qa_count: 25 + Math.round(noise(index + 53) * 40),
      self_serve_count: 15 + Math.round(noise(index + 59) * 30),
    };
  });

  TEAM.forEach(([id, email], i) => {
    stats.team_members_self_served_history[id] = {
      user_id: id,
      email,
      extension_count: 30 + Math.round(noise(i + 61) * 80),
      slack_count: 20 + Math.round(noise(i + 67) * 60),
      web_app_count: 25 + Math.round(noise(i + 71) * 70),
      api_count: Math.round(noise(i + 73) * 10),
    };
  });

  DOMAINS.forEach((domain, i) => {
    stats.trust_center_ai_top_connections[domain] = {
      connection_domain: domain,
      question_count: 8 + Math.round(noise(i + 79) * 40),
    };
    stats.connection_tracking_events.push({
      connection_id: `conn-${i}`,
      connection_domain: domain,
      latest_activity: subMonths(new Date(), i % 3).toISOString(),
      interactions_count: 12 + Math.round(noise(i + 83) * 60),
    });
  });

  [
    'Do you encrypt data at rest and in transit?',
    'Where is customer data hosted?',
    'Do you hold a SOC 2 Type II report?',
    'How do you handle subprocessor changes?',
    'What is your incident response SLA?',
    'Do you support SSO and SCIM?',
  ].forEach((name, i) => {
    stats.question_tracking_events.push({
      question_id: `q-${i}`,
      question_name: name,
      interactions_count: 20 + Math.round(noise(i + 89) * 90),
    });
  });

  [
    'SOC 2 Type II Report',
    'Penetration Test Summary 2026',
    'Information Security Policy',
    'Data Processing Addendum',
    'Business Continuity Plan',
    'ISO 27001 Certificate',
  ].forEach((name, i) => {
    stats.document_tracking_events.push({
      document_id: `doc-${i}`,
      document_name: name,
      document_interaction_count: 30 + Math.round(noise(i + 97) * 120),
    });
  });

  return stats;
};

/** Shape of `GET /programs/:id/billing_credits` (see billing-credits.tsx). */
export const buildBillingCredits = () => {
  const start = subMonths(new Date(), 4);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  return [
    {
      billing_type: 'Annual Subscription',
      credit_limit: 1200,
      period_start_date: start.toISOString(),
      period_end_date: end.toISOString(),
      product_type: 'Security Questionnaires',
      used_credit_count: 418,
    },
    {
      billing_type: 'Annual Subscription',
      credit_limit: null,
      period_start_date: start.toISOString(),
      period_end_date: end.toISOString(),
      product_type: 'Trust Center',
      used_credit_count: 0,
    },
  ];
};

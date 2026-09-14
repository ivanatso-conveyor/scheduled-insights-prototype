/**
 * Stands in for every page that is not part of the prototype, so the
 * navigation still goes somewhere and says so plainly.
 */
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, BUTTON_SIZE } from '@conveyorhq/arrow-ds';
import { Flex, Heading, Paragraph } from '@conveyorhq/react-components';
import { insightsScheduledUrl } from '@comply/routes';
import { PageLayout } from '../ui/shared/page-layout';

/** "/knowledge-base/questions" becomes "Knowledge base / Questions". */
const titleFromPath = (pathname: string): string => {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return 'Home';
  return parts
    .map((p) => p.replace(/-/g, ' '))
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' / ');
};

export const PlaceholderPage = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const title = titleFromPath(pathname);
  return (
    <PageLayout
      title={title}
      hideBreadcrumbs
      header={{ title, titleClassName: 'text-h2' }}
    >
      <Flex
        className="flex-col items-center gap-y-3 rounded border border-dashed border-gray-400 bg-gray-100 px-8 py-16 text-center"
        data-testid="prototype-placeholder"
      >
        <Heading level="3">Not part of this prototype</Heading>
        <Paragraph className="max-w-lg text-gray-700">
          This build only carries Scheduled Insights. Every other page is a
          stand-in so the navigation still works. The real page lives in the
          product.
        </Paragraph>
        <Button
          size={BUTTON_SIZE.LARGE}
          className="mt-2"
          onClick={() => history.push(insightsScheduledUrl())}
        >
          Go to Insights › Scheduled
        </Button>
      </Flex>
    </PageLayout>
  );
};

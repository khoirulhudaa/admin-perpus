import { APP_CONFIG } from '@/core/configs';
import { Alert, AlertDescription, AlertTitle, lang } from '@/core/libs';
import { CardCounter, DashboardPageLayout } from '@/features/_global';
import { CircleAlert } from 'lucide-react';
import React from 'react';
import { useDashboard } from '../hooks/use-dashboard';

export const SummaryHeaderSection = React.memo(() => {
  const dashboard = useDashboard();

  const renderError = () => {
    if (dashboard.isError) {
      return (
        <Alert variant="destructive" className="mb-4">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>{lang.text('errorTitle')}</AlertTitle>
          <AlertDescription>{lang.text('errorDescription')}</AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  const renderContent = () => {
    return (
      <>
        {dashboard.summaryCardData.map((d, i) => {
          return <CardCounter key={i} {...d} />;
        })}
      </>
    );
  };

  return (
     <DashboardPageLayout
          siteTitle={`${lang.text('schoolDistribution')} | ${APP_CONFIG.appName}`}
          title={lang.text('OverallReport') + '📊'}
        >
        <>
          {/* {renderLoading()} */}
          {renderError()}
          <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {renderContent()}
          </div>
        </>
      </DashboardPageLayout>
  );
});

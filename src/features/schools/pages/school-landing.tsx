import { lang } from '@/core/libs';
import { APP_CONFIG } from '@/core/configs';
import { SchoolTable } from '../containers';
import { DashboardPageLayout } from '@/features/_global';

export const SchoolLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('school')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('school'),
          url: '/schools',
        },
      ]}
      title={lang.text('school')}
    >
      <SchoolTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
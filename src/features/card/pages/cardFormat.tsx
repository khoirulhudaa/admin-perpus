import { lang } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { CardCreationForm } from '../containers';
import { APP_CONFIG } from '@/core/configs';

export const CardPage = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("cardStudentFormat")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('cardStudentFormat'),
          url: '/format/card',
        },
      ]}
      title={lang.text('cardStudentFormat')}
    >
      <CardCreationForm />

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

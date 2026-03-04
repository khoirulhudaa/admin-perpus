import { lang } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { LetterCreationForm } from '../containers';
import { APP_CONFIG } from '@/core/configs';

export const LetterPage = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("letterFormat")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('letterFormat'),
          url: '/format',
        },
      ]}
      title={lang.text('updateLetter')}
    >
      <LetterCreationForm />

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

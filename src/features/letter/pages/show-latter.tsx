import { lang } from '@/core/libs';
import { DashboardPageLayout } from '@/features/_global';
import { LetterPreview } from '../containers/letter-preview';

export const LetterPage = () => {
  return (
    <DashboardPageLayout
      breadcrumbs={[
        {
          label: lang.text('letterFormat'),
          url: '/format',
        },
      ]}
      title={lang.text('updateLetter')}
    >
      <LetterPreview />

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

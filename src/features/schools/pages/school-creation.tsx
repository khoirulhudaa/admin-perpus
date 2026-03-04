import { lang, simpleDecode } from '@/core/libs';
import { APP_CONFIG } from '@/core/configs';
import { SchoolCreationForm } from '../containers';
import { useParams } from 'react-router-dom';
import { DashboardPageLayout } from '@/features/_global';

export const SchoolCreation = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ''),
  );
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('editSchool')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('school'),
          url: '/schools',
        },
        {
          label: lang.text('editSchool'),
          url: `/schools/edit/${params.id}`,
        },
        {
          label: String(decodeParams?.text),
          url: `/schools/edit/${params.id}`,
        },
      ]}
      title={lang.text('editSchool')}
    >
      <SchoolCreationForm />

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

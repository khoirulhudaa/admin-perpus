import { lang, simpleDecode } from '@/core/libs';
import { APP_CONFIG } from '@/core/configs';
import { Navigate, useParams } from 'react-router-dom';
import { AdminCreationForm } from '../containers';
import { DashboardPageLayout } from '@/features/_global';

export const AdminEdit = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ''),
  );

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('editUserAdmin')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('userAdmin'),
          url: '/admin/users',
        },
        {
          label: lang.text('editUserAdmin'),
          url: `/admin/users/edit/${params.id}`,
        },
      ]}
      title={lang.text('editUserAdmin')}
    >
      <AdminCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

import { APP_CONFIG } from '@/core/configs';
import { buttonVariants, cn, lang } from '@/core/libs';
import { DashboardPageLayout, useParamDecode } from '@/features/_global';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { StudentInformation } from '../containers';
import { STUDENT_SUBMENU } from '../utils';

export const StudentDetail = () => {
  const { decodeParams, params } = useParamDecode();

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('studentDetail')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('student'),
          url: '/students',
        },
        {
          label: decodeParams?.text,
          url: `/students/${params.id}`,
        },
      ]}
      title={lang.text('studentDetail')}
      backButton
    >
      <div className="pb-4" />
      <StudentInformation />
      {/* <SubMenuDetail /> */}
      <div className="py-4 mt-6">
        {STUDENT_SUBMENU.map((submenu, index) => {
          return (
            <NavLink
              key={index}
              to={submenu.path}
              end
              className={({ isActive }) => {
                return cn(
                  buttonVariants({ variant: isActive ? 'default' : 'outline' }),
                  'mr-2',
                );
              }}
            >
              {submenu.title}
            </NavLink>
          );
        })}
      </div>
      <Outlet />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

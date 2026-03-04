import { buttonVariants, cn, lang, simpleDecode } from '@/core/libs';
import { APP_CONFIG } from '@/core/configs';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { SchoolInformation } from '@/features/schools';
import { DashboardPageLayout } from '@/features/_global';
import { useMemo } from 'react';

export const SchoolDetail = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ''),
  );

  const submenus = useMemo(
    () => [
      {
        title: lang.text('student'),
        path: '',
      },
      {
        title: lang.text('teacher'),
        path: 'teachers',
      },
      {
        title: lang.text('classroom'),
        path: 'classrooms',
      },
      {
        title: lang.text('course'),
        path: 'courses',
      },
    ],
    [],
  );

  return (
    <DashboardPageLayout
      siteTitle={`${decodeParams?.text} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('school'),
          url: `/schools`,
        },
        {
          label: decodeParams?.text,
          url: `/schools/${params?.id}`,
        },
      ]}
      title={lang.text('schoolDetail')}
    >
      <div className="mb-4" />
      <SchoolInformation id={decodeParams?.id} />
      <div className="py-6 mt-10 border-t border-white/10">
        {submenus.map((submenu) => {
          return (
            <NavLink
              to={submenu.path}
              end
              className={({ isActive }) => {
                return cn(
                  buttonVariants({ variant: isActive ? 'default' : 'outline' }),
                  'mr-2 mr-4',
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

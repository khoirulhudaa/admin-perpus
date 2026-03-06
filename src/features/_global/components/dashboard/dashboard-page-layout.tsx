import { Button, VokadashHead } from '@/core/libs';
import { ChevronLeft } from 'lucide-react';
import React, { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomBreadcrumbs, CustomBreadcrumbsProps } from '../breadcrumbs';
// import { useProfile } from '@/features/profile';
// import { storage } from '@itokun99/secure-storage';
// import { useQueryClient } from "@tanstack/react-query";

export interface DashboardPageLayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
  breadcrumbs?: CustomBreadcrumbsProps['items'];
  siteTitle?: string;
  backButton?: boolean;
  onClickBack?: () => void;
}

export const DashboardPageLayout = React.memo(
  ({
    title,
    description,
    children,
    breadcrumbs = [],
    siteTitle,
    backButton,
    onClickBack,
  }: DashboardPageLayoutProps) => {
    const navigate = useNavigate();

    const handleClickBack = () => {
      if (!onClickBack) return navigate(-1);
      onClickBack?.();
    };

    // const profile = useProfile()
    // console.log('profile', profile)

    // const QueryClient = useQueryClient()

    // useEffect(() => {
    //   if (profile?.user) {
    //     // const allowedRoles = ['admin', 'superAdmin'];
    //     if (!profile.user) {
    //       storage.delete("auth.token");
    //       navigate("/auth/login", { replace: true });
    //     }
    //   }
    // }, [profile?.user]);

    return (
      <>
        {siteTitle && (
          <VokadashHead>
            <title>{siteTitle}</title>
          </VokadashHead>
        )}

        <div className="dashboard-page-layout flex flex-1 flex-col">
          {breadcrumbs?.length > 0 && (
            <div>
              <CustomBreadcrumbs items={breadcrumbs} />
            </div>
          )}
          {children}
        </div>
      </>
    );
  },
);

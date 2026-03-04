import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { GraduationMain } from "../containers";

export const GraduationNewLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('graduation')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text('graduation'),
          url: "/kelulusan",
        },
      ]}
      title={lang.text('graduation')}
    >
      <GraduationMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};

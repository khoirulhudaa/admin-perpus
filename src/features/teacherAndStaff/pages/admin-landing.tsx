import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { FormGuruTendik } from "../containers";

export const GuruTendikLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text('guruTendik')} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("guruTendik"),
          url: "/teacherAndStaff",
        },
      ]}
      title={lang.text("guruTendik")}
    >
      <FormGuruTendik />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};

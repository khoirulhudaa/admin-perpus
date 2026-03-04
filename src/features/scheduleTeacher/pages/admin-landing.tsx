import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { TUMain } from "../containers";

export const TULanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("jadwal")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("jadwal"),
          url: "/schedule-teacher",
        },
      ]}
      title={lang.text("jadwal")}
    >
      <TUMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};

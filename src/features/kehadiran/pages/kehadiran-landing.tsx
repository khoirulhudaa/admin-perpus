import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import AttendanceMain from "../containers/kehadiran-main";

export const AttedanceLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("attendance")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("attendance"),
          url: "/calendar",
        },
      ]}
      title={lang.text("attendance")}
    >
      <AttendanceMain />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};

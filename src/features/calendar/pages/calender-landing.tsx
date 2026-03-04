import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import Kalender from "../containers/calender-main";

export const CalendarLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("kalender")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("kalender"),
          url: "/calendar",
        },
      ]}
      title={lang.text("kalender")}
    >
      <Kalender />
      {/* <div className="pb-16 sm:pb-0" /> */}
    </DashboardPageLayout>
  );
};

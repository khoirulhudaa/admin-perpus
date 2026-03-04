import { APP_CONFIG } from "@/core/configs";
import {
  lang
} from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { StudentLandingTables } from "@/features/student";

export const StudentLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("student")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: lang.text("student"), url: "/students" }]}
      title={lang.text("student")}
    >
      <StudentLandingTables />
    </DashboardPageLayout>
  );
};